import { useState, useEffect } from 'react';
import { Plus, X, Check } from 'lucide-react';
const API = 'http://localhost:3001/api';

export default function FiscalHealth() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ event_type:'EMI', description:'', amount:'', due_date:'', is_recurring:false, recurrence_months:'', impact_level:'MEDIUM' });

  const load = () => fetch(`${API}/fiscal`).then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const submit = async () => {
    await fetch(`${API}/fiscal`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
    setShowForm(false); load();
  };

  const markPaid = async (id) => {
    await fetch(`${API}/fiscal/${id}/paid`, { method:'PUT' });
    load();
  };

  const impactColor = { HIGH:'var(--accent-red)', MEDIUM:'var(--accent-amber)', LOW:'var(--accent-green)' };
  const typeEmoji = { EMI:'🏠', TAX:'🏛️', EDUCATION:'🎓', INSURANCE:'🛡️', MEDICAL:'🏥', OTHER:'📋' };
  const riskColor = { NORMAL:'var(--accent-green)', REDUCED:'var(--accent-amber)', CONSERVATIVE:'var(--accent-red)' };

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Personal Fiscal Health</div>
          <div className="section-sub">Your portfolio in context — prevents selling good stocks at bad times due to cash emergencies</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}><Plus size={14}/> Add Event</button>
      </div>

      <div className="card" style={{ marginBottom:20, background:'rgba(236,72,153,0.04)', border:'1px solid rgba(236,72,153,0.15)' }}>
        <div style={{ fontSize:12, lineHeight:1.8, color:'var(--text-secondary)' }}>
          <strong style={{ color:'var(--accent-pink)' }}>The most common retail mistake:</strong> Selling good stocks at bad times because of personal cash emergencies that were completely predictable. This overlay links your portfolio decisions to your real cash flow — adjusting risk tolerance and flagging illiquid positions before a crunch hits.
        </div>
      </div>

      {loading ? <div className="loader"><div className="spinner"/></div> : (
        <>
          {/* Risk Tolerance Indicator */}
          <div className="grid-3" style={{ marginBottom:20 }}>
            <div className="card" style={{ textAlign:'center', border:`1px solid ${riskColor[data?.riskTolerance]}44` }}>
              <div style={{ fontSize:10, color:'var(--text-muted)', marginBottom:8 }}>CURRENT RISK TOLERANCE</div>
              <div style={{ fontSize:28, fontWeight:900, color:riskColor[data?.riskTolerance] }}>{data?.riskTolerance}</div>
              {data?.daysUntilNext && <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:4 }}>Next event in {data.daysUntilNext} days</div>}
            </div>
            <div className="card" style={{ textAlign:'center' }}>
              <div style={{ fontSize:10, color:'var(--text-muted)', marginBottom:8 }}>UPCOMING OBLIGATIONS</div>
              <div style={{ fontSize:28, fontWeight:900 }}>{data?.upcoming?.length || 0}</div>
              <div style={{ fontSize:11, color:'var(--text-muted)' }}>in pipeline</div>
            </div>
            <div className="card" style={{ textAlign:'center' }}>
              <div style={{ fontSize:10, color:'var(--text-muted)', marginBottom:8 }}>TOTAL UPCOMING</div>
              <div style={{ fontSize:24, fontWeight:900, color:'var(--accent-red)' }}>₹{((data?.totalUpcoming||0)/100000).toFixed(1)}L</div>
              <div style={{ fontSize:11, color:'var(--text-muted)' }}>planned cash outflow</div>
            </div>
          </div>

          {/* Events List */}
          <div className="card">
            <div className="card-title" style={{ marginBottom:16 }}>📅 Financial Event Calendar</div>
            <div>
              {data?.events?.map(e => (
                <div key={e.id} className="fiscal-event" style={{ opacity: e.is_paid ? 0.5 : 1 }}>
                  <div style={{ fontSize:24 }}>{typeEmoji[e.event_type] || '📋'}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:2 }}>
                      <span style={{ fontWeight:700, fontSize:13 }}>{e.description}</span>
                      <span className={`tag ${e.impact_level === 'HIGH' ? 'tag-red' : e.impact_level === 'MEDIUM' ? 'tag-amber' : 'tag-green'}`}>{e.impact_level}</span>
                      {e.is_recurring ? <span className="tag tag-blue">RECURRING</span> : null}
                    </div>
                    <div className="fiscal-date">{e.due_date} {e.is_recurring ? `· Every ${e.recurrence_months}m` : ''}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div className="fiscal-amount" style={{ color:impactColor[e.impact_level] }}>₹{e.amount?.toLocaleString()}</div>
                    {!e.is_paid && <button style={{ fontSize:10, color:'var(--accent-green)', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:3, marginTop:2 }} onClick={() => markPaid(e.id)}><Check size={10}/> Mark paid</button>}
                    {e.is_paid && <span style={{ fontSize:10, color:'var(--accent-green)' }}>✓ Paid</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-title">Add Fiscal Event</div>
              <button className="btn-icon" onClick={() => setShowForm(false)}><X size={16}/></button>
            </div>
            <div className="form-grid-2">
              <div className="form-group"><label className="form-label">Type</label>
                <select className="form-select" value={form.event_type} onChange={e => setForm({...form, event_type:e.target.value})}>
                  {['EMI','TAX','EDUCATION','INSURANCE','MEDICAL','OTHER'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Impact Level</label>
                <select className="form-select" value={form.impact_level} onChange={e => setForm({...form, impact_level:e.target.value})}>
                  <option>HIGH</option><option>MEDIUM</option><option>LOW</option>
                </select>
              </div>
            </div>
            <div className="form-group"><label className="form-label">Description</label><input className="form-input" value={form.description} onChange={e => setForm({...form, description:e.target.value})}/></div>
            <div className="form-grid-2">
              <div className="form-group"><label className="form-label">Amount (₹)</label><input className="form-input" type="number" value={form.amount} onChange={e => setForm({...form, amount:+e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Due Date</label><input className="form-input" type="date" value={form.due_date} onChange={e => setForm({...form, due_date:e.target.value})}/></div>
            </div>
            <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:12 }}>
              <input type="checkbox" id="recurring" checked={form.is_recurring} onChange={e => setForm({...form, is_recurring:e.target.checked})}/>
              <label htmlFor="recurring" style={{ fontSize:13 }}>Recurring?</label>
              {form.is_recurring && <input className="form-input" type="number" style={{ width:100 }} placeholder="Every N months" value={form.recurrence_months} onChange={e => setForm({...form, recurrence_months:+e.target.value})}/>}
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
