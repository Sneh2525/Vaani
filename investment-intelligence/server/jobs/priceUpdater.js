const cron = require('node-cron');
const { db } = require('../db');
const { getIntraday, getFxRate } = require('../services/alphaVantage');
const { getFundamentals } = require('../services/fmp');

// Tickers to auto-refresh (BSE suffix for Alpha Vantage)
const TICKERS = [
  { av: 'INFY.BSE', fmp: 'INFY', local: 'INFY' },
  { av: 'TATAMOTORS.BSE', fmp: 'TATAMOTORS', local: 'TATAMOTORS' },
  { av: 'HDFC.BSE', fmp: 'HDFCBANK', local: 'HDFC' },
  { av: 'TCS.BSE', fmp: 'TCS', local: 'TCS' },
  { av: 'RELIANCE.BSE', fmp: 'RELIANCE', local: 'RELIANCE' },
];

function startPriceUpdater() {
  console.log('📡 Price updater scheduled (every 5 min during market hours)');

  // Run every 5 min, Mon–Fri, 9:15–15:35 IST
  cron.schedule('*/5 9-15 * * 1-5', async () => {
    console.log('🔄 Refreshing live market data…');

    // Update FX
    try {
      const fx = await getFxRate();
      if (fx) {
        db.prepare(`UPDATE macro_data SET usd_inr = ? WHERE date = (SELECT MAX(date) FROM macro_data)`).run(fx.rate);
        console.log(`  ✓ USD/INR → ${fx.rate}`);
      }
    } catch (e) {
      console.error('  ✗ FX:', e.message);
    }

    // Update equities (stagger to respect rate limits)
    for (let i = 0; i < TICKERS.length; i++) {
      const t = TICKERS[i];
      // Wait 15 seconds between calls to stay within 5 calls/min
      if (i > 0) await new Promise(r => setTimeout(r, 15000));
      try {
        const priceInfo = await getIntraday(t.av);
        if (priceInfo) {
          db.prepare(`UPDATE stocks SET price = ?, volume = ? WHERE ticker = ?`).run(priceInfo.price, priceInfo.volume, t.local);
          console.log(`  ✓ ${t.local} → ₹${priceInfo.price}`);
        }
      } catch (e) {
        console.error(`  ✗ ${t.local}:`, e.message);
      }
    }
  }, { timezone: 'Asia/Kolkata' });
}

module.exports = { startPriceUpdater };
