import React from 'react';

export interface AppPortfolio {
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

export type PortfolioView =
  | 'overview'
  | 'detailed'
  | 'roadmap'
  | 'proof-of-existence';

export interface PortfolioStats {
  totalApps: number;
  blueprintingTime: string;
  targetMarkets: number;
  revenueModels: number;
}

export interface DevelopmentPhase {
  id: string;
  title: string;
  duration: string;
  description: string;
  features: string[];
  icon: React.ComponentType<any>;
  color: string;
}

export interface ProofOfExistenceStep {
  id: number;
  title: string;
  description: string;
  features: string[];
  color: string;
}
