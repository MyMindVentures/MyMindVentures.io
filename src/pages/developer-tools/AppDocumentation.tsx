import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Scan, GitBranch, History } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { AIScannerSection } from './app-documentation/components/AIScannerSection';
import { DocumentationDisplaySection } from './app-documentation/components/DocumentationDisplaySection';
import { GitInterfaceSection } from './app-documentation/components/GitInterfaceSection';
import { HistorySection } from './app-documentation/components/HistorySection';
import { useAppDocumentation } from './app-documentation/hooks/useAppDocumentation';
import { AppDocumentationProps } from './app-documentation/types';

export const AppDocumentation: React.FC<AppDocumentationProps> = ({
  onBack,
}) => {
  const {
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
  } = useAppDocumentation();

  const navigationTabs = [
    { id: 'documentation', label: 'AI Scanner', icon: Scan },
    { id: 'git', label: 'Git Interface', icon: GitBranch },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className='space-y-6'
    >
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button variant='ghost' onClick={onBack}>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to App Management
          </Button>
          <div>
            <h1 className='text-2xl font-bold text-white'>
              Complete App Documentation & Recovery System
            </h1>
            <p className='text-gray-400'>
              AI-powered codebase analysis with Git interface and backup system
            </p>
          </div>
        </div>

        <div className='flex space-x-2 bg-gray-800/30 p-1 rounded-lg'>
          {navigationTabs.map(tab => {
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
                <Icon className='w-4 h-4' />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedView === 'documentation' && (
        <>
          <AIScannerSection
            isGenerating={isGenerating}
            generateCommitWithScan={generateCommitWithScan}
            setGenerateCommitWithScan={setGenerateCommitWithScan}
            commitMessage={commitMessage}
            setCommitMessage={setCommitMessage}
            onGenerateCompleteDocumentation={generateCompleteDocumentation}
          />

          {selectedDoc && (
            <DocumentationDisplaySection
              selectedDoc={selectedDoc}
              onCopyContent={copyContent}
              onExportDocumentation={exportDocumentationAsPDF}
            />
          )}
        </>
      )}

      {selectedView === 'git' && (
        <GitInterfaceSection
          gitStatus={gitStatus}
          gitCommand={gitCommand}
          setGitCommand={setGitCommand}
          gitOutput={gitOutput}
          commitMessage={commitMessage}
          setCommitMessage={setCommitMessage}
          isExecutingGit={isExecutingGit}
          onLoadGitStatus={loadGitStatus}
          onExecuteGitCommand={executeGitCommand}
          onGenerateAICommitMessage={generateAICommitMessage}
        />
      )}

      {selectedView === 'history' && (
        <HistorySection
          recoveryDocs={recoveryDocs}
          selectedDoc={selectedDoc}
          documentationPages={documentationPages}
          onSetSelectedDoc={setSelectedDoc}
          onCopyContent={copyContent}
          onExportDocumentation={exportDocumentationAsPDF}
          onLoadRecoveryDocumentation={loadRecoveryDocumentation}
        />
      )}
    </motion.div>
  );
};
