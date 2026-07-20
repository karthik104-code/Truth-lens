import React from 'react';
import { X, History, Trash2, Clock, ShieldCheck, AlertTriangle, ArrowRight } from 'lucide-react';

export default function HistoryDrawer({ isOpen, onClose, history, onSelectHistoryItem, onClearHistory }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div 
        className="glass-panel" 
        style={{ 
          width: '100%', 
          maxWidth: '420px', 
          height: '100vh', 
          borderRadius: 0, 
          borderLeft: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.75rem',
          boxShadow: '-20px 0 50px rgba(0,0,0,0.6)'
        }}
      >
        {/* Drawer Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <History size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff' }}>Verification History</h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* List of Scans */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingRight: '4px' }}>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-dim)', marginTop: '4rem' }}>
              <Clock size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
              <p style={{ fontSize: '0.9rem' }}>No past verifications yet.</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Analyzed articles will automatically appear here.</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id}
                onClick={() => { onSelectHistoryItem(item); onClose(); }}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
                className="sample-card-btn"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className={`verdict-pill ${item.verdict.badgeClass}`} style={{ fontSize: '0.62rem', padding: '2px 8px' }}>
                    {item.verdict.label}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: item.verdict.color }}>
                    {item.truthScore}/100
                  </span>
                </div>

                <p style={{ 
                  fontSize: '0.85rem', 
                  color: 'var(--text-main)', 
                  fontWeight: '500',
                  lineHeight: 1.4,
                  marginBottom: '0.6rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {item.inputText}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--accent-primary)' }}>
                    View details <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {history.length > 0 && (
          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-color)', marginTop: '1rem' }}>
            <button 
              onClick={onClearHistory}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
            >
              <Trash2 size={16} />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
