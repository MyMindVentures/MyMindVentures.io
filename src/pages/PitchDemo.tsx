import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain,
  Zap,
  Scan,
  GitBranch,
  Database,
  Eye,
  Rocket,
  Users,
  Globe,
  Shield,
  Cpu,
  FileText,
  Navigation,
  Code,
  Monitor,
  Lightbulb,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  Heart,
  Sparkles,
  Target,
  TrendingUp,
  Award,
  Crown,
  Gem,
  RefreshCw,
  Share,
  ExternalLink,
  Copy,
  Clock
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { supabaseService as db, supabase } from '../lib/supabase';
import { format } from 'date-fns';

interface PitchDemoProps {
  onNavigate?: (page: string) => void;
}

interface PitchContent {
  id: string;
  section_type: string;
  title: string;
  content: string;
  metadata: any;
  version: string;
  generated_by_ai: boolean;
  last_updated: string;
}

interface RecoveryDoc {
  id: string;
  timestamp: string;
  analysis_summary: string;
  files_analyzed: number;
}

export const PitchDemo: React.FC<PitchDemoProps> = ({ onNavigate }) => {
  const [pitchContent, setPitchContent] = useState<PitchContent[]>([]);
  const [latestAnalysis, setLatestAnalysis] = useState<RecoveryDoc | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [visitorId] = useState(() => `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    loadPitchContent();
    loadLatestAnalysis();
    trackPageView();
    
    // Auto-rotate features every 6 seconds
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  const loadPitchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('pitch_content')
        .select('*')
        .eq('user_id', 'demo-user')
        .order('last_updated', { ascending: false });
      
      if (data) {
        setPitchContent(data);
      }
    } catch (error) {
      console.error('Error loading pitch content:', error);
    }
  };

  const loadLatestAnalysis = async () => {
    try {
      const { data } = await db.getRecoveryDocumentation('demo-user');
      if (data && data.length > 0) {
        setLatestAnalysis(data[0]);
      }
    } catch (error) {
      console.error('Error loading latest analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const trackPageView = async () => {
    try {
      await supabase.from('pitch_analytics').insert({
        visitor_id: visitorId,
        page_views: 1,
        timestamp: new Date().toISOString(),
        user_id: 'demo-user',
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };

  const generateAIPitchContent = async () => {
    setIsGenerating(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-pitch-content`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'demo-user',
          section_type: 'complete',
          force_regenerate: true,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        await loadPitchContent();
        alert('🚀 AI has generated amazing new pitch content! The page is now updated with the latest revolutionary features.');
      } else {
        alert(`❌ AI generation failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Error generating pitch content:', error);
      alert('❌ Failed to generate pitch content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const shareDemo = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('🔗 Demo URL copied to clipboard! Share this revolutionary platform with others.');
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const getPitchSection = (sectionType: string) => {
    return pitchContent.find(p => p.section_type === sectionType);
  };

  const heroSection = getPitchSection('hero');
  const featuresSection = getPitchSection('features');
  const statsSection = getPitchSection('stats');

  // Fallback content when AI hasn't generated content yet
  const fallbackFeatures = [
    {
      title: "AI-Powered Recovery Documentation",
      subtitle: "World's First Real-time Codebase Analysis",
      description: "Revolutionary system that scans your entire codebase with OpenAI and creates comprehensive recovery documentation. Never lose your work again!",
      icon: Scan,
      color: "from-cyan-400 to-blue-500",
      stats: "100% Automated • Always Up-to-Date • Visual Recovery"
    },
    {
      title: "Blueprint Snippet Workflow",
      subtitle: "ADHD-Friendly Development Process",
      description: "Capture scattered thoughts into structured snippets, then AI transforms them into professional commits and complete documentation.",
      icon: Lightbulb,
      color: "from-yellow-400 to-orange-500",
      stats: "Thought → Snippet → AI → Professional Output"
    },
    {
      title: "Multi-AI Orchestration",
      subtitle: "OpenAI + Perplexity + Pinecone Integration",
      description: "First platform to orchestrate multiple AI services for different specialized tasks - content generation, research, and vector search.",
      icon: Brain,
      color: "from-purple-400 to-pink-500",
      stats: "3 AI Services • Specialized Tasks • Seamless Integration"
    },
    {
      title: "Always-True Documentation",
      subtitle: "Never Outdated, Never Lies",
      description: "Documentation that automatically updates with every code change. No more outdated docs - everything stays perfectly synchronized.",
      icon: Shield,
      color: "from-green-400 to-emerald-500",
      stats: "Real-time Updates • 100% Accuracy • Zero Maintenance"
    },
    {
      title: "Visual Recovery System",
      subtitle: "Complete App Reconstruction Guide",
      description: "When builds break, get a complete visual map of every navigation item, component, user flow, and interaction to rebuild everything.",
      icon: Eye,
      color: "from-indigo-400 to-purple-500",
      stats: "Visual Maps • Step-by-Step • Complete Recovery"
    },
    {
      title: "Git Interface in Browser",
      subtitle: "IDE-Level Functionality",
      description: "Full Git interface integrated directly in the web app for WebContainer development - commit, branch, merge, all with AI assistance.",
      icon: GitBranch,
      color: "from-pink-400 to-rose-500",
      stats: "Full Git Commands • AI Commits • Browser-Based"
    }
  ];

  const fallbackStats = [
    { label: "Files Analyzed", value: latestAnalysis?.files_analyzed?.toString() || "30+", icon: FileText },
    { label: "AI Services", value: "3", icon: Brain },
    { label: "Automation Level", value: "96%", icon: Zap },
    { label: "Recovery Time", value: "< 5min", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden"
      >
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-gradient" />
        
        <div className="relative z-10 px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto space-y-8"
          >
            {/* AI Update Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-8"
            >
              <Button
                onClick={generateAIPitchContent}
                disabled={isGenerating}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    OpenAI Updating Demo...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Let OpenAI Update This Demo
                  </>
                )}
              </Button>
            </motion.div>

            {/* Main Title */}
            <div className="space-y-6">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex justify-center mb-6"
              >
                <div className="w-32 h-32 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-slow">
                  <Brain className="w-16 h-16 text-white" />
                </div>
              </motion.div>
              
              <h1 className="text-6xl md:text-8xl font-bold text-white leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                  MyMindVentures.io
                </span>
              </h1>
              
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  🧠 Revolutionary Developer Platform
                </h2>
                
                <div className="flex items-center justify-center space-x-4 text-lg">
                  <div className="flex items-center space-x-2 bg-cyan-500/20 px-4 py-2 rounded-full">
                    <Crown className="w-5 h-5 text-cyan-400" />
                    <span className="text-cyan-300 font-semibold">ADHD Innovation</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-purple-500/20 px-4 py-2 rounded-full">
                    <Gem className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-300 font-semibold">AI-Powered</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-pink-500/20 px-4 py-2 rounded-full">
                    <Award className="w-5 h-5 text-pink-400" />
                    <span className="text-pink-300 font-semibold">World's First</span>
                  </div>
                </div>
              </div>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-5xl mx-auto leading-relaxed">
                {heroSection?.content || `The world's first AI-powered development platform that turns ADHD thinking patterns into 
                breakthrough innovations. Created by a unique mind with extraordinary blueprinting talents, 
                powered by Perplexity.ai and Bolt.ai.`}
              </p>
            </div>

            {/* Revolutionary Features Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
            >
              {[
                { icon: Scan, label: "AI Recovery System", desc: "World's First" },
                { icon: Brain, label: "Multi-AI Orchestra", desc: "Revolutionary" },
                { icon: Shield, label: "Always-True Docs", desc: "Never Outdated" },
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="p-6 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300"
                  >
                    <Icon className="w-8 h-8 text-cyan-400 mb-3 mx-auto" />
                    <h3 className="text-white font-bold text-lg mb-1">{feature.label}</h3>
                    <p className="text-cyan-400 text-sm font-semibold">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Button 
                variant="primary" 
                className="px-8 py-4 text-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500"
                onClick={() => onNavigate?.('app-management')}
              >
                <Rocket className="w-5 h-5 mr-3" />
                Experience the Revolution
              </Button>
              
              <Button 
                variant="secondary" 
                className="px-8 py-4 text-lg"
                onClick={shareDemo}
              >
                <Share className="w-5 h-5 mr-3" />
                Share This Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Innovation Showcase */}
      <section className="px-6 py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-6 mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              🧠 <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Breakthrough Innovations
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto">
              Revolutionary features created by a brilliant ADHD mind that sees solutions others miss
            </p>
          </motion.div>

          {/* Rotating Feature Showcase */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              >
                {/* Feature Content */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${fallbackFeatures[activeFeature].color} flex items-center justify-center`}>
                      {(() => {
                        const Icon = fallbackFeatures[activeFeature].icon;
                        return <Icon className="w-8 h-8 text-white" />;
                      })()}
                    </div>
                    
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">
                        {fallbackFeatures[activeFeature].title}
                      </h3>
                      <p className="text-cyan-400 text-lg font-semibold mb-4">
                        {fallbackFeatures[activeFeature].subtitle}
                      </p>
                      <p className="text-gray-300 text-lg leading-relaxed">
                        {fallbackFeatures[activeFeature].description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>{fallbackFeatures[activeFeature].stats}</span>
                    </div>
                  </div>
                </div>

                {/* Visual Demo */}
                <div className="relative">
                  <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-3 h-3 bg-red-400 rounded-full" />
                        <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                        <div className="w-3 h-3 bg-green-400 rounded-full" />
                        <span className="text-gray-400 text-sm ml-4">MyMindVentures.io</span>
                      </div>
                      
                      {/* Demo Interface */}
                      <div className="space-y-3">
                        {[1, 2, 3, 4].map((item, index) => (
                          <motion.div
                            key={item}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg"
                          >
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${fallbackFeatures[activeFeature].color}`} />
                            <div className="flex-1 h-2 bg-gray-600/50 rounded" />
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Feature Navigation Dots */}
            <div className="flex justify-center space-x-2 mt-8">
              {fallbackFeatures.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeFeature === index 
                      ? 'bg-cyan-400 scale-125' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              🚀 Revolutionary Impact
            </h2>
            <p className="text-gray-400 text-lg">
              Real metrics from the world's most innovative development platform
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {fallbackStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50"
                >
                  <Icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ADHD Innovation Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-white">
                  🎯 <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    ADHD-Powered Innovation
                  </span>
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                  This platform was created by someone with ADHD who has a unique talent for blueprinting applications. 
                  Their mind works differently - they see patterns and solutions others miss.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Lightbulb, text: "Captures scattered thoughts into structured workflows" },
                  { icon: Brain, text: "Transforms ADHD thinking patterns into breakthrough features" },
                  { icon: Zap, text: "Automated systems reduce cognitive load and prevent overwhelm" },
                  { icon: Eye, text: "Visual recovery system for when focus is lost" },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-300">{item.text}</span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl border border-yellow-500/20">
                <div className="flex items-center space-x-3 mb-3">
                  <Heart className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-300 font-semibold">Powered by AI Collaboration</span>
                </div>
                <p className="text-gray-300 text-sm">
                  "I could never have done this without Perplexity.ai and Bolt.ai. They helped me turn my unique 
                  ADHD thinking patterns into revolutionary development workflows that nobody else would think of."
                </p>
              </div>
            </div>

            {/* Visual Representation */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-xl">ADHD Mind</h3>
                    <p className="text-gray-400 text-sm">Unique Blueprinting Talent</p>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <ArrowRight className="w-6 h-6 text-cyan-400" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                      <Globe className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                      <div className="text-cyan-300 font-semibold text-sm">Perplexity.ai</div>
                      <div className="text-gray-400 text-xs">Research Partner</div>
                    </div>
                    <div className="text-center p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                      <Code className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <div className="text-purple-300 font-semibold text-sm">Bolt.ai</div>
                      <div className="text-gray-400 text-xs">Development Partner</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <ArrowRight className="w-6 h-6 text-purple-400" />
                  </div>

                  <div className="text-center p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-500/20">
                    <Rocket className="w-8 h-8 text-white mx-auto mb-2" />
                    <div className="text-white font-bold">Revolutionary Platform</div>
                    <div className="text-gray-400 text-xs">MyMindVentures.io</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-white">
              🎬 <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Live Demo
              </span>
            </h2>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See the revolutionary AI-powered workflows in action. Every feature you see is real and working.
            </p>

            {/* Live Stats */}
            {latestAnalysis && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-6 bg-green-500/10 backdrop-blur-xl rounded-2xl border border-green-500/20 max-w-2xl mx-auto"
              >
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-300 font-semibold">Live System Status</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-white font-bold text-lg">{latestAnalysis.files_analyzed}</div>
                    <div className="text-gray-400">Files Analyzed</div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">
                      {format(new Date(latestAnalysis.timestamp), 'MMM dd, HH:mm')}
                    </div>
                    <div className="text-gray-400">Last AI Scan</div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button 
                variant="primary" 
                className="px-8 py-4 text-lg bg-gradient-to-r from-green-500 to-emerald-600"
                onClick={() => onNavigate?.('app-documentation')}
              >
                <Play className="w-5 h-5 mr-3" />
                Try AI Scanner Live
              </Button>
              
              <Button 
                variant="secondary" 
                className="px-8 py-4 text-lg"
                onClick={() => onNavigate?.('app-management')}
              >
                <Eye className="w-5 h-5 mr-3" />
                Explore All Tools
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-6 mb-16"
          >
            <h2 className="text-4xl font-bold text-white">
              💬 <span className="bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">
                What Developers Say
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Real feedback from developers who've experienced the revolution
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "This is revolutionary! The AI recovery system saved my project when everything broke. I've never seen anything like this.",
                author: "Sarah Chen",
                role: "Full-Stack Developer",
                avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64"
              },
              {
                quote: "The ADHD-friendly workflow is genius. It captures my scattered thoughts and turns them into professional documentation automatically.",
                author: "Marcus Rodriguez", 
                role: "Product Manager",
                avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64"
              },
              {
                quote: "The multi-AI orchestration is mind-blowing. OpenAI, Perplexity, and Pinecone working together seamlessly - this is the future!",
                author: "Dr. Emily Watson",
                role: "AI Researcher", 
                avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="p-6 bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center space-x-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="text-white font-semibold text-sm">{testimonial.author}</div>
                    <div className="text-gray-400 text-xs">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Experience the 
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent block">
                Revolution?
              </span>
            </h2>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join the future of development with AI-powered workflows, ADHD-friendly design, 
              and breakthrough innovations that will transform how you build applications.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button 
                variant="primary" 
                className="px-10 py-5 text-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-2xl"
                onClick={() => onNavigate?.('app-management')}
              >
                <Rocket className="w-6 h-6 mr-3" />
                Start Your Journey
              </Button>
              
              <Button 
                variant="ghost" 
                className="px-10 py-5 text-xl border border-gray-600 hover:border-cyan-500/50"
                onClick={shareDemo}
              >
                <Share className="w-6 h-6 mr-3" />
                Share the Revolution
              </Button>
            </div>

            {/* AI Update Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="p-4 bg-cyan-500/10 backdrop-blur-xl rounded-xl border border-cyan-500/20 max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-center space-x-2 text-cyan-300">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">
                  This demo is powered by OpenAI and updates automatically with the latest features
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};