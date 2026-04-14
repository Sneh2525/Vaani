import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
const API = 'http://localhost:3001/api';

export default function Scenarios() {
  const [scenarios, setScenarios] = useState([]);
  const [calibration, setCalibration] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ticker:'', date: new Date().toISOString().slice(0,10), bull_prob:0.30, bull_target:'', bull_return:'', base_prob:0.50, base_target:'', base_return:'', bear_prob:0.20, bear_target:'', bear_return:'', timeframe_months:12 });

  const ev = () => (form.bull_prob * (form.bull_return||0)) + (form.base_prob * (form.base_return||0)) + (form.bear_prob * (form.bear_return||0));

  const load = () => {
    Promise.all([
      fetch(`${API}/scenarios`).then(r => r.json()),
      fetch(`${API}/scenarios/stats/calibration`).then(r => r.json()),
    ]).then(([s, c]) => { setScenarios(Array.isArray(s) ? s : []); setCalibration(c); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    await fetch(`${API}/scenarios`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
    setShowForm(false); load();
  };

  const getEvColor = (val) => val >= 10 ? 'var(--accent-green)' : val >= 0 ? 'var(--accent-amber)' : 'var(--accent-red)';

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Outcome Probability Scoring</div>
          <div className="section-sub">Stop binary buy/sell thinking — define 3 scenarios with probabilities and expected value</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}><Plus size={14}/> New Scenario</button>
      </div>

      <div className="card" style={{ marginBottom:20, background:'rgba(79,142,255,0.04)', border:'1px solid rgba(79,142,255,0.15)' }}>
        <div style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.8 }}>
          <strong style={{ color:'var(--accent-blue)' }}>How it works:</strong> Bull (30%), Base (50%), Bear (20%) scenarios with price targets. EV = (0.30 × bull%) + (0.50 × base%) + (0.20 × bear%). Only enter where EV is meaningfully positive. Over 50 trades, track if your probability estimates are calibrated — that calibration score becomes one of your most valuable edges.
        </div>
      </div>

      {/* Calibration Stats */}
      {calibration && calibration.count > 0 && (
        <div className="stat-grid" style={{ marginBottom:20 }}>
          <div className="stat-tile"><div className="stat-tile-label">Trades Reviewed</div><div className="stat-tile-value" style={{ color:'var(--accent-blue)' }}>{calibration.count}</div></div>
          <div className="stat-tile"><div className="stat-tile-label">Avg Calibration Score</div><div className="stat-tile-value" style={{ color:calibration.avgCalibration >= 7 ? 'var(--accent-green)' : 'var(--accent-amber)' }}>{calibration.avgCalibration}/10</div></div>
          <div className="stat-tile"><div className="stat-tile-label">Avg Expected Value</div><div className="stat-tile-value" style={{ color:getEvColor(calibration.avgEV) }}>{calibration.avgEV >= 0 ? '+' : ''}{calibration.avgEV}%</div></div>
        </div>
      )}

      {loading ? <div className="loader"><div className="spinner"/></div> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(360px, 1fr))', gap:16 }}>
          {scenarios.map(s => (
            <div key={s.id} className="card">
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
                <div style={{ fontWeight:900, fontSize:18 }}>{s.ticker}</div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontWeight:800, fontSize:22, color:getEvColor(s.expected_value) }}>{s.expected_value >= 0 ? '+' : ''}{s.expected_value?.toFixed(1)}%</div>
                  <div style={{ fontSize:9, color:'var(--text-muted)' }}>Expected Value</div>
                </div>
              </div>
              {[
                { label:'🟢 Bull', prob:s.bull_prob, ret:s.bull_return, target:s.bull_target, color:'var(--accent-green)' },
                { label:'🔵 Base', prob:s.base_prob, ret:s.base_return, target:s.base_target, color:'var(--accent-blue)' },
                { label:'🔴 Bear', prob:s.bear_prob, ret:s.bear_return, target:s.bear_target, color:'var(--accent-red)' },
              ].map(sc => (
                <div key={sc.label} style={{ display:'flex', justifyContent:'space-between', padding:'10px 12px', background:'var(--bg-dark)', borderRadius:8, marginBottom:6 }}>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600 }}>{sc.label} <span style={{ fontSize:10, color:'var(--text-muted)' }}>p={sc.prob}</span></div>
                    <div style={{ fontSize:10, color:'var(--text-muted)' }}>Target ₹{sc.target || '—'}</div>
                  </div>
                  <div style={{ fontWeight:800, color:sc.color, fontSize:16 }}>{sc.ret >= 0 ? '+' : ''}{sc.ret}%</div>
                </div>
              ))}
              <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:8 }}>Timeframe: {s.timeframe_months} months {s.actual_return !== null ? `· Actual: ${s.actual_return >= 0 ? '+' : ''}${s.actual_return}%` : ''}</div>
            </div>
          ))}
          {scenarios.length === 0 && <div className="empty-state" style={{ gridColumn:'1/-1' }}><p>No scenarios defined yet. Create your first 3-scenario analysis.</p></div>}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-title">🎲 New Probability Scenario</div>
              <button className="btn-icon" onClick={() => setShowForm(false)}><X size={16}/></button>
            </div>
            <div className="form-grid-2">
              <div className="form-group"><label className="form-label">Ticker</label><input className="form-input" value={form.ticker} onChange={e => setForm({...form, ticker:e.target.value.toUpperCase()})}/></div>
              <div className="form-group"><label className="form-label">Timeframe (months)</label><input className="form-input" type="number" value={form.timeframe_months} onChange={e => setForm({...form, timeframe_months:+e.target.value})}/></div>
            </div>
            {[
              { prefix:'bull', label:'🟢 Bull Case', defaultProb:0.30, color:'#22c55e' },
              { prefix:'base', label:'🔵 Base Case', defaultProb:0.50, color:'#4f8eff' },
              { prefix:'bear', label:'🔴 Bear Case', defaultProb:0.20, color:'#ef4444' },
            ].map(sc => (
              <div key={sc.prefix} style={{ padding:'16px', background:'var(--bg-dark)', borderRadius:10, border:`1px solid ${sc.color}33`, marginBottom:12 }}>
                <div style={{ fontWeight:700, marginBottom:10, color:sc.color }}>{sc.label}</div>
                <div className="form-grid-3">
                  <div className="form-group"><label className="form-label">Probability</label><input className="form-input" type="number" step={0.05} min={0} max={1} value={form[`${sc.prefix}_prob`]} onChange={e => setForm({...form, [`${sc.prefix}_prob`]:+e.target.value})}/></div>
                  <div className="form-group"><label className="form-label">Target (₹)</label><input className="form-input" type="number" value={form[`${sc.prefix}_target`]} onChange={e => setForm({...form, [`${sc.prefix}_target`]:+e.target.value})}/></div>
                  <div className="form-group"><label className="form-label">Return %</label><input className="form-input" type="number" value={form[`${sc.prefix}_return`]} onChange={e => setForm({...form, [`${sc.prefix}_return`]:+e.target.value})}/></div>
                </div>
              </div>
            ))}
            <div style={{ padding:'12px', background:'rgba(79,142,255,0.08)', borderRadius:8, marginBottom:16, textAlign:'center' }}>
              <div style={{ fontSize:11, color:'var(--text-muted)' }}>Expected Value</div>
              <div style={{ fontSize:26, fontWeight:900, color:getEvColor(ev()) }}>{ev() >= 0 ? '+' : ''}{ev().toFixed(1)}%</div>
            </div>
            <div style={{ display:'flex', gap:12 }}>
              <button className="btn btn-primary" style={{ flex:1 }} onClick={submit}>Save Scenario</button>
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
