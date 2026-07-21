/**
 * TruthLens Multi-Lingual Wikipedia Verification Service
 * Cross-references news claims and entities against Wikipedia database in any language.
 */

export async function searchWikipediaCredibility(queryText) {
  if (!queryText || queryText.length < 5) {
    return { hasMatch: false, snippet: null };
  }

  // Filter out clickbait/sensational words to extract core subject
  const cleanedText = queryText
    .replace(/\b(miracle|shocked|shocking|secret|banned|100%|instant|instantly|cure|cures|guaranteed|hidden|hiding|banned from the internet)\b/gi, '')
    .trim();

  const words = cleanedText.split(/\s+/).filter(w => w.length > 2);
  if (words.length === 0) {
    return { hasMatch: false, snippet: null };
  }

  const searchTerm = words.slice(0, 5).join(' ').replace(/[^\w\s\u0600-\u06FF\u0900-\u097F\u4e00-\u9fff]/gi, '');

  if (!searchTerm || searchTerm.length < 3) {
    return { hasMatch: false, snippet: null };
  }

  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);

    if (!searchRes.ok) {
      return { hasMatch: false, snippet: null };
    }

    const searchData = await searchRes.json();
    const results = searchData.query?.search;

    if (results && results.length > 0) {
      const topMatch = results[0];
      const pageTitle = topMatch.title.toLowerCase();
      const searchLower = searchTerm.toLowerCase();

      // Check if title or snippet closely matches search entities (not just generic words)
      const searchTokens = searchLower.split(/\s+/);
      const matchingTokens = searchTokens.filter(t => pageTitle.includes(t));
      const matchRatio = matchingTokens.length / searchTokens.length;

      // Only count as high-confidence match if at least 60% of search entity tokens match the title
      if (matchRatio >= 0.6 || pageTitle.includes(searchLower)) {
        const cleanSnippet = topMatch.snippet.replace(/<[^>]*>?/gm, '');

        return {
          hasMatch: true,
          title: topMatch.title,
          snippet: cleanSnippet,
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(topMatch.title)}`,
          matchRatio
        };
      }
    }
  } catch (err) {
    console.warn('Wikipedia API lookup error:', err.message);
  }

  return { hasMatch: false, snippet: null };
}
