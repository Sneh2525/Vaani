import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
const API = 'http://localhost:3001/api';

export default function NarrativeRisk() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ticker:'', date:new Date().toISOString().slice(0,10), dominant_narrative:'', consensus_level:5, destruction_event:'', narrative_risk_score:5, crack_detected:false, crack_notes:'' });

  const load = () => fetch(`${API}/narrative`).then(r => r.json()).then(d => { setData(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const submit = async () => {
    await fetch(`${API}/narrative`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
    setShowForm(false); load();
  };

  const getConsensusLabel = (c) => c >= 8 ? 'Very High — Extreme Narrative Break Risk' : c >= 6 ? 'High' : c >= 4 ? 'Moderate' : 'Low';
  const getConsensusColor = (c) => c >= 8 ? 'var(--accent-red)' : c >= 6 ? 'var(--accent-amber)' : 'var(--accent-green)';

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Narrative Risk Scoring</div>
          <div className="section-sub">The risk existing apps completely ignore — when narratives break, price collapses fast.</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}><Plus size={14}/> Add Narrative</button>
      </div>

      <div className="card" style={{ marginBottom:20, background:'rgba(236,72,153,0.04)', border:'1px solid rgba(236,72,153,0.15)' }}>
        <div style={{ fontSize:12, color:'var(--text-secondary)', lineHeight:1.8 }}>
          <strong style={{ color:'var(--accent-pink)' }}>How this works:</strong> Every stock has a dominant market narrative — the story explaining its current price. When that narrative breaks, price collapses regardless of fundamentals. High consensus = high narrative break risk. Track: 1) what IS the narrative, 2) how consensual is it, 3) what single event destroys it.
        </div>
      </div>

      {loading ? <div className="loader"><div className="spinner"/></div> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:16 }}>
          {data.map(n => (
            <div key={n.id} className="card">
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
                <div style={{ fontWeight:900, fontSize:20 }}>{n.ticker}</div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontWeight:800, fontSize:22, color: n.narrative_risk_score >= 7 ? 'var(--accent-red)' : 'var(--accent-amber)' }}>{n.narrative_risk_score}</div>
                  <div style={{ fontSize:9, color:'var(--text-muted)' }}>Narrative Risk</div>
                </div>
              </div>

              {n.crack_detected ? (
                <div style={{ padding:'6px 12px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:6, marginBottom:12, fontSize:11, color:'var(--accent-red)', fontWeight:700 }}>
                  ⚡ NARRATIVE CRACK DETECTED — Monitor immediately
                </div>
              ) : null}

              <div className={`narrative-card ${n.narrative_risk_score >= 7 ? 'narrative-high' : n.narrative_risk_score >= 5 ? 'narrative-medium' : 'narrative-low'}`} style={{ marginBottom:14 }}>
                <div style={{ fontSize:10, color:'var(--text-muted)', marginBottom:4 }}>DOMINANT NARRATIVE</div>
                <div style={{ fontSize:13 }}>"{n.dominant_narrative}"</div>
              </div>

              <div style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:11, color:'var(--text-muted)' }}>Consensus Level</span>
                  <span style={{ fontSize:11, fontWeight:700, color:getConsensusColor(n.consensus_level) }}>{n.consensus_level}/10</span>
                </div>
                <div style={{ height:5, background:'rgba(255,255,255,0.05)', borderRadius:999, overflow:'hidden' }}>
                  <div style={{ width:`${(n.consensus_level/10)*100}%`, height:'100%', background:getConsensusColor(n.consensus_level), borderRadius:999 }}/>
                </div>
                <div style={{ fontSize:10, color:getConsensusColor(n.consensus_level), marginTop:3 }}>{getConsensusLabel(n.consensus_level)}</div>
              </div>

              <div style={{ padding:'10px', background:'rgba(239,68,68,0.05)', borderRadius:8, border:'1px solid rgba(239,68,68,0.12)' }}>
                <div style={{ fontSize:9, color:'var(--text-muted)', marginBottom:3 }}>SINGLE DESTRUCTION EVENT</div>
                <div style={{ fontSize:12 }}>{n.destruction_event}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-title">Add Narrative Risk</div>
              <button className="btn-icon" onClick={() => setShowForm(false)}><X size={16}/></button>
            </div>
            <div className="form-grid-2">
              <div className="form-group"><label className="form-label">Ticker</label><input className="form-input" value={form.ticker} onChange={e => setForm({...form, ticker:e.target.value.toUpperCase()})}/></div>
              <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={form.date} onChange={e => setForm({...form, date:e.target.value})}/></div>
            </div>
            <div className="form-group"><label className="form-label">Dominant Market Narrative</label><textarea className="form-textarea" rows={2} value={form.dominant_narrative} onChange={e => setForm({...form, dominant_narrative:e.target.value})}/></div>
            <div className="form-group"><label className="form-label">Single Event That Destroys This Narrative</label><textarea className="form-textarea" rows={2} value={form.destruction_event} onChange={e => setForm({...form, destruction_event:e.target.value})}/></div>
            <div className="form-grid-2">
              <div className="form-group"><label className="form-label">Consensus Level (1-10)</label><input className="form-input" type="number" min={1} max={10} value={form.consensus_level} onChange={e => setForm({...form, consensus_level:+e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Narrative Risk Score (1-10)</label><input className="form-input" type="number" min={1} max={10} step={0.1} value={form.narrative_risk_score} onChange={e => setForm({...form, narrative_risk_score:+e.target.value})}/></div>
            </div>
            <div className="form-group" style={{ display:'flex', gap:10, alignItems:'center' }}>
              <input type="checkbox" id="crack" checked={form.crack_detected} onChange={e => setForm({...form, crack_detected:e.target.checked})}/>
              <label htmlFor="crack" style={{ fontSize:13 }}>Narrative crack detected?</label>
            </div>
            {form.crack_detected && <div className="form-group"><label className="form-label">Crack Notes</label><textarea className="form-textarea" rows={2} value={form.crack_notes} onChange={e => setForm({...form, crack_notes:e.target.value})}/></div>}
            <div style={{ display:'flex', gap:12 }}>
              <button className="btn btn-primary" style={{ flex:1 }} onClick={submit}>Save</button>
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
