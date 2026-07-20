/**
 * TruthLens Google Gemini AI Integration Service
 * Uses Google Gemini 1.5 Flash API for accurate multi-lingual fake news detection
 */

export async function analyzeWithGemini({ text, apiKey }) {
  if (!apiKey) {
    throw new Error('Google Gemini API key required.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;

  const promptText = `You are TruthLens, an expert AI Fact-Checker and Misinformation Detector.
Analyze the following news text or claim in ANY language for factual accuracy.

Be strict, objective, and accurate:
- If the claim is fake news, a hoax, unverified miracle cure, or pseudoscience, set truthScore < 40 and verdictLabel to "FAKE NEWS".
- If the claim is true, backed by scientific consensus, official agencies, or factual events, set truthScore >= 70 and verdictLabel to "REAL NEWS".
- If unverified or mixed, set verdictLabel to "UNVERIFIED / MIXED".

Return ONLY a valid JSON object matching this schema:
{
  "truthScore": 15,
  "verdictLabel": "FAKE NEWS",
  "sourceName": "Unverified Social Media / Clickbait Post",
  "sourceCredibility": "Debunked Pseudoscience",
  "explanation": "This claim is false because clinical trials have proven that herbal tea cannot cure all chronic illnesses."
}

Text to analyze:
"""
${text}
"""`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7500);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptText }]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Google Gemini API error ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!jsonText) {
      throw new Error('No output returned from Google Gemini API.');
    }

    return JSON.parse(jsonText);
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}
