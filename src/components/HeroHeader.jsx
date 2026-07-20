import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function HeroHeader() {
  return (
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 1rem',
        borderRadius: '50px',
        background: 'rgba(99, 102, 241, 0.12)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        color: '#a5b4fc',
        fontSize: '0.85rem',
        fontWeight: '600',
        marginBottom: '1rem'
      }}>
        <ShieldCheck size={16} color="#818cf8" />
        <span>Instant Fake News & Source Verifier</span>
      </div>

      <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.75rem', lineHeight: 1.2 }}>
        Is It <span style={{ color: '#10b981' }}>Real</span> or <span style={{ color: '#ef4444' }}>Fake</span>?
      </h2>

      <p style={{ 
        maxWidth: '560px', 
        margin: '0 auto', 
        fontSize: '1rem', 
        color: 'var(--text-muted)',
        lineHeight: 1.5
      }}>
        Paste any news headline, text, or link below. We check the original news source and instantly tell you if it's true or false.
      </p>
    </div>
  );
}
