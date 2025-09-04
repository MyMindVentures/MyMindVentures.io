import React from 'react';
import { motion } from 'framer-motion';
import { Play, Eye } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { RecoveryDoc } from '../types';
import { format } from 'date-fns';

interface LiveDemoSectionProps {
  latestAnalysis?: RecoveryDoc | null;
  onNavigate?: (page: string) => void;
}

export const LiveDemoSection: React.FC<LiveDemoSectionProps> = ({
  latestAnalysis,
  onNavigate,
}) => {
  return (
    <section className='px-6 py-20 bg-gradient-to-r from-gray-900 to-gray-800'>
      <div className='max-w-6xl mx-auto text-center'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='space-y-8'
        >
          <h2 className='text-4xl font-bold text-white'>
            🎬{' '}
            <span className='bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent'>
              Live Demo
            </span>
          </h2>

          <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
            See the revolutionary AI-powered workflows in action. Every feature
            you see is real and working.
          </p>

          {/* Live Stats */}
          {latestAnalysis && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className='p-6 bg-green-500/10 backdrop-blur-xl rounded-2xl border border-green-500/20 max-w-2xl mx-auto'
            >
              <div className='flex items-center justify-center space-x-3 mb-4'>
                <div className='w-3 h-3 bg-green-400 rounded-full animate-pulse' />
                <span className='text-green-300 font-semibold'>
                  Live System Status
                </span>
              </div>

              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <div className='text-white font-bold text-lg'>
                    {latestAnalysis.files_analyzed}
                  </div>
                  <div className='text-gray-400'>Files Analyzed</div>
                </div>
                <div>
                  <div className='text-white font-bold text-lg'>
                    {format(
                      new Date(latestAnalysis.timestamp),
                      'MMM dd, HH:mm'
                    )}
                  </div>
                  <div className='text-gray-400'>Last AI Scan</div>
                </div>
              </div>
            </motion.div>
          )}

          <div className='flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6'>
            <Button
              variant='primary'
              className='px-8 py-4 text-lg bg-gradient-to-r from-green-500 to-emerald-600'
              onClick={() => onNavigate?.('app-documentation')}
            >
              <Play className='w-5 h-5 mr-3' />
              Try AI Scanner Live
            </Button>

            <Button
              variant='secondary'
              className='px-8 py-4 text-lg'
              onClick={() => onNavigate?.('app-management')}
            >
              <Eye className='w-5 h-5 mr-3' />
              Explore All Tools
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
