/**
 * TruthLens AI Fake News & Credibility Evaluation Engine
 * Supports Advanced Heuristic Pattern Scoring & Cloud AI / Local Ollama APIs
 */

import { analyzeWithOllama } from './ollamaService';
import { analyzeWithCloudAI } from './llmService';

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
    id: 'sample-suspicious-1',
    title: 'Bizarre Giant Pyramid Discovered Beneath Antarctic Ice Sheet by Satellite Imagery',
    category: 'Conspiracy / Unverified',
    type: 'Suspicious Claim',
    content: `Leaked satellite images taken over the South Pole appear to show a massive perfectly-symmetrical 4-sided pyramid structure buried deep beneath the Antarctic ice caps. 

Conspiracy theorists and self-proclaimed independent researchers claim this proves an ancient advanced civilization inhabited Antarctica thousands of years ago before a sudden pole shift covered it in ice. Officials from international Antarctic research groups have declined to comment, fueling speculation that governments are covering up extraterrestrial artifacts.`
  },
  {
    id: 'sample-real-2',
    title: 'World Health Organization Releases Updated Global Air Quality Guidelines',
    category: 'Public Health',
    type: 'Verified Real',
    content: `The World Health Organization (WHO) has released updated global air quality guidelines aimed at protecting populations from the harmful effects of air pollution. The new recommendations significantly lower recommended levels of key air pollutants, including fine particulate matter (PM2.5) and nitrogen dioxide (NO2).

"Air pollution is one of the biggest environmental threats to human health, alongside climate change," stated WHO Director-General Dr. Tedros Adhanom Ghebreyesus during a press briefing in Geneva. The report synthesizes evidence from hundreds of systematic scientific reviews conducted by independent environmental health panels over the past decade.`
  }
];

// Sensationalism & clickbait trigger phrases
const CLICKBAIT_TRIGGERS = [
  'shocking secret', 'they don\'t want you to know', 'banned from the internet',
  'miracle cure', 'instantly cure', '100% proven', 'doctors shocked',
  'you won\'t believe', 'mind blowing', 'secret government', 'big pharma hiding',
  'pure evil', 'illuminati', 'alien coverup', 'guaranteed miracle',
  'share before deleted', 'mainstream media hiding', 'conspiracy revealed',
  'magic pill', 'secret remedy', 'leaked photos prove', 'cures all',
  'eradicates every virus', 'magic root', 'throw away your prescription'
];

// Misinformation & Pseudoscience Keywords
const PSEUDOSCIENCE_KEYWORDS = [
  'miracle tea', 'secret laboratory', 'anonymous sources confirm',
  'eradicates cancer', 'instant cure', 'unbelievable breakthrough secret',
  'governments hiding', 'banned video', 'ancient alien technology',
  'flat earth', '5g temperature', 'microchips in vaccines'
];

// Reputable source attribution keywords
const REPUTABLE_ATTRIBUTIONS = [
  'published in', 'according to', 'peer-reviewed', 'university', 'researchers found',
  'study conducted by', 'official statement', 'spokesperson for', 'reuters',
  'associated press', 'nasa', 'who', 'cdc', 'journal of', 'data indicates',
  'court documents', 'press briefing', 'statistical analysis', 'goddard space flight'
];

// Emotional hyperbolic words
const HYPERBOLE_WORDS = [
  'disaster', 'horrifying', 'catastrophic', 'unbelievable', 'miraculous',
  'monstrous', 'unprecedented scandal', 'outrageous', 'total panic',
  'destroying everything', 'devastating truth', 'terrifying'
];

/**
 * Main Async Analysis Function
 * Checks API Key / Cloud LLM -> Ollama API -> Heuristic Fallback
 */
export async function analyzeNewsContentAsync(rawInput, inputType = 'text', apiSettings = {}) {
  const text = (rawInput || '').trim();

  if (!text) {
    throw new Error('Please provide news text, a headline, or article content to analyze.');
  }

  const { provider, apiKey, ollamaEndpoint, ollamaModel } = apiSettings;

  // 1. If user entered an API key, use Cloud AI LLM (OpenAI / Groq / OpenRouter)
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const cloudData = await analyzeWithCloudAI({ text, apiKey, provider });
      return formatAIResponse(cloudData, text, inputType, 'Cloud AI Engine (Llama 3 / GPT)');
    } catch (err) {
      console.warn('Cloud AI API call failed, trying local Ollama or Heuristic:', err.message);
    }
  }

  // 2. If provider is Ollama, call local Ollama API
  if (provider === 'ollama') {
    try {
      const ollamaData = await analyzeWithOllama({
        text,
        endpoint: ollamaEndpoint || 'http://localhost:11434',
        model: ollamaModel || 'llama3',
        apiKey: apiKey || ''
      });
      return formatAIResponse(ollamaData, text, inputType, `Ollama Local AI (${ollamaModel || 'llama3'})`);
    } catch (err) {
      console.warn('Ollama connection unavailable, falling back to heuristic engine:', err.message);
    }
  }

  // 3. Fallback to upgraded Heuristic NLP Analyzer
  return analyzeNewsContentHeuristic(text, inputType);
}

/**
 * Robust Heuristic NLP Analyzer
 */
export function analyzeNewsContentHeuristic(text, inputType = 'text') {
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const uppercaseWords = words.filter(w => w.length > 2 && w === w.toUpperCase() && /[A-Z]/.test(w));
  const capsRatio = wordCount > 0 ? (uppercaseWords.length / wordCount) * 100 : 0;
  const exclamations = (text.match(/!+/g) || []).length;
  const exclamationScore = Math.min(exclamations * 20, 100);

  const lowerText = text.toLowerCase();
  
  // Matched triggers & pseudoscience
  const matchedTriggers = CLICKBAIT_TRIGGERS.filter(t => lowerText.includes(t));
  const matchedPseudoscience = PSEUDOSCIENCE_KEYWORDS.filter(p => lowerText.includes(p));
  const matchedAttributions = REPUTABLE_ATTRIBUTIONS.filter(attr => lowerText.includes(attr));
  const matchedHyperbole = HYPERBOLE_WORDS.filter(w => lowerText.includes(w));

  const clickbaitScore = Math.min(matchedTriggers.length * 30 + matchedPseudoscience.length * 40, 100);
  const attributionScore = Math.min(matchedAttributions.length * 35 + (wordCount > 60 ? 15 : 0), 100);
  const hyperboleScore = Math.min(matchedHyperbole.length * 25, 100);

  const sensationalismIndex = Math.min(
    Math.round(capsRatio * 3.0 + exclamationScore * 0.4 + clickbaitScore * 0.5 + hyperboleScore * 0.3),
    100
  );

  // Dynamic Base Truth Score Calculation
  // Neutral baseline starts at 55
  let truthScore = 55;

  // Add points for legitimate peer-reviewed citations & official attributions
  truthScore += attributionScore * 0.45;

  // Heavy penalties for fake news triggers, miracle claims & pseudoscience
  truthScore -= matchedTriggers.length * 20;
  truthScore -= matchedPseudoscience.length * 25;
  truthScore -= (capsRatio > 10 ? 15 : 0);
  truthScore -= (exclamations > 2 ? 15 : 0);

  // Short snippet penalty if wild claims present
  if (wordCount < 20 && (matchedTriggers.length > 0 || matchedPseudoscience.length > 0)) {
    truthScore -= 30;
  }

  // Bound truth score strictly between 5 and 98
  truthScore = Math.max(5, Math.min(98, Math.round(truthScore)));

  // Verdict categorization
  let verdict = {
    label: 'VERIFIED REAL',
    subtext: 'High credibility, supported by objective citations and neutral tone.',
    badgeClass: 'badge-real',
    color: '#10b981',
    riskLevel: 'Low Risk'
  };

  if (truthScore >= 75 && truthScore < 90) {
    verdict = {
      label: 'LIKELY LEGITIMATE',
      subtext: 'Standard journalistic framing with moderate source indicators.',
      badgeClass: 'badge-likely',
      color: '#14b8a6',
      riskLevel: 'Low to Moderate Risk'
    };
  } else if (truthScore >= 50 && truthScore < 75) {
    verdict = {
      label: 'UNVERIFIED / MIXED CLAIMS',
      subtext: 'Contains unconfirmed assertions, subjective opinions, or missing primary sources.',
      badgeClass: 'badge-unverified',
      color: '#eab308',
      riskLevel: 'Moderate Caution Advised'
    };
  } else if (truthScore >= 30 && truthScore < 50) {
    verdict = {
      label: 'SUSPICIOUS / SENSATIONALIZED',
      subtext: 'Heavy clickbait language, high emotional manipulation, or lack of credible references.',
      badgeClass: 'badge-suspicious',
      color: '#f97316',
      riskLevel: 'High Risk of Misinformation'
    };
  } else if (truthScore < 30) {
    verdict = {
      label: 'HIGH RISK / DEBUNKED FAKE NEWS',
      subtext: 'Fabricated assertions, medical misinformation, extreme sensationalism, or conspiratorial claims detected.',
      badgeClass: 'badge-fake',
      color: '#ef4444',
      riskLevel: 'Critical Risk - Fabricated Claims'
    };
  }

  // Sentence highlights
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const sentenceHighlights = sentences.map(sentence => {
    const sLower = sentence.toLowerCase();
    let type = 'neutral';
    let note = 'Informational statement';

    const sClickbait = CLICKBAIT_TRIGGERS.some(t => sLower.includes(t)) || PSEUDOSCIENCE_KEYWORDS.some(p => sLower.includes(p));
    const sHyperbole = HYPERBOLE_WORDS.some(h => sLower.includes(h));
    const sAttr = REPUTABLE_ATTRIBUTIONS.some(a => sLower.includes(a));

    if (sClickbait || (sHyperbole && !sAttr)) {
      type = 'warning';
      note = 'Sensationalized framing or unverified medical/conspiracy claim';
    } else if (sAttr || /\b(percent|figures|data|study|report|announced|confirmed)\b/i.test(sentence)) {
      type = 'fact';
      note = 'Attributed fact or verifiable statement';
    } else if (/\b(everyone|always|never|100%|secret|miracle|guaranteed|cure)\b/i.test(sentence)) {
      type = 'unsubstantiated';
      note = 'Absolute assertion lacking clinical trial or primary source citation';
    }

    return { text: sentence.trim(), type, note };
  });

  const redFlags = [];
  if (matchedTriggers.length > 0) redFlags.push(`Contains recognized clickbait/misinformation phrases: "${matchedTriggers.slice(0, 3).join('", "')}".`);
  if (matchedPseudoscience.length > 0) redFlags.push(`Promotes unverified pseudoscience/conspiracy assertions: "${matchedPseudoscience.join('", "')}".`);
  if (capsRatio > 10) redFlags.push(`Excessive ALL CAPS words (${capsRatio.toFixed(1)}% of text) indicating emotional manipulation.`);
  if (exclamations > 2) redFlags.push(`Frequent exclamation marks (!), common in sensationalized fake news.`);
  if (matchedAttributions.length === 0 && wordCount > 25) redFlags.push(`Lacks verifiable attributions to official institutions, medical bodies, or named spokespersons.`);

  if (redFlags.length === 0) {
    redFlags.push('No obvious sensationalist or manipulative syntax patterns detected.');
  }

  const recommendedFactChecks = [
    { name: 'Snopes Fact Check Search', url: `https://www.snopes.com/search/${encodeURIComponent(text.slice(0, 40))}` },
    { name: 'FactCheck.org Database', url: `https://www.factcheck.org/search/#gsc.q=${encodeURIComponent(text.slice(0, 40))}` },
    { name: 'Reuters Fact Check', url: `https://www.reuters.com/site-search/?query=${encodeURIComponent(text.slice(0, 40))}` }
  ];

  return {
    timestamp: new Date().toISOString(),
    id: 'eval-' + Math.random().toString(36).substring(2, 9),
    inputText: text,
    inputType,
    wordCount,
    truthScore,
    verdict,
    metrics: {
      sensationalismIndex,
      attributionScore,
      clickbaitScore,
      hyperboleScore,
      capsRatio: Math.round(capsRatio)
    },
    sentenceHighlights,
    redFlags,
    matchedTriggers: [...matchedTriggers, ...matchedPseudoscience],
    recommendedFactChecks,
    engine: 'TruthLens NLP Misinformation Engine v3.0'
  };
}

/**
 * Formats structured AI LLM response into standard TruthLens schema
 */
function formatAIResponse(data, text, inputType, engineName) {
  const truthScore = Math.max(0, Math.min(100, data.truthScore ?? 50));
  const label = data.verdictLabel || (truthScore >= 75 ? 'VERIFIED REAL' : truthScore >= 50 ? 'UNVERIFIED' : 'HIGH RISK / FAKE NEWS');

  let badgeClass = 'badge-unverified';
  let color = '#eab308';
  if (truthScore >= 75) { badgeClass = 'badge-real'; color = '#10b981'; }
  else if (truthScore >= 55) { badgeClass = 'badge-likely'; color = '#14b8a6'; }
  else if (truthScore >= 35) { badgeClass = 'badge-suspicious'; color = '#f97316'; }
  else { badgeClass = 'badge-fake'; color = '#ef4444'; }

  const sentences = (data.sentenceHighlights && data.sentenceHighlights.length > 0)
    ? data.sentenceHighlights
    : (text.match(/[^.!?]+[.!?]+/g) || [text]).map(s => ({ text: s.trim(), type: 'neutral', note: 'Evaluated by AI' }));

  return {
    timestamp: new Date().toISOString(),
    id: 'ai-' + Math.random().toString(36).substring(2, 9),
    inputText: text,
    inputType,
    wordCount: text.split(/\s+/).filter(Boolean).length,
    truthScore,
    verdict: {
      label,
      subtext: `Evaluated by ${engineName}.`,
      badgeClass,
      color,
      riskLevel: data.riskLevel || 'AI Evaluated'
    },
    metrics: {
      sensationalismIndex: data.sensationalismIndex ?? Math.round((100 - truthScore) * 0.7),
      attributionScore: data.attributionScore ?? Math.round(truthScore * 0.8),
      clickbaitScore: Math.round((100 - truthScore) * 0.6),
      hyperboleScore: data.sensationalismIndex ?? 20,
      capsRatio: 0
    },
    sentenceHighlights: sentences,
    redFlags: data.redFlags || ['AI evaluation completed.'],
    matchedTriggers: [],
    recommendedFactChecks: [
      { name: 'Snopes Fact Check Search', url: `https://www.snopes.com/search/${encodeURIComponent(text.slice(0, 40))}` },
      { name: 'FactCheck.org Database', url: `https://www.factcheck.org/search/#gsc.q=${encodeURIComponent(text.slice(0, 40))}` },
      { name: 'Reuters Fact Check', url: `https://www.reuters.com/site-search/?query=${encodeURIComponent(text.slice(0, 40))}` }
    ],
    engine: engineName
  };
}
