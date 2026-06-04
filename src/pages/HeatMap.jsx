import { useState, useEffect, useRef, useCallback } from 'react';
import {
  generateDemoIncidents,
  getActiveIncidents,
  getSeverityIntensity,
  getAgeDecay,
  formatRelativeTime,
} from '../data/heatmapData';
import '../styles/heatmap.css';

/**
 * Stay Calm — Live Heat Map (Partner Demo Tool)
 *
 * Private page at /heatmap with:
 * 1. Login gate (demo: tone1234 / tone1234)
 * 2. Full-screen Leaflet map with heat layer
 * 3. Floating glass sidebar showing recent incidents
 * 4. 90-minute auto-scrub on incident data
 *
 * FUTURE AUTH INTEGRATION:
 * Replace the authenticate() function with real auth provider
 * (Firebase Auth, Supabase Auth, NextAuth, JWT, etc.)
 */

// ─── DEMO CREDENTIALS ──────────────────────────────────────────────────────
const DEMO_USERNAME = 'tone1234';
const DEMO_PASSWORD = 'tone1234';

// ─── METRO ATLANTA MAP CONFIG ───────────────────────────────────────────────
// Tighter framing: centered on the Metro ATL core, zoomed in enough
// to show the perimeter clearly without drifting to all of Georgia.
const MAP_CENTER = [33.82, -84.33];
const MAP_ZOOM = 11;
const MAP_MIN_ZOOM = 9;
const MAP_MAX_ZOOM = 17;
// Constrain panning to Metro Atlanta region (no more scrolling to Florida)
const MAP_BOUNDS = [
  [33.40, -84.90],  // SW corner
  [34.20, -83.70],  // NE corner
];

// ─── HEAT LAYER CONFIG ──────────────────────────────────────────────────────
// Large radius + heavy blur = big glowing cloud zones that merge when
// incidents cluster. Gradient: amber outer glow → orange mid → crimson core.
const HEAT_OPTIONS = {
  radius: 55,
  blur: 40,
  maxZoom: 14,
  max: 1.0,
  minOpacity: 0.15,
  gradient: {
    0.0:  'transparent',
    0.15: '#D4AF37',
    0.30: '#EAB308',
    0.45: '#F59E0B',
    0.55: '#F97316',
    0.70: '#EF4444',
    0.85: '#DC2626',
    1.0:  '#991B1B',
  },
};

// ─── REFRESH INTERVAL (ms) ──────────────────────────────────────────────────
const REFRESH_INTERVAL = 60000;

// ─── CLOUD SPREAD CONFIG ────────────────────────────────────────────────────
// Generates sub-points around each incident so they look like glowing zones
// instead of hard dots. When clusters are close, their zones merge into one
// larger cloud that intensifies in color.
const SPREAD_CONFIG = {
  High:   { count: 6, radius: 0.010 },
  Medium: { count: 4, radius: 0.008 },
  Low:    { count: 2, radius: 0.005 },
};

// Deterministic pseudo-random so cloud shapes stay consistent
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate cloud heat points from active incidents
function generateCloudHeatPoints(activeIncidents) {
  const points = [];

  activeIncidents.forEach((inc, idx) => {
    const baseIntensity = getSeverityIntensity(inc.severity);
    const ageMultiplier = getAgeDecay(inc.createdAt);
    const intensity = baseIntensity * ageMultiplier;

    // Center point — full intensity
    points.push([inc.latitude, inc.longitude, intensity]);

    // Spread points — create the cloud zone
    const spread = SPREAD_CONFIG[inc.severity] || SPREAD_CONFIG.Medium;
    for (let i = 0; i < spread.count; i++) {
      const seed = idx * 100 + i;
      const angle = (2 * Math.PI * i) / spread.count + seededRandom(seed) * 0.4;
      const dist = spread.radius * (0.4 + seededRandom(seed + 50) * 0.6);
      const subIntensity = intensity * (0.3 + seededRandom(seed + 99) * 0.3);

      points.push([
        inc.latitude + dist * Math.cos(angle),
        inc.longitude + dist * Math.sin(angle),
        subIntensity,
      ]);
    }

    // Inner ring for High severity — denser glowing core
    if (inc.severity === 'High') {
      for (let j = 0; j < 3; j++) {
        const seed2 = idx * 200 + j;
        const angle2 = (2 * Math.PI * j) / 3 + seededRandom(seed2 + 150) * 0.3;
        const dist2 = spread.radius * 0.2;
        points.push([
          inc.latitude + dist2 * Math.cos(angle2),
          inc.longitude + dist2 * Math.sin(angle2),
          intensity * 0.85,
        ]);
      }
    }
  });

  return points;
}


export default function HeatMap() {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem('sc_heatmap_auth') === 'true'
  );

  return authenticated ? (
    <MapDashboard onLogout={() => {
      sessionStorage.removeItem('sc_heatmap_auth');
      setAuthenticated(false);
    }} />
  ) : (
    <LoginScreen onAuth={() => {
      sessionStorage.setItem('sc_heatmap_auth', 'true');
      setAuthenticated(true);
    }} />
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════

function LoginScreen({ onAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    await new Promise((r) => setTimeout(r, 600));

    /**
     * FUTURE: Replace with real auth (Firebase, Supabase, JWT, etc.)
     */
    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      onAuth();
    } else {
      setError('Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="heatmap-login-bg min-h-screen flex items-center justify-center px-6 font-sans antialiased">
      <div className="heatmap-login-card w-full max-w-sm rounded-2xl p-8 animate-fade-in">
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="Stay Calm" className="h-[160px] w-auto object-contain drop-shadow-lg -my-10" />
        </div>
        <h1 className="text-center text-white font-bold text-lg tracking-wide mb-1">PARTNER ACCESS</h1>
        <p className="text-center text-[#8AA3CC] text-sm mb-8">Sign in to view the live heat map</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#8AA3CC] mb-1.5 uppercase tracking-wider">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username"
              className="heatmap-input w-full px-4 py-3 bg-[#0A1628] border border-[#1E3660] rounded-lg text-white placeholder-[#5C7EB5] focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
              placeholder="Enter username" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#8AA3CC] mb-1.5 uppercase tracking-wider">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
              className="heatmap-input w-full px-4 py-3 bg-[#0A1628] border border-[#1E3660] rounded-lg text-white placeholder-[#5C7EB5] focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
              placeholder="Enter password" />
          </div>
          {error && <p className="text-center text-red-400 text-sm font-medium animate-fade-in">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B8891E] text-[#060D18] font-bold text-sm rounded-lg hover:from-[#EFC94B] hover:to-[#D4AF37] transition-all duration-300 shadow-lg shadow-[#D4AF37]/10 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider">
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>
        <p className="text-center text-[#5C7EB5] text-xs mt-8">© {new Date().getFullYear()} StayCalm.Today — Partner Portal</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAP DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

function MapDashboard({ onLogout }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const heatLayerRef = useRef(null);
  const [activeIncidents, setActiveIncidents] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 640);
  const [showPwaBanner, setShowPwaBanner] = useState(true);

  // ─── Load & refresh incident data ─────────────────────────────────────
  const refreshIncidents = useCallback(() => {
    const allIncidents = generateDemoIncidents();
    const active = getActiveIncidents(allIncidents);
    setActiveIncidents(active);
    return active;
  }, []);

  // ─── Initialize map ───────────────────────────────────────────────────
  useEffect(() => {
    const L = window.L;
    if (!L || !mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: MAP_CENTER,
      zoom: MAP_ZOOM,
      minZoom: MAP_MIN_ZOOM,
      maxZoom: MAP_MAX_ZOOM,
      maxBounds: MAP_BOUNDS,
      maxBoundsViscosity: 0.8,
      zoomControl: true,
      attributionControl: true,
      // Smooth zoom behavior
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 120,
      // Touch optimization
      tap: true,
      touchZoom: true,
      dragging: true,
      bounceAtZoomLimits: true,
      inertia: true,
      inertiaDeceleration: 3000,
    });

    // CartoDB Dark Matter tiles — premium dark aesthetic
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://carto.com/">CARTO</a> | © <a href="https://osm.org/">OSM</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    map.zoomControl.setPosition('topright');
    mapInstanceRef.current = map;

    // Initial data load + heat layer
    const active = refreshIncidents();
    updateHeatLayer(map, active);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      heatLayerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Auto-refresh every 60s ───────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const active = refreshIncidents();
      if (mapInstanceRef.current) {
        updateHeatLayer(mapInstanceRef.current, active);
      }
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [refreshIncidents]);

  // ─── Update heat layer ────────────────────────────────────────────────
  function updateHeatLayer(map, activeList) {
    const L = window.L;
    if (!L || !L.heatLayer) return;

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }

    const heatData = generateCloudHeatPoints(activeList);
    const heat = L.heatLayer(heatData, HEAT_OPTIONS).addTo(map);
    heatLayerRef.current = heat;
  }

  // ─── Incident icon SVG paths ──────────────────────────────────────────
  function getIncidentIcon(type) {
    switch (type) {
      case 'Multi-Vehicle Collision':
        return 'M13 10V3L4 14h7v7l9-11h-7z';
      case 'Accident':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z';
      case 'Heavy Delay':
        return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'Disabled Vehicle':
        return 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  return (
    <div className="heatmap-container fixed inset-0 bg-[#060D18] font-sans antialiased overflow-hidden" style={{ height: '100dvh' }}>

      {/* ─── HEADER BAR ──────────────────────────────────────────────── */}
      <div className="heatmap-header fixed top-0 left-0 right-0 z-[1000] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Stay Calm" className="h-[60px] w-auto object-contain -my-4" />
          <div className="flex flex-col">
            <span className="text-white font-bold text-xs tracking-[0.15em] uppercase leading-none">Stay Calm Today</span>
            <span className="text-[#8AA3CC] text-[10px] tracking-wider uppercase mt-0.5">Partner Heat Map</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0A1628]/80 px-3 py-1.5 rounded-full border border-[#1E3660]/50">
            <span className="live-dot" />
            <span className="text-[#22C55E] text-xs font-bold tracking-wider uppercase">Live</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#0A1628]/80 px-3 py-1.5 rounded-full border border-[#1E3660]/50">
            <span className="text-[#D4AF37] text-xs font-bold">{activeIncidents.length}</span>
            <span className="text-[#8AA3CC] text-[10px] uppercase tracking-wider">Active</span>
          </div>
          <button onClick={onLogout} className="text-[#5C7EB5] hover:text-[#D4AF37] transition-colors p-1.5" title="Sign out">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* ─── MAP ─────────────────────────────────────────────────────── */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0" style={{ width: '100%', height: '100%' }} />

      {/* ─── SIDEBAR TOGGLE BUTTON ───────────────────────────────────── */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`panel-toggle-btn ${sidebarOpen ? 'panel-is-open' : ''}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* ─── FLOATING SIDE PANEL ─────────────────────────────────────── */}
      <div className={`heatmap-side-panel ${sidebarOpen ? '' : 'panel-closed'}`}>
        {/* Panel Header */}
        <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-[#1E3660]/30">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-bold text-[11px] tracking-[0.12em] uppercase">
              Live Incidents
            </h2>
            <span className="bg-[#D4AF37]/15 text-[#D4AF37] text-[9px] font-bold px-2 py-0.5 rounded-full">
              {activeIncidents.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#5C7EB5] text-[9px] uppercase tracking-wider">90 min</span>
            {/* Close button (visible on all screens) */}
            <button onClick={() => setSidebarOpen(false)} className="text-[#5C7EB5] hover:text-white transition-colors p-1 -mr-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Incident List */}
        <div className="side-panel-scroll flex-1 overflow-y-auto px-2 py-2">
          {activeIncidents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#5C7EB5] text-sm">No active incidents</p>
            </div>
          ) : (
            activeIncidents.map((inc) => (
              <div
                key={inc.id}
                className={`incident-row severity-${inc.severity.toLowerCase()} flex items-center gap-2.5 px-2.5 py-2.5 mb-0.5 rounded-lg`}
              >
                <div className={`incident-icon ${inc.severity.toLowerCase()}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={getIncidentIcon(inc.type)} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{inc.type}</p>
                  <p className="text-[#8AA3CC] text-[10px] truncate leading-tight">{inc.location}</p>
                </div>
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <span className={`severity-badge ${inc.severity.toLowerCase()}`}>{inc.severity}</span>
                  <span className="text-[#5C7EB5] text-[9px] whitespace-nowrap">{formatRelativeTime(inc.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Panel Footer */}
        <div className="px-4 py-2.5 border-t border-[#1E3660]/30 text-center">
          <p className="text-[#5C7EB5] text-[9px] uppercase tracking-wider">
            Stay Calm • Metro Atlanta Coverage
          </p>
        </div>
      </div>

      {/* ─── PWA INSTALL BANNER (top-right toast) ────────────────────── */}
      {showPwaBanner && (
        <div className="pwa-banner fixed z-[1100] top-[62px] right-3 rounded-xl px-3 py-2.5 flex items-center gap-2.5 max-w-[280px]">
          <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <p className="text-[10px] leading-tight">
            <span className="text-white font-semibold">Install Heatmap</span>
            <span className="text-[#8AA3CC]"> for real-time tracking</span>
          </p>
          <button onClick={() => setShowPwaBanner(false)} className="text-[#5C7EB5] hover:text-white transition-colors shrink-0 p-0.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
