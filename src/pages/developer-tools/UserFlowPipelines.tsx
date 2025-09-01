import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  GitBranch,
  ArrowRight,
  Circle,
  Square,
  Triangle,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Workflow
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface UserFlowPipelinesProps {
  onBack: () => void;
}

interface FlowStep {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'active' | 'pending' | 'error';
  duration?: string;
  dependencies?: string[];
}

interface Pipeline {
  id: string;
  name: string;
  description: string;
  steps: FlowStep[];
  status: 'running' | 'completed' | 'paused' | 'error';
}

export const UserFlowPipelines: React.FC<UserFlowPipelinesProps> = ({ onBack }) => {
  const [selectedPipeline, setSelectedPipeline] = useState<string>('development');

  const pipelines: Pipeline[] = [
    {
      id: 'development',
      name: 'Development Workflow',
      description: 'Complete development cycle from snippet to publication',
      status: 'running',
      steps: [
        { id: '1', name: 'Create Blueprint Snippets', description: 'Gather development notes and create themed snippets', status: 'completed', duration: '2h' },
        { id: '2', name: 'AI Analysis', description: 'Generate intelligent commit messages', status: 'active', duration: '5m' },
        { id: '3', name: 'Commit Creation', description: 'Create structured commits with full summaries', status: 'pending', dependencies: ['1', '2'] },
        { id: '4', name: 'Blueprint Generation', description: 'AI generates complete application blueprint', status: 'pending', dependencies: ['3'] },
        { id: '5', name: 'Documentation Update', description: 'Update special pages and user guides', status: 'pending', dependencies: ['4'] },
        { id: '6', name: 'Publication', description: 'Publish version with release notes', status: 'pending', dependencies: ['5'] }
      ]
    },
    {
      id: 'user-onboarding',
      name: 'User Onboarding Flow',
      description: 'New user registration and setup process',
      status: 'completed',
      steps: [
        { id: '1', name: 'Registration', description: 'User creates account', status: 'completed', duration: '2m' },
        { id: '2', name: 'Profile Setup', description: 'Configure user preferences', status: 'completed', duration: '5m' },
        { id: '3', name: 'API Configuration', description: 'Connect external services', status: 'completed', duration: '10m' },
        { id: '4', name: 'First Project', description: 'Create initial blueprint snippet', status: 'completed', duration: '15m' }
      ]
    },
    {
      id: 'ai-integration',
      name: 'AI Integration Pipeline',
      description: 'Automated AI analysis and content generation',
      status: 'paused',
      steps: [
        { id: '1', name: 'Data Collection', description: 'Gather uncommitted snippets', status: 'completed', duration: '1m' },
        { id: '2', name: 'OpenAI Analysis', description: 'Generate commit messages and summaries', status: 'error', duration: '30s' },
        { id: '3', name: 'Content Generation', description: 'Create blueprints and documentation', status: 'pending', dependencies: ['2'] },
        { id: '4', name: 'Quality Review', description: 'Validate generated content', status: 'pending', dependencies: ['3'] }
      ]
    }
  ];

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'active':
        return <Play className="w-4 h-4 text-blue-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-400/30 bg-green-500/10';
      case 'active':
        return 'border-blue-400/30 bg-blue-500/10';
      case 'error':
        return 'border-red-400/30 bg-red-500/10';
      default:
        return 'border-gray-400/30 bg-gray-500/10';
    }
  };

  const getPipelineStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-blue-400 bg-blue-500/10';
      case 'completed':
        return 'text-green-400 bg-green-500/10';
      case 'paused':
        return 'text-yellow-400 bg-yellow-500/10';
      case 'error':
        return 'text-red-400 bg-red-500/10';
      default:
        return 'text-gray-400 bg-gray-500/10';
    }
  };

  const selectedPipelineData = pipelines.find(p => p.id === selectedPipeline);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to App Management
        </Button>
        <h1 className="text-2xl font-bold text-white">UserFlow/Pipelines</h1>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pipelines.map((pipeline, index) => (
          <motion.div
            key={pipeline.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedPipeline === pipeline.id
                ? 'border-cyan-400/50 bg-cyan-500/10'
                : 'border-gray-700/30 bg-gray-800/30 hover:border-gray-600/50'
            }`}
            onClick={() => setSelectedPipeline(pipeline.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-medium">{pipeline.name}</h3>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${getPipelineStatusColor(pipeline.status)}`}>
                <Circle className="w-2 h-2 fill-current" />
                <span className="capitalize">{pipeline.status}</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">{pipeline.description}</p>
            <div className="mt-3 text-xs text-gray-500">
              {pipeline.steps.length} steps • {pipeline.steps.filter(s => s.status === 'completed').length} completed
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Pipeline Details */}
      {selectedPipelineData && (
        <Card title={selectedPipelineData.name} gradient>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-300">{selectedPipelineData.description}</p>
              <div className="flex items-center space-x-2">
                <Button variant="secondary" size="sm">
                  <Play className="w-3 h-3 mr-1" />
                  Start
                </Button>
                <Button variant="secondary" size="sm">
                  <Pause className="w-3 h-3 mr-1" />
                  Pause
                </Button>
                <Button variant="secondary" size="sm">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Pipeline Steps */}
            <div className="space-y-3">
              {selectedPipelineData.steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-4 rounded-lg border ${getStepColor(step.status)}`}
                >
                  {/* Connection line */}
                  {index < selectedPipelineData.steps.length - 1 && (
                    <div className="absolute left-6 top-16 w-px h-8 bg-gray-600/50" />
                  )}
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center border border-gray-600/50">
                      {getStepIcon(step.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-medium">{step.name}</h4>
                        <div className="flex items-center space-x-2">
                          {step.duration && (
                            <span className="text-xs text-gray-400">{step.duration}</span>
                          )}
                          <span className={`text-xs px-2 py-1 rounded capitalize ${getPipelineStatusColor(step.status)}`}>
                            {step.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">{step.description}</p>
                      
                      {step.dependencies && step.dependencies.length > 0 && (
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Depends on:</span>
                          {step.dependencies.map(dep => (
                            <span key={dep} className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded">
                              Step {dep}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Pipeline Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Performance Metrics">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Average Cycle Time</span>
              <span className="text-cyan-400">2.5 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Success Rate</span>
              <span className="text-green-400">96%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Active Pipelines</span>
              <span className="text-blue-400">1</span>
            </div>
          </div>
        </Card>

        <Card title="Recent Activity">
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span className="text-gray-300">Development pipeline completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <Play className="w-3 h-3 text-blue-400" />
              <span className="text-gray-300">AI analysis started</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3 text-yellow-400" />
              <span className="text-gray-300">Waiting for commit creation</span>
            </div>
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="space-y-2">
            <Button variant="secondary" size="sm" className="w-full justify-start">
              <Play className="w-3 h-3 mr-2" />
              Start New Pipeline
            </Button>
            <Button variant="secondary" size="sm" className="w-full justify-start">
              <Eye className="w-3 h-3 mr-2" />
              View All Pipelines
            </Button>
            <Button variant="secondary" size="sm" className="w-full justify-start">
              <Workflow className="w-3 h-3 mr-2" />
              Create Custom Flow
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};