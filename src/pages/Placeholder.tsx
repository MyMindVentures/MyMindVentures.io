import React from 'react';
import { motion } from 'framer-motion';
import { Construction, Zap } from 'lucide-react';
import { Card } from '../components/ui/Card';

interface PlaceholderProps {
  title: string;
  description: string;
}

export const Placeholder: React.FC<PlaceholderProps> = ({ title, description }) => {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Card title={title} gradient>
          <div className="text-center py-12 space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center">
                <Construction className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">{title}</h2>
              <p className="text-gray-400 leading-relaxed">{description}</p>
            </div>

            <div className="flex items-center justify-center space-x-2 text-cyan-400">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};