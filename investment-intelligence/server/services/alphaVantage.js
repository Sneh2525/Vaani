const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
require('dotenv').config();

const AV_KEY = process.env.ALPHA_VANTAGE_KEY || 'demo';
const BASE = 'https://www.alphavantage.co/query';

async function getIntraday(symbol) {
  const url = `${BASE}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${AV_KEY}`;
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    const series = data['Time Series (5min)'];
    if (!series) return null;
    const [ts, values] = Object.entries(series)[0];
    return {
      price: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume'], 10),
      timestamp: ts,
    };
  } catch (e) {
    console.error('Alpha Vantage intraday error:', e.message);
    return null;
  }
}

async function getFxRate() {
  const url = `${BASE}?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=INR&apikey=${AV_KEY}`;
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    const rate = data['Realtime Currency Exchange Rate'];
    if (!rate) return null;
    return {
      rate: parseFloat(rate['5. Exchange Rate']),
      timestamp: rate['6. Last Refreshed'],
    };
  } catch (e) {
    console.error('Alpha Vantage FX error:', e.message);
    return null;
  }
}

module.exports = { getIntraday, getFxRate };
