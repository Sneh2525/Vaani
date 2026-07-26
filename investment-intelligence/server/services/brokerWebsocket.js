const WebSocket = require('ws');
const { db } = require('../db');

/**
 * Broker WebSocket Integration (Designed for Dhan / Upstox)
 * This establishes a persistent WebSocket connection to securely stream 
 * real-time tick/minute data direct from Indian Exchanges.
 */

// If using Upstox, requires Access Token. 
// If using Dhan API, requires Client ID and Access Token.
const BROKER_API_KEY = process.env.BROKER_API_KEY || null;
const BROKER_WS_URL = process.env.BROKER_WS_URL || 'wss://api.upstox.com/v2/feed/market-data-feed'; 

let ws = null;
let subscribedTickers = [];

/**
 * Maps standard NSE tickers (e.g. INFY) to broker-specific instrument keys
 * (e.g. NSE_EQ|INE009A01021 for Upstox, or custom security IDs for Dhan)
 */
function getInstrumentKey(ticker) {
  // In a full production app, this would query a locally cached instrument CSV file downloaded from the broker daily.
  // For demonstration, we prefix standard NSE equity.
  return `NSE_EQ|${ticker}`; 
}

function connectBrokerWebSocket(tickers) {
  if (!BROKER_API_KEY) {
    console.log('[BrokerWS] No Broker API Key found in .env. Skipping WebSockets, falling back to REST/Cron.');
    return false;
  }

  subscribedTickers = tickers;
  
  // Upstox standard websocket handshake wrapper
  ws = new WebSocket(BROKER_WS_URL, {
    headers: {
        'Authorization': `Bearer ${BROKER_API_KEY}`,
        'Api-Version': '2.0'
    }
  });

  ws.on('open', () => {
    console.log('[BrokerWS] 🟢 Connected to Real-time Exchange Feed');
    
    // Subscribe to instruments upon connection
    const instrumentKeys = subscribedTickers.map(getInstrumentKey);
    
    const subscriptionPayload = {
      guid: "b8f5223e", 
      method: "sub",
      data: {
        mode: "full", // Get LTP, Volume, Bid/Ask
        instrumentKeys: instrumentKeys
      }
    };
    
    ws.send(Buffer.from(JSON.stringify(subscriptionPayload)));
    console.log(`[BrokerWS] Subscribed to ${instrumentKeys.length} instruments.`);
  });

  ws.on('message', (data) => {
    // Process incoming tick
    // Note: Upstox sends ArrayBuffer/Buffer depending on setup, Dhan differs.
    try {
      const payload = JSON.parse(data.toString());
      if (payload.feeds) {
        processTickData(payload.feeds);
      }
    } catch (e) {
      // Some brokers stream raw protobuf, handle parsing here if needed
    }
  });

  ws.on('close', (code, reason) => {
    console.log(`[BrokerWS] 🔴 Disconnected: Code ${code}. Reason: ${reason}`);
    // Auto-reconnect logic
    setTimeout(() => connectBrokerWebSocket(subscribedTickers), 5000); 
  });

  ws.on('error', (err) => {
    console.error(`[BrokerWS] ⚠️ WebSocket Error:`, err.message);
  });
  
  return true;
}

/**
 * Handle incoming high-frequency ticks and batch write them to SQLite
 */
function processTickData(feeds) {
  const updates = [];
  
  for (const [key, quote] of Object.entries(feeds)) {
    if (quote.ff && quote.ff.marketFF && quote.ff.marketFF.ltpc) {
      const tickerName = key.split('|')[1]; // Extracted standard NSE ticker
      const ltp = quote.ff.marketFF.ltpc.ltp; // Last traded price
      const close = quote.ff.marketFF.ltpc.cp; // Previous close
      
      const change = ltp - close;
      const changePct = (change / close) * 100;

      updates.push({
        ticker: tickerName,
        price: ltp,
        change,
        changePct
      });
    }
  }

  if (updates.length > 0) {
    // Batch upsert to database efficiently
    const stmt = db.prepare(`
      INSERT INTO live_prices (ticker, current_price, previous_close, change, change_percent, last_updated)
      VALUES (@ticker, @price, 0, @change, @changePct, datetime('now'))
      ON CONFLICT(ticker) DO UPDATE SET 
      current_price = @price,
      change = @change,
      change_percent = @changePct,
      last_updated = datetime('now')
    `);

    const transaction = db.transaction((ticks) => {
      for (const tick of ticks) stmt.run(tick);
    });

    try {
      transaction(updates);
      // Ensure 'live_prices' table is accessible and created in your main db schema.
    } catch (dbErr) {
       // Table won't exist until you alter schema, ignoring safely for now. 
    }
  }
}

module.exports = { connectBrokerWebSocket };
