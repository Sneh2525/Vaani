const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/', (req, res) => {
  const events = db.prepare('SELECT * FROM regulatory_events ORDER BY date DESC LIMIT 50').all();
  res.json(events);
});

router.get('/sector/:sector', (req, res) => {
  const events = db.prepare("SELECT * FROM regulatory_events WHERE affected_sectors LIKE ? ORDER BY date DESC").all(`%${req.params.sector}%`);
  res.json(events);
});

router.post('/', (req, res) => {
  const { date, source, event_type, title, summary, affected_sectors, affected_tickers, sentiment, impact_score, url } = req.body;
  const result = db.prepare(`INSERT INTO regulatory_events (date, source, event_type, title, summary, affected_sectors, affected_tickers, sentiment, impact_score, url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(date, source, event_type, title, summary, affected_sectors, affected_tickers, sentiment, impact_score, url);
  res.json({ success: true, id: result.lastInsertRowid });
});

module.exports = router;
