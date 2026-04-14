const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/', (req, res) => {
  const stocks = db.prepare('SELECT s.*, w.added_date as watchlisted FROM stocks s LEFT JOIN watchlist w ON s.ticker = w.ticker').all();
  res.json(stocks);
});

router.get('/watchlist', (req, res) => {
  const stocks = db.prepare(`SELECT s.*, w.target_score, w.added_date, w.notes as watch_notes
    FROM watchlist w JOIN stocks s ON w.ticker = s.ticker`).all();
  res.json(stocks);
});

router.get('/search', (req, res) => {
  const { q } = req.query;
  const stocks = db.prepare("SELECT * FROM stocks WHERE ticker LIKE ? OR name LIKE ? LIMIT 10").all(`%${q}%`, `%${q}%`);
  res.json(stocks);
});

router.get('/:ticker', (req, res) => {
  const stock = db.prepare('SELECT * FROM stocks WHERE ticker = ?').get(req.params.ticker);
  if (!stock) return res.status(404).json({ error: 'Not found' });
  const fund = db.prepare('SELECT * FROM fundamentals WHERE ticker = ? ORDER BY date DESC LIMIT 1').get(req.params.ticker);
  res.json({ ...stock, fundamentals: fund });
});

router.post('/watchlist', (req, res) => {
  const { ticker, target_score, notes } = req.body;
  db.prepare('INSERT OR REPLACE INTO watchlist (ticker, target_score, notes) VALUES (?, ?, ?)').run(ticker, target_score || 7.0, notes || '');
  res.json({ success: true });
});

router.delete('/watchlist/:ticker', (req, res) => {
  db.prepare('DELETE FROM watchlist WHERE ticker = ?').run(req.params.ticker);
  res.json({ success: true });
});

module.exports = router;
