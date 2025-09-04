import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Crown,
  Gem,
  Award,
  Rocket,
  Share,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { PitchContent } from '../types';

interface HeroSectionProps {
  heroSection?: PitchContent;
  isGenerating: boolean;
  onGenerateAI: () => void;
  onShareDemo: () => void;
  onNavigate?: (page: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroSection,
  isGenerating,
  onGenerateAI,
  onShareDemo,
  onNavigate,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='relative overflow-hidden'
    >
      {/* Background Animation */}
      <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-gradient' />

      <div className='relative z-10 px-6 py-20 text-center'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='max-w-6xl mx-auto space-y-8'
        >
          {/* AI Update Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className='flex justify-center mb-8'
          >
            <Button
              onClick={onGenerateAI}
              disabled={isGenerating}
              className='px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500'
            >
              {isGenerating ? (
                <>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' />
                  OpenAI Updating Demo...
                </>
              ) : (
                <>
                  <Sparkles className='w-4 h-4 mr-2' />
                  Let OpenAI Update This Demo
                </>
              )}
            </Button>
          </motion.div>

          {/* Main Title */}
          <div className='space-y-6'>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className='flex justify-center mb-6'
            >
              <div className='w-32 h-32 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-slow'>
                <Brain className='w-16 h-16 text-white' />
              </div>
            </motion.div>

            <h1 className='text-6xl md:text-8xl font-bold text-white leading-tight'>
              <span className='bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient'>
                MyMindVentures.io
              </span>
            </h1>

            <div className='space-y-4'>
              <h2 className='text-3xl md:text-4xl font-bold text-white'>
                🧠 Revolutionary Developer Platform
              </h2>

              <div className='flex items-center justify-center space-x-4 text-lg'>
                <div className='flex items-center space-x-2 bg-cyan-500/20 px-4 py-2 rounded-full'>
                  <Crown className='w-5 h-5 text-cyan-400' />
                  <span className='text-cyan-300 font-semibold'>
                    ADHD Innovation
                  </span>
                </div>
                <div className='flex items-center space-x-2 bg-purple-500/20 px-4 py-2 rounded-full'>
                  <Gem className='w-5 h-5 text-purple-400' />
                  <span className='text-purple-300 font-semibold'>
                    AI-Powered
                  </span>
                </div>
                <div className='flex items-center space-x-2 bg-pink-500/20 px-4 py-2 rounded-full'>
                  <Award className='w-5 h-5 text-pink-400' />
                  <span className='text-pink-300 font-semibold'>
                    World's First
                  </span>
                </div>
              </div>
            </div>

            <p className='text-xl md:text-2xl text-gray-300 max-w-5xl mx-auto leading-relaxed'>
              {heroSection?.content ||
                `The world's first AI-powered development platform that turns ADHD thinking patterns into 
              breakthrough innovations. Created by a unique mind with extraordinary blueprinting talents, 
              powered by Perplexity.ai and Bolt.ai.`}
            </p>
          </div>

          {/* Revolutionary Features Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className='grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto'
          >
            {[
              {
                icon: 'Scan',
                label: 'AI Recovery System',
                desc: "World's First",
              },
              {
                icon: 'Brain',
                label: 'Multi-AI Orchestra',
                desc: 'Revolutionary',
              },
              {
                icon: 'Shield',
                label: 'Always-True Docs',
                desc: 'Never Outdated',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className='p-6 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300'
              >
                <div className='w-8 h-8 text-cyan-400 mb-3 mx-auto'>🔍</div>
                <h3 className='text-white font-bold text-lg mb-1'>
                  {feature.label}
                </h3>
                <p className='text-cyan-400 text-sm font-semibold'>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className='flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6'
          >
            <Button
              variant='primary'
              className='px-8 py-4 text-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500'
              onClick={() => onNavigate?.('app-management')}
            >
              <Rocket className='w-5 h-5 mr-3' />
              Experience the Revolution
            </Button>

            <Button
              variant='secondary'
              className='px-8 py-4 text-lg'
              onClick={onShareDemo}
            >
              <Share className='w-5 h-5 mr-3' />
              Share This Demo
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};
