const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Weekly intelligence briefing
router.get('/briefing', (req, res) => {
  const macro = db.prepare('SELECT * FROM macro_data ORDER BY date DESC LIMIT 1').get();
  const alerts = db.prepare('SELECT * FROM alerts WHERE triggered = 1 ORDER BY trigger_date DESC LIMIT 10').all();
  const recentScores = db.prepare('SELECT s.ticker, st.name, s.composite, s.signal, s.business_score, s.valuation_score FROM scores s JOIN stocks st ON s.ticker = st.ticker ORDER BY s.date DESC, s.composite DESC LIMIT 20').all();
  const narrativeCracks = db.prepare('SELECT * FROM narrative_risk WHERE crack_detected = 1 ORDER BY narrative_risk_score DESC').all();
  const regEvents = db.prepare('SELECT * FROM regulatory_events ORDER BY date DESC LIMIT 5').all();
  const portfolio = db.prepare("SELECT p.*, s.name FROM portfolio p JOIN stocks s ON p.ticker = s.ticker WHERE p.status = 'ACTIVE'").all();
  
  const topBuys = recentScores.filter(s => s.signal === 'STRONG BUY' || s.signal === 'BUY').slice(0, 5);
  const pnl = portfolio.map(h => ({
    ticker: h.ticker, name: h.name,
    pnl: ((h.current_price - h.entry_price) / h.entry_price * 100).toFixed(1)
  }));

  const briefing = {
    generatedAt: new Date().toISOString(),
    weekSummary: {
      rbiRate: macro?.rbi_rate,
      indiaVix: macro?.india_vix,
      fiiFlow: macro?.fii_flow,
      niftyPE: macro?.nifty_pe,
      macroSentiment: macro?.india_vix < 15 ? 'CALM' : macro?.india_vix < 22 ? 'MODERATE' : 'STRESSED'
    },
    activeAlerts: alerts.length,
    topAlerts: alerts.slice(0, 3).map(a => ({ rule: a.rule_name, severity: a.severity, ticker: a.ticker })),
    topBuyOpportunities: topBuys.map(s => ({ ticker: s.ticker, name: s.name, composite: s.composite, signal: s.signal })),
    narrativeWarnings: narrativeCracks.map(n => ({ ticker: n.ticker, narrative: n.dominant_narrative, riskScore: n.narrative_risk_score })),
    regulatoryHighlights: regEvents.map(e => ({ date: e.date, source: e.source, title: e.title, sectors: e.affected_sectors, sentiment: e.sentiment })),
    portfolioSnapshot: pnl,
    agenticInsight: generateAgenticInsight(macro, alerts, recentScores, narrativeCracks)
  };

  res.json(briefing);
});

function generateAgenticInsight(macro, alerts, scores, cracks) {
  const insights = [];
  if (macro?.india_vix >= 22) insights.push('🚨 VIX above 22 — activate panic-buy mode for high-composite watchlist stocks');
  else if (macro?.india_vix < 12) insights.push('⚠️ VIX extremely low — complacency risk. Avoid chasing momentum.');
  if (macro?.fii_flow > 5000) insights.push('✅ Strong FII inflows detected — risk-on sentiment, consider adding positions');
  else if (macro?.fii_flow < -5000) insights.push('🔴 Heavy FII selling — hold cash, wait for reversal confirmation');
  if (cracks.length > 0) insights.push(`⚠️ Narrative cracks detected in ${cracks.map(c => c.ticker).join(', ')} — exit or trim recommended`);
  const highScore = scores.find(s => s.composite >= 7.5);
  if (highScore) insights.push(`💡 ${highScore.ticker} is at STRONG BUY composite (${highScore.composite}) — consider initiating position per decision note process`);
  return insights.length > 0 ? insights : ['📊 No critical alerts this week. System running normally. Continue monitoring watchlist.'];
}

// Auto-trigger thesis review when rule conditions are breached
router.get('/review-triggers', (req, res) => {
  const triggers = [];
  const holdings = db.prepare("SELECT * FROM portfolio WHERE status = 'ACTIVE'").all();
  
  holdings.forEach(h => {
    const fund = db.prepare('SELECT * FROM fundamentals WHERE ticker = ? ORDER BY date DESC LIMIT 1').get(h.ticker);
    const scores = db.prepare('SELECT * FROM scores WHERE ticker = ? ORDER BY date DESC LIMIT 1').get(h.ticker);
    const narrative = db.prepare('SELECT * FROM narrative_risk WHERE ticker = ? ORDER BY date DESC LIMIT 1').get(h.ticker);
    
    if (fund?.promoter_pledge > 30) triggers.push({ ticker: h.ticker, trigger: 'PROMOTER_PLEDGE', value: fund.promoter_pledge, urgency: 'CRITICAL', recommendedAction: 'Draft exit thesis immediately' });
    if (scores?.valuation_score > 8) triggers.push({ ticker: h.ticker, trigger: 'VALUATION_STOP', value: scores.valuation_score, urgency: 'HIGH', recommendedAction: 'Trim 30-50% of position' });
    if (narrative?.crack_detected) triggers.push({ ticker: h.ticker, trigger: 'NARRATIVE_CRACK', value: narrative.narrative_risk_score, urgency: 'HIGH', recommendedAction: 'Review thesis — narratve breaking' });
    
    const pnlPct = ((h.current_price - h.entry_price) / h.entry_price) * 100;
    if (pnlPct < -15) triggers.push({ ticker: h.ticker, trigger: 'PRICE_STOP_LOSS', value: pnlPct.toFixed(1), urgency: 'HIGH', recommendedAction: 'Price stop trigger — review thesis or exit' });
  });

  res.json({ triggers, count: triggers.length, timestamp: new Date().toISOString() });
});

module.exports = router;
