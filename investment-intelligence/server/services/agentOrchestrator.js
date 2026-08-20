const { db } = require('../db');
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Audit log helper
 */
function logAgentAction(agentName, action, ticker, details) {
  try {
    db.prepare(`
      INSERT INTO agent_audit_logs (agent_name, action, ticker, details)
      VALUES (?, ?, ?, ?)
    `).run(agentName, action, ticker, typeof details === 'string' ? details : JSON.stringify(details));
  } catch (err) {
    console.error('Failed to log agent action:', err);
  }
}

/**
 * Portfolio Monitor Agent
 * Scans active holdings against strict stop thresholds and rules, triggering automatic recommendations.
 */
async function runPortfolioMonitorAgent() {
  console.log('🤖 Portfolio Monitor Agent scanning portfolio...');
  
  const holdings = db.prepare("SELECT p.*, s.name FROM portfolio p JOIN stocks s ON p.ticker = s.ticker WHERE p.status = 'ACTIVE'").all();
  if (holdings.length === 0) {
    logAgentAction('PortfolioMonitor', 'SCAN_SKIPPED', null, 'No active holdings found in portfolio.');
    return;
  }

  for (const h of holdings) {
    const pnlPct = ((h.current_price - h.entry_price) / h.entry_price) * 100;
    
    // Evaluate if price is below critical stop loss threshold (-15%)
    if (pnlPct < -15) {
      const alertMsg = `Critical Stop Triggered for ${h.name} (${h.ticker}). Current Loss: ${pnlPct.toFixed(1)}%. Triggering risk evaluation.`;
      
      logAgentAction(
        'PortfolioMonitor',
        'TRIGGER_STOP_LOSS_ALERT',
        h.ticker,
        alertMsg
      );

      // Auto-trigger alerts table insertion
      db.prepare(`
        INSERT INTO alerts (rule_name, ticker, severity, condition, action_taken, triggered, trigger_date)
        VALUES (?, ?, 'CRITICAL', ?, ?, 1, date('now'))
      `).run(`Stop Loss Threshold Breached`, h.ticker, `PnL below -15%`, alertMsg);
    }
  }

  logAgentAction('PortfolioMonitor', 'SCAN_COMPLETE', null, `Scanned ${holdings.length} holdings successfully.`);
}

/**
 * Deep Research Agent
 * Aggregates core scores and triggers structured LangChain analysis summarizing thesis opportunities.
 */
async function runResearchAgent(ticker) {
  const stock = db.prepare('SELECT * FROM stocks WHERE ticker = ?').get(ticker);
  if (!stock) return { error: 'Stock not found' };

  const scores = db.prepare('SELECT * FROM scores WHERE ticker = ? ORDER BY date DESC LIMIT 1').get(ticker);
  if (!scores) return { error: 'Scores not compiled yet' };

  logAgentAction('ResearchAgent', 'INITIATE_RESEARCH', ticker, `Analyzing thesis profile for ${stock.name}`);

  try {
    if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY is missing from .env');

    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: 'You are an elite Buy-side Research Analyst specializing in Indian equity markets.' },
          { role: 'user', content: `Perform a short, professional SWOT analysis of ${stock.name} (${stock.ticker}) with an IOS Composite Score of ${scores.composite}/10. Keep the response clean and under 3 paragraphs.` }
        ]
      })
    });
    if (!response.ok) throw new Error(`Groq request failed: ${response.status} ${await response.text()}`);
    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content || 'Groq returned an empty response.';

    logAgentAction('ResearchAgent', 'ANALYSIS_COMPLETED', ticker, analysis);
    return { analysis };
  } catch (err) {
    console.error('Research Agent Error:', err);
    logAgentAction('ResearchAgent', 'ANALYSIS_FAILED', ticker, err.message);
    return { error: err.message };
  }
}

module.exports = {
  runPortfolioMonitorAgent,
  runResearchAgent
};
