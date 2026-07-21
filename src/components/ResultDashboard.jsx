import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw, 
  Globe, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  History, 
  Clock, 
  Rocket, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';

export default function ResultDashboard({ analysis, onNewAnalysis }) {
  if (!analysis) return null;

  const { 
    truthScore, 
    verdict, 
    inputText, 
    historicalContext, 
    presentContext, 
    futurePlausibility, 
    redFlags = [], 
    recommendedFactChecks = [], 
    wikiData,
    sourceName,
    sourceCredibility,
    engine 
  } = analysis;

  const isReal = truthScore >= 68;
  const isFake = truthScore < 40;

  const simpleLabel = verdict?.label || (isReal ? 'REAL NEWS' : isFake ? 'FAKE NEWS' : 'UNVERIFIED / MIXED');
  const themeColor = isReal ? '#10b981' : isFake ? '#ef4444' : '#eab308';
  const statusIcon = isReal 
    ? <CheckCircle2 size={42} color="#10b981" /> 
    : isFake 
    ? <XCircle size={42} color="#ef4444" /> 
    : <AlertTriangle size={42} color="#eab308" />;

  const detectedSource = sourceName || (wikiData?.hasMatch ? `Wikipedia ("${wikiData.title}")` : 'Unverified Source Claim');
  const detectedCredibility = sourceCredibility || (isReal ? 'Verified Source' : isFake ? 'Debunked Pseudoscience' : 'Caution Advised');

  return (
    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem', textAlign: 'center' }}>
      
      {/* ENGINE BADGE */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.2rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.4rem', 
          background: engine?.includes('Gemini') ? 'rgba(99, 102, 241, 0.15)' : 'rgba(234, 179, 8, 0.15)',
          border: engine?.includes('Gemini') ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)',
          color: engine?.includes('Gemini') ? '#a5b4fc' : '#fde047',
          padding: '4px 14px',
          borderRadius: '50px',
          fontSize: '0.78rem',
          fontWeight: '700'
        }}>
          <Sparkles size={14} />
          <span>{engine || 'TruthLens Fact-Check Engine'}</span>
        </div>
      </div>

      {/* VERDICT HEADER CARD */}
      <div style={{
        background: `${themeColor}12`,
        border: `2px solid ${themeColor}40`,
        borderRadius: '20px',
        padding: '2rem 1.5rem',
        marginBottom: '2rem',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
          {statusIcon}
        </div>
        
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: themeColor, marginBottom: '0.4rem', textTransform: 'uppercase', tracking: '1px' }}>
          {simpleLabel}
        </h2>
        
        {/* TRUTH SCORE BAR */}
        <div style={{ maxWidth: '340px', margin: '1rem auto 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            <span>Credibility Score</span>
            <span style={{ color: themeColor, fontWeight: '800' }}>{truthScore} / 100</span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${truthScore}%`, height: '100%', background: themeColor, borderRadius: '10px', transition: 'width 0.8s ease-in-out' }} />
          </div>
        </div>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', maxWidth: '680px', margin: '0 auto', fontWeight: '500', lineHeight: 1.5 }}>
          {verdict.subtext}
        </p>
      </div>

      {/* 3 TIMELINE ANALYSIS CARDS: HISTORY, PRESENT, FUTURE */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '1rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Clock size={20} color="var(--accent-cyan)" />
        <span>Credibility Across Timeline (History, Present, Future)</span>
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem', textAlign: 'left' }}>
        
        {/* 1. History Analysis Card */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.35rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
            <History size={18} />
            <span>1. Historical Record & Context</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.55 }}>
            {historicalContext || 'Evaluating historical records and past precedence.'}
          </p>
        </div>

        {/* 2. Present Status Card */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.35rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
            <Globe size={18} />
            <span>2. Present Factual Consensus</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.55 }}>
            {presentContext || 'Evaluating current news reports and official statements today.'}
          </p>
        </div>

        {/* 3. Future Plausibility Card */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.35rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f472b6', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
            <Rocket size={18} />
            <span>3. Future Plausibility & Feasibility</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.55 }}>
            {futurePlausibility || 'Evaluating logical trajectory and scientific feasibility.'}
          </p>
        </div>

      </div>

      {/* WIKIPEDIA REFERENCE CARD (If match found) */}
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
              <span>Wikipedia Knowledge Verification</span>
            </div>

            <a
              href={wikiData.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: '600' }}
            >
              <span>View Wikipedia Entry</span>
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

      {/* RED FLAGS & SOURCE CREDIBILITY */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem', textAlign: 'left' }}>
        
        {/* Source Card */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.35rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            <ShieldCheck size={18} />
            <span>Detected Claim Origin</span>
          </div>
          
          <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.3rem' }}>
            {detectedSource}
          </h4>
          
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Authority Level: <strong style={{ color: isReal ? '#10b981' : '#f97316' }}>{detectedCredibility}</strong>
          </p>
        </div>

        {/* Red Flags Card */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.35rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isFake ? '#ef4444' : 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            <AlertCircle size={18} />
            <span>Key Findings & Red Flags</span>
          </div>

          <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.55 }}>
            {redFlags.map((flag, idx) => (
              <li key={idx} style={{ marginBottom: '0.3rem' }}>{flag}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* DIRECT FACT CHECK LINKS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <a
          href={recommendedFactChecks[0]?.url || `https://news.google.com/search?q=${encodeURIComponent(inputText.slice(0, 40))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          style={{ padding: '0.65rem 1.3rem', fontSize: '0.88rem' }}
        >
          <span>Verify on Google News</span>
          <ExternalLink size={14} />
        </a>

        <button onClick={onNewAnalysis} className="btn-primary" style={{ padding: '0.65rem 1.6rem', fontSize: '0.88rem' }}>
          <RefreshCw size={16} />
          <span>Check Another News</span>
        </button>
      </div>
    </div>
  );
}
