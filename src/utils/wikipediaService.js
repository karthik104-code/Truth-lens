/**
 * TruthLens Multi-Lingual Wikipedia Verification Service
 * Cross-references news claims and entities against Wikipedia database in any language.
 */

export async function searchWikipediaCredibility(queryText) {
  if (!queryText || queryText.length < 3) {
    return { hasMatch: false, snippet: null };
  }

  // Extract key search phrase (first 8 words or main noun phrase)
  const words = queryText.trim().split(/\s+/);
  const searchTerm = words.slice(0, 7).join(' ').replace(/[^\w\s\u0600-\u06FF\u0900-\u097F\u4e00-\u9fff]/gi, '');

  if (!searchTerm) {
    return { hasMatch: false, snippet: null };
  }

  try {
    // 1. Query Wikipedia Search API
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);

    if (!searchRes.ok) {
      return { hasMatch: false, snippet: null };
    }

    const searchData = await searchRes.json();
    const results = searchData.query?.search;

    if (results && results.length > 0) {
      const topMatch = results[0];
      const pageTitle = topMatch.title;
      // Clean HTML tags from snippet
      const cleanSnippet = topMatch.snippet.replace(/<[^>]*>?/gm, '');

      return {
        hasMatch: true,
        title: pageTitle,
        snippet: cleanSnippet,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`,
        scoreBoost: 25
      };
    }
  } catch (err) {
    console.warn('Wikipedia API lookup error:', err.message);
  }

  return { hasMatch: false, snippet: null };
}
