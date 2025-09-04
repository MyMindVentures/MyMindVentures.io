import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Zap,
  Star,
  TrendingUp,
  Users,
  Download,
  CheckCircle,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { TimelineUpdate } from '../hooks/useTimelineData';
import { format } from 'date-fns';

interface TimelineViewProps {
  data: TimelineUpdate[];
  onUpdateSelect: (update: TimelineUpdate) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  data,
  onUpdateSelect,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'released':
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
      case 'released':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'beta':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'planned':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className='space-y-6'>
      {/* Timeline Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold'>Release Timeline</h2>
          <p className='text-gray-400'>Track all app updates and releases</p>
        </div>
        <div className='flex items-center gap-4 text-sm text-gray-400'>
          <div className='flex items-center gap-2'>
            <CheckCircle className='w-4 h-4 text-green-500' />
            Released
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

      {/* Timeline Items */}
      <div className='space-y-4'>
        {data.map((update, index) => (
          <motion.div
            key={update.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className='p-6 hover:bg-gray-800/50 transition-colors cursor-pointer'
              onClick={() => onUpdateSelect(update)}
            >
              <div className='flex items-start gap-4'>
                {/* Status Icon */}
                <div className='flex-shrink-0 mt-1'>
                  {getStatusIcon(update.status)}
                </div>

                {/* Content */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-3 mb-2'>
                    <h3 className='text-lg font-semibold'>
                      {update.version_name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(update.status)}`}
                    >
                      v{update.version}
                    </span>
                    <span className='text-sm text-gray-400'>
                      {format(new Date(update.release_date), 'MMM dd, yyyy')}
                    </span>
                  </div>

                  <p className='text-gray-300 mb-3'>{update.changelog}</p>

                  {/* Stats */}
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                    <div className='flex items-center gap-2'>
                      <Star className='w-4 h-4 text-yellow-500' />
                      <span>{update.impact_score}/10</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <TrendingUp className='w-4 h-4 text-green-500' />
                      <span>{update.user_feedback}/5</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Download className='w-4 h-4 text-blue-500' />
                      <span>{update.downloads.toLocaleString()}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Users className='w-4 h-4 text-purple-500' />
                      <span>{update.category}</span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className='flex gap-2 mt-4'>
                    <Button size='sm' variant='outline'>
                      View Details
                    </Button>
                    <Button size='sm' variant='outline'>
                      <Download className='w-4 h-4 mr-1' />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
