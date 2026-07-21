/**
 * TruthLens Google Gemini AI Service
 * Performs live web search & historical fact checking via Google Gemini API
 */

export async function analyzeWithGemini({ text, apiKey }) {
  if (!apiKey || apiKey.trim().length < 5) {
    throw new Error('Google Gemini API key is missing. Please enter your API key in the navbar settings.');
  }

  const cleanKey = apiKey.trim();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${cleanKey}`;

  const promptText = `You are TruthLens, an elite AI Fact-Checker and Misinformation Verifier.
Analyze the following news text, headline, or claim for factual truth across past historical records, present real-world events, and scientific consensus.

STRICT EVALUATION RULES:
1. Is this claim REAL or FAKE?
   - If the claim is fake news, a viral hoax, unverified miracle cure, fabricated rumor, clickbait, or pseudoscience, set "verdictLabel" to "FAKE NEWS" and "truthScore" between 5 and 35.
   - If the claim is factual, reported by official news organizations (Reuters, AP, BBC, ISRO, NASA, WHO) or established history, set "verdictLabel" to "REAL NEWS" and "truthScore" between 80 and 98.
   - If it is unconfirmed or speculative, set "verdictLabel" to "UNVERIFIED / MIXED" and "truthScore" between 40 and 65.

2. Provide the identified news source and 1-2 simple plain English sentences explaining exactly why it is REAL or FAKE based on facts.

Return ONLY a raw valid JSON object (no markdown formatting or extra text) with this exact schema:
{
  "truthScore": 15,
  "verdictLabel": "FAKE NEWS",
  "sourceName": "Unverified Social Media Post / Clickbait Blog",
  "sourceCredibility": "Debunked Misinformation",
  "explanation": "This claim is fake. Official records and scientific consensus confirm that..."
}

Text to analyze:
"""
${text}
"""`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

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
        tools: [
          { googleSearch: {} }
        ],
        generationConfig: {
          temperature: 0.1
        }
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.text();
      // If googleSearch tool is not supported on this endpoint version, retry without tools
      if (errBody.includes('tools') || response.status === 400) {
        return await retryGeminiWithoutTools(url, promptText);
      }
      throw new Error(`Google Gemini API error (${response.status}): ${errBody}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const rawContent = candidate?.content?.parts?.[0]?.text;

    if (!rawContent) {
      throw new Error('Empty response from Gemini API.');
    }

    return parseGeminiJsonResponse(rawContent);
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.message.includes('tools') || err.message.includes('400')) {
      return await retryGeminiWithoutTools(url, promptText);
    }
    throw err;
  }
}

/**
 * Fallback request without search tool if key/endpoint doesn't support tools
 */
async function retryGeminiWithoutTools(url, promptText) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API Error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return parseGeminiJsonResponse(rawText);
}

function parseGeminiJsonResponse(rawText) {
  if (!rawText) throw new Error('No text output from Gemini.');
  try {
    return JSON.parse(rawText);
  } catch (e) {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse JSON response from Gemini API.');
  }
}
