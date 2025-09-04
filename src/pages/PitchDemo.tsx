import React from 'react';
import {
  Brain,
  Zap,
  Scan,
  GitBranch,
  Database,
  Eye,
  Shield,
  Cpu,
  FileText,
  Lightbulb,
  Clock,
} from 'lucide-react';
import { HeroSection } from './pitch-demo/components/HeroSection';
import { InnovationShowcase } from './pitch-demo/components/InnovationShowcase';
import { StatsSection } from './pitch-demo/components/StatsSection';
import { ADHDInnovationSection } from './pitch-demo/components/ADHDInnovationSection';
import { LiveDemoSection } from './pitch-demo/components/LiveDemoSection';
import { TestimonialsSection } from './pitch-demo/components/TestimonialsSection';
import { FinalCTASection } from './pitch-demo/components/FinalCTASection';
import { usePitchDemo } from './pitch-demo/hooks/usePitchDemo';
import { PitchDemoProps, Feature, Stat, Testimonial } from './pitch-demo/types';

export const PitchDemo: React.FC<PitchDemoProps> = ({ onNavigate }) => {
  const {
    latestAnalysis,
    isGenerating,
    activeFeature,
    setActiveFeature,
    generateAIPitchContent,
    shareDemo,
    getPitchSection,
  } = usePitchDemo();

  const heroSection = getPitchSection('hero');

  // Fallback content when AI hasn't generated content yet
  const fallbackFeatures: Feature[] = [
    {
      title: 'AI-Powered Recovery Documentation',
      subtitle: "World's First Real-time Codebase Analysis",
      description:
        'Revolutionary system that scans your entire codebase with OpenAI and creates comprehensive recovery documentation. Never lose your work again!',
      icon: Scan,
      color: 'from-cyan-400 to-blue-500',
      stats: '100% Automated • Always Up-to-Date • Visual Recovery',
    },
    {
      title: 'Blueprint Snippet Workflow',
      subtitle: 'ADHD-Friendly Development Process',
      description:
        'Capture scattered thoughts into structured snippets, then AI transforms them into professional commits and complete documentation.',
      icon: Lightbulb,
      color: 'from-yellow-400 to-orange-500',
      stats: 'Thought → Snippet → AI → Professional Output',
    },
    {
      title: 'Multi-AI Orchestration',
      subtitle: 'OpenAI + Perplexity + Pinecone Integration',
      description:
        'First platform to orchestrate multiple AI services for different specialized tasks - content generation, research, and vector search.',
      icon: Brain,
      color: 'from-purple-400 to-pink-500',
      stats: '3 AI Services • Specialized Tasks • Seamless Integration',
    },
    {
      title: 'Always-True Documentation',
      subtitle: 'Never Outdated, Never Lies',
      description:
        'Documentation that automatically updates with every code change. No more outdated docs - everything stays perfectly synchronized.',
      icon: Shield,
      color: 'from-green-400 to-emerald-500',
      stats: 'Real-time Updates • 100% Accuracy • Zero Maintenance',
    },
    {
      title: 'Visual Recovery System',
      subtitle: 'Complete App Reconstruction Guide',
      description:
        'When builds break, get a complete visual map of every navigation item, component, user flow, and interaction to rebuild everything.',
      icon: Eye,
      color: 'from-indigo-400 to-purple-500',
      stats: 'Visual Maps • Step-by-Step • Complete Recovery',
    },
    {
      title: 'Git Interface in Browser',
      subtitle: 'IDE-Level Functionality',
      description:
        'Full Git interface integrated directly in the web app for WebContainer development - commit, branch, merge, all with AI assistance.',
      icon: GitBranch,
      color: 'from-pink-400 to-rose-500',
      stats: 'Full Git Commands • AI Commits • Browser-Based',
    },
  ];

  const fallbackStats: Stat[] = [
    {
      label: 'Files Analyzed',
      value: latestAnalysis?.files_analyzed?.toString() || '30+',
      icon: FileText,
    },
    { label: 'AI Services', value: '3', icon: Brain },
    { label: 'Automation Level', value: '96%', icon: Zap },
    { label: 'Recovery Time', value: '< 5min', icon: Clock },
  ];

  const testimonials: Testimonial[] = [
    {
      quote:
        "This is revolutionary! The AI recovery system saved my project when everything broke. I've never seen anything like this.",
      author: 'Sarah Chen',
      role: 'Full-Stack Developer',
      avatar:
        'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64',
    },
    {
      quote:
        'The ADHD-friendly workflow is genius. It captures my scattered thoughts and turns them into professional documentation automatically.',
      author: 'Marcus Rodriguez',
      role: 'Product Manager',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64',
    },
    {
      quote:
        'The multi-AI orchestration is mind-blowing. OpenAI, Perplexity, and Pinecone working together seamlessly - this is the future!',
      author: 'Dr. Emily Watson',
      role: 'AI Researcher',
      avatar:
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
      <HeroSection
        heroSection={heroSection}
        isGenerating={isGenerating}
        onGenerateAI={generateAIPitchContent}
        onShareDemo={shareDemo}
        onNavigate={onNavigate}
      />

      <InnovationShowcase
        features={fallbackFeatures}
        activeFeature={activeFeature}
        setActiveFeature={setActiveFeature}
      />

      <StatsSection stats={fallbackStats} />

      <ADHDInnovationSection />

      <LiveDemoSection
        latestAnalysis={latestAnalysis}
        onNavigate={onNavigate}
      />

      <TestimonialsSection testimonials={testimonials} />

      <FinalCTASection onNavigate={onNavigate} onShareDemo={shareDemo} />
    </div>
  );
};
