import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Map, Sparkles, Brain, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { TimelineView } from './components/TimelineView';
import { RoadmapView } from './components/RoadmapView';
import { FeaturesView } from './components/FeaturesView';
import { AIPromotionView } from './components/AIPromotionView';
import { UpdateModal } from './components/UpdateModal';
import { useTimelineData } from './hooks/useTimelineData';
import { format } from 'date-fns';

type ViewType = 'timeline' | 'roadmap' | 'features' | 'ai-promotion';

interface AppUpdatesTimelineProps {
  onBack: () => void;
}

export const AppUpdatesTimeline: React.FC<AppUpdatesTimelineProps> = ({
  onBack,
}) => {
  const [selectedView, setSelectedView] = useState<ViewType>('timeline');
  const [selectedUpdate, setSelectedUpdate] = useState<any>(null);
  const { timelineData, roadmapData, featuresData } = useTimelineData();

  const navigationTabs = [
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'features', label: 'Features', icon: Sparkles },
    { id: 'ai-promotion', label: 'AI Promotion', icon: Brain },
  ];

  const renderContent = () => {
    switch (selectedView) {
      case 'timeline':
        return (
          <TimelineView
            data={timelineData}
            onUpdateSelect={setSelectedUpdate}
          />
        );
      case 'roadmap':
        return <RoadmapView data={roadmapData} />;
      case 'features':
        return <FeaturesView data={featuresData} />;
      case 'ai-promotion':
        return <AIPromotionView />;
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-gray-900 text-white p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-8'>
          <Button onClick={onBack} variant='outline' size='sm'>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back
          </Button>
          <div>
            <h1 className='text-2xl font-bold'>🚀 App Updates Timeline</h1>
            <p className='text-gray-400'>
              Fantastic timeline/roadmap with AI-powered feature promotion
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className='flex gap-2 mb-6'>
          {navigationTabs.map(tab => (
            <Button
              key={tab.id}
              onClick={() => setSelectedView(tab.id as ViewType)}
              variant={selectedView === tab.id ? 'default' : 'outline'}
              size='sm'
            >
              <tab.icon className='w-4 h-4 mr-2' />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={selectedView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>

        {/* Selected Update Modal */}
        {selectedUpdate && (
          <UpdateModal
            update={selectedUpdate}
            onClose={() => setSelectedUpdate(null)}
          />
        )}
      </div>
    </div>
  );
};
