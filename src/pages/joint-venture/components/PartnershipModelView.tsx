import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { CheckCircle, Clock, Users, Target } from 'lucide-react';
import { PartnershipBenefit, PartnershipPhase } from '../types';

interface PartnershipModelViewProps {
  partnershipBenefits: PartnershipBenefit[];
  partnershipPhases: PartnershipPhase[];
}

export const PartnershipModelView: React.FC<PartnershipModelViewProps> = ({
  partnershipBenefits,
  partnershipPhases,
}) => {
  return (
    <div className='space-y-8'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-center'
      >
        <h2 className='text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'>
          🤝 Partnership Model
        </h2>
        <p className='text-xl text-gray-300 mb-8 max-w-3xl mx-auto'>
          Een gestructureerde aanpak voor succesvolle samenwerking en gedeelde
          waardecreatie
        </p>
      </motion.div>

      {/* Partnership Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h3 className='text-2xl font-bold mb-6 text-center text-white'>
          🎯 Partnership Voordelen
        </h3>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {partnershipBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              <Card className='p-6 text-center h-full'>
                <div className='text-4xl mb-4'>{benefit.icon}</div>
                <h4 className='text-lg font-bold text-white mb-2'>
                  {benefit.title}
                </h4>
                <p className='text-gray-400 text-sm'>{benefit.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Partnership Structure */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className='p-8'>
          <h3 className='text-2xl font-bold mb-6 text-center text-white'>
            🏗️ Partnership Structure
          </h3>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Users className='w-8 h-8 text-white' />
              </div>
              <h4 className='text-lg font-bold text-white mb-2'>Governance</h4>
              <p className='text-gray-400 text-sm'>
                Shared decision-making met duidelijke rollen en
                verantwoordelijkheden
              </p>
            </div>
            <div className='text-center'>
              <div className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Target className='w-8 h-8 text-white' />
              </div>
              <h4 className='text-lg font-bold text-white mb-2'>
                Resource Sharing
              </h4>
              <p className='text-gray-400 text-sm'>
                Optimale benutting van expertise, technologie en markttoegang
              </p>
            </div>
            <div className='text-center'>
              <div className='w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                <CheckCircle className='w-8 h-8 text-white' />
              </div>
              <h4 className='text-lg font-bold text-white mb-2'>
                Risk Management
              </h4>
              <p className='text-gray-400 text-sm'>
                Gedistribueerde risico's en gedeelde verantwoordelijkheid voor
                succes
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Partnership Phases */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3 className='text-2xl font-bold mb-6 text-center text-white'>
          📅 Partnership Phases
        </h3>
        <div className='space-y-6'>
          {partnershipPhases.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
            >
              <Card className='p-6'>
                <div className='flex items-start gap-4'>
                  <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0'>
                    {index + 1}
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-4 mb-3'>
                      <h4 className='text-xl font-bold text-white'>
                        {phase.phase}
                      </h4>
                      <div className='flex items-center gap-2 text-sm text-gray-400'>
                        <Clock className='w-4 h-4' />
                        {phase.duration}
                      </div>
                    </div>
                    <p className='text-gray-300 mb-4'>{phase.description}</p>
                    <div className='grid md:grid-cols-2 gap-2'>
                      {phase.deliverables.map(
                        (deliverable, deliverableIndex) => (
                          <div
                            key={deliverableIndex}
                            className='flex items-center gap-2'
                          >
                            <CheckCircle className='w-4 h-4 text-green-400 flex-shrink-0' />
                            <span className='text-gray-400 text-sm'>
                              {deliverable}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Success Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Card className='p-8 bg-gradient-to-r from-purple-600 to-pink-600'>
          <h3 className='text-2xl font-bold mb-6 text-center text-white'>
            📊 Success Metrics & KPIs
          </h3>
          <div className='grid md:grid-cols-2 gap-8'>
            <div>
              <h4 className='text-lg font-semibold text-purple-200 mb-4'>
                Development Metrics
              </h4>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-purple-100'>Code Quality Score</span>
                  <span className='text-white font-semibold'>&gt; 90%</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-purple-100'>Test Coverage</span>
                  <span className='text-white font-semibold'>&gt; 85%</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-purple-100'>Deployment Frequency</span>
                  <span className='text-white font-semibold'>Daily</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-purple-100'>Mean Time to Recovery</span>
                  <span className='text-white font-semibold'>&lt; 1 hour</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className='text-lg font-semibold text-pink-200 mb-4'>
                Business Metrics
              </h4>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-pink-100'>User Acquisition Rate</span>
                  <span className='text-white font-semibold'>&gt; 20% MoM</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-pink-100'>Customer Satisfaction</span>
                  <span className='text-white font-semibold'>&gt; 4.5/5</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-pink-100'>Revenue Growth</span>
                  <span className='text-white font-semibold'>&gt; 30% YoY</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-pink-100'>Market Share</span>
                  <span className='text-white font-semibold'>&gt; 5%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
