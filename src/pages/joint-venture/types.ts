export type ViewType =
  | 'pitch'
  | 'value-proposition'
  | 'partnership-model'
  | 'roadmap';

export interface PartnershipBenefit {
  title: string;
  description: string;
  icon: string;
}

export interface PartnershipPhase {
  phase: string;
  duration: string;
  description: string;
  deliverables: string[];
}

export interface RoadmapMilestone {
  quarter: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
}

export interface ValueProposition {
  title: string;
  description: string;
  benefits: string[];
  icon: string;
}
