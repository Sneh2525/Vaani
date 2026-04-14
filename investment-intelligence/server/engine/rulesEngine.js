// IF-THEN Rules Engine — All macro, stock, and portfolio rules from Blueprint v2

function evaluateMacroRules(macroData) {
  const alerts = [];
  if (!macroData) return alerts;

  // RBI hiking rules
  if (macroData.consecutive_hikes >= 2) {
    alerts.push({ rule: 'RBI Rate Hike Cycle', severity: 'HIGH', action: 'Reduce high-PE exposure 20%. Favour PSU banks.', triggered: true });
  }
  if (macroData.rbi_trend === 'CUTTING') {
    alerts.push({ rule: 'RBI Rate Cut Signal', severity: 'POSITIVE', action: 'Add weight to NBFCs, real estate, capex-heavy sectors.', triggered: true });
  }

  // FII outflow alert
  const fiiAbsFlow = Math.abs(macroData.fii_flow || 0);
  if (macroData.fii_flow < -5000) {
    alerts.push({ rule: 'FII Mass Outflow', severity: 'HIGH', action: 'Hold cash. Wait for reversal before new entries.', triggered: true, value: macroData.fii_flow });
  }

  // INR depreciation
  // If rate changes more than 3% in a month (approximated by usd_inr > 87)
  if (macroData.usd_inr > 87) {
    alerts.push({ rule: 'INR Depreciation Alert', severity: 'MEDIUM', action: 'Increase IT, pharma, export-oriented holdings.', triggered: true, value: macroData.usd_inr });
  }

  // India VIX spike — panic-buy mode
  if (macroData.india_vix >= 22) {
    alerts.push({ rule: 'VIX Spike — Panic Buy Mode', severity: 'OPPORTUNITY', action: 'Activate panic-buy mode for high-scoring watchlist stocks (>7.0 composite).', triggered: true, value: macroData.india_vix });
  }

  // GST slowdown
  if (macroData.gst_collection < 150000) {
    alerts.push({ rule: 'GST Slowdown Alert', severity: 'HIGH', action: 'Economic slowdown signal. Reduce cyclical exposure.', triggered: true, value: macroData.gst_collection });
  }

  return alerts;
}

function evaluateStockRules(ticker, scores, fundamentals, priceData) {
  const alerts = [];

  // Business score drop post-buy
  if (scores?.business_score_change < -2) {
    alerts.push({ rule: 'Business Quality Deterioration', ticker, severity: 'HIGH', action: 'Immediate thesis review. Likely exit.', triggered: true, value: scores.business_score });
  }

  // Valuation score too high (expensive post run-up)
  if (scores?.valuation_score > 8.0) {
    alerts.push({ rule: 'Valuation Stop Triggered', ticker, severity: 'HIGH', action: 'Trim 30-50% of position at market.', triggered: true, value: scores.valuation_score });
  }

  // Promoter pledge warning
  if (fundamentals?.promoter_pledge > 30) {
    alerts.push({ rule: 'Promoter Pledge Critical (>30%)', ticker, severity: 'CRITICAL', action: 'Exit position. High risk of forced selling.', triggered: true, value: fundamentals.promoter_pledge });
  } else if (fundamentals?.promoter_pledge > 15) {
    alerts.push({ rule: 'Promoter Pledge Warning (>15%)', ticker, severity: 'HIGH', action: 'Review position. Monitor closely.', triggered: true, value: fundamentals.promoter_pledge });
  }

  // Volume spike + price fall (opportunity or danger)
  if (priceData?.volume_change > 5 && priceData?.price_change < -0.07) {
    alerts.push({ rule: 'Volume Spike + Price Fall (7%+)', ticker, severity: 'WATCH', action: 'Research cause before acting — could be opportunity.', triggered: true });
  }

  return alerts;
}

function evaluatePortfolioRules(portfolioStats) {
  const alerts = [];
  if (!portfolioStats) return alerts;

  // Cash reserve
  if (portfolioStats.cashPct < 0.10) {
    alerts.push({ rule: 'Cash Reserve Low (<10%)', severity: 'MEDIUM', action: 'Pause new buys. Build cash buffer.', triggered: true, value: portfolioStats.cashPct });
  }

  // Single stock concentration
  if (portfolioStats.maxStockPct > 0.10) {
    alerts.push({ rule: 'Single Stock Concentration (>10%)', severity: 'HIGH', action: 'Trim immediately to 10% max.', triggered: true, ticker: portfolioStats.maxStockTicker, value: portfolioStats.maxStockPct });
  }

  // Portfolio drawdown
  if (portfolioStats.drawdown > 0.15) {
    alerts.push({ rule: 'Portfolio Drawdown Pause (>15%)', severity: 'CRITICAL', action: 'Stop adding positions. Review all holdings. Do not average down blindly.', triggered: true, value: portfolioStats.drawdown });
  }

  // Win rate
  if (portfolioStats.winRate < 0.40 && portfolioStats.totalTrades >= 12) {
    alerts.push({ rule: 'Win Rate Floor Breach (<40%)', severity: 'CRITICAL', action: 'Full framework audit required — something is systematically wrong.', triggered: true, value: portfolioStats.winRate });
  }

  // Max positions
  if (portfolioStats.activePositions > 25) {
    alerts.push({ rule: 'Maximum Positions Exceeded (>25)', severity: 'MEDIUM', action: 'Cannot monitor >25 stocks properly. Consolidate.', triggered: true, value: portfolioStats.activePositions });
  }

  return alerts;
}

function generateBuyDecisionTree(scores) {
  const steps = [];
  
  steps.push({ step: 1, condition: 'Is stock on scored watchlist?', result: true, action: 'Proceed to Business Score check' });
  
  const businessPass = scores.business_score >= 6;
  steps.push({ step: 2, condition: `Business Score >= 6? (Current: ${scores.business_score})`, result: businessPass, action: businessPass ? 'Quality business confirmed' : 'Remove from watchlist. Not quality enough.' });
  if (!businessPass) return { canBuy: false, steps, finalReason: 'Business Quality too low' };

  const valuationPass = scores.valuation_score < 7;
  steps.push({ step: 3, condition: `Valuation Risk Score < 7? (Current: ${scores.valuation_score})`, result: valuationPass, action: valuationPass ? 'Valuation acceptable' : 'Good business, wrong price. Set price alert. Wait.' });
  if (!valuationPass) return { canBuy: false, steps, finalReason: 'Too expensive right now' };

  const marketPass = scores.market_score > 5;
  steps.push({ step: 4, condition: `Market Opportunity Score > 5? (Current: ${scores.market_score})`, result: marketPass, action: marketPass ? 'Market conditions favorable' : 'Right stock, wrong time. Reduce size by 50%.' });

  const sentimentPass = scores.sentiment_score < 8;
  steps.push({ step: 5, condition: `Sentiment NOT in Euphoria (< 8)? (Current: ${scores.sentiment_score})`, result: sentimentPass, action: sentimentPass ? 'Sentiment manageable' : 'Cut intended position size by half.' });

  steps.push({ step: 6, condition: 'All conditions met?', result: true, action: '→ WRITE DECISION NOTE → APPLY POSITION SIZING → EXECUTE' });

  let positionMultiplier = 1;
  if (!marketPass) positionMultiplier *= 0.5;
  if (!sentimentPass) positionMultiplier *= 0.5;

  return { canBuy: true, steps, positionMultiplier, finalReason: 'All conditions passed' };
}

module.exports = { evaluateMacroRules, evaluateStockRules, evaluatePortfolioRules, generateBuyDecisionTree };
