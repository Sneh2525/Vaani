const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes deep fundamental metrics directly from Screener.in
 * Screener is the gold standard for Indian fundamental data.
 */
async function getScreenerFundamentals(ticker) {
  try {
    // Try consolidated first, fallback to standalone if strictly needed
    // Screener automatically redirects if consolidated doesn't exist
    const url = `https://www.screener.in/company/${ticker}/consolidated/`;
    
    // Mimic a standard browser to avoid getting blocked
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      timeout: 10000 
    });

    const $ = cheerio.load(response.data);
    const fundamentals = {};

    // Helper to extract a number given the label name in Screener's ratios box
    const extractMetric = (labelName) => {
      let value = null;
      $('.company-ratios .name').each((i, el) => {
        if ($(el).text().trim().toLowerCase().includes(labelName.toLowerCase())) {
          const valText = $(el).next('.number').text().trim().replace(/,/g, '');
          value = parseFloat(valText);
        }
      });
      return isNaN(value) ? null : value;
    };

    // Scrape key Indian-specific metrics
    fundamentals.pe = extractMetric('Stock P/E') || extractMetric('P/E');
    fundamentals.roce = extractMetric('ROCE');
    fundamentals.roe = extractMetric('ROE');
    fundamentals.debt_equity = extractMetric('Debt to equity');
    fundamentals.promoter_holding = extractMetric('Promoter holding');
    fundamentals.promoter_pledge = extractMetric('Pledged percentage');
    fundamentals.market_cap = extractMetric('Market Cap');
    fundamentals.dividend_yield = extractMetric('Dividend Yield');
    
    // Safety check - if we couldn't even parse PE or Market Cap, something shifted in their DOM
    if (!fundamentals.pe && !fundamentals.market_cap) {
      console.warn(`[ScreenerScraper] Could not find ratios for ${ticker}. Possibly missing or standard DOM changed.`);
      return null;
    }

    return fundamentals;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn(`[ScreenerScraper] Ticker ${ticker} not found on Screener.in (Status code 404)`);
    } else {
      console.error(`[ScreenerScraper] Error fetching ${ticker}:`, error.message);
    }
    return null;
  }
}

module.exports = { getScreenerFundamentals };
