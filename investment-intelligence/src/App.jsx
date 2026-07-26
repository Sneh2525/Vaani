import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, BookOpen, PenLine, Shield, Globe,
  Zap, BarChart3, Brain, Menu, X
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
import Scenarios from './pages/Scenarios';

const NAV_ITEMS = [
  { to: '/', icon: <LayoutDashboard size={14} />, label: 'Dashboard' },
  { to: '/watchlist', icon: <TrendingUp size={14} />, label: 'Analysis' },
  { to: '/portfolio', icon: <BarChart3 size={14} />, label: 'Portfolio' },
  { to: '/macro', icon: <Globe size={14} />, label: 'Macro' },
  { to: '/notes', icon: <PenLine size={14} />, label: 'Decisions' },
  { to: '/rules', icon: <Shield size={14} />, label: 'Rules' },
  { to: '/diary', icon: <BookOpen size={14} />, label: 'Strategy' },
  { to: '/scenarios', icon: <Brain size={14} />, label: 'Scenarios' },
  { to: '/alt-data', icon: <Zap size={14} />, label: 'Alt Data' },
  { to: '/agentic', icon: <Zap size={14} />, label: 'Agentic' },
];

function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="top-nav">
      <div className="top-nav-brand">
        <span className="brand-sub"><strong>Vaani</strong></span>
      </div>
      <div className="top-nav-sep" />
      <div className={`top-nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `top-nav-link${isActive ? ' active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
      <div className="top-nav-status">
        <span className="live-dot" />
        <span>Live · NSE · {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </nav>
  );
}

function NotFound() {
  return (
    <div className="empty-state" style={{ paddingTop: 120 }}>
      <h3 style={{ fontSize: 48, fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: 16 }}>404</h3>
      <p style={{ fontSize: 16, marginBottom: 24 }}>Page not found</p>
      <Link to="/" className="btn btn-primary">← Back to Dashboard</Link>
    </div>
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
              <Route path="/scenarios" element={<Scenarios />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
