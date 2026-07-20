/**
 * TruthLens Ollama Integration Service
 * Connects directly to local Ollama (http://localhost:11434) or remote Ollama servers
 * Includes AbortController timeout to prevent hanging when Ollama is offline.
 */

export async function analyzeWithOllama({ text, endpoint = 'http://localhost:11434', model = 'llama3', apiKey = '' }) {
  const cleanEndpoint = endpoint.replace(/\/+$/, '');
  const url = `${cleanEndpoint}/api/generate`;

  const systemPrompt = `You are TruthLens, an expert AI Fact-Checker and Fake News Detector.
Analyze the following news text and return a valid JSON object strictly matching this format:

{
  "truthScore": 85,
  "verdictLabel": "VERIFIED REAL",
  "riskLevel": "Low Risk",
  "sensationalismIndex": 15,
  "attributionScore": 80,
  "redFlags": [
    "Identified risk factor 1...",
    "Identified risk factor 2..."
  ],
  "sentenceHighlights": [
    { "text": "Sentence 1 text...", "type": "fact", "note": "Verified source citation" },
    { "text": "Sentence 2 text...", "type": "warning", "note": "Sensationalized framing" }
  ]
}

DO NOT include markdown codeblocks or extra conversational text outside the JSON object.

Text to analyze:
"""
${text}
"""`;

  const headers = {
    'Content-Type': 'application/json'
  };

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  // Set 3.5 second timeout to prevent infinite hanging when Ollama is offline
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        model: model || 'llama3',
        prompt: systemPrompt,
        stream: false,
        format: 'json'
      })
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Ollama API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawResponse = data.response;

    try {
      return JSON.parse(rawResponse);
    } catch (err) {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Could not parse JSON output from Ollama.');
    }
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Ollama connection timed out (server not responding at ' + endpoint + ')');
    }
    throw err;
  }
}
