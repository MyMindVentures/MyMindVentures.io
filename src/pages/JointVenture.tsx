import React from 'react';
import { motion } from 'framer-motion';
import { Handshake, DollarSign, Users, Map } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PitchView } from './joint-venture/components/PitchView';
import { ValuePropositionView } from './joint-venture/components/ValuePropositionView';
import { PartnershipModelView } from './joint-venture/components/PartnershipModelView';
import { RoadmapView } from './joint-venture/components/RoadmapView';
import { useJointVentureData } from './joint-venture/hooks/useJointVentureData';
import { ViewType } from './joint-venture/types';

export const JointVenture: React.FC = () => {
  const {
    selectedView,
    setSelectedView,
    partnershipBenefits,
    partnershipPhases,
    roadmapMilestones,
    valuePropositions,
  } = useJointVentureData();

  const navigationTabs = [
    { id: 'pitch', label: 'The Pitch', icon: Handshake },
    { id: 'value-proposition', label: 'Value Proposition', icon: DollarSign },
    { id: 'partnership-model', label: 'Partnership Model', icon: Users },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
  ];

  const renderContent = () => {
    switch (selectedView) {
      case 'pitch':
        return <PitchView />;
      case 'value-proposition':
        return <ValuePropositionView valuePropositions={valuePropositions} />;
      case 'partnership-model':
        return (
          <PartnershipModelView
            partnershipBenefits={partnershipBenefits}
            partnershipPhases={partnershipPhases}
          />
        );
      case 'roadmap':
        return <RoadmapView roadmapMilestones={roadmapMilestones} />;
      default:
        return <PitchView />;
    }
  };

  return (
    <div className='min-h-screen bg-gray-900 text-white p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold mb-2'>
            🤝 Joint Venture Partnership
          </h1>
          <p className='text-gray-400'>
            Samen bouwen we de toekomst van digitale innovatie
          </p>
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
      </div>
    </div>
  );
};
