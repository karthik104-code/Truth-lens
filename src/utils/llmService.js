/**
 * TruthLens Multi-Provider LLM Service
 * Supports Groq / OpenAI / OpenRouter Cloud APIs & Local Ollama
 */

export async function analyzeWithCloudAI({ text, apiKey, provider = 'openai' }) {
  if (!apiKey) {
    throw new Error('No API key provided.');
  }

  // Determine endpoint & model based on key format / provider
  let endpoint = 'https://api.openai.com/v1/chat/completions';
  let model = 'gpt-4o-mini';

  // If key contains groq style format or user selected groq
  if (apiKey.startsWith('gsk_') || provider === 'groq') {
    endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    model = 'llama-3.1-8b-instant';
  } else if (provider === 'openrouter' || apiKey.startsWith('sk-or-')) {
    endpoint = 'https://openrouter.ai/api/v1/chat/completions';
    model = 'meta-llama/llama-3.1-8b-instruct:free';
  }

  const prompt = `You are TruthLens, an expert AI Fact-Checker and Misinformation Detector.
Analyze the following news text for factual accuracy, sensationalism, clickbait, and misinformation.

Be strict and objective:
- If the claim promotes unverified miracle cures, anti-scientific conspiracies, fabricated rumors, or debunked hoaxes, give a LOW Truth Score (0 - 35).
- If the claim is backed by official scientific consensus, peer-reviewed journals, or reputable news agencies, give a HIGH Truth Score (75 - 100).
- If it is unverified or mixed opinion, give a MEDIUM Truth Score (40 - 70).

Return ONLY a raw valid JSON object (no markdown codeblocks) with this exact schema:
{
  "truthScore": 25,
  "verdictLabel": "HIGH RISK / DEBUNKED FAKE NEWS",
  "riskLevel": "Critical Risk - Fabricated Claims",
  "sensationalismIndex": 85,
  "attributionScore": 10,
  "redFlags": [
    "Promotes unverified miracle health cures without clinical trials",
    "Uses manipulative clickbait language to drive shares"
  ],
  "sentenceHighlights": [
    { "text": "Sentence 1 text...", "type": "warning", "note": "Unverified medical assertion" }
  ]
}

Text to analyze:
"""
${text}
"""`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Cloud AI API HTTP error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from AI model.');
    }

    return JSON.parse(content);
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}
