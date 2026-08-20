import { useState, useEffect } from 'react';
import { Zap, RefreshCw, AlertTriangle, Send, MessageCircle } from 'lucide-react';
const API = import.meta.env.VITE_API_URL || '/api';

export default function AgenticMonitor() {
  const [briefing, setBriefing] = useState(null);
  const [triggers, setTriggers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ role: 'assistant', text: 'Ask me about your watchlist, portfolio risk, macro conditions, or the signals on this page.' }]);

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/agentic/briefing`).then(r => r.json()),
      fetch(`${API}/agentic/review-triggers`).then(r => r.json()),
    ]).then(([b, t]) => { setBriefing(b); setTriggers(t); setLoading(false); }).catch(() => { setError(true); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const askCopilot = async (event) => {
    event.preventDefault();
    const question = chatInput.trim();
    if (!question || chatLoading) return;
    setChatInput('');
    setChatMessages(messages => [...messages, { role: 'user', text: question }]);
    setChatLoading(true);
    try {
      const response = await fetch(`${API}/agentic/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      const data = await response.json();
      setChatMessages(messages => [...messages, { role: 'assistant', text: data.answer || data.error || 'No response received.' }]);
    } catch {
      setChatMessages(messages => [...messages, { role: 'assistant', text: 'I could not reach the intelligence service. Check that the API server is running.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const urgencyColor = { CRITICAL:'var(--accent-red)', HIGH:'var(--accent-amber)', MEDIUM:'var(--accent-blue)' };
  const sentColor = { CALM:'var(--accent-green)', MODERATE:'var(--accent-amber)', STRESSED:'var(--accent-red)' };

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">⚡ Agentic Monitor</div>
          <div className="section-sub">Autonomous watchlist monitoring · Auto-triggered thesis reviews · Weekly intelligence briefing</div>
        </div>
        <button className="btn btn-primary" onClick={load}><RefreshCw size={13}/> Refresh</button>
      </div>

      <div className="card copilot-card" style={{ marginBottom:20 }}>
        <div className="card-header">
          <div>
            <div className="card-title"><MessageCircle size={16} /> Vaani Intelligence Hub</div>
            <div className="card-subtitle">Ask questions grounded in your live workspace data</div>
          </div>
        </div>
        <div className="copilot-messages">
          {chatMessages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`copilot-message copilot-${message.role}`}>
              {message.text}
            </div>
          ))}
          {chatLoading && <div className="copilot-message copilot-assistant">Thinking...</div>}
        </div>
        <form className="copilot-form" onSubmit={askCopilot}>
          <input className="form-input" value={chatInput} onChange={event => setChatInput(event.target.value)} placeholder="e.g. What is the biggest risk in my portfolio?" aria-label="Ask Vaani Intelligence Hub" />
          <button className="btn btn-primary" type="submit" disabled={chatLoading || !chatInput.trim()} aria-label="Send question"><Send size={14} /></button>
        </form>
      </div>

      {error ? (
        <div className="error-state">
          <AlertTriangle size={32} />
          <h3>Failed to load agentic data</h3>
          <p>Could not connect to the API server.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : loading ? <div className="loader"><div className="spinner"/></div> : (
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
