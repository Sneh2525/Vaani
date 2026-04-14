// Framework 1: Business Quality Score (0-10)
function calculateBusinessScore(fundamentals, stock) {
  if (!fundamentals) return 5.0;
  const scores = {};

  // Revenue Growth Consistency (20%) - 3yr trend
  const revGrowth = fundamentals.revenue_growth || 0;
  if (revGrowth >= 20) scores.revenueGrowth = 10;
  else if (revGrowth >= 15) scores.revenueGrowth = 8.5;
  else if (revGrowth >= 10) scores.revenueGrowth = 7;
  else if (revGrowth >= 5) scores.revenueGrowth = 5;
  else if (revGrowth >= 0) scores.revenueGrowth = 3;
  else scores.revenueGrowth = 1;

  // Profit Margin Trend (20%)
  const netMargin = fundamentals.net_margin || 0;
  if (netMargin >= 25) scores.margins = 10;
  else if (netMargin >= 18) scores.margins = 8.5;
  else if (netMargin >= 12) scores.margins = 7;
  else if (netMargin >= 6) scores.margins = 5;
  else if (netMargin >= 0) scores.margins = 3;
  else scores.margins = 1;

  // Debt Sustainability (15%)
  const de = fundamentals.debt_equity || 0;
  const ic = fundamentals.interest_coverage || 1;
  const sector = stock?.sector || '';
  const isBanking = ['Banking', 'NBFC', 'Fintech'].includes(sector);
  if (isBanking) {
    // Banks assessed differently
    if (ic >= 3) scores.debt = 8;
    else if (ic >= 2) scores.debt = 6;
    else scores.debt = 4;
  } else {
    if (de <= 0.1 && ic >= 20) scores.debt = 10;
    else if (de <= 0.3 && ic >= 10) scores.debt = 8;
    else if (de <= 0.5 && ic >= 5) scores.debt = 7;
    else if (de <= 1.0 && ic >= 3) scores.debt = 5;
    else if (de <= 2.0 && ic >= 1.5) scores.debt = 3;
    else scores.debt = 1;
  }

  // Competitive Moat (20%) — proxy via ROCE and margin stability
  const roce = fundamentals.roce || 0;
  const roe = fundamentals.roe || 0;
  if (roce >= 30 && netMargin >= 15) scores.moat = 9.5;
  else if (roce >= 20 && netMargin >= 10) scores.moat = 8;
  else if (roce >= 15 && netMargin >= 7) scores.moat = 6.5;
  else if (roce >= 10) scores.moat = 5;
  else scores.moat = 3;

  // Management Quality (15%) — promoter stake + pledge
  const promoterStake = fundamentals.promoter_stake || 0;
  const pledge = fundamentals.promoter_pledge || 0;
  let mgmtScore = 5;
  if (promoterStake >= 50) mgmtScore += 2;
  else if (promoterStake >= 30) mgmtScore += 1;
  else if (promoterStake === 0) mgmtScore -= 0.5; // promoter-less companies neutral
  if (pledge >= 30) mgmtScore -= 3;
  else if (pledge >= 15) mgmtScore -= 2;
  else if (pledge >= 5) mgmtScore -= 1;
  else mgmtScore += 1;
  scores.management = Math.max(1, Math.min(10, mgmtScore));

  // Industry Lifecycle (10%)
  const sectorScores = {
    'IT': 8, 'Banking': 7.5, 'Pharma': 7.5, 'Consumer Tech': 7,
    'NBFC': 7, 'Consumer': 7, 'Auto': 6.5, 'Infrastructure': 7,
    'Materials': 5.5, 'Conglomerate': 6, 'Retail': 6.5,
    'Fintech': 7, 'Utilities': 5
  };
  scores.industry = sectorScores[sector] || 6;

  const total =
    scores.revenueGrowth * 0.20 +
    scores.margins * 0.20 +
    scores.debt * 0.15 +
    scores.moat * 0.20 +
    scores.management * 0.15 +
    scores.industry * 0.10;

  return {
    total: Math.round(total * 10) / 10,
    breakdown: scores
  };
}

module.exports = { calculateBusinessScore };
