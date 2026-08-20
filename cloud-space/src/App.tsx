import React from 'react';
import { CloudSpaceProvider, useCloudSpace } from './context/CloudSpaceContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { FileGrid } from './components/FileManager/FileGrid';
import { FilePreviewModal } from './components/FileManager/FilePreviewModal';
import { UploadModal } from './components/FileManager/UploadModal';
import { AutoOrganizeModal } from './components/AI/AutoOrganizeModal';
import { AIAssistantDrawer } from './components/AI/AIAssistantDrawer';
import { PersonaWorkspace } from './components/Personas/PersonaWorkspace';
import { WorkflowStudio } from './components/AI/WorkflowStudio';
import { DeveloperConsole } from './components/Developer/DeveloperConsole';
import { MultiRegionReplicas } from './components/Developer/MultiRegionReplicas';
import { AuditLogViewer } from './components/Developer/AuditLogViewer';
import { ShareModal } from './components/ShareModal';
import { UpgradeModal } from './components/UpgradeModal';
import { AdminAccessModal } from './components/Developer/AdminAccessModal';
import { AdminAccessGate } from './components/Developer/AdminAccessGate';
import { LoginScreen } from './components/Auth/LoginScreen';

const MainLayout: React.FC = () => {
  const { currentView, isAdminAuthenticated, isAuthenticated } = useCloudSpace();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'workflows':
        return <WorkflowStudio />;
      case 'persona-hub':
      case 'assistant':
        return <PersonaWorkspace />;
      case 'dev-console':
        return isAdminAuthenticated ? <DeveloperConsole /> : <AdminAccessGate targetViewName="Developer Telemetry & CLI" />;
      case 'dev-nodes':
        return isAdminAuthenticated ? <MultiRegionReplicas /> : <AdminAccessGate targetViewName="Multi-Region Replicas" />;
      case 'audit-logs':
        return isAdminAuthenticated ? <AuditLogViewer /> : <AdminAccessGate targetViewName="Audit Trail & System Logs" />;
      case 'files':
      case 'folders':
      case 'starred':
      case 'shared':
      case 'recent':
      case 'trash':
      default:
        return <FileGrid />;
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100/60 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
      {/* Top Navigation */}
      <Navbar />

      {/* Workspace Area: Sidebar + Dynamic Main Panel */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Global Modals & Overlays */}
      <FilePreviewModal />
      <UploadModal />
      <AutoOrganizeModal />
      <ShareModal />
      <UpgradeModal />
      <AdminAccessModal />
      <AIAssistantDrawer />
    </div>
  );
};

export default function App() {
  return (
    <CloudSpaceProvider>
      <MainLayout />
    </CloudSpaceProvider>
  );
}
