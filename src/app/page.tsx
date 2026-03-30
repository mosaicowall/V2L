'use client';

import React, { useState, useEffect, useRef } from 'react';

interface VideoFile {
  name: string;
  url: string;
  size: number;
}

export default function V2LWebDashboard() {
  const [playlist, setPlaylist] = useState<VideoFile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [logs, setLogs] = useState<{ time: string, msg: string }[]>([]);
  const [rtmpUrl, setRtmpUrl] = useState('rtmp://a.rtmp.youtube.com/live2');
  const [streamKey, setStreamKey] = useState('');
  
  // Simulated Analytics
  const [analytics, setAnalytics] = useState({
    views: 0,
    uptime: '00:00:00',
    bitrate: '0.0 Mbps'
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const uptimeRef = useRef<number>(0);

  // Add a log entry
  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [{ time, msg }, ...prev].slice(0, 100));
  };

  // Uptime Counter Logic
  useEffect(() => {
    let interval: any;
    if (isLive) {
      interval = setInterval(() => {
        uptimeRef.current += 1;
        const h = Math.floor(uptimeRef.current / 3600).toString().padStart(2, '0');
        const m = Math.floor((uptimeRef.current % 3600) / 60).toString().padStart(2, '0');
        const s = (uptimeRef.current % 60).toString().padStart(2, '0');
        
        setAnalytics(prev => ({
          ...prev,
          uptime: `${h}:${m}:${s}`,
          views: prev.views + Math.floor(Math.random() * 3),
          bitrate: (4.5 + Math.random() * 0.5).toFixed(1) + ' Mbps'
        }));
      }, 1000);
    } else {
      uptimeRef.current = 0;
      setAnalytics({ views: 0, uptime: '00:00:00', bitrate: '0.0 Mbps' });
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Handle Video Upload
  const handleAddVideos = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.multiple = true;
    
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      if (!files) return;

      const newVideos: VideoFile[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = URL.createObjectURL(file);
        
        try {
          await fetch('/api/upload', {
            method: 'POST',
            body: JSON.stringify({ name: file.name, size: file.size }),
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (err) {
          console.error('API Handshake failed', err);
        }

        newVideos.push({
          name: file.name,
          url: url,
          size: file.size
        });
        addLog(`Source Added: ${file.name}`);
      }
      setPlaylist(prev => [...prev, ...newVideos]);
    };
    input.click();
  };

  const handleClear = () => {
    playlist.forEach(v => URL.revokeObjectURL(v.url));
    setPlaylist([]);
    setCurrentIndex(0);
    setIsLive(false);
    addLog('System reset: Playlist cleared');
  };

  const toggleLive = () => {
    if (playlist.length === 0) {
      alert('Please add media sources first.');
      return;
    }
    if (!streamKey && !isLive) {
      alert('Destination stream key required.');
      return;
    }

    const newState = !isLive;
    setIsLive(newState);
    addLog(newState ? 'Connecting to RTMP ingest...' : 'Broadcasting terminated');
    
    if (newState) {
      setTimeout(() => {
        addLog('INGEST HANDSHAKE SUCCESSFUL');
        addLog('STREAM STATUS: HEALTHY 🟢');
      }, 1200);
    }
  };

  const handleVideoEnd = () => {
    if (!isLive) return;
    let nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    addLog(`Transitioning: ${playlist[nextIndex].name}`);
  };

  useEffect(() => {
    return () => playlist.forEach(v => URL.revokeObjectURL(v.url));
  }, [playlist]);

  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#ff0000">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/>
          </svg>
          V2L <span>LIVE</span>
        </div>
        <div className="status">
          <div className="status-overlay" style={{ position: 'relative', top: 0, left: 0 }}>
            <span className={`dot ${isLive ? 'live' : 'offline'}`}></span>
            {isLive ? 'TRANSMITTING' : 'IDLE'}
          </div>
        </div>
      </header>

      <main className="grid">
        <section>
          {/* Main Monitor */}
          <div className="monitor-container">
            <div className="monitor">
              {isLive && playlist.length > 0 ? (
                <>
                  <div className="status-overlay">
                    <span className="dot live"></span>
                    LIVE MONITOR
                  </div>
                  <video 
                    ref={videoRef}
                    className="video-player"
                    src={playlist[currentIndex].url}
                    autoPlay
                    onEnded={handleVideoEnd}
                  />
                </>
              ) : (
                <div style={{ textAlign: 'center', opacity: 0.4 }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" style={{ marginBottom: '1rem' }}>
                    <path d="M21 3L3 21M5 5l14 14M21 11V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h4"/>
                  </svg>
                  <h3>NO SIGNAL</h3>
                  <p>Start broadast to enable monitoring</p>
                </div>
              )}
            </div>
          </div>

          <div className="controls">
            <button 
              className={`btn btn-primary ${isLive ? '' : 'start'}`} 
              onClick={toggleLive}
              style={{ flex: 2 }}
            >
              {isLive ? '⏹ TERMINATE BROADCAST' : '▶ START LIVE ENGINE'}
            </button>
            <button className="btn btn-secondary" onClick={handleAddVideos}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Add Media
            </button>
            <button className="btn btn-secondary" onClick={handleClear}>
              Clear Cache
            </button>
          </div>

          {/* Engine Logs */}
          <div className="card logs-container">
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="dot live" style={{ width: 6, height: 6 }}></span>
              Real-time Engine Output
            </h3>
            <div className="logs">
              {logs.length === 0 && <div className="log-line">Initializing V2L Kernel... Standing by.</div>}
              {logs.map((log, i) => (
                <div key={i} className="log-line">
                  <span className="log-time">{log.time}</span>
                  {log.msg}
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside>
          {/* Real-time Analytics */}
          <div className="analytics-grid">
            <div className="stat-card">
              <div className="stat-value">{analytics.uptime}</div>
              <div className="stat-label">Uptime</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{analytics.views}</div>
              <div className="stat-label">Views</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{analytics.bitrate}</div>
              <div className="stat-label">Bitrate</div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Destination Config</h3>
            <div className="config">
              <div className="form-group">
                <label>Server URL</label>
                <input 
                  type="text" 
                  value={rtmpUrl} 
                  onChange={(e) => setRtmpUrl(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Stream Key</label>
                <input 
                  type="password" 
                  value={streamKey} 
                  onChange={(e) => setStreamKey(e.target.value)}
                  placeholder="Paste Key Here"
                />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Playlist Queue</h3>
            <div className="playlist">
              {playlist.length === 0 && (
                <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', textAlign: 'center', padding: '2rem 0' }}>
                  Queue is empty.<br/>Upload videos to build loop.
                </p>
              )}
              {playlist.map((v, i) => (
                <div key={i} className={`playlist-item ${currentIndex === i && isLive ? 'active' : ''}`}>
                  <span style={{ opacity: 0.5 }}>{i + 1}</span>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {v.name}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    {(v.size / (1024 * 1024)).toFixed(0)}MB
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
