import React, { useState } from 'react';
import { Key, X, Check, Lock, Sparkles, Cpu, Globe } from 'lucide-react';

export default function ApiModal({ isOpen, onClose, apiSettings = {}, onSaveSettings }) {
  const [provider, setProvider] = useState(apiSettings.provider || 'gemini');
  const [geminiApiKey, setGeminiApiKey] = useState(apiSettings.geminiApiKey || apiSettings.apiKey || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveSettings({
      ...apiSettings,
      provider,
      geminiApiKey: geminiApiKey.trim(),
      apiKey: geminiApiKey.trim()
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-backdrop">
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={22} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff' }}>Google Gemini AI Settings</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'cursor' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.4rem' }}>
              Google Gemini API Key:
            </label>
            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="AIzaSy..."
              style={{
                width: '100%',
                background: 'rgba(10, 14, 23, 0.7)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                color: '#ffffff',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.3rem', display: 'block' }}>
              Get a free API key instantly at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)' }}>aistudio.google.com</a>
            </span>
          </div>

          <div style={{ 
            background: 'rgba(99, 102, 241, 0.08)', 
            border: '1px solid rgba(99, 102, 241, 0.2)', 
            borderRadius: '10px', 
            padding: '0.75rem 1rem', 
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.78rem',
            color: '#a5b4fc'
          }}>
            <Lock size={16} style={{ flexShrink: 0 }} />
            <span>Google Gemini API provides real-time multi-lingual AI fact checking across web knowledge sources.</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {saved ? <Check size={16} /> : <Key size={16} />}
              <span>{saved ? 'Saved!' : 'Save Key'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
