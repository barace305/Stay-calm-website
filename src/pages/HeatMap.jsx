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
 * 3. Bottom panel showing recent incidents
 * 4. 90-minute auto-scrub on incident data
 *
 * FUTURE AUTH INTEGRATION:
 * Replace the authenticate() function with real auth provider
 * (Firebase Auth, Supabase Auth, NextAuth, JWT, etc.)
 */

// ─── DEMO CREDENTIALS ──────────────────────────────────────────────────────
// Replace with real authentication when ready
const DEMO_USERNAME = 'tone1234';
const DEMO_PASSWORD = 'tone1234';

// ─── METRO ATLANTA CENTER ───────────────────────────────────────────────────
const MAP_CENTER = [33.8490, -84.3000];
const MAP_ZOOM = 10;

// ─── HEAT LAYER CONFIG ──────────────────────────────────────────────────────
// Tuned for big cloud-like zones that merge when incidents cluster together
const HEAT_OPTIONS = {
  radius: 50,
  blur: 35,
  maxZoom: 14,
  max: 1.0,
  minOpacity: 0.25,
  gradient: {
    0.0:  'rgba(0, 0, 0, 0)',
    0.10: '#D4AF3715',
    0.20: '#D4AF3750',
    0.30: '#D4AF37',
    0.45: '#F59E0B',
    0.55: '#F97316',
    0.70: '#EF4444',
    0.85: '#DC2626',
    1.0:  '#991B1B',
  },
};

// ─── REFRESH INTERVAL (ms) ──────────────────────────────────────────────────
const REFRESH_INTERVAL = 60000; // Re-filter incidents every 60 seconds

// ─── CLOUD SPREAD CONFIG ────────────────────────────────────────────────────
// Each incident generates additional heat points around it to create
// cloud-like zones instead of hard dots. Higher severity = more spread.
const SPREAD_CONFIG = {
  High:   { count: 8, radius: 0.012 },   // ~0.8 mile cloud
  Medium: { count: 5, radius: 0.009 },   // ~0.6 mile cloud
  Low:    { count: 3, radius: 0.006 },   // ~0.4 mile cloud
};

// ─── SEEDED RANDOM ──────────────────────────────────────────────────────────
// Deterministic pseudo-random so cloud shapes don't jitter on re-render
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// ─── GENERATE CLOUD HEAT POINTS ─────────────────────────────────────────────
// Takes active incidents and generates a dense array of [lat, lng, intensity]
// with spread sub-points around each incident to create cloud-like heat zones.
function generateCloudHeatPoints(activeIncidents) {
  const points = [];

  activeIncidents.forEach((inc, idx) => {
    const baseIntensity = getSeverityIntensity(inc.severity);
    const ageMultiplier = getAgeDecay(inc.createdAt);
    const intensity = baseIntensity * ageMultiplier;

    // Center point — full intensity
    points.push([inc.latitude, inc.longitude, intensity]);

    // Spread points — create the cloud
    const spread = SPREAD_CONFIG[inc.severity] || SPREAD_CONFIG.Medium;
    for (let i = 0; i < spread.count; i++) {
      const seed = idx * 100 + i;
      const angle = (2 * Math.PI * i) / spread.count + seededRandom(seed) * 0.5;
      const dist = spread.radius * (0.35 + seededRandom(seed + 50) * 0.65);
      const subIntensity = intensity * (0.25 + seededRandom(seed + 99) * 0.35);

      points.push([
        inc.latitude + dist * Math.cos(angle),
        inc.longitude + dist * Math.sin(angle),
        subIntensity,
      ]);
    }

    // Extra inner ring for High severity — makes the core glow denser
    if (inc.severity === 'High') {
      for (let j = 0; j < 4; j++) {
        const seed2 = idx * 200 + j;
        const angle2 = (2 * Math.PI * j) / 4 + seededRandom(seed2 + 150) * 0.3;
        const dist2 = spread.radius * 0.25 * (0.5 + seededRandom(seed2 + 200) * 0.5);
        points.push([
          inc.latitude + dist2 * Math.cos(angle2),
          inc.longitude + dist2 * Math.sin(angle2),
          intensity * 0.8,
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

    // Simulate network delay for realism
    await new Promise((r) => setTimeout(r, 600));

    /**
     * FUTURE: Replace this block with real authentication.
     *
     * Example (Firebase):
     *   const userCredential = await signInWithEmailAndPassword(auth, email, password);
     *
     * Example (Supabase):
     *   const { data, error } = await supabase.auth.signInWithPassword({ email, password });
     *
     * Example (JWT API):
     *   const res = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
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
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/logo.png"
            alt="Stay Calm"
            className="h-[160px] w-auto object-contain drop-shadow-lg -my-10"
          />
        </div>

        {/* Title */}
        <h1 className="text-center text-white font-bold text-lg tracking-wide mb-1">
          PARTNER ACCESS
        </h1>
        <p className="text-center text-[#8AA3CC] text-sm mb-8">
          Sign in to view the live heat map
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#8AA3CC] mb-1.5 uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="heatmap-input w-full px-4 py-3 bg-[#0A1628] border border-[#1E3660] rounded-lg text-white placeholder-[#5C7EB5] focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#8AA3CC] mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="heatmap-input w-full px-4 py-3 bg-[#0A1628] border border-[#1E3660] rounded-lg text-white placeholder-[#5C7EB5] focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <p className="text-center text-red-400 text-sm font-medium animate-fade-in">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B8891E] text-[#060D18] font-bold text-sm rounded-lg hover:from-[#EFC94B] hover:to-[#D4AF37] transition-all duration-300 shadow-lg shadow-[#D4AF37]/10 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-[#5C7EB5] text-xs mt-8">
          © {new Date().getFullYear()} StayCalm.Today — Partner Portal
        </p>
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
  const [panelOpen, setPanelOpen] = useState(true);
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

    // Create map
    const map = L.map(mapContainerRef.current, {
      center: MAP_CENTER,
      zoom: MAP_ZOOM,
      zoomControl: true,
      attributionControl: true,
      // Touch optimization for mobile
      tap: true,
      touchZoom: true,
      dragging: true,
      bounceAtZoomLimits: true,
    });

    // CartoDB Dark Matter tiles — premium dark aesthetic
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://carto.com/">CARTO</a> | © <a href="https://osm.org/">OSM</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Position zoom controls
    map.zoomControl.setPosition('topright');

    mapInstanceRef.current = map;

    // Initial data load + heat layer
    const active = refreshIncidents();
    updateHeatLayer(map, active);

    // Cleanup
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

  // ─── Update heat layer on map ─────────────────────────────────────────
  function updateHeatLayer(map, activeList) {
    const L = window.L;
    if (!L || !L.heatLayer) return;

    // Remove existing heat layer
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }

    // Generate cloud-style heat data with spread sub-points
    const heatData = generateCloudHeatPoints(activeList);

    // Create new heat layer with cloud config
    const heat = L.heatLayer(heatData, HEAT_OPTIONS).addTo(map);
    heatLayerRef.current = heat;
  }

  // ─── Get icon SVG path for incident type ──────────────────────────────
  function getIncidentIcon(type) {
    switch (type) {
      case 'Multi-Vehicle Collision':
        return 'M13 10V3L4 14h7v7l9-11h-7z'; // Lightning bolt
      case 'Accident':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'; // Warning
      case 'Heavy Delay':
        return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'; // Clock
      case 'Disabled Vehicle':
        return 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'; // Circle
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'; // Info
    }
  }

  return (
    <div className="heatmap-container fixed inset-0 bg-[#060D18] font-sans antialiased overflow-hidden" style={{ height: '100dvh' }}>
      
      {/* ─── HEADER BAR ──────────────────────────────────────────────── */}
      <div className="heatmap-header fixed top-0 left-0 right-0 z-[1000] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Stay Calm" className="h-[60px] w-auto object-contain -my-4" />
          <div className="flex flex-col">
            <span className="text-white font-bold text-xs tracking-[0.15em] uppercase leading-none">
              Stay Calm Today
            </span>
            <span className="text-[#8AA3CC] text-[10px] tracking-wider uppercase mt-0.5">
              Partner Heat Map
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Live Indicator */}
          <div className="flex items-center gap-2 bg-[#0A1628]/80 px-3 py-1.5 rounded-full border border-[#1E3660]/50">
            <span className="live-dot" />
            <span className="text-[#22C55E] text-xs font-bold tracking-wider uppercase">
              Live
            </span>
          </div>

          {/* Incident Count */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#0A1628]/80 px-3 py-1.5 rounded-full border border-[#1E3660]/50">
            <span className="text-[#D4AF37] text-xs font-bold">{activeIncidents.length}</span>
            <span className="text-[#8AA3CC] text-[10px] uppercase tracking-wider">Active</span>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="text-[#5C7EB5] hover:text-[#D4AF37] transition-colors p-1.5"
            title="Sign out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* ─── MAP CONTAINER ───────────────────────────────────────────── */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 z-0"
        style={{ width: '100%', height: '100%' }}
      />

      {/* ─── BOTTOM PANEL ────────────────────────────────────────────── */}
      <div
        className={`heatmap-panel fixed bottom-0 left-0 right-0 z-[1000] rounded-t-2xl transition-transform duration-300 ease-out ${
          panelOpen ? 'translate-y-0' : 'translate-y-[calc(100%-48px)]'
        }`}
        style={{ maxHeight: '38vh' }}
      >
        {/* Handle / Toggle */}
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="w-full pt-3 pb-1 cursor-pointer focus:outline-none"
        >
          <div className="heatmap-panel-handle" />
        </button>

        {/* Panel Header */}
        <div className="px-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-bold text-xs tracking-[0.12em] uppercase">
              Recent Traffic Incidents
            </h2>
            <span className="bg-[#D4AF37]/15 text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-full">
              {activeIncidents.length}
            </span>
          </div>
          <span className="text-[#5C7EB5] text-[10px] uppercase tracking-wider">
            Last 90 min
          </span>
        </div>

        {/* Incident List */}
        <div className="heatmap-panel-scroll overflow-y-auto px-2 pb-4" style={{ maxHeight: 'calc(38vh - 80px)' }}>
          {activeIncidents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#5C7EB5] text-sm">No active incidents</p>
            </div>
          ) : (
            activeIncidents.map((inc) => (
              <div
                key={inc.id}
                className={`incident-row severity-${inc.severity.toLowerCase()} flex items-center gap-3 px-3 py-3 mx-1 mb-1 rounded-xl`}
              >
                {/* Icon */}
                <div className={`incident-icon ${inc.severity.toLowerCase()}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={getIncidentIcon(inc.type)}
                    />
                  </svg>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{inc.type}</p>
                  <p className="text-[#8AA3CC] text-xs truncate">{inc.location}</p>
                </div>

                {/* Meta */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`severity-badge ${inc.severity.toLowerCase()}`}>
                    {inc.severity}
                  </span>
                  <span className="text-[#5C7EB5] text-[10px] whitespace-nowrap">
                    {formatRelativeTime(inc.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ─── PWA INSTALL BANNER ──────────────────────────────────────── */}
      {showPwaBanner && (
        <div className="pwa-banner fixed z-[1100] left-4 right-4 rounded-xl px-4 py-3 flex items-center justify-between gap-3"
          style={{ bottom: panelOpen ? 'calc(38vh + 12px)' : '60px' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <p className="text-white text-xs leading-tight">
              <span className="font-semibold">Install Stay Calm Heatmap</span>
              <span className="text-[#8AA3CC]"> to your Home Screen for real-time tracking.</span>
            </p>
          </div>
          <button
            onClick={() => setShowPwaBanner(false)}
            className="text-[#5C7EB5] hover:text-white transition-colors shrink-0 p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
