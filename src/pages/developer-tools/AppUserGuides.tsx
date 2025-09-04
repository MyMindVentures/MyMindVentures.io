import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Video,
  HelpCircle,
  Search,
  Filter,
  Eye,
  Download,
  ExternalLink,
  Lightbulb,
  Code,
  Database,
  Zap,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface AppUserGuidesProps {
  onBack: () => void;
}

interface GuideItem {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'tutorial' | 'reference' | 'faq';
  category: string;
  icon: React.ComponentType<any>;
  color: string;
  status: 'available' | 'coming-soon';
}

export const AppUserGuides: React.FC<AppUserGuidesProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const guides: GuideItem[] = [
    {
      id: 'getting-started',
      title: 'Getting Started Guide',
      description:
        'Complete walkthrough for new users to set up and start using MyMindVentures.io',
      type: 'guide',
      category: 'Basics',
      icon: BookOpen,
      color: 'from-cyan-400 to-blue-500',
      status: 'available',
    },
    {
      id: 'blueprint-management',
      title: 'Blueprint Management Tutorial',
      description:
        'Learn how to create, manage, and commit blueprint snippets effectively',
      type: 'tutorial',
      category: 'Development',
      icon: Lightbulb,
      color: 'from-yellow-400 to-orange-500',
      status: 'available',
    },
    {
      id: 'ai-integration',
      title: 'AI Integration Guide',
      description:
        'How to connect and use OpenAI, Perplexity, and other AI services',
      type: 'guide',
      category: 'AI & APIs',
      icon: Zap,
      color: 'from-purple-400 to-pink-500',
      status: 'coming-soon',
    },
    {
      id: 'database-setup',
      title: 'Database Configuration',
      description: 'Setting up and managing your Supabase database connections',
      type: 'reference',
      category: 'Database',
      icon: Database,
      color: 'from-green-400 to-emerald-500',
      status: 'coming-soon',
    },
    {
      id: 'workflow-optimization',
      title: 'Workflow Optimization',
      description:
        'Best practices for efficient development workflows and automation',
      type: 'guide',
      category: 'Development',
      icon: Code,
      color: 'from-indigo-400 to-purple-500',
      status: 'coming-soon',
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting FAQ',
      description: 'Common issues and solutions for MyMindVentures.io platform',
      type: 'faq',
      category: 'Support',
      icon: HelpCircle,
      color: 'from-red-400 to-pink-500',
      status: 'coming-soon',
    },
  ];

  const categories = [
    'all',
    'Basics',
    'Development',
    'AI & APIs',
    'Database',
    'Support',
  ];
  const types = ['all', 'guide', 'tutorial', 'reference', 'faq'];

  const filteredGuides = guides.filter(guide => {
    const matchesSearch =
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || guide.category === filterCategory;
    const matchesType = filterType === 'all' || guide.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide':
        return <BookOpen className='w-4 h-4' />;
      case 'tutorial':
        return <Video className='w-4 h-4' />;
      case 'reference':
        return <FileText className='w-4 h-4' />;
      case 'faq':
        return <HelpCircle className='w-4 h-4' />;
      default:
        return <FileText className='w-4 h-4' />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide':
        return 'text-blue-400 bg-blue-500/10';
      case 'tutorial':
        return 'text-green-400 bg-green-500/10';
      case 'reference':
        return 'text-purple-400 bg-purple-500/10';
      case 'faq':
        return 'text-orange-400 bg-orange-500/10';
      default:
        return 'text-gray-400 bg-gray-500/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className='space-y-6'
    >
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button variant='ghost' onClick={onBack}>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to App Management
          </Button>
          <h1 className='text-2xl font-bold text-white'>App User Guides</h1>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {[
          {
            label: 'Total Guides',
            value: guides.length.toString(),
            icon: BookOpen,
            color: 'text-cyan-400',
          },
          {
            label: 'Available',
            value: guides
              .filter(g => g.status === 'available')
              .length.toString(),
            icon: Eye,
            color: 'text-green-400',
          },
          {
            label: 'Categories',
            value: (categories.length - 1).toString(),
            icon: Filter,
            color: 'text-purple-400',
          },
          {
            label: 'Coming Soon',
            value: guides
              .filter(g => g.status === 'coming-soon')
              .length.toString(),
            icon: FileText,
            color: 'text-orange-400',
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className='bg-gray-800/30 rounded-lg p-4 border border-gray-700/30'
            >
              <div className='flex items-center space-x-3'>
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <div className={`text-lg font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className='text-gray-400 text-xs'>{stat.label}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Input
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder='Search guides...'
            className='w-64'
          />
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className='px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50'
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className='px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50'
          >
            {types.map(type => (
              <option key={type} value={type}>
                {type === 'all'
                  ? 'All Types'
                  : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className='text-sm text-gray-400'>
          {filteredGuides.length} guides
        </div>
      </div>

      {/* Guides Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredGuides.map((guide, index) => {
          const Icon = guide.icon;
          return (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 bg-gray-800/30 rounded-xl border border-gray-700/30 cursor-pointer transition-all duration-200 hover:border-cyan-500/50 hover:bg-gray-700/30 ${
                guide.status === 'coming-soon' ? 'opacity-60' : ''
              }`}
            >
              <div className='space-y-4'>
                <div className='flex items-start justify-between'>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${guide.color} flex items-center justify-center`}
                  >
                    <Icon className='w-6 h-6 text-white' />
                  </div>
                  <div className='flex items-center space-x-2'>
                    <div
                      className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${getTypeColor(guide.type)}`}
                    >
                      {getTypeIcon(guide.type)}
                      <span className='capitalize'>{guide.type}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className='text-white font-semibold mb-2'>
                    {guide.title}
                  </h3>
                  <p className='text-gray-400 text-sm leading-relaxed line-clamp-3'>
                    {guide.description}
                  </p>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded'>
                    {guide.category}
                  </span>

                  {guide.status === 'available' ? (
                    <div className='flex items-center space-x-2'>
                      <Button variant='ghost' size='sm'>
                        <Eye className='w-3 h-3 mr-1' />
                        View
                      </Button>
                      <Button variant='ghost' size='sm'>
                        <Download className='w-3 h-3 mr-1' />
                        Export
                      </Button>
                    </div>
                  ) : (
                    <div className='text-xs text-orange-400 bg-orange-500/10 px-2 py-1 rounded'>
                      Coming Soon
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredGuides.length === 0 && (
        <div className='text-center py-12'>
          <div className='text-gray-400 mb-4'>
            No guides match your search criteria
          </div>
          <Button
            variant='secondary'
            onClick={() => {
              setSearchTerm('');
              setFilterCategory('all');
              setFilterType('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </motion.div>
  );
};
