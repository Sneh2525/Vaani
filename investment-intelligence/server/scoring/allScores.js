const { calculateBusinessScore } = require('./businessScore');

// Framework 2: Valuation Risk Score (0-10, higher = more expensive/risky)
function calculateValuationScore(fundamentals, sectorMedianPE = 25) {
  if (!fundamentals) return 5.0;
  const scores = {};

  // PE vs Sector Median
  const pe = fundamentals.pe || 0;
  if (pe <= 0) {
    scores.peRatio = 8; // loss-making company = high valuation risk
  } else {
    const pePremium = pe / sectorMedianPE;
    if (pePremium <= 0.7) scores.peRatio = 2;
    else if (pePremium <= 0.9) scores.peRatio = 3.5;
    else if (pePremium <= 1.1) scores.peRatio = 5;
    else if (pePremium <= 1.5) scores.peRatio = 7;
    else if (pePremium <= 2.0) scores.peRatio = 8.5;
    else scores.peRatio = 10;
  }

  // PEG Ratio
  const peg = fundamentals.peg || 0;
  if (peg <= 0) scores.peg = 8;
  else if (peg <= 0.75) scores.peg = 2;
  else if (peg <= 1.0) scores.peg = 3;
  else if (peg <= 1.5) scores.peg = 5;
  else if (peg <= 2.0) scores.peg = 7;
  else if (peg <= 3.0) scores.peg = 8.5;
  else scores.peg = 10;

  // EV/EBITDA
  const evEbitda = fundamentals.ev_ebitda || 0;
  if (evEbitda <= 0) scores.evEbitda = 7;
  else if (evEbitda <= 8) scores.evEbitda = 2;
  else if (evEbitda <= 12) scores.evEbitda = 4;
  else if (evEbitda <= 18) scores.evEbitda = 6;
  else if (evEbitda <= 25) scores.evEbitda = 7.5;
  else if (evEbitda <= 40) scores.evEbitda = 9;
  else scores.evEbitda = 10;

  // Price-to-Book
  const pb = fundamentals.pb || 0;
  if (pb <= 0) scores.pb = 7;
  else if (pb <= 1.5) scores.pb = 2;
  else if (pb <= 2.5) scores.pb = 4;
  else if (pb <= 4) scores.pb = 6;
  else if (pb <= 7) scores.pb = 7.5;
  else if (pb <= 12) scores.pb = 9;
  else scores.pb = 10;

  // Market expectation risk - derive from ROE vs PE
  const roe = fundamentals.roe || 0;
  if (roe > 25 && pe < 30) scores.expectation = 3;
  else if (roe > 20 && pe < 25) scores.expectation = 4;
  else if (roe > 15 && pe < 35) scores.expectation = 5;
  else if (roe < 10 && pe > 40) scores.expectation = 9;
  else scores.expectation = 6;

  const total =
    scores.peRatio * 0.30 +
    scores.peg * 0.25 +
    scores.evEbitda * 0.25 +
    scores.pb * 0.10 +
    scores.expectation * 0.10;

  return {
    total: Math.round(total * 10) / 10,
    breakdown: scores,
    interpretation: total <= 3 ? 'Cheap — Good margin of safety' : total <= 6 ? 'Fair Value' : 'Expensive — High downside risk'
  };
}

// Framework 3: Market Structure / Opportunity Score (0-10)
function calculateMarketScore(macroData) {
  if (!macroData) return 5.0;
  const scores = {};

  // RBI Rate Cycle (cutting = positive for equities)
  const rbiRate = macroData.rbi_rate || 6.5;
  const rbiTrend = macroData.rbi_trend || 'STABLE';
  if (rbiTrend === 'CUTTING') scores.rbiCycle = 8;
  else if (rbiTrend === 'STABLE_LOW') scores.rbiCycle = 7;
  else if (rbiTrend === 'STABLE') scores.rbiCycle = 5;
  else if (rbiTrend === 'HIKING') scores.rbiCycle = 2;
  else scores.rbiCycle = rbiRate <= 5.5 ? 8 : rbiRate <= 6.5 ? 6 : 4;

  // FII vs DII Flow
  const fiiFlow = macroData.fii_flow || 0;
  if (fiiFlow >= 8000) scores.fiiDii = 9;
  else if (fiiFlow >= 4000) scores.fiiDii = 7.5;
  else if (fiiFlow >= 0) scores.fiiDii = 5.5;
  else if (fiiFlow >= -4000) scores.fiiDii = 4;
  else if (fiiFlow >= -8000) scores.fiiDii = 2.5;
  else scores.fiiDii = 1;

  // India VIX
  const vix = macroData.india_vix || 15;
  if (vix < 12) scores.vix = 8;
  else if (vix < 15) scores.vix = 7;
  else if (vix < 18) scores.vix = 6;
  else if (vix < 22) scores.vix = 5;
  else if (vix < 28) scores.vix = 3;
  else scores.vix = 1;

  // GST Collection (economic activity proxy)
  const gst = macroData.gst_collection || 180000;
  if (gst >= 200000) scores.gst = 9;
  else if (gst >= 180000) scores.gst = 7.5;
  else if (gst >= 160000) scores.gst = 6;
  else if (gst >= 140000) scores.gst = 4;
  else scores.gst = 2;

  // INR trend (stable or appreciating = positive)
  const usdInr = macroData.usd_inr || 84;
  if (usdInr <= 82) scores.inr = 8;
  else if (usdInr <= 84) scores.inr = 7;
  else if (usdInr <= 86) scores.inr = 5;
  else if (usdInr <= 88) scores.inr = 3;
  else scores.inr = 2;

  const total =
    scores.rbiCycle * 0.25 +
    scores.fiiDii * 0.25 +
    scores.vix * 0.20 +
    scores.gst * 0.15 +
    scores.inr * 0.15;

  return {
    total: Math.round(total * 10) / 10,
    breakdown: scores,
    signal: total >= 7 ? 'Strong Tailwind' : total >= 5 ? 'Neutral' : 'Headwinds Active'
  };
}

// Framework 4: Behavioral/Sentiment Score (0-10, higher = more euphoric/risky)
function calculateSentimentScore(macroData, stockData) {
  const scores = {};

  // VIX-based fear/greed
  const vix = macroData?.india_vix || 15;
  if (vix >= 30) scores.fearGreed = 1; // extreme fear = good buy signal (low score)
  else if (vix >= 22) scores.fearGreed = 3;
  else if (vix >= 16) scores.fearGreed = 5;
  else if (vix >= 12) scores.fearGreed = 7;
  else scores.fearGreed = 9; // very low VIX = complacency = euphoria

  // Nifty PE vs historical
  const niftyPE = macroData?.nifty_pe || 22;
  if (niftyPE <= 16) scores.marketPE = 2;
  else if (niftyPE <= 19) scores.marketPE = 4;
  else if (niftyPE <= 22) scores.marketPE = 5;
  else if (niftyPE <= 26) scores.marketPE = 7;
  else if (niftyPE <= 30) scores.marketPE = 8.5;
  else scores.marketPE = 10;

  // Promoter buying signal (stock-level)
  const promoterPledge = stockData?.promoter_pledge || 0;
  const promoterStake = stockData?.promoter_stake || 0;
  if (promoterPledge === 0 && promoterStake >= 50) scores.insider = 3; // bullish
  else if (promoterPledge <= 5) scores.insider = 4;
  else if (promoterPledge <= 15) scores.insider = 6;
  else if (promoterPledge <= 25) scores.insider = 8;
  else scores.insider = 10; // high pledge = bearish

  // FII sentiment
  const fiiFlow = macroData?.fii_flow || 0;
  if (fiiFlow >= 8000) scores.fiiSentiment = 8;
  else if (fiiFlow >= 2000) scores.fiiSentiment = 6;
  else if (fiiFlow >= -2000) scores.fiiSentiment = 5;
  else if (fiiFlow >= -6000) scores.fiiSentiment = 3;
  else scores.fiiSentiment = 1;

  const total =
    scores.fearGreed * 0.35 +
    scores.marketPE * 0.25 +
    scores.insider * 0.25 +
    scores.fiiSentiment * 0.15;

  const adjustedTotal = total;
  return {
    total: Math.round(adjustedTotal * 10) / 10,
    breakdown: scores,
    label: total <= 2 ? 'Deep Fear' : total <= 5 ? 'Neutral' : total <= 8 ? 'Optimistic' : 'Euphoria'
  };
}

// Framework 5: Alternative Data Score (0-10)
function calculateAltDataScore(altData) {
  if (!altData) return 5.0;
  const scores = {};

  // FASTag trend
  if (altData.fastag_change >= 15) scores.fastag = 9;
  else if (altData.fastag_change >= 8) scores.fastag = 7.5;
  else if (altData.fastag_change >= 3) scores.fastag = 6;
  else if (altData.fastag_change >= 0) scores.fastag = 5;
  else if (altData.fastag_change >= -5) scores.fastag = 3.5;
  else scores.fastag = 2;

  // Job postings
  if (altData.job_postings_change >= 20) scores.jobs = 9;
  else if (altData.job_postings_change >= 10) scores.jobs = 7.5;
  else if (altData.job_postings_change >= 0) scores.jobs = 5.5;
  else if (altData.job_postings_change >= -10) scores.jobs = 3.5;
  else scores.jobs = 2;

  // App downloads/rank (lower rank = better)
  if (altData.app_rank !== null) {
    const rankChange = altData.app_rank_change || 0;
    if (rankChange <= -10) scores.appUsage = 9;
    else if (rankChange <= -3) scores.appUsage = 7;
    else if (rankChange === 0) scores.appUsage = 5;
    else if (rankChange <= 5) scores.appUsage = 4;
    else scores.appUsage = 2;
  } else {
    scores.appUsage = altData.logistics_score || 5;
  }

  // Logistics activity
  scores.logistics = altData.logistics_score || 5;

  const total =
    (scores.fastag || 5) * 0.30 +
    (scores.jobs || 5) * 0.30 +
    (scores.appUsage || 5) * 0.20 +
    (scores.logistics || 5) * 0.20;

  return {
    total: Math.round(total * 10) / 10,
    breakdown: scores,
    leadTime: '2-3 months ahead of fundamentals'
  };
}

// Composite Score (0-10)
function calculateComposite(business, valuation, market, sentiment, altData) {
  // Invert valuation (lower risk = higher score contribution)
  const valScore = 10 - valuation;
  // Sentiment adjustment — if above 7, invert partially
  const sentScore = sentiment <= 7 ? (10 - sentiment * 0.5) : (10 - sentiment);

  const composite =
    business * 0.30 +
    valScore * 0.28 +
    market * 0.18 +
    (sentiment <= 7 ? (7 - sentiment + 5) : (10 - sentiment)) * 0.14 +
    altData * 0.10;

  const rounded = Math.round(composite * 10) / 10;

  const signal = rounded >= 7.5 ? 'STRONG BUY' :
    rounded >= 6.0 ? 'BUY' :
    rounded >= 4.5 ? 'WATCH' :
    rounded >= 3.0 ? 'AVOID' : 'EXIT';

  return { composite: rounded, signal };
}

module.exports = {
  calculateBusinessScore,
  calculateValuationScore,
  calculateMarketScore,
  calculateSentimentScore,
  calculateAltDataScore,
  calculateComposite
};
