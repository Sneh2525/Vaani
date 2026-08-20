# 📊 Investment Intelligence Workspace

This repository houses the **Investment Intelligence Engine**, its architecture blueprints, gap analysis documentation, and full-stack quantitative equity research platform.

---

## 📁 Repository Structure

```
.
├── investment-intelligence/                       # Full-Stack Web Application (React 19 + Node/Express + SQLite)
│   ├── server/                                    # Express API backend, 5-framework scoring engines, SQLite DB, background cron jobs
│   ├── src/                                       # React UI frontend, quantitative charts, dashboards, agentic monitors
│   └── README.md                                  # Comprehensive Web Application README & Setup Guide
│
├── Investment_Intelligence_Blueprint_Master_v3.docx # System architecture blueprint document
├── Investment_Intelligence_Blueprint_Master_v3_polished.docx # Refined & polished blueprint document
├── Investment_Intelligence_Blueprint_v2.docx    # Previous architectural iteration
├── blueprint_gap_analysis.txt                     # Detailed gap analysis & phase planning notes
└── bp_text.txt                                    # Extracted text from architecture blueprints
```

---

## 🚀 Getting Started with the Web Application

The primary platform codebase is located inside the [`investment-intelligence`](file:///c:/Users/Sneh%20Patel/Desktop/Y/investment-intelligence) directory.

### Quick Start

1. **Navigate to the app folder**:
   ```bash
   cd investment-intelligence
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start backend API & frontend UI concurrently**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   * **Frontend Application**: [`http://localhost:5173`](http://localhost:5173)
   * **API Backend**: [`http://localhost:3001`](http://localhost:3001)

---

## 📖 Key Documentation Links

* Detailed Web Application Documentation: [`investment-intelligence/README.md`](file:///c:/Users/Sneh%20Patel/Desktop/Y/investment-intelligence/README.md)
* Blueprint Gap Analysis: [`blueprint_gap_analysis.txt`](file:///c:/Users/Sneh%20Patel/Desktop/Y/blueprint_gap_analysis.txt)
* Blueprint Text Extraction: [`bp_text.txt`](file:///c:/Users/Sneh%20Patel/Desktop/Y/bp_text.txt)

## 🌍 Host on Render

The repository includes [`render.yaml`](render.yaml) for a single-service deployment. It builds the React client, serves it from Express, and keeps the API on the same domain.

1. Push this repository to GitHub.
2. In Render, choose **New + → Blueprint** and connect the repository.
3. Add the secret environment variables requested by the blueprint, especially `ANTHROPIC_API_KEY`, `ALPHA_VANTAGE_KEY`, `FMP_KEY`, and `NEWSAPI_KEY`.
4. Deploy. Render will build from `investment-intelligence/` and expose the app at its generated URL.

The blueprint provisions a persistent disk for `server/investment.db`. Without that disk, SQLite data will be lost when the service is redeployed.
