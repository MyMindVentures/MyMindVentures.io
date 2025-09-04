import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Brain,
  GitBranch,
  GitCommit,
  GitPullRequest,
  GitMerge,
  AlertTriangle,
  Bell,
  BellOff,
  Settings,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  X,
  Clock,
  Users,
  Code,
  Zap,
  Shield,
  Eye,
  MessageSquare,
  FileCode,
  Layers,
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
  Trash,
  Save,
  Download,
  Upload,
  Monitor,
  Terminal,
  UserCheck,
  GitBranch as GitBranchIcon,
  GitCommit as GitCommitIcon,
  GitPullRequest as GitPullRequestIcon,
  GitMerge as GitMergeIcon,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabaseService as db } from '../../lib/supabase';
import { debugLogger } from '../../lib/debug-log';

interface AIOrchestratorGitAlertsProps {
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

interface GitAlert {
  alert_id: string;
  alert_type:
    | 'commit-needed'
    | 'wrong-branch'
    | 'merge-conflict-risk'
    | 'stale-branch'
    | 'uncommitted-changes'
    | 'branch-switch-suggested';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  action_required: string;
  suggested_action: string;
  current_branch?: string;
  suggested_branch?: string;
  time_since_last_commit?: string;
  uncommitted_files?: string[];
  status: 'active' | 'acknowledged' | 'resolved';
  created_at: string;
  resolved_at?: string;
  user_id: string;
}

interface OrchestratorConfig {
  auto_select_ai: boolean;
  auto_select_devtool: boolean;
  git_alerts_enabled: boolean;
  commit_reminder_minutes: number;
  branch_check_enabled: boolean;
  merge_conflict_detection: boolean;
  notification_methods: ('popup' | 'chat' | 'smart-reminder')[];
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

export const AIOrchestratorGitAlerts: React.FC<
  AIOrchestratorGitAlertsProps
> = ({ onBack }) => {
  const [orchestratorTasks, setOrchestratorTasks] = useState<
    AIOrchestratorTask[]
  >([]);
  const [gitAlerts, setGitAlerts] = useState<GitAlert[]>([]);
  const [config, setConfig] = useState<OrchestratorConfig>({
    auto_select_ai: true,
    auto_select_devtool: true,
    git_alerts_enabled: true,
    commit_reminder_minutes: 30,
    branch_check_enabled: true,
    merge_conflict_detection: true,
    notification_methods: ['popup', 'smart-reminder'],
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
  const [isGitMonitoring, setIsGitMonitoring] = useState(false);
  const [currentBranch, setCurrentBranch] = useState('main');
  const [lastCommit, setLastCommit] = useState<string>('');
  const [uncommittedFiles, setUncommittedFiles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<
    'orchestrator' | 'git-alerts' | 'config'
  >('orchestrator');

  useEffect(() => {
    loadOrchestratorTasks();
    loadGitAlerts();
    startGitMonitoring();
  }, []);

  const loadOrchestratorTasks = async () => {
    try {
      const tasks = await db.getOrchestratorTasks('demo-user');
      setOrchestratorTasks(tasks);
    } catch (error) {
      console.error('Error loading orchestrator tasks:', error);
    }
  };

  const loadGitAlerts = async () => {
    try {
      const alerts = await db.getGitAlerts('demo-user');
      setGitAlerts(alerts);
    } catch (error) {
      console.error('Error loading git alerts:', error);
    }
  };

  const startGitMonitoring = () => {
    setIsGitMonitoring(true);
    // Simulate Git monitoring
    const interval = setInterval(() => {
      checkGitStatus();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  };

  const checkGitStatus = async () => {
    try {
      // Simulate Git status check
      const mockGitStatus = {
        currentBranch: 'feature/new-feature',
        lastCommit: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
        uncommittedFiles: [
          'src/components/NewFeature.tsx',
          'src/pages/NewPage.tsx',
        ],
        hasMergeConflicts: false,
      };

      setCurrentBranch(mockGitStatus.currentBranch);
      setLastCommit(mockGitStatus.lastCommit);
      setUncommittedFiles(mockGitStatus.uncommittedFiles);

      // Generate alerts based on status
      await generateGitAlerts(mockGitStatus);
    } catch (error) {
      console.error('Error checking Git status:', error);
    }
  };

  const generateGitAlerts = async (gitStatus: any) => {
    const newAlerts: GitAlert[] = [];

    // Check for commit needed
    const timeSinceCommit =
      Date.now() - new Date(gitStatus.lastCommit).getTime();
    const minutesSinceCommit = Math.floor(timeSinceCommit / (1000 * 60));

    if (minutesSinceCommit > config.commit_reminder_minutes) {
      newAlerts.push({
        alert_id: `alert-${Date.now()}-commit`,
        alert_type: 'commit-needed',
        severity: 'warning',
        title: 'Commit Needed',
        description: `You haven't committed in ${minutesSinceCommit} minutes`,
        action_required: 'Create a commit to save your work',
        suggested_action: 'git add . && git commit -m "WIP: Save progress"',
        time_since_last_commit: `${minutesSinceCommit} minutes`,
        status: 'active',
        created_at: new Date().toISOString(),
        user_id: 'demo-user',
      });
    }

    // Check for wrong branch
    if (
      gitStatus.currentBranch === 'main' &&
      gitStatus.uncommittedFiles.length > 0
    ) {
      newAlerts.push({
        alert_id: `alert-${Date.now()}-branch`,
        alert_type: 'wrong-branch',
        severity: 'critical',
        title: 'Working on Main Branch',
        description: 'You are making changes directly on the main branch',
        action_required: 'Switch to a feature branch',
        suggested_action: 'git checkout -b feature/your-feature-name',
        current_branch: gitStatus.currentBranch,
        suggested_branch: 'feature/your-feature-name',
        status: 'active',
        created_at: new Date().toISOString(),
        user_id: 'demo-user',
      });
    }

    // Check for uncommitted changes
    if (gitStatus.uncommittedFiles.length > 0) {
      newAlerts.push({
        alert_id: `alert-${Date.now()}-uncommitted`,
        alert_type: 'uncommitted-changes',
        severity: 'info',
        title: 'Uncommitted Changes',
        description: `You have ${gitStatus.uncommittedFiles.length} uncommitted files`,
        action_required: 'Review and commit your changes',
        suggested_action:
          'git status && git add . && git commit -m "Your commit message"',
        uncommitted_files: gitStatus.uncommittedFiles,
        status: 'active',
        created_at: new Date().toISOString(),
        user_id: 'demo-user',
      });
    }

    // Add new alerts
    setGitAlerts(prev => [...prev, ...newAlerts]);

    // Save alerts to database
    for (const alert of newAlerts) {
      await db.createGitAlert(alert);
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

  const acknowledgeAlert = async (alertId: string) => {
    setGitAlerts(prev =>
      prev.map(alert =>
        alert.alert_id === alertId
          ? { ...alert, status: 'acknowledged' as const }
          : alert
      )
    );
    await db.updateGitAlert(alertId, { status: 'acknowledged' });
  };

  const resolveAlert = async (alertId: string) => {
    setGitAlerts(prev =>
      prev.map(alert =>
        alert.alert_id === alertId
          ? {
              ...alert,
              status: 'resolved' as const,
              resolved_at: new Date().toISOString(),
            }
          : alert
      )
    );
    await db.updateGitAlert(alertId, {
      status: 'resolved',
      resolved_at: new Date().toISOString(),
    });
  };

  const updateConfig = async (newConfig: Partial<OrchestratorConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    await db.updateOrchestratorConfig('demo-user', updatedConfig);
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'commit-needed':
        return <GitCommit className='w-5 h-5' />;
      case 'wrong-branch':
        return <GitBranch className='w-5 h-5' />;
      case 'merge-conflict-risk':
        return <GitMerge className='w-5 h-5' />;
      case 'uncommitted-changes':
        return <FileCode className='w-5 h-5' />;
      default:
        return <AlertCircle className='w-5 h-5' />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
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
                AI Orchestrator + Git Alerts
              </h1>
              <p className='text-gray-600'>
                Intelligent AI model selection and real-time Git workflow
                monitoring
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
            <div className='flex items-center space-x-2'>
              <div
                className={`w-3 h-3 rounded-full ${isGitMonitoring ? 'bg-green-500' : 'bg-gray-400'}`}
              />
              <span className='text-sm text-gray-600'>
                Git Monitoring {isGitMonitoring ? 'Active' : 'Inactive'}
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
            AI Orchestrator
          </button>
          <button
            onClick={() => setActiveTab('git-alerts')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'git-alerts'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bell className='w-4 h-4 inline mr-2' />
            Git Alerts
            {gitAlerts.filter(a => a.status === 'active').length > 0 && (
              <span className='ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full'>
                {gitAlerts.filter(a => a.status === 'active').length}
              </span>
            )}
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

        {/* Git Alerts Tab */}
        {activeTab === 'git-alerts' && (
          <div className='space-y-6'>
            {/* Current Git Status */}
            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>Current Git Status</h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                  <GitBranch className='w-5 h-5 text-blue-600' />
                  <div>
                    <div className='text-sm text-gray-600'>Current Branch</div>
                    <div className='font-medium'>{currentBranch}</div>
                  </div>
                </div>
                <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                  <GitCommit className='w-5 h-5 text-green-600' />
                  <div>
                    <div className='text-sm text-gray-600'>Last Commit</div>
                    <div className='font-medium'>
                      {lastCommit
                        ? new Date(lastCommit).toLocaleTimeString()
                        : 'Never'}
                    </div>
                  </div>
                </div>
                <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                  <FileCode className='w-5 h-5 text-orange-600' />
                  <div>
                    <div className='text-sm text-gray-600'>
                      Uncommitted Files
                    </div>
                    <div className='font-medium'>{uncommittedFiles.length}</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Active Alerts */}
            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>Active Git Alerts</h2>
              <div className='space-y-4'>
                {gitAlerts
                  .filter(alert => alert.status === 'active')
                  .map(alert => (
                    <div
                      key={alert.alert_id}
                      className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
                    >
                      <div className='flex items-start justify-between'>
                        <div className='flex items-start space-x-3'>
                          {getAlertIcon(alert.alert_type)}
                          <div className='flex-1'>
                            <h3 className='font-medium'>{alert.title}</h3>
                            <p className='text-sm mt-1'>{alert.description}</p>
                            <div className='mt-2'>
                              <div className='text-sm font-medium'>
                                Action Required:
                              </div>
                              <div className='text-sm'>
                                {alert.action_required}
                              </div>
                              <div className='text-sm font-mono bg-gray-100 p-2 rounded mt-1'>
                                {alert.suggested_action}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='flex space-x-2'>
                          <Button
                            onClick={() => acknowledgeAlert(alert.alert_id)}
                            size='sm'
                            variant='outline'
                          >
                            Acknowledge
                          </Button>
                          <Button
                            onClick={() => resolveAlert(alert.alert_id)}
                            size='sm'
                          >
                            Resolve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                {gitAlerts.filter(alert => alert.status === 'active').length ===
                  0 && (
                  <div className='text-center py-8 text-gray-500'>
                    <CheckCircle className='w-12 h-12 mx-auto mb-4 text-green-500' />
                    <p>No active Git alerts. Your workflow is clean!</p>
                  </div>
                )}
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

            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>
                Git Alerts Configuration
              </h2>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-medium'>Git Alerts Enabled</h3>
                    <p className='text-sm text-gray-600'>
                      Enable real-time Git workflow monitoring
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      updateConfig({
                        git_alerts_enabled: !config.git_alerts_enabled,
                      })
                    }
                    variant={config.git_alerts_enabled ? 'default' : 'outline'}
                  >
                    {config.git_alerts_enabled ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-medium'>Commit Reminder (minutes)</h3>
                    <p className='text-sm text-gray-600'>
                      Alert when no commit for this many minutes
                    </p>
                  </div>
                  <Input
                    type='number'
                    value={config.commit_reminder_minutes}
                    onChange={e =>
                      updateConfig({
                        commit_reminder_minutes: parseInt(e.target.value),
                      })
                    }
                    className='w-24'
                  />
                </div>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-medium'>Branch Check</h3>
                    <p className='text-sm text-gray-600'>
                      Alert when working on main branch
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      updateConfig({
                        branch_check_enabled: !config.branch_check_enabled,
                      })
                    }
                    variant={
                      config.branch_check_enabled ? 'default' : 'outline'
                    }
                  >
                    {config.branch_check_enabled ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
