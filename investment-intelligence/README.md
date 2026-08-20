# 📈 Investment Intelligence Engine & Institutional Analytics Platform

An institutional-grade **Investment Intelligence & Decision Support System** designed for quantitative fundamental research, multi-factor stock scoring, macroeconomic risk modeling, alternative data signal tracking, narrative breakdown detection, and agentic AI monitoring.

![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2-000000?logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Better--SQLite3-003B57?logo=sqlite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0-339933?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## 🌟 Executive Summary

The **Investment Intelligence Platform** bridges the gap between basic retail stock screeners and quantitative institutional analytical engines. Built around five core analytical frameworks, it systematically evaluates equities, detects macro regime changes 2–3 months before reported fundamentals, flags narrative breakdown risks, stress-tests portfolios against macroeconomic shocks, and automates continuous monitoring through autonomous agent workflows.

---

## 🚀 Key Modules & Capabilities

### 📊 1. Executive Dashboard (`/`)
* **Market Snapshot & Indices**: Real-time tracking of broad market indices, sentiment gauges, and market breath.
* **Top Scoring Equities**: Leaderboard of equities ranked by composite 5-Framework scores.
* **System Signal Ticker**: Real-time streaming ticker of alternative data alerts, macro shifts, and narrative warnings.
* **Sector Breakdown**: Interactive distribution charts of equity factor health across sectors.

### 🔬 2. Stock Deep Dive Analytics (`/stock/:symbol`)
* **Multi-Factor Scorecard**: Breakdown across Moat Quality, Insolvency Risk, Growth Momentum, Margin of Safety, and Alt Data.
* **Narrative Break Detector**: Quantitative monitoring of consensus thesis stability versus actual underlying performance metrics.
* **Altman Z-Score & Insolvency Radar**: Real-time solvency safety scoring preventing capital destruction in high-leverage traps.
* **Intrinsic DCF Calculator**: Dynamic Discounted Cash Flow valuation with configurable growth rates and terminal values.

### 🎯 3. Watchlist & Alert Center (`/watchlist`)
* **Smart Watchlist Tracking**: Custom asset tracking categorized by conviction levels and target buy/sell prices.
* **Dynamic Alert Triggers**: Automated notifications for price targets, framework score downgrades, or narrative breakdown warnings.
* **Factor Distribution**: Sector and factor weight visualization for watching potential additions.

### 🛰️ 4. Alternative Data Intelligence (`/alt-data`)
* **2–3 Month Leading Signals**: Web traffic trends, supply chain lead time shifts, job posting velocity, and satellite logistics metrics.
* **Credit & Sentiment Tracking**: Corporate credit spreads, promotional intensity scoring, and regulatory sentiment indicators.
* **Leading Signal Scoring**: Quantified alt-data score feeding directly into Framework 5 of the overall scoring engine.

### 🌐 5. Macroeconomic Risk Engine (`/macro`)
* **Monetary Policy & Yields**: Real-time tracking of RBI repo rates, US Fed policy, 10-year G-Sec yields, and yield curve slope.
* **Liquidity & Money Supply**: M2 money supply growth rates, banking system liquidity, FII/DII net flows.
* **Inflation & Growth**: CPI/WPI inflation metrics, GST collection trends, and GDP growth momentum.

### 🧪 6. Macro Scenario Stress Testing (`/scenarios`)
* **Shock Simulation Engine**: Stress test equity portfolios against historical and hypothetical macro shocks (e.g., Crude Oil Spike to $120/bbl, Aggressive Rate Hikes, Stagflation, Geopolitical Crises).
* **Drawdown Projection**: Estimated portfolio drawdown, sector sensitivity heatmaps, and tail-risk exposure.

### 🤖 7. Agentic AI Monitor (`/agentic`)
* **Autonomous Task Workflows**: Background AI agents performing continuous data scraping, rule checking, and score re-calibrations.
* **Agent Health & Execution Logs**: Real-time telemetry, execution frequencies, status badges, and automated log parsing.
* **Anomaly Detection**: Automated flagging of unexpected divergence between stock price action and fundamental signals.

### ⚡ 8. Quantitative Rules Engine (`/rules`)
* **Custom Rule Builder**: Create multi-variable quantitative screening rules (e.g., `ROIC > 18% AND Altman Z-Score > 2.99 AND PE < 25`).
* **Rule Backtesting Parameters**: Test screening strategies against historical market data.
* **Trigger Actions**: Automated dispatch of webhook notifications, watchlist additions, or email/SMS alerts.

### 💼 9. Portfolio & Personal Fiscal Overlay (`/portfolio`)
* **Asset Allocation Tracking**: Real-time portfolio performance, sector exposure, and multi-asset breakdown.
* **Personal Fiscal Liquidity Overlay**: Connects portfolio holdings with personal emergency cash reserves to prevent selling quality equities during cash emergencies.
* **Risk-Adjusted Metrics**: Sharpe Ratio, Sortino Ratio, Maximum Drawdown, and Beta metrics.

### 📓 10. Strategy Diary & Retrospectives (`/diary`)
* **Thesis Journaling**: Document buy/sell rationales, entry dates, target horizons, and key catalysts.
* **Post-Trade Retrospectives**: Systematically review closed trades to refine analytical discipline and prevent emotional decision-making.
* **Cognitive Bias Audit**: Categorize past mistakes (e.g., confirmation bias, loss aversion, FOMO) to improve decision hygiene.

### 📜 11. Decision Notes & Audit Trail (`/notes`)
* **Historical Audit Log**: Complete timestamped ledger of all score revisions, rule triggers, and analytical notes.
* **Filterable Archive**: Search decision history by stock ticker, framework score, or date range.

---

## 📐 Quantitative Framework Architecture

The core evaluation engine computes a 0–100 composite score for every equity based on five weighted analytical frameworks:

$$\text{Composite Score} = w_1 F_1 + w_2 F_2 + w_3 F_3 + w_4 F_4 + w_5 F_5$$

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      5-FRAMEWORK SCORING ENGINE                         │
├─────────────┬─────────────┬─────────────┬───────────────┬───────────────┤
│ Framework 1 │ Framework 2 │ Framework 3 │  Framework 4  │  Framework 5  │
│  (Moat &    │ (Solvency & │  (Growth &  │ (Valuation &  │  (Alt Data &  │
│  Quality)   │ Resilience) │ Momentum)   │ Safety Margin)│  Narrative)   │
│   [w1=25%]  │   [w2=20%]  │   [w3=20%]  │    [w4=20%]   │    [w5=15%]   │
└──────┬──────┴──────┬──────┴──────┬──────┴───────┬───────┴───────┬───────┘
       │             │             │              │               │
       ▼             ▼             ▼              ▼               ▼
 ┌──────────┐  ┌──────────┐  ┌──────────┐   ┌───────────┐   ┌───────────┐
 │ ROIC     │  │ Altman Z │  │ Reinvest │   │ DCF Value │   │ Web Traf  │
 │ Op Margin│  │ Int Cover│  │ EPS Grth │   │ EV/EBITDA │   │ Credit Spd│
 │ Moat Rating │ FreeCash │  │ ROE Stab │   │ PE Ratio  │   │ Narrative │
 └──────────┘  └──────────┘  └──────────┘   └───────────┘   └───────────┘
```

1. **Framework 1: Quality & Business Moat (25%)**: Evaluates Return on Invested Capital ($\text{ROIC}$), pricing power, gross margin stability, and competitive moat strength.
2. **Framework 2: Insolvency Risk & Financial Resilience (20%)**: Computes Altman Z-Score ($Z = 1.2X_1 + 1.4X_2 + 3.3X_3 + 0.6X_4 + 0.999X_5$), Interest Coverage, and Free Cash Flow conversion.
3. **Framework 3: Growth Momentum & Capital Allocation (20%)**: Measures reinvestment rate, historical EPS compound growth, capital efficiency, and ROE consistency.
4. **Framework 4: Valuation & Margin of Safety (20%)**: Calculates intrinsic value via Discounted Cash Flow ($\text{DCF}$), historical EV/EBITDA percentile, and P/E relative to growth ($\text{PEG}$).
5. **Framework 5: Alternative Data & Narrative Stability (15%)**: Incorporates 2–3 month leading alternative data signals, web traffic velocity, credit sentiment, and consensus thesis stability.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + Vite 8 | Ultra-fast client interface with HMR |
| **Routing** | React Router v7 | Client-side page navigation & layout routing |
| **Data Visualization** | Recharts | Responsive quantitative financial charts |
| **Icons & UI System** | Lucide React + Vanilla CSS | Modern dark-mode aesthetic with glassmorphism |
| **Backend Runtime** | Node.js (ES Modules) | High-performance asynchronous API server |
| **Server Framework** | Express 5 | RESTful API endpoint routing |
| **Database** | SQLite via `better-sqlite3` | High-speed embedded SQL database with WAL mode |
| **Real-time Engine** | WebSockets (`ws`) | Live data streaming & signal pushes |
| **Cron Scheduler** | `node-cron` | Background job execution & market data sync |

---

## 📂 Directory Structure

```
investment-intelligence/
├── server/                        # Node.js Express Backend
│   ├── data/                      # Initial seed datasets & benchmark data
│   ├── engine/                    # Core Quantitative Engines
│   │   ├── altDataEngine.js       # Alternative data processing
│   │   ├── macroEngine.js         # Macro economic risk modeling
│   │   ├── rulesEngine.js         # Quantitative screening engine
│   │   └── scenarioEngine.js      # Stress-test simulation logic
│   ├── jobs/                      # Background Scheduled Jobs
│   │   ├── agenticMonitorJob.js   # Autonomous agent monitoring task
│   │   ├── altDataSync.js         # Scraping & alt-data sync
│   │   └── priceUpdater.js        # Daily market price updater
│   ├── routes/                    # Express REST API Routes
│   │   ├── agentic.js             # Autonomous agent routes
│   │   ├── alerts.js              # System alert routes
│   │   ├── altData.js             # Alternative data routes
│   │   ├── diary.js               # Strategy diary routes
│   │   ├── macro.js               # Macroeconomic indicator routes
│   │   ├── notes.js               # Decision audit log routes
│   │   ├── portfolio.js           # Portfolio & fiscal overlay routes
│   │   ├── scenarios.js           # Scenario stress testing routes
│   │   ├── scores.js              # 5-Framework scoring routes
│   │   └── stocks.js              # Equity data routes
│   ├── scoring/                   # Quantitative Scoring Modules
│   │   ├── framework1Moat.js      # Quality & Moat calculator
│   │   ├── framework2Solvency.js  # Solvency & Altman Z calculator
│   │   ├── framework3Growth.js    # Growth & reinvestment calculator
│   │   ├── framework4Valuation.js # Intrinsic value & DCF calculator
│   │   └── framework5AltData.js   # Alt data & narrative calculator
│   ├── services/                  # External Data Connectors
│   │   ├── brokerWebsocket.js     # Broker live pricefeed connector
│   │   └── screenerScraper.js     # Open-source scraper utilities
│   ├── db.js                      # Database schema & WAL mode initialization
│   ├── index.js                   # Express server & WebSocket entrypoint
│   └── investment.db              # SQLite embedded database file
│
├── src/                           # React 19 Frontend App
│   ├── pages/                     # Application Page Components
│   │   ├── AgenticMonitor.jsx     # Autonomous AI Agent Dashboard
│   │   ├── AlternativeData.jsx    # Leading Alt Data Analytics
│   │   ├── Dashboard.jsx          # Main Executive Overview
│   │   ├── DecisionNotes.jsx      # Audit Trail & Decision Notes
│   │   ├── MacroDashboard.jsx     # Macroeconomic Tracker
│   │   ├── Portfolio.jsx          # Portfolio & Fiscal Overlay
│   │   ├── RulesEngine.jsx        # Screening & Rule Builder
│   │   ├── Scenarios.jsx          # Stress Test Simulation UI
│   │   ├── StockDetail.jsx        # Stock Deep-Dive Page
│   │   ├── StrategyDiary.jsx      # Investment Thesis Journal
│   │   └── Watchlist.jsx          # Smart Watchlist Tracking
│   ├── App.jsx                    # Navigation Shell & Routing
│   ├── index.css                  # Core CSS Tokens & Glassmorphism Design
│   └── main.jsx                   # React Entrypoint
│
├── .env                           # Environment configuration
├── index.html                     # HTML Template Shell
├── package.json                   # Dependencies & Run Scripts
└── vite.config.js                 # Vite Compiler Configuration
```

---

## 🗄️ Database Schema & Storage

The backend utilizes `better-sqlite3` configured with **Write-Ahead Logging (WAL)** (`PRAGMA journal_mode = WAL`) to ensure high-concurrency read throughput during multi-stock scoring queries.

### Key Database Tables:
* **`stocks`**: Ticker, company name, sector, market cap, exchange, industry, live price, volume.
* **`price_daily`**: Historical daily OHLCV prices and adjusted closes.
* **`fundamentals`**: Key metrics ($\text{P/E}$, $\text{P/B}$, $\text{ROE}$, $\text{ROCE}$, Debt/Equity, Revenue Growth, Operating Margin, Interest Coverage, $\text{FCF}$, Promoter Stake, PEG, EV/EBITDA).
* **`macro_data`**: RBI Repo Rate, FII/DII net flows, India VIX, USD/INR rate, Nifty P/E, CPI inflation, US Fed Rate.
* **`alt_data_signals`**: Signal source, leading indicator values, sentiment scores, lead-time shift estimates.
* **`portfolio_holdings`**: User portfolio holdings, buy price, quantity, asset class, target allocation.
* **`strategy_diary`**: Entry date, stock ticker, thesis, expected catalyst timeline, post-trade outcome review.
* **`decision_notes`**: Timestamped record of quantitative score changes and audit notes.

---

## ⚡ Quick Start & Setup

### 1. Prerequisites
Ensure you have installed:
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

### 2. Installation

Navigate to the project directory and install dependencies:
```bash
cd investment-intelligence
npm install
```

### 3. Environment Configuration

Create or verify `.env` in `investment-intelligence/`:
```env
# Server Port Configuration
PORT=3001

# API Keys
FYERS_APP_ID=your_fyers_app_id
FYERS_ACCESS_TOKEN=your_fyers_access_token
# Alpha Vantage is used for USD/INR FX only.
ALPHA_VANTAGE_KEY=demo
NEWSAPI_KEY=demo
```

### Fyers market-data setup

1. Create or sign in to a Fyers account and enable API access at [myapi.fyers.in](https://myapi.fyers.in/).
2. Copy the app **App ID** and **Secret ID** into `.env` as `FYERS_APP_ID` and `FYERS_SECRET_ID`. Keep both private.
3. Generate the FYERS login URL:
      ```powershell
      python fyers_auth.py
      ```
4. Open the printed URL, complete login, and copy only the `auth_code` value from the redirect URL.
5. Exchange it for an access token. Do not paste the code or secret into chat:
      ```powershell
      python fyers_auth.py --auth-code YOUR_AUTH_CODE
      ```
6. Restart the backend after changing `.env`:
      `npm run server`

The backend requests NSE equity symbols as `NSE:<TICKER>-EQ` and refreshes the `stocks` table every minute during NSE market hours.

### Groq AI setup

1. Create or sign in to a Groq account at [console.groq.com](https://console.groq.com/keys).
2. Create an API key and put it in `.env`:
      ```env
      GROQ_API_KEY=your_groq_key
      GROQ_MODEL=openai/gpt-oss-20b
      ```
3. Restart the backend so it loads the new environment variables:
      ```powershell
      npm run server
      ```

The backend uses Groq for the investment thesis, weekly briefing, chat assistant, and research-agent analysis. Never commit or share the API key.

### 4. Running the Platform

Run both the API server and React frontend concurrently using single command:
```bash
npm run dev
```

* **Frontend UI**: [`http://localhost:5173`](http://localhost:5173)
* **Backend API**: [`http://localhost:3001`](http://localhost:3001)

### 5. Individual Execution Scripts

* **Frontend Only**: `npm run client`
* **Backend Only**: `npm run server`
* **Production Build**: `npm run build`
* **Preview Build**: `npm run preview`
* **Linting**: `npm run lint`

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/stocks` | List all tracked stocks with current prices & fundamentals |
| `GET` | `/api/stocks/:symbol` | Detailed stock metrics & historical price series |
| `GET` | `/api/scores/:symbol` | Full 5-Framework breakdown score for a stock |
| `GET` | `/api/macro` | Latest macroeconomic metrics (RBI rates, VIX, yields) |
| `GET` | `/api/alt-data` | Alternative data signals & lead-time indicators |
| `GET` | `/api/portfolio` | User portfolio holdings & fiscal liquidity metrics |
| `POST` | `/api/scenarios/run` | Execute macro stress scenario simulations |
| `GET` | `/api/agentic/status` | Active autonomous agent statuses & execution logs |
| `GET` | `/api/rules` | Configured quantitative screening rules |
| `POST` | `/api/diary` | Add a new investment thesis or trade retrospective |
| `GET` | `/api/notes` | Fetch decision audit logs |

---

## 📜 License

This project is open-source software licensed under the **MIT License**.
