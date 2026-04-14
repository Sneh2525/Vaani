const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/', (req, res) => {
  const all = db.prepare('SELECT * FROM narrative_risk ORDER BY date DESC').all();
  const latest = {};
  all.forEach(r => { if (!latest[r.ticker]) latest[r.ticker] = r; });
  res.json(Object.values(latest));
});

router.get('/:ticker', (req, res) => {
  const data = db.prepare('SELECT * FROM narrative_risk WHERE ticker = ? ORDER BY date DESC LIMIT 1').get(req.params.ticker);
  res.json(data || {});
});

router.post('/', (req, res) => {
  const { ticker, date, dominant_narrative, consensus_level, destruction_event, narrative_risk_score, crack_detected, crack_notes } = req.body;
  const result = db.prepare(`INSERT OR REPLACE INTO narrative_risk (ticker, date, dominant_narrative, consensus_level, destruction_event, narrative_risk_score, crack_detected, crack_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(ticker, date, dominant_narrative, consensus_level, destruction_event, narrative_risk_score, crack_detected ? 1 : 0, crack_notes);
  res.json({ success: true, id: result.lastInsertRowid });
});

module.exports = router;
