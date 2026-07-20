import React, { useEffect, useState } from 'react';
import { Cpu, Search, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';

const SCAN_STEPS = [
  { id: 1, text: 'Tokenizing article text & evaluating syntax structure...', icon: Cpu },
  { id: 2, text: 'Scanning for clickbait triggers & emotional sensationalism...', icon: ShieldAlert },
  { id: 3, text: 'Cross-referencing entities against trusted peer-reviewed data...', icon: Search },
  { id: 4, text: 'Generating Truth Score & Highlighted Claim breakdown...', icon: CheckCircle2 }
];

export default function ScanningModal({ isOpen }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < SCAN_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '2.25rem', textAlign: 'center' }}>
        {/* Animated Scanner Radar Glow */}
        <div style={{ position: 'relative', width: '90px', height: '90px', margin: '0 auto 1.5rem' }}>
          <div className="animate-pulse-glow" style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)'
          }} />
          <div className="animate-spin-slow" style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '2px dashed rgba(99, 102, 241, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Loader2 size={36} color="var(--accent-primary)" className="animate-spin" />
          </div>
        </div>

        <h3 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '0.5rem', color: '#ffffff' }}>
          Analyzing Credibility...
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
          Executing multi-layered NLP verification engine
        </p>

        {/* Steps List */}
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {SCAN_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div 
                key={step.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  background: isCurrent ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  border: isCurrent ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                  opacity: idx > currentStepIndex ? 0.4 : 1,
                  transition: 'var(--transition-fast)'
                }}
              >
                <div style={{ color: isDone ? '#10b981' : isCurrent ? 'var(--accent-primary)' : 'var(--text-dim)' }}>
                  {isDone ? <CheckCircle2 size={18} /> : <Icon size={18} className={isCurrent ? 'animate-pulse' : ''} />}
                </div>
                <span style={{ 
                  fontSize: '0.85rem', 
                  fontWeight: isCurrent ? '600' : '400',
                  color: isCurrent ? '#ffffff' : 'var(--text-muted)'
                }}>
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
