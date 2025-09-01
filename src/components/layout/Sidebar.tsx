import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BookOpen, 
  Smartphone, 
  Users, 
  BarChart3,
  Menu,
  X,
  ChevronDown,
  Settings,
  FileText,
  Code,
  GitBranch,
  Database,
  Monitor,
  Zap,
  ChevronRight,
  Rocket
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  hasSubmenu?: boolean;
  submenu?: NavItem[];
}

const navigationItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'pitch-demo', label: '🚀 Pitch Demo', icon: Rocket },
  { id: 'story', label: 'My Story & Roadmap', icon: BookOpen },
  { id: 'apps', label: 'Apps', icon: Smartphone },
  { id: 'jointventure', label: 'JointVenture', icon: Users },
  { 
    id: 'dashboards', 
    label: 'Dashboards', 
    icon: BarChart3,
    hasSubmenu: true,
    submenu: [
      { 
        id: 'app-management', 
        label: 'App Management', 
        icon: BarChart3,
        hasSubmenu: true,
        submenu: [
          {
            id: 'development-tools',
            label: 'Development Tools',
            icon: Code,
            hasSubmenu: true,
            submenu: [
              { id: 'app-settings', label: 'App Settings', icon: Settings },
              { id: 'build-management', label: 'App Build Management', icon: FileText },
              { id: 'developer-workflows', label: 'Developer Workflows & Instructions', icon: Code }
            ]
          },
          {
            id: 'architecture-design',
            label: 'Architecture & Design',
            icon: GitBranch,
            hasSubmenu: true,
            submenu: [
              { id: 'app-architecture', label: 'App Architecture', icon: GitBranch },
              { id: 'userflow-pipelines', label: 'UserFlow/Pipelines', icon: GitBranch },
              { id: 'app-user-guides', label: 'App User Guides', icon: FileText }
            ]
          },
          {
            id: 'infrastructure-monitoring',
            label: 'Infrastructure & Monitoring',
            icon: Database,
            hasSubmenu: true,
            submenu: [
              { id: 'database-management', label: 'Database Management', icon: Database },
              { id: 'database-monitor', label: 'Database Monitor', icon: Monitor },
              { id: 'toolstack-overview', label: 'Toolstack Overview', icon: Zap }
            ]
          },
          {
            id: 'documentation-tools',
            label: 'Documentation & Recovery',
            icon: FileText,
            hasSubmenu: true,
            submenu: [
              { id: 'app-documentation', label: 'Complete App Documentation', icon: FileText }
            ]
          },
          {
            id: 'additional-tools',
            label: 'User Tools',
            icon: Users,
            hasSubmenu: true,
            submenu: [
              { id: 'user-guide', label: 'User Guide', icon: BookOpen },
              { id: 'app-updates', label: 'App Updates', icon: FileText },
              { id: 'feedback-suggestions', label: 'Feedback & Suggestions', icon: Users }
            ]
          }
        ]
      }
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  selectedTab,
  onTabSelect,
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([
  ]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const Icon = item.icon;
    const isSelected = selectedTab === item.id;
    const isExpanded = expandedItems.includes(item.id);
    const hasSubmenu = item.hasSubmenu && item.submenu;

    return (
      <div key={item.id} className={`ml-${level * 4}`}>
        <motion.button
          onClick={() => {
            if (hasSubmenu) {
              toggleExpanded(item.id);
            } else {
              onTabSelect(item.id);
            }
          }}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            isSelected
              ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
              {hasSubmenu && (
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              )}
            </>
          )}
        </motion.button>

        <AnimatePresence>
          {hasSubmenu && isExpanded && !isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2 space-y-1 overflow-hidden"
            >
              {item.submenu?.map(subItem => renderNavItem(subItem, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.aside
      initial={{ width: isCollapsed ? 80 : 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900/95 backdrop-blur-xl border-r border-gray-800/50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-800/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-sm">MyMindVentures</h2>
                <p className="text-gray-400 text-xs">Developer Platform</p>
              </div>
            </motion.div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-800/50 text-gray-400 hover:text-white transition-colors"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {navigationItems.map(item => renderNavItem(item))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-4 border-t border-gray-800/50"
        >
          <div className="text-center">
            <p className="text-gray-400 text-xs">v1.0.0</p>
            <p className="text-gray-500 text-xs">© 2025 MyMindVentures</p>
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
};