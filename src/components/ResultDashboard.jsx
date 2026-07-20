import React from 'react';
import { ShieldCheck, AlertTriangle, ExternalLink, RefreshCw, Globe, BookOpen, CheckCircle2, XCircle } from 'lucide-react';

export default function ResultDashboard({ analysis, onNewAnalysis }) {
  if (!analysis) return null;

  const { truthScore, verdict, inputText, redFlags, recommendedFactChecks, wikiData } = analysis;

  const isReal = truthScore >= 68;
  const isFake = truthScore < 40;

  const simpleLabel = isReal ? 'REAL NEWS' : isFake ? 'FAKE NEWS' : 'UNVERIFIED / MIXED';
  const themeColor = isReal ? '#10b981' : isFake ? '#ef4444' : '#eab308';
  const statusIcon = isReal ? <CheckCircle2 size={36} color="#10b981" /> : isFake ? <XCircle size={36} color="#ef4444" /> : <AlertTriangle size={36} color="#eab308" />;

  // Detect simple source origin
  let detectedSource = 'Unverified Social Media / Viral Post';
  let sourceCredibility = 'Requires Caution';

  const lowerText = inputText.toLowerCase();
  if (wikiData?.hasMatch) {
    detectedSource = `Wikipedia Knowledge Base ("${wikiData.title}")`;
    sourceCredibility = 'High Knowledge Consensus';
  } else if (lowerText.includes('nasa') || lowerText.includes('isro') || lowerText.includes('journal') || lowerText.includes('goddard')) {
    detectedSource = 'Official Space Agency / Research Journal';
    sourceCredibility = 'Verified Official Source';
  } else if (lowerText.includes('who') || lowerText.includes('cdc') || lowerText.includes('organization')) {
    detectedSource = 'World Health Organization (WHO)';
    sourceCredibility = 'Verified Global Health Body';
  } else if (lowerText.includes('miracle') || lowerText.includes('secret root') || lowerText.includes('big pharma')) {
    detectedSource = 'Anonymous Viral Post / Sensationalist Misinformation';
    sourceCredibility = 'Debunked Pseudoscience';
  }

  return (
    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem', textAlign: 'center' }}>
      {/* BIG SIMPLE VERDICT HEADER */}
      <div style={{
        background: `${themeColor}15`,
        border: `2px solid ${themeColor}50`,
        borderRadius: '20px',
        padding: '2rem 1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
          {statusIcon}
        </div>
        
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: themeColor, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
          This Is {simpleLabel}
        </h2>
        
        <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', maxWidth: '640px', margin: '0 auto', fontWeight: '500' }}>
          {verdict.subtext}
        </p>
      </div>

      {/* WIKIPEDIA VERIFICATION CARD (If match found) */}
      {wikiData?.hasMatch && (
        <div style={{
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: '700' }}>
              <BookOpen size={18} />
              <span>Wikipedia Verified Reference</span>
            </div>

            <a
              href={wikiData.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: '600' }}
            >
              <span>View Wikipedia Article</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.3rem' }}>
            {wikiData.title}
          </h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            "{wikiData.snippet}..."
          </p>
        </div>
      )}

      {/* 2 CARDS: SOURCE & EXPLANATION */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
        
        {/* Card 1: News Source Verification */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            <Globe size={18} />
            <span>Source Credibility</span>
          </div>
          
          <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.3rem' }}>
            {detectedSource}
          </h4>
          
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Authority Level: <strong style={{ color: isReal ? '#10b981' : '#f97316' }}>{sourceCredibility}</strong>
          </p>
        </div>

        {/* Card 2: Simple Reason Why */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            <ShieldCheck size={18} />
            <span>Why Is It {isReal ? 'Real' : 'Fake'}?</span>
          </div>
          
          <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {redFlags[0] || 'Verification complete.'}
          </p>
        </div>
      </div>

      {/* DIRECT FACT CHECK LINKS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <a
          href={recommendedFactChecks[0]?.url || 'https://www.snopes.com'}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          style={{ padding: '0.6rem 1.2rem', fontSize: '0.88rem' }}
        >
          <span>Verify on Snopes</span>
          <ExternalLink size={14} />
        </a>

        <button onClick={onNewAnalysis} className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.88rem' }}>
          <RefreshCw size={16} />
          <span>Check Another News</span>
        </button>
      </div>
    </div>
  );
}
