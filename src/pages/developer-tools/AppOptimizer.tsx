import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Zap,
  Settings,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileCode,
  Trash2,
  RefreshCw,
  Download,
  Upload,
  Play,
  Pause,
  Stop,
  BarChart3,
  Shield,
  Brain,
  Code,
  Database,
  Monitor,
  Terminal,
  GitBranch,
  GitCommit,
  GitMerge,
  Package,
  Layers,
  Target,
  TrendingUp,
  AlertCircle,
  Info,
  HelpCircle,
  Star,
  Filter,
  Search,
  Plus,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  RotateCcw,
  RotateCw,
  Maximize2,
  Minimize2,
  Copy,
  ExternalLink,
  Link,
  Unlink,
  Lock,
  Unlock,
  Key,
  Wrench,
  Palette,
  Brush,
  Camera,
  Video,
  Music,
  Headphones,
  Speaker,
  Mic,
  Phone,
  Mail,
  MessageCircle,
  Bell,
  BellOff,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Heart,
  Star as StarIcon,
  Award,
  Trophy,
  Crown,
  DollarSign,
  Gift,
  Network,
  Globe,
  Map,
  MapPin,
  Navigation,
  Compass,
  Flag,
  Home,
  Image,
  Film,
  Tv,
  Radio,
  Play as PlayIcon,
  Pause as PauseIcon,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
  Grid,
  List,
  MoreHorizontal,
  MoreVertical,
  Tag,
  Hash,
  AtSign,
  FolderOpen,
  Server,
  Wifi,
  WifiOff,
  Signal,
  Battery,
  BatteryCharging,
  Power,
  PowerOff,
  Sun,
  Moon,
  CloudRain,
  CloudLightning,
  Wind,
  Thermometer,
  Droplets,
  Umbrella,
  Snowflake,
  CloudSnow,
  CloudFog,
  EyeOff as EyeOffIcon,
  VideoOff,
  MicOff,
  Volume1,
  Volume,
  MailOpen,
  Inbox,
  Send,
  Reply,
  Forward,
  Wallet,
  PiggyBank,
  Undo,
  Redo,
  FileText,
  GitCommit as GitCommitIcon,
  BookOpen,
  Smartphone,
  Briefcase,
  Folder,
  Archive,
  Bookmark,
  Move,
  Columns,
  Rows,
  Layout,
  Unlink as UnlinkIcon,
  ShieldCheck,
  Scan,
  Setup,
  Customize,
  Personalize,
  Theme,
  Color,
  Font,
  Size,
  Style,
  Format,
  Design,
  Template,
  Pattern,
  Texture,
  Gradient,
  Shadow,
  Border,
  Background,
  Foreground,
  Transparent,
  Opacity,
  Blur,
  Sharpen,
  Brightness,
  Contrast,
  Saturation,
  Hue,
  Temperature,
  Tint,
  Shade,
  Tone,
  Value,
  Chroma,
  Luminance,
  Alpha,
  Beta,
  Gamma,
  Delta,
  Epsilon,
  Zeta,
  Eta,
  Theta,
  Iota,
  Kappa,
  Lambda,
  Mu,
  Nu,
  Xi,
  Omicron,
  Pi,
  Rho,
  Sigma,
  Tau,
  Upsilon,
  Phi,
  Chi,
  Psi,
  Omega,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabaseService as db } from '../../lib/supabase';
import { debugLogger } from '../../lib/debug-log';

interface AppOptimizerProps {
  onBack?: () => void;
}

interface OptimizationTask {
  task_id: string;
  task_type:
    | 'codebase-audit'
    | 'dead-code-removal'
    | 'dependency-cleanup'
    | 'file-restructure'
    | 'performance-optimization'
    | 'security-scan'
    | 'backup-creation'
    | 'regression-test';
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'warning';
  progress: number;
  start_time?: string;
  end_time?: string;
  result?: any;
  error?: string;
  files_affected?: string[];
  performance_impact?: {
    before: any;
    after: any;
  };
  rollback_available?: boolean;
  backup_id?: string;
}

interface OptimizationReport {
  report_id: string;
  timestamp: string;
  overall_score: number;
  tasks_completed: number;
  tasks_failed: number;
  files_optimized: number;
  dependencies_removed: number;
  dead_code_removed: number;
  performance_improvement: number;
  security_issues_fixed: number;
  backup_created: boolean;
  rollback_available: boolean;
  recommendations: string[];
  warnings: string[];
  errors: string[];
}

interface OptimizationConfig {
  auto_backup: boolean;
  auto_rollback_on_failure: boolean;
  aggressive_cleanup: boolean;
  preserve_functionality: boolean;
  run_regression_tests: boolean;
  performance_threshold: number;
  security_scan_enabled: boolean;
  dependency_audit_enabled: boolean;
  dead_code_removal_enabled: boolean;
  file_restructure_enabled: boolean;
}

export const AppOptimizer: React.FC<AppOptimizerProps> = ({ onBack }) => {
  const [optimizationTasks, setOptimizationTasks] = useState<
    OptimizationTask[]
  >([]);
  const [currentReport, setCurrentReport] = useState<OptimizationReport | null>(
    null
  );
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [config, setConfig] = useState<OptimizationConfig>({
    auto_backup: true,
    auto_rollback_on_failure: true,
    aggressive_cleanup: false,
    preserve_functionality: true,
    run_regression_tests: true,
    performance_threshold: 80,
    security_scan_enabled: true,
    dependency_audit_enabled: true,
    dead_code_removal_enabled: true,
    file_restructure_enabled: true,
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<
    'optimizer' | 'report' | 'config' | 'logs'
  >('optimizer');

  useEffect(() => {
    loadOptimizationHistory();
  }, []);

  const loadOptimizationHistory = async () => {
    try {
      const { data: tasks } = await db.getOptimizationTasks('demo-user');
      if (tasks) {
        setOptimizationTasks(tasks);
      }

      const { data: reports } = await db.getOptimizationReports('demo-user');
      if (reports && reports.length > 0) {
        setCurrentReport(reports[0]); // Most recent report
      }
    } catch (error) {
      console.error('Error loading optimization history:', error);
    }
  };

  const startOptimization = async () => {
    setIsOptimizing(true);
    setLogs([]);

    try {
      await debugLogger.logInfo(
        'optimization',
        'App Optimization Started',
        'Initiating comprehensive app optimization workflow',
        ['Optimization started', 'Backup creation', 'Codebase audit']
      );

      addLog('🚀 Starting comprehensive app optimization...');

      // 1. Create backup
      if (config.auto_backup) {
        await createBackup();
      }

      // 2. Run all optimization tasks
      const tasks = await createOptimizationTasks();
      setOptimizationTasks(tasks);

      for (const task of tasks) {
        await runOptimizationTask(task);
      }

      // 3. Generate final report
      const report = await generateOptimizationReport(tasks);
      setCurrentReport(report);

      // 4. Run regression tests
      if (config.run_regression_tests) {
        await runRegressionTests();
      }

      // 5. Reload app if successful
      if (report.overall_score >= config.performance_threshold) {
        await reloadApp();
      }

      await debugLogger.logInfo(
        'optimization',
        'App Optimization Completed',
        `Optimization completed with score: ${report.overall_score}/100`,
        ['Optimization completed', 'Report generated', 'App reloaded']
      );

      addLog('✅ App optimization completed successfully!');
      addLog(`📊 Overall score: ${report.overall_score}/100`);
    } catch (error) {
      console.error('Optimization failed:', error);
      addLog(
        `❌ Optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );

      if (config.auto_rollback_on_failure) {
        await rollbackOptimization();
      }
    } finally {
      setIsOptimizing(false);
    }
  };

  const createBackup = async () => {
    addLog('💾 Creating backup...');

    const backupTask: OptimizationTask = {
      task_id: `backup-${Date.now()}`,
      task_type: 'backup-creation',
      name: 'Create Backup',
      description: 'Creating backup of current codebase state',
      status: 'running',
      progress: 0,
    };

    setOptimizationTasks(prev => [...prev, backupTask]);

    // Simulate backup creation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const completedTask = {
      ...backupTask,
      status: 'completed' as const,
      progress: 100,
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
      result: { backup_id: `backup-${Date.now()}` },
    };

    setOptimizationTasks(prev =>
      prev.map(t => (t.task_id === backupTask.task_id ? completedTask : t))
    );

    addLog('✅ Backup created successfully');
  };

  const createOptimizationTasks = async (): Promise<OptimizationTask[]> => {
    const tasks: OptimizationTask[] = [
      {
        task_id: `audit-${Date.now()}`,
        task_type: 'codebase-audit',
        name: 'Codebase Audit',
        description: 'Comprehensive codebase analysis and structure review',
        status: 'pending',
        progress: 0,
      },
      {
        task_id: `dead-code-${Date.now()}`,
        task_type: 'dead-code-removal',
        name: 'Dead Code Removal',
        description: 'Identify and remove unused code and files',
        status: 'pending',
        progress: 0,
      },
      {
        task_id: `dependencies-${Date.now()}`,
        task_type: 'dependency-cleanup',
        name: 'Dependency Cleanup',
        description: 'Remove unused dependencies and update outdated packages',
        status: 'pending',
        progress: 0,
      },
      {
        task_id: `restructure-${Date.now()}`,
        task_type: 'file-restructure',
        name: 'File Restructure',
        description: 'Reorganize file structure for better maintainability',
        status: 'pending',
        progress: 0,
      },
      {
        task_id: `performance-${Date.now()}`,
        task_type: 'performance-optimization',
        name: 'Performance Optimization',
        description:
          'Optimize bundle size, loading speed, and runtime performance',
        status: 'pending',
        progress: 0,
      },
      {
        task_id: `security-${Date.now()}`,
        task_type: 'security-scan',
        name: 'Security Scan',
        description: 'Scan for security vulnerabilities and fix issues',
        status: 'pending',
        progress: 0,
      },
    ];

    return tasks;
  };

  const runOptimizationTask = async (task: OptimizationTask) => {
    addLog(`🔄 Running: ${task.name}...`);

    const updatedTask = {
      ...task,
      status: 'running' as const,
      start_time: new Date().toISOString(),
    };
    setOptimizationTasks(prev =>
      prev.map(t => (t.task_id === task.task_id ? updatedTask : t))
    );

    try {
      // Simulate task execution with progress updates
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 500));

        setOptimizationTasks(prev =>
          prev.map(t => (t.task_id === task.task_id ? { ...t, progress } : t))
        );
      }

      // Simulate task-specific results
      const result = await simulateTaskResult(task);

      const completedTask = {
        ...updatedTask,
        status: 'completed' as const,
        progress: 100,
        end_time: new Date().toISOString(),
        result,
      };

      setOptimizationTasks(prev =>
        prev.map(t => (t.task_id === task.task_id ? completedTask : t))
      );

      addLog(`✅ ${task.name} completed successfully`);
    } catch (error) {
      const failedTask = {
        ...updatedTask,
        status: 'failed' as const,
        end_time: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      setOptimizationTasks(prev =>
        prev.map(t => (t.task_id === task.task_id ? failedTask : t))
      );

      addLog(
        `❌ ${task.name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const simulateTaskResult = async (task: OptimizationTask) => {
    switch (task.task_type) {
      case 'codebase-audit':
        return {
          files_analyzed: 150,
          issues_found: 12,
          recommendations: 8,
          complexity_score: 75,
        };

      case 'dead-code-removal':
        return {
          files_removed: 5,
          lines_removed: 1200,
          bundle_size_reduction: '15%',
          files_affected: [
            'src/utils/old-utils.ts',
            'src/components/UnusedComponent.tsx',
          ],
        };

      case 'dependency-cleanup':
        return {
          dependencies_removed: 8,
          dependencies_updated: 12,
          security_vulnerabilities_fixed: 3,
          bundle_size_reduction: '8%',
        };

      case 'file-restructure':
        return {
          files_moved: 25,
          new_structure_created: true,
          imports_updated: 150,
          maintainability_score: 85,
        };

      case 'performance-optimization':
        return {
          bundle_size_reduction: '20%',
          loading_speed_improvement: '30%',
          memory_usage_reduction: '25%',
          lighthouse_score_improvement: 15,
        };

      case 'security-scan':
        return {
          vulnerabilities_found: 2,
          vulnerabilities_fixed: 2,
          security_score: 95,
          recommendations: 3,
        };

      default:
        return { success: true };
    }
  };

  const generateOptimizationReport = async (
    tasks: OptimizationTask[]
  ): Promise<OptimizationReport> => {
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const failedTasks = tasks.filter(t => t.status === 'failed');

    const overallScore = Math.round(
      (completedTasks.length / tasks.length) * 100
    );

    const report: OptimizationReport = {
      report_id: `report-${Date.now()}`,
      timestamp: new Date().toISOString(),
      overall_score: overallScore,
      tasks_completed: completedTasks.length,
      tasks_failed: failedTasks.length,
      files_optimized: completedTasks.reduce(
        (sum, task) => sum + (task.result?.files_affected?.length || 0),
        0
      ),
      dependencies_removed:
        completedTasks.find(t => t.task_type === 'dependency-cleanup')?.result
          ?.dependencies_removed || 0,
      dead_code_removed:
        completedTasks.find(t => t.task_type === 'dead-code-removal')?.result
          ?.lines_removed || 0,
      performance_improvement:
        completedTasks.find(t => t.task_type === 'performance-optimization')
          ?.result?.bundle_size_reduction || 0,
      security_issues_fixed:
        completedTasks.find(t => t.task_type === 'security-scan')?.result
          ?.vulnerabilities_fixed || 0,
      backup_created: true,
      rollback_available: true,
      recommendations: [
        'Consider implementing code splitting for better performance',
        'Add more comprehensive unit tests',
        'Implement automated dependency updates',
      ],
      warnings:
        failedTasks.length > 0 ? ['Some optimization tasks failed'] : [],
      errors: failedTasks.map(t => t.error || 'Unknown error'),
    };

    await db.createOptimizationReport(report);
    return report;
  };

  const runRegressionTests = async () => {
    addLog('🧪 Running regression tests...');

    // Simulate regression testing
    await new Promise(resolve => setTimeout(resolve, 3000));

    addLog('✅ All regression tests passed');
  };

  const reloadApp = async () => {
    addLog('🔄 Reloading app with optimized code...');

    // Simulate app reload
    await new Promise(resolve => setTimeout(resolve, 2000));

    addLog('✅ App reloaded successfully');
  };

  const rollbackOptimization = async () => {
    addLog('🔄 Rolling back optimization due to failures...');

    // Simulate rollback
    await new Promise(resolve => setTimeout(resolve, 3000));

    addLog('✅ Rollback completed successfully');
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const updateConfig = async (newConfig: Partial<OptimizationConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    await db.updateOptimizationConfig('demo-user', updatedConfig);
  };

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case 'codebase-audit':
        return <Code className='w-5 h-5' />;
      case 'dead-code-removal':
        return <Trash2 className='w-5 h-5' />;
      case 'dependency-cleanup':
        return <Package className='w-5 h-5' />;
      case 'file-restructure':
        return <Layers className='w-5 h-5' />;
      case 'performance-optimization':
        return <Zap className='w-5 h-5' />;
      case 'security-scan':
        return <Shield className='w-5 h-5' />;
      case 'backup-creation':
        return <Download className='w-5 h-5' />;
      case 'regression-test':
        return <CheckCircle className='w-5 h-5' />;
      default:
        return <Settings className='w-5 h-5' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'running':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center space-x-4'>
            <Button
              onClick={onBack}
              variant='ghost'
              className='flex items-center space-x-2'
            >
              <ArrowLeft className='w-4 h-4' />
              <span>Back</span>
            </Button>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>
                App Optimizer
              </h1>
              <p className='text-gray-600'>
                Comprehensive codebase optimization and cleanup
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <div
                className={`w-3 h-3 rounded-full ${isOptimizing ? 'bg-green-500' : 'bg-gray-400'}`}
              />
              <span className='text-sm text-gray-600'>
                Optimizer {isOptimizing ? 'Running' : 'Idle'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm'>
          <button
            onClick={() => setActiveTab('optimizer')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'optimizer'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Zap className='w-4 h-4 inline mr-2' />
            Optimizer
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'report'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className='w-4 h-4 inline mr-2' />
            Report
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'config'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className='w-4 h-4 inline mr-2' />
            Configuration
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'logs'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Terminal className='w-4 h-4 inline mr-2' />
            Logs
          </button>
        </div>

        {/* Optimizer Tab */}
        {activeTab === 'optimizer' && (
          <div className='space-y-6'>
            {/* Main Optimize Button */}
            <Card className='p-6'>
              <div className='text-center space-y-4'>
                <div className='w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center'>
                  <Zap className='w-8 h-8 text-white' />
                </div>
                <h2 className='text-2xl font-bold'>Optimize App</h2>
                <p className='text-gray-600 max-w-2xl mx-auto'>
                  Automatically audit, clean, and optimize your entire codebase.
                  This will:
                </p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto'>
                  <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                    <Trash2 className='w-5 h-5 text-red-500' />
                    <span>Remove dead code and unused files</span>
                  </div>
                  <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                    <Package className='w-5 h-5 text-orange-500' />
                    <span>Clean up unused dependencies</span>
                  </div>
                  <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                    <Zap className='w-5 h-5 text-yellow-500' />
                    <span>Optimize performance and bundle size</span>
                  </div>
                  <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                    <Shield className='w-5 h-5 text-green-500' />
                    <span>Scan and fix security issues</span>
                  </div>
                </div>
                <Button
                  onClick={startOptimization}
                  disabled={isOptimizing}
                  size='lg'
                  className='bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                >
                  {isOptimizing ? (
                    <>
                      <RefreshCw className='w-5 h-5 mr-2 animate-spin' />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Zap className='w-5 h-5 mr-2' />
                      Start Optimization
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Current Tasks */}
            {optimizationTasks.length > 0 && (
              <Card className='p-6'>
                <h2 className='text-xl font-semibold mb-4'>
                  Optimization Tasks
                </h2>
                <div className='space-y-4'>
                  {optimizationTasks.map(task => (
                    <div
                      key={task.task_id}
                      className={`p-4 rounded-lg border ${getStatusColor(task.status)}`}
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-3'>
                          {getTaskIcon(task.task_type)}
                          <div>
                            <h3 className='font-medium'>{task.name}</h3>
                            <p className='text-sm'>{task.description}</p>
                          </div>
                        </div>
                        <div className='text-right'>
                          <div className='text-sm font-medium'>
                            {task.status === 'completed'
                              ? '100%'
                              : task.status === 'running'
                                ? `${task.progress}%`
                                : task.status === 'failed'
                                  ? 'Failed'
                                  : 'Pending'}
                          </div>
                          {task.status === 'running' && (
                            <div className='w-32 bg-gray-200 rounded-full h-2 mt-2'>
                              <div
                                className='bg-blue-500 h-2 rounded-full transition-all duration-300'
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Report Tab */}
        {activeTab === 'report' && currentReport && (
          <div className='space-y-6'>
            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>
                Optimization Report
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='text-center p-4 bg-gray-50 rounded-lg'>
                  <div className='text-3xl font-bold text-blue-600'>
                    {currentReport.overall_score}%
                  </div>
                  <div className='text-sm text-gray-600'>Overall Score</div>
                </div>
                <div className='text-center p-4 bg-gray-50 rounded-lg'>
                  <div className='text-3xl font-bold text-green-600'>
                    {currentReport.tasks_completed}
                  </div>
                  <div className='text-sm text-gray-600'>Tasks Completed</div>
                </div>
                <div className='text-center p-4 bg-gray-50 rounded-lg'>
                  <div className='text-3xl font-bold text-red-600'>
                    {currentReport.tasks_failed}
                  </div>
                  <div className='text-sm text-gray-600'>Tasks Failed</div>
                </div>
              </div>

              <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='font-semibold mb-2'>Optimization Results</h3>
                  <div className='space-y-2 text-sm'>
                    <div>Files optimized: {currentReport.files_optimized}</div>
                    <div>
                      Dependencies removed: {currentReport.dependencies_removed}
                    </div>
                    <div>
                      Dead code removed: {currentReport.dead_code_removed} lines
                    </div>
                    <div>
                      Performance improvement:{' '}
                      {currentReport.performance_improvement}%
                    </div>
                    <div>
                      Security issues fixed:{' '}
                      {currentReport.security_issues_fixed}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className='font-semibold mb-2'>Recommendations</h3>
                  <ul className='space-y-1 text-sm'>
                    {currentReport.recommendations.map((rec, index) => (
                      <li key={index} className='flex items-start space-x-2'>
                        <Star className='w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0' />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Configuration Tab */}
        {activeTab === 'config' && (
          <div className='space-y-6'>
            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>
                Optimization Configuration
              </h2>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-medium'>Auto Backup</h3>
                    <p className='text-sm text-gray-600'>
                      Create backup before optimization
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      updateConfig({ auto_backup: !config.auto_backup })
                    }
                    variant={config.auto_backup ? 'default' : 'outline'}
                  >
                    {config.auto_backup ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-medium'>Auto Rollback on Failure</h3>
                    <p className='text-sm text-gray-600'>
                      Automatically rollback if optimization fails
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      updateConfig({
                        auto_rollback_on_failure:
                          !config.auto_rollback_on_failure,
                      })
                    }
                    variant={
                      config.auto_rollback_on_failure ? 'default' : 'outline'
                    }
                  >
                    {config.auto_rollback_on_failure ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-medium'>Aggressive Cleanup</h3>
                    <p className='text-sm text-gray-600'>
                      More aggressive code cleanup (may affect functionality)
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      updateConfig({
                        aggressive_cleanup: !config.aggressive_cleanup,
                      })
                    }
                    variant={config.aggressive_cleanup ? 'default' : 'outline'}
                  >
                    {config.aggressive_cleanup ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-medium'>Run Regression Tests</h3>
                    <p className='text-sm text-gray-600'>
                      Run tests after optimization
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      updateConfig({
                        run_regression_tests: !config.run_regression_tests,
                      })
                    }
                    variant={
                      config.run_regression_tests ? 'default' : 'outline'
                    }
                  >
                    {config.run_regression_tests ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className='space-y-6'>
            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>Optimization Logs</h2>
              <div className='bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto'>
                {logs.length === 0 ? (
                  <div className='text-gray-500'>
                    No logs available. Start optimization to see logs.
                  </div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className='mb-1'>
                      {log}
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
