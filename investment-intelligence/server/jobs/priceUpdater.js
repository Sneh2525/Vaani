const cron = require('node-cron');
const { db } = require('../db');
const { getIntraday, getFxRate } = require('../services/alphaVantage');
const { connectBrokerWebSocket } = require('../services/brokerWebsocket');

// Top 20 high-priority stocks to refresh in polling fallback mode
const TICKERS = [
  { av: 'INFY.BSE', local: 'INFY' },
  { av: 'TATAMOTORS.BSE', local: 'TATAMOTORS' },
  { av: 'HDFC.BSE', local: 'HDFCBANK' },
  { av: 'TCS.BSE', local: 'TCS' },
  { av: 'RELIANCE.BSE', local: 'RELIANCE' },
];

function startPriceUpdater() {
  // 1. Attempt to launch ultra-fast WebSocket if credentials exist
  // We grab the list of all 284 tickers from the database to stream
  const allStocks = db.prepare('SELECT ticker FROM stocks').all();
  const allTickers = allStocks.map(s => s.ticker);
  
  const isWebsocketActive = connectBrokerWebSocket(allTickers);

  if (isWebsocketActive) {
    console.log('📡 [priceUpdater] High-frequency broker WebSocket activated. Suppressing slow cron polling for prices.');
  } else {
    console.log('📡 [priceUpdater] No broker API key found. Defaulting to 5-min REST API cron polling.');
  }

  // 2. Fallback Cron Schedule for Macro (FX) and Polling (if no WS)
  cron.schedule('*/5 9-15 * * 1-5', async () => {
    // A. Update Macro (FX) — Always runs regardless of WebSocket 
    try {
      const fx = await getFxRate();
      if (fx) {
        db.prepare(`UPDATE macro_data SET usd_inr = ? WHERE date = (SELECT MAX(date) FROM macro_data)`).run(fx.rate);
      }
    } catch (e) {
      console.error('  ✗ FX Update Failed:', e.message);
    }

    // B. If WebSocket is running, skip this rate-limited polling
    if (isWebsocketActive) return; 

    console.log('🔄 [priceUpdater] Polling REST API for fallback price data…');

    // Update equities fallback (staggering to avoid free-tier bans)
    for (let i = 0; i < TICKERS.length; i++) {
      const t = TICKERS[i];
      if (i > 0) await new Promise(r => setTimeout(r, 15000)); // 15s delay between REST calls
      
      try {
        const priceInfo = await getIntraday(t.av);
        if (priceInfo) {
          db.prepare(`UPDATE stocks SET price = ?, volume = ? WHERE ticker = ?`).run(priceInfo.price, priceInfo.volume, t.local);
        }
      } catch (e) {
        console.error(`  ✗ Data fetch failed for ${t.local}:`, e.message);
      }
    }
  }, { timezone: 'Asia/Kolkata' });
}

module.exports = { startPriceUpdater };
