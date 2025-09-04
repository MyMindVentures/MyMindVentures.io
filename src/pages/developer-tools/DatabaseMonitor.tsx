import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Database,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  TrendingUp,
  Server,
  Zap,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { db } from '../../lib/supabase';
import { format } from 'date-fns';

interface DatabaseMonitorProps {
  onBack: () => void;
}

interface DatabaseMetric {
  id: string;
  name: string;
  value: string;
  status: 'healthy' | 'warning' | 'error';
  lastUpdated: string;
}

export const DatabaseMonitor: React.FC<DatabaseMonitorProps> = ({ onBack }) => {
  const [metrics, setMetrics] = useState<DatabaseMetric[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      // Simulate database metrics (replace with actual monitoring)
      const mockMetrics: DatabaseMetric[] = [
        {
          id: '1',
          name: 'Database Connections',
          value: '12/100',
          status: 'healthy',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Query Response Time',
          value: '45ms',
          status: 'healthy',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Storage Usage',
          value: '2.3GB/10GB',
          status: 'healthy',
          lastUpdated: new Date().toISOString(),
        },
        {
          id: '4',
          name: 'API Rate Limit',
          value: '850/1000',
          status: 'warning',
          lastUpdated: new Date().toISOString(),
        },
      ];

      setMetrics(mockMetrics);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'error':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className='w-4 h-4' />;
      case 'warning':
        return <AlertTriangle className='w-4 h-4' />;
      case 'error':
        return <AlertTriangle className='w-4 h-4' />;
      default:
        return <Activity className='w-4 h-4' />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className='p-6 space-y-6'
    >
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button variant='ghost' onClick={onBack}>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to App Management
          </Button>
          <h1 className='text-2xl font-bold text-white'>Database Monitor</h1>
        </div>

        <div className='flex items-center space-x-4'>
          <span className='text-sm text-gray-400'>
            Last updated: {format(lastRefresh, 'HH:mm:ss')}
          </span>
          <Button
            variant='secondary'
            size='sm'
            onClick={loadMetrics}
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${getStatusColor(metric.status)}`}
          >
            <div className='flex items-center justify-between mb-2'>
              <span className='text-white font-medium text-sm'>
                {metric.name}
              </span>
              {getStatusIcon(metric.status)}
            </div>
            <div className='text-2xl font-bold text-white mb-1'>
              {metric.value}
            </div>
            <div className='text-xs text-gray-400'>
              Updated {format(new Date(metric.lastUpdated), 'HH:mm')}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Monitoring */}
      <Card title='Real-time Monitoring' gradient>
        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='p-4 bg-gray-800/30 rounded-lg'>
              <div className='flex items-center space-x-2 mb-2'>
                <Server className='w-4 h-4 text-cyan-400' />
                <span className='text-white font-medium'>Database Health</span>
              </div>
              <div className='text-green-400 text-sm'>
                All systems operational
              </div>
            </div>

            <div className='p-4 bg-gray-800/30 rounded-lg'>
              <div className='flex items-center space-x-2 mb-2'>
                <Zap className='w-4 h-4 text-purple-400' />
                <span className='text-white font-medium'>API Performance</span>
              </div>
              <div className='text-green-400 text-sm'>
                Response time: 45ms avg
              </div>
            </div>

            <div className='p-4 bg-gray-800/30 rounded-lg'>
              <div className='flex items-center space-x-2 mb-2'>
                <TrendingUp className='w-4 h-4 text-green-400' />
                <span className='text-white font-medium'>Usage Trends</span>
              </div>
              <div className='text-green-400 text-sm'>Within normal limits</div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
