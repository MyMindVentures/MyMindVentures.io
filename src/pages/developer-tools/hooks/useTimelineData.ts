import { useState, useEffect } from 'react';

export interface TimelineUpdate {
  id: string;
  version: string;
  version_name: string;
  release_date: string;
  status: 'released' | 'beta' | 'planned';
  category: string;
  changelog: string;
  features: string[];
  improvements: string[];
  fixes: string[];
  impact_score: number;
  user_feedback: number;
  downloads: number;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  quarter: string;
  status: 'planned' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  category: string;
  estimated_completion: string;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'beta' | 'planned';
  usage_stats: number;
  user_rating: number;
  last_updated: string;
}

export const useTimelineData = () => {
  const [timelineData, setTimelineData] = useState<TimelineUpdate[]>([]);
  const [roadmapData, setRoadmapData] = useState<RoadmapItem[]>([]);
  const [featuresData, setFeaturesData] = useState<Feature[]>([]);

  useEffect(() => {
    // Mock data - in real app this would come from API
    const mockTimelineData: TimelineUpdate[] = [
      {
        id: '1',
        version: '2.1.0',
        version_name: 'AI Enhancement Update',
        release_date: '2024-01-15',
        status: 'released',
        category: 'AI Features',
        changelog:
          'Enhanced AI capabilities with improved accuracy and new features',
        features: [
          'Advanced AI analysis',
          'Smart recommendations',
          'Auto-optimization',
        ],
        improvements: [
          'Performance boost',
          'Better UI/UX',
          'Enhanced security',
        ],
        fixes: ['Bug fixes', 'Stability improvements'],
        impact_score: 9.2,
        user_feedback: 4.8,
        downloads: 15420,
      },
      {
        id: '2',
        version: '2.0.5',
        version_name: 'Performance Update',
        release_date: '2024-01-01',
        status: 'released',
        category: 'Performance',
        changelog: 'Major performance improvements and bug fixes',
        features: ['Faster loading', 'Optimized algorithms'],
        improvements: ['50% faster load times', 'Reduced memory usage'],
        fixes: ['Critical bug fixes', 'Stability improvements'],
        impact_score: 8.7,
        user_feedback: 4.6,
        downloads: 12850,
      },
    ];

    const mockRoadmapData: RoadmapItem[] = [
      {
        id: '1',
        title: 'Advanced Analytics Dashboard',
        description: 'Comprehensive analytics with real-time insights',
        quarter: 'Q1 2024',
        status: 'in-progress',
        priority: 'high',
        category: 'Analytics',
        estimated_completion: '2024-03-31',
      },
      {
        id: '2',
        title: 'Mobile App',
        description: 'Native mobile application for iOS and Android',
        quarter: 'Q2 2024',
        status: 'planned',
        priority: 'high',
        category: 'Mobile',
        estimated_completion: '2024-06-30',
      },
    ];

    const mockFeaturesData: Feature[] = [
      {
        id: '1',
        name: 'AI Analysis',
        description: 'Advanced AI-powered analysis tools',
        category: 'AI',
        status: 'active',
        usage_stats: 85,
        user_rating: 4.8,
        last_updated: '2024-01-15',
      },
      {
        id: '2',
        name: 'Real-time Collaboration',
        description: 'Live collaboration features for teams',
        category: 'Collaboration',
        status: 'beta',
        usage_stats: 45,
        user_rating: 4.2,
        last_updated: '2024-01-10',
      },
    ];

    setTimelineData(mockTimelineData);
    setRoadmapData(mockRoadmapData);
    setFeaturesData(mockFeaturesData);
  }, []);

  return {
    timelineData,
    roadmapData,
    featuresData,
  };
};
