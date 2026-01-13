import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Workspace from './components/Workspace';
import ValidationProof from './components/ValidationProof';
import Verify from './components/Verify';
import Architecture from './components/Architecture';
import SystemStatus from './components/SystemStatus';

type ViewState = 'landing' | 'workspace' | 'validation' | 'verify' | 'architecture' | 'status';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [activePortfolioId, setActivePortfolioId] = useState<string>('');

  const handleNavigate = (nextView: string, portfolioId?: string) => {
    if (portfolioId) {
      setActivePortfolioId(portfolioId);
    }
    setView(nextView as ViewState);
  };

  return (
    <main className="w-full min-h-screen bg-gray-50">
      {view === 'landing' && (
        <LandingPage onEnter={() => setView('workspace')} />
      )}
      
      {view === 'workspace' && (
        <Workspace onNavigate={handleNavigate} />
      )}
      
      {view === 'validation' && (
        <ValidationProof 
          portfolioId={activePortfolioId} 
          onBack={() => setView('workspace')} 
          onNavigate={handleNavigate}
        />
      )}

      {view === 'verify' && (
        <Verify onNavigate={handleNavigate} />
      )}

      {view === 'architecture' && (
        <Architecture onNavigate={handleNavigate} />
      )}

      {view === 'status' && (
        <SystemStatus onNavigate={handleNavigate} />
      )}
    </main>
  );
};

export default App;