import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Home } from './pages/Home';
import { Dashboards } from './pages/Dashboards';
import { Placeholder } from './pages/Placeholder';
import { ChatBot } from './components/ui/ChatBot';
import { DatabaseManagement } from './pages/developer-tools/DatabaseManagement';
import { DatabaseMonitor } from './pages/developer-tools/DatabaseMonitor';
import { ToolstackOverview } from './pages/developer-tools/ToolstackOverview';
import { UserFlowPipelines } from './pages/developer-tools/UserFlowPipelines';
import { AppUserGuides } from './pages/developer-tools/AppUserGuides';
import { AppDocumentation } from './pages/developer-tools/AppDocumentation';
import { GitManagement } from './pages/developer-tools/GitManagement';
import { AIDocumentationWorkflow } from './pages/developer-tools/AIDocumentationWorkflow';
import { DynamicDocumentation } from './pages/developer-tools/DynamicDocumentation';
import { AppUpdatesTimeline } from './pages/developer-tools/AppUpdatesTimeline';
import { BrainNFTConnection } from './pages/developer-tools/BrainNFTConnection';
import StateOfArtToolkit from './pages/developer-tools/StateOfArtToolkit';
import { AICodebaseAudit } from './pages/developer-tools/AICodebaseAudit';
import { DeveloperInstructions } from './pages/developer-tools/DeveloperInstructions';
import { AIOrchestrator } from './pages/developer-tools/AIOrchestrator';

import { PreCommitWorkflow } from './pages/developer-tools/PreCommitWorkflow';

import { AppOptimizer } from './pages/developer-tools/AppOptimizer';
import { OpenAIStrategicAudit } from './pages/developer-tools/OpenAIStrategicAudit';
import { UltraCompleteWorkflow } from './pages/developer-tools/UltraCompleteWorkflow';
import AIInsightsManager from './pages/developer-tools/AIInsightsManager';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState('home');
  const [workflowStatus, setWorkflowStatus] = useState<{
    isRunning: boolean;
    currentStep?: string;
    progress?: number;
    estimatedTime?: string;
  }>({
    isRunning: false,
  });

  const renderContent = () => {
    switch (selectedTab) {
      case 'home':
        return <Home />;
      case 'dashboards':
        return <Dashboards onNavigate={setSelectedTab} />;
      case 'database-management':
        return (
          <DatabaseManagement onBack={() => setSelectedTab('app-management')} />
        );
      case 'database-monitor':
        return (
          <DatabaseMonitor onBack={() => setSelectedTab('app-management')} />
        );
      case 'toolstack-overview':
        return (
          <ToolstackOverview onBack={() => setSelectedTab('app-management')} />
        );
      case 'userflow-pipelines':
        return (
          <UserFlowPipelines onBack={() => setSelectedTab('app-management')} />
        );
      case 'app-user-guides':
        return (
          <AppUserGuides onBack={() => setSelectedTab('app-management')} />
        );
      case 'app-documentation':
        return (
          <AppDocumentation onBack={() => setSelectedTab('app-management')} />
        );
      case 'git-management':
        return (
          <GitManagement onBack={() => setSelectedTab('app-management')} />
        );
      case 'ai-documentation-workflow':
        return (
          <AIDocumentationWorkflow
            onBack={() => setSelectedTab('app-management')}
          />
        );
      case 'dynamic-documentation':
        return (
          <DynamicDocumentation
            onBack={() => setSelectedTab('app-management')}
          />
        );
      case 'app-updates-timeline':
        return (
          <AppUpdatesTimeline onBack={() => setSelectedTab('app-management')} />
        );
      case 'brain-nft-connection':
        return (
          <BrainNFTConnection onBack={() => setSelectedTab('app-management')} />
        );
      case 'state-of-art-toolkit':
        return <StateOfArtToolkit />;
      case 'user-guide':
        return (
          <Placeholder
            title='User Guide'
            description='User-facing documentation and help resources coming soon.'
          />
        );
      case 'app-updates':
        return (
          <Placeholder
            title='App Updates'
            description='Release notes and update notifications coming soon.'
          />
        );
      case 'feedback-suggestions':
        return (
          <AICodebaseAudit onBack={() => setSelectedTab('app-management')} />
        );
      case 'developer-instructions':
        return (
          <DeveloperInstructions
            onBack={() => setSelectedTab('app-management')}
          />
        );
      case 'ai-orchestrator':
        return (
          <AIOrchestrator onBack={() => setSelectedTab('app-management')} />
        );
      case 'git-alerts':
        return <GitAlerts onBack={() => setSelectedTab('app-management')} />;
      case 'pre-commit-workflow':
        return (
          <PreCommitWorkflow onBack={() => setSelectedTab('app-management')} />
        );

      case 'app-optimizer':
        return <AppOptimizer onBack={() => setSelectedTab('app-management')} />;
      case 'openai-strategic-audit':
        return (
          <OpenAIStrategicAudit
            onBack={() => setSelectedTab('app-management')}
          />
        );
      case 'ultra-complete-workflow':
        return (
          <UltraCompleteWorkflow
            onBack={() => setSelectedTab('app-management')}
            onWorkflowStatusChange={setWorkflowStatus}
          />
        );
      case 'ai-insights-manager':
        return (
          <AIInsightsManager />
        );
      default:
        return <Home />;
    }
  };

  return (
    <div className='flex h-screen bg-gray-900 overflow-hidden'>
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        selectedTab={selectedTab}
        onTabSelect={setSelectedTab}
      />

      <div className='flex-1 flex flex-col overflow-hidden'>
        <Header currentPage={selectedTab} workflowStatus={workflowStatus} />

        <main className='flex-1 overflow-auto'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className='h-full'
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <ChatBot currentPage={selectedTab} />
    </div>
  );
}

export default App;
