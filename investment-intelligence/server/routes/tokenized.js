const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM tokenized_assets ORDER BY composite_score DESC').all());
});

router.post('/', (req, res) => {
  const { name, asset_type, platform, current_nav, min_investment, liquidity_risk, lock_in_months, yield_or_return, sebi_regulated, quality_score, valuation_score, liquidity_score, notes } = req.body;
  // Composite = quality * 0.4 + valuation * 0.35 + liquidity * 0.25
  const composite = (quality_score * 0.40 + valuation_score * 0.35 + liquidity_score * 0.25);
  const result = db.prepare(`INSERT INTO tokenized_assets (name, asset_type, platform, current_nav, min_investment, liquidity_risk, lock_in_months, yield_or_return, sebi_regulated, quality_score, valuation_score, liquidity_score, composite_score, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    name, asset_type, platform, current_nav, min_investment, liquidity_risk, lock_in_months, yield_or_return, sebi_regulated ? 1 : 0,
    quality_score, valuation_score, liquidity_score, composite, notes
  );
  res.json({ success: true, id: result.lastInsertRowid });
});

module.exports = router;
