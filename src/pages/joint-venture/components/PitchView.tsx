import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ArrowRight, CheckCircle, Star, Users, TrendingUp } from 'lucide-react';

export const PitchView: React.FC = () => {
  const pitchPoints = [
    '4 revolutionaire app concepten volledig uitgewerkt',
    'AI-powered development workflow geïmplementeerd',
    'Complete tech stack en architecture gedefinieerd',
    'Market research en user personas voltooid',
    'Development roadmap en timeline vastgesteld',
  ];

  const stats = [
    { label: 'App Concepten', value: '4', icon: Star },
    { label: 'Development Team', value: '8+', icon: Users },
    { label: 'Market Size', value: '$2.5B', icon: TrendingUp },
    { label: 'Success Rate', value: '95%', icon: CheckCircle },
  ];

  return (
    <div className='space-y-8'>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-center'
      >
        <h2 className='text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent'>
          🚀 Joint Venture Partnership
        </h2>
        <p className='text-xl text-gray-300 mb-8 max-w-3xl mx-auto'>
          Samen bouwen we de toekomst van digitale innovatie. 4 revolutionaire
          apps, volledig uitgewerkt en klaar voor development.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className='grid grid-cols-2 md:grid-cols-4 gap-4'
      >
        {stats.map((stat, index) => (
          <Card key={index} className='p-6 text-center'>
            <stat.icon className='w-8 h-8 mx-auto mb-2 text-blue-400' />
            <div className='text-2xl font-bold text-white'>{stat.value}</div>
            <div className='text-sm text-gray-400'>{stat.label}</div>
          </Card>
        ))}
      </motion.div>

      {/* Main Pitch Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className='grid md:grid-cols-2 gap-8'
      >
        {/* Left Column - Key Points */}
        <Card className='p-8'>
          <h3 className='text-2xl font-bold mb-6 text-blue-400'>
            🎯 Wat We Bieden
          </h3>
          <ul className='space-y-4'>
            {pitchPoints.map((point, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className='flex items-start gap-3'
              >
                <CheckCircle className='w-5 h-5 text-green-400 mt-0.5 flex-shrink-0' />
                <span className='text-gray-300'>{point}</span>
              </motion.li>
            ))}
          </ul>
        </Card>

        {/* Right Column - Partnership Benefits */}
        <Card className='p-8'>
          <h3 className='text-2xl font-bold mb-6 text-purple-400'>
            🤝 Partnership Voordelen
          </h3>
          <div className='space-y-4'>
            <div className='flex items-start gap-3'>
              <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold'>
                1
              </div>
              <div>
                <h4 className='font-semibold text-white'>Shared Resources</h4>
                <p className='text-gray-400 text-sm'>
                  Pool development resources en expertise
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold'>
                2
              </div>
              <div>
                <h4 className='font-semibold text-white'>Risk Mitigation</h4>
                <p className='text-gray-400 text-sm'>
                  Distributeer financiële en technische risico's
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold'>
                3
              </div>
              <div>
                <h4 className='font-semibold text-white'>Market Access</h4>
                <p className='text-gray-400 text-sm'>
                  Leverage bestaande customer base en netwerken
                </p>
              </div>
            </div>
            <div className='flex items-start gap-3'>
              <div className='w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold'>
                4
              </div>
              <div>
                <h4 className='font-semibold text-white'>Innovation Boost</h4>
                <p className='text-gray-400 text-sm'>
                  Combineer verschillende perspectieven voor breakthrough
                  solutions
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className='text-center'
      >
        <Card className='p-8 bg-gradient-to-r from-blue-600 to-purple-600'>
          <h3 className='text-2xl font-bold mb-4 text-white'>
            Ready to Start This Journey?
          </h3>
          <p className='text-blue-100 mb-6'>
            Laten we samen de toekomst van digitale innovatie bouwen. Neem
            contact op voor een gedetailleerde bespreking van de mogelijkheden.
          </p>
          <Button
            size='lg'
            className='bg-white text-blue-600 hover:bg-gray-100'
          >
            Start Partnership Discussion
            <ArrowRight className='w-5 h-5 ml-2' />
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};
