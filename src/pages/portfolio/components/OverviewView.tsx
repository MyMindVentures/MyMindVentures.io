import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Clock, Target, TrendingUp, Rocket } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { AppPortfolio, PortfolioStats } from '../types';

interface OverviewViewProps {
  portfolioApps: AppPortfolio[];
  portfolioStats: PortfolioStats | null;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  portfolioApps,
  portfolioStats,
}) => {
  if (!portfolioStats) return null;

  return (
    <div className='space-y-8'>
      {/* Hero Section */}
      <Card className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-purple-900 via-blue-900 to-pink-900 opacity-20'></div>
        <div className='relative p-8 text-center'>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className='mb-6'
          >
            <Rocket className='w-24 h-24 mx-auto text-purple-400 mb-4' />
            <h1 className='text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent'>
              🚀 Portfolio van Revolutionaire Apps
            </h1>
            <p className='text-xl text-gray-300 mb-6'>
              4 volledig gedetailleerde apps - maanden van blueprinting klaar
              voor development
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className='grid md:grid-cols-4 gap-6'
          >
            {portfolioApps.map((app, index) => (
              <div
                key={app.id}
                className='p-6 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg border border-purple-500'
              >
                <app.icon className='w-12 h-12 mx-auto text-purple-400 mb-3' />
                <h3 className='text-lg font-semibold mb-2'>{app.name}</h3>
                <p className='text-sm text-gray-300 mb-3'>{app.tagline}</p>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    app.status === 'live'
                      ? 'bg-green-600'
                      : app.status === 'beta'
                        ? 'bg-yellow-600'
                        : 'bg-blue-600'
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </Card>

      {/* Portfolio Stats */}
      <Card>
        <div className='p-6'>
          <h3 className='text-xl font-bold mb-6 text-center'>
            📊 Portfolio Statistieken
          </h3>
          <div className='grid md:grid-cols-4 gap-6'>
            <div className='text-center p-4 bg-gradient-to-r from-blue-900 to-cyan-900 rounded-lg'>
              <Brain className='w-12 h-12 mx-auto text-blue-400 mb-3' />
              <h4 className='font-semibold mb-2'>Apps in Portfolio</h4>
              <p className='text-2xl font-bold'>{portfolioStats.totalApps}</p>
              <p className='text-xs text-gray-400'>Revolutionaire concepten</p>
            </div>
            <div className='text-center p-4 bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg'>
              <Clock className='w-12 h-12 mx-auto text-purple-400 mb-3' />
              <h4 className='font-semibold mb-2'>Blueprinting Tijd</h4>
              <p className='text-2xl font-bold'>
                {portfolioStats.blueprintingTime}
              </p>
              <p className='text-xs text-gray-400'>Gedetailleerde planning</p>
            </div>
            <div className='text-center p-4 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg'>
              <Target className='w-12 h-12 mx-auto text-green-400 mb-3' />
              <h4 className='font-semibold mb-2'>Target Markets</h4>
              <p className='text-2xl font-bold'>
                {portfolioStats.targetMarkets}+
              </p>
              <p className='text-xs text-gray-400'>Verschillende user types</p>
            </div>
            <div className='text-center p-4 bg-gradient-to-r from-pink-900 to-rose-900 rounded-lg'>
              <TrendingUp className='w-12 h-12 mx-auto text-pink-400 mb-3' />
              <h4 className='font-semibold mb-2'>Revenue Models</h4>
              <p className='text-2xl font-bold'>
                {portfolioStats.revenueModels}
              </p>
              <p className='text-xs text-gray-400'>Diversified income</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Proof of Existence */}
      <Card>
        <div className='p-6'>
          <h3 className='text-xl font-bold mb-6 text-center'>
            🔐 Proof of Existence Strategy
          </h3>
          <div className='grid md:grid-cols-3 gap-6'>
            <div className='p-4 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg'>
              <h4 className='font-semibold mb-3 text-purple-400'>
                📱 App Completion
              </h4>
              <ul className='space-y-2 text-sm'>
                <li>• Alle 4 apps volledig ontwikkeld</li>
                <li>• Functionaliteit getest en gevalideerd</li>
                <li>• User experience geoptimaliseerd</li>
                <li>• Performance benchmarks behaald</li>
              </ul>
            </div>
            <div className='p-4 bg-gradient-to-r from-blue-900 to-cyan-900 rounded-lg'>
              <h4 className='font-semibold mb-3 text-blue-400'>
                🔗 Codebase Hashing
              </h4>
              <ul className='space-y-2 text-sm'>
                <li>• Complete codebase gehashed</li>
                <li>• SHA-256 hash gegenereerd</li>
                <li>• Timestamp en metadata toegevoegd</li>
                <li>• Immutable proof of creation</li>
              </ul>
            </div>
            <div className='p-4 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg'>
              <h4 className='font-semibold mb-3 text-green-400'>
                📄 Proof of Existence
              </h4>
              <ul className='space-y-2 text-sm'>
                <li>• Hash geüpload naar blockchain</li>
                <li>• Permanent timestamped record</li>
                <li>• Verifiable proof of ownership</li>
                <li>• Voor JointVenture onderhandelingen</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
