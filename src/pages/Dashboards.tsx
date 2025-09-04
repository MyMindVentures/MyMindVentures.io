import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Code,
  Settings,
  FileText,
  GitBranch,
  Database,
  Monitor,
  Zap,
  Users,
  ArrowRight,
  Search,
  Wrench,
  Layers,
  Bell,
  TrendingUp,
  Brain,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface DashboardsProps {
  selectedSection?: string;
}

export const Dashboards: React.FC<DashboardsProps> = ({ selectedSection }) => {
  const appManagementTools = [
    // Pre-Commit Workflow Tools (alles wat we doen voor een commit)
    {
      id: 'pre-commit-workflow',
      title: '🚀 Pre-Commit Workflow',
      description: 'Complete pre-commit audit, optimization & testing suite',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      category: 'Pre-Commit Workflow',
    },
    {
      id: 'ai-codebase-audit',
      title: '🔍 AI Codebase Audit',
      description: 'AI-powered codebase analysis and suggestions',
      icon: Search,
      color: 'from-blue-500 to-cyan-500',
      category: 'Pre-Commit Workflow',
    },
    {
      id: 'app-optimizer',
      title: '⚡ App Optimizer',
      description: 'One-click codebase optimization and cleanup',
      icon: Settings,
      color: 'from-green-500 to-emerald-500',
      category: 'Pre-Commit Workflow',
    },
    {
      id: 'openai-strategic-audit',
      title: '🧠 AI Strategic Audit',
      description: 'AI-powered strategic insights and feature suggestions',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      category: 'Pre-Commit Workflow',
    },
    {
      id: 'ultra-complete-workflow',
      title: '🚀 Ultra Complete Workflow',
      description: 'Complete AI-powered development workflow with auto-reload',
      icon: Zap,
      color: 'from-indigo-500 to-purple-500',
      category: 'Pre-Commit Workflow',
    },
    {
      id: 'state-of-art-toolkit',
      title: '🛠️ State of Art Toolkit',
      description: 'Advanced debugging and development tools',
      icon: Wrench,
      color: 'from-orange-500 to-red-500',
      category: 'Pre-Commit Workflow',
    },
    {
      id: 'ai-insights-manager',
      title: '🤖 AI Insights Manager',
      description: 'Manage and organize all Perplexity.ai insights for PWA development',
      icon: Brain,
      color: 'from-purple-500 to-indigo-500',
      category: 'Development Tools',
    },

    // Development Tools (algemene development tools)
    {
      id: 'developer-instructions',
      title: '📚 Developer Instructions & Docs',
      description: 'Complete developer documentation, guides & instructions',
      icon: FileText,
      color: 'from-blue-400 to-indigo-500',
      category: 'Development Tools',
    },
    {
      id: 'ai-orchestrator',
      title: '🎼 AI Orchestrator',
      description: 'Intelligent AI model selection and task orchestration',
      icon: Brain,
      color: 'from-purple-400 to-pink-500',
      category: 'Development Tools',
    },
    {
      id: 'git-alerts',
      title: '🔔 Git Alerts',
      description: 'Real-time Git workflow monitoring and alerts',
      icon: Bell,
      color: 'from-green-400 to-teal-500',
      category: 'Development Tools',
    },

    // Reports & Analytics (rapporten en historiek)
    {
      id: 'workflow-reports',
      title: '📊 Workflow Reports',
      description: 'Complete history of all pre-commit workflows and results',
      icon: BarChart3,
      color: 'from-indigo-500 to-purple-500',
      category: 'Reports & Analytics',
    },
    {
      id: 'performance-analytics',
      title: '📈 Performance Analytics',
      description: 'Detailed performance metrics and trends',
      icon: TrendingUp,
      color: 'from-emerald-500 to-green-500',
      category: 'Reports & Analytics',
    },

    // App Management (algemene app management)
    {
      id: 'app-architecture',
      title: 'App Architecture',
      description: 'View and manage app architecture',
      icon: Layers,
      color: 'from-gray-500 to-gray-600',
      category: 'App Management',
    },
    {
      id: 'database-management',
      title: 'Database Management',
      description: 'Manage database schema and data',
      icon: Database,
      color: 'from-blue-500 to-blue-600',
      category: 'App Management',
    },
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Manage users and permissions',
      icon: Users,
      color: 'from-green-500 to-green-600',
      category: 'App Management',
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure app settings',
      icon: Settings,
      color: 'from-gray-400 to-gray-500',
      category: 'App Management',
    },
  ];

  const categories = [
    'Development Tools',
    'Architecture & Design',
    'Infrastructure & Monitoring',
    'Documentation & Recovery',
  ];

  if (selectedSection === 'app-management') {
    return (
      <div className='p-6 space-y-8'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center space-y-4'
        >
          <h1 className='text-4xl font-bold text-white'>App Management</h1>
          <p className='text-xl text-gray-400 max-w-2xl mx-auto'>
            Comprehensive tools for managing your application development
            lifecycle
          </p>
        </motion.div>

        {categories.map((category, categoryIndex) => (
          <div key={category} className='space-y-4'>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className='text-xl font-semibold text-white flex items-center'
            >
              <div className='w-1 h-6 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full mr-3' />
              {category}
            </motion.h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {appManagementTools
                .filter(tool => tool.category === category)
                .map((tool, index) => {
                  const Icon = tool.icon;
                  return (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: (categoryIndex * 3 + index) * 0.1 + 0.3,
                      }}
                    >
                      <Card
                        title={tool.title}
                        className='h-full hover:border-cyan-500/50 transition-all duration-200 cursor-pointer group'
                      >
                        <div className='space-y-4'>
                          <div
                            className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                          >
                            <Icon className='w-6 h-6 text-white' />
                          </div>
                          <p className='text-gray-400 text-sm leading-relaxed'>
                            {tool.description}
                          </p>
                          <div className='flex items-center text-cyan-400 text-sm font-medium group-hover:text-cyan-300 transition-colors'>
                            <span>Open Tool</span>
                            <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200' />
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='p-6 space-y-8'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center space-y-6'
      >
        <h1 className='text-5xl font-bold text-white mb-4'>
          <span className='bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent'>
            Dashboards
          </span>
        </h1>
        <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
          Comprehensive dashboard suite for managing all aspects of your
          development ventures
        </p>
      </motion.div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card
            title='App Management'
            gradient
            className='h-full cursor-pointer hover:border-cyan-500/50 transition-all duration-200 group'
          >
            <div className='space-y-4'>
              <div className='w-12 h-12 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200'>
                <Code className='w-6 h-6 text-white' />
              </div>
              <p className='text-gray-400 text-sm leading-relaxed'>
                Complete application development toolkit with 9 specialized
                tools organized in 3 categories
              </p>
              <div className='flex items-center text-cyan-400 text-sm font-medium group-hover:text-cyan-300 transition-colors'>
                <span>Explore Tools</span>
                <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200' />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card title='Analytics Dashboard' className='h-full'>
            <div className='space-y-4'>
              <div className='w-12 h-12 rounded-lg bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center'>
                <BarChart3 className='w-6 h-6 text-white' />
              </div>
              <p className='text-gray-400 text-sm leading-relaxed'>
                Performance metrics, usage analytics, and development insights
              </p>
              <div className='text-orange-400 text-xs bg-orange-500/10 px-2 py-1 rounded'>
                Coming Soon
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card title='Team Collaboration' className='h-full'>
            <div className='space-y-4'>
              <div className='w-12 h-12 rounded-lg bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center'>
                <Users className='w-6 h-6 text-white' />
              </div>
              <p className='text-gray-400 text-sm leading-relaxed'>
                Collaborative development tools and team management features
              </p>
              <div className='text-orange-400 text-xs bg-orange-500/10 px-2 py-1 rounded'>
                Coming Soon
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
