import React from 'react';
import { ShieldCheck, History, Key, Activity, Cpu } from 'lucide-react';

export default function Navbar({ onOpenHistory, onOpenApiModal, onLogoClick, historyCount = 0, apiSettings = {} }) {
  const isOllama = apiSettings.provider === 'ollama';

  return (
    <nav className="glass-panel" style={{ padding: '0.85rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div 
        onClick={onLogoClick}
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        title="Click to replay logo opening animation"
      >
        <div style={{ 
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
          padding: '0.6rem', 
          borderRadius: '12px', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
          transition: 'transform 0.2s ease'
        }} className="sample-card-btn">
          <ShieldCheck size={26} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', lineHeight: 1 }}>TruthLens</h1>
            <span style={{ 
              fontSize: '0.65rem', 
              fontWeight: '700', 
              background: 'rgba(99, 102, 241, 0.2)', 
              color: '#a5b4fc', 
              border: '1px solid rgba(99, 102, 241, 0.4)',
              padding: '2px 6px', 
              borderRadius: '6px',
              textTransform: 'uppercase'
            }}>AI v3.0</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-Time Misinformation & Fake News Detector</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Live Engine Status Badge */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.4rem', 
          padding: '0.4rem 0.8rem', 
          borderRadius: '50px', 
          background: isOllama ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.1)', 
          border: isOllama ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid rgba(16, 185, 129, 0.3)',
          fontSize: '0.75rem',
          color: isOllama ? '#a5b4fc' : '#34d399',
          fontWeight: '600'
        }}>
          {isOllama ? <Cpu size={14} className="animate-pulse-glow" /> : <Activity size={14} className="animate-pulse-glow" />}
          <span>{isOllama ? `Ollama (${apiSettings.ollamaModel || 'llama3'})` : 'NLP Engine Active'}</span>
        </div>

        {/* Engine Settings Button */}
        <button 
          onClick={onOpenApiModal}
          className="btn-secondary"
          style={{ padding: '0.5rem 0.9rem', fontSize: '0.82rem' }}
          title="AI Engine Configuration"
        >
          <Key size={15} />
          <span className="hide-mobile">AI Engine</span>
        </button>

        {/* History Button */}
        <button 
          onClick={onOpenHistory}
          className="btn-secondary"
          style={{ padding: '0.5rem 0.9rem', fontSize: '0.82rem', position: 'relative' }}
          title="Analysis History"
        >
          <History size={15} />
          <span>History</span>
          {historyCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: 'var(--accent-primary)',
              color: '#ffffff',
              fontSize: '0.65rem',
              fontWeight: '800',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {historyCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
