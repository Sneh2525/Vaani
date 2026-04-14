const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/', (req, res) => {
  const latest = db.prepare('SELECT * FROM macro_data ORDER BY date DESC LIMIT 1').get();
  const history = db.prepare('SELECT * FROM macro_data ORDER BY date DESC LIMIT 13').all();
  
  // Determine RBI trend
  const last3 = db.prepare('SELECT rbi_rate FROM macro_data ORDER BY date DESC LIMIT 3').all();
  let rbiTrend = 'STABLE';
  if (last3.length >= 2) {
    if (last3[0].rbi_rate < last3[1].rbi_rate) rbiTrend = 'CUTTING';
    else if (last3[0].rbi_rate > last3[1].rbi_rate) rbiTrend = 'HIKING';
    else rbiTrend = 'STABLE';
  }

  const vix = latest?.india_vix || 13;
  const vixLabel = vix < 12 ? 'Very Calm' : vix < 15 ? 'Calm' : vix < 20 ? 'Moderate' : vix < 28 ? 'Stress' : 'Panic';

  res.json({
    latest: { ...latest, rbiTrend, vixLabel },
    history: history.reverse(),
    summary: {
      rbiRate: latest?.rbi_rate,
      rbiTrend,
      fiiFlow: latest?.fii_flow,
      diiFlow: latest?.dii_flow,
      indiaVix: latest?.india_vix,
      vixLabel,
      usdInr: latest?.usd_inr,
      niftyPE: latest?.nifty_pe,
      niftyClose: latest?.nifty_close,
      gstCollection: latest?.gst_collection,
      gdpGrowth: latest?.gdp_growth,
      cpi: latest?.cpi,
      usFedRate: latest?.us_fed_rate
    }
  });
});

router.post('/', (req, res) => {
  const { date, rbi_rate, fii_flow, dii_flow, india_vix, usd_inr, nifty_pe, gst_collection, gdp_growth, cpi, us_fed_rate, nifty_close } = req.body;
  db.prepare(`INSERT OR REPLACE INTO macro_data (date, rbi_rate, fii_flow, dii_flow, india_vix, usd_inr, nifty_pe, gst_collection, gdp_growth, cpi, us_fed_rate, nifty_close)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(date, rbi_rate, fii_flow, dii_flow, india_vix, usd_inr, nifty_pe, gst_collection, gdp_growth, cpi, us_fed_rate, nifty_close);
  res.json({ success: true });
});

module.exports = router;
