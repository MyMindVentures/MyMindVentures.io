import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { AppPortfolio } from '../types';

interface DetailedViewProps {
  portfolioApps: AppPortfolio[];
}

export const DetailedView: React.FC<DetailedViewProps> = ({
  portfolioApps,
}) => {
  return (
    <div className='space-y-6'>
      {portfolioApps.map(app => (
        <Card
          key={app.id}
          className='cursor-pointer hover:scale-105 transition-transform'
        >
          <div className='p-6'>
            <div className='flex items-start gap-4 mb-6'>
              <div className='w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0'>
                <app.icon className='w-8 h-8 text-white' />
              </div>
              <div className='flex-1'>
                <div className='flex items-center gap-3 mb-2'>
                  <h3 className='text-xl font-bold'>{app.name}</h3>
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
                <p className='text-lg text-purple-400 mb-2'>{app.tagline}</p>
                <p className='text-gray-300 text-sm'>{app.description}</p>
              </div>
            </div>

            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <h4 className='font-semibold mb-3 text-blue-400'>
                  🚀 Key Features
                </h4>
                <ul className='space-y-1 text-sm'>
                  {app.features.map((feature, index) => (
                    <li key={index} className='flex items-center gap-2'>
                      <CheckCircle className='w-4 h-4 text-green-400' />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className='font-semibold mb-3 text-green-400'>
                  💻 Tech Stack
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {app.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className='px-2 py-1 bg-gray-800 rounded text-xs'
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className='grid md:grid-cols-3 gap-4 mt-6'>
              <div className='p-3 bg-gray-800 rounded'>
                <h5 className='font-semibold text-sm mb-1'>Target Users</h5>
                <p className='text-xs text-gray-300'>
                  {app.targetUsers.join(', ')}
                </p>
              </div>
              <div className='p-3 bg-gray-800 rounded'>
                <h5 className='font-semibold text-sm mb-1'>Revenue Model</h5>
                <p className='text-xs text-gray-300'>{app.revenueModel}</p>
              </div>
              <div className='p-3 bg-gray-800 rounded'>
                <h5 className='font-semibold text-sm mb-1'>Development Time</h5>
                <p className='text-xs text-gray-300'>{app.developmentTime}</p>
              </div>
            </div>

            <div className='mt-6 p-4 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg'>
              <h4 className='font-semibold mb-2 text-purple-400'>
                💎 Unique Value Proposition
              </h4>
              <p className='text-sm text-gray-300'>{app.uniqueValue}</p>
            </div>

            <div className='mt-4 p-3 bg-green-900 rounded-lg'>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-4 h-4 text-green-400' />
                <span className='text-sm font-semibold'>
                  {app.blueprintStatus}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
