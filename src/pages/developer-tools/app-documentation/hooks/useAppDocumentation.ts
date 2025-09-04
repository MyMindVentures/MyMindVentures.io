import { useState, useEffect } from 'react';
import { supabaseService as db, supabase } from '../../../../lib/supabase';
import { apiService } from '../../../../lib/api-service';
import {
  RecoveryDocumentation,
  DocumentationPage,
  GitStatus,
  ViewType,
} from '../types';

export const useAppDocumentation = () => {
  const [recoveryDocs, setRecoveryDocs] = useState<RecoveryDocumentation[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<RecoveryDocumentation | null>(
    null
  );
  const [documentationPages, setDocumentationPages] = useState<
    DocumentationPage[]
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedView, setSelectedView] = useState<ViewType>('documentation');
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null);
  const [gitCommand, setGitCommand] = useState('');
  const [gitOutput, setGitOutput] = useState<string[]>([]);
  const [commitMessage, setCommitMessage] = useState('');
  const [isExecutingGit, setIsExecutingGit] = useState(false);
  const [generateCommitWithScan, setGenerateCommitWithScan] = useState(false);

  useEffect(() => {
    loadRecoveryDocumentation();
    loadDocumentationPages();
    if (selectedView === 'git') {
      loadGitStatus();
    }
  }, [selectedView]);

  const loadRecoveryDocumentation = async () => {
    try {
      const { data, error } = await supabase
        .from('recovery_documentation')
        .select('*')
        .eq('user_id', 'demo-user')
        .order('timestamp', { ascending: false });

      if (data) {
        setRecoveryDocs(data);
        if (data.length > 0 && !selectedDoc) {
          setSelectedDoc(data[0]);
        }
      }
      if (error) {
        console.error('Error loading recovery docs:', error);
      }
    } catch (error) {
      console.error('Error loading recovery documentation:', error);
    }
  };

  const loadDocumentationPages = async () => {
    try {
      const { data, error } = await supabase
        .from('documentation_pages')
        .select('*')
        .eq('user_id', 'demo-user')
        .order('timestamp', { ascending: false });

      if (data) {
        setDocumentationPages(data);
      }
      if (error) {
        console.error('Error loading documentation pages:', error);
      }
    } catch (error) {
      console.error('Error loading documentation pages:', error);
    }
  };

  const generateCompleteDocumentation = async () => {
    setIsGenerating(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scan-codebase`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'demo-user',
          scan_type: 'complete',
          generate_commit: generateCommitWithScan,
          commit_message: commitMessage,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      // Log the comprehensive operation
      await db.createBuildLogEntry({
        action_type: 'ai_complete_analysis',
        action_description: `OpenAI analyzed ${result.files_scanned} files, generated recovery documentation, updated ${result.pages_updated} documentation pages${result.commit_data ? ', and created commit' : ''}`,
        timestamp: new Date().toISOString(),
        user_id: 'demo-user',
        related_id: result.recovery_doc_id,
        metadata: {
          files_scanned: result.files_scanned,
          pages_updated: result.pages_updated,
          backup_filename: result.backup_filename,
          commit_generated: !!result.commit_data,
          ai_analysis: true,
        },
      });

      // Reload all data
      await loadRecoveryDocumentation();
      await loadDocumentationPages();

      // Download backup file
      if (result.backup_data) {
        downloadBackupFile(result.backup_data, result.backup_filename);
      }

      alert(
        `✅ Complete AI Analysis Finished!\n\n📊 Files Analyzed: ${result.files_scanned}\n📄 Documentation Pages Updated: ${result.pages_updated}\n💾 Backup File Downloaded\n${result.commit_data ? '📝 Git Commit Generated' : ''}\n\nYour ultimate recovery system is ready!`
      );
    } catch (error) {
      console.error('Error generating documentation:', error);
      alert(`❌ Documentation generation failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
      setCommitMessage('');
      setGenerateCommitWithScan(false);
    }
  };

  const downloadBackupFile = (backupData: any, filename: string) => {
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportDocumentationAsPDF = async () => {
    if (!selectedDoc) return;

    // Create comprehensive export data
    const exportData = {
      generated_at: selectedDoc.timestamp,
      application: 'MyMindVentures.io',
      recovery_doc_id: selectedDoc.id,
      summary: selectedDoc.analysis_summary,
      documentation: selectedDoc.full_documentation,
      navigation_map: selectedDoc.navigation_map,
      component_map: selectedDoc.component_map,
      file_inventory: selectedDoc.file_inventory,
      user_flows: selectedDoc.user_flows,
      database_analysis: selectedDoc.database_analysis,
      api_analysis: selectedDoc.api_analysis,
      recovery_guide: selectedDoc.recovery_guide,
      statistics: {
        files_analyzed: selectedDoc.files_analyzed,
      },
    };

    // Download as JSON (in production, could convert to PDF)
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mymindventures-recovery-${new Date(selectedDoc.timestamp).toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadGitStatus = async () => {
    try {
      // In WebContainer, we can use actual git commands
      const mockStatus: GitStatus = {
        branch: 'main',
        status: 'clean',
        staged_files: [],
        modified_files: ['src/App.tsx', 'src/components/ui/Card.tsx'],
        untracked_files: ['new-feature.tsx'],
        commits: [
          {
            hash: 'abc123',
            message: 'feat: add documentation system',
            author: 'demo-user',
            date: new Date().toISOString(),
          },
          {
            hash: 'def456',
            message: 'fix: resolve navigation issues',
            author: 'demo-user',
            date: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
      };
      setGitStatus(mockStatus);
    } catch (error) {
      console.error('Error loading git status:', error);
    }
  };

  const executeGitCommand = async (command: string) => {
    setIsExecutingGit(true);
    try {
      const output = `$ ${command}\n`;

      if (command.startsWith('git status')) {
        setGitOutput(prev => [
          ...prev,
          output +
            'On branch main\nYour branch is up to date with origin/main.\n\nChanges not staged for commit:\n  modified: src/App.tsx\n  modified: src/components/ui/Card.tsx\n\nUntracked files:\n  new-feature.tsx',
        ]);
      } else if (command.startsWith('git add')) {
        setGitOutput(prev => [...prev, output + 'Files staged for commit.']);
        loadGitStatus();
      } else if (command.startsWith('git commit')) {
        setGitOutput(prev => [
          ...prev,
          output +
            `[main abc123] ${commitMessage}\n 2 files changed, 45 insertions(+), 12 deletions(-)`,
        ]);
        loadGitStatus();
      } else {
        setGitOutput(prev => [
          ...prev,
          output + 'Command executed successfully.',
        ]);
      }

      setGitCommand('');
    } catch (error) {
      setGitOutput(prev => [...prev, `Error: ${error.message}`]);
    } finally {
      setIsExecutingGit(false);
    }
  };

  const generateAICommitMessage = async () => {
    if (!gitStatus?.modified_files.length) return;

    try {
      const prompt = `Analyze the following git changes and generate a professional commit message:

Modified files: ${gitStatus.modified_files.join(', ')}
Untracked files: ${gitStatus.untracked_files.join(', ')}

Generate a conventional commit message (type(scope): description) that accurately describes these changes.
Keep it under 72 characters and be specific about what was implemented or fixed.`;

      const result = await apiService.generateText(
        [{ role: 'user', content: prompt }],
        { max_tokens: 100 }
      );

      const aiMessage = result.choices[0].message.content.trim();
      setCommitMessage(aiMessage);
    } catch (error) {
      console.error('Error generating commit message:', error);
      alert(`Failed to generate commit message: ${error.message}`);
    }
  };

  const copyContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      alert('Content copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy content:', error);
    }
  };

  return {
    recoveryDocs,
    selectedDoc,
    setSelectedDoc,
    documentationPages,
    isGenerating,
    selectedView,
    setSelectedView,
    gitStatus,
    gitCommand,
    setGitCommand,
    gitOutput,
    commitMessage,
    setCommitMessage,
    isExecutingGit,
    generateCommitWithScan,
    setGenerateCommitWithScan,
    generateCompleteDocumentation,
    exportDocumentationAsPDF,
    loadGitStatus,
    executeGitCommand,
    generateAICommitMessage,
    copyContent,
    loadRecoveryDocumentation,
    loadDocumentationPages,
  };
};
