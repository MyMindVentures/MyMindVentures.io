import React from 'react';
import { Card } from '../../../components/ui/Card';
import { DevelopmentPhase } from '../types';

interface RoadmapViewProps {
  developmentPhases: DevelopmentPhase[];
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  developmentPhases,
}) => {
  return (
    <div className='space-y-8'>
      {/* Development Timeline */}
      <Card>
        <div className='p-6'>
          <h3 className='text-xl font-bold mb-6 text-center'>
            🗓️ Development Roadmap
          </h3>
          <div className='space-y-6'>
            {developmentPhases.map((phase, index) => (
              <div
                key={phase.id}
                className={`flex items-start gap-4 p-4 bg-gradient-to-r ${phase.color} rounded-lg`}
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
                  <phase.icon className='w-8 h-8 text-white' />
                </div>
                <div>
                  <h4 className='font-semibold mb-2'>{phase.title}</h4>
                  <ul className='space-y-1 text-sm text-gray-300'>
                    {phase.features.map((feature, featureIndex) => (
                      <li key={featureIndex}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* JointVenture Preparation */}
      <Card>
        <div className='p-6'>
          <h4 className='text-lg font-bold mb-4'>
            🤝 JointVenture Preparation
          </h4>
          <div className='grid md:grid-cols-2 gap-6'>
            <div className='p-4 bg-gray-800 rounded-lg'>
              <h5 className='font-semibold mb-3 text-purple-400'>
                📄 NFT Contract Preparation
              </h5>
              <ul className='space-y-2 text-sm'>
                <li>• Smart contract development</li>
                <li>• Co-ownership terms definition</li>
                <li>• Revenue sharing mechanisms</li>
                <li>• Governance structure</li>
                <li>• Legal compliance review</li>
              </ul>
            </div>
            <div className='p-4 bg-gray-800 rounded-lg'>
              <h5 className='font-semibold mb-3 text-blue-400'>
                ✍️ Digital Signing Process
              </h5>
              <ul className='space-y-2 text-sm'>
                <li>• Voorcontract digitalisering</li>
                <li>• E-signature integration</li>
                <li>• Multi-party signing workflow</li>
                <li>• Audit trail creation</li>
                <li>• Legal validity verification</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
