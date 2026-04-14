import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
const API = 'http://localhost:3001/api';

const MACRO_RULES = [
  { condition:'RBI Hiking (2+ consecutive hikes)', threshold:'2 hikes', action:'Reduce high-PE exposure 20%. Favour PSU banks, short-duration bonds.', category:'MACRO' },
  { condition:'RBI Cutting (first cut after pause)', threshold:'Rate cut', action:'Add weight to NBFCs, real estate, capex-heavy sectors.', category:'MACRO' },
  { condition:'FII net outflows', threshold:'> ₹5,000 Cr in one week', action:'Hold cash. Wait for reversal signal before new entries.', category:'MACRO' },
  { condition:'INR depreciation', threshold:'> 3% in one month', action:'Increase IT, pharma, and export-oriented holdings.', category:'MACRO' },
  { condition:'India VIX spike', threshold:'Crosses 22', action:'Activate panic-buy mode for high-scoring watchlist stocks.', category:'MACRO' },
  { condition:'GST below ₹1.5L Cr', threshold:'2+ consecutive months', action:'Economic slowdown signal. Reduce cyclical exposure.', category:'MACRO' },
];
const STOCK_RULES = [
  { condition:'Business Score drops post-buy', threshold:'Falls more than 2 points', action:'Immediate thesis review. Likely exit.', category:'STOCK' },
  { condition:'Valuation Score rises post-buy', threshold:'Goes above 8.0', action:'Trim 30-50% of position at market.', category:'STOCK' },
  { condition:'Earnings miss', threshold:'2 consecutive quarters', action:'Exit unless major structural reason exists.', category:'STOCK' },
  { condition:'Promoter pledge increases', threshold:'Exceeds 30% of holdings', action:'Exit. High risk of forced selling.', category:'STOCK' },
  { condition:'Volume spike + price fall', threshold:'7%+ drop on 5x average volume', action:'Research cause before acting — could be opportunity.', category:'STOCK' },
  { condition:'Sector headwind emerges', threshold:'Policy change or disruption', action:'Reassess all holdings in that sector.', category:'STOCK' },
];
const PORTFOLIO_RULES = [
  { condition:'Max single stock position', threshold:'10% of portfolio', action:'Trim immediately on breach. Non-negotiable.', category:'PORTFOLIO' },
  { condition:'Max single sector', threshold:'30% of portfolio', action:'No new additions to that sector.', category:'PORTFOLIO' },
  { condition:'Minimum cash reserve', threshold:'10% always', action:'Below 10%: pause new buys. Above 25%: deploy capital.', category:'PORTFOLIO' },
  { condition:'Portfolio drawdown pause', threshold:'15% portfolio loss', action:'Stop adding. Review all positions. Do not average down blindly.', category:'PORTFOLIO' },
  { condition:'Win rate floor', threshold:'Below 40% over 12 months', action:'Full framework audit required — something is wrong.', category:'PORTFOLIO' },
  { condition:'Maximum positions', threshold:'20-25 stocks', action:'Above this you cannot monitor properly. Consolidate.', category:'PORTFOLIO' },
];

export default function RulesEngine() {
  const [alerts, setAlerts] = useState({ alerts:[], critical:0, high:0, opportunities:0 });
  const [loading, setLoading] = useState(true);
  const [decisionTicker, setDecisionTicker] = useState('');
  const [decisionResult, setDecisionResult] = useState(null);

  useEffect(() => {
    fetch(`${API}/alerts/run`).then(r => r.json()).then(d => { setAlerts(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const runDecisionTree = async () => {
    if (!decisionTicker) return;
    const res = await fetch(`${API}/alerts/decision-tree`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ticker: decisionTicker.toUpperCase() }) });
    const data = await res.json();
    setDecisionResult(data);
  };

  const catColor = { MACRO:'var(--accent-blue)', STOCK:'var(--accent-purple)', PORTFOLIO:'var(--accent-cyan)' };
  const catBg = { MACRO:'rgba(79,142,255,0.08)', STOCK:'rgba(124,92,255,0.08)', PORTFOLIO:'rgba(0,212,255,0.08)' };

  const RuleRow = ({ rule }) => (
    <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'14px', background:'var(--bg-dark)', borderRadius:10, border:'1px solid var(--border)', marginBottom:8 }}>
      <CheckCircle size={14} style={{ color:'var(--accent-green)', flexShrink:0, marginTop:2 }} />
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
          <span style={{ fontWeight:600, fontSize:13 }}>{rule.condition}</span>
          <span style={{ fontSize:10, padding:'2px 8px', borderRadius:4, background:catBg[rule.category], color:catColor[rule.category], fontWeight:700 }}>{rule.category}</span>
        </div>
        <div style={{ fontSize:11, color:'var(--accent-amber)', marginBottom:3 }}>Threshold: {rule.threshold}</div>
        <div style={{ fontSize:11, color:'var(--text-secondary)' }}>→ {rule.action}</div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="section-header">
        <div><div className="section-title">IF-THEN Rules Engine</div><div className="section-sub">Investment judgment encoded into executable, consistent rules</div></div>
      </div>

      {/* Live Alert Status */}
      {!loading && (
        <div className="card" style={{ marginBottom:20 }}>
          <div style={{ display:'flex', gap:16, marginBottom:16, flexWrap:'wrap' }}>
            <div style={{ padding:'12px 20px', background:'rgba(239,68,68,0.08)', borderRadius:10, border:'1px solid rgba(239,68,68,0.2)', textAlign:'center' }}>
              <div style={{ fontSize:28, fontWeight:900, color:'var(--accent-red)' }}>{alerts.critical}</div>
              <div style={{ fontSize:10, color:'var(--text-muted)' }}>CRITICAL</div>
            </div>
            <div style={{ padding:'12px 20px', background:'rgba(245,158,11,0.08)', borderRadius:10, border:'1px solid rgba(245,158,11,0.2)', textAlign:'center' }}>
              <div style={{ fontSize:28, fontWeight:900, color:'var(--accent-amber)' }}>{alerts.high}</div>
              <div style={{ fontSize:10, color:'var(--text-muted)' }}>HIGH</div>
            </div>
            <div style={{ padding:'12px 20px', background:'rgba(34,197,94,0.08)', borderRadius:10, border:'1px solid rgba(34,197,94,0.2)', textAlign:'center' }}>
              <div style={{ fontSize:28, fontWeight:900, color:'var(--accent-green)' }}>{alerts.opportunities}</div>
              <div style={{ fontSize:10, color:'var(--text-muted)' }}>OPPORTUNITIES</div>
            </div>
          </div>
          {alerts.alerts?.map((a, i) => (
            <div key={i} className={`alert-banner alert-${a.severity?.toLowerCase()}`}>
              <AlertTriangle size={13}/>
              <div>
                <div className="alert-title">{a.rule} {a.ticker && <span className="alert-ticker">{a.ticker}</span>}</div>
                <div className="alert-body">{a.action}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Buy Decision Tree */}
      <div className="card" style={{ marginBottom:20 }}>
        <div className="card-title" style={{ marginBottom:14 }}>🌳 Buy / No-Buy Decision Tree</div>
        <div style={{ display:'flex', gap:10, marginBottom:12 }}>
          <input className="form-input" placeholder="Enter ticker (e.g. TCS)" value={decisionTicker} onChange={e => setDecisionTicker(e.target.value)} style={{ flex:1 }}/>
          <button className="btn btn-primary" onClick={runDecisionTree}><Zap size={13}/> Run Decision Tree</button>
        </div>
        {decisionResult && (
          <div>
            {decisionResult.steps?.map((step, i) => (
              <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:10 }}>
                <div style={{ width:24, height:24, borderRadius:'50%', background: step.result ? 'var(--accent-green)' : 'var(--accent-red)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0, color:'#fff' }}>{step.step}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600 }}>{step.condition}</div>
                  <div style={{ fontSize:11, color: step.result ? 'var(--accent-green)' : 'var(--accent-red)', marginTop:2 }}>→ {step.action}</div>
                </div>
                {!step.result && <span className="tag tag-red">STOP</span>}
                {step.result && i === decisionResult.steps.length - 1 && <span className="tag tag-green">GO</span>}
              </div>
            ))}
            <div style={{ marginTop:12, padding:'12px', background: decisionResult.canBuy ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', borderRadius:8, border:`1px solid ${decisionResult.canBuy ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}` }}>
              <div style={{ fontWeight:700, color: decisionResult.canBuy ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                {decisionResult.canBuy ? `✅ CAN BUY — Position multiplier: ${decisionResult.positionMultiplier}x` : `❌ DO NOT BUY — ${decisionResult.finalReason}`}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* All Rules */}
      <div className="grid-3">
        <div className="card">
          <div className="card-title" style={{ marginBottom:14, color:'var(--accent-blue)' }}>🌍 Macro Rules (6)</div>
          {MACRO_RULES.map((r,i) => <RuleRow key={i} rule={r} />)}
        </div>
        <div className="card">
          <div className="card-title" style={{ marginBottom:14, color:'var(--accent-purple)' }}>📈 Stock-Level Rules (6)</div>
          {STOCK_RULES.map((r,i) => <RuleRow key={i} rule={r} />)}
        </div>
        <div className="card">
          <div className="card-title" style={{ marginBottom:14, color:'var(--accent-cyan)' }}>💼 Portfolio Rules (6)</div>
          {PORTFOLIO_RULES.map((r,i) => <RuleRow key={i} rule={r} />)}
        </div>
      </div>
    </div>
  );
}
