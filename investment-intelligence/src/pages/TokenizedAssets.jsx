import { useState, useEffect } from 'react';
const API = 'http://localhost:3001/api';

export default function TokenizedAssets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/tokenized`).then(r => r.json()).then(d => { setAssets(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const liquidityColor = { 'LOW':'var(--accent-green)', 'MEDIUM':'var(--accent-amber)', 'HIGH':'var(--accent-red)', 'VERY HIGH':'var(--accent-red)' };
  const getColor = (v) => v >= 7 ? 'var(--accent-green)' : v >= 5 ? 'var(--accent-amber)' : 'var(--accent-red)';

  const framework = [
    { q:'Is the issuer SEBI-registered or regulated?', note:'Unregulated = significantly higher risk' },
    { q:'What is the lock-in period and exit mechanism?', note:'No exit mechanism = effectively illiquid' },
    { q:'What asset backs this investment?', note:'Charge on asset > unsecured > equity-like' },
    { q:'What is the yield spread over G-Sec?', note:'Adequate risk premium required' },
    { q:'How is valuation determined?', note:'Mark-to-market vs stated NAV — which?' },
    { q:'Are distributions income or capital return?', note:'Tax treatment and sustainability differ' },
  ];

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Tokenized Asset Framework</div>
          <div className="section-sub">Get ahead of the 2027-28 wave — fractional ownership, pre-IPO, REITs, unlisted equity</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom:20, background:'rgba(245,158,11,0.04)', border:'1px solid rgba(245,158,11,0.15)' }}>
        <div style={{ fontSize:12, lineHeight:1.8, color:'var(--text-secondary)' }}>
          <strong style={{ color:'var(--accent-amber)' }}>Why this matters now:</strong> SEBI is running pilots on tokenized securities. By 2027-28, fractional ownership of real estate, unlisted equity, and private credit will be retail-accessible. The valuation logic, liquidity risk, and data sources are fundamentally different from listed equities. Building this framework now puts you ahead of 99% of retail investors.
        </div>
      </div>

      {/* Evaluation Framework */}
      <div className="card" style={{ marginBottom:20 }}>
        <div className="card-title" style={{ marginBottom:14 }}>🔍 Tokenized Asset Evaluation Framework</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          {framework.map((f, i) => (
            <div key={i} style={{ padding:'12px', background:'var(--bg-dark)', borderRadius:8, border:'1px solid var(--border)' }}>
              <div style={{ fontSize:12, fontWeight:600, marginBottom:3 }}>{i+1}. {f.q}</div>
              <div style={{ fontSize:10, color:'var(--text-muted)' }}>→ {f.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Assets */}
      {loading ? <div className="loader"><div className="spinner"/></div> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:16 }}>
          {assets.map(a => (
            <div key={a.id} className="card">
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14 }}>{a.name}</div>
                  <div style={{ fontSize:10, color:'var(--text-muted)' }}>{a.platform} · {a.asset_type}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontWeight:800, fontSize:22, color:getColor(a.composite_score) }}>{a.composite_score?.toFixed(1)}</div>
                  <div style={{ fontSize:9, color:'var(--text-muted)' }}>Composite</div>
                </div>
              </div>

              <div className="grid-3" style={{ gap:8, marginBottom:12 }}>
                {[['Quality', a.quality_score], ['Valuation', a.valuation_score], ['Liquidity', a.liquidity_score]].map(([l, v]) => (
                  <div key={l} style={{ padding:'8px', background:'var(--bg-dark)', borderRadius:8, textAlign:'center' }}>
                    <div style={{ fontSize:9, color:'var(--text-muted)', marginBottom:2 }}>{l}</div>
                    <div style={{ fontSize:16, fontWeight:800, color:getColor(v) }}>{v?.toFixed(1)}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
                  <span style={{ color:'var(--text-muted)' }}>Min Investment</span>
                  <span style={{ fontWeight:700 }}>₹{a.min_investment?.toLocaleString()}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
                  <span style={{ color:'var(--text-muted)' }}>Yield/Return</span>
                  <span style={{ fontWeight:700, color:'var(--accent-green)' }}>{a.yield_or_return}%</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
                  <span style={{ color:'var(--text-muted)' }}>Lock-in</span>
                  <span style={{ fontWeight:700 }}>{a.lock_in_months} months</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
                  <span style={{ color:'var(--text-muted)' }}>Liquidity Risk</span>
                  <span style={{ fontWeight:700, color:liquidityColor[a.liquidity_risk] }}>{a.liquidity_risk}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
                  <span style={{ color:'var(--text-muted)' }}>SEBI Regulated</span>
                  <span style={{ fontWeight:700, color: a.sebi_regulated ? 'var(--accent-green)' : 'var(--accent-red)' }}>{a.sebi_regulated ? 'Yes ✓' : 'No ✗'}</span>
                </div>
              </div>
              <div style={{ marginTop:10, fontSize:11, color:'var(--text-muted)', borderTop:'1px solid var(--border)', paddingTop:8 }}>{a.notes}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
