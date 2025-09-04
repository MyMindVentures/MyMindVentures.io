import { useState } from 'react';
import {
  PartnershipBenefit,
  PartnershipPhase,
  RoadmapMilestone,
  ValueProposition,
} from '../types';

export const useJointVentureData = () => {
  const [selectedView, setSelectedView] = useState<
    'pitch' | 'value-proposition' | 'partnership-model' | 'roadmap'
  >('pitch');

  const partnershipBenefits: PartnershipBenefit[] = [
    {
      title: 'Shared Resources',
      description: 'Pool development resources, expertise, and infrastructure',
      icon: '🤝',
    },
    {
      title: 'Risk Mitigation',
      description: 'Distribute financial and technical risks across partners',
      icon: '🛡️',
    },
    {
      title: 'Market Access',
      description:
        "Leverage each partner's existing customer base and networks",
      icon: '🌐',
    },
    {
      title: 'Innovation Boost',
      description:
        'Combine different perspectives and technologies for breakthrough solutions',
      icon: '💡',
    },
  ];

  const partnershipPhases: PartnershipPhase[] = [
    {
      phase: 'Phase 1: Foundation',
      duration: 'Months 1-3',
      description: 'Establish partnership framework and initial collaboration',
      deliverables: [
        'Partnership agreement and legal framework',
        'Shared development environment setup',
        'Initial team integration and communication protocols',
        'Joint project roadmap and milestone definition',
      ],
    },
    {
      phase: 'Phase 2: Development',
      duration: 'Months 4-12',
      description: 'Active development and integration of joint solutions',
      deliverables: [
        'Core platform development and integration',
        'Shared API development and documentation',
        'Cross-platform compatibility testing',
        'User acceptance testing and feedback integration',
      ],
    },
    {
      phase: 'Phase 3: Launch',
      duration: 'Months 13-18',
      description: 'Market launch and initial customer acquisition',
      deliverables: [
        'Public beta launch and user onboarding',
        'Marketing campaign and brand positioning',
        'Customer support and feedback systems',
        'Performance monitoring and optimization',
      ],
    },
    {
      phase: 'Phase 4: Scale',
      duration: 'Months 19+',
      description: 'Scaling operations and expanding market reach',
      deliverables: [
        'Advanced feature development and AI integration',
        'International market expansion',
        'Strategic partnerships and integrations',
        'Revenue optimization and business model refinement',
      ],
    },
  ];

  const roadmapMilestones: RoadmapMilestone[] = [
    {
      quarter: 'Q1 2025',
      title: 'Partnership Formation',
      description:
        'Establish legal framework and initial collaboration protocols',
      status: 'completed',
    },
    {
      quarter: 'Q2 2025',
      title: 'Platform Development',
      description: 'Core platform development and API integration',
      status: 'in-progress',
    },
    {
      quarter: 'Q3 2025',
      title: 'Beta Launch',
      description: 'Public beta launch with select customer base',
      status: 'planned',
    },
    {
      quarter: 'Q4 2025',
      title: 'Full Launch',
      description: 'Full market launch with comprehensive feature set',
      status: 'planned',
    },
    {
      quarter: 'Q1 2026',
      title: 'AI Integration',
      description: 'Advanced AI features and automation capabilities',
      status: 'planned',
    },
    {
      quarter: 'Q2 2026',
      title: 'Market Expansion',
      description: 'International expansion and strategic partnerships',
      status: 'planned',
    },
  ];

  const valuePropositions: ValueProposition[] = [
    {
      title: 'Revolutionary Technology Stack',
      description: 'Cutting-edge AI, blockchain, and cloud technologies',
      benefits: [
        'Advanced AI-powered automation',
        'Blockchain-based security and transparency',
        'Scalable cloud infrastructure',
        'Real-time data processing and analytics',
      ],
      icon: '🚀',
    },
    {
      title: 'Market-Ready Solutions',
      description:
        '4 fully developed app concepts ready for immediate development',
      benefits: [
        'Comprehensive market research completed',
        'Technical specifications defined',
        'User experience designs finalized',
        'Development roadmap established',
      ],
      icon: '📱',
    },
    {
      title: 'Proven Development Expertise',
      description: 'Experienced team with track record of successful launches',
      benefits: [
        'Full-stack development capabilities',
        'Agile development methodology',
        'Quality assurance and testing expertise',
        'DevOps and deployment experience',
      ],
      icon: '👨‍💻',
    },
    {
      title: 'Strategic Market Position',
      description: 'Unique positioning in high-growth technology markets',
      benefits: [
        'First-mover advantage in emerging sectors',
        'Strong intellectual property portfolio',
        'Scalable business models',
        'Multiple revenue streams',
      ],
      icon: '🎯',
    },
  ];

  return {
    selectedView,
    setSelectedView,
    partnershipBenefits,
    partnershipPhases,
    roadmapMilestones,
    valuePropositions,
  };
};
