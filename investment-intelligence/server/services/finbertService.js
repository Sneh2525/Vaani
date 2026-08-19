const axios = require('axios');

/**
 * Sends a list of news headlines to the local Python FinBERT FastAPI sidecar
 * to extract specialized financial sentiment ratios.
 */
async function analyzeNewsSentiment(headlines) {
  if (!headlines || headlines.length === 0) {
    return { score: 5.0, positiveRatio: 0, negativeRatio: 0 };
  }

  try {
    const response = await axios.post('http://127.0.0.1:8001/analyze', {
      texts: headlines
    }, { timeout: 4000 }); // Fast fail fallback

    const results = response.data.results;
    if (!results || results.length === 0) {
      return { score: 5.0, positiveRatio: 0, negativeRatio: 0 };
    }

    let positiveCount = 0;
    let negativeCount = 0;

    results.forEach(res => {
      if (res.label === 'positive') positiveCount++;
      if (res.label === 'negative') negativeCount++;
    });

    const total = results.length;
    const score = 5.0 + ((positiveCount - negativeCount) / total) * 5.0; // Scaled between 0.0 and 10.0
    
    return {
      score: Math.min(10, Math.max(0, Math.round(score * 10) / 10)),
      positiveRatio: positiveCount / total,
      negativeRatio: negativeCount / total,
      details: results
    };
  } catch (error) {
    // If FinBERT microservice is offline, gracefully return dynamic mock base stats using string matching
    let positiveCount = 0;
    let negativeCount = 0;
    
    const positiveKeywords = ['growth', 'beat', 'bull', 'surge', 'dividend', 'profit', 'record', 'expand', 'up'];
    const negativeKeywords = ['drop', 'fall', 'loss', 'bear', 'miss', 'probe', 'penalty', 'debt', 'down'];

    headlines.forEach(headline => {
      const lower = headline.toLowerCase();
      if (positiveKeywords.some(kw => lower.includes(kw))) positiveCount++;
      if (negativeKeywords.some(kw => lower.includes(kw))) negativeCount++;
    });

    const score = 5.0 + (positiveCount - negativeCount) * 0.5;
    return {
      score: Math.min(10, Math.max(0, Math.round(score * 10) / 10)),
      positiveRatio: positiveCount / headlines.length,
      negativeRatio: negativeCount / headlines.length,
      fallbackUsed: true
    };
  }
}

module.exports = { analyzeNewsSentiment };
