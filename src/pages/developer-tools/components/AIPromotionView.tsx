import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Zap,
  Target,
  TrendingUp,
  Users,
  MessageSquare,
  Share2,
  BarChart3,
  Lightbulb,
  Rocket,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export const AIPromotionView: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] =
    useState<string>('personalization');

  const promotionStrategies = [
    {
      id: 'personalization',
      name: 'Personalized Recommendations',
      description: 'AI-driven feature suggestions based on user behavior',
      icon: Brain,
      metrics: {
        engagement: 85,
        conversion: 23,
        retention: 67,
      },
    },
    {
      id: 'timing',
      name: 'Optimal Timing',
      description: 'Smart timing for feature announcements and updates',
      icon: Zap,
      metrics: {
        engagement: 78,
        conversion: 31,
        retention: 72,
      },
    },
    {
      id: 'targeting',
      name: 'User Segmentation',
      description: 'Targeted promotion based on user segments',
      icon: Target,
      metrics: {
        engagement: 92,
        conversion: 28,
        retention: 81,
      },
    },
  ];

  const aiInsights = [
    {
      title: 'Peak Usage Times',
      description: 'Users are most active between 2-4 PM',
      icon: TrendingUp,
      color: 'text-green-400',
    },
    {
      title: 'Feature Adoption',
      description: 'AI Analysis feature has 85% adoption rate',
      icon: Users,
      color: 'text-blue-400',
    },
    {
      title: 'User Feedback',
      description: 'Positive sentiment increased by 23%',
      icon: MessageSquare,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold'>AI-Powered Promotion</h2>
          <p className='text-gray-400'>
            Leverage AI to maximize feature adoption and user engagement
          </p>
        </div>
        <Button>
          <Brain className='w-4 h-4 mr-2' />
          Generate Strategy
        </Button>
      </div>

      {/* AI Insights */}
      <div className='grid gap-4 md:grid-cols-3'>
        {aiInsights.map((insight, index) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className='p-4'>
              <div className='flex items-center gap-3'>
                <insight.icon className={`w-5 h-5 ${insight.color}`} />
                <div>
                  <h3 className='font-semibold text-sm'>{insight.title}</h3>
                  <p className='text-xs text-gray-400'>{insight.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Promotion Strategies */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Promotion Strategies</h3>
        <div className='grid gap-4 md:grid-cols-3'>
          {promotionStrategies.map((strategy, index) => (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`p-6 cursor-pointer transition-all ${
                  selectedStrategy === strategy.id
                    ? 'ring-2 ring-blue-500 bg-blue-500/10'
                    : 'hover:bg-gray-800/50'
                }`}
                onClick={() => setSelectedStrategy(strategy.id)}
              >
                <div className='flex items-center gap-3 mb-4'>
                  <strategy.icon className='w-6 h-6 text-blue-500' />
                  <div>
                    <h4 className='font-semibold'>{strategy.name}</h4>
                    <p className='text-sm text-gray-400'>
                      {strategy.description}
                    </p>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span>Engagement</span>
                    <span className='font-semibold text-green-400'>
                      {strategy.metrics.engagement}%
                    </span>
                  </div>
                  <div className='flex items-center justify-between text-sm'>
                    <span>Conversion</span>
                    <span className='font-semibold text-blue-400'>
                      {strategy.metrics.conversion}%
                    </span>
                  </div>
                  <div className='flex items-center justify-between text-sm'>
                    <span>Retention</span>
                    <span className='font-semibold text-purple-400'>
                      {strategy.metrics.retention}%
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Strategy Details */}
      <Card className='p-6'>
        <div className='flex items-center gap-3 mb-4'>
          <Lightbulb className='w-6 h-6 text-yellow-500' />
          <h3 className='text-lg font-semibold'>Strategy Recommendations</h3>
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          <div>
            <h4 className='font-semibold mb-3'>Implementation Steps</h4>
            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold'>
                  1
                </div>
                <span className='text-sm'>Analyze user behavior patterns</span>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold'>
                  2
                </div>
                <span className='text-sm'>Segment users based on activity</span>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold'>
                  3
                </div>
                <span className='text-sm'>Create personalized messaging</span>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold'>
                  4
                </div>
                <span className='text-sm'>Schedule optimal delivery times</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className='font-semibold mb-3'>Expected Outcomes</h4>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>Feature Adoption</span>
                <span className='font-semibold text-green-400'>+45%</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>User Engagement</span>
                <span className='font-semibold text-blue-400'>+32%</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>Retention Rate</span>
                <span className='font-semibold text-purple-400'>+28%</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>User Satisfaction</span>
                <span className='font-semibold text-yellow-400'>+19%</span>
              </div>
            </div>
          </div>
        </div>

        <div className='flex gap-3 mt-6'>
          <Button className='flex-1'>
            <Rocket className='w-4 h-4 mr-2' />
            Launch Campaign
          </Button>
          <Button variant='outline'>
            <BarChart3 className='w-4 h-4 mr-2' />
            View Analytics
          </Button>
          <Button variant='outline'>
            <Share2 className='w-4 h-4 mr-2' />
            Share Strategy
          </Button>
        </div>
      </Card>
    </div>
  );
};
