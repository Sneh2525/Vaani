import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle, Plus, X } from 'lucide-react';
const API = 'http://localhost:3001/api';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#06b6d4'];

function fmt(n) {
  if (!n && n !== 0) return '₹0';
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e7) return sign + '₹' + (abs / 1e7).toFixed(2) + ' Cr';
  if (abs >= 1e5) return sign + '₹' + (abs / 1e5).toFixed(2) + 'L';
  return sign + '₹' + abs.toLocaleString('en-IN');
}

export default function Portfolio() {
  const [data, setData] = useState(null);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    ticker: '', shares: '', entry_price: '',
    entry_date: new Date().toISOString().slice(0, 10), current_price: ''
  });

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/portfolio`).then(r => r.json()),
      fetch(`${API}/alerts/run`).then(r => r.json()),
    ]).then(([d, a]) => {
      setData(d);
      setActiveAlerts(a.alerts?.slice(0, 4) || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const addHolding = async () => {
    if (!form.ticker || !form.shares || !form.entry_price) return;
    await fetch(`${API}/portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, ticker: form.ticker.toUpperCase() })
    });
    setShowAdd(false);
    setForm({ ticker: '', shares: '', entry_price: '', entry_date: new Date().toISOString().slice(0, 10), current_price: '' });
    load();
  };

  const removeHolding = async (id) => {
    await fetch(`${API}/portfolio/${id}`, { method: 'DELETE' });
    load();
  };

  if (loading) return <div className="loader"><div className="spinner"/></div>;
  if (!data) return <div className="empty-state"><h3>No portfolio data</h3></div>;

  const sectorData = data.sectors || [];
  const holdings = data.holdings || [];

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 24 }}>
        <div>
          <div className="section-title">💼 Portfolio Tracker</div>
          <div className="section-sub">Real-time P&L · Sector allocation · Blueprint-integrated alerts</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={14}/> Add Holding
        </button>
      </div>

      {/* Portfolio Stats */}
      <div className="stat-grid stagger" style={{ marginBottom: 24 }}>
        <div className="stat-tile">
          <div className="stat-tile-label">Total Value</div>
          <div className="stat-tile-value" style={{ color: 'var(--text-primary)' }}>{fmt(data.totalValue)}</div>
          <div className={`stat-tile-change ${(data.totalPnlPct || 0) >= 0 ? 'change-pos' : 'change-neg'}`}>
            {(data.totalPnlPct || 0) >= 0 ? '+' : ''}{data.totalPnlPct || 0}%
          </div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">Total Invested</div>
          <div className="stat-tile-value" style={{ color: 'var(--text-primary)' }}>{fmt(data.totalCost)}</div>
          <div className="stat-tile-change change-neutral">{holdings.length} positions</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">Total Return</div>
          <div className="stat-tile-value" style={{ color: (data.totalPnl || 0) >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
            {(data.totalPnl || 0) >= 0 ? '+' : ''}{fmt(data.totalPnl)}
          </div>
          <div className={`stat-tile-change ${(data.totalPnlPct || 0) >= 0 ? 'change-pos' : 'change-neg'}`}>
            {(data.totalPnlPct || 0) >= 0 ? '+' : ''}{data.totalPnlPct || 0}%
          </div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">Max Drawdown</div>
          <div className="stat-tile-value" style={{ color: 'var(--accent-amber)' }}>
            {((data.riskMetrics?.drawdown || 0) * 100).toFixed(1)}%
          </div>
          <div className="stat-tile-change change-neutral">
            Cash: {data.riskMetrics?.cashPct || 0}%
          </div>
          <div className="stat-tile-mini">Largest: {data.riskMetrics?.maxStockTicker || '—'} @ {(data.riskMetrics?.maxStockPct || 0).toFixed(1)}%</div>
        </div>
      </div>

      {/* Allocation + Holdings */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 20 }}>Sector Allocation</div>
          {sectorData.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={sectorData} dataKey="value" nameKey="sector" cx="50%" cy="50%"
                    innerRadius={50} outerRadius={80} paddingAngle={3} strokeWidth={0}>
                    {sectorData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.1)', borderRadius: 10 }}
                    formatter={(v, n) => [fmt(v), n]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
                {sectorData.map((s, i) => (
                  <div key={s.sector} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{s.sector}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", marginLeft: 'auto' }}>
                      {(s.pct || 0).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 30 }}>
              Add holdings to see allocation
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Holdings</div>
            <span style={{ fontSize: 11, color: 'var(--accent-cyan)', fontFamily: "'JetBrains Mono', monospace" }}>
              {holdings.length} positions
            </span>
          </div>
          {holdings.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Stock</th><th>Qty</th><th>Avg Cost</th><th>CMP</th><th>P&L</th>
                  <th>Wt%</th><th></th>
                </tr>
              </thead>
              <tbody>
                {holdings.map(h => {
                  const isPos = (h.pnlPct || 0) >= 0;
                  const cmp = h.current_price || h.entry_price || 0;
                  return (
                    <tr key={h.id}>
                      <td>
                        <div style={{ fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
                          <Link to={`/stock/${h.ticker}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>{h.ticker}</Link>
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{h.name}</div>
                      </td>
                      <td className="mono" style={{ fontSize: 12 }}>{h.shares}</td>
                      <td className="mono" style={{ fontSize: 12 }}>₹{(h.entry_price || 0).toLocaleString('en-IN')}</td>
                      <td className="mono" style={{ fontSize: 12, fontWeight: 700 }}>₹{cmp.toLocaleString('en-IN')}</td>
                      <td className={isPos ? 'change-pos' : 'change-neg'} style={{ fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
                        {isPos ? '+' : ''}{(h.pnlPct || 0).toFixed(1)}%
                      </td>
                      <td className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {(h.portfolioWeight || 0).toFixed(1)}%
                      </td>
                      <td>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14, padding: '2px 6px' }}
                          onClick={() => removeHolding(h.id)}>✕</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 30 }}>
              No holdings yet. Click + Add Holding.
            </div>
          )}
        </div>
      </div>

      {/* Active Alerts */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 16 }}>⚡ Active Alerts from Rules Engine</div>
        {activeAlerts.length > 0 ? (
          <div className="grid-1-1-1">
            {activeAlerts.map((a, i) => {
              const sev = a.severity?.toLowerCase() || 'medium';
              const colors = { critical: 'var(--accent-red)', high: 'var(--accent-amber)', medium: 'var(--accent-blue)', opportunity: 'var(--accent-green)', warning: 'var(--accent-amber)' };
              const c = colors[sev] || 'var(--text-muted)';
              return (
                <div key={i} style={{ background: 'rgba(15,23,42,0.4)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: c, fontFamily: "'JetBrains Mono', monospace", marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertTriangle size={12} />
                    {a.rule}
                    {a.ticker && <span className="alert-ticker">{a.ticker}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.action}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 20 }}>
            ✅ No active alerts. Rules engine running normally.
          </div>
        )}
      </div>

      {/* Add Holding Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-title">➕ Add Holding</div>
              <button className="btn-icon" onClick={() => setShowAdd(false)}><X size={16}/></button>
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Ticker</label>
                <input className="form-input" placeholder="e.g. TCS, HDFC, RELIANCE"
                  value={form.ticker} onChange={e => setForm({ ...form, ticker: e.target.value.toUpperCase() })}/>
              </div>
              <div className="form-group">
                <label className="form-label">Shares / Quantity</label>
                <input className="form-input" type="number" min="0.001" step="0.001"
                  value={form.shares} onChange={e => setForm({ ...form, shares: e.target.value })}/>
              </div>
              <div className="form-group">
                <label className="form-label">Entry / Avg Buy Price (₹)</label>
                <input className="form-input" type="number" step="0.01"
                  value={form.entry_price} onChange={e => setForm({ ...form, entry_price: e.target.value })}/>
              </div>
              <div className="form-group">
                <label className="form-label">Current Price (₹) — optional</label>
                <input className="form-input" type="number" step="0.01" placeholder="Leave blank to use entry price"
                  value={form.current_price} onChange={e => setForm({ ...form, current_price: e.target.value })}/>
              </div>
              <div className="form-group">
                <label className="form-label">Entry Date</label>
                <input className="form-input" type="date"
                  value={form.entry_date} onChange={e => setForm({ ...form, entry_date: e.target.value })}/>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={addHolding}>
                Add to Portfolio
              </button>
              <button className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
