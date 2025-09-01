import React, { useState, useEffect } from 'react';
import { Lightbulb, Copy, FileCode, Save, ChevronDown, Download, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { supabaseService as db } from '../../lib/supabase';
import { Prompt } from '../../types';

interface SnippetCreatorProps {
  onCreateSnippet: (content: string, title: string, timestamp: string) => Promise<void>;
  isGenerating: boolean;
}

export const SnippetCreator: React.FC<SnippetCreatorProps> = ({
  onCreateSnippet,
  isGenerating,
}) => {
  const [snippetContent, setSnippetContent] = useState('');
  const [snippetTitle, setSnippetTitle] = useState('');
  const [snippetTimestamp, setSnippetTimestamp] = useState('');
  const [boltPromptContent, setBoltPromptContent] = useState('');
  const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([]);
  const [selectedBlueprintPrompt, setSelectedBlueprintPrompt] = useState('');
  const [selectedBoltPrompt, setSelectedBoltPrompt] = useState('');
  const [blueprintPromptTitle, setBlueprintPromptTitle] = useState('');
  const [boltPromptTitle, setBoltPromptTitle] = useState('');
  const [showBlueprintDropdown, setShowBlueprintDropdown] = useState(false);
  const [showBoltDropdown, setShowBoltDropdown] = useState(false);
  const [blueprintPrompt, setBlueprintPrompt] = useState(`Analyze all app updates, code changes, and development notes since the last commit at [PASTE_TIMESTAMP_HERE].
Organize the analysis into clear, detailed summary sections by theme, such as Navigation, Functions, User Flow, UI/UX, Integrations, Database Structure, and other relevant topics.
For each theme, output a short, descriptive title, followed by a thorough and actionable summary (BlueprintSnippet) describing all changes, improvements, or additions related to that theme.
Ensure each BlueprintSnippet is granular and self-contained so it can be individually stored or uploaded to a database for version tracking and documentation.
Do not omit any relevant progress or context from the analysis.
Present the output in the following format:

[Theme Title 1]
Summary: [Detailed, structured summary for this theme]

[Theme Title 2]
Summary: [Detailed, structured summary for this theme]

(Continue for all relevant themes.)`);

  useEffect(() => {
    // Set current timestamp as default
    setSnippetTimestamp(new Date().toISOString().slice(0, 16));
  }, []);
  useEffect(() => {
    loadSavedPrompts();
  }, []);

  const loadSavedPrompts = async () => {
    try {
      const { data } = await db.getSnippetPrompts('demo-user');
      if (data) {
        setSavedPrompts(data);
      }
    } catch (error) {
      console.error('Error loading saved prompts:', error);
    }
  };

  const deletePrompt = async (promptId: string) => {
    try {
      await db.deletePrompt(promptId);
      loadSavedPrompts();
      
      // Clear selection if deleted prompt was selected
      if (selectedBlueprintPrompt === promptId) {
        setSelectedBlueprintPrompt('');
      }
      if (selectedBoltPrompt === promptId) {
        setSelectedBoltPrompt('');
      }
    } catch (error) {
      console.error('Error deleting prompt:', error);
    }
  };

  const savePrompt = async (type: 'blueprint' | 'bolt_instructions', title: string, content: string) => {
    if (!title.trim() || !content.trim()) return;
    
    try {
      await db.createSnippetPrompt({
        title: `${type === 'blueprint' ? 'Blueprint' : 'Bolt'}: ${title}`,
        content,
        type,
        user_id: 'demo-user',
      });
      
      loadSavedPrompts();
      
      // Reset title input
      if (type === 'blueprint') {
        setBlueprintPromptTitle('');
      } else {
        setBoltPromptTitle('');
      }
    } catch (error) {
      console.error('Error saving prompt:', error);
    }
  };

  const loadPrompt = (promptId: string, type: 'blueprint' | 'bolt_instructions') => {
    const prompt = savedPrompts.find(p => p.id === promptId);
    if (prompt) {
      if (type === 'blueprint') {
        setBlueprintPrompt(prompt.content);
        setSelectedBlueprintPrompt(promptId);
        setShowBlueprintDropdown(false);
      } else {
        setBoltPromptContent(prompt.content);
        setSelectedBoltPrompt(promptId);
        setShowBoltDropdown(false);
      }
    }
  };

  const getBlueprintPrompts = () => savedPrompts.filter(p => p.title.startsWith('Blueprint:'));
  const getBoltPrompts = () => savedPrompts.filter(p => p.title.startsWith('Bolt:'));

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(blueprintPrompt);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  const handleCopyBoltPrompt = async () => {
    try {
      await navigator.clipboard.writeText(boltPromptContent);
    } catch (error) {
      console.error('Failed to copy bolt prompt:', error);
    }
  };

  const handleCreateBoltPromptSnippet = async () => {
    if (!boltPromptContent.trim()) return;
    
    const title = boltPromptTitle.trim() || 'Bolt Instructions';
    const timestamp = new Date().toISOString();
    
    await onCreateSnippet(boltPromptContent, title, timestamp);
    setBoltPromptContent('');
    setBoltPromptTitle('');
  };
  
  const handleSubmit = async () => {
    if (!snippetContent.trim() || !snippetTitle.trim()) return;
    
    const timestamp = snippetTimestamp ? new Date(snippetTimestamp).toISOString() : new Date().toISOString();
    await onCreateSnippet(snippetContent, snippetTitle, timestamp);
    
    // Reset form
    setSnippetContent('');
    setSnippetTitle('');
    setSnippetTimestamp(new Date().toISOString().slice(0, 16));
  };

  return (
    <div className="space-y-6">
      {/* Bolt Prompt Section */}
      <Card title=".bolt/prompt Instructions" gradient>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <FileCode className="w-4 h-4 mr-2 text-cyan-400" />
                Bolt Instruction File Content
              </label>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <button
                    onClick={() => setShowBoltDropdown(!showBoltDropdown)}
                    className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors text-xs"
                  >
                    <Download className="w-3 h-3" />
                    <span>Load</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  
                  {showBoltDropdown && (
                    <div className="absolute right-0 top-full mt-1 w-64 bg-gray-900/95 backdrop-blur-xl rounded-lg border border-gray-700/50 shadow-xl z-50 max-h-48 overflow-y-auto">
                      {getBoltPrompts().length === 0 ? (
                        <div className="p-3 text-gray-400 text-xs">No saved bolt prompts</div>
                      ) : (
                        getBoltPrompts().map(prompt => (
                          <div
                            key={prompt.id}
                            className="flex items-center justify-between p-3 hover:bg-gray-800/50 border-b border-gray-700/30 last:border-b-0"
                          >
                            <button
                              onClick={() => loadPrompt(prompt.id, 'bolt_instructions')}
                              className="flex-1 text-left"
                            >
                              <div className="text-xs font-medium text-gray-300 hover:text-white">{prompt.title.replace('Bolt: ', '')}</div>
                              <div className="text-xs text-gray-500 mt-1">{new Date(prompt.timestamp).toLocaleDateString()}</div>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deletePrompt(prompt.id);
                              }}
                              className="p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                              title="Delete prompt"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleCopyBoltPrompt}
                  className="p-1 rounded hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
                  title="Copy bolt prompt"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              <Input
                value={boltPromptTitle}
                onChange={setBoltPromptTitle}
                placeholder="Enter title to save this prompt..."
                className="flex-1"
              />
              <Button
                onClick={() => savePrompt('bolt_instructions', boltPromptTitle, boltPromptContent)}
                disabled={!boltPromptTitle.trim() || !boltPromptContent.trim()}
                variant="secondary"
                size="sm"
              >
                <Save className="w-3 h-3 mr-1" />
                Save
              </Button>
            </div>
            
            <textarea
              value={boltPromptContent}
              onChange={(e) => setBoltPromptContent(e.target.value)}
              placeholder="Paste the .bolt/prompt instruction file content here..."
              rows={8}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none text-xs font-mono"
            />
          </div>

          <Button 
            onClick={handleCreateBoltPromptSnippet} 
            disabled={!boltPromptContent.trim() || isGenerating}
            className="w-full"
            size="sm"
            variant="secondary"
          >
            {isGenerating ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <FileCode className="w-3 h-3 mr-2" />
                Create Bolt Instructions Snippet
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Regular Blueprint Snippet Creator */}
      <Card title="Create Blueprint Snippet" gradient>
        <div className="space-y-4">
          {/* Blueprint Prompt Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-300">Blueprint Snippet Prompt</label>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <button
                    onClick={() => setShowBlueprintDropdown(!showBlueprintDropdown)}
                    className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors text-xs"
                  >
                    <Download className="w-3 h-3" />
                    <span>Load</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  
                  {showBlueprintDropdown && (
                    <div className="absolute right-0 top-full mt-1 w-64 bg-gray-900/95 backdrop-blur-xl rounded-lg border border-gray-700/50 shadow-xl z-50 max-h-48 overflow-y-auto">
                      {getBlueprintPrompts().length === 0 ? (
                        <div className="p-3 text-gray-400 text-xs">No saved blueprint prompts</div>
                      ) : (
                        getBlueprintPrompts().map(prompt => (
                          <div
                            key={prompt.id}
                            className="flex items-center justify-between p-3 hover:bg-gray-800/50 border-b border-gray-700/30 last:border-b-0"
                          >
                            <button
                              onClick={() => loadPrompt(prompt.id, 'blueprint')}
                              className="flex-1 text-left"
                            >
                              <div className="text-xs font-medium text-gray-300 hover:text-white">{prompt.title.replace('Blueprint: ', '')}</div>
                              <div className="text-xs text-gray-500 mt-1">{new Date(prompt.timestamp).toLocaleDateString()}</div>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deletePrompt(prompt.id);
                              }}
                              className="p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                              title="Delete prompt"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleCopyPrompt}
                  className="p-1 rounded hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
                  title="Copy prompt"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              <Input
                value={blueprintPromptTitle}
                onChange={setBlueprintPromptTitle}
                placeholder="Enter title to save this prompt..."
                className="flex-1"
              />
              <Button
                onClick={() => savePrompt('blueprint', blueprintPromptTitle, blueprintPrompt)}
                disabled={!blueprintPromptTitle.trim() || !blueprintPrompt.trim()}
                variant="secondary"
                size="sm"
              >
                <Save className="w-3 h-3 mr-1" />
                Save
              </Button>
            </div>
            
            <textarea
              value={blueprintPrompt}
              onChange={(e) => setBlueprintPrompt(e.target.value)}
              placeholder="Enter your blueprint analysis prompt..."
              rows={8}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none text-xs font-mono"
            />
          </div>

          <Input
            label="Snippet Title"
            value={snippetTitle}
            onChange={setSnippetTitle}
            placeholder="Enter a descriptive title for this snippet..."
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Timestamp
              <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="datetime-local"
              value={snippetTimestamp}
              onChange={(e) => setSnippetTimestamp(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200"
            />
          </div>
          <textarea
            value={snippetContent}
            onChange={(e) => setSnippetContent(e.target.value)}
            placeholder="Describe your blueprint snippet implementation..."
            rows={4}
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none text-sm"
          />

          <Button 
            onClick={handleSubmit} 
            disabled={!snippetContent.trim() || !snippetTitle.trim() || isGenerating}
            className="w-full"
            size="sm"
          >
            {isGenerating ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Lightbulb className="w-3 h-3 mr-2" />
                Create Snippet
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};