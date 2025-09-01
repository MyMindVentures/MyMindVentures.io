import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Users, 
  Zap, 
  Rocket, 
  Crown, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Heart, 
  Star, 
  Award, 
  Trophy, 
  Lightbulb, 
  Sparkles, 
  Eye, 
  BarChart3, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Calendar,
  Globe,
  Network,
  Database,
  Shield,
  Lock,
  Unlock,
  Key,
  Settings,
  Cog,
  Wrench,
  Tool,
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
  Euro,
  Pound,
  Yen,
  Bitcoin,
  CreditCard,
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
  Satellite,
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
  Playlist,
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
  Certificate,
  Diploma,
  Degree,
  License,
  Passport,
  IdCard,
  DebitCard,
  GiftCard,
  Coupon,
  Ticket,
  Receipt,
  Invoice,
  Bill,
  Contract,
  Document,
  Folder,
  Archive,
  Backup,
  Download,
  Upload,
  Sync,
  Share,
  Link,
  ExternalLink,
  Share2,
  Bookmark,
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
  Unlink,
  ShieldCheck,
  AlertCircle,
  Info,
  HelpCircle,
  QuestionMark,
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
  EyeOff,
  VideoOff,
  MicOff,
  Headphones,
  Speaker,
  Volume1,
  Volume,
  BellOff,
  MailOpen,
  Inbox,
  Send,
  Reply,
  Forward,
  Trash,
  MiddleFinger,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
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
  Playlist,
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
  Certificate,
  Diploma,
  Degree,
  License,
  Passport,
  IdCard,
  DebitCard,
  GiftCard,
  Coupon,
  Ticket,
  Receipt,
  Invoice,
  Bill,
  Contract,
  Document,
  Folder,
  Backup,
  Upload,
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
  Recycle,
  Restore,
  Password,
  Security,
  Privacy,
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
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface AppPortfolio {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'development' | 'beta' | 'live';
  category: string;
  features: string[];
  techStack: string[];
  targetUsers: string[];
  revenueModel: string;
  uniqueValue: string;
  developmentTime: string;
  blueprintStatus: string;
}

export const Portfolio: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'overview' | 'detailed' | 'roadmap' | 'proof-of-existence'>('overview');
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const portfolioApps: AppPortfolio[] = [
    {
      id: 'central-hub',
      name: 'MyMindVentures Central Hub',
      tagline: 'Complete ecosystem voor iedereen',
      description: 'Revolutionaire centrale hub met je verhaal, interactieve timeline/roadmap, portfolio van te lanceren apps, app ecosysteem met co-ownership, transparantie, AI geautomatiseerde flow voor documentatie, geïntegreerde Git voor tijdens de bouw en alle andere versies.',
      icon: Brain,
      status: 'development',
      category: 'Central Platform',
      features: [
        'Interactieve Timeline/Roadmap',
        'Portfolio van te lanceren apps',
        'App Ecosysteem met Co-ownership',
        'Transparantie Dashboard',
        'AI geautomatiseerde documentatie',
        'Geïntegreerde Git management',
        'JointVenture showcase',
        'NFT co-ownership system'
      ],
      techStack: ['React', 'TypeScript', 'Supabase', 'OpenAI API', 'Git API', 'Framer Motion'],
      targetUsers: ['Investors', 'Partners', 'Users', 'Developers'],
      revenueModel: 'NFT Co-ownership (70% Users, 7% Perplexity, 7% Bolt.ai, 3% Charity, 13% Natasha)',
      uniqueValue: 'Complete ecosystem dat alle andere apps verbindt en showcase',
      developmentTime: '3 maanden blueprinting + 2 weken development',
      blueprintStatus: '✅ Volledig gedetailleerd blueprint klaar'
    },
    {
      id: 'neurosphere',
      name: 'NeuroSphere',
      tagline: 'Compleet platform voor NeuroDiversity',
      description: 'Revolutionair platform dat alles over NeuroDiversity centraliseert - van ADHD tot autisme, van tools tot community, van educatie tot support. Een complete hub voor neurodivergenten en hun supporters.',
      icon: Sparkles,
      status: 'development',
      category: 'Health & Wellness',
      features: [
        'NeuroDiversity educatie & awareness',
        'ADHD & Autism support tools',
        'Community platform',
        'Expert connectie',
        'Personalized coping strategies',
        'Progress tracking',
        'Resource library',
        'Peer support network'
      ],
      techStack: ['React Native', 'Supabase', 'OpenAI API', 'Pinecone', 'Neo4J'],
      targetUsers: ['Neurodivergenten', 'Families', 'Healthcare professionals', 'Educators'],
      revenueModel: 'Freemium + Premium subscriptions + Expert marketplace',
      uniqueValue: 'Eerste complete platform specifiek voor alle vormen van NeuroDiversity',
      developmentTime: '6 maanden blueprinting + 4 maanden development',
      blueprintStatus: '✅ Volledig gedetailleerd blueprint klaar'
    },
    {
      id: 'nexio',
      name: 'Nexio',
      tagline: 'Verbinden binnen 10km radius',
      description: 'Revolutionaire app die iedereen in een straal van 10km met elkaar verbindt om zo om het even wat te supporten. Vrager/Aanbod systeem: Gereedschap lenen, babysitten zoeken, klusjes helpen, sportbuddy vinden, en meer.',
      icon: Network,
      status: 'development',
      category: 'Community & Social',
      features: [
        '10km radius matching',
        'Vrager/Aanbod systeem',
        'Gereedschap lenen platform',
        'Babysitting connectie',
        'Klusjes help matching',
        'Sportbuddy finder',
        'Trust & rating systeem',
        'Real-time notifications'
      ],
      techStack: ['React Native', 'Supabase', 'Geolocation API', 'Push notifications', 'Payment gateway'],
      targetUsers: ['Lokale communities', 'Jonge ouders', 'DIY enthusiasts', 'Sporters', 'Studenten'],
      revenueModel: 'Freemium + Premium features + Service fees',
      uniqueValue: 'Eerste app die hyperlocal community support systematiseert',
      developmentTime: '4 maanden blueprinting + 3 maanden development',
      blueprintStatus: '✅ Volledig gedetailleerd blueprint klaar'
    },
    {
      id: 'my2nd-ai-brain',
      name: 'My2ndAIBrain',
      tagline: 'Baanbrekende personal knowledge base',
      description: 'Revolutionaire app die data & binary data in je eigen knowledge base zet met Pinecone & Neo4J. Alles te uploaden en retrieven met AI Chatbot. Nooit meer data verspreid en niet gelinkt aan binary data. Co-pilot cross-platform overal en eender wanneer met je mee.',
      icon: Database,
      status: 'development',
      category: 'AI & Productivity',
      features: [
        'Personal knowledge base',
        'Pinecone & Neo4J integratie',
        'AI Chatbot retrieval',
        'Cross-platform co-pilot',
        'IoT & wearables integratie',
        'Knowledge Graph rendering',
        'RAG (Retrieval Augmented Generation)',
        'Secure data storage'
      ],
      techStack: ['React Native', 'Pinecone', 'Neo4J', 'OpenAI API', 'IoT APIs', 'GraphQL'],
      targetUsers: ['Knowledge workers', 'Researchers', 'Students', 'Professionals', 'IoT enthusiasts'],
      revenueModel: 'Subscription tiers + Enterprise licensing',
      uniqueValue: 'Eerste personal AI brain die alle data centraliseert en cross-platform beschikbaar maakt',
      developmentTime: '8 maanden blueprinting + 6 maanden development',
      blueprintStatus: '✅ Volledig gedetailleerd blueprint klaar'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-blue-900 to-pink-900 opacity-20"></div>
        <div className="relative p-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="mb-6"
          >
            <Rocket className="w-24 h-24 mx-auto text-purple-400 mb-4" />
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
              🚀 Portfolio van Revolutionaire Apps
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              4 volledig gedetailleerde apps - maanden van blueprinting klaar voor development
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid md:grid-cols-4 gap-6"
          >
            {portfolioApps.map((app, index) => (
              <div key={app.id} className="p-6 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg border border-purple-500">
                <app.icon className="w-12 h-12 mx-auto text-purple-400 mb-3" />
                <h3 className="text-lg font-semibold mb-2">{app.name}</h3>
                <p className="text-sm text-gray-300 mb-3">{app.tagline}</p>
                <span className={`text-xs px-2 py-1 rounded ${
                  app.status === 'live' ? 'bg-green-600' :
                  app.status === 'beta' ? 'bg-yellow-600' :
                  'bg-blue-600'
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </Card>

      {/* Portfolio Stats */}
      <Card>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-6 text-center">📊 Portfolio Statistieken</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-r from-blue-900 to-cyan-900 rounded-lg">
              <Brain className="w-12 h-12 mx-auto text-blue-400 mb-3" />
              <h4 className="font-semibold mb-2">Apps in Portfolio</h4>
              <p className="text-2xl font-bold">4</p>
              <p className="text-xs text-gray-400">Revolutionaire concepten</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg">
              <Clock className="w-12 h-12 mx-auto text-purple-400 mb-3" />
              <h4 className="font-semibold mb-2">Blueprinting Tijd</h4>
              <p className="text-2xl font-bold">21+ Maanden</p>
              <p className="text-xs text-gray-400">Gedetailleerde planning</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg">
              <Target className="w-12 h-12 mx-auto text-green-400 mb-3" />
              <h4 className="font-semibold mb-2">Target Markets</h4>
              <p className="text-2xl font-bold">15+</p>
              <p className="text-xs text-gray-400">Verschillende user types</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-pink-900 to-rose-900 rounded-lg">
              <TrendingUp className="w-12 h-12 mx-auto text-pink-400 mb-3" />
              <h4 className="font-semibold mb-2">Revenue Models</h4>
              <p className="text-2xl font-bold">4</p>
              <p className="text-xs text-gray-400">Diversified income</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Proof of Existence */}
      <Card>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-6 text-center">🔐 Proof of Existence Strategy</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg">
              <h4 className="font-semibold mb-3 text-purple-400">📱 App Completion</h4>
              <ul className="space-y-2 text-sm">
                <li>• Alle 4 apps volledig ontwikkeld</li>
                <li>• Functionaliteit getest en gevalideerd</li>
                <li>• User experience geoptimaliseerd</li>
                <li>• Performance benchmarks behaald</li>
              </ul>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-900 to-cyan-900 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-400">🔗 Codebase Hashing</h4>
              <ul className="space-y-2 text-sm">
                <li>• Complete codebase gehashed</li>
                <li>• SHA-256 hash gegenereerd</li>
                <li>• Timestamp en metadata toegevoegd</li>
                <li>• Immutable proof of creation</li>
              </ul>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg">
              <h4 className="font-semibold mb-3 text-green-400">📄 Proof of Existence</h4>
              <ul className="space-y-2 text-sm">
                <li>• Hash geüpload naar blockchain</li>
                <li>• Permanent timestamped record</li>
                <li>• Verifiable proof of ownership</li>
                <li>• Voor JointVenture onderhandelingen</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderDetailed = () => (
    <div className="space-y-6">
      {portfolioApps.map((app) => (
        <Card key={app.id} className="cursor-pointer hover:scale-105 transition-transform">
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <app.icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold">{app.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    app.status === 'live' ? 'bg-green-600' :
                    app.status === 'beta' ? 'bg-yellow-600' :
                    'bg-blue-600'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <p className="text-lg text-purple-400 mb-2">{app.tagline}</p>
                <p className="text-gray-300 text-sm">{app.description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-blue-400">🚀 Key Features</h4>
                <ul className="space-y-1 text-sm">
                  {app.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-green-400">💻 Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {app.techStack.map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-800 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="p-3 bg-gray-800 rounded">
                <h5 className="font-semibold text-sm mb-1">Target Users</h5>
                <p className="text-xs text-gray-300">{app.targetUsers.join(', ')}</p>
              </div>
              <div className="p-3 bg-gray-800 rounded">
                <h5 className="font-semibold text-sm mb-1">Revenue Model</h5>
                <p className="text-xs text-gray-300">{app.revenueModel}</p>
              </div>
              <div className="p-3 bg-gray-800 rounded">
                <h5 className="font-semibold text-sm mb-1">Development Time</h5>
                <p className="text-xs text-gray-300">{app.developmentTime}</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg">
              <h4 className="font-semibold mb-2 text-purple-400">💎 Unique Value Proposition</h4>
              <p className="text-sm text-gray-300">{app.uniqueValue}</p>
            </div>

            <div className="mt-4 p-3 bg-green-900 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold">{app.blueprintStatus}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderRoadmap = () => (
    <div className="space-y-8">
      {/* Development Timeline */}
      <Card>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-6 text-center">🗓️ Development Roadmap</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Phase 1: Central Hub (Month 1-2)</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• MyMindVentures Central Hub completion</li>
                  <li>• JointVenture showcase integration</li>
                  <li>• NFT co-ownership system</li>
                  <li>• Git management integration</li>
                  <li>• AI documentation workflow</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-900 to-cyan-900 rounded-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Phase 2: NeuroSphere (Month 3-6)</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• NeuroDiversity platform development</li>
                  <li>• Community features implementation</li>
                  <li>• Expert connection system</li>
                  <li>• Resource library creation</li>
                  <li>• Beta testing & feedback</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Network className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Phase 3: Nexio (Month 7-9)</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Hyperlocal community platform</li>
                  <li>• Geolocation matching system</li>
                  <li>• Trust & rating implementation</li>
                  <li>• Payment gateway integration</li>
                  <li>• Local community testing</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-pink-900 to-rose-900 rounded-lg">
              <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Phase 4: My2ndAIBrain (Month 10-15)</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Personal knowledge base development</li>
                  <li>• Pinecone & Neo4J integration</li>
                  <li>• Cross-platform co-pilot</li>
                  <li>• IoT & wearables connection</li>
                  <li>• Knowledge Graph rendering</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* JointVenture Preparation */}
      <Card>
        <div className="p-6">
          <h4 className="text-lg font-bold mb-4">🤝 JointVenture Preparation</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-800 rounded-lg">
              <h5 className="font-semibold mb-3 text-purple-400">📄 NFT Contract Preparation</h5>
              <ul className="space-y-2 text-sm">
                <li>• Smart contract development</li>
                <li>• Co-ownership terms definition</li>
                <li>• Revenue sharing mechanisms</li>
                <li>• Governance structure</li>
                <li>• Legal compliance review</li>
              </ul>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <h5 className="font-semibold mb-3 text-blue-400">✍️ Digital Signing Process</h5>
              <ul className="space-y-2 text-sm">
                <li>• Voorcontract digitalisering</li>
                <li>• E-signature integration</li>
                <li>• Multi-party signing workflow</li>
                <li>• Audit trail creation</li>
                <li>• Legal validity verification</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderProofOfExistence = () => (
    <div className="space-y-8">
      {/* Proof of Existence Process */}
      <Card>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-6 text-center">🔐 Proof of Existence Process</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">App Development Completion</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Alle 4 apps volledig ontwikkeld en getest</li>
                  <li>• Functionaliteit gevalideerd en geoptimaliseerd</li>
                  <li>• User experience geperfectioneerd</li>
                  <li>• Performance benchmarks behaald</li>
                  <li>• Security audit doorlopen</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-900 to-cyan-900 rounded-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Codebase Hashing</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Complete codebase gehashed met SHA-256</li>
                  <li>• Metadata toegevoegd (timestamp, version, author)</li>
                  <li>• Immutable proof of creation gegenereerd</li>
                  <li>• Hash geverifieerd en gevalideerd</li>
                  <li>• Backup van hash opgeslagen</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Blockchain Registration</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Hash geüpload naar Proof of Existence blockchain</li>
                  <li>• Permanent timestamped record gecreëerd</li>
                  <li>• Verifiable proof of ownership vastgelegd</li>
                  <li>• Transaction ID en block number opgeslagen</li>
                  <li>• Public verification mogelijk gemaakt</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-pink-900 to-rose-900 rounded-lg">
              <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <div>
                <h4 className="font-semibold mb-2">JointVenture Proposal</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• NFT Contract voorbereid met proof of existence</li>
                  <li>• Digitale ondertekening als voorcontract</li>
                  <li>• Persoonlijke meeting gepland</li>
                  <li>• Partnership terms onderhandeld</li>
                  <li>• Final agreement ondertekend</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Benefits of Proof of Existence */}
      <Card>
        <div className="p-6">
          <h4 className="text-lg font-bold mb-4">💎 Voordelen van Proof of Existence</h4>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg">
              <Shield className="w-12 h-12 mx-auto text-purple-400 mb-3" />
              <h5 className="font-semibold mb-2">Intellectual Property Protection</h5>
              <p className="text-sm text-gray-300">
                Permanent bewijs van creatie en ownership van je revolutionaire app concepten
              </p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-blue-900 to-cyan-900 rounded-lg">
              <TrendingUp className="w-12 h-12 mx-auto text-blue-400 mb-3" />
              <h5 className="font-semibold mb-2">Negotiation Power</h5>
              <p className="text-sm text-gray-300">
                Sterke positie in JointVenture onderhandelingen met concrete proof
              </p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg">
              <Star className="w-12 h-12 mx-auto text-green-400 mb-3" />
              <h5 className="font-semibold mb-2">Investor Confidence</h5>
              <p className="text-sm text-gray-300">
                Verhoogde geloofwaardigheid en vertrouwen van potentiële partners
              </p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">📱 Portfolio</h1>
          <p className="text-gray-400">4 revolutionaire apps - volledig gedetailleerd en klaar voor development</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'detailed', label: 'Detailed Apps', icon: Rocket },
            { id: 'roadmap', label: 'Development Roadmap', icon: Target },
            { id: 'proof-of-existence', label: 'Proof of Existence', icon: Shield }
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
          {selectedView === 'overview' && renderOverview()}
          {selectedView === 'detailed' && renderDetailed()}
          {selectedView === 'roadmap' && renderRoadmap()}
          {selectedView === 'proof-of-existence' && renderProofOfExistence()}
        </motion.div>
      </div>
    </div>
  );
};
