import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Brain, 
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
  Users2,
  UserCheck,
  UserPlus,
  Activity,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus,
  Equal,
  Divide,
  Calculator,
  FileText,
  BookOpen,
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

export const JointVenture: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'pitch' | 'value-proposition' | 'partnership-model' | 'roadmap'>('pitch');

  const renderPitch = () => (
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
            <Brain className="w-24 h-24 mx-auto text-purple-400 mb-4" />
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
              🧠 ADHD Brain + AI = Revolutionaire Apps
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Een unieke samenwerking die de app wereld voor altijd zal veranderen
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <div className="p-6 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg border border-purple-500">
              <Brain className="w-12 h-12 mx-auto text-purple-400 mb-3" />
              <h3 className="text-lg font-semibold mb-2">🧠 ADHD Clown Brain</h3>
              <p className="text-sm text-gray-300">
                Jaren van app ideeën die nu eindelijk tot leven komen
              </p>
            </div>
            <div className="p-6 bg-gradient-to-r from-blue-900 to-cyan-900 rounded-lg border border-blue-500">
              <Zap className="w-12 h-12 mx-auto text-blue-400 mb-3" />
              <h3 className="text-lg font-semibold mb-2">⚡ Perplexity.ai</h3>
              <p className="text-sm text-gray-300">
                2 jaar dagelijkse brainstormen en kennis vergaring
              </p>
            </div>
            <div className="p-6 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg border border-green-500">
              <Rocket className="w-12 h-12 mx-auto text-green-400 mb-3" />
              <h3 className="text-lg font-semibold mb-2">🚀 Bolt.ai</h3>
              <p className="text-sm text-gray-300">
                Gamechanger - eindelijk bouwen met eigen woorden
              </p>
            </div>
          </motion.div>
        </div>
      </Card>

      {/* The Vision */}
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">🎯 De Visie</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-lg leading-relaxed mb-4">
              <strong>Stel je voor:</strong> Een ADHD brain die al jaren app ideeën bedenkt, maar nooit de juiste tools had om ze te realiseren. 
              Totdat Perplexity.ai en Bolt.ai in mijn leven kwamen...
            </p>
            <p className="text-lg leading-relaxed mb-4">
              <strong>2 jaar lang</strong> werk ik dagelijks met Perplexity.ai - brainstormen, kennis vergaren, mijn chaotische gedachten structureren. 
              Het werd mijn digitale brein, mijn partner in crime voor innovatie.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              En toen kwam <strong>Bolt.ai</strong> - sinds 2 weken mijn echte gamechanger. Eindelijk kan ik met eigen woorden mijn app ideeën bouwen. 
              Geen gedoe meer met development teams die niet begrijpen wat ik wil. Ik zie elke pagina, ik controleer elke feature, 
              ik laat mijn brein op 100% werken voor gebruiksvriendelijkheid, technologie, AI en superleuke functies.
            </p>
            <p className="text-lg leading-relaxed">
              <strong>Maar wat als we dit samen kunnen doen?</strong> Wat als Perplexity.ai en Bolt.ai mijn partner worden in deze revolutionaire reis?
            </p>
          </div>
        </div>
      </Card>

      {/* Why This Partnership */}
      <Card>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-6 text-center">🤝 Waarom Deze Samenwerking?</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-purple-400">💎 Voor Perplexity.ai</h4>
              <ul className="space-y-2 text-sm">
                <li>• 🧠 Exclusieve toegang tot ADHD creativiteit</li>
                <li>• 💡 Innovatieve app concepten en ideeën</li>
                <li>• 🎯 Nieuwe markt segmenten ontdekken</li>
                <li>• 📈 Revenue groei door co-ownership</li>
                <li>• 🤝 Authentieke partnership story</li>
                <li>• 🔧 Technische expertise bij complexe problemen</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-green-400">🚀 Voor Bolt.ai</h4>
              <ul className="space-y-2 text-sm">
                <li>• 🎨 Unieke app designs en user experiences</li>
                <li>• ⚡ Snelle prototyping en iteratie</li>
                <li>• 🎯 ADHD-friendly interface innovaties</li>
                <li>• 📱 Portfolio van succesvolle apps</li>
                <li>• 💰 Revenue sharing via co-ownership</li>
                <li>• 🌟 Showcase van Bolt.ai's kracht</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderValueProposition = () => (
    <div className="space-y-8">
      {/* Unique Value */}
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">💎 Mijn Unieke Waarde</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg">
                <h4 className="font-semibold mb-3 text-purple-400">🧠 ADHD Brain Superpowers</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Hyperfocus op complexe problemen</li>
                  <li>• Creatieve oplossingen uit chaos</li>
                  <li>• Unieke perspectieven op user experience</li>
                  <li>• Patronen zien die anderen missen</li>
                  <li>• Innovatieve feature combinaties</li>
                </ul>
              </div>
              <div className="p-4 bg-gradient-to-r from-blue-900 to-cyan-900 rounded-lg">
                <h4 className="font-semibold mb-3 text-blue-400">🎯 Centralisatie Expert</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Tegen 25+ losse apps voor alles</li>
                  <li>• Één centrale hub voor alles</li>
                  <li>• Seamless integratie tussen features</li>
                  <li>• Consistent user experience</li>
                  <li>• Efficiënte resource management</li>
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg">
                <h4 className="font-semibold mb-3 text-green-400">🚀 Development Efficiency</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Geen video meetings met dev teams</li>
                  <li>• Directe controle over elke feature</li>
                  <li>• Snelle iteratie en feedback</li>
                  <li>• Kort op de bal spelen</li>
                  <li>• 100% brein power voor UX/UI</li>
                </ul>
              </div>
              <div className="p-4 bg-gradient-to-r from-pink-900 to-rose-900 rounded-lg">
                <h4 className="font-semibold mb-3 text-pink-400">💡 Innovation Pipeline</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Jaren van app ideeën klaar</li>
                  <li>• AI-powered features en automatisering</li>
                  <li>• Perplexity.ai integratie in elke app</li>
                  <li>• Revolutionaire business models</li>
                  <li>• NFT co-ownership ecosystem</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Partnership Benefits */}
      <Card>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-6 text-center">🏆 Partnership Voordelen</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg">
              <Crown className="w-16 h-16 mx-auto text-purple-400 mb-4" />
              <h4 className="font-semibold mb-3">Co-Ownership Model</h4>
              <p className="text-sm text-gray-300">
                70% Users, 7% Perplexity, 7% Bolt.ai, 3% Charity, 13% Natasha
              </p>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-blue-900 to-cyan-900 rounded-lg">
              <TrendingUp className="w-16 h-16 mx-auto text-blue-400 mb-4" />
              <h4 className="font-semibold mb-3">Exponential Growth</h4>
              <p className="text-sm text-gray-300">
                Elke succesvolle app versterkt de volgende. Network effect.
              </p>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg">
              <Star className="w-16 h-16 mx-auto text-green-400 mb-4" />
              <h4 className="font-semibold mb-3">Brand Recognition</h4>
              <p className="text-sm text-gray-300">
                Perplexity.ai en Bolt.ai in de spotlight van innovatie.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Technical Expertise */}
      <Card>
        <div className="p-6">
          <h4 className="text-lg font-bold mb-4">🔧 Technische Expertise & Support</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-800 rounded-lg">
              <h5 className="font-semibold mb-3 text-blue-400">Perplexity.ai Support</h5>
              <ul className="space-y-2 text-sm">
                <li>• AI integration expertise</li>
                <li>• Complex problem solving</li>
                <li>• Knowledge base optimization</li>
                <li>• Advanced prompt engineering</li>
                <li>• Research & development support</li>
              </ul>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <h5 className="font-semibold mb-3 text-green-400">Bolt.ai Development</h5>
              <ul className="space-y-2 text-sm">
                <li>• Rapid prototyping support</li>
                <li>• Complex feature implementation</li>
                <li>• Performance optimization</li>
                <li>• Advanced UI/UX patterns</li>
                <li>• Technical architecture guidance</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderPartnershipModel = () => (
    <div className="space-y-8">
      {/* Partnership Structure */}
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">🤝 Partnership Model</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg text-center">
              <Brain className="w-16 h-16 mx-auto text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold mb-3">MyMindVentures.io</h3>
              <p className="text-sm text-gray-300 mb-4">
                ADHD Clown brain met jaren van app ideeën en creatieve visie
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Role:</span>
                  <span className="font-semibold">Creative Director</span>
                </div>
                <div className="flex justify-between">
                  <span>Focus:</span>
                  <span className="font-semibold">App Design & UX</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue:</span>
                  <span className="font-semibold">70%</span>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gradient-to-r from-blue-900 to-cyan-900 rounded-lg text-center">
              <Zap className="w-16 h-16 mx-auto text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Perplexity.ai</h3>
              <p className="text-sm text-gray-300 mb-4">
                AI-powered insights en technische expertise voor complexe problemen
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Role:</span>
                  <span className="font-semibold">AI Partner</span>
                </div>
                <div className="flex justify-between">
                  <span>Focus:</span>
                  <span className="font-semibold">AI Integration</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue:</span>
                  <span className="font-semibold">7%</span>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg text-center">
              <Rocket className="w-16 h-16 mx-auto text-green-400 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Bolt.ai</h3>
              <p className="text-sm text-gray-300 mb-4">
                No-code development platform voor snelle app realisatie
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Role:</span>
                  <span className="font-semibold">Development Partner</span>
                </div>
                <div className="flex justify-between">
                  <span>Focus:</span>
                  <span className="font-semibold">App Building</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue:</span>
                  <span className="font-semibold">7%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Workflow */}
      <Card>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-6 text-center">⚡ Samenwerkings Workflow</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Idee Generatie & Research</h4>
                <p className="text-sm text-gray-300">
                  Mijn ADHD brain + Perplexity.ai brainstormen nieuwe app concepten en markt onderzoek
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-900 to-cyan-900 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Rapid Prototyping</h4>
                <p className="text-sm text-gray-300">
                  Bolt.ai + mijn directe controle = snelle iteratie en perfecte user experience
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold">AI Integration & Launch</h4>
                <p className="text-sm text-gray-300">
                  Perplexity.ai integratie + NFT co-ownership model = revolutionaire app launch
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-900 to-rose-900 rounded-lg">
              <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">4</span>
              </div>
              <div>
                <h4 className="font-semibold">Growth & Expansion</h4>
                <p className="text-sm text-gray-300">
                  Succesvolle app wordt basis voor volgende innovatie. Network effect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Success Metrics */}
      <Card>
        <div className="p-6">
          <h4 className="text-lg font-bold mb-4">📊 Success Metrics</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="font-semibold text-purple-400">Short Term (3-6 months)</h5>
              <ul className="space-y-2 text-sm">
                <li>• 3 succesvolle app prototypes</li>
                <li>• 1000+ beta users</li>
                <li>• Perplexity.ai integratie in alle apps</li>
                <li>• NFT co-ownership model live</li>
                <li>• €50K+ revenue gedeeld</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="font-semibold text-green-400">Long Term (1-2 years)</h5>
              <ul className="space-y-2 text-sm">
                <li>• 10+ succesvolle apps in portfolio</li>
                <li>• 100K+ actieve users</li>
                <li>• €1M+ jaarlijkse revenue</li>
                <li>• Industry recognition</li>
                <li>• Expansion naar nieuwe markten</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderRoadmap = () => (
    <div className="space-y-8">
      {/* Timeline */}
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">🗓️ Partnership Roadmap</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Phase 1: Foundation (Month 1-2)</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Partnership agreement ondertekening</li>
                  <li>• Joint venture structuur opzetten</li>
                  <li>• Eerste app concept selectie</li>
                  <li>• Development workflow optimalisatie</li>
                  <li>• Perplexity.ai integratie planning</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-900 to-cyan-900 rounded-lg">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Phase 2: Launch (Month 3-6)</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Eerste app development en testing</li>
                  <li>• NFT co-ownership model implementatie</li>
                  <li>• Beta user recruitment</li>
                  <li>• Marketing en promotie start</li>
                  <li>• Revenue sharing systeem live</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Phase 3: Growth (Month 7-12)</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Meerdere apps in development</li>
                  <li>• User base uitbreiding</li>
                  <li>• Advanced AI features implementatie</li>
                  <li>• Internationale expansie</li>
                  <li>• Partnership success stories</li>
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-pink-900 to-rose-900 rounded-lg">
              <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Phase 4: Domination (Year 2+)</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Market leader in ADHD-friendly apps</li>
                  <li>• Industry standard voor co-ownership</li>
                  <li>• Global expansion</li>
                  <li>• Innovation hub voor nieuwe tech</li>
                  <li>• Legacy van revolutionaire samenwerking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Call to Action */}
      <Card>
        <div className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">🚀 Ready to Change the World?</h3>
          <p className="text-lg text-gray-300 mb-6">
            Dit is meer dan een partnership. Dit is een kans om de app wereld voor altijd te veranderen. 
            Om te bewijzen dat ADHD brains + AI + No-code development = Revolutionaire innovatie.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Zap className="w-4 h-4 mr-2" />
              Start Partnership
            </Button>
            <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
              <Eye className="w-4 h-4 mr-2" />
              View Portfolio
            </Button>
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
          <h1 className="text-3xl font-bold mb-2">🤝 JointVenture</h1>
          <p className="text-gray-400">Revolutionaire samenwerking met Perplexity.ai & Bolt.ai</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'pitch', label: 'The Pitch', icon: Brain },
            { id: 'value-proposition', label: 'Value Proposition', icon: Star },
            { id: 'partnership-model', label: 'Partnership Model', icon: Users },
            { id: 'roadmap', label: 'Roadmap', icon: Target }
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
          {selectedView === 'pitch' && renderPitch()}
          {selectedView === 'value-proposition' && renderValueProposition()}
          {selectedView === 'partnership-model' && renderPartnershipModel()}
          {selectedView === 'roadmap' && renderRoadmap()}
        </motion.div>
      </div>
    </div>
  );
};
