import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ChatBot } from './components/ui/ChatBot';
import { Home } from './pages/Home';
import { Placeholder } from './pages/Placeholder';
import { Dashboards } from './pages/Dashboards';
import { PitchDemo } from './pages/PitchDemo';
import { SettingsApp } from './pages/developer-tools/SettingsApp';
import { AppBuildManagement } from './pages/developer-tools/AppBuildManagement';
import { DeveloperWorkflows } from './pages/developer-tools/DeveloperWorkflows';
import { AppArchitecture } from './pages/developer-tools/AppArchitecture';
import { DatabaseManagement } from './pages/developer-tools/DatabaseManagement';
import { DatabaseMonitor } from './pages/developer-tools/DatabaseMonitor';
import { ToolstackOverview } from './pages/developer-tools/ToolstackOverview';
import { UserFlowPipelines } from './pages/developer-tools/UserFlowPipelines';
import { AppUserGuides } from './pages/developer-tools/AppUserGuides';
import { AppDocumentation } from './pages/developer-tools/AppDocumentation';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState('home');

  const renderContent = () => {
    switch (selectedTab) {
      case 'home':
        return <Home />;
      case 'pitch-demo':
        return <PitchDemo onNavigate={setSelectedTab} />;
      case 'story':
        return <Placeholder title="My Story & Roadmap" description="Personal journey and development roadmap coming soon." />;
      case 'apps':
        return <Placeholder title="Apps" description="Application portfolio management coming soon." />;
      case 'jointventure':
        return <Placeholder title="JointVenture" description="Collaboration and partnership management coming soon." />;
      case 'dashboards':
        return <Dashboards />;
      case 'app-management':
        return <Dashboards selectedSection="app-management" />;
      case 'app-settings':
        return <SettingsApp onBack={() => setSelectedTab('app-management')} />;
      case 'build-management':
        return <AppBuildManagement onBack={() => setSelectedTab('app-management')} />;
      case 'developer-workflows':
        return <DeveloperWorkflows onBack={() => setSelectedTab('app-management')} />;
      case 'app-architecture':
        return <AppArchitecture onBack={() => setSelectedTab('app-management')} />;
      case 'database-management':
        return <DatabaseManagement onBack={() => setSelectedTab('app-management')} />;
      case 'database-monitor':
        return <DatabaseMonitor onBack={() => setSelectedTab('app-management')} />;
      case 'toolstack-overview':
        return <ToolstackOverview onBack={() => setSelectedTab('app-management')} />;
      case 'userflow-pipelines':
        return <UserFlowPipelines onBack={() => setSelectedTab('app-management')} />;
      case 'app-user-guides':
        return <AppUserGuides onBack={() => setSelectedTab('app-management')} />;
      case 'app-documentation':
        return <AppDocumentation onBack={() => setSelectedTab('app-management')} />;
      case 'user-guide':
        return <Placeholder title="User Guide" description="User-facing documentation and help resources coming soon." />;
      case 'app-updates':
        return <Placeholder title="App Updates" description="Release notes and update notifications coming soon." />;
      case 'feedback-suggestions':
        return <Placeholder title="Feedback & Suggestions" description="User feedback, suggestions and feature requests coming soon." />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        selectedTab={selectedTab}
        onTabSelect={setSelectedTab}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentPage={selectedTab} />
        
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
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