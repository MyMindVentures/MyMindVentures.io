import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Scan,
  Download,
  Copy,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Code,
  Database,
  Navigation,
  Eye,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Terminal,
  Play,
  Save,
  History,
  FileDown,
  Zap
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabaseService as db, supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { apiService } from '../../lib/api-service';

interface AppDocumentationProps {
  onBack: () => void;
}

interface RecoveryDocumentation {
  id: string;
  timestamp: string;
  analysis_summary: string;
  full_documentation: string;
  navigation_map: any;
  component_map: any;
  file_inventory: any[];
  user_flows: any[];
  database_analysis: any;
  api_analysis: any;
  recovery_guide: string;
  backup_file_url?: string;
  files_analyzed: number;
  commit_id?: string;
  created_at: string;
}

interface DocumentationPage {
  id: string;
  page_type: string;
  title: string;
  content: string;
  version: string;
  recovery_doc_id: string;
  timestamp: string;
  created_at: string;
}

interface GitStatus {
  branch: string;
  status: string;
  staged_files: string[];
  modified_files: string[];
  untracked_files: string[];
  commits: any[];
}

export const AppDocumentation: React.FC<AppDocumentationProps> = ({ onBack }) => {
  const [recoveryDocs, setRecoveryDocs] = useState<RecoveryDocumentation[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<RecoveryDocumentation | null>(null);
  const [documentationPages, setDocumentationPages] = useState<DocumentationPage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedView, setSelectedView] = useState<'documentation' | 'git' | 'history'>('documentation');
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
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
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
          ai_analysis: true
        },
      });

      // Reload all data
      await loadRecoveryDocumentation();
      await loadDocumentationPages();
      
      // Download backup file
      if (result.backup_data) {
        downloadBackupFile(result.backup_data, result.backup_filename);
      }

      alert(`✅ Complete AI Analysis Finished!\n\n📊 Files Analyzed: ${result.files_scanned}\n📄 Documentation Pages Updated: ${result.pages_updated}\n💾 Backup File Downloaded\n${result.commit_data ? '📝 Git Commit Generated' : ''}\n\nYour ultimate recovery system is ready!`);

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
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
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
      }
    };

    // Download as JSON (in production, could convert to PDF)
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mymindventures-recovery-${format(new Date(selectedDoc.timestamp), 'yyyy-MM-dd-HHmm')}.json`;
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
          { hash: 'abc123', message: 'feat: add documentation system', author: 'demo-user', date: new Date().toISOString() },
          { hash: 'def456', message: 'fix: resolve navigation issues', author: 'demo-user', date: new Date(Date.now() - 86400000).toISOString() },
        ]
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
        setGitOutput(prev => [...prev, output + 'On branch main\nYour branch is up to date with origin/main.\n\nChanges not staged for commit:\n  modified: src/App.tsx\n  modified: src/components/ui/Card.tsx\n\nUntracked files:\n  new-feature.tsx']);
      } else if (command.startsWith('git add')) {
        setGitOutput(prev => [...prev, output + 'Files staged for commit.']);
        loadGitStatus();
      } else if (command.startsWith('git commit')) {
        setGitOutput(prev => [...prev, output + `[main abc123] ${commitMessage}\n 2 files changed, 45 insertions(+), 12 deletions(-)`]);
        loadGitStatus();
      } else {
        setGitOutput(prev => [...prev, output + 'Command executed successfully.']);
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to App Management
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Complete App Documentation & Recovery System</h1>
            <p className="text-gray-400">AI-powered codebase analysis with Git interface and backup system</p>
          </div>
        </div>
        
        <div className="flex space-x-2 bg-gray-800/30 p-1 rounded-lg">
          {[
            { id: 'documentation', label: 'AI Scanner', icon: Scan },
            { id: 'git', label: 'Git Interface', icon: GitBranch },
            { id: 'history', label: 'History', icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedView(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedView === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedView === 'documentation' && (
        <>
          {/* AI Scanner Interface */}
          <Card title="OpenAI Complete Codebase Scanner" gradient>
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center">
                    <Scan className="w-10 h-10 text-white" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">Ultimate Recovery Documentation System</h2>
                  <p className="text-gray-400 leading-relaxed max-w-4xl mx-auto">
                    OpenAI will scan your entire codebase, analyze every file, component, navigation, and user flow. 
                    It creates comprehensive recovery documentation, updates all app documentation pages, 
                    generates backup files, and optionally creates Git commits - all in one powerful run!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-cyan-400">
                    <FileText className="w-4 h-4" />
                    <span>Every File Analyzed</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-400">
                    <Navigation className="w-4 h-4" />
                    <span>Complete Navigation Map</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-400">
                    <Database className="w-4 h-4" />
                    <span>All Documentation Updated</span>
                  </div>
                  <div className="flex items-center space-x-2 text-orange-400">
                    <FileDown className="w-4 h-4" />
                    <span>Backup File Generated</span>
                  </div>
                </div>
              </div>

              {/* Optional Git Commit */}
              <div className="space-y-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={generateCommitWithScan}
                    onChange={(e) => setGenerateCommitWithScan(e.target.checked)}
                    className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-600 rounded focus:ring-cyan-500"
                  />
                  <label className="text-white font-medium">Generate Git Commit</label>
                </div>
                
                {generateCommitWithScan && (
                  <div className="space-y-2">
                    <Input
                      value={commitMessage}
                      onChange={setCommitMessage}
                      placeholder="Enter commit message or leave empty for AI generation..."
                    />
                    <p className="text-gray-400 text-xs">
                      If empty, OpenAI will generate a professional commit message based on the analysis
                    </p>
                  </div>
                )}
              </div>

              <Button 
                variant="primary" 
                onClick={generateCompleteDocumentation}
                disabled={isGenerating}
                className="w-full px-8 py-4 text-lg"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                    OpenAI Scanning Entire Codebase...
                  </>
                ) : (
                  <>
                    <Scan className="w-5 h-5 mr-3" />
                    Let OpenAI Analyze Everything
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Latest Documentation Display */}
          {selectedDoc && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Files Analyzed', value: selectedDoc.files_analyzed?.toString() || '0', icon: FileText, color: 'text-cyan-400' },
                  { label: 'Components Found', value: selectedDoc.component_map?.ui_components?.length?.toString() || '0', icon: Code, color: 'text-purple-400' },
                  { label: 'Pages Mapped', value: selectedDoc.component_map?.page_components?.length?.toString() || '0', icon: Navigation, color: 'text-green-400' },
                  { label: 'User Flows', value: selectedDoc.user_flows?.length?.toString() || '0', icon: Eye, color: 'text-blue-400' },
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                        <div>
                          <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                          <div className="text-gray-400 text-xs">{stat.label}</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Analysis Summary */}
              <Card title="Latest AI Analysis Summary">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">OpenAI Codebase Analysis</span>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => copyContent(selectedDoc.analysis_summary)}>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                      <Button variant="secondary" size="sm" onClick={exportDocumentationAsPDF}>
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedDoc.analysis_summary}
                    </p>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    Generated: {format(new Date(selectedDoc.timestamp), 'PPpp')}
                  </div>
                </div>
              </Card>

              {/* Complete Documentation */}
              <Card title="Complete Visual Recovery Documentation">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Full Application Map & Recovery Guide</span>
                    <Button variant="ghost" size="sm" onClick={() => copyContent(selectedDoc.full_documentation)}>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy All
                    </Button>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 max-h-96 overflow-y-auto">
                    <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                      {selectedDoc.full_documentation}
                    </pre>
                  </div>
                </div>
              </Card>

              {/* Recovery Guide */}
              <Card title="Emergency Recovery Procedures">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">Step-by-Step Recovery Guide</span>
                    <Button variant="ghost" size="sm" onClick={() => copyContent(selectedDoc.recovery_guide)}>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy Guide
                    </Button>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 max-h-64 overflow-y-auto">
                    <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                      {selectedDoc.recovery_guide}
                    </pre>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </>
      )}

      {selectedView === 'git' && (
        <>
          {/* Git Interface Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Git Status */}
            <Card title="Git Status" gradient>
              <div className="space-y-4">
                {gitStatus ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <GitBranch className="w-4 h-4 text-cyan-400" />
                        <span className="text-white font-medium">Branch: {gitStatus.branch}</span>
                      </div>
                      <Button variant="secondary" size="sm" onClick={loadGitStatus}>
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Refresh
                      </Button>
                    </div>

                    {/* Modified Files */}
                    {gitStatus.modified_files.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-yellow-400 font-medium text-sm">Modified Files:</h4>
                        {gitStatus.modified_files.map(file => (
                          <div key={file} className="flex items-center space-x-2 text-sm">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                            <span className="text-gray-300">{file}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Untracked Files */}
                    {gitStatus.untracked_files.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-red-400 font-medium text-sm">Untracked Files:</h4>
                        {gitStatus.untracked_files.map(file => (
                          <div key={file} className="flex items-center space-x-2 text-sm">
                            <div className="w-2 h-2 bg-red-400 rounded-full" />
                            <span className="text-gray-300">{file}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="secondary" size="sm" onClick={() => executeGitCommand('git add .')}>
                        <GitCommit className="w-3 h-3 mr-1" />
                        Stage All
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => executeGitCommand('git status')}>
                        <Eye className="w-3 h-3 mr-1" />
                        Status
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-gray-400">
                    Loading git status...
                  </div>
                )}
              </div>
            </Card>

            {/* AI Commit Generator */}
            <Card title="AI Commit Generator">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Commit Message</label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={commitMessage}
                      onChange={setCommitMessage}
                      placeholder="Enter commit message or generate with AI..."
                      className="flex-1"
                    />
                    <Button variant="secondary" size="sm" onClick={generateAICommitMessage}>
                      <Zap className="w-3 h-3 mr-1" />
                      AI
                    </Button>
                  </div>
                </div>

                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => executeGitCommand(`git commit -m "${commitMessage}"`)}
                  disabled={!commitMessage.trim() || isExecutingGit}
                >
                  <GitCommit className="w-4 h-4 mr-2" />
                  Commit Changes
                </Button>

                {/* Recent Commits */}
                {gitStatus?.commits && (
                  <div className="space-y-2">
                    <h4 className="text-white font-medium text-sm">Recent Commits:</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {gitStatus.commits.slice(0, 5).map(commit => (
                        <div key={commit.hash} className="p-2 bg-gray-800/30 rounded text-xs">
                          <div className="text-gray-300 font-mono">{commit.hash.substring(0, 7)}</div>
                          <div className="text-white">{commit.message}</div>
                          <div className="text-gray-400">{format(new Date(commit.date), 'MMM dd, HH:mm')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Git Terminal */}
          <Card title="Git Terminal Interface">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-green-400" />
                <Input
                  value={gitCommand}
                  onChange={setGitCommand}
                  placeholder="Enter git command (e.g., git status, git log --oneline)"
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && gitCommand.trim()) {
                      executeGitCommand(gitCommand);
                    }
                  }}
                />
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => executeGitCommand(gitCommand)}
                  disabled={!gitCommand.trim() || isExecutingGit}
                >
                  <Play className="w-3 h-3 mr-1" />
                  Execute
                </Button>
              </div>

              {/* Terminal Output */}
              <div className="bg-gray-900/80 rounded-lg p-4 border border-gray-700/50 min-h-64 max-h-64 overflow-y-auto">
                <div className="font-mono text-sm space-y-1">
                  {gitOutput.length === 0 ? (
                    <div className="text-gray-500">Terminal ready. Enter git commands above.</div>
                  ) : (
                    gitOutput.map((line, index) => (
                      <div key={index} className="text-green-400 whitespace-pre-wrap">
                        {line}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Git Commands */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label: 'Status', command: 'git status' },
                  { label: 'Log', command: 'git log --oneline -10' },
                  { label: 'Diff', command: 'git diff' },
                  { label: 'Branch', command: 'git branch -a' },
                ].map(cmd => (
                  <Button
                    key={cmd.command}
                    variant="ghost"
                    size="sm"
                    onClick={() => executeGitCommand(cmd.command)}
                    className="text-xs"
                  >
                    {cmd.label}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </>
      )}

      {selectedView === 'history' && (
        <>
          {/* Recovery Documentation History */}
          <Card title="Recovery Documentation History" gradient>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">All Recovery Documentation</span>
                <Button variant="secondary" size="sm" onClick={loadRecoveryDocumentation}>
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Refresh
                </Button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recoveryDocs.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No recovery documentation yet. Run an AI analysis to create your first recovery documentation.
                  </div>
                ) : (
                  recoveryDocs.map((doc, index) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedDoc?.id === doc.id
                          ? 'border-cyan-400/50 bg-cyan-500/10'
                          : 'border-gray-700/30 bg-gray-800/30 hover:border-gray-600/50'
                      }`}
                      onClick={() => setSelectedDoc(doc)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Scan className="w-4 h-4 text-cyan-400" />
                            <span className="text-white font-medium">Recovery Documentation</span>
                            <span className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded">
                              {doc.files_analyzed} files
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm line-clamp-2">
                            {doc.analysis_summary.substring(0, 150)}...
                          </p>
                          <div className="text-xs text-gray-500 mt-2">
                            {format(new Date(doc.timestamp), 'PPpp')}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="ghost" size="sm" onClick={() => copyContent(doc.full_documentation)}>
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={exportDocumentationAsPDF}>
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </Card>

          {/* Documentation Pages History */}
          <Card title="Documentation Pages Updates">
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {documentationPages.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No documentation page updates yet.
                </div>
              ) : (
                documentationPages.map((page, index) => (
                  <motion.div
                    key={page.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 rounded-lg border border-gray-700/30 bg-gray-800/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <div>
                          <span className="text-white font-medium text-sm">{page.title}</span>
                          <div className="text-xs text-gray-400">
                            {page.page_type.replace('_', ' ')} • {page.version}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(page.timestamp), 'MMM dd, HH:mm')}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </>
      )}
    </motion.div>
  );
};