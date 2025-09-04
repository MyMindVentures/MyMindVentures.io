export interface AIContext {
  ide: 'bolt-ai' | 'cursor-ai' | 'both';
  project: {
    name: string;
    type: string;
    version: string;
  };
  collaboration: {
    team_members: string[];
    current_branch: string;
    last_commit: string;
  };
  suggestions: {
    category: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    implementation_status: 'pending' | 'in-progress' | 'implemented';
  }[];
}

export const createAIContext = (ide: 'bolt-ai' | 'cursor-ai'): AIContext => {
  return {
    ide,
    project: {
      name: 'MyMindVentures.io PWA',
      type: 'react-typescript-pwa',
      version: '1.0.0',
    },
    collaboration: {
      team_members: ['You', 'Dev1', 'Dev2', 'Dev3'],
      current_branch: getCurrentBranch(),
      last_commit: getLastCommit(),
    },
    suggestions: [],
  };
};

const getCurrentBranch = (): string => {
  // This would be implemented to get the current Git branch
  return 'main';
};

const getLastCommit = (): string => {
  // This would be implemented to get the last commit hash
  return 'abc123...';
};
