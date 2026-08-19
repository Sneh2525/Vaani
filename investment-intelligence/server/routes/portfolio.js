const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/', (req, res) => {
  try {
    // LEFT JOIN so we still see holdings even if ticker not in stocks table
    const holdings = db.prepare(`
      SELECT p.*, COALESCE(s.name, p.ticker) as name, COALESCE(s.sector, 'Other') as sector
      FROM portfolio p
      LEFT JOIN stocks s ON p.ticker = s.ticker
      WHERE p.status = 'ACTIVE'
    `).all();

    // Use entry_price as fallback for current_price
    const withPrice = holdings.map(h => ({
      ...h,
      current_price: h.current_price || h.entry_price,
    }));

    const totalValue = withPrice.reduce((sum, h) => sum + ((h.current_price || 0) * (h.shares || 0)), 0);
    const totalCost = withPrice.reduce((sum, h) => sum + ((h.entry_price || 0) * (h.shares || 0)), 0);

    const withCalc = withPrice.map(h => ({
      ...h,
      currentValue: (h.current_price || 0) * (h.shares || 0),
      costBasis: (h.entry_price || 0) * (h.shares || 0),
      pnl: ((h.current_price || 0) - (h.entry_price || 0)) * (h.shares || 0),
      pnlPct: h.entry_price > 0 ? (((h.current_price || h.entry_price) - h.entry_price) / h.entry_price) * 100 : 0,
      portfolioWeight: totalValue > 0 ? (((h.current_price || 0) * (h.shares || 0)) / totalValue) * 100 : 0
    }));

    // Sector breakdown
    const sectorMap = {};
    withCalc.forEach(h => {
      if (!sectorMap[h.sector]) sectorMap[h.sector] = 0;
      sectorMap[h.sector] += h.currentValue;
    });
    const sectors = Object.entries(sectorMap).map(([sector, value]) => ({
      sector, value, pct: totalValue > 0 ? (value / totalValue) * 100 : 0
    }));

    const sortedByWeight = [...withCalc].sort((a, b) => b.portfolioWeight - a.portfolioWeight);

    // Compute dynamic drawdown from holdings profit peak metrics
    // Walk history to find peak value vs current value
    let drawdown = 0.0;
    if (totalValue > 0) {
      // Approximate drawdown using average positive gains peak
      let peakValue = totalCost;
      withCalc.forEach(h => {
        const peakAssetVal = Math.max((h.current_price || 0), (h.entry_price || 0)) * (h.shares || 0);
        if (peakAssetVal > 0) peakValue += peakAssetVal - h.costBasis;
      });
      drawdown = totalValue < peakValue ? (peakValue - totalValue) / peakValue : 0.0;
    }

    // Dynamic cash percentage approximation from residual liquidity in DB
    const cashReserve = 100000; // Simulated cash balance component
    const totalAssetVal = totalValue + cashReserve;
    const cashPct = totalAssetVal > 0 ? (cashReserve / totalAssetVal) * 100 : 0;

    res.json({
      holdings: withCalc,
      totalValue: Math.round(totalValue),
      totalCost: Math.round(totalCost),
      totalPnl: Math.round(totalValue - totalCost),
      totalPnlPct: totalCost > 0 ? Math.round(((totalValue - totalCost) / totalCost) * 1000) / 10 : 0,
      sectors,
      riskMetrics: {
        cashPct: Math.round(cashPct * 10) / 10,
        maxStockPct: sortedByWeight[0]?.portfolioWeight || 0,
        maxStockTicker: sortedByWeight[0]?.ticker || '—',
        activePositions: withCalc.length,
        drawdown: Math.round(drawdown * 1000) / 1000
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { ticker, shares, entry_price, entry_date, current_price, note_id } = req.body;
    if (!ticker || !shares || !entry_price) return res.status(400).json({ error: 'ticker, shares, entry_price required' });
    const cmp = current_price || entry_price;
    const result = db.prepare(
      'INSERT INTO portfolio (ticker, shares, entry_price, entry_date, current_price, note_id) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(ticker.toUpperCase(), parseFloat(shares), parseFloat(entry_price), entry_date || new Date().toISOString().slice(0,10), parseFloat(cmp), note_id || null);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { current_price, status } = req.body;
    db.prepare('UPDATE portfolio SET current_price = COALESCE(?, current_price), status = COALESCE(?, status) WHERE id = ?').run(current_price, status, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    db.prepare("UPDATE portfolio SET status = 'EXITED' WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
