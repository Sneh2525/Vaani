const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
require('dotenv').config();

const FMP_KEY = process.env.FMP_KEY || 'demo';
const BASE = 'https://financialmodelingprep.com/api/v3';

async function getFundamentals(symbol) {
  const url = `${BASE}/profile/${symbol}?apikey=${FMP_KEY}`;
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    const profile = Array.isArray(data) ? data[0] : data;
    if (!profile) return null;
    return {
      pe: profile.peRatio || null,
      peg: profile.pegRatio || null,
      evEbitda: profile.evToEbitda || null,
      pb: profile.priceToBookRatio || null,
      roe: profile.roe || null,
      debtEquity: profile.debtToEquity || null,
      netMargin: profile.netProfitMargin || null,
      revenueGrowth: profile.revenueGrowth || null,
      price: profile.price || null,
      marketCap: profile.mktCap || null,
    };
  } catch (e) {
    console.error('FMP fundamentals error:', e.message);
    return null;
  }
}

module.exports = { getFundamentals };
