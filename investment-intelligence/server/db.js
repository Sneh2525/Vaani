const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'investment.db'));

// Enable WAL mode for better concurrent read performance with 300+ stocks
db.pragma('journal_mode = WAL');

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS stocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticker TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      sector TEXT NOT NULL,
      market_cap REAL,
      exchange TEXT DEFAULT 'NSE',
      industry TEXT,
      description TEXT,
      price REAL,
      volume INTEGER
    );

    CREATE TABLE IF NOT EXISTS price_daily (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticker TEXT NOT NULL,
      date TEXT NOT NULL,
      open REAL, high REAL, low REAL, close REAL,
      volume INTEGER, adj_close REAL,
      UNIQUE(ticker, date)
    );

    CREATE TABLE IF NOT EXISTS fundamentals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticker TEXT NOT NULL,
      date TEXT NOT NULL,
      pe REAL, pb REAL, roe REAL, roce REAL,
      debt_equity REAL, revenue_growth REAL,
      net_margin REAL, operating_margin REAL,
      interest_coverage REAL, fcf REAL,
      promoter_stake REAL, promoter_pledge REAL,
      peg REAL, ev_ebitda REAL,
      UNIQUE(ticker, date)
    );

    CREATE TABLE IF NOT EXISTS macro_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE NOT NULL,
      rbi_rate REAL,
      fii_flow REAL,
      dii_flow REAL,
      india_vix REAL,
      usd_inr REAL,
      nifty_pe REAL,
      gst_collection REAL,
      gdp_growth REAL,
      cpi REAL,
      us_fed_rate REAL,
      nifty_close REAL
    );

    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticker TEXT NOT NULL,
      date TEXT NOT NULL,
      business_score REAL,
      valuation_score REAL,
      market_score REAL,
      sentiment_score REAL,
      alt_data_score REAL,
      composite REAL,
      signal TEXT,
      UNIQUE(ticker, date)
    );

    CREATE TABLE IF NOT EXISTS decision_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      ticker TEXT NOT NULL,
      action TEXT NOT NULL,
      business_score REAL, valuation_score REAL,
      market_score REAL, sentiment_score REAL, composite_score REAL,
      entry_thesis TEXT,
      risk_1 TEXT, risk_2 TEXT, risk_3 TEXT,
      time_horizon TEXT,
      expected_scenario TEXT,
      what_proves_wrong TEXT,
      stop_loss TEXT,
      position_size_pct REAL,
      position_size_reason TEXT,
      entry_price REAL,
      status TEXT DEFAULT 'OPEN',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      note_id INTEGER REFERENCES decision_notes(id),
      review_date TEXT NOT NULL,
      outcome TEXT,
      bias_identified TEXT,
      what_right TEXT,
      what_wrong TEXT,
      framework_update TEXT,
      carry_forward_rule TEXT,
      exit_price REAL,
      actual_return REAL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS diary_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      macro_obs TEXT,
      sector_thesis TEXT,
      signal_flag TEXT,
      new_rule_idea TEXT,
      lesson TEXT,
      mood TEXT,
      key_insight TEXT,
      tags TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS alt_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticker TEXT NOT NULL,
      date TEXT NOT NULL,
      fastag_trend TEXT,
      fastag_change REAL,
      job_postings INTEGER,
      job_postings_change REAL,
      app_rank INTEGER,
      app_rank_change REAL,
      logistics_activity TEXT,
      logistics_score REAL,
      alt_data_score REAL,
      notes TEXT,
      UNIQUE(ticker, date)
    );

    CREATE TABLE IF NOT EXISTS narrative_risk (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticker TEXT NOT NULL,
      date TEXT NOT NULL,
      dominant_narrative TEXT,
      consensus_level INTEGER,
      destruction_event TEXT,
      narrative_risk_score REAL,
      crack_detected INTEGER DEFAULT 0,
      crack_notes TEXT,
      UNIQUE(ticker, date)
    );

    CREATE TABLE IF NOT EXISTS outcome_scenarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      note_id INTEGER REFERENCES decision_notes(id),
      ticker TEXT NOT NULL,
      date TEXT NOT NULL,
      bull_prob REAL DEFAULT 0.30,
      bull_target REAL,
      bull_return REAL,
      base_prob REAL DEFAULT 0.50,
      base_target REAL,
      base_return REAL,
      bear_prob REAL DEFAULT 0.20,
      bear_target REAL,
      bear_return REAL,
      expected_value REAL,
      timeframe_months INTEGER,
      actual_return REAL,
      calibration_score REAL
    );

    CREATE TABLE IF NOT EXISTS tokenized_assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      asset_type TEXT,
      platform TEXT,
      current_nav REAL,
      min_investment REAL,
      liquidity_risk TEXT,
      lock_in_months INTEGER,
      yield_or_return REAL,
      sebi_regulated INTEGER DEFAULT 0,
      quality_score REAL,
      valuation_score REAL,
      liquidity_score REAL,
      composite_score REAL,
      notes TEXT,
      date_added TEXT DEFAULT CURRENT_DATE
    );

    CREATE TABLE IF NOT EXISTS fiscal_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      description TEXT,
      amount REAL,
      due_date TEXT NOT NULL,
      is_recurring INTEGER DEFAULT 0,
      recurrence_months INTEGER,
      impact_level TEXT DEFAULT 'MEDIUM',
      is_paid INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS regulatory_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      source TEXT NOT NULL,
      event_type TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT,
      affected_sectors TEXT,
      affected_tickers TEXT,
      sentiment TEXT,
      impact_score REAL,
      url TEXT
    );

    CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticker TEXT NOT NULL,
      shares REAL NOT NULL,
      entry_price REAL NOT NULL,
      entry_date TEXT NOT NULL,
      current_price REAL,
      note_id INTEGER,
      status TEXT DEFAULT 'ACTIVE'
    );

    CREATE TABLE IF NOT EXISTS watchlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticker TEXT UNIQUE NOT NULL,
      added_date TEXT DEFAULT CURRENT_DATE,
      target_score REAL DEFAULT 7.0,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rule_name TEXT NOT NULL,
      ticker TEXT,
      condition TEXT NOT NULL,
      threshold REAL,
      current_value REAL,
      triggered INTEGER DEFAULT 0,
      trigger_date TEXT,
      action_taken TEXT,
      severity TEXT DEFAULT 'MEDIUM'
    );

    -- Performance indexes for 300+ stock queries
    CREATE INDEX IF NOT EXISTS idx_stocks_sector ON stocks(sector);
    CREATE INDEX IF NOT EXISTS idx_stocks_ticker ON stocks(ticker);
    CREATE INDEX IF NOT EXISTS idx_fundamentals_ticker ON fundamentals(ticker, date);
    CREATE INDEX IF NOT EXISTS idx_scores_ticker ON scores(ticker, date);
    CREATE INDEX IF NOT EXISTS idx_scores_composite ON scores(composite DESC);
    CREATE INDEX IF NOT EXISTS idx_alt_data_ticker ON alt_data(ticker, date);
    CREATE INDEX IF NOT EXISTS idx_narrative_ticker ON narrative_risk(ticker, date);
    CREATE INDEX IF NOT EXISTS idx_portfolio_ticker ON portfolio(ticker);
    CREATE INDEX IF NOT EXISTS idx_watchlist_ticker ON watchlist(ticker);
  `);

  seedData();
}

function seedData() {
  const stockCount = db.prepare('SELECT COUNT(*) as cnt FROM stocks').get();
  if (stockCount.cnt > 0) return;

  console.log('📦 Seeding Nifty 500 universe…');
  const { NIFTY_500, generateFundamentals } = require('./data/nifty500');

  // ── Insert all stocks ──
  const insertStock = db.prepare('INSERT OR IGNORE INTO stocks (ticker, name, sector, market_cap, industry) VALUES (?, ?, ?, ?, ?)');
  const insertMany = db.transaction((stocks) => {
    for (const s of stocks) {
      insertStock.run(s.ticker, s.name, s.sector, s.market_cap, s.industry);
    }
  });
  // Deduplicate by ticker
  const seen = new Set();
  const unique = NIFTY_500.filter(s => {
    if (seen.has(s.ticker)) return false;
    seen.add(s.ticker);
    return true;
  });
  insertMany(unique);
  console.log(`  ✓ ${unique.length} stocks inserted`);

  // ── Generate fundamentals for ALL stocks ──
  const insertFund = db.prepare(`INSERT OR IGNORE INTO fundamentals 
    (ticker, date, pe, pb, roe, roce, debt_equity, revenue_growth, net_margin, operating_margin, interest_coverage, promoter_stake, promoter_pledge, peg, ev_ebitda)
    VALUES (?, date('now'), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  
  // Hardcoded high-quality fundamentals for key stocks
  const keyFundamentals = {
    'TCS': { pe: 28.5, pb: 12.1, roe: 47.2, roce: 58.3, debt_equity: 0.05, revenue_growth: 8.4, net_margin: 19.2, operating_margin: 25.1, interest_coverage: 85, promoter_stake: 72.3, promoter_pledge: 0, peg: 3.4, ev_ebitda: 22.1 },
    'INFY': { pe: 23.2, pb: 8.5, roe: 31.8, roce: 38.2, debt_equity: 0.0, revenue_growth: 11.2, net_margin: 17.1, operating_margin: 22.4, interest_coverage: 120, promoter_stake: 13.1, promoter_pledge: 0, peg: 2.1, ev_ebitda: 18.3 },
    'HDFCBANK': { pe: 18.4, pb: 2.8, roe: 17.8, roce: 9.2, debt_equity: 7.2, revenue_growth: 19.3, net_margin: 22.4, operating_margin: 29.3, interest_coverage: 4.2, promoter_stake: 0, promoter_pledge: 0, peg: 1.2, ev_ebitda: 14.5 },
    'RELIANCE': { pe: 26.8, pb: 2.9, roe: 11.2, roce: 10.8, debt_equity: 0.42, revenue_growth: 5.2, net_margin: 7.8, operating_margin: 16.4, interest_coverage: 8.2, promoter_stake: 50.3, promoter_pledge: 7.1, peg: 5.1, ev_ebitda: 12.4 },
    'WIPRO': { pe: 20.1, pb: 4.2, roe: 18.9, roce: 22.1, debt_equity: 0.08, revenue_growth: 7.1, net_margin: 15.2, operating_margin: 19.8, interest_coverage: 65, promoter_stake: 72.9, promoter_pledge: 0, peg: 2.8, ev_ebitda: 16.1 },
    'BAJFINANCE': { pe: 34.2, pb: 7.1, roe: 22.4, roce: 14.2, debt_equity: 4.8, revenue_growth: 28.4, net_margin: 24.8, operating_margin: 32.1, interest_coverage: 2.4, promoter_stake: 55.9, promoter_pledge: 12.3, peg: 1.2, ev_ebitda: 28.4 },
    'ASIANPAINT': { pe: 52.1, pb: 14.8, roe: 27.8, roce: 33.4, debt_equity: 0.04, revenue_growth: 6.2, net_margin: 14.3, operating_margin: 19.8, interest_coverage: 95, promoter_stake: 52.1, promoter_pledge: 0, peg: 8.4, ev_ebitda: 38.4 },
    'MARUTI': { pe: 24.8, pb: 4.9, roe: 22.1, roce: 28.4, debt_equity: 0.01, revenue_growth: 14.2, net_margin: 8.4, operating_margin: 12.1, interest_coverage: 210, promoter_stake: 56.4, promoter_pledge: 0, peg: 1.8, ev_ebitda: 16.4 },
    'SUNPHARMA': { pe: 34.8, pb: 5.2, roe: 15.8, roce: 18.2, debt_equity: 0.12, revenue_growth: 9.8, net_margin: 12.1, operating_margin: 18.4, interest_coverage: 22, promoter_stake: 54.5, promoter_pledge: 0, peg: 3.6, ev_ebitda: 24.8 },
    'TATAMOTORS': { pe: 8.4, pb: 2.1, roe: 28.4, roce: 12.4, debt_equity: 1.24, revenue_growth: 18.4, net_margin: 5.8, operating_margin: 9.2, interest_coverage: 3.8, promoter_stake: 46.4, promoter_pledge: 1.2, peg: 0.46, ev_ebitda: 9.8 },
    'ICICIBANK': { pe: 17.2, pb: 3.1, roe: 18.4, roce: 10.2, debt_equity: 8.4, revenue_growth: 24.8, net_margin: 24.2, operating_margin: 34.8, interest_coverage: 3.8, promoter_stake: 0, promoter_pledge: 0, peg: 0.7, ev_ebitda: 15.2 },
    'KOTAKBANK': { pe: 19.8, pb: 3.4, roe: 15.2, roce: 8.4, debt_equity: 6.8, revenue_growth: 21.4, net_margin: 22.8, operating_margin: 32.4, interest_coverage: 4.2, promoter_stake: 25.9, promoter_pledge: 0, peg: 0.9, ev_ebitda: 16.8 },
    'HCLTECH': { pe: 22.4, pb: 6.8, roe: 24.8, roce: 28.4, debt_equity: 0.04, revenue_growth: 12.4, net_margin: 14.8, operating_margin: 20.4, interest_coverage: 78, promoter_stake: 60.8, promoter_pledge: 0, peg: 1.8, ev_ebitda: 17.2 },
    'TITAN': { pe: 68.4, pb: 18.4, roe: 28.4, roce: 34.8, debt_equity: 0.08, revenue_growth: 21.4, net_margin: 9.8, operating_margin: 12.4, interest_coverage: 48, promoter_stake: 52.9, promoter_pledge: 0, peg: 3.2, ev_ebitda: 52.4 },
    'HINDUNILVR': { pe: 55.2, pb: 11.4, roe: 21.8, roce: 28.2, debt_equity: 0.02, revenue_growth: 4.8, net_margin: 16.2, operating_margin: 23.4, interest_coverage: 180, promoter_stake: 61.9, promoter_pledge: 0, peg: 11.5, ev_ebitda: 42.8 },
    'ITC': { pe: 24.8, pb: 7.4, roe: 28.4, roce: 34.2, debt_equity: 0.01, revenue_growth: 6.8, net_margin: 26.4, operating_margin: 35.8, interest_coverage: 220, promoter_stake: 0, promoter_pledge: 0, peg: 3.6, ev_ebitda: 16.8 },
    'SBIN': { pe: 10.2, pb: 1.8, roe: 18.2, roce: 6.4, debt_equity: 12.8, revenue_growth: 18.4, net_margin: 18.8, operating_margin: 28.4, interest_coverage: 2.8, promoter_stake: 57.5, promoter_pledge: 0, peg: 0.55, ev_ebitda: 8.4 },
    'BHARTIARTL': { pe: 82.4, pb: 12.8, roe: 16.8, roce: 14.2, debt_equity: 1.42, revenue_growth: 14.8, net_margin: 8.4, operating_margin: 48.2, interest_coverage: 4.8, promoter_stake: 53.5, promoter_pledge: 0, peg: 5.6, ev_ebitda: 12.8 },
    'LT': { pe: 32.4, pb: 5.8, roe: 18.4, roce: 14.2, debt_equity: 0.82, revenue_growth: 18.2, net_margin: 6.8, operating_margin: 10.4, interest_coverage: 5.8, promoter_stake: 0, promoter_pledge: 0, peg: 1.8, ev_ebitda: 24.8 },
    'HAL': { pe: 38.2, pb: 8.4, roe: 22.4, roce: 28.2, debt_equity: 0.02, revenue_growth: 22.8, net_margin: 18.4, operating_margin: 24.8, interest_coverage: 85, promoter_stake: 71.6, promoter_pledge: 0, peg: 1.7, ev_ebitda: 28.4 },
    'NTPC': { pe: 18.2, pb: 2.4, roe: 12.8, roce: 10.4, debt_equity: 1.42, revenue_growth: 8.4, net_margin: 12.2, operating_margin: 28.4, interest_coverage: 4.2, promoter_stake: 51.1, promoter_pledge: 0, peg: 2.2, ev_ebitda: 12.8 },
    'ADANIPORTS': { pe: 22.4, pb: 4.8, roe: 22.4, roce: 18.4, debt_equity: 0.84, revenue_growth: 24.8, net_margin: 31.4, operating_margin: 48.4, interest_coverage: 5.8, promoter_stake: 65.8, promoter_pledge: 18.4, peg: 0.9, ev_ebitda: 14.8 },
    'ZOMATO': { pe: 284, pb: 12.4, roe: 4.2, roce: 3.8, debt_equity: 0.02, revenue_growth: 68.4, net_margin: 2.4, operating_margin: 3.8, interest_coverage: 12, promoter_stake: 0, promoter_pledge: 0, peg: 4.2, ev_ebitda: 124 },
    'PAYTM': { pe: -18.4, pb: 1.8, roe: -12.4, roce: -8.4, debt_equity: 0.04, revenue_growth: 22.4, net_margin: -8.4, operating_margin: -6.2, interest_coverage: -4.8, promoter_stake: 19.4, promoter_pledge: 0, peg: -2.2, ev_ebitda: -84 },
    'DMART': { pe: 112.4, pb: 26.8, roe: 24.8, roce: 28.4, debt_equity: 0.02, revenue_growth: 18.4, net_margin: 5.8, operating_margin: 8.4, interest_coverage: 84, promoter_stake: 74.8, promoter_pledge: 0, peg: 6.2, ev_ebitda: 64.8 },
    'DLF': { pe: 52.4, pb: 5.8, roe: 11.2, roce: 8.8, debt_equity: 0.28, revenue_growth: 22.4, net_margin: 24.8, operating_margin: 38.4, interest_coverage: 8.2, promoter_stake: 74.1, promoter_pledge: 0, peg: 2.3, ev_ebitda: 28.4 },
    'TATASTEEL': { pe: 14.2, pb: 1.8, roe: 12.4, roce: 10.8, debt_equity: 0.82, revenue_growth: 4.8, net_margin: 4.2, operating_margin: 12.4, interest_coverage: 4.8, promoter_stake: 33.9, promoter_pledge: 0, peg: 3.0, ev_ebitda: 8.4 },
    'ULTRACEMCO': { pe: 38.4, pb: 5.8, roe: 14.8, roce: 16.4, debt_equity: 0.28, revenue_growth: 8.2, net_margin: 8.4, operating_margin: 18.2, interest_coverage: 14.8, promoter_stake: 59.7, promoter_pledge: 0, peg: 4.7, ev_ebitda: 22.4 },
    'POWERGRID': { pe: 18.8, pb: 3.2, roe: 17.4, roce: 12.8, debt_equity: 1.82, revenue_growth: 4.8, net_margin: 31.4, operating_margin: 64.8, interest_coverage: 3.2, promoter_stake: 51.3, promoter_pledge: 0, peg: 3.9, ev_ebitda: 11.2 },
    'COALINDIA': { pe: 8.2, pb: 4.8, roe: 52.4, roce: 62.8, debt_equity: 0.08, revenue_growth: 2.4, net_margin: 18.4, operating_margin: 28.2, interest_coverage: 42, promoter_stake: 63.1, promoter_pledge: 0, peg: 3.4, ev_ebitda: 5.8 },
    'INDIGO': { pe: 18.4, pb: 12.8, roe: 68.4, roce: 42.8, debt_equity: 2.42, revenue_growth: 24.8, net_margin: 10.4, operating_margin: 14.8, interest_coverage: 5.8, promoter_stake: 49.2, promoter_pledge: 0, peg: 0.74, ev_ebitda: 8.4 },
    'TRENT': { pe: 142, pb: 28.4, roe: 20.8, roce: 22.4, debt_equity: 0.22, revenue_growth: 52.4, net_margin: 6.4, operating_margin: 10.8, interest_coverage: 14.8, promoter_stake: 37.0, promoter_pledge: 0, peg: 2.7, ev_ebitda: 82.4 },
    'JSWSTEEL': { pe: 22.8, pb: 2.8, roe: 12.4, roce: 10.2, debt_equity: 0.62, revenue_growth: 8.4, net_margin: 5.8, operating_margin: 15.8, interest_coverage: 5.2, promoter_stake: 45.0, promoter_pledge: 0, peg: 2.7, ev_ebitda: 9.8 },
    'DRREDDY': { pe: 18.4, pb: 3.8, roe: 20.4, roce: 22.8, debt_equity: 0.08, revenue_growth: 12.4, net_margin: 14.8, operating_margin: 22.4, interest_coverage: 42, promoter_stake: 26.6, promoter_pledge: 0, peg: 1.5, ev_ebitda: 14.2 },
    'CIPLA': { pe: 24.8, pb: 4.2, roe: 16.8, roce: 18.4, debt_equity: 0.04, revenue_growth: 8.8, net_margin: 12.4, operating_margin: 18.8, interest_coverage: 55, promoter_stake: 33.3, promoter_pledge: 0, peg: 2.8, ev_ebitda: 18.4 },
    'AXISBANK': { pe: 14.8, pb: 2.2, roe: 14.8, roce: 8.8, debt_equity: 9.2, revenue_growth: 18.4, net_margin: 20.8, operating_margin: 28.4, interest_coverage: 3.4, promoter_stake: 0, promoter_pledge: 0, peg: 0.8, ev_ebitda: 12.8 },
    'M&M': { pe: 28.4, pb: 5.2, roe: 18.4, roce: 14.8, debt_equity: 0.32, revenue_growth: 18.8, net_margin: 8.4, operating_margin: 14.2, interest_coverage: 12.8, promoter_stake: 18.4, promoter_pledge: 0, peg: 1.5, ev_ebitda: 18.4 },
    'BEL': { pe: 42.4, pb: 10.2, roe: 25.8, roce: 32.4, debt_equity: 0.01, revenue_growth: 28.4, net_margin: 16.8, operating_margin: 22.4, interest_coverage: 120, promoter_stake: 51.1, promoter_pledge: 0, peg: 1.5, ev_ebitda: 32.4 },
    'SIEMENS': { pe: 82.4, pb: 14.8, roe: 18.4, roce: 22.8, debt_equity: 0.02, revenue_growth: 22.4, net_margin: 8.4, operating_margin: 12.8, interest_coverage: 85, promoter_stake: 75.0, promoter_pledge: 0, peg: 3.7, ev_ebitda: 58.4 },
    'NESTLEIND': { pe: 72.4, pb: 85.2, roe: 118.4, roce: 142.8, debt_equity: 0.01, revenue_growth: 8.4, net_margin: 14.8, operating_margin: 22.4, interest_coverage: 280, promoter_stake: 62.8, promoter_pledge: 0, peg: 8.6, ev_ebitda: 52.4 },
    'PIDILITIND': { pe: 82.4, pb: 18.8, roe: 24.8, roce: 28.4, debt_equity: 0.08, revenue_growth: 12.4, net_margin: 14.2, operating_margin: 20.4, interest_coverage: 65, promoter_stake: 69.5, promoter_pledge: 0, peg: 6.6, ev_ebitda: 55.4 },
    'SRF': { pe: 42.8, pb: 6.8, roe: 16.8, roce: 14.4, debt_equity: 0.48, revenue_growth: 8.8, net_margin: 8.4, operating_margin: 18.2, interest_coverage: 8.4, promoter_stake: 50.5, promoter_pledge: 0, peg: 4.9, ev_ebitda: 22.4 },
    'APOLLOHOSP': { pe: 82.4, pb: 12.8, roe: 16.8, roce: 14.2, debt_equity: 0.42, revenue_growth: 18.4, net_margin: 6.8, operating_margin: 12.4, interest_coverage: 8.2, promoter_stake: 29.3, promoter_pledge: 0, peg: 4.5, ev_ebitda: 42.4 },
    'LICI': { pe: 14.2, pb: 9.8, roe: 72.4, roce: 8.4, debt_equity: 0, revenue_growth: 12.4, net_margin: 2.4, operating_margin: 4.8, interest_coverage: 0, promoter_stake: 96.5, promoter_pledge: 0, peg: 1.1, ev_ebitda: 0 },
  };

  const insertFundBatch = db.transaction((stocks) => {
    for (const s of stocks) {
      const f = keyFundamentals[s.ticker] || generateFundamentals(s);
      insertFund.run(s.ticker, f.pe, f.pb, f.roe, f.roce, f.debt_equity, f.revenue_growth, f.net_margin, f.operating_margin, f.interest_coverage, f.promoter_stake, f.promoter_pledge, f.peg, f.ev_ebitda);
    }
  });
  insertFundBatch(unique);
  console.log(`  ✓ ${unique.length} fundamentals generated`);

  // ── Macro data (13 months) ──
  const insertMacro = db.prepare(`INSERT OR IGNORE INTO macro_data 
    (date, rbi_rate, fii_flow, dii_flow, india_vix, usd_inr, nifty_pe, gst_collection, gdp_growth, cpi, us_fed_rate, nifty_close)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const macroHistory = [
    ['2024-04-01', 6.5, 4820, 3210, 12.8, 83.4, 21.8, 187000, 7.8, 4.9, 5.25, 22326],
    ['2024-05-01', 6.5, -2340, 5680, 14.2, 84.1, 22.4, 192000, 7.6, 4.8, 5.25, 22551],
    ['2024-06-01', 6.5, 3840, 4210, 13.4, 83.8, 21.2, 196000, 7.9, 5.1, 5.25, 24010],
    ['2024-07-01', 6.5, 5240, 3840, 11.8, 83.6, 23.8, 189000, 7.7, 5.0, 5.25, 24770],
    ['2024-08-01', 6.5, -8240, 7840, 19.2, 84.2, 22.8, 193000, 7.5, 4.9, 5.00, 24148],
    ['2024-09-01', 6.5, 6480, 2840, 12.2, 83.9, 24.2, 197000, 7.8, 4.8, 4.75, 26216],
    ['2024-10-01', 6.5, -3120, 8240, 14.8, 84.3, 23.4, 191000, 7.9, 5.2, 4.75, 24205],
    ['2024-11-01', 6.5, -5280, 9480, 16.8, 84.8, 22.8, 188000, 7.6, 5.4, 4.50, 23532],
    ['2024-12-01', 6.5, -4840, 8280, 15.4, 85.2, 22.1, 194000, 7.4, 5.2, 4.50, 23644],
    ['2025-01-01', 6.5, -8480, 9840, 18.1, 86.4, 21.8, 196000, 7.5, 5.0, 4.50, 23163],
    ['2025-02-01', 6.25, 2840, 4280, 12.8, 86.8, 21.2, 199000, 7.6, 4.8, 4.25, 22082],
    ['2025-03-01', 6.25, 3240, 3840, 13.2, 85.9, 21.8, 189000, 7.7, 4.7, 4.25, 23519],
    ['2025-04-01', 6.0, 4820, 3610, 11.4, 84.8, 22.4, 197000, 7.8, 4.5, 4.00, 24125]
  ];
  macroHistory.forEach(m => insertMacro.run(...m));

  // ── Watchlist (top 30 stocks) ──
  const insertWatch = db.prepare('INSERT OR IGNORE INTO watchlist (ticker, target_score, notes) VALUES (?, ?, ?)');
  ['TCS', 'INFY', 'HDFCBANK', 'RELIANCE', 'BAJFINANCE', 'ICICIBANK', 'MARUTI', 'TATAMOTORS', 'SUNPHARMA', 'TITAN',
   'SBIN', 'BHARTIARTL', 'LT', 'AXISBANK', 'ITC', 'HINDUNILVR', 'M&M', 'WIPRO', 'HCLTECH', 'HAL',
   'NTPC', 'ADANIPORTS', 'DLF', 'DMART', 'BEL', 'TRENT', 'DRREDDY', 'CIPLA', 'COALINDIA', 'KOTAKBANK'
  ].forEach(t => insertWatch.run(t, 7.0, 'Core watchlist'));

  // ── Portfolio ──
  const insertPortfolio = db.prepare('INSERT OR IGNORE INTO portfolio (ticker, shares, entry_price, entry_date, current_price) VALUES (?, ?, ?, ?, ?)');
  [
    ['TCS', 10, 3850, '2024-08-15', 4180],
    ['HDFCBANK', 20, 1680, '2024-09-20', 1890],
    ['ICICIBANK', 50, 1020, '2024-10-10', 1380],
    ['TATAMOTORS', 30, 920, '2024-11-05', 780],
    ['RELIANCE', 15, 2820, '2025-01-08', 2950]
  ].forEach(p => insertPortfolio.run(...p));

  // ── Alt Data for 30+ stocks ──
  const insertAlt = db.prepare(`INSERT OR IGNORE INTO alt_data 
    (ticker, date, fastag_trend, fastag_change, job_postings, job_postings_change, app_rank, app_rank_change, logistics_activity, logistics_score, alt_data_score)
    VALUES (?, date('now'), ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const altData = [
    ['TCS', 'STABLE', 2.4, 1240, 8.2, null, null, 'NORMAL', 6.2, 6.8],
    ['INFY', 'RISING', 4.2, 1580, 12.4, null, null, 'NORMAL', 6.8, 7.2],
    ['HDFCBANK', 'RISING', 6.8, 840, 5.2, null, null, 'NORMAL', 7.2, 7.4],
    ['RELIANCE', 'RISING', 8.4, 2840, 14.8, null, null, 'HIGH', 8.4, 8.1],
    ['BAJFINANCE', 'STABLE', 1.2, 980, 4.8, null, null, 'NORMAL', 6.4, 6.6],
    ['ZOMATO', 'RISING', 5.2, 840, 8.4, 12, -3, 'HIGH', 7.8, 8.2],
    ['PAYTM', 'FALLING', -12.4, 420, -18.4, 24, -8, 'LOW', 3.2, 2.8],
    ['MARUTI', 'RISING', 7.8, 1240, 12.2, null, null, 'HIGH', 8.2, 8.4],
    ['TATAMOTORS', 'STABLE', 3.2, 1840, 8.4, null, null, 'NORMAL', 6.4, 6.8],
    ['ADANIPORTS', 'RISING', 14.2, 480, 18.4, null, null, 'HIGH', 9.2, 9.0],
    ['SBIN', 'RISING', 5.8, 520, 12.8, null, null, 'NORMAL', 7.4, 7.2],
    ['BHARTIARTL', 'RISING', 8.2, 1420, 22.4, null, null, 'HIGH', 8.8, 8.4],
    ['LT', 'RISING', 12.4, 1880, 14.8, null, null, 'HIGH', 8.8, 8.6],
    ['ITC', 'STABLE', 2.8, 680, 4.2, null, null, 'NORMAL', 6.4, 6.2],
    ['HINDUNILVR', 'STABLE', 1.2, 420, 2.4, null, null, 'NORMAL', 5.8, 5.4],
    ['M&M', 'RISING', 9.4, 1640, 18.4, null, null, 'HIGH', 8.4, 8.2],
    ['HAL', 'RISING', 6.8, 2240, 32.4, null, null, 'HIGH', 9.2, 8.8],
    ['BEL', 'RISING', 4.2, 1820, 28.4, null, null, 'HIGH', 8.8, 8.4],
    ['TITAN', 'RISING', 3.8, 880, 8.4, null, null, 'NORMAL', 7.2, 7.0],
    ['DLF', 'RISING', 8.8, 420, 14.2, null, null, 'HIGH', 7.8, 7.4],
    ['DMART', 'RISING', 7.2, 380, 8.8, null, null, 'HIGH', 7.4, 7.2],
    ['TRENT', 'RISING', 5.2, 1240, 42.4, null, null, 'HIGH', 8.4, 8.2],
    ['DRREDDY', 'STABLE', 2.4, 680, 5.8, null, null, 'NORMAL', 6.2, 6.4],
    ['CIPLA', 'STABLE', 1.8, 620, 4.2, null, null, 'NORMAL', 6.0, 6.2],
    ['NTPC', 'RISING', 6.4, 480, 8.2, null, null, 'HIGH', 7.8, 7.4],
    ['COALINDIA', 'STABLE', 4.8, 180, 2.4, null, null, 'NORMAL', 6.8, 6.4],
    ['INDIGO', 'RISING', 12.4, 1280, 18.8, 5, -2, 'HIGH', 8.8, 8.4],
    ['AXISBANK', 'STABLE', 3.2, 680, 8.4, null, null, 'NORMAL', 6.8, 6.6],
    ['WIPRO', 'FALLING', -1.2, 1120, -4.2, null, null, 'LOW', 4.8, 5.2],
    ['HCLTECH', 'RISING', 3.8, 1480, 8.4, null, null, 'NORMAL', 6.8, 7.0],
  ];
  altData.forEach(a => insertAlt.run(...a));

  // ── Narrative Risk for 20 key stocks ──
  const insertNarrative = db.prepare(`INSERT OR IGNORE INTO narrative_risk 
    (ticker, date, dominant_narrative, consensus_level, destruction_event, narrative_risk_score, crack_detected)
    VALUES (?, date('now'), ?, ?, ?, ?, ?)`);
  const narratives = [
    ['TCS', 'AI-driven IT spending revival will restore double-digit growth', 7, 'US tech budget cuts + GenAI replacing outsourcing jobs', 5.8, 0],
    ['INFY', 'Large deal wins will accelerate growth to 12%+ in FY26', 8, 'Deal cancellations or significant furloughs in Q1 FY26', 6.4, 0],
    ['HDFCBANK', 'Merger synergies and credit growth will drive ROE expansion to 18%+', 6, 'Credit quality deterioration in HDFC legacy book', 4.8, 0],
    ['RELIANCE', 'Jio Financial + retail flywheel creates new growth vectors', 7, 'Telecom ARPU plateau or retail margin compression', 5.2, 0],
    ['BAJFINANCE', 'Fintech moat and massive addressable market justify premium valuation', 9, 'RBI regulatory action or NPA spike in unsecured lending', 8.2, 1],
    ['TATAMOTORS', 'JLR EV pivot and premiumization justify re-rating', 6, 'EV demand slowdown in UK/Europe or chip shortage recurrence', 4.4, 0],
    ['ZOMATO', 'Hyperpure + Blinkit form profitable adjacency flywheel', 7, 'Quick commerce price war or food delivery market saturation', 6.8, 0],
    ['PAYTM', 'Payment aggregator license recovery and monetization of user base', 5, 'Further RBI action or UPI market share loss to competitors', 7.4, 1],
    ['ADANIPORTS', 'Infrastructure supercycle and port privatization drive volume growth', 6, 'Hindenburg-style short attack or governance issue resurfacing', 6.2, 0],
    ['ASIANPAINT', 'Distribution moat and pricing power sustain 20%+ ROE forever', 9, 'Grasim/Birla Opus serious price competition eroding market share', 8.8, 1],
    ['SBIN', 'PSU bank turnaround complete, asset quality best in decade', 7, 'Govt policy shift on PSU bank dividends or merger mandates', 5.2, 0],
    ['BHARTIARTL', 'ARPU upcycle and 5G monetization drive multi-year re-rating', 8, 'Tariff war resurgence if Vodafone Idea gets equity infusion', 6.8, 0],
    ['HAL', 'Defence capex supercycle and Tejas Mark 2 order flow', 8, 'Defence budget cuts or delay in AMCA/Tejas production', 5.4, 0],
    ['DLF', 'India real estate super cycle driven by rising incomes', 7, 'Interest rate reversal or regulatory tightening on luxury housing', 5.8, 0],
    ['TRENT', 'Zudio value fashion disruption creates next DMart in apparel', 9, 'Same-store growth slowdown or margin squeeze from rapid expansion', 7.8, 1],
    ['LT', 'Order book at all-time high driven by infra + defence', 6, 'Execution delays or rising raw material costs squeeze margins', 4.8, 0],
    ['ITC', 'FMCG + Hotel demerger unlocks sum-of-parts value', 5, 'Cigarette volume decline accelerates or ESG-driven de-rating', 3.8, 0],
    ['NESTLEIND', 'Premium positioning and distribution moat are unassailable', 8, 'Food safety scandal or extreme input cost inflation', 6.4, 0],
    ['INDIGO', 'Domestic aviation duopoly and international expansion thesis', 7, 'Fuel price spike or fleet groundings due to engine issues', 5.8, 0],
    ['COALINDIA', 'Energy security narrative keeps Coal India relevant for decade', 5, 'Accelerated renewable transition reduces thermal coal demand', 4.2, 0],
  ];
  narratives.forEach(n => insertNarrative.run(...n));

  // ── Regulatory events ──
  const insertReg = db.prepare(`INSERT OR IGNORE INTO regulatory_events 
    (date, source, event_type, title, summary, affected_sectors, affected_tickers, sentiment, impact_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const regEvents = [
    ['2025-02-01', 'SEBI', 'Circular', 'SEBI Responsible AI Guidelines 2025', 'All algo trading systems must be auditable and explainable by Q3 2025', 'IT,Fintech,Banking', 'TCS,INFY,PAYTM', 'NEUTRAL', 6.2],
    ['2025-01-15', 'RBI', 'Policy', 'RBI First Rate Cut in 5 Years — 6.5% to 6.25%', 'RBI cuts repo rate by 25bps signaling easing cycle start', 'Banking,NBFC,Real Estate', 'HDFCBANK,BAJFINANCE,KOTAKBANK,DLF', 'POSITIVE', 8.4],
    ['2025-02-01', 'BUDGET', 'Budget', 'Union Budget FY26 — PLI Expansion', 'PLI scheme expanded to electronics and specialty chemicals', 'Auto,Electronics,Chemicals', 'TATAMOTORS,MARUTI,DIXON', 'POSITIVE', 7.8],
    ['2024-11-15', 'RBI', 'Action', 'RBI Bans Paytm Payments Bank from Onboarding New Customers', 'Compliance failures at Paytm Payments Bank — business impact severe', 'Fintech', 'PAYTM', 'NEGATIVE', 9.8],
    ['2025-03-10', 'SEBI', 'Circular', 'SEBI Tokenized Securities Pilot Program', 'SEBI launches regulatory sandbox for tokenized government securities', 'Banking,Fintech', 'HDFCBANK,ICICIBANK', 'POSITIVE', 6.8],
    ['2025-03-15', 'RBI', 'Data', 'RBI MPC — Rate cut to 6.0%', 'RBI cuts another 25bps, signals accommodative stance', 'Banking,NBFC,Real Estate', 'HDFCBANK,BAJFINANCE,DLF,LODHA', 'POSITIVE', 8.2],
    ['2025-04-01', 'MoD', 'Policy', 'Defence Procurement 75% Indigenization Target', 'Ministry of Defence mandates 75% local sourcing for new procurement', 'Defence', 'HAL,BEL,BDL,MAZAGON', 'POSITIVE', 8.8],
    ['2025-03-20', 'SEBI', 'Circular', 'SEBI Tightens Rules on SME IPOs', 'Minimum application size raised, promoter lock-in extended', 'Financial Services', 'BSE,ANGELONE', 'NEUTRAL', 5.4],
  ];
  regEvents.forEach(r => insertReg.run(...r));

  // ── Fiscal Events, Decision Notes, Diary, Tokenized, Scenarios ──
  const insertFiscal = db.prepare('INSERT INTO fiscal_events (event_type, description, amount, due_date, is_recurring, recurrence_months, impact_level) VALUES (?, ?, ?, ?, ?, ?, ?)');
  [
    ['EMI', 'Home Loan EMI — HDFC Bank', 45000, '2025-04-05', 1, 1, 'HIGH'],
    ['TAX', 'Advance Tax Q1 FY26 Payment', 85000, '2025-06-15', 1, 3, 'HIGH'],
    ['EDUCATION', 'Child College Fee — Second Year', 120000, '2025-07-01', 0, null, 'HIGH'],
    ['INSURANCE', 'Life Insurance Annual Premium', 28000, '2025-08-20', 1, 12, 'MEDIUM'],
    ['EMI', 'Car Loan EMI — SBI', 18000, '2025-04-10', 1, 1, 'MEDIUM'],
    ['TAX', 'Advance Tax Q2 FY26 Payment', 85000, '2025-09-15', 1, 3, 'HIGH']
  ].forEach(f => insertFiscal.run(...f));

  const insertNote = db.prepare(`INSERT INTO decision_notes 
    (date, ticker, action, business_score, valuation_score, market_score, sentiment_score, composite_score, entry_thesis, risk_1, risk_2, risk_3, time_horizon, expected_scenario, what_proves_wrong, stop_loss, position_size_pct, entry_price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  insertNote.run('2024-08-15', 'TCS', 'BUY', 8.2, 3.8, 7.4, 3.2, 7.1, 
    'TCS is at a cyclical low in revenue growth. Deal wins improving — Generative AI service revenues starting to show.',
    'US tech spending cuts delay deal closures', 'GenAI disrupts traditional outsourcing', 'INR appreciation reduces translation',
    'MEDIUM', 'Revenue growth re-accelerates to 9%+ by Q3 FY26.', 'Two consecutive quarters of deal pipeline decline', '₹3,280', 8.0, 3850);
  insertNote.run('2024-09-20', 'HDFCBANK', 'BUY', 7.8, 4.2, 6.8, 4.8, 6.9,
    'Post-merger integration complete. Rate cut cycle beginning — HDFC biggest beneficiary.',
    'Legacy book NPAs', 'Credit growth slows', 'SBI/ICICI competition',
    'LONG', 'NIM expands to 4.1%+ by FY27.', 'NIM below 3.4% for 2+ quarters', '₹1,428', 7.5, 1680);

  const insertDiary = db.prepare(`INSERT INTO diary_entries 
    (date, macro_obs, sector_thesis, signal_flag, new_rule_idea, lesson, mood, key_insight, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  insertDiary.run('2025-03-10', 
    'RBI held rates at 6.25% — signals June cut likely if CPI holds below 4.5%.',
    'Banking sector unlocking — HDFC, ICICI, Kotak all outperforming.',
    'FII bought ₹3,840 Cr — first significant buying in 6 weeks.',
    'When FII buying returns after 6+ week absence AND RBI is dovish, increase banking weight by 5%.',
    'Almost panic sold HDFCBANK at ₹1,580 due to noise. The conviction sheet stopped me.',
    'CALM', 'Rate cut cycles always benefit Quality NBFCs + Private Banks more than PSU banks.',
    '[MACRO][SECTOR][SIGNAL][FRAMEWORK][MISTAKE][MOOD][INSIGHT]');
  insertDiary.run('2025-02-15',
    'US CPI came in at 3.1% — higher than expected. FII sold ₹2,840 Cr.',
    'IT sector short-term pressure. But deal wins improving fundamentally.',
    'India VIX rose to 16.8 from 12.4 in a week.',
    null, 'Made mistake of looking at short-term FII data and feeling anxious.',
    'CAUTIOUS', 'US macro creates temporary noise in Indian markets.',
    '[MACRO][SECTOR][SIGNAL][MISTAKE][MOOD][INSIGHT]');

  const insertToken = db.prepare(`INSERT OR IGNORE INTO tokenized_assets 
    (name, asset_type, platform, current_nav, min_investment, liquidity_risk, lock_in_months, yield_or_return, sebi_regulated, quality_score, valuation_score, liquidity_score, composite_score, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  [
    ['Mindspace REIT Units', 'Commercial REIT', 'BSE/NSE', 382, 50000, 'LOW', 0, 8.4, 1, 7.8, 6.2, 8.4, 7.4, 'Listed REIT — Grade A office spaces'],
    ['Strata Whitefield Industrial', 'Industrial Real Estate', 'Strata', 1000, 25000, 'HIGH', 36, 12.8, 0, 6.4, 5.8, 3.2, 5.3, 'Tokenized industrial warehouse'],
    ['Grip Invest Bonds', 'Corporate Bond', 'Grip Invest', 1000, 10000, 'MEDIUM', 18, 11.4, 0, 7.2, 7.4, 5.8, 6.8, 'Asset-backed bond'],
    ['Jiraaf Infrastructure NCD', 'Infrastructure Bond', 'Jiraaf', 1000, 100000, 'MEDIUM', 24, 10.8, 1, 6.8, 6.4, 5.4, 6.2, 'Infrastructure NCD'],
    ['Sequoia Pre-IPO Fund', 'Pre-IPO Equity', 'Tyke Invest', 100, 500000, 'VERY HIGH', 36, 28.0, 0, 8.4, 7.2, 2.2, 6.1, 'Basket of 8 pre-IPO companies']
  ].forEach(t => insertToken.run(...t));

  const note1 = db.prepare('SELECT id FROM decision_notes WHERE ticker = ? LIMIT 1').get('TCS');
  if (note1) {
    db.prepare(`INSERT INTO outcome_scenarios 
      (note_id, ticker, date, bull_prob, bull_target, bull_return, base_prob, base_target, base_return, bear_prob, bear_target, bear_return, expected_value, timeframe_months)
      VALUES (?, ?, date('now'), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      note1.id, 'TCS', 0.30, 4800, 24.7, 0.50, 4200, 9.1, 0.20, 3200, -16.9, 0.30*24.7 + 0.50*9.1 + 0.20*(-16.9), 12
    );
  }

  const insertAlert = db.prepare('INSERT INTO alerts (rule_name, ticker, condition, threshold, current_value, triggered, severity) VALUES (?, ?, ?, ?, ?, ?, ?)');
  [
    ['Promoter Pledge Warning', 'BAJFINANCE', 'promoter_pledge > 10', 10, 12.3, 1, 'HIGH'],
    ['Narrative Crack — Asian Paints', 'ASIANPAINT', 'narrative_risk_score > 8', 8, 8.8, 1, 'HIGH'],
    ['Narrative Crack — Trent', 'TRENT', 'consensus > 8 + rapid growth', 8, 9, 1, 'HIGH'],
    ['VIX Spike Alert', null, 'india_vix > 22', 22, 11.4, 0, 'MEDIUM'],
    ['FII Outflow Alert', null, 'fii_flow < -5000', -5000, 4820, 0, 'MEDIUM'],
    ['TCS Valuation Stop', 'TCS', 'valuation_score > 8.0', 8, 5.2, 0, 'MEDIUM']
  ].forEach(a => insertAlert.run(...a));

  console.log(`✅ Database seeded: ${unique.length} stocks, fundamentals, macro, watchlist, portfolio, alt data, narratives, and all extension data`);
}

module.exports = { db, initializeDatabase };
