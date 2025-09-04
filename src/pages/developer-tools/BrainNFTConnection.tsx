import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Brain,
  Zap,
  Copy,
  Eye,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabaseService as db, supabase } from '../../lib/supabase';
import { format } from 'date-fns';

interface BrainNFTConnectionProps {
  onBack: () => void;
}

interface NFTContract {
  id: string;
  contract_name: string;
  contract_address: string;
  partner: 'perplexity' | 'bolt';
  partner_logo: string;
  partner_description: string;
  brain_connection_type: 'exclusive' | 'shared' | 'limited';
  token_uri: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
  };
  terms: string[];
  benefits: string[];
  created_at: string;
  expires_at?: string;
  status: 'draft' | 'proposed' | 'active' | 'expired';
}

interface JointVenture {
  id: string;
  venture_name: string;
  partners: string[];
  description: string;
  objectives: string[];
  revenue_sharing: {
    mymindventures: number;
    partner: number;
  };
  timeline: {
    start_date: string;
    end_date: string;
    milestones: Array<{
      date: string;
      description: string;
      status: 'pending' | 'completed' | 'delayed';
    }>;
  };
  brain_nft_contracts: string[];
  status: 'planning' | 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

export const BrainNFTConnection: React.FC<BrainNFTConnectionProps> = ({
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'contracts' | 'ventures' | 'analytics'
  >('overview');
  const [showPartnershipDetails, setShowPartnershipDetails] = useState(false);
  const [selectedContract, setSelectedContract] = useState<NFTContract | null>(
    null
  );
  const [selectedVenture, setSelectedVenture] = useState<JointVenture | null>(
    null
  );

  // Mock data for demonstration
  const mockContracts: NFTContract[] = [
    {
      id: '1',
      contract_name: 'Perplexity Brain Access',
      contract_address: '0x1234567890abcdef...',
      partner: 'perplexity',
      partner_logo: '/perplexity-logo.png',
      partner_description: 'Exclusive access to Perplexity AI models and APIs',
      brain_connection_type: 'exclusive',
      token_uri: 'ipfs://QmPerplexityBrain...',
      metadata: {
        name: 'Perplexity Brain NFT',
        description: 'Exclusive access to advanced AI capabilities',
        image: 'ipfs://QmBrainImage...',
        attributes: [
          { trait_type: 'AI Model', value: 'Perplexity Sonar' },
          { trait_type: 'Access Level', value: 'Exclusive' },
          { trait_type: 'Token Type', value: 'Brain Connection' },
        ],
      },
      terms: [
        'Exclusive access to Perplexity AI models',
        'Priority API rate limits',
        'Custom model fine-tuning',
        'Direct support from Perplexity team',
      ],
      benefits: [
        'Advanced AI capabilities',
        'Faster response times',
        'Custom integrations',
        'Revenue sharing opportunities',
      ],
      created_at: '2024-01-15T10:00:00Z',
      status: 'active',
    },
    {
      id: '2',
      contract_name: 'Bolt AI Partnership',
      contract_address: '0xabcdef1234567890...',
      partner: 'bolt',
      partner_logo: '/bolt-logo.png',
      partner_description: 'Shared access to Bolt AI infrastructure',
      brain_connection_type: 'shared',
      token_uri: 'ipfs://QmBoltBrain...',
      metadata: {
        name: 'Bolt AI Brain NFT',
        description: 'Shared access to Bolt AI capabilities',
        image: 'ipfs://QmBoltBrainImage...',
        attributes: [
          { trait_type: 'AI Model', value: 'Bolt Core' },
          { trait_type: 'Access Level', value: 'Shared' },
          { trait_type: 'Token Type', value: 'Brain Connection' },
        ],
      },
      terms: [
        'Shared access to Bolt AI models',
        'Standard API rate limits',
        'Community support',
        'Revenue sharing on usage',
      ],
      benefits: [
        'AI model access',
        'Community features',
        'Integration support',
        'Usage-based rewards',
      ],
      created_at: '2024-01-20T14:30:00Z',
      status: 'active',
    },
  ];

  const mockVentures: JointVenture[] = [
    {
      id: '1',
      venture_name: 'AI-Powered Content Platform',
      partners: ['Perplexity', 'MyMindVentures'],
      description:
        'A revolutionary content creation platform powered by advanced AI',
      objectives: [
        'Create AI-powered content generation tools',
        'Build a marketplace for AI-generated content',
        'Establish revenue sharing with content creators',
        'Develop advanced AI models for specific use cases',
      ],
      revenue_sharing: {
        mymindventures: 60,
        partner: 40,
      },
      timeline: {
        start_date: '2024-02-01',
        end_date: '2024-12-31',
        milestones: [
          {
            date: '2024-03-01',
            description: 'Platform MVP launch',
            status: 'completed',
          },
          {
            date: '2024-06-01',
            description: 'AI model integration',
            status: 'pending',
          },
          {
            date: '2024-09-01',
            description: 'Marketplace launch',
            status: 'pending',
          },
        ],
      },
      brain_nft_contracts: ['1', '2'],
      status: 'active',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
    },
  ];

  const analytics = {
    total_contracts: mockContracts.length,
    active_contracts: mockContracts.filter(c => c.status === 'active').length,
    total_ventures: mockVentures.length,
    active_ventures: mockVentures.filter(v => v.status === 'active').length,
    total_revenue: 125000,
    monthly_growth: 15.5,
    partner_distribution: {
      perplexity: 60,
      bolt: 40,
    },
  };

  return (
    <div className='min-h-screen bg-gray-900 text-white p-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div className='flex items-center space-x-4'>
          <button
            onClick={onBack}
            className='p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors'
          >
            <ArrowLeft className='w-5 h-5' />
          </button>
          <div>
            <h1 className='text-2xl font-bold flex items-center space-x-2'>
              <Brain className='w-8 h-8 text-cyan-400' />
              <span>Brain NFT Connections</span>
            </h1>
            <p className='text-gray-400'>
              Manage AI partnerships and joint ventures
            </p>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <div className='px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm'>
            <Zap className='w-4 h-4 inline mr-1' />
            Active
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className='flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1'>
        {[
          { id: 'overview', label: 'Overview', icon: Brain },
          { id: 'contracts', label: 'Contracts', icon: Copy },
          { id: 'ventures', label: 'Joint Ventures', icon: Eye },
          { id: 'analytics', label: 'Analytics', icon: Zap },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-cyan-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <tab.icon className='w-4 h-4' />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className='space-y-6'>
        {activeTab === 'overview' && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {/* Stats Cards */}
            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-400 text-sm'>Total Contracts</p>
                  <p className='text-2xl font-bold'>
                    {analytics.total_contracts}
                  </p>
                </div>
                <Copy className='w-8 h-8 text-blue-400' />
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-400 text-sm'>Active Ventures</p>
                  <p className='text-2xl font-bold'>
                    {analytics.active_ventures}
                  </p>
                </div>
                <Eye className='w-8 h-8 text-green-400' />
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-400 text-sm'>Total Revenue</p>
                  <p className='text-2xl font-bold'>
                    ${analytics.total_revenue.toLocaleString()}
                  </p>
                </div>
                <Zap className='w-8 h-8 text-yellow-400' />
              </div>
            </Card>

            <Card className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-gray-400 text-sm'>Monthly Growth</p>
                  <p className='text-2xl font-bold text-green-400'>
                    +{analytics.monthly_growth}%
                  </p>
                </div>
                <Zap className='w-8 h-8 text-green-400' />
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className='space-y-6'>
            <div className='flex justify-between items-center'>
              <h2 className='text-xl font-semibold'>NFT Contracts</h2>
              <Button className='bg-cyan-500 hover:bg-cyan-600'>
                <Copy className='w-4 h-4 mr-2' />
                New Contract
              </Button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {mockContracts.map(contract => (
                <Card key={contract.id} className='p-6'>
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center'>
                        <Brain className='w-6 h-6 text-white' />
                      </div>
                      <div>
                        <h3 className='font-semibold'>
                          {contract.contract_name}
                        </h3>
                        <p className='text-gray-400 text-sm'>
                          {contract.partner}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${
                        contract.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {contract.status}
                    </div>
                  </div>

                  <p className='text-gray-300 mb-4'>
                    {contract.partner_description}
                  </p>

                  <div className='flex items-center justify-between text-sm text-gray-400 mb-4'>
                    <span>Type: {contract.brain_connection_type}</span>
                    <span>
                      Created:{' '}
                      {format(new Date(contract.created_at), 'MMM dd, yyyy')}
                    </span>
                  </div>

                  <div className='flex space-x-2'>
                    <Button variant='outline' size='sm'>
                      <Eye className='w-4 h-4 mr-1' />
                      View
                    </Button>
                    <Button variant='outline' size='sm'>
                      <Copy className='w-4 h-4 mr-1' />
                      Copy Address
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ventures' && (
          <div className='space-y-6'>
            <div className='flex justify-between items-center'>
              <h2 className='text-xl font-semibold'>Joint Ventures</h2>
              <Button className='bg-cyan-500 hover:bg-cyan-600'>
                <Copy className='w-4 h-4 mr-2' />
                New Venture
              </Button>
            </div>

            <div className='space-y-6'>
              {mockVentures.map(venture => (
                <Card key={venture.id} className='p-6'>
                  <div className='flex items-start justify-between mb-4'>
                    <div>
                      <h3 className='text-xl font-semibold mb-2'>
                        {venture.venture_name}
                      </h3>
                      <p className='text-gray-400'>{venture.description}</p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm ${
                        venture.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {venture.status}
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                    <div>
                      <p className='text-gray-400 text-sm'>Partners</p>
                      <p className='font-medium'>
                        {venture.partners.join(', ')}
                      </p>
                    </div>
                    <div>
                      <p className='text-gray-400 text-sm'>Revenue Split</p>
                      <p className='font-medium'>
                        {venture.revenue_sharing.mymindventures}% /{' '}
                        {venture.revenue_sharing.partner}%
                      </p>
                    </div>
                    <div>
                      <p className='text-gray-400 text-sm'>Timeline</p>
                      <p className='font-medium'>
                        {format(
                          new Date(venture.timeline.start_date),
                          'MMM yyyy'
                        )}{' '}
                        -{' '}
                        {format(
                          new Date(venture.timeline.end_date),
                          'MMM yyyy'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className='flex space-x-2'>
                    <Button variant='outline' size='sm'>
                      <Eye className='w-4 h-4 mr-1' />
                      View Details
                    </Button>
                    <Button variant='outline' size='sm'>
                      <Copy className='w-4 h-4 mr-1' />
                      Manage
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className='space-y-6'>
            <h2 className='text-xl font-semibold'>Analytics Dashboard</h2>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <Card className='p-6'>
                <h3 className='text-lg font-semibold mb-4'>
                  Partner Distribution
                </h3>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-400'>Perplexity</span>
                    <span className='font-medium'>
                      {analytics.partner_distribution.perplexity}%
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-400'>Bolt</span>
                    <span className='font-medium'>
                      {analytics.partner_distribution.bolt}%
                    </span>
                  </div>
                </div>
              </Card>

              <Card className='p-6'>
                <h3 className='text-lg font-semibold mb-4'>Revenue Overview</h3>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-400'>Total Revenue</span>
                    <span className='font-medium'>
                      ${analytics.total_revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-400'>Monthly Growth</span>
                    <span className='font-medium text-green-400'>
                      +{analytics.monthly_growth}%
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
