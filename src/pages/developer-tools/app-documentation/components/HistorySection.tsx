import React from 'react';
import { motion } from 'framer-motion';
import { Scan, RefreshCw, Copy, Download, FileText } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { RecoveryDocumentation, DocumentationPage } from '../types';
import { format } from 'date-fns';

interface HistorySectionProps {
  recoveryDocs: RecoveryDocumentation[];
  selectedDoc: RecoveryDocumentation | null;
  documentationPages: DocumentationPage[];
  onSetSelectedDoc: (doc: RecoveryDocumentation) => void;
  onCopyContent: (content: string) => void;
  onExportDocumentation: () => void;
  onLoadRecoveryDocumentation: () => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  recoveryDocs,
  selectedDoc,
  documentationPages,
  onSetSelectedDoc,
  onCopyContent,
  onExportDocumentation,
  onLoadRecoveryDocumentation,
}) => {
  return (
    <>
      {/* Recovery Documentation History */}
      <Card title='Recovery Documentation History' gradient>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <span className='text-white font-medium'>
              All Recovery Documentation
            </span>
            <Button
              variant='secondary'
              size='sm'
              onClick={onLoadRecoveryDocumentation}
            >
              <RefreshCw className='w-3 h-3 mr-1' />
              Refresh
            </Button>
          </div>

          <div className='space-y-3 max-h-64 overflow-y-auto'>
            {recoveryDocs.length === 0 ? (
              <div className='text-center py-8 text-gray-400'>
                No recovery documentation yet. Run an AI analysis to create your
                first recovery documentation.
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
                  onClick={() => onSetSelectedDoc(doc)}
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center space-x-2 mb-2'>
                        <Scan className='w-4 h-4 text-cyan-400' />
                        <span className='text-white font-medium'>
                          Recovery Documentation
                        </span>
                        <span className='text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded'>
                          {doc.files_analyzed} files
                        </span>
                      </div>
                      <p className='text-gray-400 text-sm line-clamp-2'>
                        {doc.analysis_summary.substring(0, 150)}...
                      </p>
                      <div className='text-xs text-gray-500 mt-2'>
                        {format(new Date(doc.timestamp), 'PPpp')}
                      </div>
                    </div>

                    <div className='flex items-center space-x-2 ml-4'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => onCopyContent(doc.full_documentation)}
                      >
                        <Copy className='w-3 h-3' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={onExportDocumentation}
                      >
                        <Download className='w-3 h-3' />
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
      <Card title='Documentation Pages Updates'>
        <div className='space-y-3 max-h-64 overflow-y-auto'>
          {documentationPages.length === 0 ? (
            <div className='text-center py-8 text-gray-400'>
              No documentation page updates yet.
            </div>
          ) : (
            documentationPages.map((page, index) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className='p-3 rounded-lg border border-gray-700/30 bg-gray-800/30'
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-3'>
                    <FileText className='w-4 h-4 text-blue-400' />
                    <div>
                      <span className='text-white font-medium text-sm'>
                        {page.title}
                      </span>
                      <div className='text-xs text-gray-400'>
                        {page.page_type.replace('_', ' ')} • {page.version}
                      </div>
                    </div>
                  </div>
                  <div className='text-xs text-gray-500'>
                    {format(new Date(page.timestamp), 'MMM dd, HH:mm')}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>
    </>
  );
};
