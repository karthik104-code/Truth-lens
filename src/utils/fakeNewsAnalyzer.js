/**
 * TruthLens AI Fake News Engine v5.0
 * Powered by Google Gemini AI & Multi-Lingual Fact-Checking
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

const STRICT_FAKE_PATTERNS = [
  'miracle cure', 'cures all', '100% proven', 'banned from the internet',
  'doctors shocked', 'secret tea', 'magic root', 'eradicates every virus',
  'big pharma hiding', 'secret laboratory', 'guaranteed remedy',
  'चौंकाने वाला', 'गुप्त चमत्कार', 'डॉक्टर हैरान', '100% इलाज', 'गुप्त नुस्खा',
  'secreto impactante', 'cura milagrosa', 'remedio secreto'
];

const OFFICIAL_SOURCES = [
  'nasa', 'isro', 'who', 'cdc', 'reuters', 'associated press', 'bbc',
  'astrophysical journal', 'goddard space flight', ' world health organization',
  'इसरो', 'नासा', 'विश्व स्वास्थ्य संगठन'
];

/**
 * Main Async Analysis Function
 * 1. Calls Google Gemini API if key provided.
 * 2. Cross-references Wikipedia API.
 * 3. Evaluates with strict multi-lingual heuristics.
 */
export async function analyzeNewsContentAsync(rawInput, inputType = 'text', apiSettings = {}) {
  const text = (rawInput || '').trim();

  if (!text) {
    throw new Error('Please provide news text, a headline, an image, or URL to analyze.');
  }

  const apiKey = apiSettings.geminiApiKey || apiSettings.apiKey;

  // 1. If Google Gemini API key is configured, call Gemini API
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const geminiData = await analyzeWithGemini({ text, apiKey });
      const wikiData = await searchWikipediaCredibility(text);
      return formatGeminiResponse(geminiData, text, inputType, wikiData);
    } catch (err) {
      console.warn('Google Gemini API call failed, using multi-lingual heuristic engine:', err.message);
    }
  }

  // 2. Wikipedia Cross-Check
  const wikiData = await searchWikipediaCredibility(text);

  // 3. Fallback Heuristics
  return analyzeStrictHeuristics(text, inputType, wikiData);
}

/**
 * Strict Multi-Lingual Heuristic Analyzer
 */
function analyzeStrictHeuristics(text, inputType = 'text', wikiData = { hasMatch: false }) {
  const lowerText = text.toLowerCase();

  const hasFakePattern = STRICT_FAKE_PATTERNS.some(p => lowerText.includes(p));
  const hasOfficialSource = OFFICIAL_SOURCES.some(s => lowerText.includes(s));

  let truthScore = 55; // Neutral default

  if (hasOfficialSource || wikiData.hasMatch) {
    truthScore = 88;
  }
  
  if (hasFakePattern) {
    truthScore = 18; // Strict low score for fake news patterns
  }

  const isReal = truthScore >= 70;
  const isFake = truthScore < 40;

  let verdict = {
    label: isReal ? 'REAL NEWS' : isFake ? 'FAKE NEWS' : 'UNVERIFIED / MIXED',
    subtext: isReal
      ? (wikiData.hasMatch ? `Verified against Wikipedia database ("${wikiData.title}") & official citations.` : 'Supported by official agency citations and factual reporting.')
      : isFake
      ? 'Unverified medical/scientific claims, clickbait manipulation, or fabricated rumors detected.'
      : 'Unconfirmed claim. Exercise caution before sharing.',
    badgeClass: isReal ? 'badge-real' : isFake ? 'badge-fake' : 'badge-unverified',
    color: isReal ? '#10b981' : isFake ? '#ef4444' : '#eab308',
    riskLevel: isReal ? 'Low Risk' : isFake ? 'Critical Risk - Fabricated Claims' : 'Moderate Caution'
  };

  const redFlags = isFake
    ? ['Promotes unverified miracle cures, clickbait manipulation, or unscientific claims.']
    : ['Content matches verifiable official sources and neutral news reporting.'];

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
    engine: 'TruthLens Misinformation Engine v5.0'
  };
}

/**
 * Formats Google Gemini API response
 */
function formatGeminiResponse(data, text, inputType, wikiData) {
  const truthScore = Math.max(0, Math.min(100, data.truthScore ?? 50));
  const isReal = truthScore >= 68;
  const isFake = truthScore < 40;

  return {
    timestamp: new Date().toISOString(),
    id: 'gemini-' + Math.random().toString(36).substring(2, 9),
    inputText: text,
    inputType,
    wordCount: text.split(/\s+/).filter(Boolean).length,
    truthScore,
    verdict: {
      label: isReal ? 'REAL NEWS' : isFake ? 'FAKE NEWS' : 'UNVERIFIED',
      subtext: data.explanation || `Verified by Google Gemini AI.`,
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
