# Git Workflow Events

## 📋 Overview

The Git Workflow Events system handles comprehensive Git event tracking and management, supporting multi-IDE collaboration between Bolt.ai and Cursor.ai. It provides real-time tracking of Git operations, branch management, and team collaboration metrics.

## 🎯 Purpose

- **Git Event Tracking**: Comprehensive tracking of all Git operations
- **Multi-IDE Support**: Support for Bolt.ai and Cursor.ai collaboration
- **Team Coordination**: Track team member activities and contributions
- **Branch Management**: Monitor branch creation, merging, and deletion
- **Conflict Resolution**: Track and manage merge conflicts
- **Performance Monitoring**: Monitor Git operation performance

## ✨ Features

### Core Functionality
- **Event Tracking**: Track commits, pushes, pull requests, merges, conflicts
- **Branch Management**: Monitor branch creation, deletion, and switching
- **Tag Management**: Track tag creation and management
- **Review Tracking**: Monitor code review activities
- **IDE Integration**: Track which IDE was used for operations
- **Metadata Storage**: Store detailed metadata for each event

### Advanced Features
- **Multi-IDE Collaboration**: Support for multiple IDE environments
- **Team Analytics**: Team member activity tracking
- **Conflict Detection**: Automatic conflict detection and reporting
- **Performance Metrics**: Git operation performance tracking
- **Real-time Updates**: Live event streaming and updates
- **Historical Analysis**: Historical event analysis and reporting

## 🗄️ Database Tables

### `git_workflow_events`
```sql
CREATE TABLE git_workflow_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text UNIQUE NOT NULL,
  event_type text NOT NULL CHECK (event_type IN (
    'commit', 'push', 'pull_request', 'merge', 'conflict', 
    'branch_create', 'branch_delete', 'tag_create', 'review'
  )),
  branch_name text NOT NULL,
  commit_hash text,
  commit_message text,
  author_name text,
  author_email text,
  ide_used text CHECK (ide_used IN ('bolt-ai', 'cursor-ai', 'unknown')),
  metadata jsonb NOT NULL DEFAULT '{}',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);
```

### `multi_ide_collaboration_status`
```sql
CREATE TABLE multi_ide_collaboration_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text NOT NULL,
  git_branch text NOT NULL,
  last_commit_hash text NOT NULL,
  last_commit_message text,
  pending_pull_requests integer DEFAULT 0,
  merge_conflicts integer DEFAULT 0,
  team_members jsonb NOT NULL DEFAULT '[]',
  ide_usage jsonb NOT NULL DEFAULT '{"bolt_ai": 0, "cursor_ai": 0}',
  collaboration_score integer CHECK (collaboration_score >= 0 AND collaboration_score <= 100),
  last_sync_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 🔧 Configuration

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
GIT_REPOSITORY_PATH=path/to/repository
```

### Workflow Configuration
```typescript
interface GitWorkflowEventsConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  repositoryPath: string;
  defaultUserId?: string;
  enableRealTimeTracking?: boolean;
  trackIDEUsage?: boolean;
  collaborationThreshold?: number;
}
```

### Default Configuration
```typescript
const defaultConfig = {
  supabaseUrl: process.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || '',
  repositoryPath: process.env.GIT_REPOSITORY_PATH || './',
  defaultUserId: 'demo-user',
  enableRealTimeTracking: true,
  trackIDEUsage: true,
  collaborationThreshold: 80
};
```

## 🚀 Implementation

### 1. Initialize Workflow
```typescript
import { GitWorkflowEvents } from './git-workflow-events';

const gitWorkflow = new GitWorkflowEvents({
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY,
  repositoryPath: './my-project',
  defaultUserId: 'demo-user',
  enableRealTimeTracking: true
});
```

### 2. Track Git Events
```typescript
// Track a commit
await gitWorkflow.trackCommit({
  commitHash: 'abc123def456',
  commitMessage: 'feat: add new feature',
  branchName: 'feature/new-feature',
  authorName: 'John Doe',
  authorEmail: 'john@example.com',
  ideUsed: 'cursor-ai'
});

// Track a merge
await gitWorkflow.trackMerge({
  sourceBranch: 'feature/new-feature',
  targetBranch: 'main',
  commitHash: 'def456ghi789',
  ideUsed: 'bolt-ai'
});
```

### 3. Monitor Collaboration
```typescript
const status = await gitWorkflow.getCollaborationStatus('my-project');
console.log(`Collaboration Score: ${status.collaboration_score}`);
console.log(`Team Members: ${status.team_members.length}`);
console.log(`IDE Usage:`, status.ide_usage);
```

## 📊 Event Types

### 1. **Commit Events**
- **Purpose**: Track code commits and changes
- **Metadata**:
  - Commit hash
  - Commit message
  - Author information
  - Files changed
  - IDE used
  - Timestamp
- **Use Cases**: Code contribution tracking, author analytics

### 2. **Push Events**
- **Purpose**: Track code pushes to remote repositories
- **Metadata**:
  - Branch name
  - Commit count
  - Push size
  - Remote repository
  - IDE used
- **Use Cases**: Deployment tracking, remote sync monitoring

### 3. **Pull Request Events**
- **Purpose**: Track pull request creation and management
- **Metadata**:
  - PR number
  - Source and target branches
  - Author and reviewers
  - PR status
  - IDE used
- **Use Cases**: Code review tracking, PR analytics

### 4. **Merge Events**
- **Purpose**: Track branch merges and integration
- **Metadata**:
  - Source and target branches
  - Merge type (fast-forward, merge commit, squash)
  - Conflict resolution
  - IDE used
- **Use Cases**: Integration tracking, merge analytics

### 5. **Conflict Events**
- **Purpose**: Track merge conflicts and resolution
- **Metadata**:
  - Conflict files
  - Conflict type
  - Resolution method
  - Resolution time
  - IDE used
- **Use Cases**: Conflict analysis, team coordination

### 6. **Branch Events**
- **Purpose**: Track branch creation and deletion
- **Metadata**:
  - Branch name
  - Branch type (feature, bugfix, hotfix)
  - Parent branch
  - IDE used
- **Use Cases**: Branch management, workflow analysis

### 7. **Tag Events**
- **Purpose**: Track tag creation and management
- **Metadata**:
  - Tag name
  - Tag type (release, milestone)
  - Associated commit
  - IDE used
- **Use Cases**: Release tracking, version management

### 8. **Review Events**
- **Purpose**: Track code review activities
- **Metadata**:
  - Review type (approval, request changes, comment)
  - Reviewer information
  - Review duration
  - IDE used
- **Use Cases**: Review analytics, quality metrics

## 🔄 Multi-IDE Collaboration

### IDE Detection
- **Bolt.ai**: Track operations performed in Bolt.ai
- **Cursor.ai**: Track operations performed in Cursor.ai
- **Unknown**: Track operations from unknown sources

### Collaboration Metrics
- **Team Members**: Track active team members
- **IDE Usage**: Monitor IDE usage distribution
- **Collaboration Score**: Calculate team collaboration effectiveness
- **Sync Status**: Monitor repository synchronization

### Collaboration Status
```typescript
interface CollaborationStatus {
  project_id: string;
  git_branch: string;
  last_commit_hash: string;
  last_commit_message: string;
  pending_pull_requests: number;
  merge_conflicts: number;
  team_members: string[];
  ide_usage: {
    bolt_ai: number;
    cursor_ai: number;
  };
  collaboration_score: number;
  last_sync_at: string;
}
```

## 🛠️ Utility Functions

### Event Tracking
```typescript
// Track commit
await gitWorkflow.trackCommit({
  commitHash: 'abc123',
  commitMessage: 'feat: new feature',
  branchName: 'main',
  authorName: 'John Doe',
  authorEmail: 'john@example.com',
  ideUsed: 'cursor-ai'
});

// Track push
await gitWorkflow.trackPush({
  branchName: 'main',
  commitCount: 3,
  pushSize: 1024,
  ideUsed: 'bolt-ai'
});

// Track merge
await gitWorkflow.trackMerge({
  sourceBranch: 'feature/new',
  targetBranch: 'main',
  commitHash: 'def456',
  ideUsed: 'cursor-ai'
});
```

### Event Retrieval
```typescript
// Get events by type
const commits = await gitWorkflow.getEventsByType('commit');

// Get events by branch
const branchEvents = await gitWorkflow.getEventsByBranch('main');

// Get events by IDE
const cursorEvents = await gitWorkflow.getEventsByIDE('cursor-ai');

// Get recent events
const recentEvents = await gitWorkflow.getRecentEvents(10);
```

### Analytics
```typescript
// Get collaboration status
const status = await gitWorkflow.getCollaborationStatus('project-id');

// Get team analytics
const analytics = await gitWorkflow.getTeamAnalytics();

// Get IDE usage statistics
const ideStats = await gitWorkflow.getIDEUsageStats();
```

## 📈 Analytics and Reporting

### Team Analytics
- **Activity Metrics**: Track team member activity
- **Contribution Analysis**: Analyze individual contributions
- **Collaboration Patterns**: Identify collaboration patterns
- **Performance Metrics**: Track team performance

### IDE Analytics
- **Usage Distribution**: Monitor IDE usage across team
- **Feature Adoption**: Track IDE feature adoption
- **Performance Comparison**: Compare IDE performance
- **Migration Tracking**: Track IDE migration patterns

### Repository Analytics
- **Branch Activity**: Monitor branch creation and usage
- **Merge Patterns**: Analyze merge patterns and frequency
- **Conflict Analysis**: Track and analyze conflicts
- **Release Tracking**: Monitor release and tag activities

## 🔍 Error Handling

### Common Errors
- **Git Repository Errors**: Repository access issues
- **Database Errors**: Event storage failures
- **IDE Detection Errors**: IDE identification failures
- **Network Errors**: Remote repository connection issues
- **Permission Errors**: Access control issues

### Error Recovery
- **Retry Logic**: Automatic retry for transient failures
- **Fallback Detection**: Fallback IDE detection methods
- **Event Queuing**: Queue events for later processing
- **Error Logging**: Comprehensive error logging
- **Graceful Degradation**: Continue operation with reduced functionality

## 📊 Performance Considerations

### Optimization Strategies
- **Batch Processing**: Process multiple events together
- **Async Processing**: Use asynchronous event processing
- **Caching**: Cache frequently accessed data
- **Indexing**: Optimize database indexes
- **Event Filtering**: Filter irrelevant events

### Monitoring
- **Event Processing Time**: Track event processing performance
- **Database Performance**: Monitor database operations
- **Memory Usage**: Track memory consumption
- **Network Performance**: Monitor network operations
- **Error Rates**: Track error rates and patterns

## 🔐 Security

### Data Protection
- **Access Control**: User-based access control
- **Data Encryption**: Encrypt sensitive data
- **Audit Logging**: Log all operations
- **Input Validation**: Validate all inputs
- **Secure Communication**: Use secure communication channels

### Privacy
- **User Data Isolation**: Isolate user data
- **Metadata Protection**: Protect sensitive metadata
- **Access Logging**: Log data access
- **Data Retention**: Manage data retention policies
- **GDPR Compliance**: Ensure GDPR compliance

## 🧪 Testing

### Test Scenarios
- **Event Tracking**: Test all event types
- **Multi-IDE Support**: Test IDE detection
- **Collaboration Features**: Test collaboration tracking
- **Error Handling**: Test error conditions
- **Performance**: Test under load

### Test Data
- **Sample Events**: Test events with various types
- **Mock Repositories**: Mock Git repositories
- **Test Users**: Test user accounts
- **Performance Data**: Performance test data

## 📚 Examples

### Basic Usage
```typescript
// Initialize Git workflow
const gitWorkflow = new GitWorkflowEvents({
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseAnonKey: 'your-anon-key',
  repositoryPath: './my-project',
  defaultUserId: 'user123'
});

// Track a commit
await gitWorkflow.trackCommit({
  commitHash: 'abc123def456',
  commitMessage: 'feat: implement new feature',
  branchName: 'feature/new-feature',
  authorName: 'John Doe',
  authorEmail: 'john@example.com',
  ideUsed: 'cursor-ai'
});
```

### Advanced Tracking
```typescript
// Track multiple events
const events = [
  {
    type: 'commit',
    commitHash: 'abc123',
    commitMessage: 'feat: new feature',
    branchName: 'main',
    ideUsed: 'cursor-ai'
  },
  {
    type: 'push',
    branchName: 'main',
    commitCount: 1,
    ideUsed: 'cursor-ai'
  }
];

await gitWorkflow.trackMultipleEvents(events);
```

### Collaboration Monitoring
```typescript
// Get collaboration status
const status = await gitWorkflow.getCollaborationStatus('my-project');
console.log(`Collaboration Score: ${status.collaboration_score}/100`);
console.log(`Team Members: ${status.team_members.join(', ')}`);
console.log(`IDE Usage: Bolt.ai ${status.ide_usage.bolt_ai}, Cursor.ai ${status.ide_usage.cursor_ai}`);
```

### Analytics
```typescript
// Get team analytics
const analytics = await gitWorkflow.getTeamAnalytics();
console.log(`Total Commits: ${analytics.total_commits}`);
console.log(`Active Branches: ${analytics.active_branches}`);
console.log(`Merge Conflicts: ${analytics.merge_conflicts}`);
```

## 🔗 Related Workflows

- **Multi-IDE Collaboration Workflow**: Integrates with collaboration features
- **Build Logs Workflow**: Logs Git-related build events
- **Pre-Commit Workflow**: Integrates with pre-commit checks
- **AI Audit Suggestions Workflow**: Uses Git data for audits

## 📋 Checklist

### Before Implementation
- [ ] Set up Supabase database with git_workflow_events table
- [ ] Configure Git repository access
- [ ] Set up IDE detection
- [ ] Configure collaboration tracking
- [ ] Set up monitoring and logging

### During Implementation
- [ ] Implement event tracking
- [ ] Add IDE detection
- [ ] Set up collaboration features
- [ ] Add error handling
- [ ] Implement analytics

### After Implementation
- [ ] Test event tracking
- [ ] Validate IDE detection
- [ ] Test collaboration features
- [ ] Monitor performance
- [ ] Gather user feedback

---

*This workflow is part of the MyMindVentures.io workflow collection. For more information, see the main [README](./README.md).*
