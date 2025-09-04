import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Code, Navigation, Eye, Copy, Download } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { RecoveryDocumentation } from '../types';
import { format } from 'date-fns';

interface DocumentationDisplaySectionProps {
  selectedDoc: RecoveryDocumentation;
  onCopyContent: (content: string) => void;
  onExportDocumentation: () => void;
}

export const DocumentationDisplaySection: React.FC<
  DocumentationDisplaySectionProps
> = ({ selectedDoc, onCopyContent, onExportDocumentation }) => {
  const stats = [
    {
      label: 'Files Analyzed',
      value: selectedDoc.files_analyzed?.toString() || '0',
      icon: FileText,
      color: 'text-cyan-400',
    },
    {
      label: 'Components Found',
      value:
        selectedDoc.component_map?.ui_components?.length?.toString() || '0',
      icon: Code,
      color: 'text-purple-400',
    },
    {
      label: 'Pages Mapped',
      value:
        selectedDoc.component_map?.page_components?.length?.toString() || '0',
      icon: Navigation,
      color: 'text-green-400',
    },
    {
      label: 'User Flows',
      value: selectedDoc.user_flows?.length?.toString() || '0',
      icon: Eye,
      color: 'text-blue-400',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className='bg-gray-800/30 rounded-lg p-4 border border-gray-700/30'
            >
              <div className='flex items-center space-x-3'>
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <div className={`text-lg font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className='text-gray-400 text-xs'>{stat.label}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Analysis Summary */}
      <Card title='Latest AI Analysis Summary'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <span className='text-white font-medium'>
              OpenAI Codebase Analysis
            </span>
            <div className='flex items-center space-x-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onCopyContent(selectedDoc.analysis_summary)}
              >
                <Copy className='w-3 h-3 mr-1' />
                Copy
              </Button>
              <Button
                variant='secondary'
                size='sm'
                onClick={onExportDocumentation}
              >
                <Download className='w-3 h-3 mr-1' />
                Export
              </Button>
            </div>
          </div>

          <div className='bg-gray-800/50 rounded-lg p-4 border border-gray-700/50'>
            <p className='text-gray-300 text-sm leading-relaxed whitespace-pre-wrap'>
              {selectedDoc.analysis_summary}
            </p>
          </div>

          <div className='text-xs text-gray-400'>
            Generated: {format(new Date(selectedDoc.timestamp), 'PPpp')}
          </div>
        </div>
      </Card>

      {/* Complete Documentation */}
      <Card title='Complete Visual Recovery Documentation'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <span className='text-white font-medium'>
              Full Application Map & Recovery Guide
            </span>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => onCopyContent(selectedDoc.full_documentation)}
            >
              <Copy className='w-3 h-3 mr-1' />
              Copy All
            </Button>
          </div>

          <div className='bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 max-h-96 overflow-y-auto'>
            <pre className='text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed'>
              {selectedDoc.full_documentation}
            </pre>
          </div>
        </div>
      </Card>

      {/* Recovery Guide */}
      <Card title='Emergency Recovery Procedures'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <span className='text-white font-medium'>
              Step-by-Step Recovery Guide
            </span>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => onCopyContent(selectedDoc.recovery_guide)}
            >
              <Copy className='w-3 h-3 mr-1' />
              Copy Guide
            </Button>
          </div>

          <div className='bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 max-h-64 overflow-y-auto'>
            <pre className='text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed'>
              {selectedDoc.recovery_guide}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
};
