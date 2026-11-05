import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { DetectionPage } from './pages/DetectionPage';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { AdminPage } from './pages/AdminPage';
import { ProjectPackPage } from './pages/ProjectPackPage';
import { AboutPage } from './pages/AboutPage';
import { AnalysisResult, User } from './types';
import { getCurrentUser, setCurrentUser } from './lib/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [initialDetectText, setInitialDetectText] = useState<string>('');
  const [currentUser, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setUser(user);
  }, []);

  const handleStartAnalysis = (text?: string) => {
    if (text) {
      setInitialDetectText(text);
    }
    setActiveTab('detect');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRecordFromDashboard = (record: AnalysisResult) => {
    setInitialDetectText(record.originalText);
    setActiveTab('detect');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 3-Zone Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4">
        {activeTab === 'home' && (
          <HomePage
            onStartAnalysis={handleStartAnalysis}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'detect' && (
          <DetectionPage
            initialText={initialDetectText}
            onAnalysisSaved={() => {
              // Can trigger notifications or refresh
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardPage
            currentUser={currentUser}
            onSelectRecord={handleSelectRecordFromDashboard}
            onNavigateToDetect={() => setActiveTab('detect')}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage
            currentUser={currentUser}
            onNavigateToDetect={() => setActiveTab('detect')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPage
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}

        {activeTab === 'project-pack' && (
          <ProjectPackPage />
        )}

        {activeTab === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* Footer */}
      <Footer setActiveTab={(tab) => {
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => {
          setUser(user);
        }}
      />
    </div>
  );
}
