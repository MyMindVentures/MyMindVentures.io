import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Home,
  BookOpen,
  Smartphone,
  Users,
  BarChart3,
  Code,
  Settings,
  FileText,
  GitBranch,
  Database,
  Monitor,
  Zap,
  Eye,
  ChevronDown,
  ChevronRight,
  Circle,
  Square,
  Triangle,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface AppArchitectureProps {
  onBack: () => void;
}

interface NavigationNode {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  level: number;
  hasSubmenu?: boolean;
  submenu?: NavigationNode[];
  status?: string;
  description?: string;
}

const navigationStructure: NavigationNode[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    level: 0,
    description: 'Main landing page with overview and quick actions',
  },
  {
    id: 'story',
    label: 'My Story & Roadmap',
    icon: BookOpen,
    level: 0,
    description: 'Personal journey and development roadmap',
  },
  {
    id: 'apps',
    label: 'Apps',
    icon: Smartphone,
    level: 0,
    description: 'Application portfolio management',
  },
  {
    id: 'jointventure',
    label: 'JointVenture',
    icon: Users,
    level: 0,
    description: 'Collaboration and partnership management',
  },
  {
    id: 'dashboards',
    label: 'Dashboards',
    icon: BarChart3,
    level: 0,
    hasSubmenu: true,
    description: 'Comprehensive dashboard suite',
    submenu: [
      {
        id: 'app-management',
        label: 'App Management',
        icon: Code,
        level: 1,
        hasSubmenu: true,
        description: 'Complete application development toolkit',
        submenu: [
          {
            id: 'settings',
            label: 'App Settings',
            icon: Settings,
            level: 2,
            description: 'AI Models, Database & Vector DB connections',
          },
          {
            id: 'build-management',
            label: 'App Build Management',
            icon: FileText,
            level: 2,
            description: 'Prompts, ChangeLogs & Git Commits',
          },
          {
            id: 'developer-workflows',
            label: 'Developer Workflows & Instructions',
            icon: Code,
            level: 2,
            description: 'Development workflows, coding standards',
          },
          {
            id: 'app-architecture',
            label: 'App Architecture',
            icon: GitBranch,
            level: 2,
            status: 'coming-soon',
            description: 'Menu structure, flows & user journeys',
          },
          {
            id: 'database-management',
            label: 'Database Management',
            icon: Database,
            level: 2,
            description: 'Database schema and management',
          },
          {
            id: 'database-monitor',
            label: 'Database Monitor',
            icon: Monitor,
            level: 2,
            description: 'APIs & Token monitor',
          },
          {
            id: 'toolstack-overview',
            label: 'Toolstack Overview',
            icon: Zap,
            level: 2,
            description: 'Settings, credentials & API management',
          },
          {
            id: 'userflow-pipelines',
            label: 'UserFlow/Pipelines',
            icon: GitBranch,
            level: 2,
            description: 'Workflow visualization & optimization',
          },
          {
            id: 'app-user-guides',
            label: 'App User Guides',
            icon: FileText,
            level: 2,
            description: 'Documentation & help resources',
          },
        ],
      },
    ],
  },
];

export const AppArchitecture: React.FC<AppArchitectureProps> = ({ onBack }) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<string[]>([
    'dashboards',
    'app-management',
  ]);
  const [viewMode, setViewMode] = useState<'tree' | 'flow' | 'grid'>('tree');

  const toggleExpanded = (nodeId: string) => {
    setExpandedNodes(prev =>
      prev.includes(nodeId)
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const renderTreeNode = (node: NavigationNode, index: number = 0) => {
    const Icon = node.icon;
    const isExpanded = expandedNodes.includes(node.id);
    const isSelected = selectedNode === node.id;
    const hasChildren =
      node.hasSubmenu && node.submenu && node.submenu.length > 0;

    const levelColors = {
      0: 'from-cyan-400 to-blue-500',
      1: 'from-purple-400 to-pink-500',
      2: 'from-green-400 to-emerald-500',
    };

    const levelBorders = {
      0: 'border-cyan-400/30',
      1: 'border-purple-400/30',
      2: 'border-green-400/30',
    };

    return (
      <motion.div
        key={node.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`ml-${node.level * 6}`}
      >
        <div
          className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
            isSelected
              ? `bg-gradient-to-r from-cyan-500/20 to-purple-500/20 ${levelBorders[node.level as keyof typeof levelBorders]} shadow-lg`
              : 'bg-gray-800/30 border-gray-700/30 hover:border-gray-600/50 hover:bg-gray-700/30'
          } ${node.status === 'coming-soon' ? 'opacity-60' : ''}`}
          onClick={() => {
            setSelectedNode(node.id);
            if (hasChildren) {
              toggleExpanded(node.id);
            }
          }}
        >
          {/* Level Indicator */}
          <div
            className={`w-3 h-3 rounded-full bg-gradient-to-r ${levelColors[node.level as keyof typeof levelColors]}`}
          />

          {/* Icon */}
          <div
            className={`w-8 h-8 rounded-lg bg-gradient-to-r ${levelColors[node.level as keyof typeof levelColors]} flex items-center justify-center`}
          >
            <Icon className='w-4 h-4 text-white' />
          </div>

          {/* Content */}
          <div className='flex-1'>
            <div className='flex items-center space-x-2'>
              <span className='text-white font-medium text-sm'>
                {node.label}
              </span>
              {node.status === 'coming-soon' && (
                <span className='text-xs bg-gray-700/50 text-gray-400 px-2 py-1 rounded'>
                  Coming Soon
                </span>
              )}
            </div>
            {node.description && (
              <p className='text-gray-400 text-xs mt-1'>{node.description}</p>
            )}
          </div>

          {/* Expand/Collapse */}
          {hasChildren && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className='w-4 h-4 text-gray-400' />
            </motion.div>
          )}
        </div>

        {/* Submenu */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className='mt-2 space-y-2 overflow-hidden'
            >
              {node.submenu?.map((subNode, subIndex) =>
                renderTreeNode(subNode, subIndex)
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderFlowView = () => {
    const allNodes: NavigationNode[] = [];

    const flattenNodes = (nodes: NavigationNode[]) => {
      nodes.forEach(node => {
        allNodes.push(node);
        if (node.submenu) {
          flattenNodes(node.submenu);
        }
      });
    };

    flattenNodes(navigationStructure);

    return (
      <div className='relative'>
        <svg
          className='absolute inset-0 w-full h-full pointer-events-none'
          style={{ zIndex: 0 }}
        >
          {/* Connection Lines */}
          {allNodes.map((node, index) => {
            if (node.level === 0) return null;
            const parentIndex = allNodes.findIndex(n =>
              n.submenu?.some(sub => sub.id === node.id)
            );
            if (parentIndex === -1) return null;

            const startY = parentIndex * 120 + 60;
            const endY = index * 120 + 60;
            const startX = node.level === 1 ? 200 : 400;
            const endX = node.level === 1 ? 400 : 600;

            return (
              <motion.path
                key={`${parentIndex}-${index}`}
                d={`M ${startX} ${startY} Q ${startX + 50} ${startY} ${endX - 50} ${endY} T ${endX} ${endY}`}
                stroke='url(#gradient)'
                strokeWidth='2'
                fill='none'
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            );
          })}

          <defs>
            <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
              <stop offset='0%' stopColor='#06b6d4' />
              <stop offset='100%' stopColor='#8b5cf6' />
            </linearGradient>
          </defs>
        </svg>

        {/* Nodes */}
        <div className='relative z-10 space-y-8'>
          {allNodes.map((node, index) => {
            const Icon = node.icon;
            const levelColors = {
              0: 'from-cyan-400 to-blue-500',
              1: 'from-purple-400 to-pink-500',
              2: 'from-green-400 to-emerald-500',
            };

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`absolute`}
                style={{
                  left: `${node.level * 200 + 50}px`,
                  top: `${index * 120}px`,
                }}
              >
                <div
                  className={`w-48 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 cursor-pointer transition-all duration-200 hover:border-cyan-500/50 ${
                    selectedNode === node.id
                      ? 'border-cyan-400/50 bg-cyan-500/10'
                      : ''
                  } ${node.status === 'coming-soon' ? 'opacity-60' : ''}`}
                  onClick={() => setSelectedNode(node.id)}
                >
                  <div className='flex items-center space-x-3 mb-2'>
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-r ${levelColors[node.level as keyof typeof levelColors]} flex items-center justify-center`}
                    >
                      <Icon className='w-4 h-4 text-white' />
                    </div>
                    <span className='text-white font-medium text-sm'>
                      {node.label}
                    </span>
                  </div>
                  {node.description && (
                    <p className='text-gray-400 text-xs'>{node.description}</p>
                  )}
                  {node.status === 'coming-soon' && (
                    <div className='mt-2 text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded'>
                      Coming Soon
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderGridView = () => {
    const levelGroups = {
      0: navigationStructure.filter(n => n.level === 0),
      1: navigationStructure
        .flatMap(n => n.submenu || [])
        .filter(n => n.level === 1),
      2: navigationStructure
        .flatMap(n => n.submenu?.flatMap(s => s.submenu || []) || [])
        .filter(n => n.level === 2),
    };

    return (
      <div className='space-y-8'>
        {Object.entries(levelGroups).map(([level, nodes]) => {
          if (nodes.length === 0) return null;

          const levelTitles = {
            '0': 'Main Navigation',
            '1': 'Dashboard Sections',
            '2': 'App Management Tools',
          };

          const levelColors = {
            '0': 'from-cyan-400 to-blue-500',
            '1': 'from-purple-400 to-pink-500',
            '2': 'from-green-400 to-emerald-500',
          };

          return (
            <div key={level}>
              <h3 className='text-lg font-semibold text-white mb-4 flex items-center'>
                <div
                  className={`w-3 h-3 rounded-full bg-gradient-to-r ${levelColors[level as keyof typeof levelColors]} mr-3`}
                />
                {levelTitles[level as keyof typeof levelTitles]}
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {nodes.map((node, index) => {
                  const Icon = node.icon;
                  return (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 bg-gray-800/30 rounded-lg border border-gray-700/30 cursor-pointer transition-all duration-200 hover:border-cyan-500/50 hover:bg-gray-700/30 ${
                        selectedNode === node.id
                          ? 'border-cyan-400/50 bg-cyan-500/10'
                          : ''
                      } ${node.status === 'coming-soon' ? 'opacity-60' : ''}`}
                      onClick={() => setSelectedNode(node.id)}
                    >
                      <div className='flex items-center space-x-3 mb-2'>
                        <div
                          className={`w-8 h-8 rounded-lg bg-gradient-to-r ${levelColors[level as keyof typeof levelColors]} flex items-center justify-center`}
                        >
                          <Icon className='w-4 h-4 text-white' />
                        </div>
                        <span className='text-white font-medium text-sm'>
                          {node.label}
                        </span>
                      </div>
                      {node.description && (
                        <p className='text-gray-400 text-xs leading-relaxed'>
                          {node.description}
                        </p>
                      )}
                      {node.status === 'coming-soon' && (
                        <div className='mt-2 text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded inline-block'>
                          Coming Soon
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const getSelectedNodeDetails = () => {
    const findNode = (nodes: NavigationNode[]): NavigationNode | null => {
      for (const node of nodes) {
        if (node.id === selectedNode) return node;
        if (node.submenu) {
          const found = findNode(node.submenu);
          if (found) return found;
        }
      }
      return null;
    };

    return findNode(navigationStructure);
  };

  const selectedNodeDetails = getSelectedNodeDetails();

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
          <h1 className='text-2xl font-bold text-white'>App Architecture</h1>
        </div>

        {/* View Mode Toggle */}
        <div className='flex space-x-2 bg-gray-800/30 p-1 rounded-lg'>
          {[
            { id: 'tree', label: 'Tree', icon: GitBranch },
            { id: 'flow', label: 'Flow', icon: Eye },
            { id: 'grid', label: 'Grid', icon: Square },
          ].map(mode => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === mode.id
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                }`}
              >
                <Icon className='w-4 h-4' />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Architecture Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {[
          {
            label: 'Total Pages',
            value: '14',
            icon: FileText,
            color: 'text-cyan-400',
          },
          {
            label: 'Menu Levels',
            value: '3',
            icon: GitBranch,
            color: 'text-purple-400',
          },
          {
            label: 'Active Tools',
            value: '6',
            icon: Zap,
            color: 'text-green-400',
          },
          {
            label: 'Coming Soon',
            value: '8',
            icon: Circle,
            color: 'text-orange-400',
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className='bg-gray-800/30 rounded-xl p-4 border border-gray-700/30'
            >
              <div className='flex items-center space-x-3'>
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <div className={`text-xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className='text-gray-400 text-xs'>{stat.label}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Architecture Visualization */}
        <div className='lg:col-span-2'>
          <Card
            title={`Navigation Structure - ${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View`}
            gradient
          >
            <div className='space-y-4'>
              {viewMode === 'tree' && (
                <div className='space-y-3 max-h-96 overflow-y-auto'>
                  {navigationStructure.map((node, index) =>
                    renderTreeNode(node, index)
                  )}
                </div>
              )}

              {viewMode === 'flow' && (
                <div className='relative min-h-96 overflow-auto'>
                  {renderFlowView()}
                </div>
              )}

              {viewMode === 'grid' && (
                <div className='max-h-96 overflow-y-auto'>
                  {renderGridView()}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Selected Node Details */}
        <div className='space-y-6'>
          <Card title='Node Details'>
            {selectedNodeDetails ? (
              <div className='space-y-4'>
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center'>
                    <selectedNodeDetails.icon className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <h4 className='text-white font-medium'>
                      {selectedNodeDetails.label}
                    </h4>
                    <span className='text-xs text-gray-400'>
                      Level {selectedNodeDetails.level}
                    </span>
                  </div>
                </div>

                {selectedNodeDetails.description && (
                  <p className='text-gray-300 text-sm leading-relaxed'>
                    {selectedNodeDetails.description}
                  </p>
                )}

                {selectedNodeDetails.status === 'coming-soon' && (
                  <div className='p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg'>
                    <div className='flex items-center space-x-2 text-orange-400 text-sm'>
                      <Circle className='w-4 h-4' />
                      <span>Coming Soon</span>
                    </div>
                  </div>
                )}

                {selectedNodeDetails.hasSubmenu && (
                  <div className='p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg'>
                    <div className='flex items-center space-x-2 text-purple-400 text-sm'>
                      <GitBranch className='w-4 h-4' />
                      <span>
                        Has {selectedNodeDetails.submenu?.length} submenu items
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className='text-center py-8 text-gray-400'>
                Click on any node to view details
              </div>
            )}
          </Card>

          {/* Architecture Metrics */}
          <Card title='Architecture Metrics'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-gray-400 text-sm'>Navigation Depth</span>
                <span className='text-cyan-400 font-medium'>3 levels</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-gray-400 text-sm'>Total Endpoints</span>
                <span className='text-purple-400 font-medium'>14 pages</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-gray-400 text-sm'>Functional Tools</span>
                <span className='text-green-400 font-medium'>6 active</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-gray-400 text-sm'>
                  Development Status
                </span>
                <span className='text-orange-400 font-medium'>
                  43% complete
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title='Quick Actions'>
            <div className='space-y-3'>
              <Button
                variant='secondary'
                size='sm'
                className='w-full justify-start'
              >
                <Eye className='w-4 h-4 mr-2' />
                Export Architecture
              </Button>
              <Button
                variant='secondary'
                size='sm'
                className='w-full justify-start'
              >
                <FileText className='w-4 h-4 mr-2' />
                Generate Documentation
              </Button>
              <Button
                variant='secondary'
                size='sm'
                className='w-full justify-start'
              >
                <GitBranch className='w-4 h-4 mr-2' />
                Analyze Dependencies
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
