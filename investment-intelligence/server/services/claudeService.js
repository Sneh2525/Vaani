const Anthropic = require('@anthropic-ai/sdk');

// Lazy-initialize client to prevent crash if key is missing during startup
let clientInstance = null;
function getClient() {
  if (!clientInstance) {
    const apiKey = process.env.ANTHROPIC_API_KEY || 'demo_key_placeholder';
    clientInstance = new Anthropic({ apiKey });
  }
  return clientInstance;
}

/**
 * Generate a structured investment thesis for a stock based on current scores, fundamentals, and narrative risk factors.
 */
async function generateInvestmentThesis(stock, scores, fundamentals, narrativeRisk) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'demo') {
    return `[Mock Thesis for ${stock.name}] Strong structural growth story in ${stock.sector || 'the industry'} supported by a solid BSS score of ${scores.businessScore || 7}. Valuation score is ${scores.valuationScore || 5} yielding a composite score of ${scores.composite || 6}. Risk indicators remain normal. Connect a valid ANTHROPIC_API_KEY to see live Claude intelligence.`;
  }

  try {
    const anthropic = getClient();
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

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }]
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Claude API Error in generateInvestmentThesis:', error);
    return `Failed to generate thesis due to API error. Stock: ${stock.name}. Core Score: ${scores.composite}.`;
  }
}

/**
 * Generate a comprehensive weekly intelligence briefing for portfolio and market conditions.
 */
async function generateWeeklyBriefing(macro, topBuys, narrativeCracks, portfolioSnapshot) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'demo') {
    return [
      `📊 Weekly Market Briefing: RBI rate stands at ${macro?.rbi_rate || 'N/A'}% and VIX is ${macro?.india_vix || 'N/A'}.`,
      `💼 Portfolio performance is stable with ${portfolioSnapshot.length} holdings.`,
      `💡 Watchlist highlight: ${topBuys[0]?.name || 'Nifty Stocks'} remains highly rated.`
    ];
  }

  try {
    const anthropic = getClient();
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

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    });

    return response.content[0].text.split('\n').filter(line => line.trim().length > 0);
  } catch (error) {
    console.error('Claude API Error in generateWeeklyBriefing:', error);
    return ['Error generating intelligence briefing. Please verify system logs.'];
  }
}

module.exports = {
  generateInvestmentThesis,
  generateWeeklyBriefing
};
