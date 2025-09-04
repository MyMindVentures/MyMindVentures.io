import React from 'react';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  Brain,
  Zap,
  Eye,
  Heart,
  ArrowRight,
  Globe,
  Code,
  Rocket,
} from 'lucide-react';

export const ADHDInnovationSection: React.FC = () => {
  const adhdFeatures = [
    {
      icon: Lightbulb,
      text: 'Captures scattered thoughts into structured workflows',
    },
    {
      icon: Brain,
      text: 'Transforms ADHD thinking patterns into breakthrough features',
    },
    {
      icon: Zap,
      text: 'Automated systems reduce cognitive load and prevent overwhelm',
    },
    { icon: Eye, text: 'Visual recovery system for when focus is lost' },
  ];

  return (
    <section className='px-6 py-20'>
      <div className='max-w-6xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'
        >
          <div className='space-y-6'>
            <div className='space-y-4'>
              <h2 className='text-4xl font-bold text-white'>
                🎯{' '}
                <span className='bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent'>
                  ADHD-Powered Innovation
                </span>
              </h2>
              <p className='text-xl text-gray-300 leading-relaxed'>
                This platform was created by someone with ADHD who has a unique
                talent for blueprinting applications. Their mind works
                differently - they see patterns and solutions others miss.
              </p>
            </div>

            <div className='space-y-4'>
              {adhdFeatures.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className='flex items-center space-x-4'
                  >
                    <div className='w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center'>
                      <Icon className='w-5 h-5 text-white' />
                    </div>
                    <span className='text-gray-300'>{item.text}</span>
                  </motion.div>
                );
              })}
            </div>

            <div className='p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl border border-yellow-500/20'>
              <div className='flex items-center space-x-3 mb-3'>
                <Heart className='w-5 h-5 text-yellow-400' />
                <span className='text-yellow-300 font-semibold'>
                  Powered by AI Collaboration
                </span>
              </div>
              <p className='text-gray-300 text-sm'>
                "I could never have done this without Perplexity.ai and Bolt.ai.
                They helped me turn my unique ADHD thinking patterns into
                revolutionary development workflows that nobody else would think
                of."
              </p>
            </div>
          </div>

          {/* Visual Representation */}
          <div className='relative'>
            <div className='bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50'>
              <div className='space-y-6'>
                <div className='text-center'>
                  <div className='w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                    <Brain className='w-8 h-8 text-white' />
                  </div>
                  <h3 className='text-white font-bold text-xl'>ADHD Mind</h3>
                  <p className='text-gray-400 text-sm'>
                    Unique Blueprinting Talent
                  </p>
                </div>

                <div className='flex items-center justify-center space-x-4'>
                  <ArrowRight className='w-6 h-6 text-cyan-400' />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='text-center p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20'>
                    <Globe className='w-6 h-6 text-cyan-400 mx-auto mb-2' />
                    <div className='text-cyan-300 font-semibold text-sm'>
                      Perplexity.ai
                    </div>
                    <div className='text-gray-400 text-xs'>
                      Research Partner
                    </div>
                  </div>
                  <div className='text-center p-4 bg-purple-500/10 rounded-xl border border-purple-500/20'>
                    <Code className='w-6 h-6 text-purple-400 mx-auto mb-2' />
                    <div className='text-purple-300 font-semibold text-sm'>
                      Bolt.ai
                    </div>
                    <div className='text-gray-400 text-xs'>
                      Development Partner
                    </div>
                  </div>
                </div>

                <div className='flex items-center justify-center space-x-4'>
                  <ArrowRight className='w-6 h-6 text-purple-400' />
                </div>

                <div className='text-center p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-500/20'>
                  <Rocket className='w-8 h-8 text-white mx-auto mb-2' />
                  <div className='text-white font-bold'>
                    Revolutionary Platform
                  </div>
                  <div className='text-gray-400 text-xs'>MyMindVentures.io</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
