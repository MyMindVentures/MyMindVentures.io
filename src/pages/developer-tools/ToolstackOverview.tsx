import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Package,
  Code,
  Database,
  Zap,
  Globe,
  Palette,
  Shield,
  Cpu,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface ToolstackOverviewProps {
  onBack: () => void;
}

interface Tool {
  name: string;
  version: string;
  category: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  status: 'active' | 'configured' | 'pending';
  url?: string;
}

export const ToolstackOverview: React.FC<ToolstackOverviewProps> = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const tools: Tool[] = [
    // Frontend
    { name: 'React', version: '18.3.1', category: 'Frontend', description: 'UI library for building interfaces', icon: Code, color: 'from-cyan-400 to-blue-500', status: 'active', url: 'https://react.dev' },
    { name: 'TypeScript', version: '5.5.3', category: 'Frontend', description: 'Type-safe JavaScript development', icon: Code, color: 'from-blue-400 to-indigo-500', status: 'active', url: 'https://typescriptlang.org' },
    { name: 'Tailwind CSS', version: '3.4.1', category: 'Frontend', description: 'Utility-first CSS framework', icon: Palette, color: 'from-teal-400 to-cyan-500', status: 'active', url: 'https://tailwindcss.com' },
    { name: 'Framer Motion', version: '12.23.12', category: 'Frontend', description: 'Animation library for React', icon: Zap, color: 'from-purple-400 to-pink-500', status: 'active', url: 'https://framer.com/motion' },
    
    // Backend & Database
    { name: 'Supabase', version: '2.56.1', category: 'Backend', description: 'Backend-as-a-Service with PostgreSQL', icon: Database, color: 'from-green-400 to-emerald-500', status: 'configured', url: 'https://supabase.com' },
    { name: 'Edge Functions', version: 'Latest', category: 'Backend', description: 'Serverless API endpoints', icon: Cpu, color: 'from-orange-400 to-red-500', status: 'active' },
    
    // AI & External Services
    { name: 'OpenAI', version: 'GPT-4', category: 'AI', description: 'AI models for intelligent features', icon: Cpu, color: 'from-emerald-400 to-green-500', status: 'configured', url: 'https://openai.com' },
    { name: 'Perplexity', version: 'Latest', category: 'AI', description: 'Real-time search and analysis', icon: Globe, color: 'from-indigo-400 to-purple-500', status: 'configured', url: 'https://perplexity.ai' },
    { name: 'Pinecone', version: 'Latest', category: 'AI', description: 'Vector database for embeddings', icon: Database, color: 'from-pink-400 to-rose-500', status: 'pending', url: 'https://pinecone.io' },
    
    // Development Tools
    { name: 'Vite', version: '5.4.2', category: 'Development', description: 'Fast build tool and dev server', icon: Zap, color: 'from-yellow-400 to-orange-500', status: 'active', url: 'https://vitejs.dev' },
    { name: 'ESLint', version: '9.9.1', category: 'Development', description: 'Code quality and consistency', icon: Shield, color: 'from-red-400 to-pink-500', status: 'active', url: 'https://eslint.org' },
    
    // Deployment
    { name: 'Bolt Hosting', version: 'Latest', category: 'Deployment', description: 'Deployment platform', icon: Globe, color: 'from-violet-400 to-purple-500', status: 'active' },
  ];

  const categories = ['all', 'Frontend', 'Backend', 'AI', 'Development', 'Deployment'];

  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500/10';
      case 'configured':
        return 'text-blue-400 bg-blue-500/10';
      case 'pending':
        return 'text-orange-400 bg-orange-500/10';
      default:
        return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-3 h-3" />;
      case 'configured':
        return <CheckCircle className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      default:
        return <AlertTriangle className="w-3 h-3" />;
    }
  };

  const categoryStats = categories.slice(1).map(category => ({
    name: category,
    count: tools.filter(tool => tool.category === category).length,
    active: tools.filter(tool => tool.category === category && tool.status === 'active').length,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to App Management
        </Button>
        <h1 className="text-2xl font-bold text-white">Toolstack Overview</h1>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categoryStats.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30"
          >
            <div className="text-center">
              <div className="text-lg font-bold text-white">{category.active}/{category.count}</div>
              <div className="text-xs text-gray-400">{category.name}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 bg-gray-800/30 p-1 rounded-lg">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
            }`}
          >
            {category === 'all' ? 'All Tools' : category}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:border-cyan-500/50 transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${getStatusColor(tool.status)}`}>
                    {getStatusIcon(tool.status)}
                    <span className="capitalize">{tool.status}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-white font-semibold">{tool.name}</h3>
                    {tool.url && (
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-cyan-400 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">v{tool.version}</div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded">
                    {tool.category}
                  </span>
                  
                  <Button variant="ghost" size="sm">
                    <Eye className="w-3 h-3 mr-1" />
                    Details
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Toolstack Summary */}
      <Card title="Toolstack Summary" gradient>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-white font-medium">Architecture Overview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Frontend Framework:</span>
                <span className="text-cyan-400">React + TypeScript</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Styling:</span>
                <span className="text-cyan-400">Tailwind CSS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Backend:</span>
                <span className="text-cyan-400">Supabase</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Database:</span>
                <span className="text-cyan-400">PostgreSQL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">AI Integration:</span>
                <span className="text-cyan-400">OpenAI + Perplexity</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-white font-medium">Development Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Active Tools:</span>
                <span className="text-green-400">{tools.filter(t => t.status === 'active').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Configured:</span>
                <span className="text-blue-400">{tools.filter(t => t.status === 'configured').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pending Setup:</span>
                <span className="text-orange-400">{tools.filter(t => t.status === 'pending').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Tools:</span>
                <span className="text-white">{tools.length}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};