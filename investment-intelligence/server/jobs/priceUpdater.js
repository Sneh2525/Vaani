const cron = require('node-cron');
const { db } = require('../db');
const { getFxRate } = require('../services/alphaVantage');
const { getQuotes: getFyersQuotes, isConfigured: isFyersConfigured } = require('../services/fyers');

function startPriceUpdater() {
  if (isFyersConfigured()) {
    console.log('📡 [priceUpdater] FYERS quote feed enabled for NSE equities.');
  } else {
    console.warn('⚠️ [priceUpdater] FYERS credentials missing. Equity prices will not be refreshed.');
  }

  cron.schedule('* 9-15 * * 1-5', async () => {
    // A. Update Macro (FX) — Always runs regardless of WebSocket 
    try {
      const fx = await getFxRate();
      if (fx) {
        db.prepare(`UPDATE macro_data SET usd_inr = ? WHERE date = (SELECT MAX(date) FROM macro_data)`).run(fx.rate);
      }
    } catch (e) {
      console.error('  ✗ FX Update Failed:', e.message);
    }

    // B. Refresh all NSE equities from FYERS in one quote request.
    if (!isFyersConfigured()) return;

    const tickers = db.prepare('SELECT ticker FROM stocks').all().map(stock => stock.ticker);
    const quotes = await getFyersQuotes(tickers);
    if (!quotes) return;

    const update = db.prepare('UPDATE stocks SET price = ?, volume = ? WHERE ticker = ?');
    const transaction = db.transaction(() => {
      for (const [ticker, quote] of Object.entries(quotes)) {
        update.run(quote.price, quote.volume, ticker);
      }
    });
    transaction();
  }, { timezone: 'Asia/Kolkata' });
}

module.exports = { startPriceUpdater };
