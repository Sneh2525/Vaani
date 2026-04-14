import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
const API = 'http://localhost:3001/api';

export default function DecisionNotes() {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showReview, setShowReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0,10), ticker:'', action:'BUY', business_score:'', valuation_score:'', market_score:'', sentiment_score:'', composite_score:'', entry_thesis:'', risk_1:'', risk_2:'', risk_3:'', time_horizon:'MEDIUM', expected_scenario:'', what_proves_wrong:'', stop_loss:'', position_size_pct:'', entry_price:'' });
  const [review, setReview] = useState({ review_date: new Date().toISOString().slice(0,10), outcome:'', bias_identified:'', what_right:'', what_wrong:'', framework_update:'', carry_forward_rule:'', actual_return:'' });

  const fetchNotes = () => fetch(`${API}/notes`).then(r => r.json()).then(d => { setNotes(d); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { fetchNotes(); }, []);

  const submit = async () => {
    await fetch(`${API}/notes`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    setShowForm(false); fetchNotes();
  };

  const submitReview = async () => {
    await fetch(`${API}/notes/${showReview.id}/review`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(review) });
    setShowReview(null); fetchNotes();
  };

  const signalColor = { BUY:'var(--accent-blue)', SELL:'var(--accent-red)', HOLD:'var(--accent-amber)', SKIP:'var(--text-muted)' };
  const horizonLabel = { SHORT:'< 3M', MEDIUM:'3-12M', LONG:'> 1Y' };

  return (
    <div>
      <div className="section-header">
        <div><div className="section-title">Decision Notes</div><div className="section-sub">Every investment action documented — building your intellectual edge</div></div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}><Plus size={14}/> New Note</button>
      </div>

      {loading ? <div className="loader"><div className="spinner"/></div> : (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {notes.map(note => (
            <div key={note.id} className="card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                  <div style={{ fontWeight:900, fontSize:18 }}>{note.ticker}</div>
                  <span style={{ padding:'3px 10px', borderRadius:6, background:`${signalColor[note.action]}22`, color:signalColor[note.action], fontWeight:700, fontSize:12 }}>{note.action}</span>
                  <span style={{ fontSize:11, color:'var(--text-muted)' }}>{note.date}</span>
                  {note.status === 'REVIEWED' && <span className="tag tag-green">REVIEWED</span>}
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:20, fontWeight:800 }}>{note.composite_score}</div>
                  <div style={{ fontSize:10, color:'var(--text-muted)' }}>Composite</div>
                </div>
              </div>

              <div className="grid-4" style={{ marginBottom:12 }}>
                {['Business','Valuation','Market','Sentiment'].map((f,i) => {
                  const v = [note.business_score, note.valuation_score, note.market_score, note.sentiment_score][i];
                  const color = v >= 7 ? 'var(--accent-green)' : v >= 5 ? 'var(--accent-amber)' : 'var(--accent-red)';
                  return <div key={f} style={{ padding:'10px', background:'var(--bg-dark)', borderRadius:8, textAlign:'center' }}>
                    <div style={{ fontSize:9, color:'var(--text-muted)', marginBottom:3 }}>{f}</div>
                    <div style={{ fontSize:18, fontWeight:800, color }}>{v}</div>
                  </div>;
                })}
              </div>

              <div style={{ background:'var(--bg-dark)', borderRadius:8, padding:'12px', marginBottom:12 }}>
                <div style={{ fontSize:10, color:'var(--text-muted)', marginBottom:4, fontWeight:600 }}>ENTRY THESIS</div>
                <div style={{ fontSize:13 }}>{note.entry_thesis}</div>
              </div>

              <div className="grid-3" style={{ marginBottom:12, gap:8 }}>
                {[note.risk_1, note.risk_2, note.risk_3].filter(Boolean).map((r, i) => (
                  <div key={i} style={{ padding:'8px 12px', background:'rgba(239,68,68,0.05)', border:'1px solid rgba(239,68,68,0.15)', borderRadius:8, fontSize:11 }}>
                    ⚠️ {r}
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', gap:16, fontSize:11, color:'var(--text-muted)', flexWrap:'wrap' }}>
                <span>📅 Horizon: <strong style={{ color:'var(--text-primary)' }}>{horizonLabel[note.time_horizon]}</strong></span>
                <span>📉 Stop-Loss: <strong style={{ color:'var(--accent-red)' }}>{note.stop_loss}</strong></span>
                <span>💰 Position: <strong style={{ color:'var(--text-primary)' }}>{note.position_size_pct}%</strong></span>
                <span>❌ What proves wrong: <em style={{ color:'var(--text-primary)' }}>{note.what_proves_wrong}</em></span>
              </div>

              {note.review && (
                <div style={{ marginTop:12, padding:'12px', background:'rgba(34,197,94,0.05)', border:'1px solid rgba(34,197,94,0.15)', borderRadius:8 }}>
                  <div style={{ fontSize:10, color:'var(--accent-green)', fontWeight:700, marginBottom:6 }}>POST-REVIEW — {note.review.review_date}</div>
                  <div style={{ fontSize:12 }}><strong>Outcome:</strong> {note.review.outcome}</div>
                  <div style={{ fontSize:12 }}><strong>Bias:</strong> {note.review.bias_identified}</div>
                  <div style={{ fontSize:12 }}><strong>Carry-Forward Rule:</strong> {note.review.carry_forward_rule}</div>
                </div>
              )}

              {!note.review && (
                <button className="btn btn-outline btn-sm" style={{ marginTop:12 }} onClick={() => setShowReview(note)}>
                  Write Post-Review
                </button>
              )}
            </div>
          ))}
          {notes.length === 0 && <div className="empty-state"><p>No decision notes yet. Create your first one — one note per week builds your edge.</p></div>}
        </div>
      )}

      {/* Create Note Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-title">📝 New Decision Note</div>
              <button className="btn-icon" onClick={() => setShowForm(false)}><X size={16}/></button>
            </div>
            <div className="form-grid-2">
              <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={form.date} onChange={e => setForm({...form, date:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Ticker</label><input className="form-input" placeholder="e.g. TCS" value={form.ticker} onChange={e => setForm({...form, ticker:e.target.value.toUpperCase()})}/></div>
              <div className="form-group"><label className="form-label">Action</label>
                <select className="form-select" value={form.action} onChange={e => setForm({...form, action:e.target.value})}>
                  <option>BUY</option><option>SELL</option><option>HOLD</option><option>SKIP</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Entry Price (₹)</label><input className="form-input" type="number" value={form.entry_price} onChange={e => setForm({...form, entry_price:e.target.value})}/></div>
            </div>
            <div className="form-grid-4" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:12 }}>
              {['business_score','valuation_score','market_score','sentiment_score'].map(f => (
                <div key={f} className="form-group"><label className="form-label">{f.split('_')[0]}</label><input className="form-input" type="number" step="0.1" min="0" max="10" value={form[f]} onChange={e => setForm({...form, [f]:e.target.value})}/></div>
              ))}
            </div>
            <div className="form-group"><label className="form-label">Composite Score</label><input className="form-input" type="number" step="0.1" value={form.composite_score} onChange={e => setForm({...form, composite_score:e.target.value})}/></div>
            <div className="form-group"><label className="form-label">Entry Thesis (Why NOW specifically)</label><textarea className="form-textarea" rows={3} value={form.entry_thesis} onChange={e => setForm({...form, entry_thesis:e.target.value})}/></div>
            <div className="form-grid-3">
              {['risk_1','risk_2','risk_3'].map((r,i) => (
                <div key={r} className="form-group"><label className="form-label">Risk Factor {i+1}</label><input className="form-input" value={form[r]} onChange={e => setForm({...form, [r]:e.target.value})}/></div>
              ))}
            </div>
            <div className="form-grid-2">
              <div className="form-group"><label className="form-label">Time Horizon</label>
                <select className="form-select" value={form.time_horizon} onChange={e => setForm({...form, time_horizon:e.target.value})}>
                  <option value="SHORT">Short (&lt;3M)</option><option value="MEDIUM">Medium (3-12M)</option><option value="LONG">Long (&gt;1Y)</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Position Size %</label><input className="form-input" type="number" value={form.position_size_pct} onChange={e => setForm({...form, position_size_pct:e.target.value})}/></div>
            </div>
            <div className="form-group"><label className="form-label">What proves me wrong? (ONE event)</label><input className="form-input" value={form.what_proves_wrong} onChange={e => setForm({...form, what_proves_wrong:e.target.value})}/></div>
            <div className="form-group"><label className="form-label">Stop-Loss Level</label><input className="form-input" value={form.stop_loss} onChange={e => setForm({...form, stop_loss:e.target.value})}/></div>
            <div className="form-group"><label className="form-label">Expected Scenario</label><textarea className="form-textarea" rows={2} value={form.expected_scenario} onChange={e => setForm({...form, expected_scenario:e.target.value})}/></div>
            <div style={{ display:'flex', gap:12, marginTop:8 }}>
              <button className="btn btn-primary" style={{ flex:1 }} onClick={submit}>Save Decision Note</button>
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReview && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowReview(null)}>
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-title">🔍 Post-Review — {showReview.ticker}</div>
              <button className="btn-icon" onClick={() => setShowReview(null)}><X size={16}/></button>
            </div>
            <div className="form-grid-2">
              <div className="form-group"><label className="form-label">Review Date</label><input className="form-input" type="date" value={review.review_date} onChange={e => setReview({...review, review_date:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Actual Return %</label><input className="form-input" type="number" value={review.actual_return} onChange={e => setReview({...review, actual_return:e.target.value})}/></div>
            </div>
            {[['outcome','Outcome vs Expectation'],['bias_identified','Bias Identified'],['what_right','What I Got Right'],['what_wrong','What I Got Wrong'],['framework_update','Framework Update Needed?'],['carry_forward_rule','Carry-Forward Rule (1 insight)']].map(([k, label]) => (
              <div key={k} className="form-group"><label className="form-label">{label}</label><textarea className="form-textarea" rows={2} value={review[k]} onChange={e => setReview({...review, [k]:e.target.value})}/></div>
            ))}
            <div style={{ display:'flex', gap:12 }}>
              <button className="btn btn-success" style={{ flex:1 }} onClick={submitReview}>Save Review</button>
              <button className="btn btn-outline" onClick={() => setShowReview(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
