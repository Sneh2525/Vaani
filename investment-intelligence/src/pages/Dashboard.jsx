import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, AlertTriangle, Clock, Sparkles, Search, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
const API = 'http://localhost:3001/api';

function ScoreBadge({ signal }) {
  const map = { 'STRONG BUY': 'score-strong-buy', 'BUY': 'score-buy', 'WATCH': 'score-watch', 'HOLD': 'score-watch', 'AVOID': 'score-avoid', 'SELL': 'score-sell', 'EXIT': 'score-exit' };
  return <span className={`score-badge ${map[signal] || 'score-watch'}`}>{signal}</span>;
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [macro, setMacro] = useState(null);
  const [alerts, setAlerts] = useState({ alerts: [], critical: 0, high: 0, opportunities: 0 });
  const [portfolio, setPortfolio] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/scores/summary`).then(r => r.json()),
      fetch(`${API}/macro`).then(r => r.json()),
      fetch(`${API}/alerts/run`).then(r => r.json()),
      fetch(`${API}/portfolio`).then(r => r.json()),
      fetch(`${API}/notes`).then(r => r.json()).catch(() => []),
    ]).then(([s, m, a, p, n]) => {
      setSummary(s); setMacro(m); setAlerts(a); setPortfolio(p); setNotes(Array.isArray(n) ? n.slice(0, 3) : []); setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader"><div className="spinner"/></div>;

  const ms = macro?.summary;
  const topBuys = summary?.topBuys || [];
  const signals = summary?.signals || {};
  const sectorData = summary?.sectors || {};

  const macroChartData = macro?.history?.slice(-8).map(m => ({
    date: m.date?.slice(5, 10),
    VIX: m.india_vix,
    FII: m.fii_flow / 1000,
  })) || [];

  // Top 5 sectors by buy count
  const topSectors = Object.entries(sectorData)
    .map(([k, v]) => ({ sector: k, ...v }))
    .sort((a, b) => b.buys - a.buys)
    .slice(0, 8);

  return (
    <div>
      {/* Market Ticker Bar */}
      <div className="market-ticker" style={{ marginBottom: 24, marginTop: -4 }}>
        <div className="ticker-item">
          <span className="ticker-label">Nifty 50</span>
          <span className="ticker-value">{ms?.niftyClose?.toLocaleString() || '24,125'}</span>
          <span className="ticker-change change-pos">+1.24%</span>
        </div>
        <div className="ticker-item">
          <span className="ticker-label">Sensex</span>
          <span className="ticker-value">79,223</span>
          <span className="ticker-change change-pos">+1.18%</span>
        </div>
        <div className="ticker-item">
          <span className="ticker-label">VIX</span>
          <span className="ticker-value">{ms?.indiaVix || '11.4'}</span>
          <span className="ticker-change change-neg">-5.8%</span>
        </div>
        <div className="ticker-item">
          <span className="ticker-label">USD/INR</span>
          <span className="ticker-value">{ms?.usdInr || '84.8'}</span>
        </div>
        <div className="ticker-item">
          <span className="ticker-label">RBI Rate</span>
          <span className="ticker-value">{ms?.rbiRate || '6.0'}%</span>
          <span className="ticker-change change-pos">↓ Cutting</span>
        </div>
        <div className="ticker-item">
          <span className="ticker-label">FII Flow</span>
          <span className="ticker-value">+₹{((ms?.fiiFlow || 4820) / 100).toFixed(0)}Cr</span>
        </div>
        <div className="ticker-item">
          <span className="ticker-label">Nifty PE</span>
          <span className="ticker-value">{ms?.niftyPE || '22.4'}x</span>
        </div>
      </div>

      {/* Universe Stats */}
      <div className="stat-grid stagger" style={{ marginBottom: 24 }}>
        <div className="stat-tile">
          <div className="stat-tile-label">Universe</div>
          <div className="stat-tile-value" style={{ color: 'var(--text-primary)' }}>{summary?.totalStocks || 0}</div>
          <div className="stat-tile-change change-neutral">Stocks tracked</div>
          <div className="stat-tile-mini">Full NSE coverage</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">Strong Buy + Buy</div>
          <div className="stat-tile-value" style={{ color: 'var(--accent-green)' }}>{(signals['STRONG BUY'] || 0) + (signals['BUY'] || 0)}</div>
          <div className="stat-tile-change change-pos">{signals['STRONG BUY'] || 0} strong buy</div>
          <div className="stat-tile-mini">{signals['BUY'] || 0} buy signals</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">Watch + Avoid</div>
          <div className="stat-tile-value" style={{ color: 'var(--accent-amber)' }}>{(signals['WATCH'] || 0) + (signals['AVOID'] || 0)}</div>
          <div className="stat-tile-change change-neutral">{signals['WATCH'] || 0} watch</div>
          <div className="stat-tile-mini">{signals['AVOID'] || 0} avoid · {signals['EXIT'] || 0} exit</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">Portfolio P&L</div>
          <div className="stat-tile-value" style={{ color: (portfolio?.totalPnlPct || 0) >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
            {(portfolio?.totalPnlPct || 0) >= 0 ? '+' : ''}{portfolio?.totalPnlPct || 12.9}%
          </div>
          <div className="stat-tile-change change-neutral">Total Return</div>
          <div className="stat-tile-mini">{portfolio?.holdings?.length || 0} active positions</div>
        </div>
      </div>

      {/* Watchlist + AI Insight */}
      <div className="grid-2-1" style={{ marginBottom: 24 }}>
        {/* Watchlist Table */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><TrendingUp size={16} /> Top Buy Signals <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 12, marginLeft: 6 }}>{topBuys.length} stocks</span></div>
            <Link to="/watchlist" className="view-all">Full analysis →</Link>
          </div>
          <table className="data-table">
            <thead><tr>
              <th>Stock</th><th>Sector</th><th>BSS</th><th>VRS</th><th>Score</th><th>Signal</th>
            </tr></thead>
            <tbody>
              {topBuys.slice(0, 8).map(s => (
                <tr key={s.ticker}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="star-icon">★</span>
                      <div>
                        <Link to={`/stock/${s.ticker}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>{s.ticker}</Link>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.name}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="tag tag-blue">{s.sector}</span></td>
                  <td className="mono" style={{ color: s.businessScore >= 7 ? 'var(--accent-green)' : 'var(--text-primary)' }}>{s.businessScore}</td>
                  <td className="mono" style={{ color: s.valuationScore <= 3 ? 'var(--accent-green)' : s.valuationScore <= 6 ? 'var(--accent-amber)' : 'var(--accent-red)' }}>{s.valuationScore}</td>
                  <td className="mono" style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>{s.composite}</td>
                  <td><ScoreBadge signal={s.signal} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI + Framework + Sectors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title"><Sparkles size={16} /> Market Pulse</div>
            </div>
            {[
              { label: 'Avg Business Quality', value: summary?.avgBSS || 5, color: 'var(--accent-green)' },
              { label: 'Avg Valuation Risk', value: (10 - (summary?.avgVRS || 5)).toFixed(1), color: 'var(--accent-amber)' },
              { label: 'Market Conditions', value: ms?.indiaVix < 15 ? '7.4' : '6.0', color: 'var(--accent-green)' },
            ].map(f => (
              <div className="framework-bar" key={f.label}>
                <span className="framework-bar-label">{f.label}</span>
                <div className="framework-bar-track">
                  <div className="framework-bar-fill" style={{ width: `${parseFloat(f.value) * 10}%`, background: f.color }} />
                </div>
                <span className="framework-bar-value" style={{ color: f.color }}>{f.value}</span>
              </div>
            ))}
            <div className="insight-box" style={{ marginTop: 12 }}>
              <strong>AI:</strong> {(signals['STRONG BUY'] || 0) + (signals['BUY'] || 0)} buy signals across {summary?.totalStocks || 0} stocks. 
              Top sectors: {topSectors.slice(0, 3).map(s => s.sector).join(', ')}.
              VIX at {ms?.indiaVix || 11.4} — favorable for accumulation.
            </div>
          </div>

          {/* Sector Heatmap */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Sector Opportunities</div>
            </div>
            {topSectors.map(s => (
              <div key={s.sector} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '6px 0', borderBottom: '1px solid var(--border-subtle)'
              }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.sector}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.count} stocks</span>
                  <span className={`pill ${s.buys > 2 ? 'pill-green' : s.buys > 0 ? 'pill-blue' : 'pill-amber'}`}>{s.buys} buys</span>
                  <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: s.avgComposite >= 6 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>{s.avgComposite}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VIX Chart + Active Alerts */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">India VIX Trend (8M)</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={macroChartData}>
              <defs>
                <linearGradient id="gVix" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.05)" />
              <XAxis dataKey="date" tick={{ fill:'#475569', fontSize:10, fontFamily:'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:'#475569', fontSize:10, fontFamily:'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background:'#0f172a', border:'1px solid rgba(148,163,184,0.1)', borderRadius:10 }} />
              <Area type="monotone" dataKey="VIX" stroke="#38bdf8" fill="url(#gVix)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title"><AlertTriangle size={16} /> Active Alerts</div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{alerts.totalAlerts || 0} firing</span>
          </div>
          {alerts.alerts?.slice(0, 4).map((a, i) => (
            <div key={i} className={`alert-banner alert-${a.severity?.toLowerCase() || 'medium'}`}>
              <AlertTriangle size={14} className="alert-icon" />
              <div>
                <div className="alert-title">{a.rule} {a.ticker && <span className="alert-ticker">{a.ticker}</span>}</div>
                <div className="alert-body">{a.action}</div>
              </div>
            </div>
          ))}
          {(!alerts.alerts || alerts.alerts.length === 0) && (
            <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 30 }}>No active alerts</div>
          )}
        </div>
      </div>
    </div>
  );
}
