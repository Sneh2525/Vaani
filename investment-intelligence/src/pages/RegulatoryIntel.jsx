import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
const API = 'http://localhost:3001/api';

export default function RegulatoryIntel() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState({ date:new Date().toISOString().slice(0,10), source:'SEBI', event_type:'Circular', title:'', summary:'', affected_sectors:'', affected_tickers:'', sentiment:'NEUTRAL', impact_score:5 });

  const load = () => { setLoading(true); fetch(`${API}/regulatory`).then(r => r.json()).then(d => { setEvents(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    await fetch(`${API}/regulatory`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
    setShowForm(false); load();
  };

  const sourceColor = { SEBI:'var(--accent-blue)', RBI:'var(--accent-cyan)', BUDGET:'var(--accent-purple)', FED:'var(--accent-amber)', DATA:'var(--accent-green)' };
  const sentColor = { POSITIVE:'tag-green', NEGATIVE:'tag-red', NEUTRAL:'tag-blue' };
  const filtered = events.filter(e => !filter || e.affected_sectors?.toLowerCase().includes(filter.toLowerCase()) || e.source?.includes(filter.toUpperCase()) || e.title?.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Regulatory Intelligence Tracker</div>
          <div className="section-sub">SEBI circulars · RBI notifications · PLI updates · Budget impacts — mapped to your stocks</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}><Plus size={14}/> Add Event</button>
      </div>

      <div className="card" style={{ marginBottom:20, background:'rgba(79,142,255,0.04)', border:'1px solid rgba(79,142,255,0.15)' }}>
        <div style={{ fontSize:12, lineHeight:1.8, color:'var(--text-secondary)' }}>
          <strong style={{ color:'var(--accent-blue)' }}>Regulatory Signal Layer:</strong> Structured tracker logging every major regulatory event and mapping it to affected sectors and specific stocks in your watchlist. Auto-fed into Market Opportunity Score. PLI announcements, budget items, and RBI notifications create winners and losers before the market fully prices them in.
        </div>
      </div>

      <input className="form-input" placeholder="Filter by source (SEBI, RBI), sector, or keyword…" value={filter} onChange={e => setFilter(e.target.value)} style={{ marginBottom:16 }}/>

      {loading ? <div className="loader"><div className="spinner"/></div> : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.map(e => (
            <div key={e.id} className="card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10, flexWrap:'wrap', gap:8 }}>
                <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                  <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:4, background:`${sourceColor[e.source] || 'var(--accent-blue)'}22`, color:sourceColor[e.source] || 'var(--accent-blue)' }}>{e.source}</span>
                  <span className={`tag ${sentColor[e.sentiment]}`}>{e.sentiment}</span>
                  <span style={{ fontSize:10, color:'var(--text-muted)' }}>{e.date}</span>
                  <span style={{ fontSize:10, color:'var(--text-muted)' }}>{e.event_type}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ fontSize:10, color:'var(--text-muted)' }}>Impact:</div>
                  <div style={{ fontWeight:800, color: e.impact_score >= 8 ? 'var(--accent-red)' : e.impact_score >= 5 ? 'var(--accent-amber)' : 'var(--accent-green)' }}>{e.impact_score}/10</div>
                </div>
              </div>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:6 }}>{e.title}</div>
              {e.summary && <div style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:10 }}>{e.summary}</div>}
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {e.affected_sectors?.split(',').map(s => s.trim()).filter(Boolean).map(s => <span key={s} className="tag tag-purple">{s}</span>)}
                {e.affected_tickers?.split(',').map(t => t.trim()).filter(Boolean).map(t => <span key={t} className="tag tag-blue">{t}</span>)}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="empty-state"><p>No regulatory events matching filter.</p></div>}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-title">Add Regulatory Event</div>
              <button className="btn-icon" onClick={() => setShowForm(false)}><X size={16}/></button>
            </div>
            <div className="form-grid-3">
              <div className="form-group"><label className="form-label">Source</label>
                <select className="form-select" value={form.source} onChange={e => setForm({...form, source:e.target.value})}>
                  {['SEBI','RBI','BUDGET','PLI','MCA','OTHER'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Type</label><input className="form-input" value={form.event_type} onChange={e => setForm({...form, event_type:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={form.date} onChange={e => setForm({...form, date:e.target.value})}/></div>
            </div>
            <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={form.title} onChange={e => setForm({...form, title:e.target.value})}/></div>
            <div className="form-group"><label className="form-label">Summary</label><textarea className="form-textarea" rows={3} value={form.summary} onChange={e => setForm({...form, summary:e.target.value})}/></div>
            <div className="form-grid-2">
              <div className="form-group"><label className="form-label">Affected Sectors (comma-separated)</label><input className="form-input" value={form.affected_sectors} onChange={e => setForm({...form, affected_sectors:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Affected Tickers (comma-separated)</label><input className="form-input" value={form.affected_tickers} onChange={e => setForm({...form, affected_tickers:e.target.value})}/></div>
            </div>
            <div className="form-grid-2">
              <div className="form-group"><label className="form-label">Sentiment</label>
                <select className="form-select" value={form.sentiment} onChange={e => setForm({...form, sentiment:e.target.value})}>
                  <option>POSITIVE</option><option>NEUTRAL</option><option>NEGATIVE</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Impact Score (1-10)</label><input className="form-input" type="number" min={1} max={10} step={0.5} value={form.impact_score} onChange={e => setForm({...form, impact_score:+e.target.value})}/></div>
            </div>
            <div style={{ display:'flex', gap:12 }}>
              <button className="btn btn-primary" style={{ flex:1 }} onClick={submit}>Save Event</button>
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
