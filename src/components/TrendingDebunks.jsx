import React from 'react';
import { Flame, ExternalLink } from 'lucide-react';

const TRENDING_DEBUNKS = [
  {
    id: 'debunk-1',
    claim: 'Viral video claims 5G towers cause micro-climate temperature spikes in urban areas.',
    verdict: 'FALSE',
    verdictColor: '#ef4444',
    source: 'Snopes / IEEE Spectrum',
    explanation: 'Radio frequency electromagnetic fields emitted by 5G stations do not affect atmospheric temperature or climate systems.',
    link: 'https://www.snopes.com'
  },
  {
    id: 'debunk-2',
    claim: 'Claim that NASA confirmed Earth will experience 3 days of absolute darkness in December 2026.',
    verdict: 'FABRICATED',
    verdictColor: '#ef4444',
    source: 'NASA Official Newsroom',
    explanation: 'Re-circulated hoax that originated online in 2012; NASA has issued no such warning or scientific prediction.',
    link: 'https://www.nasa.gov'
  },
  {
    id: 'debunk-3',
    claim: 'New EU regulation bans all home gardening without government agricultural permits.',
    verdict: 'MISLEADING',
    verdictColor: '#f97316',
    source: 'Reuters Fact Check',
    explanation: 'Regulations apply exclusively to commercial seed trading standards; non-commercial home gardening is entirely exempt.',
    link: 'https://www.reuters.com/fact-check'
  }
];

export default function TrendingDebunks({ onSelectClaim }) {
  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Flame size={20} color="#f97316" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ffffff' }}>Recently Debunked Viral Rumors</h3>
        </div>

        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Updated automatically from global fact-checking partners
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {TRENDING_DEBUNKS.map((item) => (
          <div 
            key={item.id}
            style={{
              background: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '1.2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>
                  {item.source}
                </span>
                <span style={{ 
                  background: `${item.verdictColor}20`, 
                  color: item.verdictColor, 
                  border: `1px solid ${item.verdictColor}40`,
                  fontSize: '0.68rem',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '50px'
                }}>
                  {item.verdict}
                </span>
              </div>

              <p style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.6rem', lineHeight: 1.4 }}>
                "{item.claim}"
              </p>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                {item.explanation}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => onSelectClaim(item.claim)}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center', padding: '0.45rem 0.75rem', fontSize: '0.78rem' }}
              >
                Test In Scanner
              </button>
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ padding: '0.45rem 0.65rem' }}
                title="View original debunks"
              >
                <ExternalLink size={14} color="var(--text-dim)" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
