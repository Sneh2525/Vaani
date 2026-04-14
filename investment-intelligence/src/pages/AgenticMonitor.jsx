import { useState, useEffect } from 'react';
import { Zap, RefreshCw, AlertTriangle } from 'lucide-react';
const API = 'http://localhost:3001/api';

export default function AgenticMonitor() {
  const [briefing, setBriefing] = useState(null);
  const [triggers, setTriggers] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/agentic/briefing`).then(r => r.json()),
      fetch(`${API}/agentic/review-triggers`).then(r => r.json()),
    ]).then(([b, t]) => { setBriefing(b); setTriggers(t); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const urgencyColor = { CRITICAL:'var(--accent-red)', HIGH:'var(--accent-amber)', MEDIUM:'var(--accent-blue)' };
  const sentColor = { CALM:'var(--accent-green)', MODERATE:'var(--accent-amber)', STRESSED:'var(--accent-red)' };

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">⚡ Agentic Monitor — Phase 3.5</div>
          <div className="section-sub">Autonomous watchlist monitoring · Auto-triggered thesis reviews · Weekly intelligence briefing</div>
        </div>
        <button className="btn btn-primary" onClick={load}><RefreshCw size={13}/> Refresh</button>
      </div>

      {/* Explainer */}
      <div className="card" style={{ marginBottom:20, background:'rgba(124,92,255,0.05)', border:'1px solid rgba(124,92,255,0.2)' }}>
        <div style={{ fontSize:12, lineHeight:1.8, color:'var(--text-secondary)' }}>
          <strong style={{ color:'var(--accent-purple)' }}>This is Phase 3.5</strong> — sits between your current Phase 3 (Rules Engine) and Phase 4 (Sentiment NLP). The agentic layer watches your portfolio 24/7 against your IF-THEN rules, triggers thesis reviews automatically when conditions are breached, and generates a weekly intelligence briefing. Buildable today with LangChain + Claude API.
        </div>
      </div>

      {loading ? <div className="loader"><div className="spinner"/></div> : (
        <>
          {/* Auto-Triggered Reviews */}
          {triggers?.count > 0 && (
            <div className="card" style={{ marginBottom:20, border:'1px solid rgba(239,68,68,0.3)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                <AlertTriangle size={16} style={{ color:'var(--accent-red)' }}/>
                <div className="card-title">🚨 Auto-Triggered Thesis Reviews ({triggers.count})</div>
              </div>
              {triggers.triggers?.map((t, i) => (
                <div key={i} style={{ padding:'12px', background:'var(--bg-dark)', borderRadius:10, border:`1px solid ${urgencyColor[t.urgency]}44`, marginBottom:8 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <div style={{ fontWeight:700 }}>{t.ticker} <span style={{ fontSize:11, color:'var(--text-muted)', fontWeight:400 }}>— {t.trigger.replace(/_/g,' ')}</span></div>
                    <span style={{ fontSize:11, fontWeight:700, color:urgencyColor[t.urgency] }}>{t.urgency}</span>
                  </div>
                  <div style={{ fontSize:12, color:'var(--text-secondary)' }}>{t.recommendedAction}</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:4 }}>Current value: {t.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Weekly Briefing */}
          {briefing && (
            <div>
              <div className="card" style={{ marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                  <div className="card-title">📋 Weekly Intelligence Briefing</div>
                  <div style={{ fontSize:10, color:'var(--text-muted)' }}>Generated {new Date(briefing.generatedAt).toLocaleString('en-IN')}</div>
                </div>

                {/* Macro Snapshot */}
                <div style={{ display:'flex', gap:16, marginBottom:16, flexWrap:'wrap' }}>
                  {[
                    { label:'RBI Rate', value:`${briefing.weekSummary?.rbiRate}%`, color:'var(--accent-cyan)' },
                    { label:'India VIX', value:briefing.weekSummary?.indiaVix, color:briefing.weekSummary?.indiaVix < 15 ? 'var(--accent-green)' : 'var(--accent-amber)' },
                    { label:'FII Flow', value:`₹${(briefing.weekSummary?.fiiFlow/100)?.toFixed(0)}Cr`, color: briefing.weekSummary?.fiiFlow >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' },
                    { label:'Nifty PE', value:`${briefing.weekSummary?.niftyPE}x`, color:'var(--accent-purple)' },
                    { label:'Macro Mood', value:briefing.weekSummary?.macroSentiment, color:sentColor[briefing.weekSummary?.macroSentiment] },
                  ].map(s => (
                    <div key={s.label} style={{ padding:'10px 16px', background:'var(--bg-dark)', borderRadius:8, textAlign:'center' }}>
                      <div style={{ fontSize:9, color:'var(--text-muted)', marginBottom:3 }}>{s.label}</div>
                      <div style={{ fontSize:16, fontWeight:800, color:s.color }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* Agentic Insights */}
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:11, color:'var(--accent-purple)', fontWeight:700, marginBottom:8 }}>🤖 AGENTIC INSIGHTS</div>
                  {briefing.agenticInsight?.map((insight, i) => (
                    <div key={i} style={{ padding:'10px 14px', background:'rgba(124,92,255,0.06)', borderRadius:8, border:'1px solid rgba(124,92,255,0.15)', marginBottom:6, fontSize:13 }}>{insight}</div>
                  ))}
                </div>

                {/* Top Opportunities */}
                {briefing.topBuyOpportunities?.length > 0 && (
                  <div style={{ marginBottom:16 }}>
                    <div style={{ fontSize:11, color:'var(--accent-green)', fontWeight:700, marginBottom:8 }}>🎯 TOP BUY OPPORTUNITIES THIS WEEK</div>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      {briefing.topBuyOpportunities.map(o => (
                        <div key={o.ticker} style={{ padding:'8px 14px', background:'rgba(34,197,94,0.08)', borderRadius:8, border:'1px solid rgba(34,197,94,0.2)' }}>
                          <div style={{ fontWeight:700 }}>{o.ticker}</div>
                          <div style={{ fontSize:11, color:'var(--accent-green)' }}>{o.composite} · {o.signal}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Narrative Warnings */}
                {briefing.narrativeWarnings?.length > 0 && (
                  <div style={{ marginBottom:16 }}>
                    <div style={{ fontSize:11, color:'var(--accent-amber)', fontWeight:700, marginBottom:8 }}>⚠️ NARRATIVE WARNINGS</div>
                    {briefing.narrativeWarnings.map((n, i) => (
                      <div key={i} style={{ padding:'10px', background:'rgba(245,158,11,0.05)', borderRadius:8, border:'1px solid rgba(245,158,11,0.15)', marginBottom:6, fontSize:12 }}>
                        <strong>{n.ticker}</strong> — {n.narrative} <span style={{ color:'var(--accent-amber)', float:'right' }}>Risk: {n.riskScore}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Regulatory Highlights */}
                {briefing.regulatoryHighlights?.length > 0 && (
                  <div>
                    <div style={{ fontSize:11, color:'var(--accent-blue)', fontWeight:700, marginBottom:8 }}>🏛️ REGULATORY HIGHLIGHTS</div>
                    {briefing.regulatoryHighlights.map((r, i) => (
                      <div key={i} style={{ padding:'10px', background:'rgba(79,142,255,0.05)', borderRadius:8, border:'1px solid rgba(79,142,255,0.15)', marginBottom:6 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                          <span style={{ fontWeight:600, fontSize:12 }}>{r.title}</span>
                          <span className={`tag ${r.sentiment === 'POSITIVE' ? 'tag-green' : r.sentiment === 'NEGATIVE' ? 'tag-red' : 'tag-blue'}`}>{r.sentiment}</span>
                        </div>
                        <div style={{ fontSize:11, color:'var(--text-muted)' }}>{r.source} · {r.date} · Sectors: {r.sectors}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
