import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText,
  RefreshCw,
  Brain,
  Sparkles,
  BookOpen,
  Settings,
  Download,
  Copy,
  Eye,
  Clock,
  GitCommit,
  Database,
  Code,
  Navigation,
  Zap,
  AlertTriangle,
  CheckCircle,
  History,
  Plus,
  Edit,
  Save,
  X
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabaseService as db, supabase } from '../../lib/supabase';
import { format } from 'date-fns';

interface DynamicDocumentationProps {
  onBack: () => void;
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

export const DynamicDocumentation: React.FC<DynamicDocumentationProps> = ({ onBack }) => {
  const [documentationPages, setDocumentationPages] = useState<DocumentationPage[]>([]);
  const [recoveryDocs, setRecoveryDocs] = useState<RecoveryDocumentation[]>([]);
  const [selectedPage, setSelectedPage] = useState<DocumentationPage | null>(null);
  const [selectedView, setSelectedView] = useState<'pages' | 'recovery' | 'update' | 'history'>('pages');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPageType, setSelectedPageType] = useState<string>('all');
  const [editingPage, setEditingPage] = useState<DocumentationPage | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    loadDocumentationPages();
    loadRecoveryDocumentation();
  }, []);

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

  const loadRecoveryDocumentation = async () => {
    try {
      const { data, error } = await supabase
        .from('recovery_documentation')
        .select('*')
        .eq('user_id', 'demo-user')
        .order('timestamp', { ascending: false });
      
      if (data) {
        setRecoveryDocs(data);
      }
      if (error) {
        console.error('Error loading recovery documentation:', error);
      }
    } catch (error) {
      console.error('Error loading recovery documentation:', error);
    }
  };

  const updateAllDocumentation = async () => {
    setIsUpdating(true);
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
          generate_commit: true,
          commit_message: 'docs: AI-powered documentation update',
        }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Log the comprehensive operation
      await db.createBuildLogEntry({
        action_type: 'ai_documentation_update',
        action_description: `OpenAI updated ${result.pages_updated} documentation pages with latest codebase analysis`,
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
      await loadDocumentationPages();
      await loadRecoveryDocumentation();
      
      alert(`✅ Documentation Update completed successfully!\n\n📊 Results:\n• ${result.files_scanned} files analyzed\n• ${result.pages_updated} documentation pages updated\n• Recovery documentation generated\n• Git commit created`);
      
    } catch (error) {
      console.error('Error updating documentation:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const generateSpecificPage = async (pageType: string) => {
    setIsGenerating(true);
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
          section_type: pageType,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`✅ ${pageType} page generated successfully!`);
        await loadDocumentationPages();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error generating page:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const savePageEdit = async () => {
    if (!editingPage) return;
    
    try {
      const { data, error } = await supabase
        .from('documentation_pages')
        .update({
          content: editContent,
          timestamp: new Date().toISOString(),
        })
        .eq('id', editingPage.id)
        .select()
        .single();

      if (error) throw error;

      // Log the manual edit
      await db.createBuildLogEntry({
        action_type: 'manual_documentation_edit',
        action_description: `Manually edited documentation page: ${editingPage.title}`,
        timestamp: new Date().toISOString(),
        user_id: 'demo-user',
        related_id: editingPage.id,
        metadata: { 
          page_type: editingPage.page_type,
          manual_edit: true
        },
      });

      setEditingPage(null);
      setEditContent('');
      await loadDocumentationPages();
      alert('✅ Page updated successfully!');
    } catch (error) {
      console.error('Error saving page:', error);
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

  const downloadPage = async (page: DocumentationPage) => {
    try {
      const pageData = {
        title: page.title,
        content: page.content,
        page_type: page.page_type,
        version: page.version,
        generated_at: page.timestamp,
        application: 'MyMindVentures.io'
      };

      const blob = new Blob([JSON.stringify(pageData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${page.page_type}-${format(new Date(page.timestamp), 'yyyy-MM-dd-HH-mm')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('✅ Page downloaded successfully!');
    } catch (error) {
      console.error('Error downloading page:', error);
      alert('❌ Failed to download page');
    }
  };

  const filteredPages = documentationPages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedPageType === 'all' || page.page_type === selectedPageType;
    return matchesSearch && matchesType;
  });

  const pageTypes = [...new Set(documentationPages.map(p => p.page_type))];

  const renderPagesView = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search documentation pages..."
              className="w-full"
            />
          </div>
          <select 
            value={selectedPageType} 
            onChange={(e) => setSelectedPageType(e.target.value)}
            className="p-2 border rounded-lg bg-gray-800 border-gray-600"
          >
            <option value="all">All Types</option>
            {pageTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <Button onClick={loadDocumentationPages} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Documentation Pages Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPages.map((page) => (
          <Card key={page.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{page.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                    {page.page_type}
                  </span>
                  <span className="text-xs text-gray-400">
                    v{page.version}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  onClick={() => {
                    setEditingPage(page);
                    setEditContent(page.content);
                  }}
                  variant="outline"
                  size="sm"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setSelectedPage(page)}
                  size="sm"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-gray-300 line-clamp-3 mb-3">
              {page.content}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {format(new Date(page.timestamp), 'MMM dd, yyyy HH:mm')}
              </span>
              <div className="flex gap-1">
                <Button
                  onClick={() => copyToClipboard(page.content)}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  onClick={() => downloadPage(page)}
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredPages.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No documentation pages found</h3>
            <p className="text-gray-400 mb-4">
              {searchTerm || selectedPageType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Run the AI Documentation Workflow to generate pages'
              }
            </p>
            {!searchTerm && selectedPageType === 'all' && (
              <Button onClick={() => setSelectedView('update')}>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Documentation
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );

  const renderUpdateView = () => (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-purple-500" />
          <h3 className="text-lg font-semibold">🧠 AI Documentation Update</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg">
              <h4 className="font-semibold mb-2">🚀 Complete Update</h4>
              <p className="text-sm mb-3">
                Scans entire codebase and updates ALL documentation pages with latest analysis
              </p>
              <Button
                onClick={updateAllDocumentation}
                disabled={isUpdating}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Updating All Documentation...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Update All Documentation
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">📚 Quick Page Generation</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { type: 'hero', label: 'Hero', icon: '🚀' },
                { type: 'features', label: 'Features', icon: '✨' },
                { type: 'testimonials', label: 'Testimonials', icon: '💬' },
                { type: 'stats', label: 'Statistics', icon: '📊' },
                { type: 'cta', label: 'Call to Action', icon: '🎯' },
                { type: 'footer', label: 'Footer', icon: '📄' }
              ].map((section) => (
                <Button
                  key={section.type}
                  onClick={() => generateSpecificPage(section.type)}
                  disabled={isGenerating}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <span>{section.icon}</span>
                  {section.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <GitCommit className="w-6 h-6 text-green-500" />
          <h3 className="text-lg font-semibold">🔗 Git Integration</h3>
        </div>
        <p className="text-gray-400 mb-4">
          Every documentation update is automatically committed to Git with professional commit messages generated by OpenAI.
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-gray-800 rounded-lg">
            <h5 className="font-medium mb-1">📝 AI Commit Messages</h5>
            <p className="text-gray-400">Professional conventional commits</p>
          </div>
          <div className="p-3 bg-gray-800 rounded-lg">
            <h5 className="font-medium mb-1">📊 Metadata Tracking</h5>
            <p className="text-gray-400">Complete analysis metadata</p>
          </div>
          <div className="p-3 bg-gray-800 rounded-lg">
            <h5 className="font-medium mb-1">🔄 Auto Sync</h5>
            <p className="text-gray-400">Real-time Git synchronization</p>
          </div>
        </div>
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
            <h1 className="text-2xl font-bold">📚 Dynamic Documentation</h1>
            <p className="text-gray-400">Real-time documentation rendering from Supabase with AI-powered updates</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'pages', label: 'Documentation Pages', icon: FileText },
            { id: 'recovery', label: 'Recovery Docs', icon: Database },
            { id: 'update', label: 'AI Updates', icon: Sparkles },
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
          {selectedView === 'pages' && renderPagesView()}
          {selectedView === 'recovery' && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">📄 Recovery Documentation</h3>
                <Button onClick={loadRecoveryDocumentation} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              {recoveryDocs.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Database className="w-12 h-12 mx-auto mb-4" />
                  <p>No recovery documentation found. Run the AI workflow to generate recovery docs.</p>
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
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{doc.analysis_summary}</p>
                      <Button
                        onClick={() => copyToClipboard(doc.recovery_guide)}
                        size="sm"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy Recovery Guide
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
          {selectedView === 'update' && renderUpdateView()}
          {selectedView === 'history' && (
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <History className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-semibold">📈 Documentation History</h3>
              </div>
              <p className="text-gray-400">
                Track all documentation updates, AI generations, and manual edits over time.
                This helps maintain a complete audit trail of documentation evolution.
              </p>
              {/* TODO: Add documentation history implementation */}
            </Card>
          )}
        </motion.div>

        {/* Selected Page Modal */}
        {selectedPage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div>
                  <h3 className="text-lg font-semibold">{selectedPage.title}</h3>
                  <p className="text-sm text-gray-400">{selectedPage.page_type} • v{selectedPage.version}</p>
                </div>
                <Button onClick={() => setSelectedPage(null)} variant="outline" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
                <div className="prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: selectedPage.content.replace(/\n/g, '<br>') }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Page Modal */}
        {editingPage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold">Edit: {editingPage.title}</h3>
                <div className="flex gap-2">
                  <Button onClick={savePageEdit} size="sm">
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button onClick={() => setEditingPage(null)} variant="outline" size="sm">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-96 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none"
                  placeholder="Edit page content..."
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
