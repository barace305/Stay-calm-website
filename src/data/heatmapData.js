/**
 * Stay Calm — Heat Map Incident Data Module
 * 
 * This module contains the incident data model and demo data for the
 * Stay Calm Live Heat Map partner tool.
 * 
 * CURRENT STATE: Demo/fake data with dynamic timestamps.
 * 
 * FUTURE DATA SOURCES (replace generateDemoIncidents with real feeds):
 * ─────────────────────────────────────────────────────────────────────
 * • Admin Manual Entry   — Internal dashboard form (to be built)
 * • Airtable             — Airtable API → fetch incidents from a base
 * • Supabase             — Realtime subscription to incidents table
 * • Firebase             — Firestore onSnapshot listener
 * • Make.com             — Webhook receiver for automated workflows
 * • Apify Scraper        — Scheduled scrape of public traffic feeds
 * • Public Incident Feeds — GDOT, Waze, 511ga.org API
 * • Scanner Transcription — Audio scanner → AI transcription pipeline
 * ─────────────────────────────────────────────────────────────────────
 * 
 * INCIDENT DATA MODEL:
 * {
 *   id:        string   — Unique identifier
 *   type:      string   — "Accident" | "Multi-Vehicle Collision" | "Disabled Vehicle" | "Heavy Delay"
 *   location:  string   — Human-readable location description
 *   city:      string   — City name
 *   latitude:  number   — GPS latitude
 *   longitude: number   — GPS longitude
 *   severity:  string   — "Low" | "Medium" | "High"
 *   createdAt: string   — ISO 8601 timestamp
 *   source:    string   — Origin of the data ("demo" | "admin" | "scanner" | "api" | etc.)
 *   status:    string   — "Active" | "Resolved" | "Pending"
 * }
 */

// ─── DEMO INCIDENT TEMPLATES ────────────────────────────────────────────────
// minutesAgo is used to generate dynamic timestamps relative to page load.
// This ensures the demo always has fresh active incidents.

const incidentTemplates = [
  // ═══ ACTIVE INCIDENTS (within 90 minutes) ═══
  {
    id: 'inc-001',
    type: 'Multi-Vehicle Collision',
    location: 'I-85 N near Jimmy Carter Blvd',
    city: 'Norcross',
    latitude: 33.9295,
    longitude: -84.2058,
    severity: 'High',
    minutesAgo: 10,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-002',
    type: 'Accident',
    location: 'I-285 E near Peachtree Industrial Blvd',
    city: 'Brookhaven',
    latitude: 33.8852,
    longitude: -84.2745,
    severity: 'Medium',
    minutesAgo: 22,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-003',
    type: 'Heavy Delay',
    location: 'Peachtree Pkwy near Forum Dr',
    city: 'Peachtree Corners',
    latitude: 33.9698,
    longitude: -84.2215,
    severity: 'Low',
    minutesAgo: 35,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-004',
    type: 'Disabled Vehicle',
    location: 'Lawrenceville Hwy near Lilburn',
    city: 'Lilburn',
    latitude: 33.8905,
    longitude: -84.1398,
    severity: 'Low',
    minutesAgo: 48,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-005',
    type: 'Multi-Vehicle Collision',
    location: 'I-75 / I-85 Downtown Connector',
    city: 'Atlanta',
    latitude: 33.7552,
    longitude: -84.3898,
    severity: 'High',
    minutesAgo: 15,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-006',
    type: 'Accident',
    location: 'Roswell Rd near Hammond Dr',
    city: 'Sandy Springs',
    latitude: 33.9318,
    longitude: -84.3562,
    severity: 'Medium',
    minutesAgo: 55,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-007',
    type: 'Heavy Delay',
    location: 'US-78 / Stone Mountain Fwy',
    city: 'Stone Mountain',
    latitude: 33.8082,
    longitude: -84.1648,
    severity: 'Medium',
    minutesAgo: 40,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-008',
    type: 'Accident',
    location: 'Cobb Pkwy near Roswell St',
    city: 'Marietta',
    latitude: 33.9528,
    longitude: -84.5395,
    severity: 'Medium',
    minutesAgo: 65,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-009',
    type: 'Disabled Vehicle',
    location: 'GA-400 near Haynes Bridge Rd',
    city: 'Alpharetta',
    latitude: 34.0495,
    longitude: -84.2810,
    severity: 'Low',
    minutesAgo: 30,
    source: 'demo',
    status: 'Active',
  },

  // ═══ EXPIRED INCIDENTS (older than 90 minutes — should be hidden) ═══
  {
    id: 'inc-010',
    type: 'Accident',
    location: 'I-85 S near Clairmont Rd',
    city: 'Brookhaven',
    latitude: 33.8635,
    longitude: -84.3372,
    severity: 'Medium',
    minutesAgo: 95,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-011',
    type: 'Heavy Delay',
    location: 'I-285 W near Ashford Dunwoody Rd',
    city: 'Dunwoody',
    latitude: 33.9125,
    longitude: -84.3340,
    severity: 'High',
    minutesAgo: 120,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-012',
    type: 'Disabled Vehicle',
    location: 'Pleasant Hill Rd near I-85',
    city: 'Duluth',
    latitude: 34.0032,
    longitude: -84.1448,
    severity: 'Low',
    minutesAgo: 150,
    source: 'demo',
    status: 'Active',
  },
];

// ─── AUTO-SCRUB THRESHOLD ───────────────────────────────────────────────────
const SCRUB_THRESHOLD_MINUTES = 90;

// ─── GENERATE DEMO INCIDENTS ────────────────────────────────────────────────
// Converts minutesAgo into real ISO timestamps relative to the current time.
// This ensures the demo always works regardless of when the page is loaded.
export function generateDemoIncidents() {
  const now = Date.now();
  return incidentTemplates.map((template) => {
    const { minutesAgo, ...incident } = template;
    return {
      ...incident,
      createdAt: new Date(now - minutesAgo * 60 * 1000).toISOString(),
    };
  });
}

// ─── GET ACTIVE INCIDENTS ───────────────────────────────────────────────────
// Filters incidents to only those created within the last 90 minutes.
// This is the primary function the UI calls to populate the map and list.
export function getActiveIncidents(incidents) {
  const now = Date.now();
  const thresholdMs = SCRUB_THRESHOLD_MINUTES * 60 * 1000;

  return incidents.filter((incident) => {
    const age = now - new Date(incident.createdAt).getTime();
    return age < thresholdMs && incident.status === 'Active';
  });
}

// ─── SEVERITY → HEAT INTENSITY ──────────────────────────────────────────────
// Maps severity levels to heat layer intensity values for visual weighting.
export function getSeverityIntensity(severity) {
  switch (severity) {
    case 'High':
      return 1.0;
    case 'Medium':
      return 0.6;
    case 'Low':
      return 0.3;
    default:
      return 0.4;
  }
}

// ─── FORMAT RELATIVE TIME ───────────────────────────────────────────────────
// Returns a human-readable relative time string (e.g., "5 min ago").
export function formatRelativeTime(isoString) {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Just now';
  if (diffMin === 1) return '1 min ago';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr === 1) return '1 hr ago';
  return `${diffHr} hrs ago`;
}

// ─── FORMAT CLOCK TIME ─────────────────────────────────────────────────────
// Returns a formatted clock time string (e.g., "9:39 PM").
export function formatClockTime(isoString) {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/*
 * ─── FUTURE: REAL DATA INTEGRATION PLACEHOLDERS ─────────────────────────────
 *
 * Replace generateDemoIncidents() with one of these patterns:
 *
 * // Supabase Realtime:
 * export async function fetchIncidentsFromSupabase() {
 *   const { data } = await supabase
 *     .from('incidents')
 *     .select('*')
 *     .eq('status', 'Active')
 *     .gte('created_at', new Date(Date.now() - 90 * 60000).toISOString());
 *   return data;
 * }
 *
 * // Firebase Firestore:
 * export function subscribeToIncidents(callback) {
 *   return onSnapshot(
 *     query(collection(db, 'incidents'), where('status', '==', 'Active')),
 *     (snapshot) => callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
 *   );
 * }
 *
 * // Airtable:
 * export async function fetchIncidentsFromAirtable() {
 *   const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/Incidents`, {
 *     headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` }
 *   });
 *   const { records } = await res.json();
 *   return records.map(r => ({ id: r.id, ...r.fields }));
 * }
 *
 * // Make.com Webhook / REST API:
 * export async function fetchIncidentsFromWebhook() {
 *   const res = await fetch('https://hook.us1.make.com/YOUR_WEBHOOK_ID');
 *   return res.json();
 * }
 *
 * ─── FUTURE: ADMIN FEATURES PLACEHOLDERS ────────────────────────────────────
 *
 * • addIncident(incidentData)       — Admin manually creates a new incident
 * • resolveIncident(incidentId)     — Mark an incident as resolved
 * • approvePartnerAccount(userId)   — Approve a partner's access to the tool
 * • assignTerritory(userId, region) — Assign a user to a coverage territory
 * • connectFeed(feedConfig)         — Register a new external incident feed
 *
 */
