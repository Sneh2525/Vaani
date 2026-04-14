const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { evaluateMacroRules, evaluateStockRules, evaluatePortfolioRules, generateBuyDecisionTree } = require('../engine/rulesEngine');

// Get all active alerts
router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM alerts ORDER BY triggered DESC, severity DESC').all());
});

// Run full rules engine check
router.get('/run', (req, res) => {
  const macro = db.prepare('SELECT * FROM macro_data ORDER BY date DESC LIMIT 1').get();
  const portfolio = db.prepare("SELECT p.*, s.sector FROM portfolio p JOIN stocks s ON p.ticker = s.ticker WHERE p.status = 'ACTIVE'").all();
  
  const macroAlerts = evaluateMacroRules({ ...macro, rbi_trend: 'CUTTING' });
  
  const stockAlerts = [];
  const holdings = db.prepare("SELECT * FROM portfolio WHERE status = 'ACTIVE'").all();
  holdings.forEach(h => {
    const scores = db.prepare('SELECT * FROM scores WHERE ticker = ? ORDER BY date DESC LIMIT 1').get(h.ticker);
    const fund = db.prepare('SELECT * FROM fundamentals WHERE ticker = ? ORDER BY date DESC LIMIT 1').get(h.ticker);
    stockAlerts.push(...evaluateStockRules(h.ticker, scores, fund, null));
  });

  const narrativeCracks = db.prepare('SELECT * FROM narrative_risk WHERE crack_detected = 1').all();
  const narrativeAlerts = narrativeCracks.map(n => ({
    rule: `Narrative Crack — ${n.ticker}`,
    ticker: n.ticker,
    severity: 'WARNING',
    action: `Monitor closely. Narrative: "${n.dominant_narrative}". Destruction event: "${n.destruction_event}"`,
    triggered: true
  }));

  const allAlerts = [...macroAlerts, ...stockAlerts, ...narrativeAlerts];
  
  res.json({
    timestamp: new Date().toISOString(),
    totalAlerts: allAlerts.length,
    critical: allAlerts.filter(a => a.severity === 'CRITICAL').length,
    high: allAlerts.filter(a => a.severity === 'HIGH').length,
    opportunities: allAlerts.filter(a => a.severity === 'OPPORTUNITY').length,
    alerts: allAlerts
  });
});

// Buy decision tree
router.post('/decision-tree', (req, res) => {
  const { ticker } = req.body;
  const scores = db.prepare('SELECT * FROM scores WHERE ticker = ? ORDER BY date DESC LIMIT 1').get(ticker);
  if (!scores) return res.status(404).json({ error: 'Score not found for this ticker' });
  
  const result = generateBuyDecisionTree({
    business_score: scores.business_score,
    valuation_score: scores.valuation_score,
    market_score: scores.market_score,
    sentiment_score: scores.sentiment_score,
    composite: scores.composite
  });
  res.json(result);
});

module.exports = router;
