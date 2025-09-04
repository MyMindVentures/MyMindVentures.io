import React from 'react';
import { motion } from 'framer-motion';
import { Stat } from '../types';

interface StatsSectionProps {
  stats: Stat[];
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <section className='px-6 py-16 bg-gray-800/30'>
      <div className='max-w-6xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mb-12'
        >
          <h2 className='text-3xl font-bold text-white mb-4'>
            🚀 Revolutionary Impact
          </h2>
          <p className='text-gray-400 text-lg'>
            Real metrics from the world's most innovative development platform
          </p>
        </motion.div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className='text-center p-6 bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50'
              >
                <Icon className='w-8 h-8 text-cyan-400 mx-auto mb-3' />
                <div className='text-3xl font-bold text-white mb-1'>
                  {stat.value}
                </div>
                <div className='text-gray-400 text-sm'>{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
