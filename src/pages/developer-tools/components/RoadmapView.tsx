import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Flag,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { RoadmapItem } from '../hooks/useTimelineData';
import { format } from 'date-fns';

interface RoadmapViewProps {
  data: RoadmapItem[];
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ data }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className='w-4 h-4 text-green-500' />;
      case 'in-progress':
        return <AlertTriangle className='w-4 h-4 text-yellow-500' />;
      case 'planned':
        return <Clock className='w-4 h-4 text-blue-500' />;
      default:
        return <Clock className='w-4 h-4 text-gray-500' />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'planned':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const groupByQuarter = (items: RoadmapItem[]) => {
    const groups: { [key: string]: RoadmapItem[] } = {};
    items.forEach(item => {
      if (!groups[item.quarter]) {
        groups[item.quarter] = [];
      }
      groups[item.quarter].push(item);
    });
    return groups;
  };

  const groupedData = groupByQuarter(data);

  return (
    <div className='space-y-6'>
      {/* Roadmap Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold'>Product Roadmap</h2>
          <p className='text-gray-400'>Future features and development plans</p>
        </div>
        <div className='flex items-center gap-4 text-sm text-gray-400'>
          <div className='flex items-center gap-2'>
            <CheckCircle className='w-4 h-4 text-green-500' />
            Completed
          </div>
          <div className='flex items-center gap-2'>
            <AlertTriangle className='w-4 h-4 text-yellow-500' />
            In Progress
          </div>
          <div className='flex items-center gap-2'>
            <Clock className='w-4 h-4 text-blue-500' />
            Planned
          </div>
        </div>
      </div>

      {/* Roadmap by Quarter */}
      <div className='space-y-8'>
        {Object.entries(groupedData).map(([quarter, items]) => (
          <div key={quarter}>
            <div className='flex items-center gap-3 mb-4'>
              <Calendar className='w-5 h-5 text-blue-500' />
              <h3 className='text-lg font-semibold'>{quarter}</h3>
              <div className='flex-1 h-px bg-gray-700'></div>
            </div>

            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className='p-4 h-full hover:bg-gray-800/50 transition-colors'>
                    <div className='flex items-start gap-3 mb-3'>
                      {getStatusIcon(item.status)}
                      <div className='flex-1 min-w-0'>
                        <h4 className='font-semibold text-sm mb-1'>
                          {item.title}
                        </h4>
                        <p className='text-xs text-gray-400'>
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <div className='flex items-center gap-2 text-xs'>
                        <span
                          className={`px-2 py-1 rounded-full border ${getStatusColor(item.status)}`}
                        >
                          {item.status.replace('-', ' ')}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full border ${getPriorityColor(item.priority)}`}
                        >
                          {item.priority}
                        </span>
                      </div>

                      <div className='flex items-center gap-2 text-xs text-gray-400'>
                        <Target className='w-3 h-3' />
                        <span>{item.category}</span>
                      </div>

                      <div className='flex items-center gap-2 text-xs text-gray-400'>
                        <Flag className='w-3 h-3' />
                        <span>
                          Due:{' '}
                          {format(
                            new Date(item.estimated_completion),
                            'MMM dd, yyyy'
                          )}
                        </span>
                      </div>
                    </div>

                    <div className='flex gap-2 mt-4'>
                      <Button size='sm' variant='outline' className='flex-1'>
                        View Details
                      </Button>
                      <Button size='sm' variant='outline'>
                        <TrendingUp className='w-3 h-3' />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
