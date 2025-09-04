import React from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  BarChart3,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Feature } from '../hooks/useTimelineData';
import { format } from 'date-fns';

interface FeaturesViewProps {
  data: Feature[];
}

export const FeaturesView: React.FC<FeaturesViewProps> = ({ data }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className='w-4 h-4 text-green-500' />;
      case 'beta':
        return <AlertTriangle className='w-4 h-4 text-yellow-500' />;
      case 'planned':
        return <Clock className='w-4 h-4 text-blue-500' />;
      default:
        return <Clock className='w-4 h-4 text-gray-500' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'beta':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'planned':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 80) return 'text-green-400';
    if (usage >= 60) return 'text-yellow-400';
    if (usage >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-400';
    if (rating >= 4.0) return 'text-yellow-400';
    if (rating >= 3.5) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className='space-y-6'>
      {/* Features Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold'>Feature Overview</h2>
          <p className='text-gray-400'>
            Track feature usage, ratings, and performance
          </p>
        </div>
        <div className='flex items-center gap-4 text-sm text-gray-400'>
          <div className='flex items-center gap-2'>
            <CheckCircle className='w-4 h-4 text-green-500' />
            Active
          </div>
          <div className='flex items-center gap-2'>
            <AlertTriangle className='w-4 h-4 text-yellow-500' />
            Beta
          </div>
          <div className='flex items-center gap-2'>
            <Clock className='w-4 h-4 text-blue-500' />
            Planned
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {data.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className='p-6 h-full hover:bg-gray-800/50 transition-colors'>
              <div className='flex items-start gap-3 mb-4'>
                {getStatusIcon(feature.status)}
                <div className='flex-1 min-w-0'>
                  <h3 className='font-semibold text-lg mb-1'>{feature.name}</h3>
                  <p className='text-sm text-gray-400 mb-2'>
                    {feature.description}
                  </p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(feature.status)}`}
                  >
                    {feature.status}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className='space-y-3 mb-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 text-sm'>
                    <Users className='w-4 h-4 text-blue-500' />
                    <span>Usage</span>
                  </div>
                  <span
                    className={`font-semibold ${getUsageColor(feature.usage_stats)}`}
                  >
                    {feature.usage_stats}%
                  </span>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 text-sm'>
                    <Star className='w-4 h-4 text-yellow-500' />
                    <span>Rating</span>
                  </div>
                  <span
                    className={`font-semibold ${getRatingColor(feature.user_rating)}`}
                  >
                    {feature.user_rating}/5
                  </span>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 text-sm'>
                    <BarChart3 className='w-4 h-4 text-purple-500' />
                    <span>Category</span>
                  </div>
                  <span className='text-sm text-gray-400'>
                    {feature.category}
                  </span>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 text-sm'>
                    <Clock className='w-4 h-4 text-gray-500' />
                    <span>Updated</span>
                  </div>
                  <span className='text-sm text-gray-400'>
                    {format(new Date(feature.last_updated), 'MMM dd')}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className='mb-4'>
                <div className='flex items-center justify-between text-xs text-gray-400 mb-1'>
                  <span>Usage Rate</span>
                  <span>{feature.usage_stats}%</span>
                </div>
                <div className='w-full bg-gray-700 rounded-full h-2'>
                  <div
                    className={`h-2 rounded-full ${getUsageColor(feature.usage_stats).replace('text-', 'bg-')}`}
                    style={{ width: `${feature.usage_stats}%` }}
                  ></div>
                </div>
              </div>

              {/* Actions */}
              <div className='flex gap-2'>
                <Button size='sm' variant='outline' className='flex-1'>
                  <Settings className='w-4 h-4 mr-1' />
                  Configure
                </Button>
                <Button size='sm' variant='outline'>
                  <BarChart3 className='w-4 h-4' />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
