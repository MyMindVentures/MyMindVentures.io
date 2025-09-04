import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Share, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface FinalCTASectionProps {
  onNavigate?: (page: string) => void;
  onShareDemo: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({
  onNavigate,
  onShareDemo,
}) => {
  return (
    <section className='px-6 py-20 bg-gradient-to-r from-cyan-500/10 to-purple-500/10'>
      <div className='max-w-4xl mx-auto text-center'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='space-y-8'
        >
          <h2 className='text-4xl md:text-5xl font-bold text-white'>
            Ready to Experience the
            <span className='bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent block'>
              Revolution?
            </span>
          </h2>

          <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
            Join the future of development with AI-powered workflows,
            ADHD-friendly design, and breakthrough innovations that will
            transform how you build applications.
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6'>
            <Button
              variant='primary'
              className='px-10 py-5 text-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-2xl'
              onClick={() => onNavigate?.('app-management')}
            >
              <Rocket className='w-6 h-6 mr-3' />
              Start Your Journey
            </Button>

            <Button
              variant='ghost'
              className='px-10 py-5 text-xl border border-gray-600 hover:border-cyan-500/50'
              onClick={onShareDemo}
            >
              <Share className='w-6 h-6 mr-3' />
              Share the Revolution
            </Button>
          </div>

          {/* AI Update Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className='p-4 bg-cyan-500/10 backdrop-blur-xl rounded-xl border border-cyan-500/20 max-w-2xl mx-auto'
          >
            <div className='flex items-center justify-center space-x-2 text-cyan-300'>
              <Sparkles className='w-4 h-4' />
              <span className='text-sm font-medium'>
                This demo is powered by OpenAI and updates automatically with
                the latest features
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
