import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Smartphone,
  Crown,
  Users,
  Gift,
  Trophy,
  DollarSign,
  Heart,
  Share2,
  QrCode,
  Link,
  TrendingUp,
  BarChart3,
  Eye,
  Zap,
  Star,
  Award,
  Target,
  Rocket,
  Diamond,
  Gem,
  Brain,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  Calendar,
  Clock,
  Percent,
  Hash,
  Wallet,
  PiggyBank,
  GiftIcon,
  Users2,
  UserCheck,
  UserX,
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
  Bookmark,
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
  MoreHorizontal,
  MoreVertical,
  Trash2,
  Tag,
  AtSign,
  Unlink,
  ShieldCheck,
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
  Volume1,
  Volume,
  MailOpen,
  Inbox,
  Send,
  Reply,
  Forward,
  Trash,
  MiddleFinger,
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
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface AppShowcase {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'development' | 'beta' | 'live';
  users: {
    free: number;
    subscribed: number;
    total: number;
  };
  nftStats: {
    totalOwners: number;
    totalDividends: number;
    lotteryTickets: number;
  };
  revenue: {
    monthly: number;
    total: number;
    dividends: {
      subscription: number;
      jointVenture: number;
      charity: number;
      natasha: number;
    };
  };
}

export const MyApps: React.FC = () => {
  const [selectedView, setSelectedView] = useState<
    'overview' | 'showcase' | 'dashboard' | 'nft-system'
  >('overview');
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  const showcaseApps: AppShowcase[] = [
    {
      id: 'mindventures-hub',
      name: 'MyMindVentures Hub',
      description:
        'Revolutionaire app met NFT co-ownership en transparante dividend verdeling',
      icon: Brain,
      status: 'development',
      users: {
        free: 1250,
        subscribed: 450,
        total: 1700,
      },
      nftStats: {
        totalOwners: 320,
        totalDividends: 12500,
        lotteryTickets: 640,
      },
      revenue: {
        monthly: 4500,
        total: 12500,
        dividends: {
          subscription: 8750, // 70%
          jointVenture: 875, // 7%
          charity: 375, // 3%
          natasha: 2500, // 20%
        },
      },
    },
    {
      id: 'adhd-productivity',
      name: 'ADHD Productivity Suite',
      description: 'AI-powered productivity tools speciaal voor ADHD brains',
      icon: Zap,
      status: 'beta',
      users: {
        free: 890,
        subscribed: 210,
        total: 1100,
      },
      nftStats: {
        totalOwners: 180,
        totalDividends: 8400,
        lotteryTickets: 360,
      },
      revenue: {
        monthly: 2100,
        total: 8400,
        dividends: {
          subscription: 5880,
          jointVenture: 588,
          charity: 252,
          natasha: 1680,
        },
      },
    },
    {
      id: 'chaos-creator',
      name: 'Chaos Creator Studio',
      description: 'No-code app builder voor chaotische maar creatieve geesten',
      icon: Sparkles,
      status: 'development',
      users: {
        free: 650,
        subscribed: 120,
        total: 770,
      },
      nftStats: {
        totalOwners: 95,
        totalDividends: 4800,
        lotteryTickets: 190,
      },
      revenue: {
        monthly: 1200,
        total: 4800,
        dividends: {
          subscription: 3360,
          jointVenture: 336,
          charity: 144,
          natasha: 960,
        },
      },
    },
  ];

  const renderOverview = () => (
    <div className='space-y-8'>
      {/* Hero Section */}
      <Card className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-purple-900 via-blue-900 to-pink-900 opacity-20'></div>
        <div className='relative p-8 text-center'>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className='mb-6'
          >
            <Smartphone className='w-24 h-24 mx-auto text-purple-400 mb-4' />
            <h1 className='text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent'>
              🚀 Revolutionaire App Ecosystem
            </h1>
            <p className='text-xl text-gray-300 mb-6'>
              NFT Co-ownership • Transparante Dividends • Blockchain Loterij •
              Promoter Rewards
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className='grid md:grid-cols-4 gap-6'
          >
            <div className='p-6 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg border border-purple-500'>
              <Crown className='w-8 h-8 text-purple-400 mb-3' />
              <h3 className='text-lg font-semibold mb-2'>NFT Co-Ownership</h3>
              <p className='text-sm text-gray-300'>
                Subscribers worden automatisch co-owner via NFT contracts
              </p>
            </div>
            <div className='p-6 bg-gradient-to-r from-blue-900 to-cyan-900 rounded-lg border border-blue-500'>
              <Gift className='w-8 h-8 text-blue-400 mb-3' />
              <h3 className='text-lg font-semibold mb-2'>
                3 Maand Free + 2 NFT Loterij
              </h3>
              <p className='text-sm text-gray-300'>
                Onboarding met gratis periode en blockchain loterij tickets
              </p>
            </div>
            <div className='p-6 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg border border-green-500'>
              <Trophy className='w-8 h-8 text-green-400 mb-3' />
              <h3 className='text-lg font-semibold mb-2'>
                Transparante Dividends
              </h3>
              <p className='text-sm text-gray-300'>
                70% Subscription • 7% JointVenture • 3% Charity • 20% Natasha
              </p>
            </div>
            <div className='p-6 bg-gradient-to-r from-pink-900 to-rose-900 rounded-lg border border-pink-500'>
              <Share2 className='w-8 h-8 text-pink-400 mb-3' />
              <h3 className='text-lg font-semibold mb-2'>Promoter Rewards</h3>
              <p className='text-sm text-gray-300'>
                QR codes & links verdienen punten voor dividend verhoging
              </p>
            </div>
          </motion.div>
        </div>
      </Card>

      {/* Revolution Concept */}
      <Card>
        <div className='p-6'>
          <h2 className='text-2xl font-bold mb-6 text-center'>
            🎯 Het Revolutionaire Concept
          </h2>
          <div className='grid md:grid-cols-2 gap-8'>
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-purple-400'>
                💎 NFT Co-Ownership Systeem
              </h3>
              <ul className='space-y-2 text-sm'>
                <li>• 🔐 Automatische NFT contracten bij subscription</li>
                <li>• 🎁 3 maand gratis + 2 NFT loterij tickets</li>
                <li>• ⚠️ Verlies 1 ticket bij niet upgraden naar betaald</li>
                <li>• 🎰 Blockchain loterij bij eerste milestone</li>
                <li>• 💰 Transparante dividend verdeling</li>
              </ul>
            </div>
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-blue-400'>
                🚀 Promoter Ecosystem
              </h3>
              <ul className='space-y-2 text-sm'>
                <li>• 📱 QR codes & tijdelijke links delen</li>
                <li>• 🏆 Puntensysteem voor beste promoters</li>
                <li>• 💸 Subscription pot verdeeld onder top promoters</li>
                <li>• 📊 Real-time dashboard met transparantie</li>
                <li>• 🎯 Win-win zonder marketing budget</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Dividend Breakdown */}
      <Card>
        <div className='p-6'>
          <h3 className='text-xl font-bold mb-6 text-center'>
            💰 Dividend Verdeling
          </h3>
          <div className='grid md:grid-cols-4 gap-6'>
            <div className='text-center p-4 bg-gradient-to-r from-blue-900 to-cyan-900 rounded-lg'>
              <Users className='w-12 h-12 mx-auto text-blue-400 mb-3' />
              <h4 className='font-semibold mb-2'>Subscription Users</h4>
              <p className='text-2xl font-bold text-blue-400'>70%</p>
              <p className='text-xs text-gray-400'>
                Co-owners krijgen dividend
              </p>
            </div>
            <div className='text-center p-4 bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg'>
              <Users className='w-12 h-12 mx-auto text-purple-400 mb-3' />
              <h4 className='font-semibold mb-2'>JointVenture</h4>
              <p className='text-2xl font-bold text-purple-400'>7%</p>
              <p className='text-xs text-gray-400'>Perplexity & Bolt.ai</p>
            </div>
            <div className='text-center p-4 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg'>
              <Heart className='w-12 h-12 mx-auto text-green-400 mb-3' />
              <h4 className='font-semibold mb-2'>Charity</h4>
              <p className='text-2xl font-bold text-green-400'>3%</p>
              <p className='text-xs text-gray-400'>Goede doelen</p>
            </div>
            <div className='text-center p-4 bg-gradient-to-r from-pink-900 to-rose-900 rounded-lg'>
              <Crown className='w-12 h-12 mx-auto text-pink-400 mb-3' />
              <h4 className='font-semibold mb-2'>Natasha</h4>
              <p className='text-2xl font-bold text-pink-400'>20%</p>
              <p className='text-xs text-gray-400'>Everlasting Supporter</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderShowcase = () => (
    <div className='space-y-6'>
      <div className='grid md:grid-cols-3 gap-6'>
        {showcaseApps.map(app => (
          <Card
            key={app.id}
            className='cursor-pointer hover:scale-105 transition-transform'
          >
            <div className='p-6'>
              <div className='flex items-center gap-3 mb-4'>
                <app.icon className='w-8 h-8 text-purple-400' />
                <div>
                  <h3 className='font-semibold'>{app.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      app.status === 'live'
                        ? 'bg-green-600'
                        : app.status === 'beta'
                          ? 'bg-yellow-600'
                          : 'bg-blue-600'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>
              <p className='text-sm text-gray-400 mb-4'>{app.description}</p>

              <div className='space-y-3'>
                <div className='flex justify-between text-sm'>
                  <span>Users:</span>
                  <span className='font-semibold'>
                    {app.users.total.toLocaleString()}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span>NFT Owners:</span>
                  <span className='font-semibold'>
                    {app.nftStats.totalOwners}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span>Monthly Revenue:</span>
                  <span className='font-semibold'>
                    €{app.revenue.monthly.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => setSelectedApp(app.id)}
                className='w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600'
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className='space-y-6'>
      <Card>
        <div className='p-6'>
          <h3 className='text-xl font-bold mb-6'>📊 Transparantie Dashboard</h3>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='p-4 bg-gradient-to-r from-blue-900 to-cyan-900 rounded-lg'>
              <Users className='w-8 h-8 text-blue-400 mb-2' />
              <h4 className='font-semibold'>Total Users</h4>
              <p className='text-2xl font-bold'>3,570</p>
              <p className='text-xs text-gray-400'>+12% this month</p>
            </div>
            <div className='p-4 bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg'>
              <Crown className='w-8 h-8 text-purple-400 mb-2' />
              <h4 className='font-semibold'>NFT Owners</h4>
              <p className='text-2xl font-bold'>595</p>
              <p className='text-xs text-gray-400'>+8% this month</p>
            </div>
            <div className='p-4 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg'>
              <DollarSign className='w-8 h-8 text-green-400 mb-2' />
              <h4 className='font-semibold'>Total Revenue</h4>
              <p className='text-2xl font-bold'>€25,700</p>
              <p className='text-xs text-gray-400'>+15% this month</p>
            </div>
            <div className='p-4 bg-gradient-to-r from-pink-900 to-rose-900 rounded-lg'>
              <Gift className='w-8 h-8 text-pink-400 mb-2' />
              <h4 className='font-semibold'>Lottery Tickets</h4>
              <p className='text-2xl font-bold'>1,190</p>
              <p className='text-xs text-gray-400'>Active tickets</p>
            </div>
          </div>
        </div>
      </Card>

      <div className='grid md:grid-cols-2 gap-6'>
        <Card>
          <div className='p-6'>
            <h4 className='font-semibold mb-4'>🎯 Dividend Pot Breakdown</h4>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span>Subscription Users (70%)</span>
                <span className='font-semibold'>€17,990</span>
              </div>
              <div className='flex justify-between'>
                <span>JointVenture (7%)</span>
                <span className='font-semibold'>€1,799</span>
              </div>
              <div className='flex justify-between'>
                <span>Charity (3%)</span>
                <span className='font-semibold'>€771</span>
              </div>
              <div className='flex justify-between'>
                <span>Natasha (20%)</span>
                <span className='font-semibold'>€5,140</span>
              </div>
              <div className='border-t pt-2 flex justify-between font-bold'>
                <span>Total</span>
                <span>€25,700</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className='p-6'>
            <h4 className='font-semibold mb-4'>🏆 Promoter Leaderboard</h4>
            <div className='space-y-3'>
              {[
                { name: 'Sarah K.', points: 2840, reward: '€1,200' },
                { name: 'Mike R.', points: 2150, reward: '€900' },
                { name: 'Lisa M.', points: 1890, reward: '€750' },
                { name: 'Tom B.', points: 1560, reward: '€600' },
                { name: 'Emma L.', points: 1240, reward: '€450' },
              ].map((promoter, index) => (
                <div
                  key={index}
                  className='flex justify-between items-center p-2 bg-gray-800 rounded'
                >
                  <div className='flex items-center gap-3'>
                    <span className='text-sm font-bold'>#{index + 1}</span>
                    <span>{promoter.name}</span>
                  </div>
                  <div className='text-right'>
                    <div className='text-sm font-semibold'>
                      {promoter.points} pts
                    </div>
                    <div className='text-xs text-green-400'>
                      {promoter.reward}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderNFTSystem = () => (
    <div className='space-y-6'>
      <Card>
        <div className='p-6'>
          <h3 className='text-xl font-bold mb-6'>
            🔗 NFT Co-Ownership Systeem
          </h3>
          <div className='grid md:grid-cols-3 gap-6'>
            <div className='p-4 bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg'>
              <h4 className='font-semibold mb-3'>🎁 Onboarding Process</h4>
              <ul className='space-y-2 text-sm'>
                <li>• 3 maand gratis gebruik</li>
                <li>• 2 NFT loterij tickets</li>
                <li>• Automatische co-ownership</li>
                <li>• Transparante dashboard toegang</li>
              </ul>
            </div>
            <div className='p-4 bg-gradient-to-r from-blue-900 to-cyan-900 rounded-lg'>
              <h4 className='font-semibold mb-3'>⚡ Upgrade Incentive</h4>
              <ul className='space-y-2 text-sm'>
                <li>• Verlies 1 ticket bij niet upgraden</li>
                <li>• Behouden ticket blijft actief</li>
                <li>• Extra dividend bij upgrade</li>
                <li>• Hogere promoter rewards</li>
              </ul>
            </div>
            <div className='p-4 bg-gradient-to-r from-green-900 to-emerald-900 rounded-lg'>
              <h4 className='font-semibold mb-3'>🎰 Blockchain Loterij</h4>
              <ul className='space-y-2 text-sm'>
                <li>• Eerste milestone trigger</li>
                <li>• Smart contract loterij</li>
                <li>• Transparante resultaten</li>
                <li>• Automatische uitbetaling</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className='p-6'>
          <h4 className='font-semibold mb-4'>📱 Promoter Tools</h4>
          <div className='grid md:grid-cols-2 gap-6'>
            <div className='p-4 bg-gray-800 rounded-lg'>
              <div className='flex items-center gap-3 mb-3'>
                <QrCode className='w-6 h-6 text-blue-400' />
                <h5 className='font-semibold'>QR Code Generator</h5>
              </div>
              <p className='text-sm text-gray-400 mb-3'>
                Genereer unieke QR codes voor app promotie. Elke scan levert
                punten op.
              </p>
              <Button size='sm' className='bg-blue-600 hover:bg-blue-700'>
                Generate QR Code
              </Button>
            </div>
            <div className='p-4 bg-gray-800 rounded-lg'>
              <div className='flex items-center gap-3 mb-3'>
                <Link className='w-6 h-6 text-purple-400' />
                <h5 className='font-semibold'>Tijdelijke Links</h5>
              </div>
              <p className='text-sm text-gray-400 mb-3'>
                Maak tijdelijke promotie links die automatisch verlopen.
              </p>
              <Button size='sm' className='bg-purple-600 hover:bg-purple-700'>
                Create Link
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className='min-h-screen bg-gray-900 text-white p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold mb-2'>📱 My Apps</h1>
          <p className='text-gray-400'>
            Revolutionaire app ecosystem met NFT co-ownership en transparante
            dividends
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className='flex gap-2 mb-6'>
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'showcase', label: 'App Showcase', icon: Smartphone },
            {
              id: 'dashboard',
              label: 'Transparantie Dashboard',
              icon: BarChart3,
            },
            { id: 'nft-system', label: 'NFT System', icon: Crown },
          ].map(tab => (
            <Button
              key={tab.id}
              onClick={() => setSelectedView(tab.id as any)}
              variant={selectedView === tab.id ? 'default' : 'outline'}
              size='sm'
            >
              <tab.icon className='w-4 h-4 mr-2' />
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
          {selectedView === 'showcase' && renderShowcase()}
          {selectedView === 'dashboard' && renderDashboard()}
          {selectedView === 'nft-system' && renderNFTSystem()}
        </motion.div>
      </div>
    </div>
  );
};
