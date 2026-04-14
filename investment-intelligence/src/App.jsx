import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, BookOpen, PenLine, Shield, Globe,
  Zap, MessageCircle, Coins, Heart, AlertTriangle, BarChart3,
  Brain, Target
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Watchlist from './pages/Watchlist';
import StockDetail from './pages/StockDetail';
import DecisionNotes from './pages/DecisionNotes';
import StrategyDiary from './pages/StrategyDiary';
import RulesEngine from './pages/RulesEngine';
import Portfolio from './pages/Portfolio';
import MacroDashboard from './pages/MacroDashboard';
import AlternativeData from './pages/AlternativeData';
import AgenticMonitor from './pages/AgenticMonitor';
import NarrativeRisk from './pages/NarrativeRisk';
import Scenarios from './pages/Scenarios';
import TokenizedAssets from './pages/TokenizedAssets';
import FiscalHealth from './pages/FiscalHealth';
import RegulatoryIntel from './pages/RegulatoryIntel';
import LearningEngine from './pages/LearningEngine';

const NAV_ITEMS = [
  { to: '/', icon: <LayoutDashboard size={14} />, label: 'Dashboard' },
  { to: '/watchlist', icon: <TrendingUp size={14} />, label: 'Analysis' },
  { to: '/portfolio', icon: <BarChart3 size={14} />, label: 'Portfolio' },
  { to: '/macro', icon: <Globe size={14} />, label: 'Macro' },
  { to: '/notes', icon: <PenLine size={14} />, label: 'Decisions' },
  { to: '/rules', icon: <Shield size={14} />, label: 'Rules' },
  { to: '/diary', icon: <BookOpen size={14} />, label: 'Strategy' },
  { to: '/alt-data', icon: <Target size={14} />, label: 'Alt Data' },
  { to: '/agentic', icon: <Zap size={14} />, label: 'Agentic', badge: '3' },
  { to: '/narrative', icon: <MessageCircle size={14} />, label: 'Narrative' },
  { to: '/scenarios', icon: <Brain size={14} />, label: 'Scenarios' },
  { to: '/regulatory', icon: <AlertTriangle size={14} />, label: 'Regulatory' },
  { to: '/fiscal', icon: <Heart size={14} />, label: 'Fiscal' },
  { to: '/tokenized', icon: <Coins size={14} />, label: 'Tokenized' },
  { to: '/learning', icon: <Brain size={14} />, label: 'Learning' },
];

function TopNav() {
  return (
    <nav className="top-nav">
      <div className="top-nav-brand">
        <span className="brand-sub"><strong>Vaani</strong></span>
      </div>
      <div className="top-nav-sep" />
      <div className="top-nav-links">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `top-nav-link${isActive ? ' active' : ''}`}
          >
            {item.label}
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </div>
      <div className="top-nav-status">
        <span className="live-dot" />
        <span>Live · NSE · {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <TopNav />
        <div className="main-content">
          <div className="page-content animate-in">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/stock/:ticker" element={<StockDetail />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/macro" element={<MacroDashboard />} />
              <Route path="/notes" element={<DecisionNotes />} />
              <Route path="/diary" element={<StrategyDiary />} />
              <Route path="/rules" element={<RulesEngine />} />
              <Route path="/alt-data" element={<AlternativeData />} />
              <Route path="/agentic" element={<AgenticMonitor />} />
              <Route path="/narrative" element={<NarrativeRisk />} />
              <Route path="/scenarios" element={<Scenarios />} />
              <Route path="/tokenized" element={<TokenizedAssets />} />
              <Route path="/fiscal" element={<FiscalHealth />} />
              <Route path="/regulatory" element={<RegulatoryIntel />} />
              <Route path="/learning" element={<LearningEngine />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
