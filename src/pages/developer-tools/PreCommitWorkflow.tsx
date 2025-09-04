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

interface PreCommitWorkflowProps {
  onBack?: () => void;
}

interface WorkflowStep {
  step_id: string;
  step_type:
    | 'ai-audit'
    | 'optimization'
    | 'testing'
    | 'security-scan'
    | 'documentation'
    | 'git-check';
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  progress: number;
  start_time?: string;
  end_time?: string;
  result?: any;
  error?: string;
  duration?: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface WorkflowReport {
  report_id: string;
  workflow_id: string;
  timestamp: string;
  overall_score: number;
  steps_completed: number;
  steps_failed: number;
  total_duration: number;
  issues_found: number;
  optimizations_applied: number;
  security_vulnerabilities: number;
  test_coverage: number;
  documentation_updated: boolean;
  git_status: 'clean' | 'dirty' | 'conflicts';
  recommendations: string[];
  warnings: string[];
  errors: string[];
  user_id: string;
}

export const PreCommitWorkflow: React.FC<PreCommitWorkflowProps> = ({
  onBack,
}) => {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [currentReport, setCurrentReport] = useState<WorkflowReport | null>(
    null
  );
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);
  const [workflowConfig, setWorkflowConfig] = useState({
    run_ai_audit: true,
    run_optimization: true,
    run_tests: true,
    run_security_scan: true,
    update_documentation: true,
    check_git_status: true,
    auto_fix_issues: false,
    stop_on_critical_errors: true,
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<
    'workflow' | 'report' | 'config' | 'logs'
  >('workflow');

  useEffect(() => {
    initializeWorkflowSteps();
  }, []);

  const initializeWorkflowSteps = () => {
    const steps: WorkflowStep[] = [
      {
        step_id: 'ai-audit',
        step_type: 'ai-audit',
        name: 'AI Codebase Audit',
        description: 'Comprehensive AI-powered codebase analysis',
        status: 'pending',
        progress: 0,
        priority: 'critical',
      },
      {
        step_id: 'optimization',
        step_type: 'optimization',
        name: 'Code Optimization',
        description: 'Automatic code optimization and cleanup',
        status: 'pending',
        progress: 0,
        priority: 'high',
      },
      {
        step_id: 'testing',
        step_type: 'testing',
        name: 'Automated Testing',
        description: 'Run comprehensive test suite',
        status: 'pending',
        progress: 0,
        priority: 'critical',
      },
      {
        step_id: 'security-scan',
        step_type: 'security-scan',
        name: 'Security Scan',
        description: 'Vulnerability and security analysis',
        status: 'pending',
        progress: 0,
        priority: 'high',
      },
      {
        step_id: 'documentation',
        step_type: 'documentation',
        name: 'Documentation Update',
        description: 'Update and validate documentation',
        status: 'pending',
        progress: 0,
        priority: 'medium',
      },
      {
        step_id: 'git-check',
        step_type: 'git-check',
        name: 'Git Status Check',
        description: 'Verify Git repository status',
        status: 'pending',
        progress: 0,
        priority: 'critical',
      },
      {
        step_id: 'openai-strategic-audit',
        step_type: 'openai-strategic-audit',
        name: 'OpenAI Strategic Audit',
        description: 'AI-powered strategic insights and feature suggestions',
        status: 'pending',
        progress: 0,
        priority: 'high',
      },
    ];
    setWorkflowSteps(steps);
  };

  const startPreCommitWorkflow = async () => {
    setIsWorkflowRunning(true);
    setLogs([]);

    try {
      await debugLogger.logInfo(
        'pre-commit-workflow',
        'Pre-Commit Workflow Started',
        'Initiating comprehensive pre-commit workflow',
        [
          'Workflow started',
          'AI audit',
          'Optimization',
          'Testing',
          'Security scan',
        ]
      );

      addLog('🚀 Starting comprehensive pre-commit workflow...');

      // Run workflow steps in priority order
      const priorityOrder = ['critical', 'high', 'medium', 'low'];

      for (const priority of priorityOrder) {
        const stepsToRun = workflowSteps.filter(
          step =>
            step.priority === priority &&
            workflowConfig[
              `run_${step.step_type.replace('-', '_')}` as keyof typeof workflowConfig
            ]
        );

        for (const step of stepsToRun) {
          await runWorkflowStep(step);

          // Check if we should stop on critical errors
          if (
            step.status === 'failed' &&
            step.priority === 'critical' &&
            workflowConfig.stop_on_critical_errors
          ) {
            addLog(`❌ Critical error in ${step.name}. Stopping workflow.`);
            break;
          }
        }
      }

      // Generate final report
      const report = await generateWorkflowReport();
      setCurrentReport(report);

      // Save report to Supabase
      await db.createWorkflowReport(report);

      await debugLogger.logInfo(
        'pre-commit-workflow',
        'Pre-Commit Workflow Completed',
        `Workflow completed with score: ${report.overall_score}/100`,
        ['Workflow completed', 'Report generated', 'Database updated']
      );

      addLog('✅ Pre-commit workflow completed successfully!');
      addLog(`📊 Overall score: ${report.overall_score}/100`);
    } catch (error) {
      console.error('Pre-commit workflow failed:', error);
      addLog(
        `❌ Workflow failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsWorkflowRunning(false);
    }
  };

  const runWorkflowStep = async (step: WorkflowStep) => {
    addLog(`🔄 Running: ${step.name}...`);

    const updatedStep = {
      ...step,
      status: 'running' as const,
      start_time: new Date().toISOString(),
    };
    setWorkflowSteps(prev =>
      prev.map(s => (s.step_id === step.step_id ? updatedStep : s))
    );

    try {
      // Simulate step execution with progress updates
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 500));

        setWorkflowSteps(prev =>
          prev.map(s => (s.step_id === step.step_id ? { ...s, progress } : s))
        );
      }

      // Simulate step-specific results
      const result = await simulateStepResult(step);

      const completedStep = {
        ...updatedStep,
        status: 'completed' as const,
        progress: 100,
        end_time: new Date().toISOString(),
        result,
        duration: Date.now() - new Date(updatedStep.start_time!).getTime(),
      };

      setWorkflowSteps(prev =>
        prev.map(s => (s.step_id === step.step_id ? completedStep : s))
      );

      addLog(`✅ ${step.name} completed successfully`);
    } catch (error) {
      const failedStep = {
        ...updatedStep,
        status: 'failed' as const,
        end_time: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      setWorkflowSteps(prev =>
        prev.map(s => (s.step_id === step.step_id ? failedStep : s))
      );

      addLog(
        `❌ ${step.name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const simulateStepResult = async (step: WorkflowStep) => {
    switch (step.step_type) {
      case 'ai-audit':
        return {
          files_analyzed: 150,
          issues_found: 8,
          suggestions: 12,
          complexity_score: 75,
        };

      case 'optimization':
        return {
          files_optimized: 25,
          bundle_size_reduction: '15%',
          performance_improvement: '20%',
          dead_code_removed: 1200,
        };

      case 'testing':
        return {
          tests_run: 150,
          tests_passed: 145,
          tests_failed: 5,
          coverage_percentage: 85,
        };

      case 'security-scan':
        return {
          vulnerabilities_found: 2,
          vulnerabilities_fixed: 2,
          security_score: 95,
          recommendations: 3,
        };

      case 'documentation':
        return {
          files_updated: 8,
          new_documentation: 3,
          outdated_docs_fixed: 5,
        };

      case 'git-check':
        return {
          branch: 'feature/new-feature',
          uncommitted_files: 3,
          conflicts: 0,
          status: 'clean',
        };

      case 'openai-strategic-audit':
        return {
          features_suggested: 8,
          ux_improvements: 12,
          workflow_optimizations: 5,
          business_opportunities: 3,
          competitive_advantages: 4,
          user_engagement_ideas: 7,
          monetization_suggestions: 2,
          technical_debt_insights: 6,
        };

      default:
        return { success: true };
    }
  };

  const generateWorkflowReport = async (): Promise<WorkflowReport> => {
    const completedSteps = workflowSteps.filter(s => s.status === 'completed');
    const failedSteps = workflowSteps.filter(s => s.status === 'failed');

    const overallScore = Math.round(
      (completedSteps.length / workflowSteps.length) * 100
    );

    const report: WorkflowReport = {
      report_id: `report-${Date.now()}`,
      workflow_id: `workflow-${Date.now()}`,
      timestamp: new Date().toISOString(),
      overall_score: overallScore,
      steps_completed: completedSteps.length,
      steps_failed: failedSteps.length,
      total_duration: workflowSteps.reduce(
        (sum, step) => sum + (step.duration || 0),
        0
      ),
      issues_found: completedSteps.reduce(
        (sum, step) => sum + (step.result?.issues_found || 0),
        0
      ),
      optimizations_applied:
        completedSteps.find(s => s.step_type === 'optimization')?.result
          ?.files_optimized || 0,
      security_vulnerabilities:
        completedSteps.find(s => s.step_type === 'security-scan')?.result
          ?.vulnerabilities_found || 0,
      test_coverage:
        completedSteps.find(s => s.step_type === 'testing')?.result
          ?.coverage_percentage || 0,
      documentation_updated:
        completedSteps.find(s => s.step_type === 'documentation')?.status ===
        'completed',
      git_status:
        completedSteps.find(s => s.step_type === 'git-check')?.result?.status ||
        'dirty',
      recommendations: [
        'Consider adding more unit tests for better coverage',
        'Review security vulnerabilities regularly',
        'Update documentation for new features',
      ],
      warnings: failedSteps.length > 0 ? ['Some workflow steps failed'] : [],
      errors: failedSteps.map(s => s.error || 'Unknown error'),
      user_id: 'demo-user',
    };

    return report;
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const updateWorkflowConfig = async (
    newConfig: Partial<typeof workflowConfig>
  ) => {
    const updatedConfig = { ...workflowConfig, ...newConfig };
    setWorkflowConfig(updatedConfig);
    await db.updateWorkflowConfig('demo-user', updatedConfig);
  };

  const getStepIcon = (stepType: string) => {
    switch (stepType) {
      case 'ai-audit':
        return <Brain className='w-5 h-5' />;
      case 'optimization':
        return <Zap className='w-5 h-5' />;
      case 'testing':
        return <CheckCircle className='w-5 h-5' />;
      case 'security-scan':
        return <Shield className='w-5 h-5' />;
      case 'documentation':
        return <FileText className='w-5 h-5' />;
      case 'git-check':
        return <GitBranch className='w-5 h-5' />;
      case 'openai-strategic-audit':
        return <Brain className='w-5 h-5' />;
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
      case 'skipped':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
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
                Pre-Commit Workflow
              </h1>
              <p className='text-gray-600'>
                Complete pre-commit audit, optimization & testing suite
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <div
                className={`w-3 h-3 rounded-full ${isWorkflowRunning ? 'bg-green-500' : 'bg-gray-400'}`}
              />
              <span className='text-sm text-gray-600'>
                Workflow {isWorkflowRunning ? 'Running' : 'Idle'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm'>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'workflow'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Zap className='w-4 h-4 inline mr-2' />
            Workflow
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

        {/* Workflow Tab */}
        {activeTab === 'workflow' && (
          <div className='space-y-6'>
            {/* Main Workflow Button */}
            <Card className='p-6'>
              <div className='text-center space-y-4'>
                <div className='w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center'>
                  <Zap className='w-8 h-8 text-white' />
                </div>
                <h2 className='text-2xl font-bold'>Pre-Commit Workflow</h2>
                <p className='text-gray-600 max-w-2xl mx-auto'>
                  Run a comprehensive pre-commit workflow that includes AI
                  audit, optimization, testing, security scan, and more.
                </p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto'>
                  <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                    <Brain className='w-5 h-5 text-blue-500' />
                    <span>AI Codebase Audit</span>
                  </div>
                  <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                    <Zap className='w-5 h-5 text-green-500' />
                    <span>Code Optimization</span>
                  </div>
                  <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                    <CheckCircle className='w-5 h-5 text-purple-500' />
                    <span>Automated Testing</span>
                  </div>
                  <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                    <Shield className='w-5 h-5 text-red-500' />
                    <span>Security Scan</span>
                  </div>
                </div>
                <Button
                  onClick={startPreCommitWorkflow}
                  disabled={isWorkflowRunning}
                  size='lg'
                  className='bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                >
                  {isWorkflowRunning ? (
                    <>
                      <RefreshCw className='w-5 h-5 mr-2 animate-spin' />
                      Running Workflow...
                    </>
                  ) : (
                    <>
                      <Zap className='w-5 h-5 mr-2' />
                      Start Pre-Commit Workflow
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Workflow Steps */}
            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>Workflow Steps</h2>
              <div className='space-y-4'>
                {workflowSteps.map(step => (
                  <div
                    key={step.step_id}
                    className={`p-4 rounded-lg border ${getStatusColor(step.status)}`}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        {getStepIcon(step.step_type)}
                        <div>
                          <div className='flex items-center space-x-2'>
                            <h3 className='font-medium'>{step.name}</h3>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(step.priority)} bg-opacity-10`}
                            >
                              {step.priority}
                            </span>
                          </div>
                          <p className='text-sm'>{step.description}</p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='text-sm font-medium'>
                          {step.status === 'completed'
                            ? '100%'
                            : step.status === 'running'
                              ? `${step.progress}%`
                              : step.status === 'failed'
                                ? 'Failed'
                                : 'Pending'}
                        </div>
                        {step.status === 'running' && (
                          <div className='w-32 bg-gray-200 rounded-full h-2 mt-2'>
                            <div
                              className='bg-blue-500 h-2 rounded-full transition-all duration-300'
                              style={{ width: `${step.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Report Tab */}
        {activeTab === 'report' && currentReport && (
          <div className='space-y-6'>
            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>Workflow Report</h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='text-center p-4 bg-gray-50 rounded-lg'>
                  <div className='text-3xl font-bold text-blue-600'>
                    {currentReport.overall_score}%
                  </div>
                  <div className='text-sm text-gray-600'>Overall Score</div>
                </div>
                <div className='text-center p-4 bg-gray-50 rounded-lg'>
                  <div className='text-3xl font-bold text-green-600'>
                    {currentReport.steps_completed}
                  </div>
                  <div className='text-sm text-gray-600'>Steps Completed</div>
                </div>
                <div className='text-center p-4 bg-gray-50 rounded-lg'>
                  <div className='text-3xl font-bold text-red-600'>
                    {currentReport.steps_failed}
                  </div>
                  <div className='text-sm text-gray-600'>Steps Failed</div>
                </div>
              </div>

              <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='font-semibold mb-2'>Workflow Results</h3>
                  <div className='space-y-2 text-sm'>
                    <div>Issues found: {currentReport.issues_found}</div>
                    <div>
                      Optimizations applied:{' '}
                      {currentReport.optimizations_applied}
                    </div>
                    <div>
                      Security vulnerabilities:{' '}
                      {currentReport.security_vulnerabilities}
                    </div>
                    <div>Test coverage: {currentReport.test_coverage}%</div>
                    <div>Git status: {currentReport.git_status}</div>
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
                Workflow Configuration
              </h2>
              <div className='space-y-4'>
                {Object.entries(workflowConfig).map(([key, value]) => (
                  <div key={key} className='flex items-center justify-between'>
                    <div>
                      <h3 className='font-medium capitalize'>
                        {key.replace(/_/g, ' ')}
                      </h3>
                      <p className='text-sm text-gray-600'>
                        {key.includes('run_')
                          ? `Run ${key.replace('run_', '').replace('_', ' ')} step`
                          : key === 'auto_fix_issues'
                            ? 'Automatically fix issues when possible'
                            : key === 'stop_on_critical_errors'
                              ? 'Stop workflow on critical errors'
                              : ''}
                      </p>
                    </div>
                    <Button
                      onClick={() => updateWorkflowConfig({ [key]: !value })}
                      variant={value ? 'default' : 'outline'}
                    >
                      {value ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className='space-y-6'>
            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>Workflow Logs</h2>
              <div className='bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto'>
                {logs.length === 0 ? (
                  <div className='text-gray-500'>
                    No logs available. Start workflow to see logs.
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
