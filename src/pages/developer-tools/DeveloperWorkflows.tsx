import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Code,
  GitBranch,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  Settings,
  Book,
  Terminal,
  Workflow
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface DeveloperWorkflowsProps {
  onBack: () => void;
}

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
  tools: string[];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: WorkflowStep[];
  estimatedTime: string;
}

export const DeveloperWorkflows: React.FC<DeveloperWorkflowsProps> = ({ onBack }) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('blueprint-development');

  const workflows: Workflow[] = [
    {
      id: 'blueprint-development',
      name: 'Blueprint Development',
      description: 'Standard workflow for creating and managing blueprint snippets',
      category: 'Development',
      estimatedTime: '2-4 hours',
      steps: [
        {
          id: '1',
          title: 'Analysis & Planning',
          description: 'Review requirements and plan implementation approach',
          status: 'completed',
          tools: ['AI Analysis', 'Documentation']
        },
        {
          id: '2',
          title: 'Create Blueprint Snippets',
          description: 'Break down work into themed, manageable snippets',
          status: 'active',
          tools: ['Blueprint Creator', 'Theme Manager']
        },
        {
          id: '3',
          title: 'Review & Validation',
          description: 'Validate snippets meet quality standards',
          status: 'pending',
          tools: ['Code Review', 'Testing']
        },
        {
          id: '4',
          title: 'Commit Generation',
          description: 'Use AI to generate professional commit messages',
          status: 'pending',
          tools: ['OpenAI Integration', 'Git Tools']
        }
      ]
    },
    {
      id: 'ai-integration',
      name: 'AI Integration Workflow',
      description: 'Process for integrating AI services and testing connections',
      category: 'AI',
      estimatedTime: '30-60 minutes',
      steps: [
        {
          id: '1',
          title: 'API Configuration',
          description: 'Set up API keys and connection parameters',
          status: 'completed',
          tools: ['Settings Panel', 'Encryption']
        },
        {
          id: '2',
          title: 'Connection Testing',
          description: 'Verify all API connections are working',
          status: 'completed',
          tools: ['Test Functions', 'Monitoring']
        },
        {
          id: '3',
          title: 'Integration Testing',
          description: 'Test AI features in development environment',
          status: 'active',
          tools: ['Edge Functions', 'Error Handling']
        }
      ]
    },
    {
      id: 'deployment',
      name: 'Deployment Workflow',
      description: 'Standard process for deploying applications to production',
      category: 'Deployment',
      estimatedTime: '15-30 minutes',
      steps: [
        {
          id: '1',
          title: 'Pre-deployment Checks',
          description: 'Run tests and validate build configuration',
          status: 'pending',
          tools: ['Testing Suite', 'Build Tools']
        },
        {
          id: '2',
          title: 'Build & Deploy',
          description: 'Build application and deploy to hosting platform',
          status: 'pending',
          tools: ['Vite Build', 'Bolt Hosting']
        },
        {
          id: '3',
          title: 'Post-deployment Validation',
          description: 'Verify deployment and monitor for issues',
          status: 'pending',
          tools: ['Monitoring', 'Health Checks']
        }
      ]
    }
  ];

  const categories = ['All', 'Development', 'AI', 'Deployment'];

  const filteredWorkflows = workflows.filter(workflow =>
    selectedWorkflow === 'all' || workflow.id === selectedWorkflow
  );

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'active':
        return <Play className="w-4 h-4 text-blue-400" />;
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
      default:
        return 'border-gray-400/30 bg-gray-500/10';
    }
  };

  const selectedWorkflowData = workflows.find(w => w.id === selectedWorkflow);

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
        <h1 className="text-2xl font-bold text-white">Developer Workflows & Instructions</h1>
      </div>

      {/* Workflow Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workflows.map((workflow, index) => (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedWorkflow === workflow.id
                ? 'border-cyan-400/50 bg-cyan-500/10'
                : 'border-gray-700/30 bg-gray-800/30 hover:border-gray-600/50'
            }`}
            onClick={() => setSelectedWorkflow(workflow.id)}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">{workflow.name}</h3>
                <span className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded">
                  {workflow.category}
                </span>
              </div>
              <p className="text-gray-400 text-sm">{workflow.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Est. {workflow.estimatedTime}</span>
                <span className="text-cyan-400">{workflow.steps.length} steps</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Workflow Details */}
      {selectedWorkflowData && (
        <Card title={selectedWorkflowData.name} gradient>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 mb-2">{selectedWorkflowData.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>Category: {selectedWorkflowData.category}</span>
                  <span>Duration: {selectedWorkflowData.estimatedTime}</span>
                  <span>Steps: {selectedWorkflowData.steps.length}</span>
                </div>
              </div>
              <Button variant="primary" size="sm">
                <Play className="w-3 h-3 mr-2" />
                Start Workflow
              </Button>
            </div>

            {/* Workflow Steps */}
            <div className="space-y-3">
              {selectedWorkflowData.steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-4 rounded-lg border ${getStepColor(step.status)}`}
                >
                  {/* Connection line */}
                  {index < selectedWorkflowData.steps.length - 1 && (
                    <div className="absolute left-6 top-16 w-px h-8 bg-gray-600/50" />
                  )}
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800/50 flex items-center justify-center border border-gray-600/50">
                      {getStepIcon(step.status)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{step.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded capitalize ${
                          step.status === 'completed' ? 'text-green-400 bg-green-500/10' :
                          step.status === 'active' ? 'text-blue-400 bg-blue-500/10' :
                          'text-gray-400 bg-gray-500/10'
                        }`}>
                          {step.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{step.description}</p>
                      
                      {/* Tools */}
                      <div className="flex flex-wrap gap-1">
                        {step.tools.map(tool => (
                          <span
                            key={tool}
                            className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded text-xs"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Coding Standards */}
      <Card title="Coding Standards & Best Practices">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-white font-medium flex items-center">
              <Code className="w-4 h-4 mr-2 text-cyan-400" />
              Code Quality
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-gray-300">TypeScript for type safety</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-gray-300">ESLint for code consistency</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-gray-300">Component-based architecture</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-gray-300">Proper error handling</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-white font-medium flex items-center">
              <GitBranch className="w-4 h-4 mr-2 text-purple-400" />
              Git Workflow
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-gray-300">Feature branch development</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-gray-300">AI-generated commit messages</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-gray-300">Semantic versioning</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-gray-300">Automated documentation</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};