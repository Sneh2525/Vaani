import { useState, useEffect } from 'react';
import { Plus, X, Tag } from 'lucide-react';
const API = 'http://localhost:3001/api';

const TAGS = ['MACRO','SECTOR','SIGNAL','FRAMEWORK','MISTAKE','MOOD','INSIGHT'];
const TAG_COLORS = { MACRO:'tag-blue', SECTOR:'tag-purple', SIGNAL:'tag-amber', FRAMEWORK:'tag-cyan', MISTAKE:'tag-red', MOOD:'tag-green', INSIGHT:'tag-green' };
const MOODS = ['BULLISH','NEUTRAL','CAUTIOUS','FEARFUL','CALM','GREEDY'];

export default function StrategyDiary() {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTag, setActiveTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0,10), macro_obs:'', sector_thesis:'', signal_flag:'', new_rule_idea:'', lesson:'', mood:'NEUTRAL', key_insight:'', tags:'' });
  const [aiPrompt, setAiPrompt] = useState('');

  const fetch_ = () => fetch(`${API}/diary${activeTag ? `?tag=${activeTag}` : ''}`).then(r => r.json()).then(d => { setEntries(d); setLoading(false); });
  useEffect(() => { fetch_(); }, [activeTag]);

  const submit = async () => {
    const tags = TAGS.filter(t => form[t.toLowerCase()]).join(' ');
    await fetch(`${API}/diary`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({...form, tags:`[${TAGS.filter(t => form[t.toLowerCase()]).join('][')}]`}) });
    setShowForm(false); fetch_();
  };

  const getAIPrompt = () => fetch(`${API}/diary/ai-prompt`).then(r => r.json()).then(d => setAiPrompt(d.prompt));

  const moodColor = { BULLISH:'var(--accent-green)', NEUTRAL:'var(--text-muted)', CAUTIOUS:'var(--accent-amber)', FEARFUL:'var(--accent-red)', CALM:'var(--accent-cyan)', GREEDY:'var(--accent-pink)' };

  return (
    <div>
      <div className="section-header">
        <div><div className="section-title">Strategy Diary</div><div className="section-sub">Raw observations become frameworks. Tagged — AI-mineable — self-improving.</div></div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn btn-outline" onClick={getAIPrompt}><Tag size={13}/> Gen AI Prompt</button>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}><Plus size={14}/> New Entry</button>
        </div>
      </div>

      {/* Tag filter */}
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        <button className={`btn btn-sm ${!activeTag ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTag('')}>All</button>
        {TAGS.map(t => <button key={t} className={`btn btn-sm ${activeTag===t ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTag(activeTag===t?'':t)}>{t}</button>)}
      </div>

      {aiPrompt && (
        <div className="card" style={{ marginBottom:20, background:'rgba(124,92,255,0.06)', border:'1px solid rgba(124,92,255,0.2)' }}>
          <div style={{ fontSize:11, color:'var(--accent-purple)', fontWeight:700, marginBottom:8 }}>🤖 AI ANALYSIS PROMPT — Copy to Claude / ChatGPT</div>
          <pre style={{ fontSize:11, color:'var(--text-secondary)', whiteSpace:'pre-wrap', maxHeight:200, overflow:'auto' }}>{aiPrompt.slice(0, 1000)}...</pre>
          <button className="btn btn-outline btn-sm" style={{ marginTop:10 }} onClick={() => navigator.clipboard.writeText(aiPrompt)}>Copy Full Prompt</button>
        </div>
      )}

      {loading ? <div className="loader"><div className="spinner"/></div> : (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {entries.map(entry => (
            <div key={entry.id} className="card">
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12, alignItems:'center' }}>
                <div style={{ fontWeight:700 }}>{entry.date}</div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:11, fontWeight:700, color: moodColor[entry.mood] || 'var(--text-muted)' }}>● {entry.mood}</span>
                  <div style={{ display:'flex', gap:4 }}>
                    {TAGS.filter(t => entry.tags?.includes(t)).map(t => <span key={t} className={`tag ${TAG_COLORS[t]}`}>{t}</span>)}
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {entry.macro_obs && <div><span style={{ fontSize:10, color:'var(--accent-blue)', fontWeight:700 }}>[MACRO] </span><span style={{ fontSize:13 }}>{entry.macro_obs}</span></div>}
                {entry.sector_thesis && <div><span style={{ fontSize:10, color:'var(--accent-purple)', fontWeight:700 }}>[SECTOR] </span><span style={{ fontSize:13 }}>{entry.sector_thesis}</span></div>}
                {entry.signal_flag && <div><span style={{ fontSize:10, color:'var(--accent-amber)', fontWeight:700 }}>[SIGNAL] </span><span style={{ fontSize:13 }}>{entry.signal_flag}</span></div>}
                {entry.new_rule_idea && <div style={{ padding:'8px 12px', background:'rgba(0,212,255,0.06)', borderRadius:8, border:'1px solid rgba(0,212,255,0.15)' }}><span style={{ fontSize:10, color:'var(--accent-cyan)', fontWeight:700 }}>[FRAMEWORK] </span><span style={{ fontSize:13 }}>{entry.new_rule_idea}</span></div>}
                {entry.lesson && <div style={{ padding:'8px 12px', background:'rgba(239,68,68,0.05)', borderRadius:8 }}><span style={{ fontSize:10, color:'var(--accent-red)', fontWeight:700 }}>[MISTAKE] </span><span style={{ fontSize:13 }}>{entry.lesson}</span></div>}
                {entry.key_insight && <div style={{ padding:'8px 12px', background:'rgba(34,197,94,0.06)', borderRadius:8, border:'1px solid rgba(34,197,94,0.15)' }}><span style={{ fontSize:10, color:'var(--accent-green)', fontWeight:700 }}>[INSIGHT] </span><em style={{ fontSize:13 }}>{entry.key_insight}</em></div>}
              </div>
            </div>
          ))}
          {entries.length === 0 && <div className="empty-state"><p>No diary entries yet. Start writing — observations become frameworks over time.</p></div>}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal-box">
            <div className="modal-header">
              <div className="modal-title">📖 New Diary Entry</div>
              <button className="btn-icon" onClick={() => setShowForm(false)}><X size={16}/></button>
            </div>
            <div className="form-grid-2">
              <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={form.date} onChange={e => setForm({...form, date:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Mood</label>
                <select className="form-select" value={form.mood} onChange={e => setForm({...form, mood:e.target.value})}>
                  {MOODS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
            {[['macro_obs','[MACRO] Economic/Market Observation'],['sector_thesis','[SECTOR] Sector Thesis'],['signal_flag','[SIGNAL] Bubble/Crash Flag'],['new_rule_idea','[FRAMEWORK] New Rule Idea'],['lesson','[MISTAKE] Lesson Learned'],['key_insight','[INSIGHT] Sharpest Observation Today']].map(([k, label]) => (
              <div key={k} className="form-group"><label className="form-label">{label}</label><textarea className="form-textarea" rows={2} value={form[k]} onChange={e => setForm({...form, [k]:e.target.value})}/></div>
            ))}
            <div style={{ display:'flex', gap:12 }}>
              <button className="btn btn-primary" style={{ flex:1 }} onClick={submit}>Save Entry</button>
              <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
