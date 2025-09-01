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
  Zap,
  Brain,
  Sparkles,
  BookOpen,
  Settings,
  Upload,
  X
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabaseService as db, supabase } from '../../lib/supabase';
import { format } from 'date-fns';

interface AIDocumentationWorkflowProps {
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

export const AIDocumentationWorkflow: React.FC<AIDocumentationWorkflowProps> = ({ onBack }) => {
  const [recoveryDocs, setRecoveryDocs] = useState<RecoveryDocumentation[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<RecoveryDocumentation | null>(null);
  const [documentationPages, setDocumentationPages] = useState<DocumentationPage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedView, setSelectedView] = useState<'workflow' | 'documentation' | 'git' | 'history'>('workflow');
  const [commitMessage, setCommitMessage] = useState('');
  const [generateCommitWithScan, setGenerateCommitWithScan] = useState(false);
  const [scanType, setScanType] = useState<'complete' | 'incremental' | 'targeted'>('complete');
  const [targetPages, setTargetPages] = useState<string[]>([]);

  useEffect(() => {
    loadRecoveryDocumentation();
    loadDocumentationPages();
  }, []);

  const loadRecoveryDocumentation = async () => {
    try {
      const { data, error } = await supabase
        .from('recovery_documentation')
        .select('*')
        .eq('user_id', 'demo-user')
        .order('timestamp', { ascending: false });
      
      if (data) {
        setRecoveryDocs(data);
        if (data.length > 0) {
          setSelectedDoc(data[0]);
        }
      }
      if (error) {
        console.error('Error loading recovery documentation:', error);
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
          scan_type: scanType,
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
          scan_type: scanType
        },
      });

      // Reload all data
      await loadRecoveryDocumentation();
      await loadDocumentationPages();
      
      alert(`✅ AI Documentation Workflow completed successfully!\n\n📊 Results:\n• ${result.files_scanned} files analyzed\n• ${result.pages_updated} documentation pages updated\n• Recovery documentation generated\n• Backup file created: ${result.backup_filename}${result.commit_data ? '\n• Git commit created' : ''}`);
      
    } catch (error) {
      console.error('Error generating documentation:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePitchContent = async (sectionType: string) => {
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-pitch-content`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'demo-user',
          section_type: sectionType,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`✅ Pitch content generated for ${sectionType}!`);
        // Reload documentation pages to show new content
        await loadDocumentationPages();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error generating pitch content:', error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('✅ Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('❌ Failed to copy to clipboard');
    }
  };

  const downloadBackup = async (doc: RecoveryDocumentation) => {
    try {
      const backupData = {
        generated_at: doc.timestamp,
        application: 'MyMindVentures.io',
        recovery_doc_id: doc.id,
        analysis_summary: doc.analysis_summary,
        full_documentation: doc.full_documentation,
        navigation_map: doc.navigation_map,
        component_map: doc.component_map,
        file_inventory: doc.file_inventory,
        user_flows: doc.user_flows,
        database_analysis: doc.database_analysis,
        api_analysis: doc.api_analysis,
        recovery_guide: doc.recovery_guide,
        files_analyzed: doc.files_analyzed,
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mymindventures-recovery-${format(new Date(doc.timestamp), 'yyyy-MM-dd-HH-mm')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('✅ Backup downloaded successfully!');
    } catch (error) {
      console.error('Error downloading backup:', error);
      alert('❌ Failed to download backup');
    }
  };

  const renderWorkflowView = () => (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-purple-500" />
          <h3 className="text-lg font-semibold">🧠 AI Documentation Workflow</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Scan Type</label>
              <select 
                value={scanType} 
                onChange={(e) => setScanType(e.target.value as any)}
                className="w-full p-2 border rounded-lg bg-gray-800 border-gray-600"
              >
                <option value="complete">Complete Codebase Analysis</option>
                <option value="incremental">Incremental Changes</option>
                <option value="targeted">Targeted Pages Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Commit Message (Optional)</label>
              <Input
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="feat(docs): AI-powered documentation update"
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="generateCommit"
                checked={generateCommitWithScan}
                onChange={(e) => setGenerateCommitWithScan(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="generateCommit" className="text-sm">
                Generate Git commit with documentation
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg">
              <h4 className="font-semibold mb-2">🚀 What This Does:</h4>
              <ul className="text-sm space-y-1">
                <li>• Scans entire codebase with OpenAI</li>
                <li>• Generates complete recovery documentation</li>
                <li>• Updates all documentation pages</li>
                <li>• Creates backup file</li>
                <li>• Optionally creates Git commit</li>
              </ul>
            </div>

            <Button
              onClick={generateCompleteDocumentation}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating Documentation...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start AI Documentation Workflow
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-green-500" />
          <h3 className="text-lg font-semibold">📚 Quick Documentation Updates</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { type: 'hero', label: 'Hero Section', icon: '🚀' },
            { type: 'features', label: 'Features', icon: '✨' },
            { type: 'testimonials', label: 'Testimonials', icon: '💬' },
            { type: 'stats', label: 'Statistics', icon: '📊' },
            { type: 'cta', label: 'Call to Action', icon: '🎯' },
            { type: 'footer', label: 'Footer', icon: '📄' }
          ].map((section) => (
            <Button
              key={section.type}
              onClick={() => generatePitchContent(section.type)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <span>{section.icon}</span>
              {section.label}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderDocumentationView = () => (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">📄 Recovery Documentation</h3>
          <div className="flex gap-2">
            <Button onClick={loadRecoveryDocumentation} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {recoveryDocs.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-4" />
            <p>No recovery documentation found. Run the AI workflow to generate documentation.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recoveryDocs.map((doc) => (
              <div key={doc.id} className="border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      {format(new Date(doc.timestamp), 'MMM dd, yyyy HH:mm')}
                    </span>
                    <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                      {doc.files_analyzed} files
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => copyToClipboard(doc.recovery_guide)}
                      variant="outline"
                      size="sm"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => downloadBackup(doc)}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-2">{doc.analysis_summary}</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setSelectedDoc(doc)}
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">📚 Documentation Pages</h3>
          <div className="flex gap-2">
            <Button onClick={loadDocumentationPages} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {documentationPages.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-4" />
            <p>No documentation pages found. Run the AI workflow to generate pages.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {documentationPages.map((page) => (
              <div key={page.id} className="border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{page.title}</span>
                  <span className="text-xs bg-green-600 px-2 py-1 rounded">
                    {page.page_type}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  {format(new Date(page.timestamp), 'MMM dd, yyyy HH:mm')}
                </p>
                <p className="text-sm text-gray-300 line-clamp-3">{page.content}</p>
                <div className="mt-3">
                  <Button
                    onClick={() => copyToClipboard(page.content)}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Content
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">🧠 AI Documentation Workflow</h1>
            <p className="text-gray-400">OpenAI-powered codebase analysis and documentation generation</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'workflow', label: 'Workflow', icon: Sparkles },
            { id: 'documentation', label: 'Documentation', icon: FileText },
            { id: 'git', label: 'Git Integration', icon: GitCommit },
            { id: 'history', label: 'History', icon: History }
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setSelectedView(tab.id as any)}
              variant={selectedView === tab.id ? 'default' : 'outline'}
              size="sm"
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={selectedView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedView === 'workflow' && renderWorkflowView()}
          {selectedView === 'documentation' && renderDocumentationView()}
          {selectedView === 'git' && (
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <GitCommit className="w-6 h-6 text-green-500" />
                <h3 className="text-lg font-semibold">🔗 Git Integration</h3>
              </div>
              <p className="text-gray-400 mb-4">
                The AI Documentation Workflow integrates seamlessly with Git Management. 
                When you run the workflow with "Generate Git commit" enabled, it will:
              </p>
              <ul className="space-y-2 text-sm">
                <li>• 📝 Create a professional commit message using OpenAI</li>
                <li>• 📊 Include analysis metadata in the commit</li>
                <li>• 🔄 Sync documentation changes with Git</li>
                <li>• 📦 Package everything in a structured commit</li>
              </ul>
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <p className="text-sm font-medium mb-2">💡 Pro Tip:</p>
                <p className="text-sm text-gray-400">
                  Use the AI Documentation Workflow before major releases to ensure 
                  all documentation is up-to-date and properly committed to Git.
                </p>
              </div>
            </Card>
          )}
          {selectedView === 'history' && (
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <History className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold">📈 Workflow History</h3>
              </div>
              <p className="text-gray-400">
                View the complete history of AI documentation workflows and their results.
                This helps track documentation evolution and identify patterns.
              </p>
              {/* TODO: Add workflow history implementation */}
            </Card>
          )}
        </motion.div>

        {/* Selected Document Modal */}
        {selectedDoc && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold">Recovery Documentation</h3>
                <Button onClick={() => setSelectedDoc(null)} variant="outline" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
                <div className="prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: selectedDoc.recovery_guide.replace(/\n/g, '<br>') }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
