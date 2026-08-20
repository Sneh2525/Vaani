# Vaani Investment Intelligence

Vaani is a full-stack investment research and decision-support platform for Indian equities. It combines multi-factor stock scoring, live NSE prices, macro risk monitoring, portfolio analysis, alternative-data signals, scenario testing, and an AI research workspace.

The application is designed for research and monitoring. It is not financial advice and does not place trades automatically.

## What It Includes

- Executive dashboard with market, portfolio, sector, and signal summaries
- Five-framework stock scoring and stock detail analysis
- Watchlist, portfolio, decision notes, and strategy diary workflows
- Macro dashboard and portfolio scenario stress testing
- Rules engine and agentic monitoring for alerts and thesis reviews
- Vaani Intelligence Hub for workspace-grounded AI questions
- Fyers market-data integration for NSE equity quotes
- Groq AI integration for research summaries, briefings, and chat
- SQLite persistence with scheduled background jobs

## Architecture

```text
React 19 + Vite 8       investment-intelligence/src
          |
          | REST API
          v
Express 5 + Node.js     investment-intelligence/server
          |
          +-- SQLite / better-sqlite3
          +-- Fyers quotes
          +-- Groq AI
          +-- Alpha Vantage FX
```

The deployable app lives in [`investment-intelligence`](investment-intelligence/). The repository root also contains architecture blueprints and planning documents.

## Local Development

### Requirements

- Node.js 18 or newer
- npm 9 or newer
- Python 3.10 or newer only if using the optional sentiment service

### Install and run

```powershell
cd investment-intelligence
npm install
npm run dev
```

Open the frontend at `http://localhost:5173`. The API runs at `http://localhost:3001`.

Useful commands:

```powershell
npm run server    # API only
npm run client    # Vite only
npm run build     # Production frontend build
npm run preview   # Preview the production build
npm run lint      # ESLint
```

## Environment Variables

Create `investment-intelligence/.env`. Never commit this file or paste its values into source code.

```env
GROQ_API_KEY=your_groq_key
GROQ_MODEL=openai/gpt-oss-20b

FYERS_APP_ID=your_fyers_app_id
FYERS_SECRET_ID=your_fyers_secret_id
FYERS_ACCESS_TOKEN=your_fyers_access_token
FYERS_REDIRECT_URI=http://localhost:5173

ALPHA_VANTAGE_KEY=your_alpha_vantage_key
NEWSAPI_KEY=your_newsapi_key
```

### Fyers authentication

The helper at [`investment-intelligence/fyers_auth.py`](investment-intelligence/fyers_auth.py) generates the login URL and exchanges an authorization code for an access token.

```powershell
cd investment-intelligence
python fyers_auth.py
```

After logging in, copy only the `auth_code` value from the redirect URL and exchange it promptly:

```powershell
python fyers_auth.py --auth-code "YOUR_AUTH_CODE"
```

Restart the backend after the token is saved. Fyers access tokens may expire and need to be renewed.

### Groq setup

Create a key at [console.groq.com/keys](https://console.groq.com/keys), set `GROQ_API_KEY`, and restart the backend. The configured model must be available to your Groq account.

## Deployment

### Backend on Render

[`render.yaml`](render.yaml) provisions the Node/Express service and the required environment-variable slots for Render's free web-service tier.

1. In Render, choose **New -> Blueprint**.
2. Select this GitHub repository and the `main` branch.
3. Add the Groq, Fyers, Alpha Vantage, and NewsAPI values in Render Environment.
4. Deploy and verify `https://your-render-service.onrender.com/api/health`.

Keep all provider secrets on Render. Do not put them in Vercel or frontend code.

The free Render service has an ephemeral filesystem and sleeps after inactivity. This means the local SQLite database can reset after a restart or redeploy. Use a hosted database such as Supabase Postgres when you need durable production data.

### Frontend on Vercel

The root [`vercel.json`](vercel.json) builds the nested Vite application and publishes `investment-intelligence/dist`.

1. Import the repository into Vercel.
2. Keep the Vercel Root Directory at the repository root.
3. Add this environment variable:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

4. Deploy or redeploy the latest `main` commit.

Vercel hosts the frontend; Render hosts the Express API. On the free setup, SQLite is suitable for demos but is not durable storage.

## Project Layout

```text
.
├── investment-intelligence/
│   ├── server/          Express API, jobs, routes, scoring, services
│   ├── src/             React application and page components
│   ├── public/          Static assets and sentiment service files
│   ├── fyers_auth.py    Fyers authorization-code helper
│   └── package.json
├── render.yaml          Render backend deployment blueprint
├── vercel.json          Vercel nested-app build configuration
└── blueprint_gap_analysis.txt
```

## Security

- Rotate any API key or broker secret that has been exposed.
- Keep `.env`, database files, tokens, and private credentials out of Git.
- Use read-only or limited-scope provider credentials where possible.
- Treat generated research as decision support, not guaranteed predictions.
