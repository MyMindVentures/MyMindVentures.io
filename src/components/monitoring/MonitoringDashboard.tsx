import React, { useState, useEffect } from 'react';
import { monitoringManager } from '../../lib/monitoring/MonitoringManager';
import { analyticsService } from '../../lib/monitoring/AnalyticsService';

interface MonitoringDashboardProps {
  variant?: 'compact' | 'card' | 'detailed';
  className?: string;
}

export const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({
  variant = 'compact',
  className = ''
}) => {
  const [healthReport, setHealthReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMonitoringData();
    const interval = setInterval(loadMonitoringData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadMonitoringData = async () => {
    try {
      setIsLoading(true);
      const health = await monitoringManager.getHealthReport();
      setHealthReport(health);
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monitoring Status</h3>
        {isLoading ? (
          <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${healthReport?.isHealthy ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">
              {healthReport?.isHealthy ? 'Healthy' : 'Unhealthy'}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Monitoring Dashboard</h3>
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Health Status</h4>
            <div className="text-sm text-gray-600">
              Status: {healthReport?.isHealthy ? 'Healthy' : 'Unhealthy'}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Environment</h4>
            <div className="text-sm text-gray-600">
              {healthReport?.config?.environment || 'Unknown'}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Initialized</h4>
            <div className="text-sm text-gray-600">
              {healthReport?.isInitialized ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitoringDashboard;
