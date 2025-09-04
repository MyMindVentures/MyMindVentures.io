import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Brain,
  Settings,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  X,
  Clock,
  Code,
  Zap,
  Target,
  BarChart3,
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
  Eye,
  EyeOff,
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
  MessageSquare,
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

interface AIOrchestratorProps {
  onBack?: () => void;
}

interface AIOrchestratorTask {
  task_id: string;
  task_type:
    | 'code-generation'
    | 'code-review'
    | 'testing'
    | 'documentation'
    | 'optimization'
    | 'security'
    | 'deployment';
  description: string;
  selected_ai_model:
    | 'openai-gpt4'
    | 'openai-gpt3.5'
    | 'perplexity'
    | 'claude'
    | 'custom';
  selected_devtool:
    | 'cursor-ai'
    | 'bolt-ai'
    | 'vscode'
    | 'webstorm'
    | 'terminal';
  workflow_steps: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  performance_score: number;
  created_at: string;
  completed_at?: string;
  user_id: string;
}

interface OrchestratorConfig {
  auto_select_ai: boolean;
  auto_select_devtool: boolean;
  ai_models: {
    'code-generation': string[];
    'code-review': string[];
    testing: string[];
    documentation: string[];
    optimization: string[];
    security: string[];
    deployment: string[];
  };
  devtools: {
    'cursor-ai': string[];
    'bolt-ai': string[];
    vscode: string[];
    webstorm: string[];
    terminal: string[];
  };
}

export const AIOrchestrator: React.FC<AIOrchestratorProps> = ({ onBack }) => {
  const [orchestratorTasks, setOrchestratorTasks] = useState<
    AIOrchestratorTask[]
  >([]);
  const [config, setConfig] = useState<OrchestratorConfig>({
    auto_select_ai: true,
    auto_select_devtool: true,
    ai_models: {
      'code-generation': ['openai-gpt4', 'claude'],
      'code-review': ['openai-gpt4', 'perplexity'],
      testing: ['openai-gpt4', 'custom'],
      documentation: ['openai-gpt4', 'claude'],
      optimization: ['openai-gpt4', 'perplexity'],
      security: ['openai-gpt4', 'custom'],
      deployment: ['openai-gpt4', 'custom'],
    },
    devtools: {
      'cursor-ai': ['code-generation', 'code-review', 'testing'],
      'bolt-ai': ['code-generation', 'documentation', 'optimization'],
      vscode: ['code-review', 'testing', 'deployment'],
      webstorm: ['code-generation', 'optimization', 'security'],
      terminal: ['deployment', 'testing', 'security'],
    },
  });
  const [isOrchestratorRunning, setIsOrchestratorRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'orchestrator' | 'config' | 'history'
  >('orchestrator');

  useEffect(() => {
    loadOrchestratorTasks();
  }, []);

  const loadOrchestratorTasks = async () => {
    try {
      const tasks = await db.getOrchestratorTasks('demo-user');
      setOrchestratorTasks(tasks);
    } catch (error) {
      console.error('Error loading orchestrator tasks:', error);
    }
  };

  const runOrchestratorTask = async (
    taskType: AIOrchestratorTask['task_type']
  ) => {
    setIsOrchestratorRunning(true);
    try {
      await debugLogger.logInfo(
        'orchestrator',
        `AI Orchestrator Task Started: ${taskType}`,
        `Initiating AI orchestrator task for ${taskType}`,
        ['Orchestrator started', 'AI model selection', 'Devtool selection']
      );

      // Auto-select best AI model and devtool
      const selectedAI = config.auto_select_ai
        ? selectBestAIModel(taskType)
        : 'openai-gpt4';
      const selectedDevtool = config.auto_select_devtool
        ? selectBestDevtool(taskType)
        : 'cursor-ai';

      const task: AIOrchestratorTask = {
        task_id: `task-${Date.now()}`,
        task_type: taskType,
        description: `AI Orchestrator task for ${taskType}`,
        selected_ai_model: selectedAI as any,
        selected_devtool: selectedDevtool as any,
        workflow_steps: generateWorkflowSteps(
          taskType,
          selectedAI,
          selectedDevtool
        ),
        status: 'running',
        performance_score: 0,
        created_at: new Date().toISOString(),
        user_id: 'demo-user',
      };

      setOrchestratorTasks(prev => [...prev, task]);

      // Simulate task execution
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Update task with completion
      const completedTask = {
        ...task,
        status: 'completed' as const,
        performance_score: Math.floor(Math.random() * 30) + 70, // 70-100
        completed_at: new Date().toISOString(),
      };

      setOrchestratorTasks(prev =>
        prev.map(t => (t.task_id === task.task_id ? completedTask : t))
      );

      await db.createOrchestratorTask(completedTask);

      await debugLogger.logInfo(
        'orchestrator',
        `AI Orchestrator Task Completed: ${taskType}`,
        `AI orchestrator task completed successfully with ${selectedAI} and ${selectedDevtool}`,
        [
          'Task completed',
          'AI model used',
          'Devtool used',
          'Performance score recorded',
        ]
      );
    } catch (error) {
      console.error('Error running orchestrator task:', error);
    } finally {
      setIsOrchestratorRunning(false);
    }
  };

  const selectBestAIModel = (taskType: string): string => {
    const models = config.ai_models[
      taskType as keyof typeof config.ai_models
    ] || ['openai-gpt4'];
    return models[0]; // For now, return first model. In real implementation, use ML to select best
  };

  const selectBestDevtool = (taskType: string): string => {
    const tools = Object.entries(config.devtools).find(([tool, tasks]) =>
      tasks.includes(taskType)
    );
    return tools ? tools[0] : 'cursor-ai';
  };

  const generateWorkflowSteps = (
    taskType: string,
    aiModel: string,
    devtool: string
  ): string[] => {
    const steps = [
      `1. Initialize ${taskType} task`,
      `2. Select ${aiModel} for AI processing`,
      `3. Configure ${devtool} for development`,
      `4. Execute ${taskType} workflow`,
      `5. Validate results`,
      `6. Generate performance report`,
    ];
    return steps;
  };

  const updateConfig = async (newConfig: Partial<OrchestratorConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    await db.updateOrchestratorConfig('demo-user', updatedConfig);
  };

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case 'code-generation':
        return <Code className='w-5 h-5' />;
      case 'code-review':
        return <Eye className='w-5 h-5' />;
      case 'testing':
        return <CheckCircle className='w-5 h-5' />;
      case 'documentation':
        return <FileText className='w-5 h-5' />;
      case 'optimization':
        return <Zap className='w-5 h-5' />;
      case 'security':
        return <ShieldCheck className='w-5 h-5' />;
      case 'deployment':
        return <Server className='w-5 h-5' />;
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
                AI Orchestrator
              </h1>
              <p className='text-gray-600'>
                Intelligent AI model selection and task orchestration
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <div
                className={`w-3 h-3 rounded-full ${isOrchestratorRunning ? 'bg-green-500' : 'bg-gray-400'}`}
              />
              <span className='text-sm text-gray-600'>
                Orchestrator {isOrchestratorRunning ? 'Running' : 'Idle'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm'>
          <button
            onClick={() => setActiveTab('orchestrator')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'orchestrator'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Brain className='w-4 h-4 inline mr-2' />
            Orchestrator
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
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className='w-4 h-4 inline mr-2' />
            History
          </button>
        </div>

        {/* AI Orchestrator Tab */}
        {activeTab === 'orchestrator' && (
          <div className='space-y-6'>
            {/* Quick Actions */}
            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>
                Quick AI Orchestrator Tasks
              </h2>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {(
                  [
                    'code-generation',
                    'code-review',
                    'testing',
                    'documentation',
                  ] as const
                ).map(taskType => (
                  <Button
                    key={taskType}
                    onClick={() => runOrchestratorTask(taskType)}
                    disabled={isOrchestratorRunning}
                    className='flex flex-col items-center space-y-2 p-4 h-auto'
                  >
                    <Code className='w-6 h-6' />
                    <span className='text-sm capitalize'>
                      {taskType.replace('-', ' ')}
                    </span>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Recent Tasks */}
            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>
                Recent Orchestrator Tasks
              </h2>
              <div className='space-y-4'>
                {orchestratorTasks.slice(0, 5).map(task => (
                  <div
                    key={task.task_id}
                    className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'
                  >
                    <div className='flex items-center space-x-4'>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          task.status === 'completed'
                            ? 'bg-green-500'
                            : task.status === 'running'
                              ? 'bg-yellow-500'
                              : task.status === 'failed'
                                ? 'bg-red-500'
                                : 'bg-gray-400'
                        }`}
                      />
                      <div>
                        <h3 className='font-medium capitalize'>
                          {task.task_type.replace('-', ' ')}
                        </h3>
                        <p className='text-sm text-gray-600'>
                          {task.selected_ai_model} + {task.selected_devtool}
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-sm font-medium'>
                        {task.status === 'completed'
                          ? `${task.performance_score}%`
                          : task.status}
                      </div>
                      <div className='text-xs text-gray-500'>
                        {new Date(task.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Configuration Tab */}
        {activeTab === 'config' && (
          <div className='space-y-6'>
            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>
                Orchestrator Configuration
              </h2>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-medium'>Auto-select AI Model</h3>
                    <p className='text-sm text-gray-600'>
                      Automatically choose the best AI model for each task
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      updateConfig({ auto_select_ai: !config.auto_select_ai })
                    }
                    variant={config.auto_select_ai ? 'default' : 'outline'}
                  >
                    {config.auto_select_ai ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-medium'>Auto-select Devtool</h3>
                    <p className='text-sm text-gray-600'>
                      Automatically choose the best development tool for each
                      task
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      updateConfig({
                        auto_select_devtool: !config.auto_select_devtool,
                      })
                    }
                    variant={config.auto_select_devtool ? 'default' : 'outline'}
                  >
                    {config.auto_select_devtool ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className='space-y-6'>
            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>Task History</h2>
              <div className='space-y-4'>
                {orchestratorTasks.map(task => (
                  <div
                    key={task.task_id}
                    className={`p-4 rounded-lg border ${getStatusColor(task.status)}`}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        {getTaskIcon(task.task_type)}
                        <div>
                          <h3 className='font-medium capitalize'>
                            {task.task_type.replace('-', ' ')}
                          </h3>
                          <p className='text-sm'>{task.description}</p>
                          <p className='text-xs text-gray-500'>
                            {task.selected_ai_model} + {task.selected_devtool}
                          </p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='text-sm font-medium'>
                          {task.status === 'completed'
                            ? `${task.performance_score}%`
                            : task.status}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {new Date(task.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
