/**
 * Stay Calm Today — Admin System Data Module
 *
 * Handles mock databases, local storage syncing, browser fingerprint logic,
 * and Airtable/Make.com integrations placeholders.
 */

// ─── INITIAL SEED DATA ──────────────────────────────────────────────────────

const defaultLeads = [
  {
    id: 'ld-001',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    sourcePage: 'Help Funnel (/help)',
    fullName: 'Sarah Jenkins',
    phone: '404-555-0129',
    email: 'sarah.j@outlook.com',
    city: 'Atlanta',
    leadType: 'Attorney + Towing',
    message: 'Was rear-ended on I-85. Need legal help and car towed to a body shop.',
    status: 'New',
    assignedPartner: '',
    notes: ''
  },
  {
    id: 'ld-002',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    sourcePage: 'Chiropractor (/chiropractor)',
    fullName: 'Marcus Vance',
    phone: '770-555-8812',
    email: 'marcusvance@gmail.com',
    city: 'Marietta',
    leadType: 'Chiropractor',
    message: 'Having severe neck pain since my accident yesterday.',
    status: 'Reviewed',
    assignedPartner: 'Dr. John Doe',
    notes: 'Called Marcus. Confirmed appointment scheduled.'
  },
  {
    id: 'ld-003',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    sourcePage: 'Towing (/towing)',
    fullName: 'Jessica Miller',
    phone: '678-555-4321',
    email: 'jess.miller@yahoo.com',
    city: 'Sandy Springs',
    leadType: 'Towing',
    message: 'Engine stalled after fender bender. Need flatbed tow.',
    status: 'Contacted',
    assignedPartner: 'Atlanta Towing LLC',
    notes: 'Tow truck dispatched and service completed.'
  },
  {
    id: 'ld-004',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    sourcePage: 'Body Shop (/body-shop)',
    fullName: 'David Kincaid',
    phone: '404-555-7766',
    email: 'dkincaid@techcorp.com',
    city: 'Norcross',
    leadType: 'Body Shop',
    message: 'Front bumper damage from minor collision. Looking for insurance estimates.',
    status: 'Qualified',
    assignedPartner: 'Precision Auto Body',
    notes: 'Lead qualified. david is working with state farm insurance.'
  }
];

const defaultPartners = [
  {
    id: 'user-001',
    fullName: 'Tone Admin',
    companyName: 'Stay Calm Today',
    partnerType: 'Admin',
    phone: '404-555-1000',
    notificationPhone: '404-555-1000',
    email: 'admin@staycalm.today',
    territory: 'Atlanta Core',
    username: 'tone1234',
    password: 'tone1234', // Pre-seeded heatmap user
    status: 'Active',
    createdAt: new Date(Date.now() - 3600000 * 240).toISOString(),
    lastLogin: new Date().toISOString(),
    deviceFingerprint: 'fp-default-admin',
    notes: 'System administrator account.'
  },
  {
    id: 'user-002',
    fullName: 'John Henderson',
    companyName: 'Marietta Wrecker',
    partnerType: 'Tow Company',
    phone: '770-555-9000',
    notificationPhone: '770-555-9099',
    email: 'john@mariettawrecker.com',
    territory: 'Marietta / Cobb',
    username: 'mariettatow',
    password: 'password123',
    status: 'Active',
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
    lastLogin: new Date(Date.now() - 3600000 * 4).toISOString(),
    deviceFingerprint: '',
    notes: 'Primary towing partner in Cobb County.'
  },
  {
    id: 'user-003',
    fullName: 'Dr. Ashley Taylor',
    companyName: 'Spine & Recovery Center',
    partnerType: 'Chiropractor',
    phone: '678-555-8000',
    notificationPhone: '678-555-8001',
    email: 'dr.taylor@spinerecovery.com',
    territory: 'Sandy Springs / Dunwoody',
    username: 'drtaylor',
    password: 'password123',
    status: 'Pending Approval',
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    lastLogin: '',
    deviceFingerprint: '',
    notes: 'Awaiting territory alignment.'
  }
];

const defaultSecurityLogs = [
  {
    id: 'log-001',
    user: 'tone1234',
    company: 'Stay Calm Today',
    loginTime: new Date(Date.now() - 60000 * 10).toISOString(),
    ipAddress: '192.168.1.55',
    browser: 'Chrome 125 / Windows 11',
    deviceFingerprint: 'fp-default-admin',
    status: 'Success',
    reason: 'Verified credentials',
    notes: ''
  },
  {
    id: 'log-002',
    user: 'mariettatow',
    company: 'Marietta Wrecker',
    loginTime: new Date(Date.now() - 3600000 * 4).toISOString(),
    ipAddress: '172.56.21.90',
    browser: 'Safari Mobile / iPhone',
    deviceFingerprint: 'fp-mobi-tow-99',
    status: 'Success',
    reason: 'Verified credentials',
    notes: ''
  }
];

const defaultResets = [
  {
    id: 'req-001',
    usernameOrEmail: 'john@mariettawrecker.com',
    phone: '770-555-9000',
    requestTime: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'Pending',
    notes: ''
  }
];

// LocalStorage helpers to simulate database persistence
function getStorageItem(key, defaultValue) {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(stored);
}

function setStorageItem(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

// ─── API INTERFACE ─────────────────────────────────────────────────────────

export const adminDb = {
  getLeads: () => getStorageItem('sc_admin_leads', defaultLeads),
  saveLeads: (leads) => setStorageItem('sc_admin_leads', leads),

  getPartners: () => getStorageItem('sc_admin_partners', defaultPartners),
  savePartners: (partners) => setStorageItem('sc_admin_partners', partners),

  getSecurityLogs: () => getStorageItem('sc_admin_security_logs', defaultSecurityLogs),
  saveSecurityLogs: (logs) => setStorageItem('sc_admin_security_logs', logs),

  getResets: () => getStorageItem('sc_admin_resets', defaultResets),
  saveResets: (resets) => setStorageItem('sc_admin_resets', resets)
};

// ─── STORES & ACTIONS ────────────────────────────────────────────────────────

// Leads management
export function addLead(leadData) {
  const leads = adminDb.getLeads();
  const newLead = {
    id: `ld-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    status: 'New',
    assignedPartner: '',
    notes: '',
    ...leadData
  };
  leads.unshift(newLead);
  adminDb.saveLeads(leads);

  // FUTURE CONNECTIONS PLACEHOLDER:
  // Airtable Syncing logic:
  // createAirtableLead(newLead);
  // Make.com Webhook trigger:
  // triggerMakeWebhook('lead_created', newLead);
}

export function updateLeadStatus(leadId, status, notes = '', assignedPartner = '') {
  const leads = adminDb.getLeads();
  const index = leads.findIndex(l => l.id === leadId);
  if (index !== -1) {
    leads[index] = {
      ...leads[index],
      status,
      notes: notes !== undefined ? notes : leads[index].notes,
      assignedPartner: assignedPartner !== undefined ? assignedPartner : leads[index].assignedPartner
    };
    adminDb.saveLeads(leads);
  }
}

// Partner Users management
export function createPartnerUser(partnerData) {
  const partners = adminDb.getPartners();
  const newUser = {
    id: `user-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    status: 'Active',
    lastLogin: '',
    deviceFingerprint: '',
    notes: '',
    ...partnerData
  };
  partners.push(newUser);
  adminDb.savePartners(partners);

  // FUTURE CONNECTIONS PLACEHOLDER:
  // createAirtablePartner(newUser);
  return newUser;
}

export function registerPendingPartner(signupData) {
  const partners = adminDb.getPartners();
  
  // Check if username already exists
  if (partners.some(p => p.username === signupData.username)) {
    throw new Error('Username is already taken');
  }

  const newPending = {
    id: `user-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    status: 'Pending Approval',
    lastLogin: '',
    deviceFingerprint: '',
    notes: 'Self-registered via Heatmap Sign-up form.',
    ...signupData
  };

  partners.push(newPending);
  adminDb.savePartners(partners);

  // FUTURE CONNECTIONS:
  // triggerMakeWebhook('new_registration', newPending);
  return newPending;
}

export function updatePartnerUser(partnerId, updatedData) {
  const partners = adminDb.getPartners();
  const index = partners.findIndex(p => p.id === partnerId);
  if (index !== -1) {
    partners[index] = {
      ...partners[index],
      ...updatedData
    };
    adminDb.savePartners(partners);
  }
}

export function deletePartnerUser(partnerId) {
  const partners = adminDb.getPartners();
  const filtered = partners.filter(p => p.id !== partnerId);
  adminDb.savePartners(filtered);
}

// Password reset requests
export function createPasswordResetRequest(requestData) {
  const resets = adminDb.getResets();
  const newRequest = {
    id: `req-${Math.floor(1000 + Math.random() * 9000)}`,
    requestTime: new Date().toISOString(),
    status: 'Pending',
    notes: '',
    ...requestData
  };
  resets.unshift(newRequest);
  adminDb.saveResets(resets);

  // FUTURE CONNECTIONS:
  // triggerMakeWebhook('password_reset_requested', newRequest);
  return newRequest;
}

export function resolveResetRequest(requestId, notes = '') {
  const resets = adminDb.getResets();
  const index = resets.findIndex(r => r.id === requestId);
  if (index !== -1) {
    resets[index] = {
      ...resets[index],
      status: 'Resolved',
      notes
    };
    adminDb.saveResets(resets);
  }
}

// ─── DEVICE FINGERPRINT IMPLEMENTATION ──────────────────────────────────────

/**
 * Computes a lightweight browser device fingerprint hash
 */
export function generateDeviceFingerprint() {
  const data = [
    navigator.userAgent || 'unknown',
    `${window.screen.width}x${window.screen.height}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    navigator.platform || 'unknown',
    navigator.language || 'en'
  ].join('|');

  // Simple Djb2 hash algorithm to convert string to alphanumeric representation
  let hash = 5381;
  for (let i = 0; i < data.length; i++) {
    hash = (hash * 33) ^ data.charCodeAt(i);
  }
  return `fp-${(hash >>> 0).toString(16)}`;
}

/**
 * Validates the browser fingerprint signature for heatmap logins
 */
export function validateDeviceSecurity(username, currentFingerprint, userAgentString = '') {
  const partners = adminDb.getPartners();
  const user = partners.find(p => p.username === username);

  if (!user) {
    return { allowed: false, reason: 'Invalid User' };
  }

  // Admin and accounts without a fingerprint bypass initial verification but set fingerprint
  if (user.partnerType === 'Admin') {
    return { allowed: true };
  }

  // Add a new security audit log
  const addLog = (status, reason, notes = '') => {
    const logs = adminDb.getSecurityLogs();
    const newLog = {
      id: `log-${Math.floor(10000 + Math.random() * 90000)}`,
      user: username,
      company: user.companyName,
      loginTime: new Date().toISOString(),
      ipAddress: '72.41.90.104', // IP Placeholder
      browser: userAgentString || navigator.userAgent || 'Chrome/Safari Mobile',
      deviceFingerprint: currentFingerprint,
      status,
      reason,
      notes
    };
    logs.unshift(newLog);
    adminDb.saveSecurityLogs(logs);

    // FUTURE CONNECTIONS PLACEHOLDER:
    // createAirtableSecurityLog(newLog);
    return newLog;
  };

  // If no fingerprint exists yet for the user, bind it to this device
  if (!user.deviceFingerprint) {
    user.deviceFingerprint = currentFingerprint;
    updatePartnerUser(user.id, { deviceFingerprint: currentFingerprint });
    addLog('Success', 'Registered initial device fingerprint');
    return { allowed: true };
  }

  // Verify fingerprint matches
  if (user.deviceFingerprint === currentFingerprint) {
    addLog('Success', 'Verified credentials and fingerprint match');
    return { allowed: true };
  }

  // Fingerprint mismatch - Lock account and flag it
  user.status = 'Flagged/Shared';
  updatePartnerUser(user.id, { status: 'Flagged/Shared' });
  const logDetails = addLog('Blocked', 'Fingerprint Conflict Detected', `Stored: ${user.deviceFingerprint} vs Current: ${currentFingerprint}`);

  // TRIGGER PLACEHOLDER FOR MAKE.COM SECURITY ALERT WEBHOOK
  triggerMakeSecurityAlert(user, logDetails);

  return {
    allowed: false,
    reason: 'Access blocked. This account is already tied to another device. Please contact Stay Calm.'
  };
}

// ─── MAKE.COM WEBHOOK SECURITY ALERT TRIGGER ───────────────────────────────
function triggerMakeSecurityAlert(user, logDetails) {
  console.warn('⚡ Triggering Make.com Webhook security alert placeholder:');
  console.log('User:', user.username);
  console.log('Reason:', logDetails.reason);
  console.log('Details:', logDetails.notes);

  /**
   * FUTURE CODE:
   * fetch('https://hook.us1.make.com/YOUR_MAKE_SECURITY_WEBHOOK_ID', {
   *   method: 'POST',
   *   headers: { 'Content-Type': 'application/json' },
   *   body: JSON.stringify({
   *     event: 'SECURITY_ALERT',
   *     timestamp: new Date().toISOString(),
   *     userId: user.id,
   *     username: user.username,
   *     company: user.companyName,
   *     logId: logDetails.id,
   *     reason: logDetails.reason,
   *     browser: logDetails.browser,
   *     ipAddress: logDetails.ipAddress
   *   })
   * }).catch(err => console.error('Failed to trigger Make alert:', err));
   */
}

/**
 * ─── FUTURE: AIRTABLE INTEGRATION API PLACEHOLDERS ─────────────────────────
 * 
 * In a production setup with API keys:
 * 
 * export async function createAirtableLead(lead) {
 *   const response = await fetch('https://api.airtable.com/v0/YOUR_BASE_ID/Leads', {
 *     method: 'POST',
 *     headers: {
 *       Authorization: 'Bearer YOUR_AIRTABLE_PAT',
 *       'Content-Type': 'application/json'
 *     },
 *     body: JSON.stringify({
 *       fields: {
 *         'Lead ID': lead.id,
 *         'Created Time': lead.createdAt,
 *         'Source Page': lead.sourcePage,
 *         'Full Name': lead.fullName,
 *         'Phone': lead.phone,
 *         'Email': lead.email,
 *         'City': lead.city,
 *         'Lead Type': lead.leadType,
 *         'Message': lead.message,
 *         'Status': lead.status,
 *         'Admin Notes': lead.notes
 *       }
 *     })
 *   });
 *   return response.json();
 * }
 */
