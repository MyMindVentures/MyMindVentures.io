export interface PitchContent {
  id: string;
  section_type: string;
  title: string;
  content: string;
  metadata: any;
  version: string;
  generated_by_ai: boolean;
  last_updated: string;
}

export interface RecoveryDoc {
  id: string;
  timestamp: string;
  analysis_summary: string;
  files_analyzed: number;
}

export interface PitchDemoProps {
  onNavigate?: (page: string) => void;
}

export interface Feature {
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  color: string;
  stats: string;
}

export interface Stat {
  label: string;
  value: string;
  icon: any;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}
