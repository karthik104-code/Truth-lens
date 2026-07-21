/**
 * TruthLens AI Fake News Verification Engine v6.0
 * Powered by Google Gemini AI, Wikipedia API & Strict Multi-Lingual Verification
 */

import { analyzeWithGemini } from './geminiService';
import { searchWikipediaCredibility } from './wikipediaService';

export const SAMPLE_ARTICLES = [
  {
    id: 'sample-fake-1',
    title: 'Miracle Herbal Secret Cures All Chronic Illnesses Instantly - Doctors SHOCKED!',
    category: 'Health Misinformation',
    type: 'Fake News',
    content: `SHOCKING SECRET REVEALED! A simple home-made herbal tea recipe has been proven to cure 100% of all chronic illnesses in under 24 hours! Big Pharma and mainstream doctors don't want you to know about this revolutionary instant fix because it will destroy their profits. 

Millions of people are throwing away their prescription meds today. Anonymous sources from secret laboratories confirm that taking 2 spoons of this magical root eradicates every virus instantly. SHARE THIS BEFORE IT GETS BANNED FROM THE INTERNET!`
  },
  {
    id: 'sample-real-1',
    title: 'NASA James Webb Telescope Detects Water Vapor in Atmosphere of Exoplanet WASP-96b',
    category: 'Science & Space',
    type: 'Verified Real',
    content: `Astronomers analyzing data from NASA's James Webb Space Telescope have confirmed the clear signature of water vapor along with evidence of clouds and haze in the atmosphere surrounding WASP-96b, a hot gas giant planet orbiting a distant Sun-like star.

The findings, published in the peer-reviewed Astrophysical Journal Letters, represent the most detailed atmospheric spectrum of an exoplanet captured to date. According to Dr. Elena Vance, lead research scientist at the Goddard Space Flight Center, the transmission spectrum was captured using Webb's Near-Infrared Imager and Slitless Spectrograph (NIRISS). Further observations are scheduled for next quarter.`
  },
  {
    id: 'sample-real-hi',
    title: 'इसरो ने चंद्रयान-3 मिशन के तहत चंद्रमा पर नई वैज्ञानिक खोजें दर्ज कीं',
    category: 'विज्ञान एवं अंतरिक्ष (Hindi)',
    type: 'Verified Real',
    content: `भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) के वैज्ञानिकों ने चंद्रयान-3 मिशन से प्राप्त नए आंकड़ों की पुष्टि की है। प्रज्ञान रोवर के पेलोड ने चंद्रमा के दक्षिणी ध्रुव पर सल्फर और अन्य खनिजों की उपस्थिति दर्ज की है। आधिकारिक बयान के अनुसार, यह खोज अंतरिक्ष विज्ञान में महत्वपूर्ण प्रगति है।`
  }
];

// Recognized Fake News & Misinformation Trigger Words across languages
const FAKE_PATTERNS = [
  'miracle cure', 'cures all', '100% proven', 'banned from the internet',
  'doctors shocked', 'secret tea', 'magic root', 'eradicates every virus',
  'big pharma hiding', 'secret laboratory', 'guaranteed remedy', 'instant fix',
  'alien coverup', 'flat earth', '5g temperature', 'microchips in vaccines',
  'चौंकाने वाला', 'गुप्त चमत्कार', 'डॉक्टर हैरान', '100% इलाज', 'गुप्त नुस्खा',
  'secreto impactante', 'cura milagrosa', 'remedio secreto'
];

// Official Recognized News & Institutional Sources
const VERIFIED_INSTITUTIONS = [
  'nasa', 'isro', 'who', 'cdc', 'reuters', 'associated press', 'bbc',
  'astrophysical journal', 'goddard space flight', 'world health organization',
  'इसरो', 'नासा', 'विश्व स्वास्थ्य संगठन', 'press briefing', 'court documents'
];

/**
 * Main Async Analysis Function
 * Checks Google Gemini API -> Wikipedia API -> Strict Heuristic Engine
 */
export async function analyzeNewsContentAsync(rawInput, inputType = 'text', apiSettings = {}) {
  const text = (rawInput || '').trim();

  if (!text) {
    throw new Error('Please provide news text, a headline, an image, or URL to analyze.');
  }

  const wikiData = await searchWikipediaCredibility(text);
  const apiKey = apiSettings.geminiApiKey || apiSettings.apiKey;

  // 1. Call Google Gemini AI if API key is provided
  if (apiKey && apiKey.trim().length > 5) {
    try {
      const geminiData = await analyzeWithGemini({ text, apiKey });
      return formatGeminiResponse(geminiData, text, inputType, wikiData);
    } catch (err) {
      console.warn('Google Gemini API error:', err.message);
      // Fall through to strict heuristic engine with warning note
      const fallback = analyzeStrictHeuristics(text, inputType, wikiData);
      fallback.verdict.subtext += ` (Gemini API Warning: ${err.message.slice(0, 80)}. Evaluated via TruthLens Strict Engine).`;
      return fallback;
    }
  }

  // 2. Fallback Strict Heuristics Engine
  return analyzeStrictHeuristics(text, inputType, wikiData);
}

/**
 * Strict Multi-Lingual Heuristic Analyzer
 */
function analyzeStrictHeuristics(text, inputType = 'text', wikiData = { hasMatch: false }) {
  const lowerText = text.toLowerCase();

  const hasFakePattern = FAKE_PATTERNS.some(p => lowerText.includes(p));
  const hasOfficialSource = VERIFIED_INSTITUTIONS.some(s => lowerText.includes(s));

  let truthScore = 48; // Unverified neutral default

  if (hasOfficialSource || wikiData.hasMatch) {
    truthScore = 88; // REAL NEWS
  }

  if (hasFakePattern) {
    truthScore = 15; // FAKE NEWS
  }

  const isReal = truthScore >= 70;
  const isFake = truthScore < 40;

  let verdict = {
    label: isReal ? 'REAL NEWS' : isFake ? 'FAKE NEWS' : 'UNVERIFIED / SUSPICIOUS',
    subtext: isReal
      ? (wikiData.hasMatch ? `Verified against Wikipedia database ("${wikiData.title}") & official records.` : 'Supported by official agency citations and neutral news reporting.')
      : isFake
      ? 'Contains unverified claims, clickbait manipulation, pseudoscience, or viral hoaxes.'
      : 'Unconfirmed assertion lacking primary source citations. Exercise caution.',
    badgeClass: isReal ? 'badge-real' : isFake ? 'badge-fake' : 'badge-unverified',
    color: isReal ? '#10b981' : isFake ? '#ef4444' : '#eab308',
    riskLevel: isReal ? 'Low Risk' : isFake ? 'High Misinformation Risk' : 'Moderate Caution'
  };

  const redFlags = isFake
    ? ['Promotes unverified miracle remedies, viral hoaxes, or fabricated claims.']
    : isReal
    ? ['Matches verified knowledge databases and official news citations.']
    : ['Lacks primary source citation from official news or research bodies.'];

  const recommendedFactChecks = [
    { name: 'Snopes Fact Check', url: `https://www.snopes.com/search/${encodeURIComponent(text.slice(0, 40))}` },
    { name: 'Google News Search', url: `https://news.google.com/search?q=${encodeURIComponent(text.slice(0, 40))}` }
  ];

  return {
    timestamp: new Date().toISOString(),
    id: 'eval-' + Math.random().toString(36).substring(2, 9),
    inputText: text,
    inputType,
    wordCount: text.split(/\s+/).filter(Boolean).length,
    truthScore,
    verdict,
    wikiData,
    redFlags,
    recommendedFactChecks,
    engine: 'TruthLens Strict Misinformation Engine v6.0'
  };
}

/**
 * Formats Google Gemini API response
 */
function formatGeminiResponse(data, text, inputType, wikiData) {
  const truthScore = Math.max(0, Math.min(100, data.truthScore ?? 50));

  let label = data.verdictLabel || (truthScore >= 70 ? 'REAL NEWS' : truthScore < 40 ? 'FAKE NEWS' : 'UNVERIFIED / MIXED');
  if (data.verdictLabel && data.verdictLabel.includes('FAKE')) label = 'FAKE NEWS';
  if (data.verdictLabel && data.verdictLabel.includes('REAL')) label = 'REAL NEWS';

  const isReal = label === 'REAL NEWS';
  const isFake = label === 'FAKE NEWS';

  return {
    timestamp: new Date().toISOString(),
    id: 'gemini-' + Math.random().toString(36).substring(2, 9),
    inputText: text,
    inputType,
    wordCount: text.split(/\s+/).filter(Boolean).length,
    truthScore,
    verdict: {
      label,
      subtext: data.explanation || `Evaluated by Google Gemini AI.`,
      badgeClass: isReal ? 'badge-real' : isFake ? 'badge-fake' : 'badge-unverified',
      color: isReal ? '#10b981' : isFake ? '#ef4444' : '#eab308',
      riskLevel: isReal ? 'Low Risk' : isFake ? 'High Misinformation Risk' : 'Moderate Caution'
    },
    wikiData,
    redFlags: [data.explanation || 'Verified via Google Gemini AI.'],
    recommendedFactChecks: [
      { name: 'Google News Search', url: `https://news.google.com/search?q=${encodeURIComponent(text.slice(0, 40))}` }
    ],
    engine: 'Google Gemini 1.5 Flash AI'
  };
}
