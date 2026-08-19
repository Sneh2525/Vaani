const cron = require('node-cron');
const { runPortfolioMonitorAgent } = require('../services/agentOrchestrator');

/**
 * Starts the LangChain background monitoring agent.
 */
function startAgenticMonitorJob() {
  // Run once on startup, then every 15 minutes
  runPortfolioMonitorAgent();

  cron.schedule('*/15 * * * *', () => {
    runPortfolioMonitorAgent();
  });
}

module.exports = { startAgenticMonitorJob };
