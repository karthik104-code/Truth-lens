import React, { useState } from 'react';
import { Key, X, Check, Shield, Lock, Cpu, Server, Sparkles } from 'lucide-react';

export default function ApiModal({ isOpen, onClose, apiSettings = {}, onSaveSettings }) {
  const [provider, setProvider] = useState(apiSettings.provider || 'ollama');
  const [ollamaEndpoint, setOllamaEndpoint] = useState(apiSettings.ollamaEndpoint || 'http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState(apiSettings.ollamaModel || 'llama3');
  const [apiKey, setApiKey] = useState(apiSettings.apiKey || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveSettings({
      provider,
      ollamaEndpoint: ollamaEndpoint.trim(),
      ollamaModel: ollamaModel.trim(),
      apiKey: apiKey.trim()
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-backdrop">
      <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Cpu size={22} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff' }}>AI Engine & Provider Settings</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          {/* Provider Selection */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Select Verification AI Engine:
            </label>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {/* Option 1: Ollama */}
              <button
                type="button"
                onClick={() => setProvider('ollama')}
                style={{
                  background: provider === 'ollama' ? 'rgba(99, 102, 241, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                  border: provider === 'ollama' ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '0.85rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: 'var(--text-main)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>🦙 Ollama (Local AI)</span>
                  <span style={{ fontSize: '0.62rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>FREE / NO LIMITS</span>
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Longlasting, zero cost, completely private & offline compatible.</p>
              </button>

              {/* Option 2: Built-in Heuristic NLP */}
              <button
                type="button"
                onClick={() => setProvider('nlp')}
                style={{
                  background: provider === 'nlp' ? 'rgba(99, 102, 241, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                  border: provider === 'nlp' ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '0.85rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: 'var(--text-main)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>⚡ Built-in NLP</span>
                  <span style={{ fontSize: '0.62rem', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>INSTANT</span>
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Fast heuristic syntax scanner running inside browser.</p>
              </button>
            </div>
          </div>

          {/* Ollama Options */}
          {provider === 'ollama' && (
            <div style={{ background: 'rgba(10, 14, 23, 0.5)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Ollama Server Endpoint URL:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Server size={16} color="var(--accent-cyan)" />
                  <input
                    type="text"
                    value={ollamaEndpoint}
                    onChange={(e) => setOllamaEndpoint(e.target.value)}
                    placeholder="http://localhost:11434"
                    style={{
                      flex: 1,
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '0.55rem 0.85rem',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Ollama Local Model Name:
                </label>
                <input
                  type="text"
                  value={ollamaModel}
                  onChange={(e) => setOllamaModel(e.target.value)}
                  placeholder="llama3, mistral, gemma2, or phi3"
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.55rem 0.85rem',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  Tip: Ensure model is installed locally via <code>ollama pull {ollamaModel || 'llama3'}</code>
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  Optional Remote API Key (If hosted behind auth proxy):
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Optional API key..."
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.55rem 0.85rem',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          )}

          {/* Privacy Note */}
          <div style={{ 
            background: 'rgba(99, 102, 241, 0.08)', 
            border: '1px solid rgba(99, 102, 241, 0.2)', 
            borderRadius: '10px', 
            padding: '0.75rem 1rem', 
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.78rem',
            color: '#a5b4fc'
          }}>
            <Lock size={16} style={{ flexShrink: 0 }} />
            <span>Ollama allows 100% longlasting, free local AI model execution right on your machine with zero subscription fees.</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {saved ? <Check size={16} /> : <Key size={16} />}
              <span>{saved ? 'Saved!' : 'Save Engine Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
