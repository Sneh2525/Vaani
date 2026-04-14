const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/', (req, res) => {
  const all = db.prepare('SELECT * FROM alt_data ORDER BY date DESC').all();
  // Get latest per ticker
  const latest = {};
  all.forEach(r => { if (!latest[r.ticker]) latest[r.ticker] = r; });
  res.json(Object.values(latest));
});

router.get('/:ticker', (req, res) => {
  const data = db.prepare('SELECT * FROM alt_data WHERE ticker = ? ORDER BY date DESC LIMIT 12').all(req.params.ticker);
  res.json(data);
});

router.post('/', (req, res) => {
  const { ticker, date, fastag_trend, fastag_change, job_postings, job_postings_change, app_rank, app_rank_change, logistics_activity, logistics_score, alt_data_score, notes } = req.body;
  const result = db.prepare(`INSERT OR REPLACE INTO alt_data (ticker, date, fastag_trend, fastag_change, job_postings, job_postings_change, app_rank, app_rank_change, logistics_activity, logistics_score, alt_data_score, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(ticker, date, fastag_trend, fastag_change, job_postings, job_postings_change, app_rank, app_rank_change, logistics_activity, logistics_score, alt_data_score, notes);
  res.json({ success: true, id: result.lastInsertRowid });
});

module.exports = router;
