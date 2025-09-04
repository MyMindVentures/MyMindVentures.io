import React, { useState } from 'react';
import { GitCommit, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface CommitCreatorProps {
  onGenerateCommit: () => Promise<void>;
  onCreateCommit: (
    title: string,
    description: string,
    summary: string
  ) => Promise<void>;
  isGeneratingCommit: boolean;
  isCreating: boolean;
  generatedCommit: any;
  pendingSnippetsCount: number;
  currentBranch: string;
}

export const CommitCreator: React.FC<CommitCreatorProps> = ({
  onGenerateCommit,
  onCreateCommit,
  isGeneratingCommit,
  isCreating,
  generatedCommit,
  pendingSnippetsCount,
  currentBranch,
}) => {
  const [commitTitle, setCommitTitle] = useState('');
  const [commitDescription, setCommitDescription] = useState('');
  const [commitSummary, setCommitSummary] = useState('');

  React.useEffect(() => {
    if (generatedCommit) {
      setCommitTitle(generatedCommit.title || '');
      setCommitDescription(generatedCommit.description || '');
      setCommitSummary(generatedCommit.full_summary || '');
    }
  }, [generatedCommit]);

  const handleSubmit = async () => {
    if (
      !commitTitle.trim() ||
      !commitDescription.trim() ||
      !commitSummary.trim()
    )
      return;

    await onCreateCommit(commitTitle, commitDescription, commitSummary);

    // Reset form
    setCommitTitle('');
    setCommitDescription('');
    setCommitSummary('');
  };

  return (
    <Card title='Create Commit'>
      <div className='space-y-4'>
        {/* Snippets Status */}
        <div className='p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-purple-300 text-sm font-medium'>
              {pendingSnippetsCount} Uncommitted Snippets
            </span>
            <span className='text-xs text-gray-400'>Branch: main</span>
          </div>
        </div>

        {/* AI Generation Section */}
        <div className='space-y-3'>
          <Button
            onClick={onGenerateCommit}
            disabled={pendingSnippetsCount === 0 || isGeneratingCommit}
            className='w-full'
            size='sm'
            variant='secondary'
          >
            {isGeneratingCommit ? (
              <>
                <div className='w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles className='w-3 h-3 mr-2' />
                Generate AI Commit
              </>
            )}
          </Button>

          {pendingSnippetsCount === 0 && (
            <div className='p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg'>
              <div className='flex items-center space-x-2 text-orange-400 text-sm'>
                <AlertCircle className='w-4 h-4' />
                <span>
                  Create blueprint snippets first to generate commits.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Generated Commit Display */}
        {generatedCommit && (
          <div className='space-y-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg'>
            <div className='flex items-center space-x-2 text-purple-300 text-sm font-medium'>
              <CheckCircle className='w-4 h-4' />
              <span>AI-Generated Commit Ready</span>
            </div>

            <Input
              label='Title'
              value={commitTitle}
              onChange={setCommitTitle}
              placeholder='Commit title...'
            />

            <textarea
              value={commitDescription}
              onChange={e => setCommitDescription(e.target.value)}
              placeholder='Commit description...'
              rows={3}
              className='w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none text-sm'
            />

            <textarea
              value={commitSummary}
              onChange={e => setCommitSummary(e.target.value)}
              placeholder='Full commit summary...'
              rows={4}
              className='w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none text-sm'
            />

            <Button
              onClick={handleSubmit}
              disabled={
                !commitTitle.trim() ||
                !commitDescription.trim() ||
                !commitSummary.trim() ||
                isCreating
              }
              className='w-full'
              size='sm'
            >
              {isCreating ? (
                <>
                  <div className='w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' />
                  Creating Commit...
                </>
              ) : (
                <>
                  <GitCommit className='w-3 h-3 mr-2' />
                  Create Commit
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
