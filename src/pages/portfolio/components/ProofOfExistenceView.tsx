import React from 'react';
import { Shield, TrendingUp, Star } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { ProofOfExistenceStep } from '../types';

interface ProofOfExistenceViewProps {
  proofOfExistenceSteps: ProofOfExistenceStep[];
}

export const ProofOfExistenceView: React.FC<ProofOfExistenceViewProps> = ({
  proofOfExistenceSteps,
}) => {
  return (
    <div className='space-y-8'>
      {/* Proof of Existence Process */}
      <Card>
        <div className='p-6'>
          <h3 className='text-xl font-bold mb-6 text-center'>
            🔐 Proof of Existence Process
          </h3>
          <div className='space-y-6'>
            {proofOfExistenceSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-start gap-4 p-4 bg-gradient-to-r ${step.color} rounded-lg`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                    index === 0
                      ? 'bg-purple-600'
                      : index === 1
                        ? 'bg-blue-600'
                        : index === 2
                          ? 'bg-green-600'
                          : 'bg-pink-600'
                  }`}
                >
                  <span className='text-white font-bold text-xl'>
                    {step.id}
                  </span>
                </div>
                <div>
                  <h4 className='font-semibold mb-2'>{step.title}</h4>
                  <ul className='space-y-1 text-sm text-gray-300'>
                    {step.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Benefits of Proof of Existence */}
      <Card>
        <div className='p-6'>
          <h4 className='text-lg font-bold mb-4'>
            💎 Voordelen van Proof of Existence
          </h4>
          <div className='grid md:grid-cols-3 gap-6'>
            <div className='text-center p-4 bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg'>
              <Shield className='w-12 h-12 mx-auto text-purple-400 mb-3' />
              <h5 className='font-semibold mb-2'>
                Intellectual Property Protection
              </h5>
              <p className='text-sm text-gray-300'>
                Permanent bewijs van creatie en ownership van je revolutionaire
                app concepten
              </p>
            </div>
            <div className='text-center p-4 bg-gradient-to-r from-blue-900 to-cyan-900 rounded-lg'>
              <TrendingUp className='w-12 h-12 mx-auto text-blue-400 mb-3' />
              <h5 className='font-semibold mb-2'>Negotiation Power</h5>
              <p className='text-sm text-gray-300'>
                Sterke positie in JointVenture onderhandelingen met concrete
                proof
              </p>
            </div>
            <div className='text-center p-4 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg'>
              <Star className='w-12 h-12 mx-auto text-green-400 mb-3' />
              <h5 className='font-semibold mb-2'>Investor Confidence</h5>
              <p className='text-sm text-gray-300'>
                Verhoogde geloofwaardigheid en vertrouwen van potentiële
                partners
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
