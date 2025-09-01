import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Activity, 
  Clock, 
  User,
  GitCommit,
  Lightbulb,
  Rocket,
  FileText,
  Database,
  Filter,
  Search,
  Calendar,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabaseService as db } from '../../lib/supabase';
import { format } from 'date-fns';

interface AppBuildLogProps {
  onBack: () => void;
}

interface BuildLogEntry {
  id: string;
  action_type: string;
  action_description: string;
  timestamp: string;
  user_id: string;
  related_id?: string;
  metadata?: any;
  created_at: string;
}

export const AppBuildLog: React.FC<AppBuildLogProps> = ({ onBack }) => {
  const [logEntries, setLogEntries] = useState<BuildLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    loadBuildLog();
  }, []);

  const loadBuildLog = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await db.getBuildLog('demo-user', 100);
      if (data) {
        setLogEntries(data);
      }
      if (error) {
        console.error('Error loading build log:', error);
      }
    } catch (error) {
      console.error('Error loading build log:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'blueprint_snippet':
        return <Lightbulb className="w-4 h-4 text-yellow-400" />;
      case 'commit':
        return <GitCommit className="w-4 h-4 text-purple-400" />;
      case 'publication':
        return <Rocket className="w-4 h-4 text-green-400" />;
      case 'blueprint_file':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'special_page':
        return <Database className="w-4 h-4 text-cyan-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'blueprint_snippet':
        return 'border-yellow-400/30 bg-yellow-500/10';
      case 'commit':
        return 'border-purple-400/30 bg-purple-500/10';
      case 'publication':
        return 'border-green-400/30 bg-green-500/10';
      case 'blueprint_file':
        return 'border-blue-400/30 bg-blue-500/10';
      case 'special_page':
        return 'border-cyan-400/30 bg-cyan-500/10';
      default:
        return 'border-gray-400/30 bg-gray-500/10';
    }
  };

  const filteredEntries = logEntries.filter(entry => {
    const matchesSearch = entry.action_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.action_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || entry.action_type === filterType;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const entryDate = new Date(entry.timestamp);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = entryDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = entryDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = entryDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesFilter && matchesDate;
  });

  const actionTypes = ['all', 'blueprint_snippet', 'commit', 'publication', 'blueprint_file', 'special_page'];
  const dateFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ];

  const getActivityStats = () => {
    const today = new Date().toDateString();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      total: logEntries.length,
      today: logEntries.filter(e => new Date(e.timestamp).toDateString() === today).length,
      thisWeek: logEntries.filter(e => new Date(e.timestamp) >= weekAgo).length,
      byType: actionTypes.slice(1).reduce((acc, type) => {
        acc[type] = logEntries.filter(e => e.action_type === type).length;
        return acc;
      }, {} as Record<string, number>),
    };
  };

  const stats = getActivityStats();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Build Management
          </Button>
          <h1 className="text-2xl font-bold text-white">App Build Log</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="secondary" size="sm" onClick={loadBuildLog}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Log
          </Button>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Activities', value: stats.total.toString(), icon: Activity, color: 'text-cyan-400' },
          { label: 'Today', value: stats.today.toString(), icon: Calendar, color: 'text-green-400' },
          { label: 'This Week', value: stats.thisWeek.toString(), icon: Clock, color: 'text-purple-400' },
          { label: 'Snippets', value: stats.byType.blueprint_snippet?.toString() || '0', icon: Lightbulb, color: 'text-yellow-400' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30"
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-gray-400 text-xs">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search activities..."
            className="w-64"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            <option value="all">All Types</option>
            <option value="blueprint_snippet">Blueprint Snippets</option>
            <option value="commit">Commits</option>
            <option value="publication">Publications</option>
            <option value="blueprint_file">AI Blueprints</option>
            <option value="special_page">Special Pages</option>
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            {dateFilters.map(filter => (
              <option key={filter.value} value={filter.value}>{filter.label}</option>
            ))}
          </select>
        </div>
        
        <div className="text-sm text-gray-400">
          {filteredEntries.length} activities
        </div>
      </div>

      {/* Build Log Timeline */}
      <Card title="Build Activity Timeline" gradient>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {searchTerm || filterType !== 'all' || dateFilter !== 'all'
                ? 'No activities match your filters'
                : 'No build activities yet. Start creating blueprint snippets to see activity logs.'
              }
            </div>
          ) : (
            filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative p-4 rounded-lg border ${getActionColor(entry.action_type)}`}
              >
                {/* Timeline connector */}
                {index < filteredEntries.length - 1 && (
                  <div className="absolute left-6 top-16 w-px h-8 bg-gray-600/50" />
                )}
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center border border-gray-600/50">
                    {getActionIcon(entry.action_type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-300 capitalize">
                            {entry.action_type.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(entry.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                          </span>
                        </div>
                        <p className="text-white font-medium text-sm">{entry.action_description}</p>
                        
                        {/* Metadata display */}
                        {entry.metadata && (
                          <div className="mt-2 space-y-1">
                            {entry.metadata.themes && (
                              <div className="flex flex-wrap gap-1">
                                {entry.metadata.themes.map((theme: string) => (
                                  <span
                                    key={theme}
                                    className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded text-xs"
                                  >
                                    {theme}
                                  </span>
                                ))}
                              </div>
                            )}
                            {entry.metadata.branch && (
                              <span className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded">
                                Branch: {entry.metadata.branch}
                              </span>
                            )}
                            {entry.metadata.version && (
                              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                Version: {entry.metadata.version}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>

      {/* Activity Summary by Type */}
      <Card title="Activity Summary by Type">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(stats.byType).map(([type, count]) => {
            const Icon = getActionIcon(type).type;
            return (
              <div
                key={type}
                className="text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/30"
              >
                <div className="flex justify-center mb-2">
                  {getActionIcon(type)}
                </div>
                <div className="text-lg font-bold text-white">{count}</div>
                <div className="text-xs text-gray-400 capitalize">
                  {type.replace('_', ' ')}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};