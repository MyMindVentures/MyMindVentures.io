import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar,
  Zap,
  Star,
  TrendingUp,
  Users,
  Code,
  Sparkles,
  Brain,
  GitCommit,
  Download,
  Copy,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Rocket,
  Target,
  Lightbulb,
  Award,
  Heart,
  Fire,
  Crown,
  Gem,
  Diamond,
  Trophy,
  Medal,
  Flag,
  Map,
  Navigation,
  Compass,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Edit,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Share,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Grid,
  List,
  Columns,
  Rows,
  Layout,
  Palette,
  Settings,
  MoreHorizontal,
  MoreVertical,
  Trash2,
  Archive,
  Tag,
  Hash,
  AtSign,
  Link,
  Unlink,
  Lock,
  Unlock,
  Shield,
  ShieldCheck,
  AlertCircle,
  Info,
  HelpCircle,
  QuestionMark,
  FileText,
  File,
  Folder,
  FolderOpen,
  Database,
  Server,
  Cloud,
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
  EyeOff,
  Eye,
  Camera,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Headphones,
  Speaker,
  Volume1,
  Volume,
  Bell,
  BellOff,
  Mail,
  MailOpen,
  Inbox,
  Send,
  Reply,
  Forward,
  Archive,
  Trash,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Laugh,
  Cry,
  Angry,
  Surprised,
  Wink,
  Tongue,
  Kiss,
  Hug,
  Wave,
  Clap,
  RaiseHand,
  Point,
  Victory,
  Ok,
  ThumbsUp,
  ThumbsDown,
  MiddleFinger,
  Peace,
  Rock,
  Paper,
  Scissors,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  Coin,
  DollarSign,
  Euro,
  Pound,
  Yen,
  Bitcoin,
  CreditCard,
  Wallet,
  PiggyBank,
  ShoppingCart,
  ShoppingBag,
  Gift,
  Package,
  Box,
  Truck,
  Car,
  Bike,
  Bus,
  Train,
  Plane,
  Ship,
  Rocket,
  Satellite,
  Globe,
  Map,
  MapPin,
  Navigation,
  Compass,
  Flag,
  Home,
  Building,
  Store,
  Bank,
  Hospital,
  School,
  University,
  Library,
  Museum,
  Theater,
  Cinema,
  Restaurant,
  Coffee,
  Pizza,
  Hamburger,
  IceCream,
  Cake,
  Wine,
  Beer,
  Cocktail,
  Coffee,
  Tea,
  Milk,
  Water,
  Juice,
  Soda,
  Energy,
  Protein,
  Vitamin,
  Pill,
  Syringe,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Ear,
  Nose,
  Mouth,
  Tooth,
  Bone,
  Muscle,
  Skin,
  Hair,
  Nail,
  Blood,
  Dna,
  Cell,
  Virus,
  Bacteria,
  Microscope,
  Telescope,
  Binoculars,
  Camera,
  Video,
  Photo,
  Image,
  Picture,
  Gallery,
  Album,
  Film,
  Movie,
  Tv,
  Radio,
  Podcast,
  Music,
  Song,
  Album,
  Playlist,
  Headphones,
  Speaker,
  Microphone,
  Guitar,
  Piano,
  Drum,
  Violin,
  Trumpet,
  Saxophone,
  Flute,
  Clarinet,
  Trombone,
  Harp,
  Accordion,
  Harmonica,
  Ukulele,
  Banjo,
  Mandolin,
  Cello,
  Bass,
  Synthesizer,
  Dj,
  Concert,
  Festival,
  Party,
  Celebration,
  Birthday,
  Wedding,
  Anniversary,
  Graduation,
  Promotion,
  Award,
  Trophy,
  Medal,
  Certificate,
  Diploma,
  Degree,
  License,
  Passport,
  IdCard,
  CreditCard,
  DebitCard,
  GiftCard,
  Coupon,
  Ticket,
  Receipt,
  Invoice,
  Bill,
  Contract,
  Document,
  File,
  Folder,
  Archive,
  Backup,
  Download,
  Upload,
  Sync,
  Share,
  Link,
  Copy,
  Paste,
  Cut,
  Undo,
  Redo,
  Save,
  SaveAs,
  Open,
  Close,
  New,
  Delete,
  Trash,
  Recycle,
  Restore,
  Archive,
  Lock,
  Unlock,
  Key,
  Password,
  Security,
  Privacy,
  Shield,
  Firewall,
  Antivirus,
  Scan,
  Update,
  Upgrade,
  Install,
  Uninstall,
  Configure,
  Setup,
  Customize,
  Personalize,
  Theme,
  Color,
  Font,
  Size,
  Style,
  Format,
  Layout,
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
  Omega
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabaseService as db, supabase } from '../../lib/supabase';
import { format } from 'date-fns';

interface AppUpdatesTimelineProps {
  onBack: () => void;
}

interface AppUpdate {
  id: string;
  version: string;
  version_name: string;
  release_date: string;
  features: AppFeature[];
  improvements: string[];
  bug_fixes: string[];
  breaking_changes: string[];
  ai_promotion: string;
  user_impact: string;
  technical_details: string;
  screenshots: string[];
  demo_url?: string;
  download_url?: string;
  changelog: string;
  created_at: string;
  updated_at: string;
}

interface AppFeature {
  id: string;
  name: string;
  description: string;
  category: 'major' | 'minor' | 'enhancement' | 'experimental';
  impact: 'high' | 'medium' | 'low';
  ai_promotion: string;
  user_benefits: string[];
  technical_implementation: string;
  screenshots: string[];
  demo_url?: string;
  documentation_url?: string;
}

export const AppUpdatesTimeline: React.FC<AppUpdatesTimelineProps> = ({ onBack }) => {
  const [appUpdates, setAppUpdates] = useState<AppUpdate[]>([]);
  const [selectedUpdate, setSelectedUpdate] = useState<AppUpdate | null>(null);
  const [selectedView, setSelectedView] = useState<'timeline' | 'roadmap' | 'features' | 'ai-promotion'>('timeline');
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [autoPlayPromotion, setAutoPlayPromotion] = useState(false);

  useEffect(() => {
    loadAppUpdates();
  }, []);

  const loadAppUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from('app_updates')
        .select('*')
        .eq('user_id', 'demo-user')
        .order('release_date', { ascending: false });
      
      if (data) {
        setAppUpdates(data);
      }
      if (error) {
        console.error('Error loading app updates:', error);
      }
    } catch (error) {
      console.error('Error loading app updates:', error);
    }
  };

  const generateAIUpdatePromotion = async (update: AppUpdate) => {
    setIsGenerating(true);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-update-promotion`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'demo-user',
          update_data: update,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`✅ AI Promotion generated for ${update.version_name}!`);
        await loadAppUpdates();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error generating AI promotion:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('✅ Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('❌ Failed to copy to clipboard');
    }
  };

  const shareUpdate = async (update: AppUpdate) => {
    try {
      const shareData = {
        title: `${update.version_name} - MyMindVentures.io`,
        text: update.ai_promotion || `Check out the amazing new features in ${update.version_name}!`,
        url: window.location.href,
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await copyToClipboard(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const filteredUpdates = appUpdates.filter(update => {
    const matchesSearch = update.version_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.ai_promotion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVersion = selectedVersion === 'all' || update.version === selectedVersion;
    return matchesSearch && matchesVersion;
  });

  const versions = [...new Set(appUpdates.map(u => u.version))];

  const renderTimelineView = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search app updates..."
              className="w-full"
            />
          </div>
          <select 
            value={selectedVersion} 
            onChange={(e) => setSelectedVersion(e.target.value)}
            className="p-2 border rounded-lg bg-gray-800 border-gray-600"
          >
            <option value="all">All Versions</option>
            {versions.map(version => (
              <option key={version} value={version}>{version}</option>
            ))}
          </select>
          <Button onClick={loadAppUpdates} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500"></div>
        
        <div className="space-y-8">
          {filteredUpdates.map((update, index) => (
            <motion.div
              key={update.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-gray-900 transform -translate-x-1/2"></div>
              
              <div className="ml-16">
                <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
                  {/* Version Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Rocket className="w-6 h-6 text-blue-500" />
                        <h3 className="text-xl font-bold">{update.version_name}</h3>
                        <span className="text-sm bg-blue-600 px-2 py-1 rounded-full">
                          v{update.version}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">
                          {format(new Date(update.release_date), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedUpdate(update)}
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button
                        onClick={() => shareUpdate(update)}
                        variant="outline"
                        size="sm"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* AI Promotion */}
                  {showAIInsights && update.ai_promotion && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg border border-purple-500">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-5 h-5 text-purple-400" />
                        <span className="font-semibold text-purple-300">AI Promotion</span>
                      </div>
                      <p className="text-sm text-gray-200 leading-relaxed">
                        {update.ai_promotion}
                      </p>
                    </div>
                  )}

                  {/* Features Preview */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        New Features
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        {update.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Star className="w-3 h-3 text-yellow-500" />
                            {feature.name}
                          </li>
                        ))}
                        {update.features.length > 3 && (
                          <li className="text-gray-400 text-xs">
                            +{update.features.length - 3} more features
                          </li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        Improvements
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        {update.improvements.slice(0, 3).map((improvement, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* User Impact */}
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      User Impact
                    </h4>
                    <p className="text-sm text-gray-300">{update.user_impact}</p>
                  </div>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRoadmapView = () => (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Map className="w-6 h-6 text-green-500" />
          <h3 className="text-lg font-semibold">🗺️ Development Roadmap</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Current Version */}
          <div className="p-4 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg border border-green-500">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Current Version
            </h4>
            <p className="text-sm text-gray-300 mb-3">
              Latest stable release with all features fully implemented
            </p>
            {appUpdates.length > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {appUpdates[0].version_name}
                </div>
                <div className="text-xs text-gray-400">
                  v{appUpdates[0].version}
                </div>
              </div>
            )}
          </div>

          {/* Next Version */}
          <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg border border-blue-500">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Next Version
            </h4>
            <p className="text-sm text-gray-300 mb-3">
              Features in development, coming soon
            </p>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                Coming Soon
              </div>
              <div className="text-xs text-gray-400">
                AI-powered features
              </div>
            </div>
          </div>

          {/* Future Vision */}
          <div className="p-4 bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg border border-purple-500">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-purple-400" />
              Future Vision
            </h4>
            <p className="text-sm text-gray-300 mb-3">
              Long-term roadmap and revolutionary features
            </p>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                Revolution
              </div>
              <div className="text-xs text-gray-400">
                AI-first platform
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Feature Categories */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">🎯 Feature Categories</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { category: 'major', label: 'Major Features', icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-900' },
            { category: 'minor', label: 'Minor Features', icon: Star, color: 'text-blue-500', bg: 'bg-blue-900' },
            { category: 'enhancement', label: 'Enhancements', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-900' },
            { category: 'experimental', label: 'Experimental', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-900' }
          ].map((cat) => (
            <div key={cat.category} className={`p-4 rounded-lg border ${cat.bg} border-gray-700`}>
              <div className="flex items-center gap-2 mb-2">
                <cat.icon className={`w-5 h-5 ${cat.color}`} />
                <span className="font-semibold">{cat.label}</span>
              </div>
              <p className="text-sm text-gray-300">
                {appUpdates.flatMap(u => u.features).filter(f => f.category === cat.category).length} features
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderFeaturesView = () => (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">✨ All Features</h3>
          <div className="flex gap-2">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 border rounded-lg bg-gray-800 border-gray-600"
            >
              <option value="all">All Categories</option>
              <option value="major">Major Features</option>
              <option value="minor">Minor Features</option>
              <option value="enhancement">Enhancements</option>
              <option value="experimental">Experimental</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appUpdates.flatMap(update => 
            update.features.map(feature => ({ ...feature, update }))
          ).filter(feature => 
            selectedCategory === 'all' || feature.category === selectedCategory
          ).map((feature, index) => (
            <motion.div
              key={`${feature.update.id}-${feature.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{feature.name}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        feature.category === 'major' ? 'bg-yellow-600' :
                        feature.category === 'minor' ? 'bg-blue-600' :
                        feature.category === 'enhancement' ? 'bg-green-600' :
                        'bg-purple-600'
                      }`}>
                        {feature.category}
                      </span>
                      <span className="text-xs text-gray-400">
                        v{feature.update.version}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-300 mb-3 line-clamp-3">
                  {feature.description}
                </p>

                {feature.ai_promotion && (
                  <div className="p-3 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg mb-3">
                    <p className="text-xs text-purple-200 leading-relaxed">
                      {feature.ai_promotion}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {feature.user_benefits.slice(0, 2).map((benefit, idx) => (
                      <span key={idx} className="text-xs bg-gray-700 px-2 py-1 rounded">
                        {benefit}
                      </span>
                    ))}
                  </div>
                  <Button
                    onClick={() => copyToClipboard(feature.description)}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderAIPromotionView = () => (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-purple-500" />
          <h3 className="text-lg font-semibold">🧠 AI-Powered Promotion</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg">
              <h4 className="font-semibold mb-2">🚀 Generate AI Promotion</h4>
              <p className="text-sm mb-3">
                Let AI create compelling promotional content for your app updates
              </p>
              <Button
                onClick={() => appUpdates.length > 0 && generateAIUpdatePromotion(appUpdates[0])}
                disabled={isGenerating || appUpdates.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating AI Promotion...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate AI Promotion
                  </>
                )}
              </Button>
            </div>

            <div className="p-4 bg-gray-800 rounded-lg">
              <h4 className="font-semibold mb-2">🎯 AI Promotion Features</h4>
              <ul className="space-y-2 text-sm">
                <li>• 📝 Compelling feature descriptions</li>
                <li>• 🎨 User benefit highlighting</li>
                <li>• 🔥 Emotional engagement</li>
                <li>• 📊 Impact quantification</li>
                <li>• 🚀 Call-to-action optimization</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg">
              <h4 className="font-semibold mb-2">💡 Promotion Strategy</h4>
              <p className="text-sm mb-3">
                AI analyzes user behavior and creates targeted promotional content
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-green-800 rounded">
                  <div className="font-medium">User Psychology</div>
                  <div className="text-green-300">Emotional triggers</div>
                </div>
                <div className="p-2 bg-green-800 rounded">
                  <div className="font-medium">Feature Benefits</div>
                  <div className="text-green-300">Value proposition</div>
                </div>
                <div className="p-2 bg-green-800 rounded">
                  <div className="font-medium">Social Proof</div>
                  <div className="text-green-300">Community impact</div>
                </div>
                <div className="p-2 bg-green-800 rounded">
                  <div className="font-medium">Urgency</div>
                  <div className="text-green-300">Time-sensitive</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">🚀 App Updates Timeline</h1>
            <p className="text-gray-400">Fantastic timeline/roadmap with AI-powered feature promotion</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'timeline', label: 'Timeline', icon: Clock },
            { id: 'roadmap', label: 'Roadmap', icon: Map },
            { id: 'features', label: 'Features', icon: Sparkles },
            { id: 'ai-promotion', label: 'AI Promotion', icon: Brain }
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setSelectedView(tab.id as any)}
              variant={selectedView === tab.id ? 'default' : 'outline'}
              size="sm"
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={selectedView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedView === 'timeline' && renderTimelineView()}
          {selectedView === 'roadmap' && renderRoadmapView()}
          {selectedView === 'features' && renderFeaturesView()}
          {selectedView === 'ai-promotion' && renderAIPromotionView()}
        </motion.div>

        {/* Selected Update Modal */}
        {selectedUpdate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div>
                  <h3 className="text-lg font-semibold">{selectedUpdate.version_name}</h3>
                  <p className="text-sm text-gray-400">v{selectedUpdate.version} • {format(new Date(selectedUpdate.release_date), 'MMM dd, yyyy')}</p>
                </div>
                <Button onClick={() => setSelectedUpdate(null)} variant="outline" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
                <div className="prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: selectedUpdate.changelog.replace(/\n/g, '<br>') }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
