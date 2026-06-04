import { useState, useEffect } from 'react';
import {
  adminDb,
  addLead,
  createPartnerUser,
  updatePartnerUser,
  deletePartnerUser,
  resolveResetRequest
} from '../data/adminData';
import '../styles/admin.css';

const ADMIN_USERNAME = 'Tone031';
const ADMIN_PASSWORD = 'Myrafy031';

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem('sc_admin_auth') === 'true'
  );

  return authenticated ? (
    <AdminDashboard onLogout={() => {
      sessionStorage.removeItem('sc_admin_auth');
      setAuthenticated(false);
    }} />
  ) : (
    <AdminLogin onAuth={() => {
      sessionStorage.setItem('sc_admin_auth', 'true');
      setAuthenticated(true);
    }} />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN LOGIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function AdminLogin({ onAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    await new Promise((r) => setTimeout(r, 600));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      onAuth();
    } else {
      setError('Invalid admin credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="heatmap-login-bg min-h-screen flex items-center justify-center px-6 font-sans antialiased">
      <div className="heatmap-login-card w-full max-w-sm rounded-2xl p-8 animate-fade-in">
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="Stay Calm" className="h-[160px] w-auto object-contain drop-shadow-lg -my-10" />
        </div>
        <h1 className="text-center text-white font-bold text-lg tracking-wide mb-1">SYSTEM ADMINISTRATION</h1>
        <p className="text-center text-[#8AA3CC] text-sm mb-8">Sign in to manage Stay Calm networks</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#8AA3CC] mb-1.5 uppercase tracking-wider">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username"
              className="heatmap-input w-full px-4 py-3 bg-[#0A1628] border border-[#1E3660] rounded-lg text-white placeholder-[#5C7EB5] focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
              placeholder="Enter admin username" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#8AA3CC] mb-1.5 uppercase tracking-wider">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
              className="heatmap-input w-full px-4 py-3 bg-[#0A1628] border border-[#1E3660] rounded-lg text-white placeholder-[#5C7EB5] focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
              placeholder="Enter admin password" />
          </div>
          {error && <p className="text-center text-red-400 text-sm font-medium animate-fade-in">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B8891E] text-[#060D18] font-bold text-sm rounded-lg hover:from-[#EFC94B] hover:to-[#D4AF37] transition-all duration-300 shadow-lg shadow-[#D4AF37]/10 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider">
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>
        <p className="text-center text-[#5C7EB5] text-xs mt-8">© {new Date().getFullYear()} StayCalm.Today — Admin Panel</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN DASHBOARD MAIN
// ─────────────────────────────────────────────────────────────────────────────
function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Database states
  const [leads, setLeads] = useState([]);
  const [partners, setPartners] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [resets, setResets] = useState([]);

  // Modal triggers
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isCreatingPartner, setIsCreatingPartner] = useState(false);
  const [approvingPartner, setApprovingPartner] = useState(null);
  const [resettingPartnerPassword, setResettingPartnerPassword] = useState(null);

  // Settings State
  const [settings, setSettings] = useState({
    username: ADMIN_USERNAME,
    password: ADMIN_PASSWORD,
    makeWebhook: 'https://hook.us1.make.com/YOUR_LEAD_WEBHOOK_ID',
    airtableKey: 'patXyZ123.AirtableTokenPlaceholder',
    notificationEmail: 'alerts@staycalm.today',
    smsPhone: '404-555-0100'
  });

  // Load database items on mount
  useEffect(() => {
    setLeads(adminDb.getLeads());
    setPartners(adminDb.getPartners());
    setSecurityLogs(adminDb.getSecurityLogs());
    setResets(adminDb.getResets());

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const refreshData = () => {
    setLeads(adminDb.getLeads());
    setPartners(adminDb.getPartners());
    setSecurityLogs(adminDb.getSecurityLogs());
    setResets(adminDb.getResets());
  };

  // Lead update action
  const handleUpdateLead = (leadId, status, notes, assignedPartner) => {
    const dbLeads = adminDb.getLeads();
    const index = dbLeads.findIndex(l => l.id === leadId);
    if (index !== -1) {
      dbLeads[index] = {
        ...dbLeads[index],
        status,
        notes,
        assignedPartner
      };
      adminDb.saveLeads(dbLeads);
      refreshData();
      setSelectedLead(null);
    }
  };

  // Partner User creation/save action
  const handleSavePartner = (formData) => {
    if (selectedPartner) {
      updatePartnerUser(selectedPartner.id, formData);
    } else {
      createPartnerUser(formData);
    }
    refreshData();
    setSelectedPartner(null);
    setIsCreatingPartner(false);
  };

  // Partner activation action (Pending signs)
  const handleApprovePartner = (partnerId, generatedPassword) => {
    updatePartnerUser(partnerId, {
      status: 'Active',
      password: generatedPassword,
      notes: `Approved by administrator on ${new Date().toLocaleDateString()}.`
    });
    refreshData();
    setApprovingPartner(null);
  };

  // Decline/Suspend partner actions
  const handleDeclinePartner = (partnerId) => {
    updatePartnerUser(partnerId, { status: 'Declined' });
    refreshData();
  };

  const handleSuspendPartner = (partnerId) => {
    updatePartnerUser(partnerId, { status: 'Suspended' });
    refreshData();
  };

  const handleActivatePartner = (partnerId) => {
    updatePartnerUser(partnerId, { status: 'Active' });
    refreshData();
  };

  const handleDeletePartner = (partnerId) => {
    if (window.confirm('Are you sure you want to permanently delete this user?')) {
      deletePartnerUser(partnerId);
      refreshData();
    }
  };

  // Password reset resolution
  const handleResolveReset = (resetId, tempPassword) => {
    const request = resets.find(r => r.id === resetId);
    if (request) {
      const partner = partners.find(p => p.username === request.usernameOrEmail || p.email === request.usernameOrEmail);
      if (partner) {
        updatePartnerUser(partner.id, { password: tempPassword });
      }
      resolveResetRequest(resetId, `Resolved by administrator. Temporary password set to: ${tempPassword}`);
      refreshData();
      setResettingPartnerPassword(null);
    }
  };

  // Helper Metrics calculations
  const totalLeads = leads.length;
  const newLeadsToday = leads.filter(l => l.status === 'New').length;
  const pendingApprovalsCount = partners.filter(p => p.status === 'Pending Approval').length;
  const activeHeatmapUsers = partners.filter(p => p.status === 'Active' && p.partnerType !== 'Admin').length;
  const flaggedAttempts = securityLogs.filter(l => l.status === 'Blocked' || l.status === 'Flagged').length;

  return (
    <div className="admin-layout-wrapper font-sans antialiased">
      {/* ─── SIDEBAR ─────────────────────────────────────────────────── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <img src="/logo.png" alt="Stay Calm Logo" className="admin-sidebar-logo" />
          <div>
            <h1 className="admin-sidebar-title">Stay Calm</h1>
            <p className="admin-sidebar-subtitle">Admin Dashboard</p>
          </div>
        </div>
        <nav className="admin-sidebar-menu">
          <div className={`admin-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <span>📊</span> Overview
          </div>
          <div className={`admin-menu-item ${activeTab === 'leads' ? 'active' : ''}`} onClick={() => setActiveTab('leads')}>
            <span>📥</span> Funnel Leads
          </div>
          <div className={`admin-menu-item ${activeTab === 'partners' ? 'active' : ''}`} onClick={() => setActiveTab('partners')}>
            <span>💼</span> Partner Users
          </div>
          <div className={`admin-menu-item ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
            <span>⏳</span> Pending Approvals ({pendingApprovalsCount})
          </div>
          <div className={`admin-menu-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
            <span>🛡️</span> Security logs ({flaggedAttempts})
          </div>
          <div className={`admin-menu-item ${activeTab === 'resets' ? 'active' : ''}`} onClick={() => setActiveTab('resets')}>
            <span>🔑</span> Password Resets
          </div>
          <div className={`admin-menu-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <span>⚙️</span> Settings
          </div>
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user-profile">
            <div className="admin-avatar">TA</div>
            <div>
              <p className="admin-username">Tone Admin</p>
              <p className="admin-user-role">Super Administrator</p>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={onLogout} title="Logout">
            🚪
          </button>
        </div>
      </aside>

      {/* ─── MAIN PANEL ──────────────────────────────────────────────── */}
      <main className="admin-main-container">
        <header className="admin-topbar">
          <h2 className="admin-topbar-title capitalize">{activeTab.replace('-', ' ')}</h2>
          <div className="admin-clock">SYSTEM LIVE: {currentTime}</div>
        </header>

        <div className="admin-content-area">
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="admin-metrics-grid">
                <div className="admin-metric-card">
                  <div className="admin-metric-icon">📥</div>
                  <div>
                    <p className="admin-metric-label">Total Leads</p>
                    <p className="admin-metric-val">{totalLeads}</p>
                  </div>
                </div>
                <div className="admin-metric-card">
                  <div className="admin-metric-icon">🔥</div>
                  <div>
                    <p className="admin-metric-label">New Leads Today</p>
                    <p className="admin-metric-val">{newLeadsToday}</p>
                  </div>
                </div>
                <div className="admin-metric-card">
                  <div className="admin-metric-icon">⏳</div>
                  <div>
                    <p className="admin-metric-label">Pending Partners</p>
                    <p className="admin-metric-val">{pendingApprovalsCount}</p>
                  </div>
                </div>
                <div className="admin-metric-card">
                  <div className="admin-metric-icon">🗺️</div>
                  <div>
                    <p className="admin-metric-label">Active Maps Users</p>
                    <p className="admin-metric-val">{activeHeatmapUsers}</p>
                  </div>
                </div>
                <div className="admin-metric-card">
                  <div className="admin-metric-icon">🚨</div>
                  <div>
                    <p className="admin-metric-label">Flagged Warnings</p>
                    <p className="admin-metric-val">{flaggedAttempts}</p>
                  </div>
                </div>
              </div>

              <div className="admin-card-box">
                <h3 className="admin-card-title">Recent Inbound Leads</h3>
                <div className="admin-table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Source Page</th>
                        <th>City</th>
                        <th>Lead Type</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.slice(0, 5).map(lead => (
                        <tr key={lead.id}>
                          <td>{lead.id}</td>
                          <td><strong>{lead.fullName}</strong></td>
                          <td>{lead.sourcePage}</td>
                          <td>{lead.city}</td>
                          <td>{lead.leadType}</td>
                          <td><span className={`admin-status-badge ${lead.status.toLowerCase().replace(' ', '_')}`}>{lead.status}</span></td>
                          <td>
                            <button className="admin-btn-secondary py-1 px-2 text-[10px]" onClick={() => setSelectedLead(lead)}>
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INBOUND FUNNEL LEADS */}
          {activeTab === 'leads' && (
            <div className="admin-card-box">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Leads Directory</h3>
              </div>
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Lead ID</th>
                      <th>Date / Time</th>
                      <th>Source Page</th>
                      <th>Full Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Partner</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(lead => (
                      <tr key={lead.id}>
                        <td>{lead.id}</td>
                        <td>{new Date(lead.createdAt).toLocaleString()}</td>
                        <td>{lead.sourcePage}</td>
                        <td><strong>{lead.fullName}</strong></td>
                        <td>{lead.phone}</td>
                        <td>{lead.email}</td>
                        <td>{lead.city}</td>
                        <td><span className={`admin-status-badge ${lead.status.toLowerCase().replace(' ', '_')}`}>{lead.status}</span></td>
                        <td>{lead.assignedPartner || <span className="text-slate-500">Unassigned</span>}</td>
                        <td>
                          <button className="admin-btn-secondary py-1 px-2 text-[10px]" onClick={() => setSelectedLead(lead)}>
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PARTNERS DIRECTORY */}
          {activeTab === 'partners' && (
            <div className="admin-card-box">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Registered Partners</h3>
                <button className="admin-btn" onClick={() => {
                  setSelectedPartner(null);
                  setIsCreatingPartner(true);
                }}>
                  + Create User
                </button>
              </div>
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Name / Company</th>
                      <th>Type</th>
                      <th>Territory</th>
                      <th>Credentials</th>
                      <th>Fingerprint</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.filter(p => p.partnerType !== 'Admin').map(partner => (
                      <tr key={partner.id}>
                        <td>{partner.id}</td>
                        <td>
                          <strong>{partner.fullName}</strong>
                          <div className="text-[10px] text-slate-400">{partner.companyName}</div>
                        </td>
                        <td>{partner.partnerType}</td>
                        <td>{partner.territory}</td>
                        <td>
                          <div className="text-[10px] text-[#D4AF37]">U: {partner.username}</div>
                          <div className="text-[10px] text-slate-400">P: {partner.password}</div>
                        </td>
                        <td>
                          {partner.deviceFingerprint ? (
                            <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400">
                              {partner.deviceFingerprint}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">No device registered</span>
                          )}
                        </td>
                        <td><span className={`admin-status-badge ${partner.status.toLowerCase().replace(' ', '_')}`}>{partner.status}</span></td>
                        <td>
                          <div className="flex gap-2">
                            <button className="admin-btn-secondary py-1 px-2 text-[10px]" onClick={() => {
                              setSelectedPartner(partner);
                              setIsCreatingPartner(true);
                            }}>
                              Edit
                            </button>
                            {partner.status === 'Active' ? (
                              <button className="admin-btn-secondary py-1 px-2 text-[10px] border-orange-500 text-orange-400" onClick={() => handleSuspendPartner(partner.id)}>
                                Suspend
                              </button>
                            ) : (
                              <button className="admin-btn-secondary py-1 px-2 text-[10px] border-emerald-500 text-emerald-400" onClick={() => handleActivatePartner(partner.id)}>
                                Activate
                              </button>
                            )}
                            <button className="admin-btn-danger py-1 px-2 text-[10px]" onClick={() => handleDeletePartner(partner.id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PENDING APPROVAL QUEUE */}
          {activeTab === 'pending' && (
            <div className="admin-card-box">
              <h3 className="admin-card-title">Pending Partner Queue</h3>
              <div className="admin-table-responsive mt-4">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Applicant Name</th>
                      <th>Company Name</th>
                      <th>Partner Type</th>
                      <th>Contact Info</th>
                      <th>Territory Request</th>
                      <th>Username</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.filter(p => p.status === 'Pending Approval').length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-6 text-slate-400">
                          No pending sign-up requests.
                        </td>
                      </tr>
                    ) : (
                      partners.filter(p => p.status === 'Pending Approval').map(partner => (
                        <tr key={partner.id}>
                          <td>{partner.id}</td>
                          <td><strong>{partner.fullName}</strong></td>
                          <td>{partner.companyName}</td>
                          <td>{partner.partnerType}</td>
                          <td>
                            <div>{partner.phone}</div>
                            <div className="text-[10px] text-slate-400">{partner.email}</div>
                          </td>
                          <td>{partner.territory}</td>
                          <td><strong>{partner.username}</strong></td>
                          <td>
                            <div className="flex gap-2">
                              <button className="admin-btn py-1.5 px-3 text-[10px]" onClick={() => setApprovingPartner(partner)}>
                                Approve & Set Password
                              </button>
                              <button className="admin-btn-secondary py-1.5 px-3 text-[10px] border-red-500 text-red-400" onClick={() => handleDeclinePartner(partner.id)}>
                                Decline
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY AUDIT LOG */}
          {activeTab === 'security' && (
            <div className="admin-card-box">
              <h3 className="admin-card-title">Device Security Audit Logs</h3>
              <div className="admin-table-responsive mt-4">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Log ID</th>
                      <th>User</th>
                      <th>Company</th>
                      <th>Timestamp</th>
                      <th>IP Address</th>
                      <th>Device Agent</th>
                      <th>Fingerprint ID</th>
                      <th>Status</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {securityLogs.map(log => (
                      <tr key={log.id}>
                        <td>{log.id}</td>
                        <td><strong>{log.user}</strong></td>
                        <td>{log.company}</td>
                        <td>{new Date(log.loginTime).toLocaleString()}</td>
                        <td>{log.ipAddress}</td>
                        <td>{log.browser}</td>
                        <td className="font-mono text-[#D4AF37]">{log.deviceFingerprint}</td>
                        <td><span className={`admin-status-badge ${log.status.toLowerCase()}`}>{log.status}</span></td>
                        <td><span className="text-slate-400 text-[11px]">{log.notes || log.reason}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: PASSWORD RESETS */}
          {activeTab === 'resets' && (
            <div className="admin-card-box">
              <h3 className="admin-card-title">Password Reset Queue</h3>
              <div className="admin-table-responsive mt-4">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Username / Email</th>
                      <th>Contact Phone</th>
                      <th>Timestamp</th>
                      <th>Status</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resets.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-6 text-slate-400">No reset requests submitted.</td>
                      </tr>
                    ) : (
                      resets.map(req => (
                        <tr key={req.id}>
                          <td>{req.id}</td>
                          <td><strong>{req.usernameOrEmail}</strong></td>
                          <td>{req.phone}</td>
                          <td>{new Date(req.requestTime).toLocaleString()}</td>
                          <td><span className={`admin-status-badge ${req.status.toLowerCase()}`}>{req.status}</span></td>
                          <td><span className="text-slate-400">{req.notes || 'Awaiting action'}</span></td>
                          <td>
                            {req.status === 'Pending' && (
                              <button className="admin-btn py-1 px-2.5 text-[10px]" onClick={() => setResettingPartnerPassword(req)}>
                                Resolve Reset
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS PAGE */}
          {activeTab === 'settings' && (
            <div className="admin-card-box">
              <h3 className="admin-card-title mb-6">Integration Settings</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                alert('Settings updated successfully! (Mock saved)');
              }} className="space-y-6 max-w-lg">
                <div className="admin-form-group">
                  <label>Admin Login Username</label>
                  <input type="text" className="admin-form-control" value={settings.username} onChange={(e) => setSettings({...settings, username: e.target.value})} />
                </div>
                <div className="admin-form-group">
                  <label>Admin Login Password</label>
                  <input type="password" className="admin-form-control" value={settings.password} onChange={(e) => setSettings({...settings, password: e.target.value})} />
                </div>
                <div className="admin-form-group">
                  <label>Make.com Security Alert Webhook (Placeholder)</label>
                  <input type="text" className="admin-form-control" value={settings.makeWebhook} onChange={(e) => setSettings({...settings, makeWebhook: e.target.value})} />
                </div>
                <div className="admin-form-group">
                  <label>Airtable Personal Access Token (PAT) (Placeholder)</label>
                  <input type="text" className="admin-form-control" value={settings.airtableKey} onChange={(e) => setSettings({...settings, airtableKey: e.target.value})} />
                </div>
                <div className="admin-form-group">
                  <label>System Alerts Notification Email</label>
                  <input type="email" className="admin-form-control" value={settings.notificationEmail} onChange={(e) => setSettings({...settings, notificationEmail: e.target.value})} />
                </div>
                <div className="admin-form-group">
                  <label>System Alerts SMS Number</label>
                  <input type="text" className="admin-form-control" value={settings.smsPhone} onChange={(e) => setSettings({...settings, smsPhone: e.target.value})} />
                </div>
                <button type="submit" className="admin-btn mt-4">
                  Save Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* ─── MODALS & POPUPS ─────────────────────────────────────────── */}

      {/* LEAD VIEW / MANAGE MODAL */}
      {selectedLead && (
        <div className="admin-modal-overlay">
          <div className="admin-modal w-full max-w-lg">
            <div className="admin-modal-header">
              <h4 className="admin-modal-title">Manage Funnel Lead</h4>
              <span className="admin-modal-close" onClick={() => setSelectedLead(null)}>✕</span>
            </div>
            <div className="admin-modal-body space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Lead ID</p>
                  <p className="text-sm font-semibold">{selectedLead.id}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Source Page</p>
                  <p className="text-sm font-semibold">{selectedLead.sourcePage}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Full Name</p>
                  <p className="text-sm font-bold text-[#D4AF37]">{selectedLead.fullName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">City</p>
                  <p className="text-sm font-semibold">{selectedLead.city}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Phone</p>
                  <p className="text-sm font-semibold">{selectedLead.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Email</p>
                  <p className="text-sm font-semibold">{selectedLead.email}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Message Detail</p>
                <div className="bg-[#060d18] p-3 rounded border border-slate-800 text-xs">
                  {selectedLead.message || 'No additional details provided.'}
                </div>
              </div>

              <div className="admin-form-group">
                <label>Update Status</label>
                <select 
                  className="admin-form-control" 
                  defaultValue={selectedLead.status}
                  id="lead-status-select"
                >
                  <option value="New">New</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Not Qualified">Not Qualified</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Assigned Referral Partner</label>
                <input 
                  type="text" 
                  className="admin-form-control" 
                  defaultValue={selectedLead.assignedPartner} 
                  id="lead-assigned-partner"
                  placeholder="e.g. Spines Recovery Center" 
                />
              </div>

              <div className="admin-form-group">
                <label>Admin Resolution Notes</label>
                <textarea 
                  className="admin-form-control h-20" 
                  defaultValue={selectedLead.notes} 
                  id="lead-notes"
                  placeholder="Add manual notes here..."
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-btn-secondary" onClick={() => setSelectedLead(null)}>Cancel</button>
              <button className="admin-btn" onClick={() => {
                const stat = document.getElementById('lead-status-select').value;
                const part = document.getElementById('lead-assigned-partner').value;
                const nts = document.getElementById('lead-notes').value;
                handleUpdateLead(selectedLead.id, stat, nts, part);
              }}>
                Save Resolution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PARTNER CREATE / EDIT MODAL */}
      {isCreatingPartner && (
        <div className="admin-modal-overlay">
          <div className="admin-modal w-full max-w-md">
            <div className="admin-modal-header">
              <h4 className="admin-modal-title">{selectedPartner ? 'Edit Partner User' : 'Create Partner User'}</h4>
              <span className="admin-modal-close" onClick={() => setIsCreatingPartner(false)}>✕</span>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const data = Object.fromEntries(fd.entries());
              handleSavePartner(data);
            }}>
              <div className="admin-modal-body space-y-4">
                <div className="admin-form-group">
                  <label>Full Name</label>
                  <input type="text" name="fullName" required className="admin-form-control" defaultValue={selectedPartner?.fullName || ''} />
                </div>
                <div className="admin-form-group">
                  <label>Company Name</label>
                  <input type="text" name="companyName" required className="admin-form-control" defaultValue={selectedPartner?.companyName || ''} />
                </div>
                <div className="admin-form-group">
                  <label>Partner Type</label>
                  <select name="partnerType" className="admin-form-control" defaultValue={selectedPartner?.partnerType || 'Tow Company'}>
                    <option value="Tow Company">Tow Company</option>
                    <option value="Body Shop">Body Shop</option>
                    <option value="Chiropractor">Chiropractor</option>
                    <option value="Attorney">Attorney</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Territory / City</label>
                  <input type="text" name="territory" required className="admin-form-control" defaultValue={selectedPartner?.territory || ''} />
                </div>
                <div className="admin-form-group">
                  <label>Contact Phone</label>
                  <input type="text" name="phone" required className="admin-form-control" defaultValue={selectedPartner?.phone || ''} />
                </div>
                <div className="admin-form-group">
                  <label>Notification Number</label>
                  <input type="text" name="notificationPhone" required className="admin-form-control" defaultValue={selectedPartner?.notificationPhone || ''} />
                </div>
                <div className="admin-form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" required className="admin-form-control" defaultValue={selectedPartner?.email || ''} />
                </div>
                <div className="admin-form-group">
                  <label>Map Username</label>
                  <input type="text" name="username" required className="admin-form-control" defaultValue={selectedPartner?.username || ''} />
                </div>
                <div className="admin-form-group">
                  <label>Map Password</label>
                  <input type="text" name="password" required className="admin-form-control" defaultValue={selectedPartner?.password || ''} />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn-secondary" onClick={() => setIsCreatingPartner(false)}>Cancel</button>
                <button type="submit" className="admin-btn">Save Partner</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPROVE PENDING ACCOUNT MODAL */}
      {approvingPartner && (
        <div className="admin-modal-overlay">
          <div className="admin-modal w-full max-w-sm">
            <div className="admin-modal-header">
              <h4 className="admin-modal-title">Activate Partner Account</h4>
              <span className="admin-modal-close" onClick={() => setApprovingPartner(null)}>✕</span>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const genPass = document.getElementById('generated-password-field').value;
              handleApprovePartner(approvingPartner.id, genPass);
            }}>
              <div className="admin-modal-body space-y-4">
                <p className="text-xs text-slate-400">
                  You are approving <strong>{approvingPartner.fullName}</strong> ({approvingPartner.companyName}). Assign a secure password below to enable their heatmap login.
                </p>
                <div className="admin-form-group">
                  <label>Username</label>
                  <input type="text" disabled className="admin-form-control opacity-65" value={approvingPartner.username} />
                </div>
                <div className="admin-form-group">
                  <label>Assign Password</label>
                  <input 
                    type="text" 
                    id="generated-password-field" 
                    required 
                    className="admin-form-control" 
                    defaultValue={`pass-${Math.floor(100000 + Math.random() * 900000)}`} 
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn-secondary" onClick={() => setApprovingPartner(null)}>Cancel</button>
                <button type="submit" className="admin-btn">Confirm Activation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESOLVE PASSWORD RESET MODAL */}
      {resettingPartnerPassword && (
        <div className="admin-modal-overlay">
          <div className="admin-modal w-full max-w-sm">
            <div className="admin-modal-header">
              <h4 className="admin-modal-title">Resolve Reset Request</h4>
              <span className="admin-modal-close" onClick={() => setResettingPartnerPassword(null)}>✕</span>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const tempPass = document.getElementById('temp-reset-password-field').value;
              handleResolveReset(resettingPartnerPassword.id, tempPass);
            }}>
              <div className="admin-modal-body space-y-4">
                <p className="text-xs text-slate-400">
                  Generate a temporary password to resolve the reset request for <strong>{resettingPartnerPassword.usernameOrEmail}</strong>.
                </p>
                <div className="admin-form-group">
                  <label>Temporary Password</label>
                  <input 
                    type="text" 
                    id="temp-reset-password-field" 
                    required 
                    className="admin-form-control" 
                    defaultValue={`temp-${Math.floor(100000 + Math.random() * 900000)}`} 
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn-secondary" onClick={() => setResettingPartnerPassword(null)}>Cancel</button>
                <button type="submit" className="admin-btn">Reset & Resolve</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
