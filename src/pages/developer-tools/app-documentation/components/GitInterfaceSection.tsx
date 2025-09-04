import React from 'react';
import {
  GitBranch,
  RefreshCw,
  GitCommit,
  Eye,
  Zap,
  Terminal,
  Play,
} from 'lucide-react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { GitStatus } from '../types';
import { format } from 'date-fns';

interface GitInterfaceSectionProps {
  gitStatus: GitStatus | null;
  gitCommand: string;
  setGitCommand: (value: string) => void;
  gitOutput: string[];
  commitMessage: string;
  setCommitMessage: (value: string) => void;
  isExecutingGit: boolean;
  onLoadGitStatus: () => void;
  onExecuteGitCommand: (command: string) => void;
  onGenerateAICommitMessage: () => void;
}

export const GitInterfaceSection: React.FC<GitInterfaceSectionProps> = ({
  gitStatus,
  gitCommand,
  setGitCommand,
  gitOutput,
  commitMessage,
  setCommitMessage,
  isExecutingGit,
  onLoadGitStatus,
  onExecuteGitCommand,
  onGenerateAICommitMessage,
}) => {
  return (
    <>
      {/* Git Status */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card title='Git Status' gradient>
          <div className='space-y-4'>
            {gitStatus ? (
              <>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <GitBranch className='w-4 h-4 text-cyan-400' />
                    <span className='text-white font-medium'>
                      Branch: {gitStatus.branch}
                    </span>
                  </div>
                  <Button
                    variant='secondary'
                    size='sm'
                    onClick={onLoadGitStatus}
                  >
                    <RefreshCw className='w-3 h-3 mr-1' />
                    Refresh
                  </Button>
                </div>

                {/* Modified Files */}
                {gitStatus.modified_files.length > 0 && (
                  <div className='space-y-2'>
                    <h4 className='text-yellow-400 font-medium text-sm'>
                      Modified Files:
                    </h4>
                    {gitStatus.modified_files.map(file => (
                      <div
                        key={file}
                        className='flex items-center space-x-2 text-sm'
                      >
                        <div className='w-2 h-2 bg-yellow-400 rounded-full' />
                        <span className='text-gray-300'>{file}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Untracked Files */}
                {gitStatus.untracked_files.length > 0 && (
                  <div className='space-y-2'>
                    <h4 className='text-red-400 font-medium text-sm'>
                      Untracked Files:
                    </h4>
                    {gitStatus.untracked_files.map(file => (
                      <div
                        key={file}
                        className='flex items-center space-x-2 text-sm'
                      >
                        <div className='w-2 h-2 bg-red-400 rounded-full' />
                        <span className='text-gray-300'>{file}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Actions */}
                <div className='grid grid-cols-2 gap-2'>
                  <Button
                    variant='secondary'
                    size='sm'
                    onClick={() => onExecuteGitCommand('git add .')}
                  >
                    <GitCommit className='w-3 h-3 mr-1' />
                    Stage All
                  </Button>
                  <Button
                    variant='secondary'
                    size='sm'
                    onClick={() => onExecuteGitCommand('git status')}
                  >
                    <Eye className='w-3 h-3 mr-1' />
                    Status
                  </Button>
                </div>
              </>
            ) : (
              <div className='text-center py-4 text-gray-400'>
                Loading git status...
              </div>
            )}
          </div>
        </Card>

        {/* AI Commit Generator */}
        <Card title='AI Commit Generator'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-300'>
                Commit Message
              </label>
              <div className='flex items-center space-x-2'>
                <Input
                  value={commitMessage}
                  onChange={setCommitMessage}
                  placeholder='Enter commit message or generate with AI...'
                  className='flex-1'
                />
                <Button
                  variant='secondary'
                  size='sm'
                  onClick={onGenerateAICommitMessage}
                >
                  <Zap className='w-3 h-3 mr-1' />
                  AI
                </Button>
              </div>
            </div>

            <Button
              variant='primary'
              className='w-full'
              onClick={() =>
                onExecuteGitCommand(`git commit -m "${commitMessage}"`)
              }
              disabled={!commitMessage.trim() || isExecutingGit}
            >
              <GitCommit className='w-4 h-4 mr-2' />
              Commit Changes
            </Button>

            {/* Recent Commits */}
            {gitStatus?.commits && (
              <div className='space-y-2'>
                <h4 className='text-white font-medium text-sm'>
                  Recent Commits:
                </h4>
                <div className='space-y-1 max-h-32 overflow-y-auto'>
                  {gitStatus.commits.slice(0, 5).map(commit => (
                    <div
                      key={commit.hash}
                      className='p-2 bg-gray-800/30 rounded text-xs'
                    >
                      <div className='text-gray-300 font-mono'>
                        {commit.hash.substring(0, 7)}
                      </div>
                      <div className='text-white'>{commit.message}</div>
                      <div className='text-gray-400'>
                        {format(new Date(commit.date), 'MMM dd, HH:mm')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Git Terminal */}
      <Card title='Git Terminal Interface'>
        <div className='space-y-4'>
          <div className='flex items-center space-x-2'>
            <Terminal className='w-4 h-4 text-green-400' />
            <Input
              value={gitCommand}
              onChange={setGitCommand}
              placeholder='Enter git command (e.g., git status, git log --oneline)'
              className='flex-1'
              onKeyPress={e => {
                if (e.key === 'Enter' && gitCommand.trim()) {
                  onExecuteGitCommand(gitCommand);
                }
              }}
            />
            <Button
              variant='primary'
              size='sm'
              onClick={() => onExecuteGitCommand(gitCommand)}
              disabled={!gitCommand.trim() || isExecutingGit}
            >
              <Play className='w-3 h-3 mr-1' />
              Execute
            </Button>
          </div>

          {/* Terminal Output */}
          <div className='bg-gray-900/80 rounded-lg p-4 border border-gray-700/50 min-h-64 max-h-64 overflow-y-auto'>
            <div className='font-mono text-sm space-y-1'>
              {gitOutput.length === 0 ? (
                <div className='text-gray-500'>
                  Terminal ready. Enter git commands above.
                </div>
              ) : (
                gitOutput.map((line, index) => (
                  <div
                    key={index}
                    className='text-green-400 whitespace-pre-wrap'
                  >
                    {line}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Git Commands */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
            {[
              { label: 'Status', command: 'git status' },
              { label: 'Log', command: 'git log --oneline -10' },
              { label: 'Diff', command: 'git diff' },
              { label: 'Branch', command: 'git branch -a' },
            ].map(cmd => (
              <Button
                key={cmd.command}
                variant='ghost'
                size='sm'
                onClick={() => onExecuteGitCommand(cmd.command)}
                className='text-xs'
              >
                {cmd.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
};
