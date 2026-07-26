import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
const API = 'http://localhost:3001/api';

export default function MacroDashboard() {
  const [data, setData] = useState(null);
  const [regEvents, setRegEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/macro`).then(r => r.json()),
      fetch(`${API}/regulatory`).then(r => r.json()).catch(() => []),
    ]).then(([d, r]) => {
      setData(d);
      setRegEvents(Array.isArray(r) ? r : []);
      setLoading(false);
    }).catch(() => { setError(true); setLoading(false); });
  }, []);

  if (loading) return <div className="loader"><div className="spinner"/></div>;
  if (error) return (
    <div className="error-state">
      <AlertTriangle size={32} />
      <h3>Failed to load macro data</h3>
      <p>Could not connect to the API server.</p>
      <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  const { summary: s, history } = data || {};
  const chartData = (history || []).map(m => ({ date: m.date?.slice(0,7), VIX: m.india_vix, FII: (m.fii_flow/1000).toFixed(1), GST: (m.gst_collection/100000).toFixed(2), Rate: m.rbi_rate, INR: m.usd_inr }));

  const Gauge = ({ label, value, min, max, unit, color, status }) => {
    const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
    return (
      <div className="card" style={{ textAlign:'center' }}>
        <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:12, textTransform:'uppercase', letterSpacing:'0.8px' }}>{label}</div>
        <svg viewBox="0 0 120 70" style={{ width:'100%', maxWidth:200, margin:'0 auto', display:'block' }}>
          <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" strokeLinecap="round"/>
          <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={`${(pct/100)*157} 157`} opacity="0.9" />
        </svg>
        <div style={{ fontSize:28, fontWeight:900, color, marginTop:-8 }}>{value}<span style={{ fontSize:13 }}>{unit}</span></div>
        <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:4 }}>{status}</div>
      </div>
    );
  };

  const sourceColor = { SEBI:'var(--accent-blue)', RBI:'var(--accent-cyan)', BUDGET:'var(--accent-purple)', MoD:'var(--accent-green)', FED:'var(--accent-amber)', MCA:'var(--accent-pink)', OTHER:'var(--text-muted)' };
  const sentColor = { POSITIVE:'tag-green', NEGATIVE:'tag-red', NEUTRAL:'tag-blue' };

  return (
    <div>
      <div className="grid-4" style={{ marginBottom:24 }}>
        <Gauge label="India VIX" value={s?.indiaVix} min={8} max={40} unit="" color={s?.indiaVix < 15 ? 'var(--accent-green)' : s?.indiaVix < 22 ? 'var(--accent-amber)' : 'var(--accent-red)'} status={s?.vixLabel} />
        <Gauge label="RBI Repo Rate" value={s?.rbiRate} min={4} max={8} unit="%" color="var(--accent-cyan)" status={s?.rbiTrend === 'CUTTING' ? '↓ Easing Cycle' : 'Stable'} />
        <Gauge label="USD/INR" value={s?.usdInr} min={78} max={90} unit="" color={s?.usdInr < 84 ? 'var(--accent-green)' : s?.usdInr < 87 ? 'var(--accent-amber)' : 'var(--accent-red)'} status={s?.usdInr < 84 ? 'Strong INR' : 'Weak INR'} />
        <Gauge label="Nifty 50 PE" value={s?.niftyPE} min={12} max={35} unit="x" color={s?.niftyPE < 19 ? 'var(--accent-green)' : s?.niftyPE < 24 ? 'var(--accent-amber)' : 'var(--accent-red)'} status={s?.niftyPE < 19 ? 'Cheap' : s?.niftyPE < 24 ? 'Fair' : 'Expensive'} />
      </div>

      {/* FII/DII Flow + GST */}
      <div className="grid-2" style={{ marginBottom:24 }}>
        <div className="card">
          <div className="card-title" style={{ marginBottom:4 }}>🌊 FII / DII Net Flow (₹ Thousands Cr)</div>
          <div style={{ display:'flex', gap:16, marginBottom:12 }}>
            <div><div style={{ fontSize:10, color:'var(--text-muted)' }}>Latest FII</div><div style={{ fontWeight:800, color: s?.fiiFlow >= 0 ? 'var(--accent-green)' : 'var(--accent-red)', fontSize:18 }}>{s?.fiiFlow >= 0 ? '+' : ''}₹{(s?.fiiFlow/100).toFixed(0)}Cr</div></div>
            <div><div style={{ fontSize:10, color:'var(--text-muted)' }}>Latest DII</div><div style={{ fontWeight:800, color:'var(--accent-blue)', fontSize:18 }}>+₹{(s?.diiFlow/100).toFixed(0)}Cr</div></div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,140,255,0.08)" />
              <XAxis dataKey="date" tick={{ fill:'#4a5878', fontSize:9 }} />
              <YAxis tick={{ fill:'#4a5878', fontSize:9 }} />
              <Tooltip contentStyle={{ background:'#0d1526', border:'1px solid rgba(99,140,255,0.2)', borderRadius:8 }} />
              <Bar dataKey="FII" fill="#4f8eff" opacity={0.8} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-title" style={{ marginBottom:4 }}>📊 GST Collections (₹ Lakh Cr)</div>
          <div style={{ marginBottom:12 }}><div style={{ fontSize:10, color:'var(--text-muted)' }}>Latest GST</div><div style={{ fontWeight:800, color:'var(--accent-purple)', fontSize:18 }}>₹{(s?.gstCollection/100000).toFixed(2)}L Cr</div></div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData}>
              <defs><linearGradient id="gGST" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7c5cff" stopOpacity={0.3}/><stop offset="95%" stopColor="#7c5cff" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,140,255,0.08)" />
              <XAxis dataKey="date" tick={{ fill:'#4a5878', fontSize:9 }} />
              <YAxis tick={{ fill:'#4a5878', fontSize:9 }} domain={['auto','auto']} />
              <Tooltip contentStyle={{ background:'#0d1526', border:'1px solid rgba(99,140,255,0.2)', borderRadius:8 }} />
              <Area type="monotone" dataKey="GST" stroke="#7c5cff" fill="url(#gGST)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regulatory Events — merged from RegulatoryIntel */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">🏛️ Regulatory & Policy Events</div>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{regEvents.length} tracked</span>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {regEvents.slice(0, 8).map((e, i) => (
            <div key={e.id || i} style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'12px', background:'var(--bg-dark)', borderRadius:10, border:'1px solid var(--border)' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:4, flexShrink:0, minWidth:60 }}>
                <span style={{ fontSize:10, color:'var(--text-muted)', fontWeight:600 }}>{e.date}</span>
                <span style={{ fontSize:10, fontWeight:700, padding:'2px 6px', borderRadius:4, background:`${sourceColor[e.source] || 'var(--accent-blue)'}22`, color:sourceColor[e.source] || 'var(--accent-blue)', textAlign:'center' }}>{e.source}</span>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:3 }}>
                  <span style={{ fontWeight:600, fontSize:13 }}>{e.title}</span>
                  <span className={`tag ${sentColor[e.sentiment] || 'tag-blue'}`}>{e.sentiment}</span>
                </div>
                {e.summary && <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:6 }}>{e.summary}</div>}
                <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                  {e.affected_sectors?.split(',').map(s => s.trim()).filter(Boolean).map(s => <span key={s} className="tag tag-purple">{s}</span>)}
                  {e.affected_tickers?.split(',').map(t => t.trim()).filter(Boolean).map(t => <span key={t} className="tag tag-blue">{t}</span>)}
                </div>
              </div>
              <div style={{ fontWeight:800, color: e.impact_score >= 8 ? 'var(--accent-red)' : e.impact_score >= 5 ? 'var(--accent-amber)' : 'var(--accent-green)', fontSize:14, flexShrink:0 }}>
                {e.impact_score}/10
              </div>
            </div>
          ))}
          {regEvents.length === 0 && <div style={{ color:'var(--text-muted)', fontSize:13, textAlign:'center', padding:20 }}>No regulatory events tracked yet.</div>}
        </div>
      </div>
    </div>
  );
}
