import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Zap,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { UserProfile } from '../ui/UserProfile';

interface HeaderProps {
  currentPage: string;
  workflowStatus?: {
    isRunning: boolean;
    currentStep?: string;
    progress?: number;
    estimatedTime?: string;
  };
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  workflowStatus,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const getPageTitle = (page: string) => {
    const titles: { [key: string]: string } = {
      home: 'Dashboard',
      story: 'My Story & Roadmap',
      apps: 'Apps',
      jointventure: 'JointVenture',
      'app-management': 'App Management',
      'app-settings': 'App Settings',
      'build-management': 'App Build Management',
      'developer-workflows': 'Developer Workflows & Instructions',
      'app-architecture': 'App Architecture',
      'database-management': 'Database Management',
      'database-monitor': 'Database Monitor',
      'toolstack-overview': 'Toolstack Overview',
      'userflow-pipelines': 'UserFlow/Pipelines',
      'app-user-guides': 'App User Guides',
      'user-guide': 'User Guide',
      'app-updates': 'App Updates',
      'feedback-suggestions': 'Feedback & Suggestions',
    };
    return titles[page] || 'MyMindVentures.io';
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className='bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50 px-6 py-4 sticky top-0 z-40'
    >
      <div className='flex items-center justify-between'>
        {/* Left Section - Page Title */}
        <div className='flex items-center space-x-4'>
          <motion.h1
            key={currentPage}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className='text-xl font-bold text-white'
          >
            {getPageTitle(currentPage)}
          </motion.h1>
          <div className='hidden md:block w-px h-6 bg-gray-700' />
          <div className='hidden md:flex items-center space-x-2 text-sm text-gray-400'>
            <Zap className='w-4 h-4 text-cyan-400' />
            <span>Live Environment</span>
          </div>

          {/* Workflow Status Indicator */}
          {workflowStatus?.isRunning && (
            <div className='flex items-center space-x-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg px-4 py-2'>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
                <span className='text-sm font-medium text-white'>
                  Ultra Workflow Running
                </span>
              </div>
              {workflowStatus.currentStep && (
                <div className='flex items-center space-x-2 text-xs text-gray-300'>
                  <span>Step:</span>
                  <span className='font-medium'>
                    {workflowStatus.currentStep}
                  </span>
                </div>
              )}
              {workflowStatus.progress !== undefined && (
                <div className='flex items-center space-x-2 text-xs text-gray-300'>
                  <span>Progress:</span>
                  <span className='font-medium'>
                    {workflowStatus.progress}%
                  </span>
                </div>
              )}
              {workflowStatus.estimatedTime && (
                <div className='flex items-center space-x-2 text-xs text-gray-300'>
                  <span>ETA:</span>
                  <span className='font-medium'>
                    {workflowStatus.estimatedTime}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center Section - Search */}
        <div className='hidden lg:flex items-center flex-1 max-w-md mx-8'>
          <div className='relative w-full'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input
              type='text'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder='Search tools, guides, or documentation...'
              className='w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200'
            />
          </div>
        </div>

        {/* Right Section - Actions & Profile */}
        <div className='flex items-center space-x-4'>
          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className='p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all duration-200'
          >
            {isDarkMode ? (
              <Sun className='w-4 h-4' />
            ) : (
              <Moon className='w-4 h-4' />
            )}
          </button>

          {/* Notifications */}
          <button className='relative p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-all duration-200'>
            <Bell className='w-4 h-4' />
            <div className='absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse' />
          </button>

          {/* Profile Dropdown */}
          <div className='relative'>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className='flex items-center space-x-3 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-200'
            >
              <div className='w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center'>
                <User className='w-4 h-4 text-white' />
              </div>
              <div className='hidden md:block text-left'>
                <div className='text-white text-sm font-medium'>Demo User</div>
                <div className='text-gray-400 text-xs'>
                  hello@mymindventures.io
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  isProfileOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className='absolute right-0 top-full mt-2 w-64 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden z-50'
              >
                <div className='p-4 border-b border-gray-700/50'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center'>
                      <span className='text-white font-bold text-sm'>
                        {userProfile?.full_name
                          ? userProfile.full_name
                              .split(' ')
                              .map(n => n[0])
                              .join('')
                          : 'DU'}
                      </span>
                    </div>
                    <div>
                      <div className='text-white font-medium'>
                        {userProfile?.full_name || 'Demo User'}
                      </div>
                      <div className='text-gray-400 text-sm'>
                        {userProfile?.email || 'hello@mymindventures.io'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='p-2'>
                  <button className='w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 text-gray-300 hover:text-white transition-all duration-200'>
                    <User className='w-4 h-4' />
                    <span className='text-sm'>Profile Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsUserProfileOpen(true);
                      setIsProfileOpen(false);
                    }}
                    className='w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 text-gray-300 hover:text-white transition-all duration-200'
                  >
                    <User className='w-4 h-4' />
                    <span className='text-sm'>View Profile</span>
                  </button>
                  <button className='w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 text-gray-300 hover:text-white transition-all duration-200'>
                    <Settings className='w-4 h-4' />
                    <span className='text-sm'>Preferences</span>
                  </button>
                  <div className='border-t border-gray-700/50 my-2' />
                  <button className='w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-500/10 text-gray-300 hover:text-red-400 transition-all duration-200'>
                    <LogOut className='w-4 h-4' />
                    <span className='text-sm'>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Login Button (for unauthenticated state) */}
          <Button variant='primary' className='hidden'>
            <User className='w-4 h-4 mr-2' />
            Login
          </Button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className='lg:hidden mt-4'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
          <input
            type='text'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder='Search...'
            className='w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200'
          />
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfile
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
      />
    </motion.header>
  );
};
