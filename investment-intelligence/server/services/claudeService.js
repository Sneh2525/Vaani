const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function askGroq(prompt) {
  if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY is missing from .env');

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  if (!response.ok) throw new Error(`Groq request failed: ${response.status} ${await response.text()}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'Groq returned an empty response.';
}

/**
 * Generate a structured investment thesis for a stock based on current scores, fundamentals, and narrative risk factors.
 */
async function generateInvestmentThesis(stock, scores, fundamentals, narrativeRisk) {
  try {
    const prompt = `Analyze this stock and generate a professional, structured investment thesis:
Stock: ${stock.name} (${stock.ticker})
Sector: ${stock.sector}
Moat rating: ${stock.moat_rating || 'N/A'}
Market Cap: ${stock.market_cap}

Composite IOS Score: ${scores.composite} / 10
Framework Scores:
- Business Moat (BSS): ${scores.businessScore} / 10
- Valuation (VRS): ${scores.valuationScore} / 10
- Macro/Market (MSS): ${scores.marketScore} / 10
- Sentiment (SSS): ${scores.sentimentScore} / 10
- Alt Data (ADS): ${scores.altDataScore} / 10

Key Fundamentals:
- P/E Ratio: ${fundamentals?.pe || 'N/A'}
- Debt/Equity: ${fundamentals?.debt_equity || 'N/A'}
- Return on Invested Capital (ROIC): ${fundamentals?.roic || 'N/A'}%
- Interest Coverage: ${fundamentals?.interest_coverage || 'N/A'}x

Narrative Risks:
- Dominant Narrative: "${narrativeRisk?.dominant_narrative || 'None'}"
- Narrative Crack Detected: ${narrativeRisk?.crack_detected ? 'YES' : 'NO'}
- Destruction Event: "${narrativeRisk?.destruction_event || 'N/A'}"

Provide a concise, 3-paragraph institutional thesis:
1. Executive Summary: Core thesis & opportunity score context.
2. Catalyst/Moat Drivers: What drives growth & margin of safety.
3. Narrative & Risk Flags: What elements could invalidate this investment thesis.`;

    return await askGroq(prompt);
  } catch (error) {
    console.error('Groq Error in generateInvestmentThesis:', error);
    return `Failed to generate thesis due to API error. Stock: ${stock.name}. Core Score: ${scores.composite}.`;
  }
}

/**
 * Generate a comprehensive weekly intelligence briefing for portfolio and market conditions.
 */
async function generateWeeklyBriefing(macro, topBuys, narrativeCracks, portfolioSnapshot) {
  try {
    const prompt = `Synthesize a weekly intelligence briefing for an investment fund manager:
Macro Variables:
- RBI Rate: ${macro?.rbi_rate || 'N/A'}%
- India VIX: ${macro?.india_vix || 'N/A'}
- FII Flow: ${macro?.fii_flow || 'N/A'} Cr
- DII Flow: ${macro?.dii_flow || 'N/A'} Cr

Top Buy Signals:
${topBuys.map(tb => `- ${tb.name} (${tb.ticker}): Composite score ${tb.composite}`).join('\n')}

Narrative Cracks:
${narrativeCracks.map(nc => `- ${nc.ticker}: ${nc.dominant_narrative} (Risk: ${nc.narrative_risk_score}/10)`).join('\n')}

Portfolio Status:
${portfolioSnapshot.map(p => `- ${p.name} (${p.ticker}): PnL ${p.pnl}%`).join('\n')}

Produce 3 distinct bullet points summarizing key macro trends, portfolio risks, and actionable watchlist picks.`;

    return (await askGroq(prompt)).split('\n').filter(line => line.trim().length > 0);
  } catch (error) {
    console.error('Groq Error in generateWeeklyBriefing:', error);
    return ['Error generating intelligence briefing. Please verify system logs.'];
  }
}

async function generateChatResponse(question, context = {}) {
  const prompt = `You are Vaani Copilot, an investment research assistant for Indian equities.
Answer the user's question clearly and conservatively. Use only the supplied workspace context, state uncertainty when data is missing, and never present a prediction as a certainty.

Workspace context:
${JSON.stringify(context, null, 2)}

User question: ${question}

Give a concise answer with a direct conclusion, supporting evidence, and one risk or next step.`;

  return await askGroq(prompt);
}

module.exports = {
  generateInvestmentThesis,
  generateWeeklyBriefing,
  generateChatResponse
};
