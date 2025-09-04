import { supabase } from './supabase';

interface GitServiceConfig {
  repositoryUrl: string;
  accessToken: string;
  defaultBranch: string;
}

interface GitCommit {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  branch: string;
  files_changed: number;
}

interface GitBranch {
  name: string;
  is_current: boolean;
  last_commit: string;
  ahead_count: number;
  behind_count: number;
}

interface FileStatus {
  path: string;
  status: 'modified' | 'added' | 'deleted' | 'untracked';
  staged: boolean;
}

class GitService {
  private config: GitServiceConfig | null = null;
  private userId: string | null = null;

  async initialize(userId: string) {
    this.userId = userId;

    // Load Git settings from Supabase
    const { data: settings } = await supabase
      .from('git_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (settings) {
      this.config = {
        repositoryUrl: settings.repository_url,
        accessToken: settings.access_token,
        defaultBranch: settings.default_branch || 'main',
      };
    } else {
      // Fallback to demo-user if no settings found for current user
      const { data: demoSettings } = await supabase
        .from('git_settings')
        .select('*')
        .eq('user_id', 'demo-user')
        .single();

      if (demoSettings) {
        this.config = {
          repositoryUrl: demoSettings.repository_url,
          accessToken: demoSettings.access_token,
          defaultBranch: demoSettings.default_branch || 'main',
        };
      }
    }
  }

  async updateSettings(settings: Partial<GitServiceConfig>) {
    if (!this.userId) throw new Error('GitService not initialized');

    const { data, error } = await supabase
      .from('git_settings')
      .upsert({
        user_id: this.userId,
        repository_url: settings.repositoryUrl,
        access_token: settings.accessToken,
        default_branch: settings.defaultBranch || 'main',
      })
      .select()
      .single();

    if (data) {
      this.config = {
        repositoryUrl: data.repository_url,
        accessToken: data.access_token,
        defaultBranch: data.default_branch,
      };
    }

    return { data, error };
  }

  private async makeGitApiRequest(endpoint: string, options: RequestInit = {}) {
    if (!this.config?.accessToken) {
      throw new Error('Git access token not configured');
    }

    const baseUrl = this.getApiBaseUrl();
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Git API request failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  private getApiBaseUrl(): string {
    if (!this.config?.repositoryUrl) {
      throw new Error('Repository URL not configured');
    }

    // Extract API base URL from repository URL
    const url = new URL(this.config.repositoryUrl);

    if (url.hostname === 'github.com') {
      return 'https://api.github.com';
    } else if (url.hostname === 'gitlab.com') {
      return 'https://gitlab.com/api/v4';
    } else {
      // For self-hosted GitLab
      return `${url.protocol}//${url.hostname}/api/v4`;
    }
  }

  private getRepositoryPath(): string {
    if (!this.config?.repositoryUrl) {
      throw new Error('Repository URL not configured');
    }

    const url = new URL(this.config.repositoryUrl);
    const path = url.pathname.replace(/\.git$/, '');

    if (url.hostname === 'github.com') {
      return path;
    } else {
      // For GitLab, we need to encode the path
      return encodeURIComponent(path);
    }
  }

  async syncWithRemote() {
    if (!this.userId) throw new Error('GitService not initialized');

    try {
      // Get commits from remote repository
      const commits = await this.getRemoteCommits();

      // Sync commits to Supabase
      for (const commit of commits) {
        await supabase.from('commits').upsert(
          {
            user_id: this.userId,
            message: commit.message,
            author: commit.author,
            timestamp: commit.timestamp,
            branch: commit.branch,
            files_changed: commit.files_changed,
            commit_hash: commit.id,
          },
          { onConflict: 'commit_hash' }
        );
      }

      // Get branches from remote repository
      const branches = await this.getRemoteBranches();

      // Sync branches to Supabase
      for (const branch of branches) {
        await supabase.from('branches').upsert(
          {
            user_id: this.userId,
            name: branch.name,
            is_current: branch.is_current,
            last_commit: branch.last_commit,
            ahead_count: branch.ahead_count,
            behind_count: branch.behind_count,
          },
          { onConflict: 'name' }
        );
      }

      return { success: true };
    } catch (error) {
      console.error('Error syncing with remote:', error);
      return { success: false, error };
    }
  }

  private async getRemoteCommits(): Promise<GitCommit[]> {
    const repoPath = this.getRepositoryPath();
    const endpoint =
      url.hostname === 'github.com'
        ? `/repos${repoPath}/commits`
        : `/projects${repoPath}/repository/commits`;

    const commits = await this.makeGitApiRequest(endpoint);

    return commits.map((commit: any) => ({
      id: commit.sha || commit.id,
      message: commit.commit?.message || commit.message,
      author: commit.commit?.author?.name || commit.author_name,
      timestamp: commit.commit?.author?.date || commit.created_at,
      branch: this.config?.defaultBranch || 'main',
      files_changed: commit.stats?.total || 0,
    }));
  }

  private async getRemoteBranches(): Promise<GitBranch[]> {
    const repoPath = this.getRepositoryPath();
    const endpoint =
      url.hostname === 'github.com'
        ? `/repos${repoPath}/branches`
        : `/projects${repoPath}/repository/branches`;

    const branches = await this.makeGitApiRequest(endpoint);

    return branches.map((branch: any) => ({
      name: branch.name,
      is_current: branch.name === this.config?.defaultBranch,
      last_commit: branch.commit?.sha || branch.commit?.id,
      ahead_count: 0, // Would need additional API calls to calculate
      behind_count: 0,
    }));
  }

  async createRemoteCommit(message: string, files: FileStatus[]) {
    if (!this.userId) throw new Error('GitService not initialized');

    try {
      const repoPath = this.getRepositoryPath();
      const endpoint =
        url.hostname === 'github.com'
          ? `/repos${repoPath}/git/commits`
          : `/projects${repoPath}/repository/commits`;

      // Get the current tree SHA
      const currentTree = await this.getCurrentTree();

      // Create new tree with updated files
      const newTree = await this.createTree(files, currentTree);

      // Create commit
      const commitData = {
        message,
        tree: newTree.sha,
        parents: [currentTree.commit_sha],
      };

      const commit = await this.makeGitApiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(commitData),
      });

      // Update Supabase with the new commit
      await supabase.from('commits').insert({
        user_id: this.userId,
        message: commit.message,
        author: commit.author?.name || 'Current User',
        timestamp: commit.author?.date || new Date().toISOString(),
        branch: this.config?.defaultBranch || 'main',
        files_changed: files.length,
        commit_hash: commit.sha,
      });

      return { success: true, commit };
    } catch (error) {
      console.error('Error creating remote commit:', error);
      return { success: false, error };
    }
  }

  private async getCurrentTree() {
    const repoPath = this.getRepositoryPath();
    const endpoint =
      url.hostname === 'github.com'
        ? `/repos${repoPath}/git/ref/heads/${this.config?.defaultBranch}`
        : `/projects${repoPath}/repository/branches/${this.config?.defaultBranch}`;

    const ref = await this.makeGitApiRequest(endpoint);

    return {
      commit_sha: ref.object?.sha || ref.commit?.id,
      tree_sha: ref.object?.sha || ref.commit?.id,
    };
  }

  private async createTree(files: FileStatus[], currentTree: any) {
    const repoPath = this.getRepositoryPath();
    const endpoint =
      url.hostname === 'github.com'
        ? `/repos${repoPath}/git/trees`
        : `/projects${repoPath}/repository/trees`;

    // This is a simplified implementation
    // In a real scenario, you'd need to handle file content and proper tree structure
    const treeData = {
      base_tree: currentTree.tree_sha,
      tree: files.map(file => ({
        path: file.path,
        mode: '100644',
        type: 'blob',
        content: '', // Would need actual file content
      })),
    };

    return await this.makeGitApiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(treeData),
    });
  }

  async createRemoteBranch(branchName: string, sourceBranch: string = 'main') {
    if (!this.userId) throw new Error('GitService not initialized');

    try {
      const repoPath = this.getRepositoryPath();
      const endpoint =
        url.hostname === 'github.com'
          ? `/repos${repoPath}/git/refs`
          : `/projects${repoPath}/repository/branches`;

      // Get the SHA of the source branch
      const sourceRef = await this.getCurrentTree();

      const branchData =
        url.hostname === 'github.com'
          ? {
              ref: `refs/heads/${branchName}`,
              sha: sourceRef.commit_sha,
            }
          : {
              branch: branchName,
              ref: sourceBranch,
            };

      const branch = await this.makeGitApiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(branchData),
      });

      // Update Supabase with the new branch
      await supabase.from('branches').insert({
        user_id: this.userId,
        name: branchName,
        is_current: false,
        last_commit: sourceRef.commit_sha,
        ahead_count: 0,
        behind_count: 0,
      });

      return { success: true, branch };
    } catch (error) {
      console.error('Error creating remote branch:', error);
      return { success: false, error };
    }
  }

  async pushToRemote() {
    if (!this.userId) throw new Error('GitService not initialized');

    try {
      // Get uncommitted changes from Supabase
      const { data: uncommittedFiles } = await supabase
        .from('file_status')
        .select('*')
        .eq('user_id', this.userId)
        .eq('staged', true);

      if (uncommittedFiles && uncommittedFiles.length > 0) {
        // Create commit with staged files
        const message = `Auto-commit: ${uncommittedFiles.length} files updated`;
        const result = await this.createRemoteCommit(message, uncommittedFiles);

        if (result.success) {
          // Mark files as committed in Supabase
          await supabase
            .from('file_status')
            .update({ status: 'committed', staged: false })
            .eq('user_id', this.userId)
            .in(
              'path',
              uncommittedFiles.map(f => f.path)
            );
        }

        return result;
      }

      return { success: true, message: 'No changes to push' };
    } catch (error) {
      console.error('Error pushing to remote:', error);
      return { success: false, error };
    }
  }
}

export const gitService = new GitService();
