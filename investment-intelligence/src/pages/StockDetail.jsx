import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
const API = 'http://localhost:3001/api';

function ScoreBadge({ signal }) {
  const map = { 'STRONG BUY': 'score-strong-buy', 'BUY': 'score-buy', 'WATCH': 'score-watch', 'AVOID': 'score-avoid', 'EXIT': 'score-exit' };
  return <span className={`score-badge ${map[signal] || 'score-watch'}`}>{signal}</span>;
}

export default function StockDetail() {
  const { ticker } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/scores/${ticker}`).then(r => r.json()).then(d => { setData(d); setLoading(false); }).catch(() => setLoading(false));
  }, [ticker]);

  if (loading) return <div className="loader"><div className="spinner"/></div>;
  if (!data) return <div className="empty-state"><p>Stock not found</p></div>;

  const { stock, fundamentals: f, scores: s, breakdowns, narrative, scenarios, historicalScores, redFlags } = data;
  
  const radarData = [
    { subject: 'Business', score: s?.businessScore },
    { subject: 'Valuation\n(inv)', score: 10 - (s?.valuationScore || 5) },
    { subject: 'Market', score: s?.marketScore },
    { subject: 'Sentiment\n(inv)', score: 10 - (s?.sentimentScore || 5) },
    { subject: 'Alt Data', score: s?.altDataScore },
  ];

  const getColor = (val) => val >= 7 ? 'var(--accent-green)' : val >= 5 ? 'var(--accent-amber)' : 'var(--accent-red)';

  const FrameworkBar = ({ label, val, tooltip }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
        <span style={{ fontSize:12, fontWeight:600 }}>{label}</span>
        <span style={{ fontSize:14, fontWeight:800, color:getColor(val) }}>{val}<span style={{ fontSize:10, color:'var(--text-muted)', fontWeight:400 }}>/10</span></span>
      </div>
      <div style={{ height:6, background:'rgba(255,255,255,0.05)', borderRadius:999, overflow:'hidden' }}>
        <div style={{ width:`${(val/10)*100}%`, height:'100%', background:getColor(val), borderRadius:999, transition:'width 0.8s ease' }}/>
      </div>
      {tooltip && <div style={{ fontSize:10, color:'var(--text-muted)', marginTop:4 }}>{tooltip}</div>}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <Link to="/watchlist" style={{ color:'var(--text-muted)', fontSize:12, textDecoration:'none', display:'flex', alignItems:'center', gap:4, marginBottom:12 }}>
          <ArrowLeft size={13}/> Back to Watchlist
        </Link>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div>
            <h1 style={{ fontSize:28, fontWeight:800 }}>{ticker}</h1>
            <div style={{ fontSize:15, color:'var(--text-secondary)', marginTop:2 }}>{stock?.name}</div>
            <div style={{ marginTop:8, display:'flex', gap:8 }}>
              <span className="tag tag-blue">{stock?.sector}</span>
              <span className="tag tag-purple">{stock?.industry}</span>
              <span className="tag tag-amber">MCap ₹{((stock?.market_cap||0)/100000).toFixed(0)}K Cr</span>
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:36, fontWeight:900, color:getColor(s?.composite) }}>{s?.composite}</div>
            <ScoreBadge signal={s?.signal} />
          </div>
        </div>
      </div>

      {/* Red Flags */}
      {redFlags?.length > 0 && (
        <div style={{ marginBottom:20 }}>
          {redFlags.map((f, i) => (
            <div key={i} className={`alert-banner alert-${f.level?.toLowerCase() === 'critical' ? 'critical' : 'high'}`}>
              <AlertTriangle size={13}/>
              <span className="alert-title">{f.text}</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid-2" style={{ marginBottom:20 }}>
        {/* Framework Scores */}
        <div className="card">
          <div className="card-title" style={{ marginBottom:20 }}>📊 5-Framework Breakdown</div>
          <FrameworkBar label="Framework 1 — Business Quality" val={s?.businessScore} tooltip="Revenue growth, margins, D/E, moat, management, industry lifecycle" />
          <FrameworkBar label="Framework 2 — Valuation Risk" val={s?.valuationScore} tooltip="High score = expensive. Low = margin of safety." />
          <FrameworkBar label="Framework 3 — Market Opportunity" val={s?.marketScore} tooltip="RBI cycle, FII/DII, VIX, GST, INR trend" />
          <FrameworkBar label="Framework 4 — Sentiment" val={s?.sentimentScore} tooltip="Fear/greed, promoter pledge, FII sentiment" />
          <FrameworkBar label="Framework 5 — Alternative Data" val={s?.altDataScore} tooltip="FASTag, job postings, app downloads, logistics — 2-3M lead time" />
        </div>

        {/* Radar */}
        <div className="card">
          <div className="card-title" style={{ marginBottom:16 }}>🎯 Radar Profile</div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(99,140,255,0.15)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill:'var(--text-muted)', fontSize:11 }} />
              <Radar name="Score" dataKey="score" stroke="#4f8eff" fill="#4f8eff" fillOpacity={0.15} strokeWidth={2} />
              <Tooltip contentStyle={{ background:'#0d1526', border:'1px solid rgba(99,140,255,0.2)', borderRadius:8 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom:20 }}>
        {/* Fundamentals */}
        <div className="card">
          <div className="card-title" style={{ marginBottom:14 }}>📋 Fundamentals</div>
          {[
            ['PE Ratio', f?.pe?.toFixed(1), 'x'],
            ['PB Ratio', f?.pb?.toFixed(1), 'x'],
            ['ROE', f?.roe?.toFixed(1), '%'],
            ['ROCE', f?.roce?.toFixed(1), '%'],
            ['Net Margin', f?.net_margin?.toFixed(1), '%'],
            ['Revenue Growth', f?.revenue_growth?.toFixed(1), '%'],
            ['D/E Ratio', f?.debt_equity?.toFixed(2), 'x'],
            ['Promoter Stake', f?.promoter_stake?.toFixed(1), '%'],
            ['Promoter Pledge', f?.promoter_pledge?.toFixed(1), '%'],
          ].map(([k, v, unit]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid rgba(99,140,255,0.06)', fontSize:12 }}>
              <span style={{ color:'var(--text-muted)' }}>{k}</span>
              <span style={{ fontWeight:700, color: k.includes('Pledge') && f?.promoter_pledge > 15 ? 'var(--accent-red)' : 'var(--text-primary)' }}>{v}{unit}</span>
            </div>
          ))}
        </div>

        {/* Narrative Risk */}
        <div className="card">
          <div className="card-title" style={{ marginBottom:14 }}>💬 Narrative Risk</div>
          {narrative ? (
            <>
              <div className={`narrative-card ${narrative.narrative_risk_score >= 7 ? 'narrative-high' : narrative.narrative_risk_score >= 5 ? 'narrative-medium' : 'narrative-low'}`} style={{ marginBottom:14 }}>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>DOMINANT NARRATIVE</div>
                <div style={{ fontSize:13, fontWeight:500 }}>"{narrative.dominant_narrative}"</div>
              </div>
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:3 }}>CONSENSUS LEVEL</div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ flex:1, height:5, background:'rgba(255,255,255,0.05)', borderRadius:999, overflow:'hidden' }}>
                    <div style={{ width:`${(narrative.consensus_level/10)*100}%`, height:'100%', background:narrative.consensus_level >= 7 ? 'var(--accent-red)':'var(--accent-amber)', borderRadius:999 }}/>
                  </div>
                  <span style={{ fontSize:12, fontWeight:700 }}>{narrative.consensus_level}/10</span>
                </div>
                <div style={{ fontSize:10, color:'var(--text-muted)', marginTop:3 }}>High consensus = high narrative break risk</div>
              </div>
              <div>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>SINGLE DESTRUCTION EVENT</div>
                <div style={{ fontSize:12, padding:'10px 12px', background:'rgba(239,68,68,0.06)', borderRadius:8, border:'1px solid rgba(239,68,68,0.15)' }}>{narrative.destruction_event}</div>
              </div>
              {narrative.crack_detected ? (
                <div style={{ marginTop:12, padding:'8px 12px', background:'rgba(239,68,68,0.1)', borderRadius:8, fontSize:12, color:'var(--accent-red)', fontWeight:600 }}>
                  ⚠️ Narrative crack detected — monitor closely
                </div>
              ) : null}
              <div style={{ marginTop:12 }}>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:4 }}>NARRATIVE RISK SCORE</div>
                <div style={{ fontSize:24, fontWeight:800, color: narrative.narrative_risk_score >= 7 ? 'var(--accent-red)' : 'var(--accent-amber)' }}>{narrative.narrative_risk_score}</div>
              </div>
            </>
          ) : <div style={{ color:'var(--text-muted)', fontSize:13 }}>No narrative data yet</div>}
        </div>

        {/* EV Scenarios */}
        <div className="card">
          <div className="card-title" style={{ marginBottom:14 }}>🎲 EV Scenarios</div>
          {scenarios ? (
            <>
              {[
                { label:'🟢 Bull Case', prob: scenarios.bull_prob, ret: scenarios.bull_return, target: scenarios.bull_target, color:'var(--accent-green)' },
                { label:'🔵 Base Case', prob: scenarios.base_prob, ret: scenarios.base_return, target: scenarios.base_target, color:'var(--accent-blue)' },
                { label:'🔴 Bear Case', prob: scenarios.bear_prob, ret: scenarios.bear_return, target: scenarios.bear_target, color:'var(--accent-red)' },
              ].map(sc => (
                <div key={sc.label} style={{ marginBottom:14, padding:'12px', background:'var(--bg-dark)', borderRadius:8, border:'1px solid var(--border)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontSize:12, fontWeight:600 }}>{sc.label}</span>
                    <span style={{ fontSize:12, color:'var(--text-muted)' }}>p={sc.prob}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontSize:11, color:'var(--text-muted)' }}>Target: ₹{sc.target}</span>
                    <span style={{ fontWeight:700, color:sc.color }}>{sc.ret > 0 ? '+' : ''}{sc.ret}%</span>
                  </div>
                </div>
              ))}
              <div style={{ padding:'12px', background:'rgba(79,142,255,0.08)', borderRadius:8, border:'1px solid rgba(79,142,255,0.2)' }}>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:3 }}>EXPECTED VALUE (PROBABILITY-WEIGHTED)</div>
                <div style={{ fontSize:22, fontWeight:800, color: scenarios.expected_value >= 5 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                  {scenarios.expected_value >= 0 ? '+' : ''}{scenarios.expected_value?.toFixed(1)}%
                </div>
              </div>
            </>
          ) : <div style={{ color:'var(--text-muted)', fontSize:13 }}>No EV scenarios defined yet. <Link to="/scenarios" style={{ color:'var(--accent-blue)' }}>Create one →</Link></div>}
        </div>
      </div>
    </div>
  );
}
