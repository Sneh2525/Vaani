require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize database
initializeDatabase();

// Import routes
const stocksRouter = require('./routes/stocks');
const scoresRouter = require('./routes/scores');
const macroRouter = require('./routes/macro');
const notesRouter = require('./routes/notes');
const diaryRouter = require('./routes/diary');
const portfolioRouter = require('./routes/portfolio');
const altDataRouter = require('./routes/altData');
const regulatoryRouter = require('./routes/regulatory');
const narrativeRouter = require('./routes/narrative');
const scenariosRouter = require('./routes/scenarios');
const agenticRouter = require('./routes/agentic');
const alertsRouter = require('./routes/alerts');
const newsRouter = require('./routes/news');

app.use('/api/stocks', stocksRouter);
app.use('/api/scores', scoresRouter);
app.use('/api/macro', macroRouter);
app.use('/api/notes', notesRouter);
app.use('/api/diary', diaryRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/alt-data', altDataRouter);
app.use('/api/regulatory', regulatoryRouter);
app.use('/api/narrative', narrativeRouter);
app.use('/api/scenarios', scenariosRouter);
app.use('/api/agentic', agenticRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/news', newsRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Serve the production React build from the same origin as the API.
const clientDist = path.join(__dirname, '../dist');
app.use(express.static(clientDist));
app.get(/^(?!\/api).*/, (req, res) => res.sendFile(path.join(clientDist, 'index.html')));

// Start price updater cron job
const { startPriceUpdater } = require('./jobs/priceUpdater');
startPriceUpdater();

// Start Alt Data Sync job
const { startAltDataSync } = require('./jobs/altDataSync');
startAltDataSync();

// Start Agentic Monitor Job
const { startAgenticMonitorJob } = require('./jobs/agenticMonitorJob');
startAgenticMonitorJob();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Investment Intelligence API running on port ${PORT}`));

module.exports = app;
