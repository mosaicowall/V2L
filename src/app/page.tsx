'use client';

import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [isLive, setIsLive] = useState(false);
  const [logs, setLogs] = useState<string[]>(['[10:52:01] System Initialized', '[10:52:05] Ready for transmission']);
  const [activeTab, setActiveTab] = useState('stream');

  const toggleStream = () => {
    setIsLive(!isLive);
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${time}] ${!isLive ? 'Establishing RTMP connection...' : 'Terminating stream sequence'}`]);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar navigation */}
      <aside className="sidebar glass">
        <div className="brand-container">
          <h1 className="brand gradient-text">V2L 📡</h1>
          <span className="version">V6.1 WEB</span>
        </div>
        
        <nav className="nav-menu">
          <button className={`nav-item ${activeTab === 'stream' ? 'active' : ''}`} onClick={() => setActiveTab('stream')}>
            Dashboard
          </button>
          <button className={`nav-item ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>
            Content Vault
          </button>
          <button className={`nav-item ${activeTab === 'sales' ? 'active' : ''}`} onClick={() => setActiveTab('sales')}>
            Sales Tracker
          </button>
          <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            Settings
          </button>
        </nav>

        <div className="user-profile card">
          <div className="avatar">JD</div>
          <div className="user-info">
            <p className="user-name">Professional User</p>
            <p className="user-plan">Enterprise Plan</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="dashboard-header glass">
          <div className="header-left">
            <h2>Welcome back, Producer</h2>
            <p className="text-dim">Your streaming pipeline is stable.</p>
          </div>
          <div className="header-right">
            <div className="status-badge glass">
              <span className={isLive ? 'live-indicator' : 'offline-indicator'}></span>
              <span className="status-text">{isLive ? 'LIVE' : 'OFFLINE'}</span>
            </div>
          </div>
        </header>

        {activeTab === 'stream' && (
          <div className="grid-container">
            {/* Live Monitor */}
            <section className="card monitor-card">
              <h3>Live Monitor</h3>
              <div className="monitor-screen">
                {isLive ? (
                  <div className="live-view">
                    <div className="bitrate-overlay">4500kbps</div>
                    <p>Now Streaming: Sales_Training_v2.mp4</p>
                  </div>
                ) : (
                  <div className="idle-view">
                    <p>No active transmission</p>
                  </div>
                )}
              </div>
              <div className="controls">
                <button className={`btn-primary ${isLive ? 'stop' : 'start'}`} onClick={toggleStream}>
                  {isLive ? 'STOP STREAM' : 'START LIVE STREAM'}
                </button>
                <button className="btn-secondary">ADD VIDEOS</button>
              </div>
            </section>

            {/* Quick Metrics */}
            <section className="metrics-row">
              <div className="card metric">
                <span className="metric-label">Daily Views</span>
                <span className="metric-value">12.4k</span>
                <span className="metric-trend green">+12%</span>
              </div>
              <div className="card metric">
                <span className="metric-label">Sales Leads</span>
                <span className="metric-value">84</span>
                <span className="metric-trend green">+8%</span>
              </div>
              <div className="card metric">
                <span className="metric-label">Active Subs</span>
                <span className="metric-value">1,204</span>
                <span className="metric-trend green">+2%</span>
              </div>
            </section>

            {/* Logs Terminal */}
            <section className="card logs-card">
              <h3>Engine Logs</h3>
              <div className="logs-terminal">
                {logs.map((log, i) => (
                  <div key={i} className="log-line">{log}</div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="content-vault card">
            <h3>Sales Content Vault</h3>
            <div className="content-grid">
              <div className="content-item glass">
                <span className="icon">📄</span>
                <h4>Sales Script v4</h4>
                <p>High-conversion DM script</p>
              </div>
              <div className="content-item glass">
                <span className="icon">🎓</span>
                <h4>Closing Masterclass</h4>
                <p>Advanced techniques module</p>
              </div>
              <div className="content-item glass">
                <span className="icon">🎬</span>
                <h4>Broll Assets</h4>
                <p>Premium lifestyle clips</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background: var(--background);
        }

        .sidebar {
          width: 280px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          border-radius: 0;
          border-right: 1px solid var(--border);
        }

        .brand-container {
          margin-bottom: 48px;
        }

        .brand {
          font-size: 2rem;
          font-weight: 700;
        }

        .version {
          font-size: 0.7rem;
          color: var(--text-dim);
          letter-spacing: 1px;
        }

        .nav-menu {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-item {
          background: transparent;
          border: none;
          color: var(--text-dim);
          padding: 12px 16px;
          text-align: left;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }

        .nav-item:hover, .nav-item.active {
          background: var(--surface);
          color: white;
        }

        .nav-item.active {
          border-left: 3px solid var(--accent-pink);
        }

        .user-profile {
          margin-top: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
        }

        .avatar {
          width: 40px;
          height: 40px;
          background: var(--accent-pink);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 600;
        }

        .user-plan {
          font-size: 0.75rem;
          color: var(--text-dim);
        }

        .main-content {
          flex: 1;
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          overflow-y: auto;
        }

        .dashboard-header {
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
        }

        .offline-indicator {
          width: 10px;
          height: 10px;
          background: #3a3a3c;
          border-radius: 50%;
        }

        .grid-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 32px;
        }

        .monitor-card {
          grid-column: 1 / 2;
        }

        .monitor-screen {
          height: 300px;
          background: black;
          border-radius: 12px;
          margin: 16px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          position: relative;
        }

        .bitrate-overlay {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.6);
          padding: 4px 8px;
          font-size: 0.7rem;
          border-radius: 4px;
          color: var(--accent-green);
        }

        .controls {
          display: flex;
          gap: 12px;
        }

        .btn-primary {
          flex: 2;
          padding: 14px;
          border-radius: 8px;
          border: none;
          font-weight: bold;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .btn-primary.start { background: var(--accent-green); color: black; }
        .btn-primary.stop { background: var(--accent-pink); color: white; }

        .btn-secondary {
          flex: 1;
          background: var(--surface);
          color: white;
          padding: 14px;
          border-radius: 8px;
          border: 1px solid var(--border);
          cursor: pointer;
        }

        .metrics-row {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .metric {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .metric-label { font-size: 0.8rem; color: var(--text-dim); }
        .metric-value { font-size: 1.5rem; font-weight: bold; }
        .metric-trend.green { color: var(--accent-green); font-size: 0.8rem; }

        .logs-card {
          grid-column: 1 / 3;
        }

        .logs-terminal {
          background: black;
          padding: 16px;
          border-radius: 8px;
          font-family: 'Consolas', monospace;
          font-size: 0.85rem;
          color: var(--accent-green);
          height: 200px;
          overflow-y: auto;
          margin-top: 12px;
        }

        .log-line { margin-bottom: 4px; }

        .content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 24px;
        }

        .content-item {
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .content-item:hover { transform: translateY(-5px); }
        .content-item .icon { font-size: 2rem; display: block; margin-bottom: 12px; }

        @media (max-width: 1024px) {
          .grid-container { grid-template-columns: 1fr; }
          .metrics-row { flex-direction: row; }
          .logs-card { grid-column: 1 / 2; }
        }

        @media (max-width: 768px) {
          .dashboard-container { flex-direction: column; }
          .sidebar { width: 100%; border-right: none; border-bottom: 1px solid var(--border); padding: 16px; }
          .brand-container { margin-bottom: 16px; display: flex; align-items: baseline; gap: 10px; }
          .nav-menu { flex-direction: row; overflow-x: auto; padding-bottom: 8px; }
          .nav-item { white-space: nowrap; padding: 8px 12px; }
          .main-content { padding: 20px; }
          .dashboard-header { flex-direction: column; align-items: flex-start; gap: 16px; }
          .metrics-row { flex-direction: column; }
          .monitor-screen { height: 200px; }
          .user-profile { display: none; }
        }
      `}</style>
    </div>
  );
}
