import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Brain, Database, Rocket } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const Home: React.FC = () => {
  return (
    <div className='p-6 space-y-8'>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center space-y-6'
      >
        <h1 className='text-5xl font-bold text-white mb-4'>
          Welcome to{' '}
          <span className='bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent'>
            MyMindVentures.io
          </span>
        </h1>
        <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
          A futuristic platform for managing your development ventures, building
          applications, and accelerating innovation through AI-powered tools.
        </p>
      </motion.div>

      {/* Feature Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {[
          {
            title: 'AI Integration',
            description:
              'Connect with OpenAI and Perplexity for intelligent assistance',
            icon: Brain,
            color: 'from-cyan-400 to-blue-500',
          },
          {
            title: 'Data Management',
            description:
              'Seamless Supabase integration for all your data needs',
            icon: Database,
            color: 'from-green-400 to-emerald-500',
          },
          {
            title: 'Build Tools',
            description:
              'Comprehensive tools for managing your development workflow',
            icon: Zap,
            color: 'from-purple-400 to-pink-500',
          },
          {
            title: 'Scalable Architecture',
            description:
              'Built for growth with edge functions and modern patterns',
            icon: Rocket,
            color: 'from-orange-400 to-red-500',
          },
        ].map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <Card title={feature.title} className='h-full'>
                <div className='space-y-4'>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center`}
                  >
                    <Icon className='w-6 h-6 text-white' />
                  </div>
                  <p className='text-gray-400 text-sm leading-relaxed'>
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card title='Quick Actions' gradient>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <button className='p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-cyan-500/50 hover:bg-gray-700/50 transition-all duration-200 text-left group'>
            <div className='flex items-center space-x-3 mb-2'>
              <Zap className='w-5 h-5 text-cyan-400' />
              <span className='text-white font-medium'>Start New Project</span>
            </div>
            <p className='text-gray-400 text-sm'>
              Initialize a new development venture
            </p>
          </button>

          <button className='p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-purple-500/50 hover:bg-gray-700/50 transition-all duration-200 text-left group'>
            <div className='flex items-center space-x-3 mb-2'>
              <Brain className='w-5 h-5 text-purple-400' />
              <span className='text-white font-medium'>AI Consultation</span>
            </div>
            <p className='text-gray-400 text-sm'>
              Get AI-powered insights and suggestions
            </p>
          </button>

          <button className='p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-green-500/50 hover:bg-gray-700/50 transition-all duration-200 text-left group'>
            <div className='flex items-center space-x-3 mb-2'>
              <Database className='w-5 h-5 text-green-400' />
              <span className='text-white font-medium'>Database Monitor</span>
            </div>
            <p className='text-gray-400 text-sm'>
              Monitor your database connections and health
            </p>
          </button>
        </div>
      </Card>
    </div>
  );
};
