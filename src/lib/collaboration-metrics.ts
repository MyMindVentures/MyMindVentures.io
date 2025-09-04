export interface CollaborationMetrics {
  ide_usage: {
    bolt_ai: number;
    cursor_ai: number;
  };
  collaboration_score: number;
  merge_conflicts: number;
  code_review_time: number;
  feature_completion_rate: number;
}

export const calculateCollaborationScore = (
  metrics: CollaborationMetrics
): number => {
  const { merge_conflicts, code_review_time, feature_completion_rate } =
    metrics;

  // Lower conflicts = higher score
  const conflictScore = Math.max(0, 100 - merge_conflicts * 10);

  // Faster reviews = higher score
  const reviewScore = Math.max(0, 100 - code_review_time / 60);

  // Higher completion rate = higher score
  const completionScore = feature_completion_rate;

  return Math.round((conflictScore + reviewScore + completionScore) / 3);
};

export const getCollaborationInsights = (
  metrics: CollaborationMetrics
): string[] => {
  const insights = [];

  if (metrics.merge_conflicts > 2) {
    insights.push(
      'High number of merge conflicts detected. Consider improving branch management strategy.'
    );
  }

  if (metrics.code_review_time > 120) {
    insights.push(
      'Code reviews are taking longer than expected. Consider implementing automated review tools.'
    );
  }

  if (metrics.feature_completion_rate < 0.7) {
    insights.push(
      'Feature completion rate is below target. Consider optimizing development workflow.'
    );
  }

  if (metrics.ide_usage.bolt_ai > metrics.ide_usage.cursor_ai * 2) {
    insights.push(
      'Heavy reliance on Bolt.ai detected. Consider balancing IDE usage for optimal collaboration.'
    );
  }

  if (metrics.ide_usage.cursor_ai > metrics.ide_usage.bolt_ai * 2) {
    insights.push(
      'Heavy reliance on Cursor.ai detected. Consider balancing IDE usage for optimal collaboration.'
    );
  }

  return insights;
};

export const generateOptimizationSuggestions = (
  metrics: CollaborationMetrics
) => {
  const suggestions = [];

  if (metrics.merge_conflicts > 2) {
    suggestions.push({
      title: 'Implement Better Branch Strategy',
      description: 'Reduce merge conflicts with improved branch management',
      priority: 'high',
      effort: 'medium',
    });
  }

  if (metrics.code_review_time > 120) {
    suggestions.push({
      title: 'Automate Code Reviews',
      description: 'Implement automated review tools to speed up the process',
      priority: 'medium',
      effort: 'high',
    });
  }

  if (metrics.feature_completion_rate < 0.7) {
    suggestions.push({
      title: 'Optimize Development Workflow',
      description:
        'Streamline the development process to improve completion rates',
      priority: 'high',
      effort: 'high',
    });
  }

  return suggestions;
};
