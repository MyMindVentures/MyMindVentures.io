import { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  Network,
  Database,
  Calendar,
  Rocket,
  CheckCircle,
} from 'lucide-react';
import {
  AppPortfolio,
  PortfolioStats,
  DevelopmentPhase,
  ProofOfExistenceStep,
} from '../types';

export const usePortfolioData = () => {
  const [portfolioApps, setPortfolioApps] = useState<AppPortfolio[]>([]);
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats | null>(
    null
  );
  const [developmentPhases, setDevelopmentPhases] = useState<
    DevelopmentPhase[]
  >([]);
  const [proofOfExistenceSteps, setProofOfExistenceSteps] = useState<
    ProofOfExistenceStep[]
  >([]);

  useEffect(() => {
    // Portfolio Apps Data
    const apps: AppPortfolio[] = [
      {
        id: 'central-hub',
        name: 'MyMindVentures Central Hub',
        tagline: 'Complete ecosystem voor iedereen',
        description:
          'Revolutionaire centrale hub met je verhaal, interactieve timeline/roadmap, portfolio van te lanceren apps, app ecosysteem met co-ownership, transparantie, AI geautomatiseerde flow voor documentatie, geïntegreerde Git voor tijdens de bouw en alle andere versies.',
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
          'NFT co-ownership system',
        ],
        techStack: [
          'React',
          'TypeScript',
          'Supabase',
          'OpenAI API',
          'Git API',
          'Framer Motion',
        ],
        targetUsers: ['Investors', 'Partners', 'Users', 'Developers'],
        revenueModel:
          'NFT Co-ownership (70% Users, 7% Perplexity, 7% Bolt.ai, 3% Charity, 13% Natasha)',
        uniqueValue:
          'Complete ecosystem dat alle andere apps verbindt en showcase',
        developmentTime: '3 maanden blueprinting + 2 weken development',
        blueprintStatus: '✅ Volledig gedetailleerd blueprint klaar',
      },
      {
        id: 'neurosphere',
        name: 'NeuroSphere',
        tagline: 'Compleet platform voor NeuroDiversity',
        description:
          'Revolutionair platform dat alles over NeuroDiversity centraliseert - van ADHD tot autisme, van tools tot community, van educatie tot support. Een complete hub voor neurodivergenten en hun supporters.',
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
          'Peer support network',
        ],
        techStack: [
          'React Native',
          'Supabase',
          'OpenAI API',
          'Pinecone',
          'Neo4J',
        ],
        targetUsers: [
          'Neurodivergenten',
          'Families',
          'Healthcare professionals',
          'Educators',
        ],
        revenueModel: 'Freemium + Premium subscriptions + Expert marketplace',
        uniqueValue:
          'Eerste complete platform specifiek voor alle vormen van NeuroDiversity',
        developmentTime: '6 maanden blueprinting + 4 maanden development',
        blueprintStatus: '✅ Volledig gedetailleerd blueprint klaar',
      },
      {
        id: 'nexio',
        name: 'Nexio',
        tagline: 'Verbinden binnen 10km radius',
        description:
          'Revolutionaire app die iedereen in een straal van 10km met elkaar verbindt om zo om het even wat te supporten. Vrager/Aanbod systeem: Gereedschap lenen, babysitten zoeken, klusjes helpen, sportbuddy vinden, en meer.',
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
          'Real-time notifications',
        ],
        techStack: [
          'React Native',
          'Supabase',
          'Geolocation API',
          'Push notifications',
          'Payment gateway',
        ],
        targetUsers: [
          'Lokale communities',
          'Jonge ouders',
          'DIY enthusiasts',
          'Sporters',
          'Studenten',
        ],
        revenueModel: 'Freemium + Premium features + Service fees',
        uniqueValue:
          'Eerste app die hyperlocal community support systematiseert',
        developmentTime: '4 maanden blueprinting + 3 maanden development',
        blueprintStatus: '✅ Volledig gedetailleerd blueprint klaar',
      },
      {
        id: 'my2nd-ai-brain',
        name: 'My2ndAIBrain',
        tagline: 'Baanbrekende personal knowledge base',
        description:
          'Revolutionaire app die data & binary data in je eigen knowledge base zet met Pinecone & Neo4J. Alles te uploaden en retrieven met AI Chatbot. Nooit meer data verspreid en niet gelinkt aan binary data. Co-pilot cross-platform overal en eender wanneer met je mee.',
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
          'Secure data storage',
        ],
        techStack: [
          'React Native',
          'Pinecone',
          'Neo4J',
          'OpenAI API',
          'IoT APIs',
          'GraphQL',
        ],
        targetUsers: [
          'Knowledge workers',
          'Researchers',
          'Students',
          'Professionals',
          'IoT enthusiasts',
        ],
        revenueModel: 'Subscription tiers + Enterprise licensing',
        uniqueValue:
          'Eerste personal AI brain die alle data centraliseert en cross-platform beschikbaar maakt',
        developmentTime: '8 maanden blueprinting + 6 maanden development',
        blueprintStatus: '✅ Volledig gedetailleerd blueprint klaar',
      },
    ];

    // Portfolio Stats
    const stats: PortfolioStats = {
      totalApps: 4,
      blueprintingTime: '21+ Maanden',
      targetMarkets: 15,
      revenueModels: 4,
    };

    // Development Phases
    const phases: DevelopmentPhase[] = [
      {
        id: 'phase-1',
        title: 'Phase 1: Central Hub (Month 1-2)',
        duration: 'Month 1-2',
        description: 'MyMindVentures Central Hub completion',
        features: [
          'MyMindVentures Central Hub completion',
          'JointVenture showcase integration',
          'NFT co-ownership system',
          'Git management integration',
          'AI documentation workflow',
        ],
        icon: Calendar,
        color: 'from-purple-900 to-blue-900',
      },
      {
        id: 'phase-2',
        title: 'Phase 2: NeuroSphere (Month 3-6)',
        duration: 'Month 3-6',
        description: 'NeuroDiversity platform development',
        features: [
          'NeuroDiversity platform development',
          'Community features implementation',
          'Expert connection system',
          'Resource library creation',
          'Beta testing & feedback',
        ],
        icon: Rocket,
        color: 'from-blue-900 to-cyan-900',
      },
      {
        id: 'phase-3',
        title: 'Phase 3: Nexio (Month 7-9)',
        duration: 'Month 7-9',
        description: 'Hyperlocal community platform',
        features: [
          'Hyperlocal community platform',
          'Geolocation matching system',
          'Trust & rating implementation',
          'Payment gateway integration',
          'Local community testing',
        ],
        icon: Network,
        color: 'from-green-900 to-emerald-900',
      },
      {
        id: 'phase-4',
        title: 'Phase 4: My2ndAIBrain (Month 10-15)',
        duration: 'Month 10-15',
        description: 'Personal knowledge base development',
        features: [
          'Personal knowledge base development',
          'Pinecone & Neo4J integration',
          'Cross-platform co-pilot',
          'IoT & wearables connection',
          'Knowledge Graph rendering',
        ],
        icon: Database,
        color: 'from-pink-900 to-rose-900',
      },
    ];

    // Proof of Existence Steps
    const steps: ProofOfExistenceStep[] = [
      {
        id: 1,
        title: 'App Development Completion',
        description: 'Alle 4 apps volledig ontwikkeld en getest',
        features: [
          'Alle 4 apps volledig ontwikkeld en getest',
          'Functionaliteit gevalideerd en geoptimaliseerd',
          'User experience geperfectioneerd',
          'Performance benchmarks behaald',
          'Security audit doorlopen',
        ],
        color: 'from-purple-900 to-blue-900',
      },
      {
        id: 2,
        title: 'Codebase Hashing',
        description: 'Complete codebase gehashed met SHA-256',
        features: [
          'Complete codebase gehashed met SHA-256',
          'Metadata toegevoegd (timestamp, version, author)',
          'Immutable proof of creation gegenereerd',
          'Hash geverifieerd en gevalideerd',
          'Backup van hash opgeslagen',
        ],
        color: 'from-blue-900 to-cyan-900',
      },
      {
        id: 3,
        title: 'Blockchain Registration',
        description: 'Hash geüpload naar Proof of Existence blockchain',
        features: [
          'Hash geüpload naar Proof of Existence blockchain',
          'Permanent timestamped record gecreëerd',
          'Verifiable proof of ownership vastgelegd',
          'Transaction ID en block number opgeslagen',
          'Public verification mogelijk gemaakt',
        ],
        color: 'from-green-900 to-emerald-900',
      },
      {
        id: 4,
        title: 'JointVenture Proposal',
        description: 'NFT Contract voorbereid met proof of existence',
        features: [
          'NFT Contract voorbereid met proof of existence',
          'Digitale ondertekening als voorcontract',
          'Persoonlijke meeting gepland',
          'Partnership terms onderhandeld',
          'Final agreement ondertekend',
        ],
        color: 'from-pink-900 to-rose-900',
      },
    ];

    setPortfolioApps(apps);
    setPortfolioStats(stats);
    setDevelopmentPhases(phases);
    setProofOfExistenceSteps(steps);
  }, []);

  return {
    portfolioApps,
    portfolioStats,
    developmentPhases,
    proofOfExistenceSteps,
  };
};
