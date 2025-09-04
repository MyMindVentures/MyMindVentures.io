import React from 'react';
import { Scan, FileText, Navigation, Database, FileDown } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';

interface AIScannerSectionProps {
  isGenerating: boolean;
  generateCommitWithScan: boolean;
  setGenerateCommitWithScan: (value: boolean) => void;
  commitMessage: string;
  setCommitMessage: (value: string) => void;
  onGenerateCompleteDocumentation: () => void;
}

export const AIScannerSection: React.FC<AIScannerSectionProps> = ({
  isGenerating,
  generateCommitWithScan,
  setGenerateCommitWithScan,
  commitMessage,
  setCommitMessage,
  onGenerateCompleteDocumentation,
}) => {
  return (
    <Card title='OpenAI Complete Codebase Scanner' gradient>
      <div className='space-y-6'>
        <div className='text-center space-y-4'>
          <div className='flex justify-center'>
            <div className='w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center'>
              <Scan className='w-10 h-10 text-white' />
            </div>
          </div>

          <div className='space-y-2'>
            <h2 className='text-2xl font-bold text-white'>
              Ultimate Recovery Documentation System
            </h2>
            <p className='text-gray-400 leading-relaxed max-w-4xl mx-auto'>
              OpenAI will scan your entire codebase, analyze every file,
              component, navigation, and user flow. It creates comprehensive
              recovery documentation, updates all app documentation pages,
              generates backup files, and optionally creates Git commits - all
              in one powerful run!
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 text-sm'>
            <div className='flex items-center space-x-2 text-cyan-400'>
              <FileText className='w-4 h-4' />
              <span>Every File Analyzed</span>
            </div>
            <div className='flex items-center space-x-2 text-purple-400'>
              <Navigation className='w-4 h-4' />
              <span>Complete Navigation Map</span>
            </div>
            <div className='flex items-center space-x-2 text-green-400'>
              <Database className='w-4 h-4' />
              <span>All Documentation Updated</span>
            </div>
            <div className='flex items-center space-x-2 text-orange-400'>
              <FileDown className='w-4 h-4' />
              <span>Backup File Generated</span>
            </div>
          </div>
        </div>

        {/* Optional Git Commit */}
        <div className='space-y-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/30'>
          <div className='flex items-center space-x-2'>
            <input
              type='checkbox'
              checked={generateCommitWithScan}
              onChange={e => setGenerateCommitWithScan(e.target.checked)}
              className='w-4 h-4 text-cyan-500 bg-gray-800 border-gray-600 rounded focus:ring-cyan-500'
            />
            <label className='text-white font-medium'>
              Generate Git Commit
            </label>
          </div>

          {generateCommitWithScan && (
            <div className='space-y-2'>
              <Input
                value={commitMessage}
                onChange={setCommitMessage}
                placeholder='Enter commit message or leave empty for AI generation...'
              />
              <p className='text-gray-400 text-xs'>
                If empty, OpenAI will generate a professional commit message
                based on the analysis
              </p>
            </div>
          )}
        </div>

        <Button
          variant='primary'
          onClick={onGenerateCompleteDocumentation}
          disabled={isGenerating}
          className='w-full px-8 py-4 text-lg'
        >
          {isGenerating ? (
            <>
              <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3' />
              OpenAI Scanning Entire Codebase...
            </>
          ) : (
            <>
              <Scan className='w-5 h-5 mr-3' />
              Let OpenAI Analyze Everything
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
