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

  // ════════════════════════════════════════════════════════════════════════
  //  I-85 CORRIDOR (Norcross / Doraville / Chamblee) — HEAVY CLUSTER
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 'inc-001',
    type: 'Multi-Vehicle Collision',
    location: 'I-85 N near Jimmy Carter Blvd',
    city: 'Norcross',
    latitude: 33.9295,
    longitude: -84.2058,
    severity: 'High',
    minutesAgo: 8,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-002',
    type: 'Accident',
    location: 'I-85 N near Pleasant Hill Rd',
    city: 'Duluth',
    latitude: 33.9585,
    longitude: -84.2148,
    severity: 'High',
    minutesAgo: 12,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-003',
    type: 'Heavy Delay',
    location: 'I-85 N near Indian Trail Rd',
    city: 'Norcross',
    latitude: 33.9132,
    longitude: -84.2025,
    severity: 'Medium',
    minutesAgo: 18,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-004',
    type: 'Disabled Vehicle',
    location: 'I-85 S near Shallowford Rd',
    city: 'Chamblee',
    latitude: 33.8978,
    longitude: -84.2685,
    severity: 'Low',
    minutesAgo: 25,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-005',
    type: 'Accident',
    location: 'I-85 S at Chamblee Tucker Rd',
    city: 'Chamblee',
    latitude: 33.8848,
    longitude: -84.2918,
    severity: 'Medium',
    minutesAgo: 32,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-006',
    type: 'Multi-Vehicle Collision',
    location: 'I-85 N near Steve Reynolds Blvd',
    city: 'Duluth',
    latitude: 33.9420,
    longitude: -84.2100,
    severity: 'High',
    minutesAgo: 5,
    source: 'demo',
    status: 'Active',
  },

  // ════════════════════════════════════════════════════════════════════════
  //  DOWNTOWN CONNECTOR (I-75/I-85) — HEAVY CLUSTER
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 'inc-007',
    type: 'Multi-Vehicle Collision',
    location: 'I-75/I-85 Connector near 14th St',
    city: 'Atlanta',
    latitude: 33.7868,
    longitude: -84.3872,
    severity: 'High',
    minutesAgo: 6,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-008',
    type: 'Accident',
    location: 'I-75/I-85 Connector near 10th St',
    city: 'Atlanta',
    latitude: 33.7812,
    longitude: -84.3858,
    severity: 'High',
    minutesAgo: 14,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-009',
    type: 'Heavy Delay',
    location: 'I-75/I-85 near MLK Jr Dr',
    city: 'Atlanta',
    latitude: 33.7558,
    longitude: -84.3902,
    severity: 'Medium',
    minutesAgo: 22,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-010',
    type: 'Disabled Vehicle',
    location: 'I-75/I-85 S near University Ave',
    city: 'Atlanta',
    latitude: 33.7348,
    longitude: -84.3918,
    severity: 'Low',
    minutesAgo: 38,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-011',
    type: 'Accident',
    location: 'I-75/I-85 S near Langford Pkwy',
    city: 'Atlanta',
    latitude: 33.7198,
    longitude: -84.3978,
    severity: 'Medium',
    minutesAgo: 50,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-012',
    type: 'Multi-Vehicle Collision',
    location: 'I-75/I-85 N near North Ave',
    city: 'Atlanta',
    latitude: 33.7720,
    longitude: -84.3880,
    severity: 'High',
    minutesAgo: 3,
    source: 'demo',
    status: 'Active',
  },

  // ════════════════════════════════════════════════════════════════════════
  //  I-285 PERIMETER — SPREAD AROUND THE LOOP
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 'inc-013',
    type: 'Accident',
    location: 'I-285 E near Peachtree Industrial Blvd',
    city: 'Brookhaven',
    latitude: 33.8852,
    longitude: -84.2745,
    severity: 'Medium',
    minutesAgo: 20,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-014',
    type: 'Heavy Delay',
    location: 'I-285 N near Ashford Dunwoody Rd',
    city: 'Dunwoody',
    latitude: 33.9125,
    longitude: -84.3340,
    severity: 'High',
    minutesAgo: 15,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-015',
    type: 'Accident',
    location: 'I-285 W near Roswell Rd',
    city: 'Sandy Springs',
    latitude: 33.9352,
    longitude: -84.3548,
    severity: 'Medium',
    minutesAgo: 28,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-016',
    type: 'Multi-Vehicle Collision',
    location: 'I-285 W near Paces Ferry Rd',
    city: 'Vinings',
    latitude: 33.8692,
    longitude: -84.4528,
    severity: 'High',
    minutesAgo: 10,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-017',
    type: 'Disabled Vehicle',
    location: 'I-285 S near Camp Creek Pkwy',
    city: 'East Point',
    latitude: 33.6452,
    longitude: -84.4818,
    severity: 'Low',
    minutesAgo: 55,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-018',
    type: 'Accident',
    location: 'I-285 E near Moreland Ave',
    city: 'Decatur',
    latitude: 33.6848,
    longitude: -84.3252,
    severity: 'Medium',
    minutesAgo: 42,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-019',
    type: 'Heavy Delay',
    location: 'I-285 N near Chamblee Dunwoody Rd',
    city: 'Dunwoody',
    latitude: 33.9215,
    longitude: -84.3120,
    severity: 'Medium',
    minutesAgo: 33,
    source: 'demo',
    status: 'Active',
  },

  // ════════════════════════════════════════════════════════════════════════
  //  GA-400 CORRIDOR
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 'inc-020',
    type: 'Accident',
    location: 'GA-400 N near Lenox Rd',
    city: 'Buckhead',
    latitude: 33.8472,
    longitude: -84.3618,
    severity: 'Medium',
    minutesAgo: 19,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-021',
    type: 'Multi-Vehicle Collision',
    location: 'GA-400 N near Northridge Rd',
    city: 'Sandy Springs',
    latitude: 33.9648,
    longitude: -84.3282,
    severity: 'High',
    minutesAgo: 7,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-022',
    type: 'Disabled Vehicle',
    location: 'GA-400 N near Haynes Bridge Rd',
    city: 'Alpharetta',
    latitude: 34.0498,
    longitude: -84.2812,
    severity: 'Low',
    minutesAgo: 45,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-023',
    type: 'Heavy Delay',
    location: 'GA-400 S near Hammond Dr',
    city: 'Sandy Springs',
    latitude: 33.9320,
    longitude: -84.3450,
    severity: 'Medium',
    minutesAgo: 27,
    source: 'demo',
    status: 'Active',
  },

  // ════════════════════════════════════════════════════════════════════════
  //  PEACHTREE CORRIDOR / BUCKHEAD
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 'inc-024',
    type: 'Accident',
    location: 'Peachtree St near Piedmont Rd',
    city: 'Buckhead',
    latitude: 33.8382,
    longitude: -84.3788,
    severity: 'Medium',
    minutesAgo: 35,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-025',
    type: 'Accident',
    location: 'Peachtree Rd near Pharr Rd',
    city: 'Buckhead',
    latitude: 33.8148,
    longitude: -84.3838,
    severity: 'Low',
    minutesAgo: 62,
    source: 'demo',
    status: 'Active',
  },

  // ════════════════════════════════════════════════════════════════════════
  //  PEACHTREE CORNERS / PEACHTREE INDUSTRIAL
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 'inc-026',
    type: 'Heavy Delay',
    location: 'Peachtree Pkwy near Forum Dr',
    city: 'Peachtree Corners',
    latitude: 33.9698,
    longitude: -84.2215,
    severity: 'Medium',
    minutesAgo: 30,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-027',
    type: 'Accident',
    location: 'Peachtree Industrial near Winters Chapel',
    city: 'Doraville',
    latitude: 33.9080,
    longitude: -84.2830,
    severity: 'Medium',
    minutesAgo: 40,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-028',
    type: 'Multi-Vehicle Collision',
    location: 'Peachtree Pkwy near Holcomb Bridge',
    city: 'Peachtree Corners',
    latitude: 33.9560,
    longitude: -84.2350,
    severity: 'High',
    minutesAgo: 11,
    source: 'demo',
    status: 'Active',
  },

  // ════════════════════════════════════════════════════════════════════════
  //  LAWRENCEVILLE / LILBURN / STONE MOUNTAIN
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 'inc-029',
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
    id: 'inc-030',
    type: 'Accident',
    location: 'US-78 / Stone Mountain Fwy near Memorial Dr',
    city: 'Stone Mountain',
    latitude: 33.8082,
    longitude: -84.1648,
    severity: 'Medium',
    minutesAgo: 36,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-031',
    type: 'Heavy Delay',
    location: 'US-29 near Lawrenceville Hwy',
    city: 'Lawrenceville',
    latitude: 33.9560,
    longitude: -83.9880,
    severity: 'Medium',
    minutesAgo: 52,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-032',
    type: 'Multi-Vehicle Collision',
    location: 'Stone Mountain Fwy near Hairston Rd',
    city: 'Stone Mountain',
    latitude: 33.7980,
    longitude: -84.1350,
    severity: 'High',
    minutesAgo: 16,
    source: 'demo',
    status: 'Active',
  },

  // ════════════════════════════════════════════════════════════════════════
  //  MARIETTA / COBB COUNTY
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 'inc-033',
    type: 'Accident',
    location: 'Cobb Pkwy near Roswell St',
    city: 'Marietta',
    latitude: 33.9528,
    longitude: -84.5395,
    severity: 'Medium',
    minutesAgo: 24,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-034',
    type: 'Multi-Vehicle Collision',
    location: 'I-75 N near Delk Rd',
    city: 'Marietta',
    latitude: 33.9150,
    longitude: -84.5220,
    severity: 'High',
    minutesAgo: 9,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-035',
    type: 'Heavy Delay',
    location: 'I-75 N near Windy Hill Rd',
    city: 'Smyrna',
    latitude: 33.8920,
    longitude: -84.5080,
    severity: 'Medium',
    minutesAgo: 31,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-036',
    type: 'Disabled Vehicle',
    location: 'Cobb Pkwy near Barrett Pkwy',
    city: 'Kennesaw',
    latitude: 34.0120,
    longitude: -84.5750,
    severity: 'Low',
    minutesAgo: 60,
    source: 'demo',
    status: 'Active',
  },

  // ════════════════════════════════════════════════════════════════════════
  //  ROSWELL / SANDY SPRINGS / ALPHARETTA
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 'inc-037',
    type: 'Accident',
    location: 'Roswell Rd near Hammond Dr',
    city: 'Sandy Springs',
    latitude: 33.9318,
    longitude: -84.3562,
    severity: 'Medium',
    minutesAgo: 41,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-038',
    type: 'Multi-Vehicle Collision',
    location: 'Holcomb Bridge Rd near GA-400',
    city: 'Roswell',
    latitude: 33.9980,
    longitude: -84.3380,
    severity: 'High',
    minutesAgo: 13,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-039',
    type: 'Accident',
    location: 'Old Milton Pkwy near Windward',
    city: 'Alpharetta',
    latitude: 34.0750,
    longitude: -84.2940,
    severity: 'Medium',
    minutesAgo: 37,
    source: 'demo',
    status: 'Active',
  },

  // ════════════════════════════════════════════════════════════════════════
  //  DECATUR / BROOKHAVEN / BUFORD HWY
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 'inc-040',
    type: 'Heavy Delay',
    location: 'Buford Hwy near Clairmont Rd',
    city: 'Brookhaven',
    latitude: 33.8698,
    longitude: -84.2802,
    severity: 'Medium',
    minutesAgo: 26,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-041',
    type: 'Accident',
    location: 'N Druid Hills Rd near Briarcliff',
    city: 'Decatur',
    latitude: 33.7918,
    longitude: -84.3252,
    severity: 'Low',
    minutesAgo: 58,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-042',
    type: 'Multi-Vehicle Collision',
    location: 'I-20 E near Candler Rd',
    city: 'Decatur',
    latitude: 33.7428,
    longitude: -84.2780,
    severity: 'High',
    minutesAgo: 4,
    source: 'demo',
    status: 'Active',
  },

  // ════════════════════════════════════════════════════════════════════════
  //  I-20 CORRIDOR
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 'inc-043',
    type: 'Accident',
    location: 'I-20 W near Fulton Industrial Blvd',
    city: 'Atlanta',
    latitude: 33.7560,
    longitude: -84.5280,
    severity: 'Medium',
    minutesAgo: 29,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-044',
    type: 'Heavy Delay',
    location: 'I-20 E near Gresham Rd',
    city: 'Atlanta',
    latitude: 33.7380,
    longitude: -84.3350,
    severity: 'Medium',
    minutesAgo: 44,
    source: 'demo',
    status: 'Active',
  },

  // ════════════════════════════════════════════════════════════════════════
  //  SOUTH ATLANTA / HARTSFIELD AREA
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 'inc-045',
    type: 'Accident',
    location: 'I-75 S near Jonesboro Rd',
    city: 'Morrow',
    latitude: 33.5830,
    longitude: -84.3650,
    severity: 'Medium',
    minutesAgo: 47,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-046',
    type: 'Multi-Vehicle Collision',
    location: 'I-85 S near Riverdale Rd',
    city: 'College Park',
    latitude: 33.6310,
    longitude: -84.3990,
    severity: 'High',
    minutesAgo: 17,
    source: 'demo',
    status: 'Active',
  },

  // ════════════════════════════════════════════════════════════════════════
  //  DULUTH / SUWANEE / GWINNETT
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 'inc-047',
    type: 'Heavy Delay',
    location: 'Pleasant Hill Rd near Gwinnett Place',
    city: 'Duluth',
    latitude: 34.0032,
    longitude: -84.1448,
    severity: 'Medium',
    minutesAgo: 34,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-048',
    type: 'Accident',
    location: 'Sugarloaf Pkwy near Satellite Blvd',
    city: 'Duluth',
    latitude: 33.9780,
    longitude: -84.1020,
    severity: 'Low',
    minutesAgo: 53,
    source: 'demo',
    status: 'Active',
  },

  // ════════════════════════════════════════════════════════════════════════
  //  EXPIRED INCIDENTS (> 90 minutes — HIDDEN from map and list)
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 'inc-090',
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
    id: 'inc-091',
    type: 'Heavy Delay',
    location: 'I-285 W near Ashford Dunwoody Rd',
    city: 'Dunwoody',
    latitude: 33.9200,
    longitude: -84.3300,
    severity: 'High',
    minutesAgo: 120,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-092',
    type: 'Disabled Vehicle',
    location: 'Peachtree Industrial near Peachtree Corners',
    city: 'Peachtree Corners',
    latitude: 33.9700,
    longitude: -84.2200,
    severity: 'Low',
    minutesAgo: 150,
    source: 'demo',
    status: 'Active',
  },
  {
    id: 'inc-093',
    type: 'Accident',
    location: 'GA-400 S near Abernathy Rd',
    city: 'Sandy Springs',
    latitude: 33.9400,
    longitude: -84.3400,
    severity: 'Medium',
    minutesAgo: 105,
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
      return 0.65;
    case 'Low':
      return 0.35;
    default:
      return 0.4;
  }
}

// ─── AGE-BASED INTENSITY DECAY ──────────────────────────────────────────────
// Newer incidents glow hotter (redder). Expiring incidents fade (yellower).
export function getAgeDecay(createdAtISO) {
  const ageMin = (Date.now() - new Date(createdAtISO).getTime()) / 60000;
  if (ageMin < 30) return 1.0;       // Fresh — full intensity (red core)
  if (ageMin < 60) return 0.7;       // Mid-age — orange zone
  return 0.4;                         // Expiring — yellow/amber fade
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
