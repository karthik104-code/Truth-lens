import React, { useState } from 'react';
import { Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { SAMPLE_ARTICLES } from '../utils/fakeNewsAnalyzer';

export default function NewsInput({ onAnalyze, isLoading }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim()) {
      setError('Please paste a news headline, text, or URL first.');
      return;
    }
    setError('');
    onAnalyze(input, input.startsWith('http') ? 'url' : 'text');
  };

  const handleSelectSample = (sample) => {
    setInput(sample.content);
    setError('');
    onAnalyze(sample.content, 'sample');
  };

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.6rem' }}>
            Paste News Article, Headline, or Web Link:
          </label>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(''); }}
            placeholder="Example: 'Miracle tea cures all illnesses...' or paste a news URL link here"
            rows={5}
            style={{
              width: '100%',
              background: 'rgba(10, 14, 23, 0.7)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '1.2rem',
              color: '#ffffff',
              fontSize: '1rem',
              lineHeight: 1.6,
              outline: 'none',
              resize: 'vertical'
            }}
          />
        </div>

        {error && (
          <div style={{ 
            marginBottom: '1rem', 
            padding: '0.75rem 1rem', 
            borderRadius: '10px', 
            background: 'rgba(239, 68, 68, 0.15)', 
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', alignSelf: 'center', marginRight: '0.2rem' }}>Try example:</span>
            <button
              type="button"
              onClick={() => handleSelectSample(SAMPLE_ARTICLES[0])}
              className="btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}
            >
              ❌ Fake News Sample
            </button>
            <button
              type="button"
              onClick={() => handleSelectSample(SAMPLE_ARTICLES[1])}
              className="btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}
            >
              ✅ Real News Sample
            </button>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading} style={{ padding: '0.8rem 1.6rem', fontSize: '1rem' }}>
            <Sparkles size={18} />
            <span>{isLoading ? 'Checking Source...' : 'Check If True Or Fake'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
