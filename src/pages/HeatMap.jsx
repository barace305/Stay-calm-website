import { useState, useEffect, useRef, useCallback } from 'react';
import {
  generateDemoIncidents,
  getActiveIncidents,
  getAgeDecay,
  formatRelativeTime,
  formatClockTime,
  fetchLiveHeatmapIncidents,
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
const MAP_MAX_ZOOM = 17;

const REFRESH_INTERVAL = 60000;

const HEATMAP_COPY = {
  demo: {
    eyebrow: 'Partner Heat Map',
    status: 'Demo',
    panelTitle: 'Sample Incidents',
    empty: 'No active sample incidents',
    footer: 'Sample data - Metro Atlanta Coverage',
  },
  live: {
    eyebrow: 'Partner Heat Map',
    status: 'Live',
    panelTitle: 'Live Incidents',
    empty: 'No active live incidents',
    footer: 'Live feed ready - Metro Atlanta Coverage',
  },
};

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getLiveIncidentIconPath(type) {
  switch (type) {
    case 'Traffic Incident':
    case 'Accident':
      return 'M12 9v3m0 4h.01M10.3 4.7 3.8 17a2 2 0 0 0 1.77 2.93h12.86A2 2 0 0 0 20.2 17L13.7 4.7a1.92 1.92 0 0 0-3.4 0Z';
    case 'Disabled Vehicle':
      return 'M5 16h14l-1.2-5.2A2.3 2.3 0 0 0 15.56 9H8.44a2.3 2.3 0 0 0-2.24 1.8L5 16Zm2 0v2m10-2v2M8 13h.01M16 13h.01M12 6v1m0-4v1';
    case 'Disabled Semi-Trailer':
      return 'M3 7h10v8H3V7Zm10 3h4l3 3v2h-7v-5ZM6 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm11 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z';
    case 'Vehicle Fire':
      return 'M12.2 2.5c.7 3-1.9 4.3-1.9 6.7 0 1.2.8 2.1 1.7 2.8-.1-1.6.9-3 2.2-4.2 1.4 1.7 2.8 3.6 2.8 6.1A5 5 0 0 1 7 14c0-3.3 2.3-5.1 5.2-11.5ZM9.8 17.2A2.2 2.2 0 0 0 12 19.5a2.2 2.2 0 0 0 2.2-2.3c0-1.2-.8-2.1-2.2-3.2-1.4 1.1-2.2 2-2.2 3.2Z';
    case 'Crash':
      return 'M2.5 16h7l-.8-3.3A2.2 2.2 0 0 0 6.56 11H5.44a2.2 2.2 0 0 0-2.14 1.7L2.5 16Zm12 0h7l-.8-3.3A2.2 2.2 0 0 0 18.56 11h-1.12a2.2 2.2 0 0 0-2.14 1.7L14.5 16ZM5 16v2m4-2v2m6-2v2m4-2v2M12 3.5v3M7.8 5.3 10 7.5m6.2-2.2L14 7.5M12 9v2';
    case 'Multi-Vehicle Collision':
      return 'M13 10V3L4 14h7v7l9-11h-7z';
    case 'Heavy Delay':
      return 'M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z';
    default:
      return 'M12 9v3m0 4h.01M10.3 4.7 3.8 17a2 2 0 0 0 1.77 2.93h12.86A2 2 0 0 0 20.2 17L13.7 4.7a1.92 1.92 0 0 0-3.4 0Z';
  }
}

function incidentSvgMarkup(type, className = '') {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="${getLiveIncidentIconPath(type)}"></path></svg>`;
}

function getSeverityStyleClass(severity) {
  switch (String(severity || '').toLowerCase()) {
    case 'critical':
    case 'major':
      return 'high';
    case 'minor':
      return 'medium';
    default:
      return 'low';
  }
}

function incidentListsMatch(previous, next) {
  if (previous.length !== next.length) return false;

  return previous.every((incident, index) => {
    const candidate = next[index];
    return candidate
      && incident.id === candidate.id
      && incident.type === candidate.type
      && incident.subtype === candidate.subtype
      && incident.description === candidate.description
      && incident.location === candidate.location
      && incident.latitude === candidate.latitude
      && incident.longitude === candidate.longitude
      && incident.createdAt === candidate.createdAt
      && incident.severity === candidate.severity
      && incident.status === candidate.status;
  });
}

export default function HeatMap({ mode = 'live' }) {
  const isDemo = mode === 'demo';
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem(`sc_heatmap_${mode}_auth`) === 'true'
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

  if (isDemo) {
    return <MapDashboard mode={mode} onLogout={null} />;
  }

  return authenticated ? (
    <MapDashboard onLogout={() => {
      sessionStorage.removeItem(`sc_heatmap_${mode}_auth`);
      setAuthenticated(false);
    }} mode={mode} />
  ) : (
    <GateScreen onAuth={() => {
      sessionStorage.setItem(`sc_heatmap_${mode}_auth`, 'true');
      setAuthenticated(true);
    }} isDemo={isDemo} />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH / REGISTRATION / RESET GATE SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function GateScreen({ onAuth, isDemo }) {
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
            <p className="text-center text-[#8AA3CC] text-sm mb-6">
              Sign in to view the {isDemo ? 'demo/sample' : 'live'} heat map
            </p>
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
function MapDashboard({ onLogout, mode }) {
  const copy = HEATMAP_COPY[mode] || HEATMAP_COPY.live;
  const isDemo = mode === 'demo';
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const headerRef = useRef(null);
  const markerCacheRef = useRef({}); // maps inc.id -> { outer, inner, core, marker }
  const hasLoadedFeedRef = useRef(false);
  
  const [activeIncidents, setActiveIncidents] = useState([]);
  const [feedStatus, setFeedStatus] = useState({
    loading: true,
    error: '',
    message: '',
    lastUpdated: '',
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 640);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  
  // Inactivity and Wake Lock states
  const [isIdle, setIsIdle] = useState(false);
  const lastInteractionRef = useRef(0);
  const idleCheckIntervalRef = useRef(null);

  const resetIdleTimer = useCallback(() => {
    lastInteractionRef.current = Date.now();
    setIsIdle(false);
  }, []);

  // Reset idle timer on user action
  useEffect(() => {
    lastInteractionRef.current = Date.now();
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    const handler = () => resetIdleTimer();
    events.forEach(e => window.addEventListener(e, handler, { passive: true }));
    
    idleCheckIntervalRef.current = setInterval(() => {
      if (Date.now() - lastInteractionRef.current >= 3600000) { // 60 minutes
        setIsIdle(true);
      }
    }, 10000); // Check every 10 seconds
    
    return () => {
      events.forEach(e => window.removeEventListener(e, handler));
      if (idleCheckIntervalRef.current) {
        clearInterval(idleCheckIntervalRef.current);
      }
    };
  }, [resetIdleTimer]);

  // Screen Wake Lock Effect
  useEffect(() => {
    if (isIdle) return;
    
    let wakeLock = null;
    async function requestWakeLock() {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen');
        }
      } catch (err) {
        console.warn('Wake Lock request failed:', err);
      }
    }
    requestWakeLock();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && !isIdle) {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (wakeLock) {
        wakeLock.release().then(() => {
          wakeLock = null;
        });
      }
    };
  }, [isIdle]);

  // Keep a fresh reference to active incidents for map listeners to reference without closures
  const activeIncidentsRef = useRef([]);
  useEffect(() => {
    activeIncidentsRef.current = activeIncidents;
  }, [activeIncidents]);

  // Load and refresh active incident lists
  const refreshIncidents = useCallback(async () => {
    setFeedStatus((prev) => ({ ...prev, loading: !hasLoadedFeedRef.current, error: '' }));

    try {
      const allIncidents = isDemo
        ? generateDemoIncidents()
        : await fetchLiveHeatmapIncidents();
      const active = getActiveIncidents(allIncidents);
      activeIncidentsRef.current = active;
      setActiveIncidents((previous) => incidentListsMatch(previous, active) ? previous : active);
      hasLoadedFeedRef.current = true;
      setFeedStatus({
        loading: false,
        error: '',
        message: isDemo ? 'Demo/sample incident data' : '',
        lastUpdated: new Date().toISOString(),
      });
      return active;
    } catch (error) {
      const remainingActive = getActiveIncidents(activeIncidentsRef.current);
      activeIncidentsRef.current = remainingActive;
      setActiveIncidents((previous) => incidentListsMatch(previous, remainingActive) ? previous : remainingActive);
      hasLoadedFeedRef.current = true;
      setFeedStatus((previous) => ({
        loading: false,
        error: error.message || 'Unable to load live incidents.',
        message: '',
        lastUpdated: previous.lastUpdated,
      }));
      return remainingActive;
    }
  }, [isDemo]);

  // Center on incident when clicked in list
  const handleIncidentClick = (inc) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([inc.latitude, inc.longitude], 15, {
        animate: true,
        duration: 0.8,
      });

      // Automatically open tooltip/popup if layer exists in cache
      const cached = markerCacheRef.current[inc.id];
      if (cached && cached.marker) {
        cached.marker.openPopup();
      }

      if (isMobile) {
        setMobileExpanded(false);
      }
    }
  };

  // Re-draw futuristic radar ring targets and markers using differential cache
  const updateHeatLayer = useCallback((map, activeList) => {
    const L = window.L;
    if (!L) return;

    if (!layerGroupRef.current) {
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    const group = layerGroupRef.current;
    const cache = markerCacheRef.current;

    if (!isDemo) {
      const activeIds = new Set(activeList.map((incident) => incident.id));

      Object.keys(cache).forEach((id) => {
        if (!activeIds.has(id)) {
          if (cache[id]?.marker) group.removeLayer(cache[id].marker);
          delete cache[id];
        }
      });

      activeList.forEach((incident) => {
        const severityClass = getSeverityStyleClass(incident.severity);
        const typeClass = String(incident.subtype || 'incident').replace(/[^a-z0-9]+/g, '-');
        const safeType = escapeHtml(incident.type);
        const safeLocation = escapeHtml(incident.location);
        const safeDescription = escapeHtml(incident.description || 'No additional description provided.');
        const safeSubtype = escapeHtml(incident.subtype || 'incident');
        const safeSeverity = escapeHtml(incident.severity);
        const safeClassification = escapeHtml(incident.classification || incident.type);
        const safeRelativeTime = escapeHtml(formatRelativeTime(incident.createdAt));
        const safeClockTime = escapeHtml(formatClockTime(incident.createdAt));
        const iconMarkup = incidentSvgMarkup(incident.type, 'live-marker-pictogram');
        const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(incident.latitude)},${encodeURIComponent(incident.longitude)}`;
        const markerMarkup = `
          <div class="live-incident-marker severity-${severityClass} type-${typeClass}" role="img" aria-label="${safeType}">
            <span class="live-marker-ring"></span>
            ${iconMarkup}
          </div>
        `;
        const tooltipContent = `
          <div class="live-tooltip-card">
            <span class="live-tooltip-icon severity-${severityClass}">${iconMarkup}</span>
            <div class="live-tooltip-copy">
              <strong>${safeType}</strong>
              <span>${safeLocation}</span>
              <time>${safeRelativeTime}</time>
            </div>
          </div>
        `;
        const popupContent = `
          <div class="heatmap-popup-card live-popup-card">
            <div class="popup-header live-popup-header">
              <span class="live-popup-icon severity-${severityClass}">${iconMarkup}</span>
              <span class="popup-title">${safeType}</span>
              <span class="popup-badge ${severityClass}">${safeSeverity}</span>
            </div>
            <div class="popup-classification-badge ${typeClass}">${safeClassification}</div>
            <p class="popup-location">${safeLocation}</p>
            <p class="live-popup-description">${safeDescription}</p>
            <dl class="live-popup-meta">
              <div><dt>Subtype</dt><dd>${safeSubtype}</dd></div>
              <div><dt>Detected</dt><dd>${safeClockTime} (${safeRelativeTime})</dd></div>
            </dl>
            <a href="${routeUrl}" target="_blank" rel="noopener noreferrer" class="popup-route-btn">Open Route</a>
          </div>
        `;
        const visualSignature = `${incident.type}|${incident.subtype}|${incident.severity}`;
        const positionSignature = `${incident.latitude}|${incident.longitude}`;
        const contentSignature = `${visualSignature}|${incident.location}|${incident.description}|${incident.createdAt}|${safeRelativeTime}`;
        const cached = cache[incident.id];

        if (!cached) {
          const icon = L.divIcon({
            className: 'live-incident-marker-host',
            html: markerMarkup,
            iconSize: [34, 34],
            iconAnchor: [17, 17],
            tooltipAnchor: [0, -18],
            popupAnchor: [0, -16],
          });
          const marker = L.marker([incident.latitude, incident.longitude], {
            icon,
            keyboard: true,
            riseOnHover: true,
            title: incident.type,
          }).addTo(group);

          marker.bindTooltip(tooltipContent, {
            direction: 'top',
            offset: [0, -4],
            opacity: 0.98,
            className: 'radar-spatial-tooltip live-incident-tooltip',
          });
          marker.bindPopup(popupContent, {
            className: 'heatmap-leaflet-popup',
            closeButton: true,
            offset: [0, -2],
            maxWidth: 260,
          });

          cache[incident.id] = {
            marker,
            visualSignature,
            positionSignature,
            contentSignature,
          };
          return;
        }

        if (cached.positionSignature !== positionSignature) {
          cached.marker.setLatLng([incident.latitude, incident.longitude]);
          cached.positionSignature = positionSignature;
        }

        if (cached.visualSignature !== visualSignature) {
          cached.marker.setIcon(L.divIcon({
            className: 'live-incident-marker-host',
            html: markerMarkup,
            iconSize: [34, 34],
            iconAnchor: [17, 17],
            tooltipAnchor: [0, -18],
            popupAnchor: [0, -16],
          }));
          cached.visualSignature = visualSignature;
        }

        if (cached.contentSignature !== contentSignature) {
          cached.marker.setTooltipContent(tooltipContent);
          cached.marker.setPopupContent(popupContent);
          cached.contentSignature = contentSignature;
        }
      });

      return;
    }

    // 1. Calculate map viewport boundaries with an extended buffer (approx 0.05 lat/lng grid)
    const bounds = map.getBounds();
    const pad = 0.05;
    const extendedBounds = L.latLngBounds(
      [bounds.getSouth() - pad, bounds.getWest() - pad],
      [bounds.getNorth() + pad, bounds.getEast() + pad]
    );

    // 2. Classify active and visible incident ids
    const activeIds = new Set(activeList.map(inc => inc.id));
    const visibleIncidents = activeList.filter(inc => extendedBounds.contains([inc.latitude, inc.longitude]));
    const visibleIds = new Set(visibleIncidents.map(inc => inc.id));

    // 3. Remove layers that are either expired or scrolled out of visible range
    Object.keys(cache).forEach((id) => {
      if (!activeIds.has(id) || !visibleIds.has(id)) {
        const layers = cache[id];
        if (layers) {
          if (layers.outer) group.removeLayer(layers.outer);
          if (layers.inner) group.removeLayer(layers.inner);
          if (layers.core) group.removeLayer(layers.core);
          if (layers.marker) group.removeLayer(layers.marker);
        }
        delete cache[id];
      }
    });

    // 4. Add or update currently visible incidents
    visibleIncidents.forEach((inc) => {
      const color = inc.severity === 'High' ? '#EF4444' : inc.severity === 'Medium' ? '#F97316' : '#F59E0B';
      const ageMultiplier = getAgeDecay(inc.createdAt);

      if (!cache[inc.id]) {
        // Create vector layers
        const baseRadius = inc.severity === 'High' ? 380 : inc.severity === 'Medium' ? 240 : 140;
        
        // Target outer ring
        const outer = L.circle([inc.latitude, inc.longitude], {
          radius: baseRadius,
          color: color,
          weight: 2,
          opacity: 0.9 * ageMultiplier,
          fillColor: color,
          fillOpacity: 0.12 * ageMultiplier,
          className: 'radar-ring',
          interactive: false,
        }).addTo(group);

        // Target pulse ring
        const inner = L.circle([inc.latitude, inc.longitude], {
          radius: baseRadius * 1.5,
          color: color,
          weight: 1,
          fill: false,
          className: 'radar-ring-pulse',
          interactive: false,
        }).addTo(group);

        // Core target focus
        const core = L.circle([inc.latitude, inc.longitude], {
          radius: inc.severity === 'High' ? 120 : inc.severity === 'Medium' ? 80 : 50,
          color: color,
          weight: 1,
          fillColor: color,
          fillOpacity: 0.25 * ageMultiplier,
          className: 'radar-ring-core',
          interactive: false,
        }).addTo(group);

        // Pulse dot marker
        const marker = L.circleMarker([inc.latitude, inc.longitude], {
          radius: 6,
          fillColor: '#FFFFFF',
          color: color,
          weight: 2,
          fillOpacity: 1.0,
          className: 'radar-dot',
        }).addTo(group);

        // Custom details card bound as a tooltip
        const classificationClass = inc.classification ? inc.classification.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'residential';
        const safeType = escapeHtml(inc.type);
        const safeSeverity = escapeHtml(inc.severity);
        const safeLocation = escapeHtml(inc.location);
        const safeClassification = escapeHtml(inc.classification || 'Residential');
        const safeRelativeTime = escapeHtml(formatRelativeTime(inc.createdAt));
        const safeClockTime = escapeHtml(formatClockTime(inc.createdAt));
        const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(inc.latitude)},${encodeURIComponent(inc.longitude)}`;
        const tooltipContent = `
          <div class="radar-tooltip-card">
            <span class="tooltip-marker-type ${inc.severity.toLowerCase()}"></span>
            <div class="tooltip-body">
              <div class="tooltip-classification ${classificationClass}">
                ${safeClassification}
              </div>
              <p class="tooltip-loc">${safeLocation}</p>
              <p class="tooltip-desc">${safeType}</p>
              <p class="tooltip-time">${safeRelativeTime}</p>
              <a href="${routeUrl}" target="_blank" rel="noopener noreferrer" class="tooltip-route-btn">
                Route to Accident
              </a>
            </div>
          </div>
        `;

        marker.bindTooltip(tooltipContent, {
          direction: 'top',
          offset: [0, -8],
          sticky: false,
          opacity: 0.98,
          interactive: true,
          className: 'radar-spatial-tooltip'
        });

        // Detail popup for click/selection
        const popupContent = `
          <div class="heatmap-popup-card">
            <div class="popup-header">
              <span class="popup-title">${safeType}</span>
              <span class="popup-badge ${inc.severity.toLowerCase()}">${safeSeverity}</span>
            </div>
            <div class="popup-classification-badge ${classificationClass}">
              ${safeClassification}
            </div>
            <p class="popup-location">${safeLocation}</p>
            <div class="popup-meta">
              <span>Reported ${safeClockTime} (${safeRelativeTime})</span>
            </div>
            <a href="${routeUrl}" target="_blank" rel="noopener noreferrer" class="popup-route-btn">
              Route to Accident
            </a>
          </div>
        `;

        marker.bindPopup(popupContent, {
          className: 'heatmap-leaflet-popup',
          closeButton: false,
          offset: [0, -4],
        });

        // Touch-hold gesture hooks (200ms preview hold) for mobile
        let touchTimer = null;
        marker.on('touchstart', (e) => {
          L.DomEvent.stopPropagation(e);
          touchTimer = setTimeout(() => {
            marker.openTooltip();
          }, 200);
        });

        const dismissTouchTooltip = () => {
          if (touchTimer) {
            clearTimeout(touchTimer);
            touchTimer = null;
          }
          marker.closeTooltip();
        };

        marker.on('touchend', dismissTouchTooltip);
        marker.on('touchmove', dismissTouchTooltip);
        marker.on('touchcancel', dismissTouchTooltip);

        // Save reference pointers
        cache[inc.id] = { outer, inner, core, marker };
      } else {
        // Update styling properties
        const layers = cache[inc.id];
        if (layers) {
          if (layers.outer) {
            layers.outer.setStyle({ opacity: 0.9 * ageMultiplier, fillOpacity: 0.12 * ageMultiplier });
          }
          if (layers.core) {
            layers.core.setStyle({ fillOpacity: 0.25 * ageMultiplier });
          }
        }
      }
    });
  }, [isDemo]);

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
    let disposed = false;

    const map = L.map(mapContainerRef.current, {
      center: MAP_CENTER,
      zoom: MAP_ZOOM,
      maxZoom: MAP_MAX_ZOOM,
      zoomControl: true,
      attributionControl: true,
      zoomSnap: 1,
      zoomDelta: 1,
      tap: true,
      touchZoom: true,
      dragging: true,
      inertia: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://carto.com/">CARTO</a> | © <a href="https://osm.org/">OSM</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    map.zoomControl.setPosition('topright');
    mapInstanceRef.current = map;

    refreshIncidents().then((active) => {
      if (!disposed && mapInstanceRef.current === map && active) {
        updateHeatLayer(map, active);
      }
    });

    // Bind map movement event listeners to trigger bounding-box spatial pruning
    const handleMapMovement = () => {
      updateHeatLayer(map, activeIncidentsRef.current);
    };

    map.on('moveend', handleMapMovement);
    map.on('zoomend', handleMapMovement);

    // Also bind Leaflet map events to reset idle timer on pan/zoom
    const handleMapInteraction = () => {
      resetIdleTimer();
    };
    map.on('dragstart', handleMapInteraction);
    map.on('zoomstart', handleMapInteraction);
    map.on('click', handleMapInteraction);

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
      disposed = true;
      window.removeEventListener('resize', handleResize);
      map.off('moveend', handleMapMovement);
      map.off('zoomend', handleMapMovement);
      map.off('dragstart', handleMapInteraction);
      map.off('zoomstart', handleMapInteraction);
      map.off('click', handleMapInteraction);
      map.remove();
      mapInstanceRef.current = null;
      layerGroupRef.current = null;
      markerCacheRef.current = {};
    };
  }, [refreshIncidents, updateHeatLayer, resetIdleTimer]);

  // Periodic Auto-refresh (paused when idle)
  useEffect(() => {
    if (isIdle) return;

    const interval = setInterval(() => {
      refreshIncidents().then((active) => {
        if (mapInstanceRef.current && active) {
          updateHeatLayer(mapInstanceRef.current, active);
        }
      });
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [refreshIncidents, updateHeatLayer, isIdle]);

  const handleResume = () => {
    resetIdleTimer();
    refreshIncidents().then((active) => {
      if (mapInstanceRef.current && active) {
        updateHeatLayer(mapInstanceRef.current, active);
      }
    });
  };

  const getIncidentIconPath = (type) => {
    switch (type) {
      case 'Traffic Incident':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z';
      case 'Multi-Vehicle Collision':
        return 'M13 10V3L4 14h7v7l9-11h-7z';
      case 'Accident':
        return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z';
      case 'Heavy Delay':
        return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'Disabled Vehicle':
        return 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z';
      case 'Disabled Semi-Trailer':
        return 'M3 7h11v8H3V7zm11 3h3l3 3v2h-6v-5zM6 18a2 2 0 100-4 2 2 0 000 4zm11 0a2 2 0 100-4 2 2 0 000 4z';
      case 'Vehicle Fire':
        return 'M12 2s4 4.5 4 8a4 4 0 11-8 0c0-2 1-3.5 2.2-4.8C10.5 7.5 12 9 12 11c1.5-1.5 2-3.5 0-9z';
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  };

  const panelClass = isMobile
    ? `heatmap-side-panel ${mobileExpanded ? 'mobile-expanded' : ''}`
    : `heatmap-side-panel ${sidebarOpen ? '' : 'panel-closed'}`;

  return (
    <div className={`heatmap-container ${!isDemo ? 'heatmap-live' : ''} fixed inset-0 bg-[#060D18] font-sans antialiased overflow-hidden flex flex-col`} style={{ height: '100dvh' }}>

      {/* ─── HEADER BAR (Flex Block at the Top) ────────────────────── */}
      <div className="heatmap-header w-full shrink-0 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Stay Calm" className="h-[54px] w-auto object-contain -my-4" />
          <div className="flex flex-col">
            <span className="text-white font-bold text-xs tracking-[0.12em] uppercase leading-none">Stay Calm Today</span>
            <span className="text-[#8AA3CC] text-[9px] tracking-wider uppercase mt-0.5">{copy.eyebrow}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#0A1628]/80 px-2.5 py-1 rounded-full border border-[#1E3660]/40">
            <span className="live-dot" />
            <span className="text-[#22C55E] text-[10px] font-bold tracking-wider uppercase">{copy.status}</span>
          </div>
          <div className="flex items-center gap-1 bg-[#0A1628]/80 px-2.5 py-1 rounded-full border border-[#1E3660]/40">
            <span className="text-[#D4AF37] text-[10px] font-bold">{activeIncidents.length}</span>
            <span className="text-[#8AA3CC] text-[9px] uppercase tracking-wider">Active</span>
          </div>
          {onLogout && (
            <button onClick={onLogout} className="text-[#5C7EB5] hover:text-[#D4AF37] transition-colors p-1" title="Sign out">
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
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
                {copy.panelTitle}
              </h2>
              <span className="bg-[#D4AF37]/15 text-[#D4AF37] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                {activeIncidents.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end leading-tight">
                <span className="text-[#5C7EB5] text-[9px] uppercase tracking-wider">90m range</span>
                {!isDemo && feedStatus.lastUpdated && (
                  <span className="live-last-updated">Last updated {formatClockTime(feedStatus.lastUpdated)}</span>
                )}
              </div>
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
            {feedStatus.loading ? (
              <div className="heatmap-feed-state text-center py-8">
                <p className="text-[#8AA3CC] text-sm font-semibold">Loading incidents...</p>
              </div>
            ) : feedStatus.error && activeIncidents.length === 0 ? (
              <div className="heatmap-feed-state text-center py-8">
                <p className="text-red-300 text-sm font-semibold">Feed unavailable</p>
                <p className="text-[#5C7EB5] text-xs mt-1 px-3">{feedStatus.error}</p>
              </div>
            ) : activeIncidents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#5C7EB5] text-sm">{copy.empty}</p>
                {!isDemo && (
                  <p className="text-[#5C7EB5] text-[10px] mt-1 px-3">
                    No active Airtable incidents are available right now.
                  </p>
                )}
              </div>
            ) : (
              <>
                {feedStatus.error && (
                  <div className="live-refresh-warning">Refresh delayed. Showing recent cached incidents.</div>
                )}
                {activeIncidents.map((inc) => {
                  const severityClass = isDemo ? inc.severity.toLowerCase() : getSeverityStyleClass(inc.severity);

                  return (
                  <div
                    key={inc.id}
                    onClick={() => handleIncidentClick(inc)}
                    className={`incident-row severity-${severityClass} flex items-center gap-2 px-2 py-2 mb-0.5 rounded-lg`}
                  >
                    <div className={`incident-icon ${severityClass} ${!isDemo ? 'live-incident-icon' : ''}`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={isDemo ? getIncidentIconPath(inc.type) : getLiveIncidentIconPath(inc.type)} />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold truncate leading-normal">{inc.type}</p>
                      <p className="text-[#8AA3CC] text-[10px] truncate leading-tight mt-0.5">{inc.location}</p>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 shrink-0 pl-1">
                      <span className={`severity-badge ${severityClass}`}>{inc.severity}</span>
                      <span className="text-[#5C7EB5] text-[8.5px] whitespace-nowrap mt-0.5">{formatRelativeTime(inc.createdAt)}</span>
                    </div>
                  </div>
                  );
                })}
              </>
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

      {/* Inactivity Timeout Modal Overlay */}
      {isIdle && (
        <div className="inactivity-modal-overlay">
          <div className="inactivity-modal">
            <div className="inactivity-icon-container">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="inactivity-title">Still Monitoring?</h3>
            <p className="inactivity-desc">
              Auto-refresh has been paused to conserve background data and battery life.
            </p>
            <button onClick={handleResume} className="inactivity-btn">
              Resume Active Feeds
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
