import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Brain,
  Lightbulb,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Code,
  TestTube,
  Eye,
  Globe,
  Smartphone,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  Filter,
  Search,
  Plus,
  RefreshCw,
  Download,
  Target,
  BarChart3,
  X,
  GitBranch,
  GitCommit,
  GitPullRequest,
  GitMerge,
  Monitor,
  Terminal,
  Settings,
  UserCheck,
  MessageSquare,
  FileCode,
  Layers,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabaseService as db } from '../../lib/supabase';
import { debugLogger } from '../../lib/debug-log';

interface AICodebaseAuditProps {
  onBack?: () => void;
}

interface AIAuditSuggestion {
  suggestion_id: string;
  category:
    | 'performance'
    | 'security'
    | 'architecture'
    | 'user-experience'
    | 'code-quality'
    | 'testing'
    | 'monitoring'
    | 'deployment'
    | 'accessibility'
    | 'seo'
    | 'pwa'
    | 'ai-integration'
    | 'multi-ide-collaboration'
    | 'git-workflow';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  reasoning: string;
  solution: string;
  impact: 'major' | 'moderate' | 'minor';
  effort: 'high' | 'medium' | 'low';
  estimated_time: string;
  tags: string[];
  ai_confidence: number;
  status: 'pending' | 'in-progress' | 'implemented' | 'rejected' | 'archived';
  implementation_notes?: string;
  implemented_at?: string;
  created_at: string;
  ide_specific?: 'bolt-ai' | 'cursor-ai' | 'both' | 'general';
  git_integration?: boolean;
  team_collaboration?: boolean;
}

interface AIAnalysis {
  analysis_id: string;
  analysis_type:
    | 'full-audit'
    | 'performance-review'
    | 'security-audit'
    | 'architecture-review'
    | 'pwa-optimization'
    | 'multi-ide-audit';
  summary: string;
  overall_score: number;
  metrics: Record<string, number>;
  findings: any[];
  recommendations: any[];
  created_at: string;
}

interface GitWorkflowStatus {
  branch: string;
  last_commit: string;
  pending_pulls: number;
  merge_conflicts: number;
  team_members: string[];
  ide_usage: {
    bolt_ai: number;
    cursor_ai: number;
  };
}

export const AICodebaseAudit: React.FC<AICodebaseAuditProps> = ({ onBack }) => {
  const [suggestions, setSuggestions] = useState<AIAuditSuggestion[]>([]);
  const [analyses, setAnalyses] = useState<AIAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterIDE, setFilterIDE] = useState('all');
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<AIAuditSuggestion | null>(null);
  const [implementationNotes, setImplementationNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [gitStatus, setGitStatus] = useState<GitWorkflowStatus>({
    branch: 'main',
    last_commit: 'abc123...',
    pending_pulls: 3,
    merge_conflicts: 1,
    team_members: ['You', 'Dev1', 'Dev2', 'Dev3'],
    ide_usage: {
      bolt_ai: 2,
      cursor_ai: 2,
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load AI audit suggestions
      const { data: suggestionsData } =
        await db.getAIAuditSuggestions('demo-user');
      if (suggestionsData) {
        setSuggestions(suggestionsData);
      }

      // Load AI analyses
      const { data: analysesData } =
        await db.getAICodebaseAnalyses('demo-user');
      if (analysesData) {
        setAnalyses(analysesData);
      }

      // If no suggestions exist, create demo suggestions
      if (!suggestionsData || suggestionsData.length === 0) {
        await createDemoSuggestions();
      }
    } catch (error) {
      console.error('Error loading AI audit data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createDemoSuggestions = async () => {
    const demoSuggestions: AIAuditSuggestion[] = [
      {
        suggestion_id: 'suggestion-1',
        category: 'multi-ide-collaboration',
        priority: 'critical',
        title: 'Implement Multi-IDE Git Workflow',
        description:
          'Set up seamless collaboration between Bolt.ai and Cursor.ai developers',
        reasoning:
          "Your team uses both Bolt.ai and Cursor.ai, but there's no standardized workflow for collaboration. This leads to merge conflicts and inconsistent development practices.",
        solution:
          'Create standardized Git workflow with branch naming conventions, commit message templates, and IDE-specific configurations. Implement pre-commit hooks that work across both IDEs.',
        impact: 'major',
        effort: 'high',
        estimated_time: '8-12 hours',
        tags: ['git', 'workflow', 'collaboration', 'bolt-ai', 'cursor-ai'],
        ai_confidence: 98,
        status: 'pending',
        user_id: 'demo-user',
        created_at: new Date().toISOString(),
        ide_specific: 'both',
        git_integration: true,
        team_collaboration: true,
      },
      {
        suggestion_id: 'suggestion-2',
        category: 'git-workflow',
        priority: 'high',
        title: 'Automated Code Review Pipeline',
        description: 'Set up AI-powered code review that works with both IDEs',
        reasoning:
          'Manual code reviews are time-consuming and inconsistent across different IDEs. An automated pipeline would ensure quality standards regardless of which IDE is used.',
        solution:
          'Integrate GitHub Actions with AI code review tools. Create IDE-specific extensions for Bolt.ai and Cursor.ai that provide real-time feedback and automated quality checks.',
        impact: 'major',
        effort: 'medium',
        estimated_time: '6-8 hours',
        tags: ['code-review', 'automation', 'github-actions', 'ai'],
        ai_confidence: 95,
        status: 'pending',
        user_id: 'demo-user',
        created_at: new Date().toISOString(),
        ide_specific: 'both',
        git_integration: true,
        team_collaboration: true,
      },
      {
        suggestion_id: 'suggestion-3',
        category: 'performance',
        priority: 'high',
        title: 'IDE-Specific Performance Optimizations',
        description:
          'Optimize development experience for both Bolt.ai and Cursor.ai',
        reasoning:
          'Different IDEs have different performance characteristics. Bolt.ai excels at AI-assisted coding while Cursor.ai is better for complex refactoring. We should leverage both strengths.',
        solution:
          'Create IDE-specific configurations and extensions. Use Bolt.ai for AI-powered feature development and Cursor.ai for complex architectural changes. Implement shared performance monitoring.',
        impact: 'moderate',
        effort: 'medium',
        estimated_time: '4-6 hours',
        tags: ['performance', 'ide-optimization', 'bolt-ai', 'cursor-ai'],
        ai_confidence: 92,
        status: 'pending',
        user_id: 'demo-user',
        created_at: new Date().toISOString(),
        ide_specific: 'both',
        git_integration: false,
        team_collaboration: true,
      },
      {
        suggestion_id: 'suggestion-4',
        category: 'security',
        priority: 'critical',
        title: 'Multi-IDE Security Scanning',
        description:
          'Implement security scanning that works across both development environments',
        reasoning:
          'Security vulnerabilities can be introduced regardless of which IDE is used. We need consistent security scanning that works with both Bolt.ai and Cursor.ai workflows.',
        solution:
          'Integrate security scanning into Git hooks and CI/CD pipeline. Create IDE extensions that provide real-time security feedback. Implement shared security policies.',
        impact: 'major',
        effort: 'high',
        estimated_time: '8-10 hours',
        tags: ['security', 'scanning', 'bolt-ai', 'cursor-ai', 'git-hooks'],
        ai_confidence: 96,
        status: 'pending',
        user_id: 'demo-user',
        created_at: new Date().toISOString(),
        ide_specific: 'both',
        git_integration: true,
        team_collaboration: true,
      },
      {
        suggestion_id: 'suggestion-5',
        category: 'ai-integration',
        priority: 'high',
        title: 'Cross-IDE AI Assistant Integration',
        description:
          'Create unified AI assistant that works seamlessly across both IDEs',
        reasoning:
          'Both Bolt.ai and Cursor.ai have powerful AI capabilities, but they work independently. A unified AI assistant would provide consistent help across the entire development team.',
        solution:
          'Develop a shared AI assistant API that both IDEs can integrate with. Create IDE-specific extensions that provide consistent AI-powered suggestions and code generation.',
        impact: 'major',
        effort: 'high',
        estimated_time: '10-14 hours',
        tags: ['ai', 'assistant', 'integration', 'bolt-ai', 'cursor-ai'],
        ai_confidence: 94,
        status: 'pending',
        user_id: 'demo-user',
        created_at: new Date().toISOString(),
        ide_specific: 'both',
        git_integration: false,
        team_collaboration: true,
      },
    ];

    for (const suggestion of demoSuggestions) {
      await db.createAIAuditSuggestion(suggestion);
    }

    setSuggestions(demoSuggestions);
  };

  const runAICodebaseAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      await debugLogger.logInfo(
        'testing',
        'Multi-IDE AI Codebase Analysis Started',
        'Initiating comprehensive AI-powered codebase analysis for Bolt.ai and Cursor.ai collaboration',
        [
          'Analysis started',
          'AI processing codebase',
          'Generating multi-IDE insights',
        ]
      );

      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Analyze Developer Instructions and generate page splitting suggestions
      await analyzeDeveloperInstructions();

      const analysis: AIAnalysis = {
        analysis_id: `analysis-${Date.now()}`,
        analysis_type: 'multi-ide-audit',
        summary:
          'Comprehensive AI analysis of MyMindVentures.io PWA ecosystem optimized for Bolt.ai and Cursor.ai collaboration',
        overall_score: 89,
        metrics: {
          performance: 87,
          security: 94,
          accessibility: 82,
          seo: 85,
          pwa: 91,
          code_quality: 93,
          collaboration: 78,
          git_workflow: 85,
        },
        findings: [
          'Excellent foundation with modern tech stack',
          'Strong testing infrastructure',
          'Good security practices',
          'Areas for multi-IDE collaboration improvement',
          'Git workflow can be optimized for team collaboration',
          'AI integration opportunities across both IDEs',
          'Developer Instructions can be better organized into themed pages',
        ],
        recommendations: [
          'Implement Multi-IDE Git Workflow',
          'Set up Automated Code Review Pipeline',
          'Create IDE-Specific Performance Optimizations',
          'Implement Multi-IDE Security Scanning',
          'Develop Cross-IDE AI Assistant Integration',
          'Split Developer Instructions into themed pages for better navigation',
        ],
        created_at: new Date().toISOString(),
      };

      await db.createAICodebaseAnalysis(analysis);
      setAnalyses(prev => [analysis, ...prev]);

      await debugLogger.logInfo(
        'testing',
        'Multi-IDE AI Codebase Analysis Completed',
        'AI analysis completed successfully with actionable insights for team collaboration',
        [
          'Analysis completed',
          'Multi-IDE insights generated',
          'Collaboration recommendations ready',
          'Developer Instructions analyzed',
        ]
      );
    } catch (error) {
      console.error('Error running AI analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeDeveloperInstructions = async () => {
    try {
      // Load all developer instructions from feedback table
      const { data: instructions, error } = await db.supabase
        .from('feedback')
        .select('*')
        .in('type', [
          'developer-instruction',
          'developer-guide',
          'developer-documentation',
        ])
        .order('created_at', { ascending: false });

      if (error || !instructions) {
        console.error(
          'Error loading developer instructions for analysis:',
          error
        );
        return;
      }

      // AI analysis: Group instructions by theme and suggest page splits
      const themeGroups = groupInstructionsByTheme(instructions);

      // Generate suggestions for page splitting
      const pageSplittingSuggestions =
        generatePageSplittingSuggestions(themeGroups);

      // Add new suggestions to the database
      for (const suggestion of pageSplittingSuggestions) {
        await db.createAIAuditSuggestion(suggestion);
      }

      // Update suggestions state
      setSuggestions(prev => [...pageSplittingSuggestions, ...prev]);
    } catch (error) {
      console.error('Error analyzing developer instructions:', error);
    }
  };

  const groupInstructionsByTheme = (instructions: any[]) => {
    const themes: Record<string, any[]> = {
      'Getting Started': [],
      'Testing & Quality': [],
      'Deployment & DevOps': [],
      'Configuration & Setup': [],
      'IDE & Development Tools': [],
      'Git & Collaboration': [],
      'Performance & Monitoring': [],
      'Security & Best Practices': [],
    };

    instructions.forEach(instruction => {
      const content = instruction.content;
      const category =
        content.match(/\*\*Category:\*\* (.+)/)?.[1] || 'General';
      const title = content.match(/^# (.+)/)?.[1] || 'Untitled';

      // AI logic to categorize instructions
      if (
        category.toLowerCase().includes('getting started') ||
        title.toLowerCase().includes('installation') ||
        title.toLowerCase().includes('setup')
      ) {
        themes['Getting Started'].push(instruction);
      } else if (
        category.toLowerCase().includes('testing') ||
        title.toLowerCase().includes('test') ||
        title.toLowerCase().includes('quality')
      ) {
        themes['Testing & Quality'].push(instruction);
      } else if (
        category.toLowerCase().includes('deployment') ||
        title.toLowerCase().includes('docker') ||
        title.toLowerCase().includes('build')
      ) {
        themes['Deployment & DevOps'].push(instruction);
      } else if (
        category.toLowerCase().includes('configuration') ||
        title.toLowerCase().includes('config')
      ) {
        themes['Configuration & Setup'].push(instruction);
      } else if (
        category.toLowerCase().includes('ide') ||
        title.toLowerCase().includes('bolt') ||
        title.toLowerCase().includes('cursor')
      ) {
        themes['IDE & Development Tools'].push(instruction);
      } else if (
        category.toLowerCase().includes('git') ||
        title.toLowerCase().includes('workflow')
      ) {
        themes['Git & Collaboration'].push(instruction);
      } else if (
        category.toLowerCase().includes('performance') ||
        title.toLowerCase().includes('monitoring')
      ) {
        themes['Performance & Monitoring'].push(instruction);
      } else if (category.toLowerCase().includes('security')) {
        themes['Security & Best Practices'].push(instruction);
      } else {
        themes['Getting Started'].push(instruction); // Default
      }
    });

    return themes;
  };

  const generatePageSplittingSuggestions = (
    themeGroups: Record<string, any[]>
  ) => {
    const suggestions: AIAuditSuggestion[] = [];

    Object.entries(themeGroups).forEach(([theme, instructions]) => {
      if (instructions.length >= 3) {
        // Only suggest splitting if there are enough related instructions
        suggestions.push({
          suggestion_id: `page-split-${theme.toLowerCase().replace(/\s+/g, '-')}`,
          category: 'user-experience',
          priority: 'medium',
          title: `Create Dedicated "${theme}" Developer Instructions Page`,
          description: `Split ${instructions.length} related instructions into a dedicated themed page for better organization and navigation`,
          reasoning: `Currently, all developer instructions are displayed in a single page, making it difficult to find specific information. The AI analysis found ${instructions.length} instructions related to "${theme}" that would benefit from being grouped together in a dedicated page.`,
          solution: `Create a new page component for "${theme}" instructions with filtered navigation, search functionality, and related instruction suggestions. This will improve developer experience and make it easier to find relevant documentation.`,
          impact: 'moderate',
          effort: 'low',
          estimated_time: '2-4 hours',
          tags: [
            'developer-instructions',
            'page-splitting',
            'navigation',
            'ux',
            theme.toLowerCase(),
          ],
          ai_confidence: 95,
          status: 'pending',
          user_id: 'demo-user',
          created_at: new Date().toISOString(),
          ide_specific: 'general',
          git_integration: false,
          team_collaboration: true,
        });
      }
    });

    // Add a general suggestion for the overall page structure
    suggestions.unshift({
      suggestion_id: 'developer-instructions-restructure',
      category: 'user-experience',
      priority: 'high',
      title: 'Restructure Developer Instructions into Themed Pages',
      description:
        'AI analysis suggests splitting the monolithic Developer Instructions page into multiple themed pages for better organization',
      reasoning:
        'The current Developer Instructions page contains 110+ individual records, making navigation difficult. AI analysis has identified 8 distinct themes that could be separated into dedicated pages, improving findability and developer experience.',
      solution:
        'Create a new navigation structure with themed pages: Getting Started, Testing & Quality, Deployment & DevOps, Configuration & Setup, IDE & Development Tools, Git & Collaboration, Performance & Monitoring, and Security & Best Practices. Each page should have its own search, filtering, and related content suggestions.',
      impact: 'major',
      effort: 'medium',
      estimated_time: '6-8 hours',
      tags: [
        'developer-instructions',
        'restructure',
        'navigation',
        'themed-pages',
        'ux-improvement',
      ],
      ai_confidence: 98,
      status: 'pending',
      user_id: 'demo-user',
      created_at: new Date().toISOString(),
      ide_specific: 'general',
      git_integration: false,
      team_collaboration: true,
    });

    return suggestions;
  };

  const markAsImplemented = async (suggestionId: string) => {
    try {
      await db.markSuggestionAsImplemented(suggestionId, implementationNotes);
      setSuggestions(prev =>
        prev.map(s =>
          s.suggestion_id === suggestionId
            ? {
                ...s,
                status: 'implemented',
                implementation_notes: implementationNotes,
                implemented_at: new Date().toISOString(),
              }
            : s
        )
      );
      setImplementationNotes('');
      setSelectedSuggestion(null);
    } catch (error) {
      console.error('Error marking suggestion as implemented:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance':
        return <Zap className='w-4 h-4' />;
      case 'security':
        return <Shield className='w-4 h-4' />;
      case 'architecture':
        return <Code className='w-4 h-4' />;
      case 'user-experience':
        return <Users className='w-4 h-4' />;
      case 'code-quality':
        return <Star className='w-4 h-4' />;
      case 'testing':
        return <TestTube className='w-4 h-4' />;
      case 'monitoring':
        return <Eye className='w-4 h-4' />;
      case 'deployment':
        return <TrendingUp className='w-4 h-4' />;
      case 'accessibility':
        return <Users className='w-4 h-4' />;
      case 'seo':
        return <Globe className='w-4 h-4' />;
      case 'pwa':
        return <Smartphone className='w-4 h-4' />;
      case 'ai-integration':
        return <Brain className='w-4 h-4' />;
      case 'multi-ide-collaboration':
        return <Layers className='w-4 h-4' />;
      case 'git-workflow':
        return <GitBranch className='w-4 h-4' />;
      default:
        return <Lightbulb className='w-4 h-4' />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-500 bg-red-100';
      case 'high':
        return 'text-orange-500 bg-orange-100';
      case 'medium':
        return 'text-yellow-500 bg-yellow-100';
      case 'low':
        return 'text-green-500 bg-green-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented':
        return 'text-green-500 bg-green-100';
      case 'in-progress':
        return 'text-blue-500 bg-blue-100';
      case 'pending':
        return 'text-gray-500 bg-gray-100';
      case 'rejected':
        return 'text-red-500 bg-red-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const getIDEBadge = (ide: string) => {
    switch (ide) {
      case 'bolt-ai':
        return (
          <span className='text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded'>
            Bolt.ai
          </span>
        );
      case 'cursor-ai':
        return (
          <span className='text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded'>
            Cursor.ai
          </span>
        );
      case 'both':
        return (
          <span className='text-xs bg-gradient-to-r from-purple-100 to-blue-100 text-gray-700 px-2 py-1 rounded'>
            Both IDEs
          </span>
        );
      default:
        return null;
    }
  };

  const filteredSuggestions = suggestions.filter(suggestion => {
    const matchesSearch =
      suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      suggestion.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || suggestion.category === filterCategory;
    const matchesPriority =
      filterPriority === 'all' || suggestion.priority === filterPriority;
    const matchesStatus =
      filterStatus === 'all' || suggestion.status === filterStatus;
    const matchesIDE =
      filterIDE === 'all' || suggestion.ide_specific === filterIDE;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPriority &&
      matchesStatus &&
      matchesIDE
    );
  });

  const categories = [
    'all',
    'performance',
    'security',
    'architecture',
    'user-experience',
    'code-quality',
    'testing',
    'monitoring',
    'deployment',
    'accessibility',
    'seo',
    'pwa',
    'ai-integration',
    'multi-ide-collaboration',
    'git-workflow',
  ];
  const priorities = ['all', 'critical', 'high', 'medium', 'low'];
  const statuses = ['all', 'pending', 'in-progress', 'implemented', 'rejected'];
  const ides = ['all', 'bolt-ai', 'cursor-ai', 'both', 'general'];

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
              <Brain className='w-8 h-8 mr-3 text-cyan-400' />
              AI Codebase Audit & Multi-IDE Collaboration
            </h1>
            <p className='text-gray-400 mt-1'>
              State-of-the-art AI-powered analysis optimized for Bolt.ai and
              Cursor.ai collaboration
            </p>
          </div>
        </div>

        <div className='flex items-center space-x-2'>
          <Button
            onClick={runAICodebaseAnalysis}
            disabled={isAnalyzing}
            className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
          >
            <Brain className='w-4 h-4 mr-2' />
            {isAnalyzing ? 'Analyzing...' : 'Run Multi-IDE Analysis'}
          </Button>
          <Button variant='secondary' size='sm'>
            <Download className='w-4 h-4 mr-2' />
            Export
          </Button>
        </div>
      </div>

      {/* Git Workflow Status */}
      <Card className='p-6'>
        <h2 className='text-xl font-bold text-white mb-4 flex items-center'>
          <GitBranch className='w-5 h-5 mr-2 text-cyan-400' />
          Git Workflow Status
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div className='text-center p-3 bg-gray-800/30 rounded-lg'>
            <div className='text-2xl font-bold text-cyan-400'>
              {gitStatus.branch}
            </div>
            <div className='text-xs text-gray-400'>Current Branch</div>
          </div>
          <div className='text-center p-3 bg-gray-800/30 rounded-lg'>
            <div className='text-2xl font-bold text-green-400'>
              {gitStatus.last_commit}
            </div>
            <div className='text-xs text-gray-400'>Last Commit</div>
          </div>
          <div className='text-center p-3 bg-gray-800/30 rounded-lg'>
            <div className='text-2xl font-bold text-orange-400'>
              {gitStatus.pending_pulls}
            </div>
            <div className='text-xs text-gray-400'>Pending PRs</div>
          </div>
          <div className='text-center p-3 bg-gray-800/30 rounded-lg'>
            <div className='text-2xl font-bold text-red-400'>
              {gitStatus.merge_conflicts}
            </div>
            <div className='text-xs text-gray-400'>Merge Conflicts</div>
          </div>
        </div>
        <div className='mt-4 flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <span className='text-sm text-gray-400'>Team Members:</span>
            <div className='flex space-x-2'>
              {gitStatus.team_members.map((member, index) => (
                <span
                  key={index}
                  className='text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded'
                >
                  {member}
                </span>
              ))}
            </div>
          </div>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <span className='text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded'>
                Bolt.ai: {gitStatus.ide_usage.bolt_ai}
              </span>
              <span className='text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded'>
                Cursor.ai: {gitStatus.ide_usage.cursor_ai}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Analysis Summary */}
      {analyses.length > 0 && (
        <Card className='p-6'>
          <h2 className='text-xl font-bold text-white mb-4 flex items-center'>
            <BarChart3 className='w-5 h-5 mr-2 text-cyan-400' />
            Latest Multi-IDE AI Analysis
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-8 gap-4'>
            {Object.entries(analyses[0].metrics).map(([key, value]) => (
              <div
                key={key}
                className='text-center p-3 bg-gray-800/30 rounded-lg'
              >
                <div className='text-2xl font-bold text-cyan-400'>{value}</div>
                <div className='text-xs text-gray-400 capitalize'>
                  {key.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
          <div className='mt-4 p-4 bg-gray-800/30 rounded-lg'>
            <h3 className='font-semibold text-white mb-2'>Summary</h3>
            <p className='text-gray-300 text-sm'>{analyses[0].summary}</p>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Input
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            placeholder='Search suggestions...'
            className='w-64'
          />
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className='px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm'
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all'
                  ? 'All Categories'
                  : category.replace('-', ' ')}
              </option>
            ))}
          </select>
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className='px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm'
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority === 'all' ? 'All Priorities' : priority}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className='px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm'
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status.replace('-', ' ')}
              </option>
            ))}
          </select>
          <select
            value={filterIDE}
            onChange={e => setFilterIDE(e.target.value)}
            className='px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm'
          >
            {ides.map(ide => (
              <option key={ide} value={ide}>
                {ide === 'all' ? 'All IDEs' : ide.replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className='text-sm text-gray-400'>
          {filteredSuggestions.length} suggestions
        </div>
      </div>

      {/* AI Suggestions Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {isLoading ? (
          <div className='col-span-2 flex items-center justify-center py-12'>
            <div className='w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin' />
          </div>
        ) : filteredSuggestions.length === 0 ? (
          <div className='col-span-2 text-center py-12 text-gray-400'>
            No suggestions found. Try adjusting your filters or run a new AI
            analysis.
          </div>
        ) : (
          filteredSuggestions.map(suggestion => (
            <div
              key={suggestion.suggestion_id}
              className='bg-gray-800/30 rounded-lg border border-gray-700/50 p-6 hover:border-cyan-500/50 transition-colors'
            >
              <div className='flex items-start justify-between mb-4'>
                <div className='flex items-center space-x-2'>
                  {getCategoryIcon(suggestion.category)}
                  <span className='text-sm font-medium text-gray-300 capitalize'>
                    {suggestion.category.replace('-', ' ')}
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(suggestion.priority)}`}
                  >
                    {suggestion.priority}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(suggestion.status)}`}
                  >
                    {suggestion.status.replace('-', ' ')}
                  </span>
                </div>
              </div>

              <h3 className='text-lg font-semibold text-white mb-2'>
                {suggestion.title}
              </h3>
              <p className='text-gray-300 text-sm mb-4'>
                {suggestion.description}
              </p>

              <div className='space-y-3 mb-4'>
                <div>
                  <h4 className='text-sm font-medium text-gray-400 mb-1'>
                    Reasoning
                  </h4>
                  <p className='text-gray-300 text-sm'>
                    {suggestion.reasoning}
                  </p>
                </div>
                <div>
                  <h4 className='text-sm font-medium text-gray-400 mb-1'>
                    Solution
                  </h4>
                  <p className='text-gray-300 text-sm'>{suggestion.solution}</p>
                </div>
              </div>

              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center space-x-4 text-xs text-gray-400'>
                  <span>Impact: {suggestion.impact}</span>
                  <span>Effort: {suggestion.effort}</span>
                  <span>Time: {suggestion.estimated_time}</span>
                </div>
                <div className='flex items-center space-x-1'>
                  <Target className='w-3 h-3 text-cyan-400' />
                  <span className='text-xs text-cyan-400'>
                    {suggestion.ai_confidence}%
                  </span>
                </div>
              </div>

              <div className='flex flex-wrap gap-1 mb-4'>
                {suggestion.tags.map(tag => (
                  <span
                    key={tag}
                    className='text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded'
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {suggestion.ide_specific && (
                <div className='mb-4'>
                  {getIDEBadge(suggestion.ide_specific)}
                </div>
              )}

              <div className='flex items-center justify-between'>
                <Button
                  onClick={() => setSelectedSuggestion(suggestion)}
                  size='sm'
                  className='bg-cyan-600 hover:bg-cyan-700 text-white'
                >
                  <Eye className='w-4 h-4 mr-1' />
                  View Details
                </Button>
                {suggestion.status === 'pending' && (
                  <Button
                    onClick={() => setSelectedSuggestion(suggestion)}
                    size='sm'
                    variant='secondary'
                  >
                    <CheckCircle className='w-4 h-4 mr-1' />
                    Mark Implemented
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Suggestion Detail Modal */}
      {selectedSuggestion && (
        <div
          className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'
          onClick={() => setSelectedSuggestion(null)}
        >
          <div
            className='bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto'
            onClick={e => e.stopPropagation()}
          >
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-white'>
                {selectedSuggestion.title}
              </h2>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setSelectedSuggestion(null)}
              >
                <X className='w-4 h-4' />
              </Button>
            </div>

            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <span className='text-gray-400'>Category:</span>
                  <span className='text-white ml-2 capitalize'>
                    {selectedSuggestion.category.replace('-', ' ')}
                  </span>
                </div>
                <div>
                  <span className='text-gray-400'>Priority:</span>
                  <span className='text-white ml-2'>
                    {selectedSuggestion.priority}
                  </span>
                </div>
                <div>
                  <span className='text-gray-400'>Impact:</span>
                  <span className='text-white ml-2'>
                    {selectedSuggestion.impact}
                  </span>
                </div>
                <div>
                  <span className='text-gray-400'>Effort:</span>
                  <span className='text-white ml-2'>
                    {selectedSuggestion.effort}
                  </span>
                </div>
              </div>

              {selectedSuggestion.ide_specific && (
                <div className='flex items-center space-x-2'>
                  <span className='text-gray-400'>IDE Specific:</span>
                  {getIDEBadge(selectedSuggestion.ide_specific)}
                </div>
              )}

              <div>
                <h3 className='font-semibold text-white mb-2'>Reasoning</h3>
                <p className='text-gray-300 text-sm'>
                  {selectedSuggestion.reasoning}
                </p>
              </div>

              <div>
                <h3 className='font-semibold text-white mb-2'>Solution</h3>
                <p className='text-gray-300 text-sm'>
                  {selectedSuggestion.solution}
                </p>
              </div>

              {selectedSuggestion.status === 'pending' && (
                <div>
                  <h3 className='font-semibold text-white mb-2'>
                    Implementation Notes
                  </h3>
                  <textarea
                    value={implementationNotes}
                    onChange={e => setImplementationNotes(e.target.value)}
                    placeholder='Add notes about how you implemented this suggestion...'
                    className='w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm'
                    rows={3}
                  />
                  <div className='flex items-center justify-end space-x-2 mt-4'>
                    <Button
                      variant='secondary'
                      onClick={() => setSelectedSuggestion(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() =>
                        markAsImplemented(selectedSuggestion.suggestion_id)
                      }
                      className='bg-green-600 hover:bg-green-700 text-white'
                    >
                      <CheckCircle className='w-4 h-4 mr-2' />
                      Mark as Implemented
                    </Button>
                  </div>
                </div>
              )}

              {selectedSuggestion.status === 'implemented' &&
                selectedSuggestion.implementation_notes && (
                  <div>
                    <h3 className='font-semibold text-white mb-2'>
                      Implementation Notes
                    </h3>
                    <p className='text-gray-300 text-sm'>
                      {selectedSuggestion.implementation_notes}
                    </p>
                    <p className='text-xs text-gray-500 mt-2'>
                      Implemented on:{' '}
                      {new Date(
                        selectedSuggestion.implemented_at!
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
