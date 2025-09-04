import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Code,
  Settings,
  Users,
  Zap,
  Shield,
  TestTube,
  Rocket,
  Brain,
  GitBranch,
  Search,
  Filter,
  Clock,
  Star,
  Eye,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Bookmark,
  Share2,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabaseService as db } from '../../lib/supabase';
import { debugLogger } from '../../lib/debug-log';

interface DeveloperInstructionsProps {
  onBack?: () => void;
}

interface DeveloperInstruction {
  id: string;
  content: string;
  type: string;
  user_id: string;
  page_context: string;
  created_at: string;
  timestamp: string;
}

export const DeveloperInstructions: React.FC<DeveloperInstructionsProps> = ({
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<
    'instructions' | 'guides' | 'documentation'
  >('instructions');
  const [instructions, setInstructions] = useState<DeveloperInstruction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load all developer instructions from feedback table
      const { data, error } = await db.supabase
        .from('feedback')
        .select('*')
        .in('type', [
          'developer-instruction',
          'developer-guide',
          'developer-documentation',
        ])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading developer instructions:', error);
        return;
      }

      if (data) {
        setInstructions(data);
      }
    } catch (error) {
      console.error('Error loading developer data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to extract title from content (first line after #)
  const extractTitle = (content: string) => {
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.startsWith('# ')) {
        return line.replace('# ', '').trim();
      }
    }
    return 'Untitled';
  };

  // Function to extract description from content
  const extractDescription = (content: string) => {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (
        line &&
        !line.startsWith('#') &&
        !line.startsWith('**') &&
        !line.startsWith('---')
      ) {
        return line.length > 100 ? line.substring(0, 100) + '...' : line;
      }
    }
    return 'No description available';
  };

  // Function to extract category from content
  const extractCategory = (content: string) => {
    const categoryMatch = content.match(/\*\*Category:\*\* (.+)/);
    return categoryMatch ? categoryMatch[1] : 'General';
  };

  // Function to extract tags from content
  const extractTags = (content: string) => {
    const tags: string[] = [];
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.includes('**Tags:**')) {
        const tagsMatch = line.match(/\*\*Tags:\*\* (.+)/);
        if (tagsMatch) {
          return tagsMatch[1].split(',').map(tag => tag.trim());
        }
      }
    }
    return tags;
  };

  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('getting started'))
      return <Rocket className='w-4 h-4' />;
    if (categoryLower.includes('workflow')) return <Zap className='w-4 h-4' />;
    if (categoryLower.includes('configuration'))
      return <Settings className='w-4 h-4' />;
    if (categoryLower.includes('deployment'))
      return <Rocket className='w-4 h-4' />;
    if (categoryLower.includes('testing'))
      return <TestTube className='w-4 h-4' />;
    if (categoryLower.includes('quality')) return <Star className='w-4 h-4' />;
    if (categoryLower.includes('styling')) return <Code className='w-4 h-4' />;
    if (categoryLower.includes('build'))
      return <Settings className='w-4 h-4' />;
    if (categoryLower.includes('ide')) return <Brain className='w-4 h-4' />;
    if (categoryLower.includes('git')) return <GitBranch className='w-4 h-4' />;
    return <FileText className='w-4 h-4' />;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'developer-instruction':
        return 'text-blue-500 bg-blue-100';
      case 'developer-guide':
        return 'text-green-500 bg-green-100';
      case 'developer-documentation':
        return 'text-purple-500 bg-purple-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const filteredInstructions = instructions.filter(instruction => {
    const title = extractTitle(instruction.content);
    const description = extractDescription(instruction.content);
    const category = extractCategory(instruction.content);

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === 'all' ||
      category.toLowerCase().includes(filterCategory.toLowerCase());

    const matchesType =
      (activeTab === 'instructions' &&
        instruction.type === 'developer-instruction') ||
      (activeTab === 'guides' && instruction.type === 'developer-guide') ||
      (activeTab === 'documentation' &&
        instruction.type === 'developer-documentation');

    return matchesSearch && matchesCategory && matchesType;
  });

  const categories = [
    'all',
    'getting started',
    'development workflow',
    'configuration',
    'deployment',
    'testing',
    'code quality',
    'styling',
    'build system',
    'ide setup',
    'git workflow',
  ];

  const handleViewItem = async (item: DeveloperInstruction) => {
    setSelectedItem(item);

    // Log activity
    await debugLogger.logInfo(
      'developer-instructions',
      'Instruction Viewed',
      `Viewed ${extractTitle(item.content)}`,
      [item.type, extractCategory(item.content)]
    );
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          {onBack && (
            <Button variant='ghost' onClick={onBack}>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back
            </Button>
          )}
          <div>
            <h1 className='text-3xl font-bold text-white flex items-center'>
              <BookOpen className='w-8 h-8 mr-3 text-cyan-400' />
              Developer Instructions & Documentation
            </h1>
            <p className='text-gray-400 mt-1'>
              Complete guide for developers working on the MyMindVentures.io PWA
              ecosystem
            </p>
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          <div className='text-sm text-gray-400'>
            {filteredInstructions.length} items
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex space-x-1 bg-gray-800/30 rounded-lg p-1'>
        <button
          onClick={() => setActiveTab('instructions')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'instructions'
              ? 'bg-cyan-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <FileText className='w-4 h-4' />
          <span>Instructions</span>
        </button>
        <button
          onClick={() => setActiveTab('guides')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'guides'
              ? 'bg-cyan-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <BookOpen className='w-4 h-4' />
          <span>Guides</span>
        </button>
        <button
          onClick={() => setActiveTab('documentation')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'documentation'
              ? 'bg-cyan-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <Code className='w-4 h-4' />
          <span>Documentation</span>
        </button>
      </div>

      {/* Filters */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Input
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            placeholder='Search instructions...'
            className='w-64'
          />
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className='px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm'
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
        {isLoading ? (
          <div className='col-span-full flex items-center justify-center py-12'>
            <div className='w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin' />
          </div>
        ) : filteredInstructions.length === 0 ? (
          <div className='col-span-full text-center py-12 text-gray-400'>
            No {activeTab} found. Try adjusting your filters.
          </div>
        ) : (
          filteredInstructions.map(instruction => {
            const title = extractTitle(instruction.content);
            const description = extractDescription(instruction.content);
            const category = extractCategory(instruction.content);
            const tags = extractTags(instruction.content);

            return (
              <div
                key={instruction.id}
                className='bg-gray-800/30 rounded-lg border border-gray-700/50 p-6 hover:border-cyan-500/50 transition-colors cursor-pointer'
                onClick={() => handleViewItem(instruction)}
              >
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex items-center space-x-2'>
                    {getCategoryIcon(category)}
                    <span className='text-sm font-medium text-gray-300'>
                      {category}
                    </span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getTypeColor(instruction.type)}`}
                    >
                      {instruction.type.replace('developer-', '')}
                    </span>
                  </div>
                </div>

                <h3 className='text-lg font-semibold text-white mb-2'>
                  {title}
                </h3>
                <p className='text-gray-300 text-sm mb-4'>{description}</p>

                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center space-x-4 text-xs text-gray-400'>
                    <span className='flex items-center space-x-1'>
                      <Clock className='w-3 h-3' />
                      <span>
                        {new Date(instruction.created_at).toLocaleDateString()}
                      </span>
                    </span>
                  </div>
                  <ChevronRight className='w-4 h-4 text-gray-400' />
                </div>

                {tags.length > 0 && (
                  <div className='flex flex-wrap gap-1'>
                    {tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className='text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded'
                      >
                        {tag}
                      </span>
                    ))}
                    {tags.length > 3 && (
                      <span className='text-xs text-gray-500'>
                        +{tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div
          className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'
          onClick={() => setSelectedItem(null)}
        >
          <div
            className='bg-gray-900 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto'
            onClick={e => e.stopPropagation()}
          >
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-white'>
                {extractTitle(selectedItem.content)}
              </h2>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setSelectedItem(null)}
              >
                <ExternalLink className='w-4 h-4' />
              </Button>
            </div>

            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <span className='text-gray-400'>Category:</span>
                  <span className='text-white ml-2'>
                    {extractCategory(selectedItem.content)}
                  </span>
                </div>
                <div>
                  <span className='text-gray-400'>Type:</span>
                  <span className='text-white ml-2'>
                    {selectedItem.type.replace('developer-', '')}
                  </span>
                </div>
                <div>
                  <span className='text-gray-400'>Created:</span>
                  <span className='text-white ml-2'>
                    {new Date(selectedItem.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <h3 className='font-semibold text-white mb-2'>Content</h3>
                <div className='bg-gray-800 rounded-lg p-4 text-gray-300 text-sm whitespace-pre-wrap'>
                  {selectedItem.content}
                </div>
              </div>

              <div className='flex items-center justify-end space-x-2'>
                <Button variant='secondary'>
                  <Bookmark className='w-4 h-4 mr-2' />
                  Bookmark
                </Button>
                <Button variant='secondary'>
                  <Share2 className='w-4 h-4 mr-2' />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
