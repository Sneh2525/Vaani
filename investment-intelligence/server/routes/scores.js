const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { calculateBusinessScore, calculateValuationScore, calculateMarketScore, calculateSentimentScore, calculateAltDataScore, calculateComposite } = require('../scoring/allScores');

// Cache for computed scores (refreshed every 5 min)
let scoreCache = null;
let scoreCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 min

function computeAllScores() {
  if (scoreCache && Date.now() - scoreCacheTime < CACHE_TTL) return scoreCache;
  
  const stocks = db.prepare('SELECT * FROM stocks').all();
  const latestMacro = db.prepare('SELECT * FROM macro_data ORDER BY date DESC LIMIT 1').get();
  const results = [];

  // Pre-fetch all fundamentals and alt data in batch for performance
  const allFunds = {};
  const allAlts = {};
  db.prepare('SELECT * FROM fundamentals WHERE date = (SELECT MAX(date) FROM fundamentals WHERE ticker = fundamentals.ticker)').all()
    .forEach(f => allFunds[f.ticker] = f);
  db.prepare('SELECT * FROM alt_data WHERE date = (SELECT MAX(date) FROM alt_data WHERE ticker = alt_data.ticker)').all()
    .forEach(a => allAlts[a.ticker] = a);

  // Compute sector median PEs  
  const sectorPEs = {};
  for (const stock of stocks) {
    if (!sectorPEs[stock.sector]) sectorPEs[stock.sector] = [];
    const fund = allFunds[stock.ticker];
    if (fund?.pe > 0) sectorPEs[stock.sector].push(fund.pe);
  }
  const sectorMedians = {};
  for (const [sector, pes] of Object.entries(sectorPEs)) {
    pes.sort((a, b) => a - b);
    sectorMedians[sector] = pes[Math.floor(pes.length / 2)] || 25;
  }

  for (const stock of stocks) {
    const fund = allFunds[stock.ticker] || null;
    const altData = allAlts[stock.ticker] || null;
    const sectorMedianPE = sectorMedians[stock.sector] || 25;

    const business = calculateBusinessScore(fund, stock);
    const valuation = calculateValuationScore(fund, sectorMedianPE);
    const market = calculateMarketScore({ ...latestMacro, rbi_trend: 'CUTTING' });
    const sentiment = calculateSentimentScore(latestMacro, fund);
    const alt = calculateAltDataScore(altData);
    const comp = calculateComposite(business.total, valuation.total, market.total, sentiment.total, alt.total);

    results.push({
      ...stock,
      businessScore: business.total,
      valuationScore: valuation.total,
      marketScore: market.total,
      sentimentScore: sentiment.total,
      altDataScore: alt.total,
      composite: comp.composite,
      signal: comp.signal,
    });
  }

  results.sort((a, b) => b.composite - a.composite);
  scoreCache = results;
  scoreCacheTime = Date.now();
  
  // Persist scores to DB (background, non-blocking)
  const upsert = db.prepare(`INSERT OR REPLACE INTO scores 
    (ticker, date, business_score, valuation_score, market_score, sentiment_score, alt_data_score, composite, signal)
    VALUES (?, date('now'), ?, ?, ?, ?, ?, ?, ?)`);
  const persist = db.transaction(() => {
    for (const r of results) {
      upsert.run(r.ticker, r.businessScore, r.valuationScore, r.marketScore, r.sentimentScore, r.altDataScore, r.composite, r.signal);
    }
  });
  persist();

  return results;
}

// GET /api/scores — all stocks with pagination, search, and filter
router.get('/', (req, res) => {
  try {
    const allScores = computeAllScores();
    const { sector, signal, search, page = 1, limit = 50, sort = 'composite' } = req.query;
    
    let filtered = allScores;
    
    // Filter by sector
    if (sector && sector !== 'ALL') {
      filtered = filtered.filter(s => s.sector === sector);
    }
    
    // Filter by signal
    if (signal && signal !== 'ALL') {
      filtered = filtered.filter(s => s.signal === signal);
    }
    
    // Search by ticker or name
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(s => 
        s.ticker?.toLowerCase().includes(q) || 
        s.name?.toLowerCase().includes(q) ||
        s.sector?.toLowerCase().includes(q) ||
        s.industry?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sort === 'ticker') filtered.sort((a, b) => a.ticker.localeCompare(b.ticker));
    else if (sort === 'market_cap') filtered.sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0));
    else if (sort === 'bss') filtered.sort((a, b) => (b.businessScore || 0) - (a.businessScore || 0));
    else filtered.sort((a, b) => (b.composite || 0) - (a.composite || 0));

    const total = filtered.length;
    const p = parseInt(page);
    const l = parseInt(limit);
    const paginated = filtered.slice((p - 1) * l, p * l);

    res.json({
      data: paginated,
      total,
      page: p,
      totalPages: Math.ceil(total / l),
      sectors: [...new Set(allScores.map(s => s.sector))].sort(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/scores/summary — aggregated stats across all stocks
router.get('/summary', (req, res) => {
  try {
    const allScores = computeAllScores();
    const signals = { 'STRONG BUY': 0, 'BUY': 0, 'WATCH': 0, 'AVOID': 0, 'EXIT': 0 };
    const sectors = {};
    let totalBSS = 0, totalVRS = 0, count = 0;

    for (const s of allScores) {
      signals[s.signal] = (signals[s.signal] || 0) + 1;
      if (!sectors[s.sector]) sectors[s.sector] = { count: 0, avgComposite: 0, buys: 0 };
      sectors[s.sector].count++;
      sectors[s.sector].avgComposite += s.composite;
      if (s.signal === 'BUY' || s.signal === 'STRONG BUY') sectors[s.sector].buys++;
      totalBSS += s.businessScore;
      totalVRS += s.valuationScore;
      count++;
    }

    for (const [k, v] of Object.entries(sectors)) {
      v.avgComposite = Math.round((v.avgComposite / v.count) * 10) / 10;
    }

    res.json({
      totalStocks: allScores.length,
      signals,
      avgBSS: Math.round((totalBSS / count) * 10) / 10,
      avgVRS: Math.round((totalVRS / count) * 10) / 10,
      topBuys: allScores.filter(s => s.signal === 'STRONG BUY' || s.signal === 'BUY').slice(0, 10),
      topAvoids: allScores.filter(s => s.signal === 'AVOID' || s.signal === 'EXIT').slice(0, 10),
      sectors,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/scores/:ticker — single stock deep analysis
router.get('/:ticker', (req, res) => {
  try {
    const { ticker } = req.params;
    const stock = db.prepare('SELECT * FROM stocks WHERE ticker = ?').get(ticker);
    if (!stock) return res.status(404).json({ error: 'Stock not found' });

    const fund = db.prepare('SELECT * FROM fundamentals WHERE ticker = ? ORDER BY date DESC LIMIT 1').get(ticker);
    const altData = db.prepare('SELECT * FROM alt_data WHERE ticker = ? ORDER BY date DESC LIMIT 1').get(ticker);
    const latestMacro = db.prepare('SELECT * FROM macro_data ORDER BY date DESC LIMIT 1').get();
    const narrative = db.prepare('SELECT * FROM narrative_risk WHERE ticker = ? ORDER BY date DESC LIMIT 1').get(ticker);
    const scenarios = db.prepare('SELECT * FROM outcome_scenarios WHERE ticker = ? ORDER BY date DESC LIMIT 1').get(ticker);
    const historicalScores = db.prepare('SELECT * FROM scores WHERE ticker = ? ORDER BY date DESC LIMIT 30').all(ticker);

    // Compute sector median PE
    const sectorStocks = db.prepare('SELECT ticker FROM stocks WHERE sector = ?').all(stock.sector);
    const pes = [];
    for (const ss of sectorStocks) {
      const f = db.prepare('SELECT pe FROM fundamentals WHERE ticker = ? ORDER BY date DESC LIMIT 1').get(ss.ticker);
      if (f?.pe > 0) pes.push(f.pe);
    }
    pes.sort((a, b) => a - b);
    const sectorMedianPE = pes[Math.floor(pes.length / 2)] || 25;

    const business = calculateBusinessScore(fund, stock);
    const valuation = calculateValuationScore(fund, sectorMedianPE);
    const market = calculateMarketScore({ ...latestMacro, rbi_trend: 'CUTTING' });
    const sentiment = calculateSentimentScore(latestMacro, fund);
    const alt = calculateAltDataScore(altData);
    const comp = calculateComposite(business.total, valuation.total, market.total, sentiment.total, alt.total);

    // Peer comparison
    const peers = db.prepare('SELECT s.ticker, s.name, s.market_cap, sc.composite, sc.signal FROM stocks s LEFT JOIN scores sc ON s.ticker = sc.ticker WHERE s.sector = ? AND s.ticker != ? ORDER BY s.market_cap DESC LIMIT 5').all(stock.sector, ticker);

    res.json({
      stock,
      fundamentals: fund,
      scores: {
        businessScore: business.total, valuationScore: valuation.total,
        marketScore: market.total, sentimentScore: sentiment.total,
        altDataScore: alt.total, composite: comp.composite, signal: comp.signal
      },
      breakdowns: { business: business.breakdown, valuation: valuation.breakdown, market: market.breakdown, sentiment: sentiment.breakdown, alt: alt.breakdown },
      narrative,
      scenarios,
      historicalScores,
      peers,
      redFlags: getRedFlags(fund, narrative)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function getRedFlags(fund, narrative) {
  const flags = [];
  if (fund?.promoter_pledge > 30) flags.push({ level: 'CRITICAL', text: `Promoter pledge ${fund.promoter_pledge}% — above 30% threshold` });
  else if (fund?.promoter_pledge > 15) flags.push({ level: 'WARNING', text: `Promoter pledge ${fund.promoter_pledge}% — elevated, monitor closely` });
  if (fund?.debt_equity > 2 && !['Banking', 'NBFC'].includes(fund?.sector)) flags.push({ level: 'WARNING', text: `High D/E ratio: ${fund.debt_equity}x` });
  if (fund?.interest_coverage < 2) flags.push({ level: 'CRITICAL', text: `Low interest coverage: ${fund.interest_coverage}x` });
  if (narrative?.crack_detected) flags.push({ level: 'WARNING', text: `Narrative crack detected: ${narrative.crack_notes || narrative.dominant_narrative}` });
  if (narrative?.consensus_level >= 8) flags.push({ level: 'WARNING', text: `Very high narrative consensus (${narrative.consensus_level}/10) — high narrative break risk` });
  return flags;
}

module.exports = router;
