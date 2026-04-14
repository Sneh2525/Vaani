import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar } from 'recharts';
const API = 'http://localhost:3001/api';

export default function MacroDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/macro`).then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader"><div className="spinner"/></div>;

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

  const macroEvents = [
    { date:'Jun 2025', event:'RBI MPC Meeting', impact:'Rate decision — Banking & NBFC impact', type:'RBI' },
    { date:'Feb 2026', event:'Union Budget FY27', impact:'Sector winners/losers defined', type:'BUDGET' },
    { date:'Jun-Sep 2025', event:'Monsoon Progress', impact:'FMCG, agri, rural demand', type:'MACRO' },
    { date:'May 2025', event:'US Fed FOMC Meeting', impact:'Global risk-on/risk-off driver', type:'FED' },
    { date:'Apr 2025', event:'Q4 FY25 GDP Data', impact:'Proxy for earnings direction', type:'DATA' },
  ];
  const typeColor = { RBI:'var(--accent-cyan)', BUDGET:'var(--accent-purple)', MACRO:'var(--accent-green)', FED:'var(--accent-amber)', DATA:'var(--accent-blue)' };

  return (
    <div>
      <div className="grid-4" style={{ marginBottom:24 }}>
        <Gauge label="India VIX" value={s?.indiaVix} min={8} max={40} unit="" color={s?.indiaVix < 15 ? 'var(--accent-green)' : s?.indiaVix < 22 ? 'var(--accent-amber)' : 'var(--accent-red)'} status={s?.vixLabel} />
        <Gauge label="RBI Repo Rate" value={s?.rbiRate} min={4} max={8} unit="%" color="var(--accent-cyan)" status={s?.rbiTrend === 'CUTTING' ? '↓ Easing Cycle' : 'Stable'} />
        <Gauge label="USD/INR" value={s?.usdInr} min={78} max={90} unit="" color={s?.usdInr < 84 ? 'var(--accent-green)' : s?.usdInr < 87 ? 'var(--accent-amber)' : 'var(--accent-red)'} status={s?.usdInr < 84 ? 'Strong INR' : 'Weak INR'} />
        <Gauge label="Nifty 50 PE" value={s?.niftyPE} min={12} max={35} unit="x" color={s?.niftyPE < 19 ? 'var(--accent-green)' : s?.niftyPE < 24 ? 'var(--accent-amber)' : 'var(--accent-red)'} status={s?.niftyPE < 19 ? 'Cheap' : s?.niftyPE < 24 ? 'Fair' : 'Expensive'} />
      </div>

      {/* FII/DII Flow */}
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

      {/* India Macro Events Calendar */}
      <div className="card">
        <div className="card-title" style={{ marginBottom:16 }}>📅 India Macro Events Calendar</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {macroEvents.map((e, i) => (
            <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'12px', background:'var(--bg-dark)', borderRadius:10, border:'1px solid var(--border)' }}>
              <span style={{ width:60, fontSize:10, color:'var(--text-muted)', fontWeight:600, flexShrink:0 }}>{e.date}</span>
              <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:4, background:`${typeColor[e.type]}22`, color:typeColor[e.type], flexShrink:0 }}>{e.type}</span>
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>{e.event}</div>
                <div style={{ fontSize:11, color:'var(--text-muted)' }}>{e.impact}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
