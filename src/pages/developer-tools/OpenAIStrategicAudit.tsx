import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Brain,
  Lightbulb,
  TrendingUp,
  Users,
  Target,
  Zap,
  Star,
  Filter,
  Search,
  Plus,
  Edit,
  Save,
  X,
  Eye,
  Copy,
  ExternalLink,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Award,
  Trophy,
  Crown,
  DollarSign,
  Gift,
  Globe,
  Map,
  Navigation,
  Compass,
  Flag,
  Home,
  Settings,
  RefreshCw,
  Play,
  Pause,
  Stop,
  CheckCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Star as StarIcon,
  ThumbsUp,
  ThumbsDown,
  Heart,
  MessageCircle,
  Bell,
  Mail,
  Phone,
  Camera,
  Video,
  Music,
  Headphones,
  Speaker,
  Mic,
  Tv,
  Radio,
  Smartphone,
  Monitor,
  Laptop,
  Tablet,
  Watch,
  Headphones as HeadphonesIcon,
  Speaker as SpeakerIcon,
  Mic as MicIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  MessageCircle as MessageCircleIcon,
  Bell as BellIcon,
  Camera as CameraIcon,
  Video as VideoIcon,
  Music as MusicIcon,
  Tv as TvIcon,
  Radio as RadioIcon,
  Smartphone as SmartphoneIcon,
  Monitor as MonitorIcon,
  Laptop as LaptopIcon,
  Tablet as TabletIcon,
  Watch as WatchIcon,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabaseService as db } from '../../lib/supabase';
import { debugLogger } from '../../lib/debug-log';

interface OpenAIStrategicAuditProps {
  onBack?: () => void;
}

interface StrategicInsight {
  insight_id: string;
  category:
    | 'feature-suggestion'
    | 'ux-improvement'
    | 'workflow-optimization'
    | 'business-opportunity'
    | 'competitive-advantage'
    | 'user-engagement'
    | 'monetization'
    | 'technical-debt';
  title: string;
  description: string;
  impact_score: number; // 1-10
  effort_score: number; // 1-10
  priority: 'critical' | 'high' | 'medium' | 'low';
  ai_model_used: string;
  confidence_score: number; // 0-100
  implementation_suggestions: string[];
  business_value: string;
  user_benefit: string;
  technical_considerations: string[];
  estimated_development_time: string;
  estimated_cost: string;
  risk_assessment: string;
  success_metrics: string[];
  timestamp: string;
  status: 'pending' | 'approved' | 'implemented' | 'rejected';
  tags: string[];
}

interface AIOrchestratorConfig {
  models: {
    [key: string]: {
      name: string;
      provider: string;
      capabilities: string[];
      best_for: string[];
      cost_per_request: number;
      response_time: number;
    };
  };
  task_mapping: {
    [key: string]: string; // task_type -> model_id
  };
  auto_selection: boolean;
  fallback_model: string;
}

export const OpenAIStrategicAudit: React.FC<OpenAIStrategicAuditProps> = ({
  onBack,
}) => {
  const [insights, setInsights] = useState<StrategicInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [orchestratorConfig, setOrchestratorConfig] =
    useState<AIOrchestratorConfig>({
      models: {
        'gpt-4': {
          name: 'GPT-4',
          provider: 'OpenAI',
          capabilities: [
            'strategic-analysis',
            'feature-suggestions',
            'business-insights',
          ],
          best_for: [
            'complex-analysis',
            'creative-solutions',
            'business-strategy',
          ],
          cost_per_request: 0.03,
          response_time: 2000,
        },
        'claude-3': {
          name: 'Claude-3',
          provider: 'Anthropic',
          capabilities: [
            'detailed-analysis',
            'code-understanding',
            'documentation',
          ],
          best_for: ['technical-analysis', 'code-review', 'documentation'],
          cost_per_request: 0.015,
          response_time: 1500,
        },
        'gemini-pro': {
          name: 'Gemini Pro',
          provider: 'Google',
          capabilities: [
            'multimodal-analysis',
            'trend-analysis',
            'market-insights',
          ],
          best_for: [
            'market-analysis',
            'trend-prediction',
            'competitive-analysis',
          ],
          cost_per_request: 0.01,
          response_time: 1000,
        },
        perplexity: {
          name: 'Perplexity',
          provider: 'Perplexity AI',
          capabilities: ['real-time-research', 'fact-checking', 'market-data'],
          best_for: [
            'market-research',
            'competitive-intelligence',
            'fact-verification',
          ],
          cost_per_request: 0.005,
          response_time: 800,
        },
      },
      task_mapping: {
        'strategic-analysis': 'gpt-4',
        'feature-suggestions': 'claude-3',
        'business-insights': 'gemini-pro',
        'market-research': 'perplexity',
        'ux-improvements': 'claude-3',
        'workflow-optimization': 'gpt-4',
        'competitive-analysis': 'perplexity',
        'monetization-strategy': 'gemini-pro',
      },
      auto_selection: true,
      fallback_model: 'gpt-4',
    });
  const [activeTab, setActiveTab] = useState<
    'insights' | 'orchestrator' | 'analysis' | 'implementation'
  >('insights');

  useEffect(() => {
    loadInsights();
    loadOrchestratorConfig();
  }, []);

  const loadInsights = async () => {
    try {
      const { data } = await db.getAIAuditSuggestions('demo-user');
      if (data) {
        setInsights(
          data.map(item => ({
            insight_id: item.id,
            category: item.type as any,
            title: item.title || 'Strategic Insight',
            description: item.content,
            impact_score: Math.floor(Math.random() * 10) + 1,
            effort_score: Math.floor(Math.random() * 10) + 1,
            priority: item.priority || 'medium',
            ai_model_used: item.ai_model || 'gpt-4',
            confidence_score: Math.floor(Math.random() * 40) + 60,
            implementation_suggestions: [
              'Implement in phases',
              'Start with MVP',
              'Gather user feedback',
            ],
            business_value:
              'High potential for user engagement and revenue growth',
            user_benefit: 'Improved user experience and workflow efficiency',
            technical_considerations: [
              'Requires backend changes',
              'Frontend UI updates needed',
              'Database schema modifications',
            ],
            estimated_development_time: '2-4 weeks',
            estimated_cost: '$5,000 - $15,000',
            risk_assessment: 'Low risk, high reward',
            success_metrics: [
              'User engagement increase',
              'Feature adoption rate',
              'Revenue impact',
            ],
            timestamp: item.timestamp,
            status: item.status || 'pending',
            tags: item.tags || [],
          }))
        );
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  const loadOrchestratorConfig = async () => {
    try {
      const { data } = await db.getOrchestratorConfig('demo-user');
      if (data) {
        setOrchestratorConfig(data);
      }
    } catch (error) {
      console.error('Error loading orchestrator config:', error);
    }
  };

  const startStrategicAnalysis = async () => {
    setIsAnalyzing(true);

    try {
      await debugLogger.logInfo(
        'openai-strategic-audit',
        'Strategic Analysis Started',
        'Initiating AI-powered strategic analysis',
        ['AI Orchestrator', 'Strategic insights', 'Feature suggestions']
      );

      // Simulate AI analysis with different models
      const analysisTasks = [
        { type: 'strategic-analysis', model: 'gpt-4' },
        { type: 'feature-suggestions', model: 'claude-3' },
        { type: 'business-insights', model: 'gemini-pro' },
        { type: 'market-research', model: 'perplexity' },
      ];

      for (const task of analysisTasks) {
        await simulateAIAnalysis(task.type, task.model);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      await debugLogger.logInfo(
        'openai-strategic-audit',
        'Strategic Analysis Completed',
        'AI analysis completed successfully',
        ['Analysis completed', 'Insights generated', 'Recommendations ready']
      );
    } catch (error) {
      console.error('Strategic analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const simulateAIAnalysis = async (taskType: string, model: string) => {
    const newInsights: StrategicInsight[] = [
      {
        insight_id: `insight-${Date.now()}-${Math.random()}`,
        category: 'feature-suggestion',
        title: 'Smart Workflow Automation',
        description:
          'Implement AI-powered workflow automation that learns from user behavior and suggests optimizations in real-time.',
        impact_score: 9,
        effort_score: 7,
        priority: 'high',
        ai_model_used: model,
        confidence_score: 85,
        implementation_suggestions: [
          'Start with basic automation rules',
          'Add machine learning capabilities',
          'Integrate with existing workflows',
        ],
        business_value: 'Significant productivity gains and user satisfaction',
        user_benefit: 'Reduced manual work and improved efficiency',
        technical_considerations: [
          'ML model training required',
          'Real-time processing needed',
          'User behavior tracking',
        ],
        estimated_development_time: '6-8 weeks',
        estimated_cost: '$20,000 - $35,000',
        risk_assessment: 'Medium risk, very high reward',
        success_metrics: [
          'Workflow completion time',
          'User satisfaction scores',
          'Productivity metrics',
        ],
        timestamp: new Date().toISOString(),
        status: 'pending',
        tags: ['automation', 'ai', 'workflow', 'productivity'],
      },
      {
        insight_id: `insight-${Date.now()}-${Math.random()}`,
        category: 'ux-improvement',
        title: 'Personalized Dashboard Experience',
        description:
          'Create adaptive dashboards that personalize content and layout based on user role, preferences, and usage patterns.',
        impact_score: 8,
        effort_score: 6,
        priority: 'high',
        ai_model_used: model,
        confidence_score: 78,
        implementation_suggestions: [
          'User preference tracking',
          'Role-based layouts',
          'Usage pattern analysis',
        ],
        business_value: 'Increased user engagement and retention',
        user_benefit: 'More relevant and efficient user experience',
        technical_considerations: [
          'User preference storage',
          'Layout engine',
          'Analytics integration',
        ],
        estimated_development_time: '4-6 weeks',
        estimated_cost: '$15,000 - $25,000',
        risk_assessment: 'Low risk, high reward',
        success_metrics: [
          'User engagement time',
          'Feature adoption rate',
          'User satisfaction',
        ],
        timestamp: new Date().toISOString(),
        status: 'pending',
        tags: ['ux', 'personalization', 'dashboard', 'user-experience'],
      },
    ];

    setInsights(prev => [...prev, ...newInsights]);
  };

  const updateOrchestratorConfig = async (
    newConfig: Partial<AIOrchestratorConfig>
  ) => {
    const updatedConfig = { ...orchestratorConfig, ...newConfig };
    setOrchestratorConfig(updatedConfig);
    await db.updateOrchestratorConfig('demo-user', updatedConfig);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'feature-suggestion':
        return <Plus className='w-5 h-5' />;
      case 'ux-improvement':
        return <Users className='w-5 h-5' />;
      case 'workflow-optimization':
        return <Zap className='w-5 h-5' />;
      case 'business-opportunity':
        return <TrendingUp className='w-5 h-5' />;
      case 'competitive-advantage':
        return <Target className='w-5 h-5' />;
      case 'user-engagement':
        return <Heart className='w-5 h-5' />;
      case 'monetization':
        return <DollarSign className='w-5 h-5' />;
      case 'technical-debt':
        return <AlertTriangle className='w-5 h-5' />;
      default:
        return <Lightbulb className='w-5 h-5' />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredInsights = insights.filter(insight => {
    const matchesCategory =
      selectedCategory === 'all' || insight.category === selectedCategory;
    const matchesPriority =
      selectedPriority === 'all' || insight.priority === selectedPriority;
    const matchesSearch =
      insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insight.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesPriority && matchesSearch;
  });

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
                AI Strategic Audit
              </h1>
              <p className='text-gray-600'>
                AI-powered strategic insights and feature suggestions
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <div
                className={`w-3 h-3 rounded-full ${isAnalyzing ? 'bg-green-500' : 'bg-gray-400'}`}
              />
              <span className='text-sm text-gray-600'>
                AI {isAnalyzing ? 'Analyzing' : 'Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm'>
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'insights'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Lightbulb className='w-4 h-4 inline mr-2' />
            Strategic Insights
          </button>
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
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analysis'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className='w-4 h-4 inline mr-2' />
            Analysis
          </button>
          <button
            onClick={() => setActiveTab('implementation')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'implementation'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className='w-4 h-4 inline mr-2' />
            Implementation
          </button>
        </div>

        {/* Strategic Insights Tab */}
        {activeTab === 'insights' && (
          <div className='space-y-6'>
            {/* Analysis Button */}
            <Card className='p-6'>
              <div className='text-center space-y-4'>
                <div className='w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center'>
                  <Brain className='w-8 h-8 text-white' />
                </div>
                <h2 className='text-2xl font-bold'>AI Strategic Analysis</h2>
                <p className='text-gray-600 max-w-2xl mx-auto'>
                  Let AI analyze your app and provide strategic insights for
                  features, UX improvements, business opportunities, and more.
                </p>
                <Button
                  onClick={startStrategicAnalysis}
                  disabled={isAnalyzing}
                  size='lg'
                  className='bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className='w-5 h-5 mr-2 animate-spin' />
                      AI Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className='w-5 h-5 mr-2' />
                      Start Strategic Analysis
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Filters */}
            <Card className='p-6'>
              <div className='flex flex-wrap gap-4 items-center'>
                <div className='flex items-center space-x-2'>
                  <Filter className='w-4 h-4 text-gray-500' />
                  <span className='text-sm font-medium text-gray-700'>
                    Filters:
                  </span>
                </div>

                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className='px-3 py-2 border border-gray-300 rounded-md text-sm'
                >
                  <option value='all'>All Categories</option>
                  <option value='feature-suggestion'>
                    Feature Suggestions
                  </option>
                  <option value='ux-improvement'>UX Improvements</option>
                  <option value='workflow-optimization'>
                    Workflow Optimization
                  </option>
                  <option value='business-opportunity'>
                    Business Opportunities
                  </option>
                  <option value='competitive-advantage'>
                    Competitive Advantages
                  </option>
                  <option value='user-engagement'>User Engagement</option>
                  <option value='monetization'>Monetization</option>
                  <option value='technical-debt'>Technical Debt</option>
                </select>

                <select
                  value={selectedPriority}
                  onChange={e => setSelectedPriority(e.target.value)}
                  className='px-3 py-2 border border-gray-300 rounded-md text-sm'
                >
                  <option value='all'>All Priorities</option>
                  <option value='critical'>Critical</option>
                  <option value='high'>High</option>
                  <option value='medium'>Medium</option>
                  <option value='low'>Low</option>
                </select>

                <div className='flex items-center space-x-2'>
                  <Search className='w-4 h-4 text-gray-500' />
                  <Input
                    placeholder='Search insights...'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className='w-64'
                  />
                </div>
              </div>
            </Card>

            {/* Insights Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredInsights.map(insight => (
                <Card
                  key={insight.insight_id}
                  className='p-6 hover:shadow-lg transition-shadow'
                >
                  <div className='flex items-start justify-between mb-4'>
                    <div className='flex items-center space-x-2'>
                      {getCategoryIcon(insight.category)}
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(insight.priority)}`}
                      >
                        {insight.priority}
                      </span>
                    </div>
                    <div className='flex items-center space-x-1'>
                      <Star className='w-4 h-4 text-yellow-500' />
                      <span className='text-sm font-medium'>
                        {insight.impact_score}/10
                      </span>
                    </div>
                  </div>

                  <h3 className='font-semibold text-lg mb-2'>
                    {insight.title}
                  </h3>
                  <p className='text-gray-600 text-sm mb-4 line-clamp-3'>
                    {insight.description}
                  </p>

                  <div className='space-y-2 mb-4'>
                    <div className='flex justify-between text-xs'>
                      <span>Impact:</span>
                      <span className='font-medium'>
                        {insight.impact_score}/10
                      </span>
                    </div>
                    <div className='flex justify-between text-xs'>
                      <span>Effort:</span>
                      <span className='font-medium'>
                        {insight.effort_score}/10
                      </span>
                    </div>
                    <div className='flex justify-between text-xs'>
                      <span>Confidence:</span>
                      <span className='font-medium'>
                        {insight.confidence_score}%
                      </span>
                    </div>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      <Brain className='w-4 h-4 text-blue-500' />
                      <span className='text-xs text-gray-500'>
                        {insight.ai_model_used}
                      </span>
                    </div>
                    <div className='flex space-x-2'>
                      <Button size='sm' variant='outline'>
                        <Eye className='w-4 h-4' />
                      </Button>
                      <Button size='sm' variant='outline'>
                        <Edit className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* AI Orchestrator Tab */}
        {activeTab === 'orchestrator' && (
          <div className='space-y-6'>
            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>
                AI Model Configuration
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {Object.entries(orchestratorConfig.models).map(
                  ([modelId, model]) => (
                    <div key={modelId} className='p-4 border rounded-lg'>
                      <div className='flex items-center justify-between mb-3'>
                        <h3 className='font-semibold'>{model.name}</h3>
                        <span className='text-sm text-gray-500'>
                          {model.provider}
                        </span>
                      </div>
                      <div className='space-y-2 text-sm'>
                        <div>
                          <strong>Cost:</strong> ${model.cost_per_request}
                          /request
                        </div>
                        <div>
                          <strong>Response Time:</strong> {model.response_time}
                          ms
                        </div>
                        <div>
                          <strong>Best For:</strong> {model.best_for.join(', ')}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </Card>

            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>Task Mapping</h2>
              <div className='space-y-3'>
                {Object.entries(orchestratorConfig.task_mapping).map(
                  ([task, model]) => (
                    <div
                      key={task}
                      className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                    >
                      <span className='font-medium capitalize'>
                        {task.replace('-', ' ')}
                      </span>
                      <span className='text-blue-600'>
                        {orchestratorConfig.models[model].name}
                      </span>
                    </div>
                  )
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className='space-y-6'>
            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>
                Strategic Analysis Overview
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <div className='text-center p-4 bg-blue-50 rounded-lg'>
                  <div className='text-2xl font-bold text-blue-600'>
                    {insights.length}
                  </div>
                  <div className='text-sm text-gray-600'>Total Insights</div>
                </div>
                <div className='text-center p-4 bg-green-50 rounded-lg'>
                  <div className='text-2xl font-bold text-green-600'>
                    {
                      insights.filter(
                        i => i.priority === 'high' || i.priority === 'critical'
                      ).length
                    }
                  </div>
                  <div className='text-sm text-gray-600'>High Priority</div>
                </div>
                <div className='text-center p-4 bg-purple-50 rounded-lg'>
                  <div className='text-2xl font-bold text-purple-600'>
                    {Math.round(
                      insights.reduce((sum, i) => sum + i.impact_score, 0) /
                        insights.length
                    )}
                  </div>
                  <div className='text-sm text-gray-600'>Avg Impact Score</div>
                </div>
                <div className='text-center p-4 bg-orange-50 rounded-lg'>
                  <div className='text-2xl font-bold text-orange-600'>
                    {Math.round(
                      insights.reduce((sum, i) => sum + i.confidence_score, 0) /
                        insights.length
                    )}
                    %
                  </div>
                  <div className='text-sm text-gray-600'>Avg Confidence</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Implementation Tab */}
        {activeTab === 'implementation' && (
          <div className='space-y-6'>
            <Card className='p-6'>
              <h2 className='text-xl font-semibold mb-4'>
                Implementation Roadmap
              </h2>
              <div className='space-y-4'>
                {insights
                  .filter(
                    i => i.priority === 'high' || i.priority === 'critical'
                  )
                  .slice(0, 5)
                  .map(insight => (
                    <div
                      key={insight.insight_id}
                      className='p-4 border rounded-lg'
                    >
                      <div className='flex items-center justify-between mb-2'>
                        <h3 className='font-semibold'>{insight.title}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(insight.priority)}`}
                        >
                          {insight.priority}
                        </span>
                      </div>
                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                        <div>
                          <strong>Time:</strong>{' '}
                          {insight.estimated_development_time}
                        </div>
                        <div>
                          <strong>Cost:</strong> {insight.estimated_cost}
                        </div>
                        <div>
                          <strong>Risk:</strong> {insight.risk_assessment}
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
