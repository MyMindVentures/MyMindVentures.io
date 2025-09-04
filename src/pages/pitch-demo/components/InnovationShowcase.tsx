import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Feature } from '../types';

interface InnovationShowcaseProps {
  features: Feature[];
  activeFeature: number;
  setActiveFeature: (index: number) => void;
}

export const InnovationShowcase: React.FC<InnovationShowcaseProps> = ({
  features,
  activeFeature,
  setActiveFeature,
}) => {
  return (
    <section className='px-6 py-20 bg-gray-900/50'>
      <div className='max-w-7xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center space-y-6 mb-16'
        >
          <h2 className='text-4xl md:text-5xl font-bold text-white'>
            🧠{' '}
            <span className='bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent'>
              Breakthrough Innovations
            </span>
          </h2>
          <p className='text-xl text-gray-400 max-w-4xl mx-auto'>
            Revolutionary features created by a brilliant ADHD mind that sees
            solutions others miss
          </p>
        </motion.div>

        {/* Rotating Feature Showcase */}
        <div className='relative'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'
            >
              {/* Feature Content */}
              <div className='space-y-6'>
                <div className='space-y-4'>
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${features[activeFeature].color} flex items-center justify-center`}
                  >
                    {(() => {
                      const Icon = features[activeFeature].icon;
                      return <Icon className='w-8 h-8 text-white' />;
                    })()}
                  </div>

                  <div>
                    <h3 className='text-3xl font-bold text-white mb-2'>
                      {features[activeFeature].title}
                    </h3>
                    <p className='text-cyan-400 text-lg font-semibold mb-4'>
                      {features[activeFeature].subtitle}
                    </p>
                    <p className='text-gray-300 text-lg leading-relaxed'>
                      {features[activeFeature].description}
                    </p>
                  </div>

                  <div className='flex items-center space-x-2 text-sm text-gray-400'>
                    <CheckCircle className='w-4 h-4 text-green-400' />
                    <span>{features[activeFeature].stats}</span>
                  </div>
                </div>
              </div>

              {/* Visual Demo */}
              <div className='relative'>
                <div className='bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl'>
                  <div className='space-y-4'>
                    <div className='flex items-center space-x-3 mb-6'>
                      <div className='w-3 h-3 bg-red-400 rounded-full' />
                      <div className='w-3 h-3 bg-yellow-400 rounded-full' />
                      <div className='w-3 h-3 bg-green-400 rounded-full' />
                      <span className='text-gray-400 text-sm ml-4'>
                        MyMindVentures.io
                      </span>
                    </div>

                    {/* Demo Interface */}
                    <div className='space-y-3'>
                      {[1, 2, 3, 4].map((item, index) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className='flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg'
                        >
                          <div
                            className={`w-2 h-2 rounded-full bg-gradient-to-r ${features[activeFeature].color}`}
                          />
                          <div className='flex-1 h-2 bg-gray-600/50 rounded' />
                          <CheckCircle className='w-4 h-4 text-green-400' />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Feature Navigation Dots */}
          <div className='flex justify-center space-x-2 mt-8'>
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeFeature === index
                    ? 'bg-cyan-400 scale-125'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
