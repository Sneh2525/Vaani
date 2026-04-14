const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
require('dotenv').config();

const NEWS_KEY = process.env.NEWSAPI_KEY || 'demo';
const BASE = 'https://newsapi.org/v2/everything';

async function getNews(ticker, limit = 10) {
  // Convert ticker to company name search for better results
  const tickerMap = {
    'INFY': 'Infosys', 'TCS': 'TCS Tata Consultancy', 'HDFC': 'HDFC Bank',
    'RELIANCE': 'Reliance Industries', 'TATAMOTORS': 'Tata Motors',
    'BAJFINANCE': 'Bajaj Finance', 'ICICIBANK': 'ICICI Bank',
    'MARUTI': 'Maruti Suzuki', 'HCLTECH': 'HCL Tech',
    'ADANIPORTS': 'Adani Ports', 'ASIANPAINT': 'Asian Paints',
    'SUNPHARMA': 'Sun Pharma', 'WIPRO': 'Wipro',
    'KOTAKBANK': 'Kotak Mahindra Bank', 'PAYTM': 'Paytm One97',
    'ZOMATO': 'Zomato', 'POLICYBZR': 'PolicyBazaar PB Fintech',
    'NYKAA': 'Nykaa FSN', 'ITC': 'ITC Limited', 'SBIN': 'State Bank India',
  };
  const query = tickerMap[ticker] || ticker;
  const url = `${BASE}?q=${encodeURIComponent(query + ' India stock')}&language=en&sortBy=publishedAt&pageSize=${limit}&apiKey=${NEWS_KEY}`;
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    if (data.status !== 'ok') return [];
    return (data.articles || []).map(a => ({
      title: a.title,
      source: a.source?.name || 'Unknown',
      url: a.url,
      publishedAt: a.publishedAt,
      description: a.description,
      image: a.urlToImage,
    }));
  } catch (e) {
    console.error('NewsAPI error:', e.message);
    return [];
  }
}

// Fallback: Google News RSS (no API key needed)
async function getNewsRSS(ticker) {
  const query = encodeURIComponent(`${ticker} India stock market`);
  const url = `https://news.google.com/rss/search?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`;
  try {
    const resp = await fetch(url);
    const text = await resp.text();
    // Simple XML parse for RSS items
    const items = [];
    const matches = text.matchAll(/<item>([\s\S]*?)<\/item>/g);
    for (const match of matches) {
      const titleM = match[1].match(/<title>(.*?)<\/title>/);
      const linkM = match[1].match(/<link>(.*?)<\/link>/);
      const dateM = match[1].match(/<pubDate>(.*?)<\/pubDate>/);
      const sourceM = match[1].match(/<source.*?>(.*?)<\/source>/);
      if (titleM) {
        items.push({
          title: titleM[1].replace(/<!\[CDATA\[|\]\]>/g, ''),
          url: linkM?.[1] || '',
          publishedAt: dateM?.[1] || '',
          source: sourceM?.[1] || 'Google News',
          description: '',
        });
      }
      if (items.length >= 10) break;
    }
    return items;
  } catch (e) {
    console.error('Google News RSS error:', e.message);
    return [];
  }
}

module.exports = { getNews, getNewsRSS };
