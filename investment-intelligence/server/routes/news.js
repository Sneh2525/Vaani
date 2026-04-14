const express = require('express');
const router = express.Router();
const { getNews, getNewsRSS } = require('../services/newsApi');

// GET /api/news/:ticker — fetch latest news for a stock
router.get('/:ticker', async (req, res) => {
  try {
    let articles = await getNews(req.params.ticker);
    // Fallback to Google News RSS if NewsAPI returns nothing
    if (!articles || articles.length === 0) {
      articles = await getNewsRSS(req.params.ticker);
    }
    res.json(articles);
  } catch (e) {
    console.error('News route error:', e);
    res.status(500).json({ error: e.message });
  }
});

// GET /api/news — fetch general market news
router.get('/', async (req, res) => {
  try {
    let articles = await getNews('Indian stock market Nifty Sensex');
    if (!articles || articles.length === 0) {
      articles = await getNewsRSS('Nifty Sensex');
    }
    res.json(articles);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
