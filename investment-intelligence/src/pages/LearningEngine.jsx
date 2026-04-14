import { useState, useEffect } from 'react';
const API = 'http://localhost:3001/api';

export default function LearningEngine() {
  const [notes, setNotes] = useState([]);
  const [diary, setDiary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/notes`).then(r => r.json()),
      fetch(`${API}/diary`).then(r => r.json()),
    ]).then(([n, d]) => { setNotes(Array.isArray(n) ? n : []); setDiary(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const reviewed = notes.filter(n => n.review);
  const winRate = reviewed.length > 0 ? (reviewed.filter(n => (n.review?.actual_return || 0) > 0).length / reviewed.length * 100).toFixed(0) : null;

  const evolutionStages = [
    { stage:'Stage 1', title:'Manual IF-THEN Rules', timeframe:'Month 1-6', status:'ACTIVE', desc:'Explicit rules coded in Python/logic — this is what you are building now', color:'var(--accent-green)' },
    { stage:'Stage 2', title:'Scoring Models', timeframe:'Month 6-12', status:'PENDING', desc:'Weighted inputs, regression on outcomes from your 50+ decision notes', color:'var(--accent-amber)' },
    { stage:'Stage 3', title:'Decision Trees', timeframe:'Year 2', status:'PENDING', desc:'Trained on your reviewed decision notes — pattern recognition', color:'var(--text-muted)' },
    { stage:'Stage 4', title:'ML Classifiers', timeframe:'Year 2-3', status:'PENDING', desc:'XGBoost / Random Forest on outcomes vs features — your hand-written rules are the training labels', color:'var(--text-muted)' },
    { stage:'Stage 5', title:'LLM-Assisted', timeframe:'Year 3+', status:'PENDING', desc:'Claude/GPT analyzes diary, suggests rule updates based on patterns', color:'var(--text-muted)' },
  ];

  const biasesMined = [...new Set(diary.flatMap(e => {
    const biases = [];
    if (e.lesson?.toLowerCase().includes('panic')) biases.push('Panic Selling');
    if (e.lesson?.toLowerCase().includes('fomo')) biases.push('FOMO');
    if (e.lesson?.toLowerCase().includes('anchor')) biases.push('Anchoring');
    if (e.lesson?.toLowerCase().includes('confir')) biases.push('Confirmation Bias');
    if (e.mood === 'GREEDY') biases.push('Greed/Euphoria');
    return biases;
  }))];

  if (loading) return <div className="loader"><div className="spinner"/></div>;

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Learning Engine</div>
          <div className="section-sub">Compounding intelligence — every decision makes the next one smarter</div>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="stat-grid" style={{ marginBottom:24 }}>
        <div className="stat-tile"><div className="stat-tile-label">Decision Notes</div><div className="stat-tile-value" style={{ color:'var(--accent-blue)' }}>{notes.length}</div><div className="stat-tile-change change-neutral">50+ = ML input ready</div></div>
        <div className="stat-tile"><div className="stat-tile-label">Reviews Completed</div><div className="stat-tile-value" style={{ color:'var(--accent-purple)' }}>{reviewed.length}</div><div className="stat-tile-change change-neutral">of {notes.length} notes</div></div>
        <div className="stat-tile"><div className="stat-tile-label">Diary Entries</div><div className="stat-tile-value" style={{ color:'var(--accent-cyan)' }}>{diary.length}</div><div className="stat-tile-change change-neutral">6+ months = AI analysis ready</div></div>
        <div className="stat-tile">
          <div className="stat-tile-label">Win Rate</div>
          <div className="stat-tile-value" style={{ color: winRate >= 40 ? 'var(--accent-green)' : 'var(--accent-red)' }}>{winRate !== null ? `${winRate}%` : '—'}</div>
          <div className="stat-tile-change change-neutral">Target: &gt;40% over 12M</div>
        </div>
      </div>

      {/* Evolution Path */}
      <div className="card" style={{ marginBottom:20 }}>
        <div className="card-title" style={{ marginBottom:16 }}>🚀 Evolution Path — Manual Rules → ML</div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {evolutionStages.map((s, i) => (
            <div key={i} style={{ display:'flex', gap:16, alignItems:'flex-start', padding:'16px', background:'var(--bg-dark)', borderRadius:10, border:`1px solid ${s.status === 'ACTIVE' ? s.color + '44' : 'var(--border)'}` }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:`${s.color}22`, border:`2px solid ${s.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:12, color:s.color, flexShrink:0 }}>{i+1}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:4 }}>
                  <span style={{ fontWeight:700 }}>{s.title}</span>
                  <span style={{ fontSize:10, color:'var(--text-muted)' }}>{s.timeframe}</span>
                  {s.status === 'ACTIVE' && <span className="tag tag-green">ACTIVE NOW</span>}
                </div>
                <div style={{ fontSize:12, color:'var(--text-secondary)' }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        {/* Mined Biases */}
        <div className="card">
          <div className="card-title" style={{ marginBottom:14 }}>🧠 Biases Detected from Diary</div>
          {biasesMined.length > 0 ? (
            biasesMined.map((b, i) => (
              <div key={i} style={{ padding:'10px 14px', background:'rgba(239,68,68,0.05)', borderRadius:8, border:'1px solid rgba(239,68,68,0.15)', marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, fontWeight:600 }}>{b}</span>
                <span className="tag tag-red">DETECTED</span>
              </div>
            ))
          ) : (
            <div style={{ fontSize:13, color:'var(--text-muted)', textAlign:'center', padding:20 }}>More diary entries needed for bias detection. Keep writing.</div>
          )}
        </div>

        {/* Key Principle */}
        <div className="card" style={{ background:'rgba(79,142,255,0.04)', border:'1px solid rgba(79,142,255,0.2)' }}>
          <div className="card-title" style={{ marginBottom:14, color:'var(--accent-blue)' }}>⚡ The Critical Principle</div>
          <div style={{ fontSize:14, lineHeight:2, color:'var(--text-secondary)' }}>
            Your hand-written IF-THEN rules from Stage 1 are <strong style={{ color:'var(--text-primary)' }}>the training labels</strong> for Stage 4 ML.<br/><br/>
            Never skip the manual phase thinking the AI will figure it out.<br/><br/>
            <strong style={{ color:'var(--accent-blue)' }}>The AI needs your human judgment first. Then it can scale it.</strong><br/><br/>
            One decision note per week beats a perfect system that never gets used.<br/>
            <strong style={{ color:'var(--accent-green)' }}>Ship the MVP. Use it. The learning compounds. The system gets smarter. So do you.</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
