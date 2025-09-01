import React, { useState } from 'react';
import { Rocket, Copy } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface PublicationCreatorProps {
  onCreatePublication: (version: string, title: string, description: string) => Promise<void>;
  isGenerating: boolean;
}

export const PublicationCreator: React.FC<PublicationCreatorProps> = ({
  onCreatePublication,
  isGenerating,
}) => {
  const [publicationVersion, setPublicationVersion] = useState('');
  const [publicationTitle, setPublicationTitle] = useState('');
  const [publicationDescription, setPublicationDescription] = useState('');
  const [publicationPrompt, setPublicationPrompt] = useState('');

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(publicationPrompt);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  const handleSubmit = async () => {
    if (!publicationVersion.trim()) return;
    
    await onCreatePublication(publicationVersion, publicationTitle, publicationDescription);
    
    // Reset form
    setPublicationVersion('');
    setPublicationTitle('');
    setPublicationDescription('');
  };

  return (
    <Card title="Create Publication">
      <div className="space-y-4">
        {/* Publication Prompt Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-300">Publication Analysis Prompt</label>
            <button
              onClick={handleCopyPrompt}
              className="p-1 rounded hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
              title="Copy prompt"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={publicationPrompt}
            onChange={(e) => setPublicationPrompt(e.target.value)}
            placeholder="Enter your publication analysis prompt..."
            rows={6}
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none text-xs font-mono"
          />
        </div>

        <Input
          label="Version"
          value={publicationVersion}
          onChange={setPublicationVersion}
          placeholder="v1.0.0"
        />

        <Input
          label="Title (Optional)"
          value={publicationTitle}
          onChange={setPublicationTitle}
          placeholder="Release title..."
        />

        <textarea
          value={publicationDescription}
          onChange={(e) => setPublicationDescription(e.target.value)}
          placeholder="Release description..."
          rows={4}
          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none text-sm"
        />

        <Button 
          onClick={handleSubmit} 
          disabled={!publicationVersion.trim() || isGenerating}
          className="w-full"
          size="sm"
        >
          {isGenerating ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Publishing...
            </>
          ) : (
            <>
              <Rocket className="w-3 h-3 mr-2" />
              Publish Version
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};