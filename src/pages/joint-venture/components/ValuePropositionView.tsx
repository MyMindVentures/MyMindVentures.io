import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../components/ui/Card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { ValueProposition } from '../types';

interface ValuePropositionViewProps {
  valuePropositions: ValueProposition[];
}

export const ValuePropositionView: React.FC<ValuePropositionViewProps> = ({
  valuePropositions,
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
        <h2 className='text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent'>
          💎 Value Proposition
        </h2>
        <p className='text-xl text-gray-300 mb-8 max-w-3xl mx-auto'>
          Unieke waarde die we samen kunnen creëren door onze krachten te
          bundelen
        </p>
      </motion.div>

      {/* Value Propositions Grid */}
      <div className='grid md:grid-cols-2 gap-8'>
        {valuePropositions.map((proposition, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card className='p-8 h-full'>
              <div className='flex items-start gap-4 mb-6'>
                <div className='text-4xl'>{proposition.icon}</div>
                <div>
                  <h3 className='text-2xl font-bold text-white mb-2'>
                    {proposition.title}
                  </h3>
                  <p className='text-gray-300'>{proposition.description}</p>
                </div>
              </div>

              <div className='space-y-3'>
                {proposition.benefits.map((benefit, benefitIndex) => (
                  <motion.div
                    key={benefitIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.3 + benefitIndex * 0.1,
                    }}
                    className='flex items-start gap-3'
                  >
                    <CheckCircle className='w-5 h-5 text-green-400 mt-0.5 flex-shrink-0' />
                    <span className='text-gray-300'>{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Competitive Advantage Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className='p-8 bg-gradient-to-r from-green-600 to-blue-600'>
          <div className='text-center'>
            <h3 className='text-3xl font-bold mb-4 text-white'>
              🏆 Competitive Advantage
            </h3>
            <p className='text-green-100 mb-6 text-lg'>
              Door onze unieke combinatie van technologie, expertise en
              marktpositie creëren we een onverslaanbare voorsprong in de markt.
            </p>
            <div className='grid md:grid-cols-3 gap-6 mt-8'>
              <div className='text-center'>
                <div className='text-3xl mb-2'>⚡</div>
                <h4 className='font-bold text-white mb-2'>Speed to Market</h4>
                <p className='text-green-100 text-sm'>
                  6-12 maanden sneller dan traditionele development
                </p>
              </div>
              <div className='text-center'>
                <div className='text-3xl mb-2'>🎯</div>
                <h4 className='font-bold text-white mb-2'>Market Fit</h4>
                <p className='text-green-100 text-sm'>
                  Bewezen concepten met uitgebreide market research
                </p>
              </div>
              <div className='text-center'>
                <div className='text-3xl mb-2'>🚀</div>
                <h4 className='font-bold text-white mb-2'>Scalability</h4>
                <p className='text-green-100 text-sm'>
                  Cloud-native architecture voor onbeperkte groei
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ROI Projection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className='p-8'>
          <h3 className='text-2xl font-bold mb-6 text-center text-white'>
            📊 Projected ROI & Timeline
          </h3>
          <div className='grid md:grid-cols-2 gap-8'>
            <div>
              <h4 className='text-lg font-semibold text-blue-400 mb-4'>
                Investment Timeline
              </h4>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-300'>Initial Investment</span>
                  <span className='text-white font-semibold'>€500K - €1M</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-300'>Development Phase</span>
                  <span className='text-white font-semibold'>12-18 months</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-300'>Break-even Point</span>
                  <span className='text-white font-semibold'>18-24 months</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-gray-300'>ROI Target</span>
                  <span className='text-green-400 font-semibold'>300-500%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className='text-lg font-semibold text-purple-400 mb-4'>
                Revenue Streams
              </h4>
              <div className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <CheckCircle className='w-4 h-4 text-green-400' />
                  <span className='text-gray-300'>Subscription Services</span>
                </div>
                <div className='flex items-center gap-3'>
                  <CheckCircle className='w-4 h-4 text-green-400' />
                  <span className='text-gray-300'>Enterprise Licensing</span>
                </div>
                <div className='flex items-center gap-3'>
                  <CheckCircle className='w-4 h-4 text-green-400' />
                  <span className='text-gray-300'>API & Integration Fees</span>
                </div>
                <div className='flex items-center gap-3'>
                  <CheckCircle className='w-4 h-4 text-green-400' />
                  <span className='text-gray-300'>Data Analytics Services</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
