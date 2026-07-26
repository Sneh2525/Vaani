# 📈 Investment Intelligence Platform

An institutional-grade **Investment Intelligence & Decision Support Platform** designed for quantitative equity research, fundamental multi-factor scoring, macro risk modeling, alternative data signal tracking, narrative breakdown detection, and agentic AI monitoring.

![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2-000000?logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Better--SQLite3-003B57?logo=sqlite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0-339933?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## 🌟 Overview

The **Investment Intelligence Platform** bridges the gap between retail tools and institutional analytical engines. Built around five core analytical frameworks, it systematically evaluates equities, detects macro shifts before reported fundamentals, flags narrative breaks, stress-tests portfolios, and automates monitoring through agentic workflows.

---

## 🚀 Key Features & Modules

### 📊 1. Core Analytics & Dashboards
* **Executive Dashboard (`/`)**: Real-time market overview, top-ranked equities across factors, system-wide alerts, and live signal tickers.
* **Stock Deep Dive (`/stock/:symbol`)**: Granular multi-factor analysis, historical metrics, narrative stability gauges, and financial health radar.
* **Watchlist Tracking (`/watchlist`)**: Customizable watchlist with dynamic scoring flags, real-time alert triggers, and sector distribution.

### 🧠 2. Quantitative & Alternative Intelligence
* **Alternative Data Engine (`/alt-data`)**: Captures 2-3 month leading indicators using supply chain web traffic, satellite imagery metrics, regulatory feeds, and credit sentiment data.
* **Macroeconomic Dashboard (`/macro`)**: Tracks policy rates, M2 money supply growth, RBI liquidity metrics, yield curve dynamics, and inflation trends.
* **Scenario & Stress Testing (`/scenarios`)**: Simulates portfolio resilience against custom macro shocks (e.g., Rate Hikes, Crude Oil Spikes, Stagflation, Geopolitical Crises).

### 🤖 3. Agentic AI & Automation
* **Agentic Monitor (`/agentic`)**: Autonomous agent execution dashboard overseeing continuous monitoring tasks, anomaly detection, rule compliance, and alert dispatches.
* **Rules & Screening Engine (`/rules`)**: Custom quantitative screening rules engine supporting backtesting parameters and automated alert execution.

### 📝 4. Portfolio & Behavioral Discipline
* **Portfolio & Fiscal Overlay (`/portfolio`)**: Multi-asset portfolio tracking integrated with personal liquidity needs to prevent panic selling during cash emergencies.
* **Strategy Diary (`/diary`)**: Journaling tool for investment theses, post-trade retrospectives, and cognitive bias auditing.
* **Decision Notes Archive (`/notes`)**: Comprehensive audit trail of analytical decisions, trade justifications, and framework scores over time.

---

## 📐 Analytical Framework Architecture

The engine operates on five integrated quantitative frameworks:

1. **Framework 1: Quality & Business Moat**: ROIC, Moat rating, pricing power, operating efficiency.
2. **Framework 2: Financial Strength & Insolvency Risk**: Altman Z-Score, debt coverage, free cash flow conversion.
3. **Framework 3: Growth Momentum & Capital Allocation**: Reinvestment rate, EPS growth consistency, ROE stability.
4. **Framework 4: Valuation & Margin of Safety**: DCF intrinsic value calculation, EV/EBITDA relative scoring, historical P/E bands.
5. **Framework 5: Alternative Data & Narrative Stability**: 2-3 month leading indicators, web sentiment, supply chain lead times, and narrative break indicators.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework**: React 19 + Vite 8
* **Routing**: React Router v7
* **Data Visualization**: Recharts
* **Icons**: Lucide React
* **Styling**: Modern CSS Design System (Custom CSS Tokens, Glassmorphism, Dark Theme, Micro-animations)

### **Backend**
* **Runtime**: Node.js (ES Modules)
* **Framework**: Express 5
* **Database**: SQLite3 via `better-sqlite3` (WAL mode enabled)
* **Real-time**: WebSockets (`ws`)
* **Scheduled Tasks**: `node-cron`
* **Data Fetching & Scraping**: Axios, Cheerio, Node-Fetch

---

## 📂 Project Structure

```
investment-intelligence/
├── server/                    # Node.js Express Backend
│   ├── data/                  # Static & Seed Data
│   ├── engine/                # Core Quantitative Math & Rule Engines
│   ├── jobs/                  # Automated Cron Tasks & Market Sync
│   ├── routes/                # Express API Route Handlers
│   │   ├── agentic.js         # Agentic Workflow APIs
│   │   ├── altData.js         # Alternative Signal APIs
│   │   ├── macro.js           # Macroeconomic Indicator APIs
│   │   ├── portfolio.js       # Portfolio Management APIs
│   │   ├── scenarios.js       # Stress Testing APIs
│   │   └── scores.js          # Multi-factor Scoring APIs
│   ├── scoring/               # 5-Framework Scoring Algorithms
│   ├── services/              # External API Integrations (Alpha Vantage, FMP, NewsAPI)
│   ├── db.js                  # SQLite Database Initialization & Queries
│   ├── index.js               # Express Server & WebSocket Setup
│   └── investment.db          # Embedded SQLite Database File
│
├── src/                       # React 19 Frontend
│   ├── assets/                # Visual & Static Assets
│   ├── pages/                 # Application Page Components
│   │   ├── AgenticMonitor.jsx # Agentic AI Monitoring
│   │   ├── AlternativeData.jsx# Alt Data Intelligence
│   │   ├── Dashboard.jsx      # Executive Dashboard
│   │   ├── DecisionNotes.jsx  # Audit Log & Decision Notes
│   │   ├── MacroDashboard.jsx # Macro Economic Tracker
│   │   ├── Portfolio.jsx      # Portfolio & Fiscal Overlay
│   │   ├── RulesEngine.jsx    # Quantitative Screening Engine
│   │   ├── Scenarios.jsx      # Scenario Stress Testing
│   │   ├── StockDetail.jsx    # Stock Deep Dive Analytics
│   │   ├── StrategyDiary.jsx  # Investment Journal & Retrospectives
│   │   └── Watchlist.jsx      # Dynamic Stock Watchlist
│   ├── App.jsx                # Layout & Navigation Shell
│   ├── index.css              # Custom CSS Design System
│   └── main.jsx               # React Application Entrypoint
│
├── .env                       # API Key Configuration
├── index.html                 # HTML Shell
├── package.json               # Package Manifest & Scripts
└── vite.config.js             # Vite Build Configuration
```

---

## ⚡ Quick Start

### 1. Prerequisites
Ensure you have installed:
* [Node.js](https://nodejs.org/) (v18.0 or higher)
* `npm` (v9.0 or higher)

### 2. Installation

Clone the repository and install dependencies:
```bash
cd investment-intelligence
npm install
```

### 3. Environment Configuration

Copy or create `.env` in the `investment-intelligence/` directory:
```env
# Real-time Data API Keys (Free Tier Compatible)
ALPHA_VANTAGE_KEY=demo
FMP_KEY=demo
NEWSAPI_KEY=demo
```

### 4. Running Locally

Start both the Express API Server and the Vite React UI concurrently:
```bash
npm run dev
```

* **Frontend App**: `http://localhost:5173`
* **API Backend**: `http://localhost:3001`

---

## 📡 API Endpoints Overview

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/stocks` | Fetch all tracked equities & fundamentals |
| `GET` | `/api/scores/:symbol` | Get 5-framework scores for a specific stock |
| `GET` | `/api/macro` | Fetch economic indicators, inflation, yield curve |
| `GET` | `/api/alt-data` | Fetch leading alternative data metrics |
| `GET` | `/api/portfolio` | Retrieve current portfolio holdings & cash overlay |
| `POST` | `/api/scenarios/run` | Execute macro scenario stress tests |
| `GET` | `/api/agentic/status` | Get real-time status of autonomous agents |
| `GET` | `/api/rules` | Fetch active screening and alert rules |

---

## 📜 License

This project is licensed under the **MIT License**.
