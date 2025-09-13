# Pre-Commit Workflow

## 📋 Overview

The Pre-Commit Workflow handles comprehensive pre-commit checks including AI audit, optimization, testing, security scanning, and documentation updates. It ensures code quality and consistency before commits are made to the repository.

## 🎯 Purpose

- **Quality Assurance**: Comprehensive code quality checks before commits
- **Automated Testing**: Run test suites and validation checks
- **Security Scanning**: Identify security vulnerabilities and issues
- **Code Optimization**: Performance and efficiency improvements
- **Documentation Updates**: Ensure documentation stays current
- **Git Validation**: Verify repository status and branch integrity

## ✨ Features

### Core Functionality
- **AI Code Analysis**: AI-powered code review and suggestions
- **Performance Optimization**: Automatic code optimization recommendations
- **Automated Testing**: Comprehensive test suite execution
- **Security Scanning**: Vulnerability assessment and security checks
- **Documentation Validation**: Ensure documentation is up-to-date
- **Git Status Checks**: Repository integrity and branch validation

### Advanced Features
- **Priority-based Execution**: Run steps in priority order (critical, high, medium, low)
- **Parallel Processing**: Optional parallel execution for faster processing
- **Retry Logic**: Automatic retry for failed steps
- **Real-time Logging**: Live progress updates and detailed logging
- **Configurable Workflow**: Customizable step execution and settings
- **Report Generation**: Comprehensive workflow reports with scores and metrics

## 🗄️ Database Tables

### `workflow_reports` (To be implemented)
```sql
CREATE TABLE workflow_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id text UNIQUE NOT NULL,
  workflow_id text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  overall_score integer NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  steps_completed integer NOT NULL DEFAULT 0,
  steps_failed integer NOT NULL DEFAULT 0,
  total_duration integer NOT NULL DEFAULT 0,
  issues_found integer NOT NULL DEFAULT 0,
  optimizations_applied integer NOT NULL DEFAULT 0,
  security_vulnerabilities integer NOT NULL DEFAULT 0,
  test_coverage integer NOT NULL DEFAULT 0,
  documentation_updated boolean NOT NULL DEFAULT false,
  git_status text NOT NULL CHECK (git_status IN ('clean', 'dirty', 'conflicts')),
  recommendations text[] DEFAULT '{}',
  warnings text[] DEFAULT '{}',
  errors text[] DEFAULT '{}',
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

## 🔧 Configuration

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Workflow Configuration
```typescript
interface WorkflowConfig {
  run_ai_audit: boolean;
  run_optimization: boolean;
  run_testing: boolean;
  run_security_scan: boolean;
  run_documentation: boolean;
  run_git_check: boolean;
  stop_on_critical_errors: boolean;
  parallel_execution: boolean;
  timeout_minutes: number;
  retry_failed_steps: boolean;
  max_retries: number;
}
```

### Default Configuration
```typescript
const defaultWorkflowConfig = {
  run_ai_audit: true,
  run_optimization: true,
  run_testing: true,
  run_security_scan: true,
  run_documentation: true,
  run_git_check: true,
  stop_on_critical_errors: true,
  parallel_execution: false,
  timeout_minutes: 30,
  retry_failed_steps: true,
  max_retries: 3
};
```

## 🚀 Implementation

### 1. Initialize Workflow
```typescript
import { PreCommitWorkflow } from './pre-commit-workflow';

const workflow = new PreCommitWorkflow({
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY,
  defaultUserId: 'demo-user'
}, {
  run_ai_audit: true,
  run_testing: true,
  stop_on_critical_errors: true
});
```

### 2. Start Workflow
```typescript
try {
  const report = await workflow.startPreCommitWorkflow();
  console.log(`Workflow completed with score: ${report.overall_score}/100`);
  console.log(`Steps completed: ${report.steps_completed}`);
  console.log(`Issues found: ${report.issues_found}`);
} catch (error) {
  console.error('Workflow failed:', error);
}
```

### 3. Monitor Progress
```typescript
const status = workflow.getWorkflowStatus();
console.log(`Progress: ${status.progress}%`);
console.log(`Running: ${status.isRunning}`);
console.log(`Steps: ${status.steps.length}`);
```

## 📊 Workflow Steps

### 1. **AI Code Analysis** (Critical Priority)
- **Purpose**: AI-powered code review and suggestions
- **Features**: 
  - Code quality assessment
  - Best practice recommendations
  - Performance suggestions
  - Security analysis
- **Duration**: ~2-5 minutes
- **Output**: Analysis report with recommendations

### 2. **Code Optimization** (High Priority)
- **Purpose**: Performance and efficiency improvements
- **Features**:
  - Performance bottleneck identification
  - Memory usage optimization
  - Algorithm efficiency improvements
  - Code structure optimization
- **Duration**: ~1-3 minutes
- **Output**: Optimization suggestions and applied changes

### 3. **Automated Testing** (Critical Priority)
- **Purpose**: Comprehensive test suite execution
- **Features**:
  - Unit test execution
  - Integration test validation
  - Test coverage analysis
  - Test result reporting
- **Duration**: ~3-10 minutes
- **Output**: Test results and coverage reports

### 4. **Security Scan** (Critical Priority)
- **Purpose**: Security vulnerability assessment
- **Features**:
  - Dependency vulnerability scanning
  - Code security analysis
  - Configuration security checks
  - Security best practice validation
- **Duration**: ~2-5 minutes
- **Output**: Security report with vulnerabilities

### 5. **Documentation Update** (Medium Priority)
- **Purpose**: Ensure documentation is current
- **Features**:
  - Documentation validation
  - Auto-generated documentation updates
  - API documentation synchronization
  - README and changelog updates
- **Duration**: ~1-2 minutes
- **Output**: Updated documentation files

### 6. **Git Status Check** (High Priority)
- **Purpose**: Repository integrity validation
- **Features**:
  - Branch status verification
  - Merge conflict detection
  - Staged changes validation
  - Remote synchronization check
- **Duration**: ~30 seconds
- **Output**: Git status report

## 🔄 Workflow Execution Flow

### Priority-based Execution
1. **Critical Steps**: AI Audit, Testing, Security Scan
2. **High Priority**: Optimization, Git Check
3. **Medium Priority**: Documentation
4. **Low Priority**: Additional validations

### Error Handling
- **Critical Errors**: Stop workflow execution
- **Non-critical Errors**: Continue with warnings
- **Retry Logic**: Automatic retry for transient failures
- **Timeout Protection**: Prevent infinite execution

### Parallel Execution (Optional)
- Run independent steps simultaneously
- Reduce total execution time
- Maintain step dependencies
- Resource management

## 📈 Reporting

### Workflow Report Structure
```typescript
interface WorkflowReport {
  report_id: string;
  workflow_id: string;
  timestamp: string;
  overall_score: number;           // 0-100 score
  steps_completed: number;
  steps_failed: number;
  total_duration: number;          // milliseconds
  issues_found: number;
  optimizations_applied: number;
  security_vulnerabilities: number;
  test_coverage: number;           // percentage
  documentation_updated: boolean;
  git_status: 'clean' | 'dirty' | 'conflicts';
  recommendations: string[];
  warnings: string[];
  errors: string[];
  user_id: string;
}
```

### Score Calculation
- **Base Score**: 100 points
- **Deductions**: 
  - Failed steps: -20 points each
  - Security vulnerabilities: -10 points each
  - Test coverage below 80%: -15 points
  - Documentation not updated: -5 points
  - Git conflicts: -25 points

## 🛠️ Utility Functions

### Configuration Validation
```typescript
const isValidConfig = validateWorkflowConfig({
  run_ai_audit: true,
  run_testing: true,
  timeout_minutes: 30,
  max_retries: 3
});
```

### Workflow Status
```typescript
const status = workflow.getWorkflowStatus();
console.log(`Progress: ${status.progress}%`);
console.log(`Current step: ${status.currentStep}`);
console.log(`Logs: ${status.logs.length} entries`);
```

### Reset Workflow
```typescript
workflow.resetWorkflow(); // Reset to initial state
```

## 🔍 Error Handling

### Common Errors
- **Configuration Errors**: Invalid workflow configuration
- **Step Failures**: Individual step execution failures
- **Timeout Errors**: Workflow execution timeout
- **Database Errors**: Supabase connection issues
- **Git Errors**: Repository access or status issues

### Error Recovery
- **Automatic Retry**: Retry failed steps with exponential backoff
- **Graceful Degradation**: Continue with available steps
- **Error Reporting**: Detailed error logs and reports
- **Fallback Options**: Alternative execution paths

## 📊 Performance Considerations

### Optimization Tips
- Use parallel execution for independent steps
- Implement caching for repeated operations
- Optimize database queries and operations
- Monitor resource usage and memory consumption

### Monitoring
- Track execution times for each step
- Monitor success/failure rates
- Log performance metrics
- Alert on performance degradation

## 🔐 Security

### Data Protection
- Secure storage of workflow reports
- User-specific data isolation
- Input validation and sanitization
- Secure API key management

### Access Control
- User-based workflow access
- Role-based step permissions
- Audit logging for sensitive operations
- Secure configuration management

## 🧪 Testing

### Test Scenarios
- Complete workflow execution
- Individual step testing
- Error handling and recovery
- Performance under load
- Configuration validation

### Test Data
- Sample codebase for testing
- Mock test results
- Test database with sample reports
- Simulated error conditions

## 📚 Examples

### Basic Usage
```typescript
// Initialize with default configuration
const workflow = new PreCommitWorkflow();

// Start workflow
const report = await workflow.startPreCommitWorkflow();

// Check results
if (report.overall_score >= 80) {
  console.log('✅ Code quality passed!');
} else {
  console.log('❌ Code quality issues found');
}
```

### Custom Configuration
```typescript
const workflow = new PreCommitWorkflow({}, {
  run_ai_audit: true,
  run_testing: true,
  run_security_scan: true,
  run_optimization: false,
  run_documentation: false,
  run_git_check: true,
  stop_on_critical_errors: true,
  parallel_execution: true,
  timeout_minutes: 15,
  retry_failed_steps: true,
  max_retries: 2
});
```

### Monitoring Progress
```typescript
const workflow = new PreCommitWorkflow();

// Start workflow
const workflowPromise = workflow.startPreCommitWorkflow();

// Monitor progress
const interval = setInterval(() => {
  const status = workflow.getWorkflowStatus();
  console.log(`Progress: ${status.progress}%`);
  
  if (!status.isRunning) {
    clearInterval(interval);
  }
}, 1000);

// Wait for completion
const report = await workflowPromise;
```

## 🔗 Related Workflows

- **AI Documentation Workflow**: Integrates with documentation updates
- **Build Logs Workflow**: Logs workflow execution events
- **Git Workflow Events**: Tracks git-related workflow steps
- **AI Audit Suggestions Workflow**: Provides audit recommendations

## 📋 Checklist

### Before Implementation
- [ ] Set up Supabase database with workflow_reports table
- [ ] Configure environment variables
- [ ] Set up test environment
- [ ] Configure workflow settings
- [ ] Set up monitoring and logging

### During Implementation
- [ ] Implement workflow steps
- [ ] Add error handling
- [ ] Configure retry logic
- [ ] Set up reporting
- [ ] Add progress monitoring

### After Implementation
- [ ] Test workflow execution
- [ ] Validate reports
- [ ] Monitor performance
- [ ] Gather feedback
- [ ] Optimize configuration

---

*This workflow is part of the MyMindVentures.io workflow collection. For more information, see the main [README](./README.md).*
