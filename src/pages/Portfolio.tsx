import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Rocket, Target, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { OverviewView } from './portfolio/components/OverviewView';
import { DetailedView } from './portfolio/components/DetailedView';
import { RoadmapView } from './portfolio/components/RoadmapView';
import { ProofOfExistenceView } from './portfolio/components/ProofOfExistenceView';
import { usePortfolioData } from './portfolio/hooks/usePortfolioData';
import { PortfolioView } from './portfolio/types';

export const Portfolio: React.FC = () => {
  const [selectedView, setSelectedView] = useState<PortfolioView>('overview');
  const {
    portfolioApps,
    portfolioStats,
    developmentPhases,
    proofOfExistenceSteps,
  } = usePortfolioData();

  const navigationTabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'detailed', label: 'Detailed Apps', icon: Rocket },
    { id: 'roadmap', label: 'Development Roadmap', icon: Target },
    { id: 'proof-of-existence', label: 'Proof of Existence', icon: Shield },
  ];

  const renderContent = () => {
    switch (selectedView) {
      case 'overview':
        return (
          <OverviewView
            portfolioApps={portfolioApps}
            portfolioStats={portfolioStats}
          />
        );
      case 'detailed':
        return <DetailedView portfolioApps={portfolioApps} />;
      case 'roadmap':
        return <RoadmapView developmentPhases={developmentPhases} />;
      case 'proof-of-existence':
        return (
          <ProofOfExistenceView proofOfExistenceSteps={proofOfExistenceSteps} />
        );
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-gray-900 text-white p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold mb-2'>📱 Portfolio</h1>
          <p className='text-gray-400'>
            4 revolutionaire apps - volledig gedetailleerd en klaar voor
            development
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className='flex gap-2 mb-6'>
          {navigationTabs.map(tab => (
            <Button
              key={tab.id}
              onClick={() => setSelectedView(tab.id as PortfolioView)}
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
