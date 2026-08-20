const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const APP_ID = process.env.FYERS_APP_ID || '';
const ACCESS_TOKEN = process.env.FYERS_ACCESS_TOKEN || '';
const BASE = 'https://api-t1.fyers.in/data/quotes';

function isConfigured() {
  return Boolean(APP_ID && ACCESS_TOKEN);
}

async function getQuote(ticker) {
  const quotes = await getQuotes([ticker]);
  return quotes?.[ticker] || null;
}

async function getQuotes(tickers) {
  if (!isConfigured() || !tickers.length) return null;

  const symbols = tickers.map(ticker => `NSE:${ticker}-EQ`).join(',');
  try {
    const response = await fetch(`${BASE}?symbols=${encodeURIComponent(symbols)}`, {
      headers: { Authorization: `${APP_ID}:${ACCESS_TOKEN}` }
    });
    if (!response.ok) throw new Error(`FYERS returned ${response.status}`);

    const data = await response.json();
    const results = {};
    for (const item of data?.d || []) {
      const quote = item?.v;
      const symbol = quote?.symbol || item?.symbol || item?.n;
      const ticker = symbol?.replace(/^NSE:/, '').replace(/-EQ$/, '');
      if (!ticker || quote?.lp == null) continue;

      results[ticker] = {
        price: Number(quote.lp),
        volume: Number(quote.volume || 0),
        previousClose: Number(quote.prev_close_price || 0),
        timestamp: quote.tt || new Date().toISOString()
      };
    }
    return results;
  } catch (error) {
    console.error('FYERS quote error:', error.message);
    return null;
  }
}

module.exports = { getQuote, getQuotes, isConfigured };