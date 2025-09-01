import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  GitMerge, 
  FileText, 
  RefreshCw, 
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  Settings,
  Upload
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { gitService } from '../../lib/git-service';

interface GitManagementProps {
  onBack: () => void;
}

interface Commit {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  branch: string;
  files_changed: number;
}

interface Branch {
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

export const GitManagement: React.FC<GitManagementProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'commits' | 'branches' | 'files'>('overview');
  const [commits, setCommits] = useState<Commit[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [fileStatus, setFileStatus] = useState<FileStatus[]>([]);
  const [currentBranch, setCurrentBranch] = useState('main');
  const [loading, setLoading] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [gitSettings, setGitSettings] = useState({
    repositoryUrl: '',
    accessToken: '',
    defaultBranch: 'main'
  });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadGitData();
    loadGitSettings();
  }, []);

  const loadGitSettings = async () => {
    try {
      // Try to load settings for current user first
      let { data: settings } = await supabase
        .from('git_settings')
        .select('*')
        .single();

      // If no settings found, try demo-user
      if (!settings) {
        const { data: demoSettings } = await supabase
          .from('git_settings')
          .select('*')
          .eq('user_id', 'demo-user')
          .single();
        settings = demoSettings;
      }

      if (settings) {
        setGitSettings({
          repositoryUrl: settings.repository_url || '',
          accessToken: settings.access_token || '',
          defaultBranch: settings.default_branch || 'main'
        });
      }
    } catch (error) {
      console.error('Error loading Git settings:', error);
    }
  };

  const loadGitData = async () => {
    setLoading(true);
    try {
      // Load commits from Supabase
      const { data: commitsData } = await supabase
        .from('commits')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(20);

      if (commitsData) {
        setCommits(commitsData);
      } else {
        // Load demo data if no commits exist
        loadDemoData();
      }

      // Load branches from Supabase
      const { data: branchesData } = await supabase
        .from('branches')
        .select('*')
        .order('name');

      if (branchesData) {
        setBranches(branchesData);
        const current = branchesData.find(b => b.is_current);
        if (current) {
          setCurrentBranch(current.name);
        }
      }

      // Load file status from Supabase
      const { data: filesData } = await supabase
        .from('file_status')
        .select('*')
        .eq('branch', currentBranch);

      if (filesData) {
        setFileStatus(filesData);
      } else {
        // Load demo file status if none exist
        loadDemoFileStatus();
      }
    } catch (error) {
      console.error('Error loading Git data:', error);
      // Load demo data on error
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    // Demo commits
    const demoCommits: Commit[] = [
      {
        id: '1',
        message: 'Initial commit - PWA setup with Git integration',
        author: 'Developer',
        timestamp: new Date().toISOString(),
        branch: 'main',
        files_changed: 15
      },
      {
        id: '2',
        message: 'Add Git Management component and Supabase integration',
        author: 'Developer',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        branch: 'main',
        files_changed: 8
      },
      {
        id: '3',
        message: 'Implement real-time file sync with Supabase',
        author: 'Developer',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        branch: 'main',
        files_changed: 12
      }
    ];

    // Demo branches
    const demoBranches: Branch[] = [
      {
        name: 'main',
        is_current: true,
        last_commit: '1',
        ahead_count: 0,
        behind_count: 0
      },
      {
        name: 'feature/git-integration',
        is_current: false,
        last_commit: '2',
        ahead_count: 3,
        behind_count: 0
      },
      {
        name: 'develop',
        is_current: false,
        last_commit: '3',
        ahead_count: 1,
        behind_count: 2
      }
    ];

    setCommits(demoCommits);
    setBranches(demoBranches);
  };

  const loadDemoFileStatus = () => {
    const demoFileStatus: FileStatus[] = [
      {
        path: 'src/pages/developer-tools/GitManagement.tsx',
        status: 'modified',
        staged: true
      },
      {
        path: 'src/lib/git-service.ts',
        status: 'added',
        staged: false
      },
      {
        path: 'supabase/migrations/20250901030000_git_management.sql',
        status: 'added',
        staged: true
      },
      {
        path: 'public/manifest.json',
        status: 'modified',
        staged: false
      },
      {
        path: 'src/components/layout/Sidebar.tsx',
        status: 'modified',
        staged: false
      }
    ];

    setFileStatus(demoFileStatus);
  };

  const createCommit = async () => {
    if (!commitMessage.trim()) return;

    setLoading(true);
    try {
      const newCommit = {
        message: commitMessage,
        author: 'Current User', // This would come from user context
        branch: currentBranch,
        timestamp: new Date().toISOString(),
        files_changed: fileStatus.filter(f => f.staged).length
      };

      const { data, error } = await supabase
        .from('commits')
        .insert(newCommit)
        .select()
        .single();

      if (data) {
        setCommits([data, ...commits]);
        setCommitMessage('');
        // Mark staged files as committed
        const stagedFiles = fileStatus.filter(f => f.staged).map(f => f.path);
        if (stagedFiles.length > 0) {
          await supabase
            .from('file_status')
            .update({ status: 'committed', staged: false })
            .in('path', stagedFiles);
        }
        loadGitData();
      }
    } catch (error) {
      console.error('Error creating commit:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBranch = async () => {
    if (!newBranchName.trim()) return;

    setLoading(true);
    try {
      const newBranch = {
        name: newBranchName,
        is_current: false,
        last_commit: commits[0]?.id || '',
        ahead_count: 0,
        behind_count: 0
      };

      const { data, error } = await supabase
        .from('branches')
        .insert(newBranch)
        .select()
        .single();

      if (data) {
        setBranches([...branches, data]);
        setNewBranchName('');
        loadGitData();
      }
    } catch (error) {
      console.error('Error creating branch:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchBranch = async (branchName: string) => {
    setLoading(true);
    try {
      // Update current branch in Supabase
      await supabase
        .from('branches')
        .update({ is_current: false })
        .eq('is_current', true);

      await supabase
        .from('branches')
        .update({ is_current: true })
        .eq('name', branchName);

      setCurrentBranch(branchName);
      loadGitData();
    } catch (error) {
      console.error('Error switching branch:', error);
    } finally {
      setLoading(false);
    }
  };

  const stageFile = async (filePath: string) => {
    try {
      await supabase
        .from('file_status')
        .update({ staged: true })
        .eq('path', filePath);

      setFileStatus(prev => 
        prev.map(f => 
          f.path === filePath ? { ...f, staged: true } : f
        )
      );
    } catch (error) {
      console.error('Error staging file:', error);
    }
  };

  const syncWithRemote = async () => {
    setLoading(true);
    try {
      await gitService.initialize('current-user-id'); // This should come from auth context
      const result = await gitService.syncWithRemote();
      
      if (result.success) {
        loadGitData();
      } else {
        console.error('Sync failed:', result.error);
      }
    } catch (error) {
      console.error('Error syncing with remote:', error);
    } finally {
      setLoading(false);
    }
  };

  const pushToRemote = async () => {
    setLoading(true);
    try {
      await gitService.initialize('current-user-id'); // This should come from auth context
      const result = await gitService.pushToRemote();
      
      if (result.success) {
        loadGitData();
      } else {
        console.error('Push failed:', result.error);
      }
    } catch (error) {
      console.error('Error pushing to remote:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveGitSettings = async () => {
    setLoading(true);
    try {
      await gitService.initialize('current-user-id'); // This should come from auth context
      await gitService.updateSettings(gitSettings);
      setShowSettings(false);
    } catch (error) {
      console.error('Error saving Git settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: GitBranch },
    { id: 'commits', label: 'Commits', icon: GitCommit },
    { id: 'branches', label: 'Branches', icon: GitPullRequest },
    { id: 'files', label: 'Files', icon: FileText }
  ];

  return (
    <div className="h-full bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Git Management</h1>
            <p className="text-gray-400">Manage your codebase version control</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button
            onClick={syncWithRemote}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <GitPullRequest className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
          <button
            onClick={pushToRemote}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <Upload className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Push</span>
          </button>
          <button
            onClick={loadGitData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Current Branch Info */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GitBranch className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">Current Branch:</span>
            <span className="font-mono text-blue-400">{currentBranch}</span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>{fileStatus.filter(f => f.staged).length} staged</span>
            <span>{fileStatus.filter(f => !f.staged && f.status !== 'committed').length} unstaged</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Recent Commits */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <GitCommit className="w-5 h-5 text-green-400" />
                <span>Recent Commits</span>
              </h3>
              <div className="space-y-3">
                {commits.slice(0, 5).map(commit => (
                  <div key={commit.id} className="text-sm">
                    <div className="font-medium text-white">{commit.message}</div>
                    <div className="text-gray-400">{commit.author} • {new Date(commit.timestamp).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Branches */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <GitBranch className="w-5 h-5 text-blue-400" />
                <span>Branches</span>
              </h3>
              <div className="space-y-2">
                {branches.map(branch => (
                  <div key={branch.name} className="flex items-center justify-between text-sm">
                    <span className={branch.is_current ? 'text-blue-400 font-medium' : 'text-gray-300'}>
                      {branch.name}
                    </span>
                    {branch.is_current && <CheckCircle className="w-4 h-4 text-green-400" />}
                  </div>
                ))}
              </div>
            </div>

            {/* File Status */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-yellow-400" />
                <span>File Status</span>
              </h3>
              <div className="space-y-2">
                {fileStatus.slice(0, 5).map(file => (
                  <div key={file.path} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300 truncate">{file.path}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      file.status === 'modified' ? 'bg-yellow-600' :
                      file.status === 'added' ? 'bg-green-600' :
                      file.status === 'deleted' ? 'bg-red-600' : 'bg-gray-600'
                    }`}>
                      {file.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'commits' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Create Commit */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Create Commit</h3>
              <div className="space-y-4">
                <textarea
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="Enter commit message..."
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none"
                  rows={3}
                />
                <button
                  onClick={createCommit}
                  disabled={!commitMessage.trim() || loading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  Create Commit
                </button>
              </div>
            </div>

            {/* Commits List */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Commit History</h3>
              <div className="space-y-4">
                {commits.map(commit => (
                  <div key={commit.id} className="border-b border-gray-700 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-white">{commit.message}</div>
                      <div className="text-sm text-gray-400">{new Date(commit.timestamp).toLocaleString()}</div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{commit.author}</span>
                      <span>•</span>
                      <span>{commit.branch}</span>
                      <span>•</span>
                      <span>{commit.files_changed} files changed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'branches' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Create Branch */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Create Branch</h3>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  placeholder="Branch name..."
                  className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
                <button
                  onClick={createBranch}
                  disabled={!newBranchName.trim() || loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  Create Branch
                </button>
              </div>
            </div>

            {/* Branches List */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Branches</h3>
              <div className="space-y-3">
                {branches.map(branch => (
                  <div key={branch.name} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <GitBranch className="w-4 h-4 text-blue-400" />
                      <span className={branch.is_current ? 'text-blue-400 font-medium' : 'text-white'}>
                        {branch.name}
                      </span>
                      {branch.is_current && <span className="text-xs bg-blue-600 px-2 py-1 rounded">current</span>}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-400">
                        {branch.ahead_count > 0 && <span className="text-green-400">+{branch.ahead_count}</span>}
                        {branch.behind_count > 0 && <span className="text-red-400">-{branch.behind_count}</span>}
                      </div>
                      {!branch.is_current && (
                        <button
                          onClick={() => switchBranch(branch.name)}
                          className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm transition-colors"
                        >
                          Switch
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'files' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* File Status */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">File Status</h3>
              <div className="space-y-3">
                {fileStatus.map(file => (
                  <div key={file.path} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        file.status === 'modified' ? 'bg-yellow-400' :
                        file.status === 'added' ? 'bg-green-400' :
                        file.status === 'deleted' ? 'bg-red-400' : 'bg-gray-400'
                      }`} />
                      <span className="text-white font-mono text-sm">{file.path}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        file.status === 'modified' ? 'bg-yellow-600' :
                        file.status === 'added' ? 'bg-green-600' :
                        file.status === 'deleted' ? 'bg-red-600' : 'bg-gray-600'
                      }`}>
                        {file.status}
                      </span>
                      {!file.staged && file.status !== 'committed' && (
                        <button
                          onClick={() => stageFile(file.path)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
                        >
                          Stage
                        </button>
                      )}
                      {file.staged && (
                        <span className="text-green-400 text-sm">✓ Staged</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Git Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold mb-4">Git Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Repository URL
                </label>
                <input
                  type="text"
                  value={gitSettings.repositoryUrl}
                  onChange={(e) => setGitSettings(prev => ({ ...prev, repositoryUrl: e.target.value }))}
                  placeholder="https://github.com/username/repo.git"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Access Token
                </label>
                <input
                  type="password"
                  value={gitSettings.accessToken}
                  onChange={(e) => setGitSettings(prev => ({ ...prev, accessToken: e.target.value }))}
                  placeholder="GitHub/GitLab access token"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Branch
                </label>
                <input
                  type="text"
                  value={gitSettings.defaultBranch}
                  onChange={(e) => setGitSettings(prev => ({ ...prev, defaultBranch: e.target.value }))}
                  placeholder="main"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveGitSettings}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
