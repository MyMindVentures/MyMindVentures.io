import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { CheckCircle, Clock, Target, TrendingUp } from 'lucide-react';
import { RoadmapMilestone } from '../types';

interface RoadmapViewProps {
  roadmapMilestones: RoadmapMilestone[];
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmapMilestones,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className='w-5 h-5 text-green-400' />;
      case 'in-progress':
        return <Clock className='w-5 h-5 text-blue-400' />;
      case 'planned':
        return <Target className='w-5 h-5 text-gray-400' />;
      default:
        return <Target className='w-5 h-5 text-gray-400' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-500/10';
      case 'in-progress':
        return 'border-blue-500 bg-blue-500/10';
      case 'planned':
        return 'border-gray-500 bg-gray-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className='space-y-8'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-center'
      >
        <h2 className='text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent'>
          🗺️ Development Roadmap
        </h2>
        <p className='text-xl text-gray-300 mb-8 max-w-3xl mx-auto'>
          Een gestructureerde timeline voor de ontwikkeling en lancering van
          onze joint venture
        </p>
      </motion.div>

      {/* Timeline Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className='p-8'>
          <h3 className='text-2xl font-bold mb-6 text-center text-white'>
            📊 Timeline Overview
          </h3>
          <div className='grid md:grid-cols-4 gap-6'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <CheckCircle className='w-8 h-8 text-white' />
              </div>
              <h4 className='text-lg font-bold text-white mb-2'>Foundation</h4>
              <p className='text-gray-400 text-sm'>Q1 2025</p>
              <p className='text-green-400 text-sm font-semibold'>Completed</p>
            </div>
            <div className='text-center'>
              <div className='w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Clock className='w-8 h-8 text-white' />
              </div>
              <h4 className='text-lg font-bold text-white mb-2'>Development</h4>
              <p className='text-gray-400 text-sm'>Q2 2025</p>
              <p className='text-blue-400 text-sm font-semibold'>In Progress</p>
            </div>
            <div className='text-center'>
              <div className='w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Target className='w-8 h-8 text-white' />
              </div>
              <h4 className='text-lg font-bold text-white mb-2'>Launch</h4>
              <p className='text-gray-400 text-sm'>Q3-Q4 2025</p>
              <p className='text-orange-400 text-sm font-semibold'>Planned</p>
            </div>
            <div className='text-center'>
              <div className='w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <TrendingUp className='w-8 h-8 text-white' />
              </div>
              <h4 className='text-lg font-bold text-white mb-2'>Scale</h4>
              <p className='text-gray-400 text-sm'>2026+</p>
              <p className='text-purple-400 text-sm font-semibold'>Future</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Detailed Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className='text-2xl font-bold mb-6 text-center text-white'>
          🎯 Detailed Milestones
        </h3>
        <div className='space-y-6'>
          {roadmapMilestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            >
              <Card
                className={`p-6 border-l-4 ${getStatusColor(milestone.status)}`}
              >
                <div className='flex items-start gap-4'>
                  <div className='flex-shrink-0 mt-1'>
                    {getStatusIcon(milestone.status)}
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-4 mb-3'>
                      <h4 className='text-xl font-bold text-white'>
                        {milestone.title}
                      </h4>
                      <span className='px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm font-semibold'>
                        {milestone.quarter}
                      </span>
                    </div>
                    <p className='text-gray-300'>{milestone.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Key Deliverables */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className='p-8'>
          <h3 className='text-2xl font-bold mb-6 text-center text-white'>
            📦 Key Deliverables
          </h3>
          <div className='grid md:grid-cols-2 gap-8'>
            <div>
              <h4 className='text-lg font-semibold text-blue-400 mb-4'>
                Technical Deliverables
              </h4>
              <div className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <CheckCircle className='w-4 h-4 text-green-400' />
                  <span className='text-gray-300'>
                    Core platform architecture
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <CheckCircle className='w-4 h-4 text-green-400' />
                  <span className='text-gray-300'>
                    API documentation and SDKs
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <CheckCircle className='w-4 h-4 text-green-400' />
                  <span className='text-gray-300'>
                    Security and compliance framework
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <CheckCircle className='w-4 h-4 text-green-400' />
                  <span className='text-gray-300'>
                    Performance monitoring system
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <CheckCircle className='w-4 h-4 text-green-400' />
                  <span className='text-gray-300'>Automated testing suite</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className='text-lg font-semibold text-purple-400 mb-4'>
                Business Deliverables
              </h4>
              <div className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <CheckCircle className='w-4 h-4 text-green-400' />
                  <span className='text-gray-300'>
                    Market research and analysis
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <CheckCircle className='w-4 h-4 text-green-400' />
                  <span className='text-gray-300'>Go-to-market strategy</span>
                </div>
                <div className='flex items-center gap-3'>
                  <CheckCircle className='w-4 h-4 text-green-400' />
                  <span className='text-gray-300'>
                    Customer onboarding process
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <CheckCircle className='w-4 h-4 text-green-400' />
                  <span className='text-gray-300'>
                    Support and documentation
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <CheckCircle className='w-4 h-4 text-green-400' />
                  <span className='text-gray-300'>
                    Revenue optimization plan
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Risk Mitigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Card className='p-8 bg-gradient-to-r from-orange-600 to-red-600'>
          <h3 className='text-2xl font-bold mb-6 text-center text-white'>
            ⚠️ Risk Mitigation Strategy
          </h3>
          <div className='grid md:grid-cols-3 gap-6'>
            <div className='text-center'>
              <div className='text-3xl mb-3'>🛡️</div>
              <h4 className='text-lg font-bold text-white mb-2'>
                Technical Risks
              </h4>
              <p className='text-orange-100 text-sm'>
                Comprehensive testing, backup systems, and gradual rollout
                strategy
              </p>
            </div>
            <div className='text-center'>
              <div className='text-3xl mb-3'>📊</div>
              <h4 className='text-lg font-bold text-white mb-2'>
                Market Risks
              </h4>
              <p className='text-orange-100 text-sm'>
                Continuous market research, flexible pricing, and customer
                feedback loops
              </p>
            </div>
            <div className='text-center'>
              <div className='text-3xl mb-3'>🤝</div>
              <h4 className='text-lg font-bold text-white mb-2'>
                Partnership Risks
              </h4>
              <p className='text-orange-100 text-sm'>
                Clear agreements, regular communication, and shared governance
                structure
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
