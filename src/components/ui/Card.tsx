import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  gradient = false,
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 overflow-hidden ${
        gradient ? 'border-gradient-to-r from-cyan-500/20 to-purple-500/20' : ''
      } ${className}`}
    >
      <div className='p-6'>
        <h3 className='text-lg font-semibold text-white mb-4 flex items-center'>
          {gradient && (
            <div className='w-2 h-2 h-6 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full mr-3' />
          )}
          {title}
        </h3>
        {children}
      </div>
    </motion.div>
  );
};

// Card subcomponents for AIInsightsManager
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`border-b border-gray-700/50 pb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <h3 className={`text-lg font-semibold text-white ${className}`}>
    {children}
  </h3>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`pt-4 ${className}`}>
    {children}
  </div>
);
