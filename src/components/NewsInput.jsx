import React, { useState } from 'react';
import { Sparkles, AlertCircle, Upload, Image as ImageIcon, FileText, X } from 'lucide-react';
import { SAMPLE_ARTICLES } from '../utils/fakeNewsAnalyzer';
import { extractTextFromImage } from '../utils/ocrService';

export default function NewsInput({ onAnalyze, isLoading }) {
  const [mode, setMode] = useState('text'); // 'text' | 'image'
  const [textInput, setTextInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleImageSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }
    setError('');
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (mode === 'text') {
      if (!textInput.trim()) {
        setError('Please paste a news headline, text, or URL first.');
        return;
      }
      setError('');
      onAnalyze(textInput, textInput.startsWith('http') ? 'url' : 'text');
    } else {
      if (!selectedImage) {
        setError('Please select or drop a news screenshot image first.');
        return;
      }
      setError('');
      setIsOcrProcessing(true);

      try {
        const extractedText = await extractTextFromImage(selectedImage);
        onAnalyze(extractedText, 'image');
      } catch (err) {
        setError('Failed to read text from image. Please try another image.');
      } finally {
        setIsOcrProcessing(false);
      }
    }
  };

  const handleSelectSample = (sample) => {
    setMode('text');
    setTextInput(sample.content);
    setError('');
    onAnalyze(sample.content, 'sample');
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setError('');
  };

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
      {/* Mode Switcher Tabs */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
        <button
          type="button"
          className={`tab-button ${mode === 'text' ? 'active' : ''}`}
          onClick={() => { setMode('text'); setError(''); }}
        >
          <FileText size={16} />
          <span>Paste Text / Link</span>
        </button>

        <button
          type="button"
          className={`tab-button ${mode === 'image' ? 'active' : ''}`}
          onClick={() => { setMode('image'); setError(''); }}
        >
          <ImageIcon size={16} />
          <span>Upload News Screenshot</span>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Mode 1: Text / Link */}
        {mode === 'text' && (
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.6rem' }}>
              Paste News Article, Headline, or Web Link:
            </label>
            <textarea
              value={textInput}
              onChange={(e) => { setTextInput(e.target.value); setError(''); }}
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
        )}

        {/* Mode 2: Image Upload */}
        {mode === 'image' && (
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.6rem' }}>
              Upload Screenshot of News Article or Social Media Claim:
            </label>

            {!selectedImage ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById('news-image-input').click()}
                style={{
                  border: '2px dashed var(--border-color)',
                  borderRadius: '16px',
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  background: 'rgba(10, 14, 23, 0.5)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                <input
                  id="news-image-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => e.target.files && handleImageSelect(e.target.files[0])}
                />

                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <Upload size={26} />
                </div>

                <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '0.3rem' }}>
                  Click to select or drag & drop news screenshot
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  Supports PNG, JPG, WEBP screenshots from Twitter, WhatsApp, Facebook, or websites
                </p>
              </div>
            ) : (
              <div style={{
                background: 'rgba(10, 14, 23, 0.7)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img
                    src={imagePreview}
                    alt="News Screenshot"
                    style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--border-color)' }}
                  />
                  <div>
                    <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '0.2rem' }}>{selectedImage.name}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      {(selectedImage.size / 1024).toFixed(1)} KB — Ready to scan text in image
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={clearImage}
                  className="btn-secondary"
                  style={{ padding: '0.5rem', borderRadius: '50%' }}
                  title="Remove Image"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>
        )}

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

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading || isOcrProcessing}
            style={{ padding: '0.8rem 1.6rem', fontSize: '1rem' }}
          >
            <Sparkles size={18} />
            <span>
              {isOcrProcessing
                ? 'Reading Image Text...'
                : isLoading
                ? 'Checking Source...'
                : mode === 'image'
                ? 'Verify Image News'
                : 'Check If True Or Fake'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
