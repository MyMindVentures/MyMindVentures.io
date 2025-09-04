import React from 'react';
import { X, Download, Share2, Star, TrendingUp, Users } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { TimelineUpdate } from '../hooks/useTimelineData';
import { format } from 'date-fns';

interface UpdateModalProps {
  update: TimelineUpdate;
  onClose: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  update,
  onClose,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'released':
        return 'text-green-400';
      case 'beta':
        return 'text-yellow-400';
      case 'planned':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-gray-700'>
          <div>
            <h3 className='text-lg font-semibold'>{update.version_name}</h3>
            <p className='text-sm text-gray-400'>
              v{update.version} •{' '}
              {format(new Date(update.release_date), 'MMM dd, yyyy')}
            </p>
          </div>
          <Button onClick={onClose} variant='outline' size='sm'>
            <X className='w-4 h-4' />
          </Button>
        </div>

        {/* Content */}
        <div className='p-4 overflow-y-auto max-h-[calc(80vh-80px)]'>
          <div className='space-y-6'>
            {/* Stats Overview */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='bg-gray-700/50 rounded-lg p-3'>
                <div className='flex items-center gap-2 mb-1'>
                  <Star className='w-4 h-4 text-yellow-500' />
                  <span className='text-sm text-gray-400'>Impact Score</span>
                </div>
                <div className='text-xl font-bold text-yellow-400'>
                  {update.impact_score}/10
                </div>
              </div>

              <div className='bg-gray-700/50 rounded-lg p-3'>
                <div className='flex items-center gap-2 mb-1'>
                  <TrendingUp className='w-4 h-4 text-green-500' />
                  <span className='text-sm text-gray-400'>User Rating</span>
                </div>
                <div className='text-xl font-bold text-green-400'>
                  {update.user_feedback}/5
                </div>
              </div>

              <div className='bg-gray-700/50 rounded-lg p-3'>
                <div className='flex items-center gap-2 mb-1'>
                  <Download className='w-4 h-4 text-blue-500' />
                  <span className='text-sm text-gray-400'>Downloads</span>
                </div>
                <div className='text-xl font-bold text-blue-400'>
                  {update.downloads.toLocaleString()}
                </div>
              </div>

              <div className='bg-gray-700/50 rounded-lg p-3'>
                <div className='flex items-center gap-2 mb-1'>
                  <Users className='w-4 h-4 text-purple-500' />
                  <span className='text-sm text-gray-400'>Category</span>
                </div>
                <div className='text-xl font-bold text-purple-400'>
                  {update.category}
                </div>
              </div>
            </div>

            {/* Changelog */}
            <div>
              <h4 className='text-lg font-semibold mb-3'>Changelog</h4>
              <div className='bg-gray-700/30 rounded-lg p-4'>
                <div className='prose prose-invert max-w-none'>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: update.changelog.replace(/\n/g, '<br>'),
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            {update.features.length > 0 && (
              <div>
                <h4 className='text-lg font-semibold mb-3'>New Features</h4>
                <div className='grid gap-2'>
                  {update.features.map((feature, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg p-3'
                    >
                      <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                      <span className='text-sm'>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Improvements */}
            {update.improvements.length > 0 && (
              <div>
                <h4 className='text-lg font-semibold mb-3'>Improvements</h4>
                <div className='grid gap-2'>
                  {update.improvements.map((improvement, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3'
                    >
                      <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                      <span className='text-sm'>{improvement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fixes */}
            {update.fixes.length > 0 && (
              <div>
                <h4 className='text-lg font-semibold mb-3'>Bug Fixes</h4>
                <div className='grid gap-2'>
                  {update.fixes.map((fix, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg p-3'
                    >
                      <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                      <span className='text-sm'>{fix}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between p-4 border-t border-gray-700'>
          <div className='flex items-center gap-2'>
            <span className={`text-sm ${getStatusColor(update.status)}`}>
              Status:{' '}
              {update.status.charAt(0).toUpperCase() + update.status.slice(1)}
            </span>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' size='sm'>
              <Share2 className='w-4 h-4 mr-1' />
              Share
            </Button>
            <Button size='sm'>
              <Download className='w-4 h-4 mr-1' />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
