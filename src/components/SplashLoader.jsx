import React, { useEffect, useState } from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

export default function SplashLoader({ onComplete }) {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Start fading out after 1.8 seconds
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, 1800);

    // Complete splash screen after 2.3 seconds
    const endTimer = setTimeout(() => {
      onComplete();
    }, 2300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#070a12',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadingOut ? 0 : 1,
        transform: fadingOut ? 'scale(1.05)' : 'scale(1)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        pointerEvents: fadingOut ? 'none' : 'auto'
      }}
    >
      {/* Radial Glow Background */}
      <div style={{
        position: 'absolute',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
        filter: 'blur(30px)',
        animation: 'pulseGlow 2s ease-in-out infinite'
      }} />

      {/* Animated Shield Logo with Orbit Ring */}
      <div style={{ position: 'relative', width: '110px', height: '110px', marginBottom: '1.75rem' }}>
        {/* Rotating Outer Ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '2px dashed rgba(99, 102, 241, 0.6)',
          animation: 'spinSlow 8s linear infinite'
        }} />

        {/* Counter Rotating Ring */}
        <div style={{
          position: 'absolute',
          inset: '-8px',
          borderRadius: '50%',
          border: '1.5px solid rgba(16, 185, 129, 0.4)',
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          animation: 'spinSlow 5s linear infinite reverse'
        }} />

        {/* Inner Glowing Icon Badge */}
        <div style={{
          position: 'absolute',
          inset: '10px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 35px rgba(99, 102, 241, 0.7)'
        }}>
          <ShieldCheck size={48} color="#ffffff" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' }} />
        </div>
      </div>

      {/* App Title Text Reveal */}
      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: '800', 
        color: '#ffffff', 
        letterSpacing: '-0.03em',
        marginBottom: '0.4rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        Truth<span className="gradient-text">Lens</span>
      </h1>

      {/* Subtitle Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        fontWeight: '500',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '0.35rem 0.9rem',
        borderRadius: '50px',
        border: '1px solid var(--border-color)'
      }}>
        <Sparkles size={14} color="var(--accent-cyan)" />
        <span>Verifying News Authenticity & Sources...</span>
      </div>
    </div>
  );
}
