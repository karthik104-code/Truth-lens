import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import SplashLoader from './components/SplashLoader';
import Navbar from './components/Navbar';
import HeroHeader from './components/HeroHeader';
import NewsInput from './components/NewsInput';
import ScanningModal from './components/ScanningModal';
import ResultDashboard from './components/ResultDashboard';
import HistoryDrawer from './components/HistoryDrawer';
import TrendingDebunks from './components/TrendingDebunks';
import ApiModal from './components/ApiModal';

import { analyzeNewsContentAsync } from './utils/fakeNewsAnalyzer';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [apiSettings, setApiSettings] = useState({
    provider: 'nlp',
    ollamaEndpoint: 'http://localhost:11434',
    ollamaModel: 'llama3',
    apiKey: 'eeccc418d9664fd3856615691eda1537.nZuXlSB93y4umNVco-4d-9JD'
  });

  // Load history & API settings from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('truthlens_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
      const savedSettings = localStorage.getItem('truthlens_api_settings');
      if (savedSettings) {
        setApiSettings(JSON.parse(savedSettings));
      }
    } catch (e) {
      console.error('Error reading from localStorage', e);
    }
  }, []);

  const handleAnalyze = async (input, type = 'text') => {
    setIsScanning(true);

    try {
      const result = await analyzeNewsContentAsync(input, type, apiSettings);
      setAnalysis(result);

      // Save to history
      setHistory((prev) => {
        const updated = [result, ...prev.slice(0, 19)];
        try {
          localStorage.setItem('truthlens_history', JSON.stringify(updated));
        } catch (err) {
          console.error(err);
        }
        return updated;
      });

      // Trigger celebratory confetti if score >= 80 (Verified Real)
      if (result.truthScore >= 80) {
        confetti({
          particleCount: 65,
          spread: 60,
          origin: { y: 0.75 },
          colors: ['#10b981', '#34d399', '#6366f1']
        });
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error processing news analysis');
    } finally {
      setIsScanning(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('truthlens_history');
    } catch (e) {}
  };

  const handleSaveSettings = (newSettings) => {
    setApiSettings(newSettings);
    try {
      localStorage.setItem('truthlens_api_settings', JSON.stringify(newSettings));
    } catch (e) {}
  };

  return (
    <>
      {/* Animated Opening Logo Splash Screen */}
      {showSplash && (
        <SplashLoader onComplete={() => setShowSplash(false)} />
      )}

      <div className="app-container">
        {/* Top Navbar */}
        <Navbar 
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenApiModal={() => setIsApiModalOpen(true)}
          onLogoClick={() => setShowSplash(true)}
          historyCount={history.length}
          apiSettings={apiSettings}
        />

        {/* Main Content Area */}
        <main>
          {!analysis && <HeroHeader />}

          {/* News Input Section */}
          <NewsInput onAnalyze={handleAnalyze} isLoading={isScanning} />

          {/* Result Dashboard (renders when analysis exists) */}
          {analysis && (
            <ResultDashboard 
              analysis={analysis} 
              onNewAnalysis={() => {
                setAnalysis(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />
          )}

          {/* Recently Debunked Viral Rumors */}
          <TrendingDebunks 
            onSelectClaim={(claimText) => handleAnalyze(claimText, 'text')} 
          />
        </main>

        {/* Footer */}
        <footer style={{ 
          textAlign: 'center', 
          paddingTop: '2rem', 
          borderTop: '1px solid var(--border-color)', 
          color: 'var(--text-dim)', 
          fontSize: '0.8rem' 
        }}>
          <p style={{ marginBottom: '0.4rem' }}>
            <strong>TruthLens AI</strong> — Empowers digital literacy & automated fake news detection.
          </p>
          <p>Active Engine: <code>{apiSettings.provider === 'ollama' ? `Ollama (${apiSettings.ollamaModel || 'llama3'})` : 'Built-in Fast NLP Core'}</code></p>
        </footer>

        {/* Modals & Drawers */}
        <ScanningModal isOpen={isScanning} />
        
        <HistoryDrawer 
          isOpen={isHistoryOpen} 
          onClose={() => setIsHistoryOpen(false)}
          history={history}
          onSelectHistoryItem={(item) => setAnalysis(item)}
          onClearHistory={handleClearHistory}
        />

        <ApiModal 
          isOpen={isApiModalOpen} 
          onClose={() => setIsApiModalOpen(false)}
          apiSettings={apiSettings}
          onSaveSettings={handleSaveSettings}
        />
      </div>
    </>
  );
}
