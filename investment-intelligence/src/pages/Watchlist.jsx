import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
const API = 'http://localhost:3001/api';

function ScoreBadge({ signal }) {
  const map = { 'STRONG BUY': 'score-strong-buy', 'BUY': 'score-buy', 'WATCH': 'score-watch', 'AVOID': 'score-avoid', 'EXIT': 'score-exit' };
  return <span className={`score-badge ${map[signal] || 'score-watch'}`}>{signal}</span>;
}

function CircularScore({ value, size = 64, color }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value, 10) / 10;
  const strokeDashoffset = circumference * (1 - pct);
  const c = color || (value >= 7 ? 'var(--accent-green)' : value >= 5 ? 'var(--accent-amber)' : 'var(--accent-red)');
  return (
    <div className="circular-score" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(148,163,184,0.06)" strokeWidth="3" />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={c} strokeWidth="3"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
      </svg>
      <span className="circular-score-value" style={{ color: c, fontSize: 14 }}>{value}</span>
    </div>
  );
}

export default function Watchlist() {
  const [scores, setScores] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [signalFilter, setSignalFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('composite');
  const [selected, setSelected] = useState(null);
  const LIMIT = 25;

  const fetchScores = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: LIMIT, sort });
    if (search) params.set('search', search);
    if (sectorFilter !== 'ALL') params.set('sector', sectorFilter);
    if (signalFilter !== 'ALL') params.set('signal', signalFilter);

    fetch(`${API}/scores?${params}`).then(r => r.json()).then(d => {
      setScores(d.data || []);
      setTotalPages(d.totalPages || 1);
      setTotal(d.total || 0);
      if (d.sectors) setSectors(d.sectors);
      if (!selected && d.data?.length) setSelected(d.data[0]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [page, search, sectorFilter, signalFilter, sort]);

  useEffect(() => { fetchScores(); }, [fetchScores]);

  // Debounce search input
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  return (
    <div>
      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: 420 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
          <input
            className="form-input"
            placeholder="Search 300+ stocks by ticker, name, sector…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            style={{ paddingLeft: 32 }}
          />
        </div>

        <select className="form-select" value={sectorFilter} onChange={e => { setSectorFilter(e.target.value); setPage(1); }}
          style={{ width: 'auto', minWidth: 140 }}>
          <option value="ALL">All Sectors</option>
          {sectors.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select className="form-select" value={signalFilter} onChange={e => { setSignalFilter(e.target.value); setPage(1); }}
          style={{ width: 'auto', minWidth: 140 }}>
          <option value="ALL">All Signals</option>
          <option value="STRONG BUY">Strong Buy</option>
          <option value="BUY">Buy</option>
          <option value="WATCH">Watch</option>
          <option value="AVOID">Avoid</option>
          <option value="EXIT">Exit</option>
        </select>

        <select className="form-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
          style={{ width: 'auto', minWidth: 120 }}>
          <option value="composite">Score ↓</option>
          <option value="bss">BSS ↓</option>
          <option value="market_cap">Market Cap ↓</option>
          <option value="ticker">A → Z</option>
        </select>

        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'nowrap' }}>
          {total} results
        </span>
      </div>

      {/* Main Content */}
      <div className="grid-2-1" style={{ minHeight: 400 }}>
        {/* Stock Table */}
        <div className="card" style={{ padding: 0 }}>
          {loading ? (
            <div className="loader"><div className="spinner"/></div>
          ) : (
            <>
              <table className="data-table">
                <thead><tr>
                  <th>Stock</th><th>Sector</th><th>BSS</th><th>VRS</th><th>MOS</th><th>Composite</th><th>Signal</th>
                </tr></thead>
                <tbody>
                  {scores.map(s => (
                    <tr key={s.ticker} onClick={() => setSelected(s)} style={{ cursor: 'pointer', background: selected?.ticker === s.ticker ? 'rgba(56,189,248,0.04)' : 'transparent' }}>
                      <td>
                        <Link to={`/stock/${s.ticker}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}
                          onClick={e => e.stopPropagation()}>
                          {s.ticker}
                        </Link>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                      </td>
                      <td><span className="tag tag-blue" style={{ fontSize: 9 }}>{s.sector}</span></td>
                      <td className="mono" style={{ color: s.businessScore >= 7 ? 'var(--accent-green)' : s.businessScore >= 5 ? 'var(--text-primary)' : 'var(--accent-red)', fontSize: 13 }}>{s.businessScore}</td>
                      <td className="mono" style={{ color: s.valuationScore <= 3 ? 'var(--accent-green)' : s.valuationScore <= 6 ? 'var(--accent-amber)' : 'var(--accent-red)', fontSize: 13 }}>{s.valuationScore}</td>
                      <td className="mono" style={{ fontSize: 13 }}>{s.marketScore}</td>
                      <td className="mono" style={{ fontWeight: 800, fontSize: 14, color: s.composite >= 6 ? 'var(--accent-green)' : s.composite >= 4 ? 'var(--accent-amber)' : 'var(--accent-red)' }}>{s.composite}</td>
                      <td><ScoreBadge signal={s.signal} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                  Page {page} of {totalPages} · {total} stocks
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn-icon" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}><ChevronLeft size={14} /></button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                    if (p > totalPages) return null;
                    return <button key={p} className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-outline'}`} onClick={() => setPage(p)}>{p}</button>;
                  })}
                  <button className="btn-icon" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}><ChevronRight size={14} /></button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Selected Stock Detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {selected ? (
            <>
              {/* Header */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 20 }}>{selected.ticker}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{selected.name}</div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                      <span className="tag tag-blue">{selected.sector}</span>
                      {selected.industry && <span className="tag tag-purple">{selected.industry}</span>}
                    </div>
                  </div>
                  <ScoreBadge signal={selected.signal} />
                </div>
              </div>

              {/* Framework Scores */}
              <div className="card">
                <div className="card-title" style={{ marginBottom: 14 }}>Framework Scores</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div style={{ textAlign: 'center' }}>
                    <CircularScore value={selected.businessScore} size={64} />
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>BSS</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <CircularScore value={selected.valuationScore} size={64} color={
                      selected.valuationScore <= 3 ? 'var(--accent-green)' : selected.valuationScore <= 6 ? 'var(--accent-amber)' : 'var(--accent-red)'
                    } />
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>VRS</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <CircularScore value={selected.marketScore} size={64} />
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>MOS</div>
                  </div>
                </div>

                {/* Composite Score */}
                <div style={{ textAlign: 'center', margin: '12px 0' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, fontFamily: "'JetBrains Mono', monospace" }}>Composite Score</div>
                  <div style={{ fontSize: 42, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: selected.composite >= 6 ? 'var(--accent-green)' : selected.composite >= 4 ? 'var(--accent-amber)' : 'var(--accent-red)' }}>
                    {selected.composite}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>out of 10</div>
                </div>

                {/* Framework bars */}
                {[
                  { label: 'Business (BSS)', value: selected.businessScore, color: 'var(--accent-green)' },
                  { label: 'Valuation (VRS) ↑=worse', value: selected.valuationScore, color: selected.valuationScore > 6 ? 'var(--accent-red)' : 'var(--accent-amber)' },
                  { label: 'Market (MOS)', value: selected.marketScore, color: 'var(--accent-green)' },
                  { label: 'Sentiment (STI)', value: selected.sentimentScore, color: selected.sentimentScore > 7 ? 'var(--accent-red)' : 'var(--accent-amber)' },
                  { label: 'Alt Data', value: selected.altDataScore, color: 'var(--accent-cyan)' },
                ].map(f => (
                  <div className="framework-bar" key={f.label}>
                    <span className="framework-bar-label">{f.label}</span>
                    <div className="framework-bar-track">
                      <div className="framework-bar-fill" style={{ width: `${Math.min(f.value, 10) * 10}%`, background: f.color }} />
                    </div>
                    <span className="framework-bar-value" style={{ color: f.color }}>{f.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/stock/${selected.ticker}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Full Analysis →</Link>
                <Link to="/notes" className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Decision Note</Link>
              </div>
            </>
          ) : (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <Search size={28} style={{ marginBottom: 12 }} />
                <div>Click a stock to see details</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
