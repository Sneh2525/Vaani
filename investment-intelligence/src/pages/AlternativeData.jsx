import { useState, useEffect } from 'react';
const API = 'http://localhost:3001/api';

export default function AlternativeData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/alt-data`).then(r => r.json()).then(d => { setData(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const getColor = (v) => v >= 7 ? 'var(--accent-green)' : v >= 5 ? 'var(--accent-amber)' : 'var(--accent-red)';
  const getTrend = (v) => v === 'RISING' ? '↑' : v === 'FALLING' ? '↓' : '→';
  const getTrendColor = (v) => v === 'RISING' ? 'var(--accent-green)' : v === 'FALLING' ? 'var(--accent-red)' : 'var(--text-muted)';

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Alternative Data Signal Layer</div>
          <div className="section-sub">Framework 5 — 2-3 month lead time on fundamentals · Institutional edge for retail investors</div>
        </div>
      </div>

      {/* Explainer */}
      <div className="card" style={{ marginBottom:20, background:'rgba(0,212,255,0.04)', border:'1px solid rgba(0,212,255,0.15)' }}>
        <div style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.7 }}>
          <strong style={{ color:'var(--accent-cyan)' }}>What this tracks:</strong> FASTag toll collection (logistics proxy), Naukri/LinkedIn job postings (expansion signals), app store ranks (DAU trends for consumer tech), logistics hub activity. These signal 2-3 months before quarterly results.<br/>
          <strong style={{ color:'var(--accent-cyan)' }}>Weight in composite:</strong> 10% — does not replace the 4 core frameworks, gives lead time on what they'll show next.
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:16 }}>
        {data.map(d => (
          <div key={d.ticker} className="card">
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
              <div>
                <div style={{ fontWeight:800, fontSize:16 }}>{d.ticker}</div>
                <div style={{ fontSize:10, color:'var(--text-muted)' }}>Alt Data Score</div>
              </div>
              <div style={{ fontWeight:900, fontSize:28, color:getColor(d.alt_data_score) }}>{d.alt_data_score}</div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {d.fastag_trend && (
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 12px', background:'var(--bg-dark)', borderRadius:8 }}>
                  <div>
                    <div style={{ fontSize:10, color:'var(--text-muted)', marginBottom:2 }}>🛣️ FASTAG TOLL</div>
                    <div style={{ fontSize:12, fontWeight:600, color: getTrendColor(d.fastag_trend) }}>{getTrend(d.fastag_trend)} {d.fastag_trend}</div>
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color: d.fastag_change >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                    {d.fastag_change >= 0 ? '+' : ''}{d.fastag_change?.toFixed(1)}%
                  </div>
                </div>
              )}
              {d.job_postings !== null && d.job_postings !== undefined && (
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 12px', background:'var(--bg-dark)', borderRadius:8 }}>
                  <div>
                    <div style={{ fontSize:10, color:'var(--text-muted)', marginBottom:2 }}>💼 JOB POSTINGS</div>
                    <div style={{ fontSize:12, fontWeight:600 }}>{d.job_postings?.toLocaleString()} active</div>
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color: d.job_postings_change >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                    {d.job_postings_change >= 0 ? '+' : ''}{d.job_postings_change?.toFixed(1)}%
                  </div>
                </div>
              )}
              {d.app_rank !== null && d.app_rank !== undefined && (
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 12px', background:'var(--bg-dark)', borderRadius:8 }}>
                  <div>
                    <div style={{ fontSize:10, color:'var(--text-muted)', marginBottom:2 }}>📱 APP STORE RANK</div>
                    <div style={{ fontSize:12, fontWeight:600 }}>#{d.app_rank}</div>
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color: d.app_rank_change <= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                    {d.app_rank_change > 0 ? '+' : ''}{d.app_rank_change} spots
                  </div>
                </div>
              )}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 12px', background:'var(--bg-dark)', borderRadius:8 }}>
                <div>
                  <div style={{ fontSize:10, color:'var(--text-muted)', marginBottom:2 }}>🚚 LOGISTICS ACTIVITY</div>
                  <div style={{ fontSize:12, fontWeight:600 }}>{d.logistics_activity}</div>
                </div>
                <div style={{ fontSize:14, fontWeight:700, color:getColor(d.logistics_score) }}>{d.logistics_score}/10</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
