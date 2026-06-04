import { useState, useEffect, useRef, useCallback } from 'react';
import {
  generateDemoIncidents,
  getActiveIncidents,
  getSeverityIntensity,
  getAgeDecay,
  formatRelativeTime,
  formatClockTime,
} from '../data/heatmapData';
import {
  adminDb,
  registerPendingPartner,
  createPasswordResetRequest,
  generateDeviceFingerprint,
  validateDeviceSecurity
} from '../data/adminData';
import '../styles/heatmap.css';

/**
 * Stay Calm — Futuristic Live Heat Map (Partner Demo Tool)
 *
 * Private page at /heatmap with:
 * 1. Login/Sign-up/Forgot Password gate (demo: tone1234 / tone1234)
 * 2. Device Fingerprint Logic (prevents account sharing, alerts system)
 * 3. Full-screen map with premium light map tiles (Voyager)
 * 4. Stable geographic neon radar target rings
 * 5. Collapsible mobile bottom sheet (always visible at bottom)
 */

const MAP_CENTER = [33.785, -84.385];
const MAP_ZOOM = 12;
const MAP_MIN_ZOOM = 10;
const MAP_MAX_ZOOM = 17;
const MAP_BOUNDS = [
  [33.55, -84.65],  // SW
  [34.15, -84.05],  // NE
];

const REFRESH_INTERVAL = 60000;

export default function HeatMap() {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem('sc_heatmap_auth') === 'true'
  );

  // Lock document body and viewport scrolling to prevent rubber-banding on iOS
  useEffect(() => {
    if (!authenticated) return;

    window.scrollTo(0, 0);

    const origOverflow = document.documentElement.style.overflow;
    const origBodyOverflow = document.body.style.overflow;
    const origBodyPos = document.body.style.position;
    const origBodyWidth = document.body.style.width;
    const origBodyHeight = document.body.style.height;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';

    return () => {
      document.documentElement.style.overflow = origOverflow;
      document.body.style.overflow = origBodyOverflow;
      document.body.style.position = origBodyPos;
      document.body.style.width = origBodyWidth;
      document.body.style.height = origBodyHeight;
    };
  }, [authenticated]);

  return authenticated ? (
    <MapDashboard onLogout={() => {
      sessionStorage.removeItem('sc_heatmap_auth');
      setAuthenticated(false);
    }} />
  ) : (
    <GateScreen onAuth={() => {
      sessionStorage.setItem('sc_heatmap_auth', 'true');
      setAuthenticated(true);
    }} />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH / REGISTRATION / RESET GATE SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function GateScreen({ onAuth }) {
  const [screen, setScreen] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Registration Form States
  const [regFullName, setRegFullName] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regPartnerType, setRegPartnerType] = useState('Tow Company');
  const [regPhone, setRegPhone] = useState('');
  const [regNotificationPhone, setRegNotificationPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regTerritory, setRegTerritory] = useState('');
  const [regUsername, setRegUsername] = useState('');

  // Forgot Password States
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPhone, setForgotPhone] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    await new Promise((r) => setTimeout(r, 600));

    // Verify credentials match in the global partners list
    const dbPartners = adminDb.getPartners();
    const match = dbPartners.find(
      (p) => p.username === username && p.password === password
    );

    if (match) {
      if (match.status === 'Pending Approval') {
        setError('Your account registration is still pending approval by administrators.');
        setLoading(false);
        return;
      }
      if (match.status === 'Suspended' || match.status === 'Declined') {
        setError('Access denied. Your account is currently suspended.');
        setLoading(false);
        return;
      }

      // Perform Device Fingerprint Security check
      const currentFingerprint = generateDeviceFingerprint();
      const securityCheck = validateDeviceSecurity(username, currentFingerprint, navigator.userAgent);

      if (securityCheck.allowed) {
        onAuth();
      } else {
        setError(securityCheck.reason);
        setLoading(false);
      }
    } else {
      setError('Invalid username or password. Please try again.');
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    await new Promise((r) => setTimeout(r, 600));

    try {
      registerPendingPartner({
        fullName: regFullName,
        companyName: regCompany,
        partnerType: regPartnerType,
        phone: regPhone,
        notificationPhone: regNotificationPhone,
        email: regEmail,
        territory: regTerritory,
        username: regUsername,
        password: '' // Assigned on approval
      });

      setSuccessMessage(
        'Your account request has been submitted. Stay Calm will review and approve authorized partners only.'
      );
      setScreen('login');
      // Reset signup fields
      setRegFullName('');
      setRegCompany('');
      setRegPhone('');
      setRegNotificationPhone('');
      setRegEmail('');
      setRegTerritory('');
      setRegUsername('');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    await new Promise((r) => setTimeout(r, 600));

    createPasswordResetRequest({
      usernameOrEmail: forgotEmail,
      phone: forgotPhone
    });

    setSuccessMessage(
      'Password reset request submitted. A Stay Calm administrator will review your request.'
    );
    setScreen('login');
    setForgotEmail('');
    setForgotPhone('');
    setLoading(false);
  };

  return (
    <div className="heatmap-login-bg min-h-screen flex items-center justify-center px-6 font-sans antialiased py-10">
      <div className="heatmap-login-card w-full max-w-md rounded-2xl p-8 animate-fade-in">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Stay Calm" className="h-[140px] w-auto object-contain drop-shadow-lg -my-8" />
        </div>

        {/* SCREEN TITLE */}
        {screen === 'login' && (
          <>
            <h1 className="text-center text-white font-bold text-lg tracking-wide mb-1">PARTNER ACCESS</h1>
            <p className="text-center text-[#8AA3CC] text-sm mb-6">Sign in to view the live heat map</p>
          </>
        )}
        {screen === 'signup' && (
          <>
            <h1 className="text-center text-white font-bold text-lg tracking-wide mb-1">PARTNER SIGN UP</h1>
            <p className="text-center text-[#8AA3CC] text-sm mb-6">Apply to join Stay Calm partner network</p>
          </>
        )}
        {screen === 'forgot' && (
          <>
            <h1 className="text-center text-white font-bold text-lg tracking-wide mb-1">RECOVER PASSWORD</h1>
            <p className="text-center text-[#8AA3CC] text-sm mb-6">Submit credential verification request</p>
          </>
        )}

        {/* FEEDBACK SYSTEM MESSAGES */}
        {error && <div className="p-3 bg-red-950/40 border border-red-500/30 rounded text-red-300 text-xs mb-4 text-center">{error}</div>}
        {successMessage && <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded text-emerald-300 text-xs mb-4 text-center">{successMessage}</div>}

        {/* SCREEN 1: LOGIN FORM */}
        {screen === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-medium text-[#8AA3CC] mb-1 uppercase tracking-wider">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username"
                className="heatmap-input w-full px-4 py-2.5 bg-[#0A1628] border border-[#1E3660] rounded-lg text-white placeholder-[#5C7EB5] focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
                placeholder="Enter username" />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#8AA3CC] mb-1 uppercase tracking-wider">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
                className="heatmap-input w-full px-4 py-2.5 bg-[#0A1628] border border-[#1E3660] rounded-lg text-white placeholder-[#5C7EB5] focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
                placeholder="Enter password" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8891E] text-[#060D18] font-bold text-sm rounded-lg hover:from-[#EFC94B] hover:to-[#D4AF37] transition-all duration-300 shadow-lg shadow-[#D4AF37]/10 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider">
              {loading ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>
        )}

        {/* SCREEN 2: SIGN UP FORM */}
        {screen === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-semibold text-[#8AA3CC] mb-0.5 uppercase">Full Name</label>
                <input type="text" value={regFullName} onChange={(e) => setRegFullName(e.target.value)} required
                  className="heatmap-input w-full px-3 py-2 bg-[#0A1628] border border-[#1E3660] rounded text-white text-xs" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-[9px] font-semibold text-[#8AA3CC] mb-0.5 uppercase">Company Name</label>
                <input type="text" value={regCompany} onChange={(e) => setRegCompany(e.target.value)} required
                  className="heatmap-input w-full px-3 py-2 bg-[#0A1628] border border-[#1E3660] rounded text-white text-xs" placeholder="Towing LLC" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-semibold text-[#8AA3CC] mb-0.5 uppercase">Partner Type</label>
                <select value={regPartnerType} onChange={(e) => setRegPartnerType(e.target.value)} className="heatmap-input w-full px-3 py-2 bg-[#0A1628] border border-[#1E3660] rounded text-white text-xs">
                  <option value="Tow Company">Tow Company</option>
                  <option value="Body Shop">Body Shop</option>
                  <option value="Chiropractor">Chiropractor</option>
                  <option value="Attorney">Attorney</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-semibold text-[#8AA3CC] mb-0.5 uppercase">Territory / City</label>
                <input type="text" value={regTerritory} onChange={(e) => setRegTerritory(e.target.value)} required
                  className="heatmap-input w-full px-3 py-2 bg-[#0A1628] border border-[#1E3660] rounded text-white text-xs" placeholder="Atlanta Core" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-semibold text-[#8AA3CC] mb-0.5 uppercase">Contact Phone</label>
                <input type="text" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} required
                  className="heatmap-input w-full px-3 py-2 bg-[#0A1628] border border-[#1E3660] rounded text-white text-xs" placeholder="404-555-0100" />
              </div>
              <div>
                <label className="block text-[9px] font-semibold text-[#8AA3CC] mb-0.5 uppercase">Alert Number</label>
                <input type="text" value={regNotificationPhone} onChange={(e) => setRegNotificationPhone(e.target.value)} required
                  className="heatmap-input w-full px-3 py-2 bg-[#0A1628] border border-[#1E3660] rounded text-white text-xs" placeholder="Notifications phone" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-semibold text-[#8AA3CC] mb-0.5 uppercase">Email Address</label>
                <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required
                  className="heatmap-input w-full px-3 py-2 bg-[#0A1628] border border-[#1E3660] rounded text-white text-xs" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-[9px] font-semibold text-[#8AA3CC] mb-0.5 uppercase">Desired Username</label>
                <input type="text" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} required
                  className="heatmap-input w-full px-3 py-2 bg-[#0A1628] border border-[#1E3660] rounded text-white text-xs" placeholder="username" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8891E] text-[#060D18] font-bold text-xs rounded hover:from-[#EFC94B] hover:to-[#D4AF37] transition-all disabled:opacity-50 uppercase tracking-wider mt-2">
              {loading ? 'Submitting Request...' : 'Submit Application'}
            </button>
          </form>
        )}

        {/* SCREEN 3: FORGOT PASSWORD FORM */}
        {screen === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-medium text-[#8AA3CC] mb-1 uppercase tracking-wider">Email or Username</label>
              <input type="text" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required
                className="heatmap-input w-full px-4 py-2.5 bg-[#0A1628] border border-[#1E3660] rounded-lg text-white placeholder-[#5C7EB5] focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
                placeholder="Enter email or username" />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#8AA3CC] mb-1 uppercase tracking-wider">Phone Number</label>
              <input type="text" value={forgotPhone} onChange={(e) => setForgotPhone(e.target.value)} required
                className="heatmap-input w-full px-4 py-2.5 bg-[#0A1628] border border-[#1E3660] rounded-lg text-white placeholder-[#5C7EB5] focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
                placeholder="Enter registered phone" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8891E] text-[#060D18] font-bold text-sm rounded-lg hover:from-[#EFC94B] hover:to-[#D4AF37] transition-all duration-300 shadow-lg disabled:opacity-50 uppercase tracking-wider">
              {loading ? 'Submitting Recovery...' : 'Request Password Reset'}
            </button>
          </form>
        )}

        {/* MULTI-FLOW LINK NAVIGATION ROW */}
        <div className="flex justify-between items-center text-xs mt-6 pt-4 border-t border-[#1E3660]/30">
          {screen === 'login' ? (
            <>
              <span className="text-[#5C7EB5] hover:text-[#D4AF37] cursor-pointer transition-colors" onClick={() => setScreen('signup')}>
                Apply/Sign Up
              </span>
              <span className="text-[#5C7EB5] hover:text-[#D4AF37] cursor-pointer transition-colors" onClick={() => setScreen('forgot')}>
                Forgot Password?
              </span>
            </>
          ) : (
            <span className="text-[#5C7EB5] hover:text-[#D4AF37] cursor-pointer transition-colors mx-auto" onClick={() => setScreen('login')}>
              ← Back to Login
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAP DASHBOARD MODULE
// ─────────────────────────────────────────────────────────────────────────────
function MapDashboard({ onLogout }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const headerRef = useRef(null);
  
  const [activeIncidents, setActiveIncidents] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 640);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  // Load and refresh active incident lists
  const refreshIncidents = useCallback(() => {
    const allIncidents = generateDemoIncidents();
    const active = getActiveIncidents(allIncidents);
    setActiveIncidents(active);
    return active;
  }, []);

  // Center on incident when clicked in list
  const handleIncidentClick = (inc) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([inc.latitude, inc.longitude], 15, {
        animate: true,
        duration: 0.8,
      });

      if (layerGroupRef.current) {
        layerGroupRef.current.eachLayer((layer) => {
          if (layer instanceof window.L.CircleMarker) {
            const latLng = layer.getLatLng();
            if (latLng.lat === inc.latitude && latLng.lng === inc.longitude) {
              layer.openPopup();
            }
          }
        });
      }

      if (isMobile) {
        setMobileExpanded(false);
      }
    }
  };

  // Re-draw futuristic radar ring targets and markers
  const updateHeatLayer = useCallback((map, activeList) => {
    const L = window.L;
    if (!L) return;

    if (!layerGroupRef.current) {
      layerGroupRef.current = L.layerGroup().addTo(map);
    } else {
      layerGroupRef.current.clearLayers();
    }

    const group = layerGroupRef.current;

    activeList.forEach((inc) => {
      const color = inc.severity === 'High' ? '#EF4444' : inc.severity === 'Medium' ? '#F97316' : '#F59E0B';
      const ageMultiplier = getAgeDecay(inc.createdAt);

      const baseRadius = inc.severity === 'High' ? 380 : inc.severity === 'Medium' ? 240 : 140;
      
      // 1. Radar Targeting Ring (Sharp neon border, soft internal glow)
      L.circle([inc.latitude, inc.longitude], {
        radius: baseRadius,
        color: color,
        weight: 2,
        opacity: 0.9 * ageMultiplier,
        fillColor: color,
        fillOpacity: 0.12 * ageMultiplier,
        className: 'radar-ring',
        interactive: false,
      }).addTo(group);

      // 2. Pulse target expansion ring
      L.circle([inc.latitude, inc.longitude], {
        radius: baseRadius * 1.5,
        color: color,
        weight: 1,
        fill: false,
        className: 'radar-ring-pulse',
        interactive: false,
      }).addTo(group);

      // 3. Central digital point marker
      const marker = L.circleMarker([inc.latitude, inc.longitude], {
        radius: 6,
        fillColor: '#FFFFFF',
        color: color,
        weight: 2,
        fillOpacity: 1.0,
        className: 'radar-dot',
      }).addTo(group);

      const popupContent = `
        <div class="heatmap-popup-card">
          <div class="popup-header">
            <span class="popup-title">${inc.type}</span>
            <span class="popup-badge ${inc.severity.toLowerCase()}">${inc.severity}</span>
          </div>
          <p class="popup-location">${inc.location}</p>
          <div class="popup-meta">
            <span>Reported ${formatClockTime(inc.createdAt)} (${formatRelativeTime(inc.createdAt)})</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'heatmap-leaflet-popup',
        closeButton: false,
        offset: [0, -4],
      });
    });
  }, []);

  // Native touch event handler on mobile panel header to bypass React 17+ event delegation blocks
  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    const handleHeaderTap = (e) => {
      if (window.innerWidth <= 640) {
        e.preventDefault();
        e.stopPropagation();
        setMobileExpanded((prev) => !prev);
      }
    };

    headerEl.addEventListener('click', handleHeaderTap);
    headerEl.addEventListener('touchstart', handleHeaderTap, { passive: false });

    return () => {
      headerEl.removeEventListener('click', handleHeaderTap);
      headerEl.removeEventListener('touchstart', handleHeaderTap);
    };
  }, [isMobile]);

  // Initialize Map
  useEffect(() => {
    const L = window.L;
    if (!L || !mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: MAP_CENTER,
      zoom: MAP_ZOOM,
      minZoom: MAP_MIN_ZOOM,
      maxZoom: MAP_MAX_ZOOM,
      maxBounds: MAP_BOUNDS,
      maxBoundsViscosity: 0.95,
      zoomControl: true,
      attributionControl: true,
      zoomSnap: 1,
      zoomDelta: 1,
      tap: true,
      touchZoom: true,
      dragging: true,
      bounceAtZoomLimits: true,
      inertia: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://carto.com/">CARTO</a> | © <a href="https://osm.org/">OSM</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    map.zoomControl.setPosition('topright');
    mapInstanceRef.current = map;

    const active = refreshIncidents();
    updateHeatLayer(map, active);

    const handleResize = () => {
      const mobile = window.innerWidth <= 640;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapInstanceRef.current = null;
      layerGroupRef.current = null;
    };
  }, [refreshIncidents, updateHeatLayer]);

  // Periodic Auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      const active = refreshIncidents();
      if (mapInstanceRef.current) {
        updateHeatLayer(mapInstanceRef.current, active);
      }
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [refreshIncidents, updateHeatLayer]);

  const getIncidentIconPath = (type) => {
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
  };

  const panelClass = isMobile
    ? `heatmap-side-panel ${mobileExpanded ? 'mobile-expanded' : ''}`
    : `heatmap-side-panel ${sidebarOpen ? '' : 'panel-closed'}`;

  return (
    <div className="heatmap-container fixed inset-0 bg-[#060D18] font-sans antialiased overflow-hidden flex flex-col" style={{ height: '100dvh' }}>

      {/* ─── HEADER BAR (Flex Block at the Top) ────────────────────── */}
      <div className="heatmap-header w-full shrink-0 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Stay Calm" className="h-[54px] w-auto object-contain -my-4" />
          <div className="flex flex-col">
            <span className="text-white font-bold text-xs tracking-[0.12em] uppercase leading-none">Stay Calm Today</span>
            <span className="text-[#8AA3CC] text-[9px] tracking-wider uppercase mt-0.5">Partner Heat Map</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#0A1628]/80 px-2.5 py-1 rounded-full border border-[#1E3660]/40">
            <span className="live-dot" />
            <span className="text-[#22C55E] text-[10px] font-bold tracking-wider uppercase">Live</span>
          </div>
          <div className="flex items-center gap-1 bg-[#0A1628]/80 px-2.5 py-1 rounded-full border border-[#1E3660]/40">
            <span className="text-[#D4AF37] text-[10px] font-bold">{activeIncidents.length}</span>
            <span className="text-[#8AA3CC] text-[9px] uppercase tracking-wider">Active</span>
          </div>
          <button onClick={onLogout} className="text-[#5C7EB5] hover:text-[#D4AF37] transition-colors p-1" title="Sign out">
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* ─── MAP & PANEL CONTAINER (Flex-1 below header) ───────────── */}
      <div className="relative flex-1 w-full overflow-hidden">
        {/* Map */}
        <div ref={mapContainerRef} className="absolute inset-0 z-0" style={{ width: '100%', height: '100%' }} />

        {/* Sidebar Toggle Button (Desktop Only) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`panel-toggle-btn ${sidebarOpen ? 'panel-is-open' : ''}`}
        >
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Sidebar / Mobile Bottom Sheet */}
        <div className={panelClass}>
          {/* Mobile swipe/drag handle */}
          <div className="mobile-drag-handle" />

          {/* Panel Header */}
          <div 
            ref={headerRef}
            className="px-4 pt-1.5 pb-2.5 flex items-center justify-between border-b border-[#1E3660]/20 cursor-pointer sm:cursor-default select-none"
          >
            <div className="flex items-center gap-2">
              <h2 className="text-white font-bold text-[10px] tracking-[0.1em] uppercase">
                Live Incidents
              </h2>
              <span className="bg-[#D4AF37]/15 text-[#D4AF37] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {activeIncidents.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#5C7EB5] text-[9px] uppercase tracking-wider">90m range</span>
              <button 
                className="text-[#5C7EB5] hover:text-white transition-colors p-1"
                style={{ pointerEvents: 'none' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileExpanded ? "M19 15l-7-7-7 7" : "M19 9l-7 7-7-7"} className="sm:hidden" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" className="hidden sm:inline" />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable list */}
          <div className="side-panel-scroll flex-1 overflow-y-auto px-2 py-2">
            {activeIncidents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#5C7EB5] text-sm">No active incidents</p>
              </div>
            ) : (
              activeIncidents.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => handleIncidentClick(inc)}
                  className={`incident-row severity-${inc.severity.toLowerCase()} flex items-center gap-2 px-2 py-2 mb-0.5 rounded-lg`}
                >
                  <div className={`incident-icon ${inc.severity.toLowerCase()}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={getIncidentIconPath(inc.type)} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold truncate leading-normal">{inc.type}</p>
                    <p className="text-[#8AA3CC] text-[10px] truncate leading-tight mt-0.5">{inc.location}</p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 shrink-0 pl-1">
                    <span className={`severity-badge ${inc.severity.toLowerCase()}`}>{inc.severity}</span>
                    <span className="text-[#5C7EB5] text-[8.5px] whitespace-nowrap mt-0.5">{formatRelativeTime(inc.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Panel Footer */}
          <div className="px-4 py-2 border-t border-[#1E3660]/20 text-center hidden sm:block">
            <p className="text-[#5C7EB5] text-[9px] uppercase tracking-wider">
              Stay Calm • Metro Atlanta Coverage
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
