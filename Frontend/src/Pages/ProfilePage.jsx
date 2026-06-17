import { useUser } from "../Components/usercontext";
import { useNavigate } from "react-router-dom";

//  CSS 
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --primary:            #E53935;
    --primary-fg:         #fff;
    --secondary:          #7C3AED;
    --success:            #16A34A;
    --warning:            #D97706;
    --bg:                 #0F1117;
    --surface:            #161B27;
    --surface2:           #1E2535;
    --border:             rgba(255,255,255,0.08);
    --muted:              rgba(255,255,255,0.45);
    --fg:                 #F1F5F9;
    --font-display:       'Space Grotesk', sans-serif;
    --font-body:          'Inter', sans-serif;
    --radius-sm:          10px;
    --radius-md:          16px;
    --radius-lg:          24px;
    --shadow-glass:       0 4px 32px rgba(0,0,0,0.45);
    --gradient-hero:      linear-gradient(135deg,#E53935,#7C3AED);
    --gradient-emergency: linear-gradient(135deg,#E53935,#b91c1c);
  }

  body { background: var(--bg); color: var(--fg); font-family: var(--font-body); min-height: 100vh; }

  .cover {
    height: 192px; width: 100%;
    background: linear-gradient(135deg,rgba(229,57,53,0.25) 0%,rgba(124,58,237,0.15) 60%,rgba(22,163,74,0.1) 100%);
    position: relative; overflow: hidden;
  }
  .cover::after {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at 30% 50%,rgba(229,57,53,0.2) 0%,transparent 65%);
  }

  .shell { max-width: 1100px; margin: 0 auto; padding: 0 20px 60px; }

  .card { background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); box-shadow: var(--shadow-glass); overflow: hidden; }
  .card-body    { padding: 28px; }
  .card-header  { padding: 20px 24px 0; }
  .card-content { padding: 20px 24px 24px; }
  .card-title   { font-family: var(--font-display); font-size: 16px; font-weight: 700; margin-bottom: 16px; }

  .header-card { margin-top: -80px; }

  .avatar {
    width: 112px; height: 112px; border-radius: 20px;
    border: 4px solid var(--surface);
    background: var(--gradient-hero);
    display: grid; place-items: center;
    font-size: 28px; font-weight: 700; color: #fff;
    flex-shrink: 0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }

  .profile-header { display: flex; flex-direction: column; gap: 20px; }
  @media(min-width:640px){ .profile-header { flex-direction: row; align-items: flex-end; justify-content: space-between; } }
  .profile-left { display: flex; flex-direction: column; gap: 16px; }
  @media(min-width:640px){ .profile-left { flex-direction: row; align-items: flex-end; } }

  .profile-name-block { display: flex; flex-direction: column; gap: 4px; }
  .profile-name {
    display: flex; align-items: center; gap: 8px;
    font-family: var(--font-display);
    font-size: clamp(22px,4vw,30px); font-weight: 700;
  }
  .profile-role { font-size: 13px; color: var(--muted); font-weight: 500; }
  .profile-meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 12px; color: var(--muted); margin-top: 4px; }
  .profile-meta span { display: flex; align-items: center; gap: 4px; }

  .bio { margin-top: 20px; font-size: 13px; line-height: 1.7; color: var(--muted); max-width: 720px; }

  .badge-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
  .badge-pill {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 600;
    padding: 5px 11px; border-radius: 999px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    color: var(--fg);
  }

  .btn-row { display: flex; gap: 8px; flex-shrink: 0; }
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 0 16px; height: 40px; border-radius: var(--radius-sm);
    font-size: 13px; font-weight: 600;
    border: none; cursor: pointer;
    transition: opacity .15s, transform .1s;
  }
  .btn:hover  { opacity: .85; }
  .btn:active { transform: scale(.97); }
  .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--fg); }
  .btn-primary { background: var(--gradient-emergency); color: #fff; box-shadow: 0 2px 14px rgba(229,57,53,0.35); }

  .stats-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; margin-top: 24px; }
  @media(min-width:768px){ .stats-grid { grid-template-columns: repeat(4,1fr); } }
  .stat-card { padding: 20px; }
  .stat-icon-row { display: flex; align-items: center; gap: 8px; color: var(--muted); }
  .stat-icon-row span { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }
  .stat-val { font-size: 28px; font-weight: 700; margin-top: 10px; }

  .details-grid { display: grid; gap: 20px; margin-top: 20px; }
  @media(min-width:900px){ .details-grid { grid-template-columns: 2fr 1fr; } }

  .detail-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .detail-left { display: flex; align-items: center; gap: 12px; color: var(--muted); }
  .detail-icon-wrap {
    width: 36px; height: 36px; border-radius: 10px;
    background: rgba(255,255,255,0.06);
    display: grid; place-items: center; flex-shrink: 0;
  }
  .detail-label { font-size: 13px; font-weight: 500; }
  .detail-val   { font-size: 13px; color: var(--fg); }
  .separator    { height: 1px; background: var(--border); margin: 4px 0; }

  .activity-item { display: flex; align-items: flex-start; gap: 12px; }
  .activity-dot  { width: 8px; height: 8px; border-radius: 50%; background: var(--primary); flex-shrink: 0; margin-top: 6px; }
  .activity-text { font-size: 13px; }
  .activity-time { font-size: 11px; color: var(--muted); margin-top: 2px; }

  .no-profile-banner {
    margin-top: 40px;
    text-align: center;
    padding: 60px 20px;
    background: var(--surface);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
    color: var(--muted);
    font-size: 15px;
  }
  .no-profile-banner a {
    color: var(--primary);
    font-weight: 600;
    text-decoration: none;
  }
`;

// Icons 
const I = {
  Mail:       () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Phone:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.07 3.4 2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z"/></svg>,
  MapPin:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  MapPinMd:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  Calendar:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
  CalendarMd: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
  Shield:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  ShieldMd:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Heart:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  Activity:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Award:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Pencil:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>,
  BadgeCheck: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>,
  User:       () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>,
  Briefcase:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" x2="12" y1="12" y2="12"/></svg>,
  Hash:       () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>,
  Box:        () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>,
  Clock:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Zap:        () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
};

//Sub-components
function StatCard({ Icon, label, value }) {
  return (
    <div className="card stat-card">
      <div className="stat-icon-row">
        <Icon /><span>{label}</span>
      </div>
      <div className="stat-val">{value}</div>
    </div>
  );
}

function DetailRow({ Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="detail-row">
      <div className="detail-left">
        <div className="detail-icon-wrap"><Icon /></div>
        <span className="detail-label">{label}</span>
      </div>
      <span className="detail-val">{value}</span>
    </div>
  );
}

//Role-specific helpers 
const ROLE_LABELS = {
  volunteer: "Verified Volunteer Responder",
  requester: "Emergency Requester",
  provider:  "Resource Provider",
  ngo:       "NGO / Authority Coordinator",
};

function getInitials(userData) {
  const name = userData.displayName || userData.name || userData.orgName || "";
  return name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("") || "U";
}

function getBadges(userData) {
  const badges = ["Phone Verified"];
  if (userData.role === "volunteer") {
    if (userData.skills) userData.skills.split(",").slice(0, 3).forEach(s => badges.push(s.trim()));
    badges.push("Background Checked");
  }
  if (userData.role === "ngo")      badges.push("Govt. Registered", "Background Checked");
  if (userData.role === "provider") badges.push(`${userData.resourceType} Provider`);
  if (userData.role === "requester") badges.push(`${userData.emergencyType} Request Active`);
  return badges.filter(Boolean);
}

function getBio(userData) {
  switch (userData.role) {
    case "volunteer":
      return `Volunteer responder based in ${userData.location || "your area"}.${userData.skills ? ` Skilled in ${userData.skills}.` : ""} Available ${userData.availability || "On Call"} for emergency response.`;
    case "requester":
      return `Registered requester for ${userData.emergencyType || "emergency"} assistance. Located in ${userData.location || "your area"}. Contact immediately for urgent support.`;
    case "provider":
      return `${userData.orgName || "Organization"} providing ${userData.resourceType || "resources"} from ${userData.location || "your area"}. Contact ${userData.contactPerson || "our team"} for availability.`;
    case "ngo":
      return `${userData.orgName || "NGO"} coordinating large-scale emergency response from ${userData.location || "your area"}. Led by ${userData.officerName || "our officer"}. Registered under ${userData.regNumber || "—"}.`;
    default:
      return "";
  }
}

// Placeholder stats (replace with real backend data later)
const PLACEHOLDER_STATS = {
  volunteer: [
    { Icon: I.Heart,    label: "Requests Helped", value: "—" },
    { Icon: I.Activity, label: "Lives Impacted",  value: "—" },
    { Icon: I.Award,    label: "Avg Response",    value: "—" },
    { Icon: I.ShieldMd, label: "Rating",          value: "—" },
  ],
  requester: [
    { Icon: I.Zap,      label: "Requests Made",   value: "—" },
    { Icon: I.Clock,    label: "Avg Fulfil Time",  value: "—" },
    { Icon: I.Heart,    label: "Cases Resolved",   value: "—" },
    { Icon: I.ShieldMd, label: "Trust Score",      value: "—" },
  ],
  provider: [
    { Icon: I.Box,      label: "Units Supplied",   value: "—" },
    { Icon: I.Heart,    label: "Lives Supported",  value: "—" },
    { Icon: I.Activity, label: "Active Listings",  value: "—" },
    { Icon: I.ShieldMd, label: "Rating",           value: "—" },
  ],
  ngo: [
    { Icon: I.Activity, label: "Ops Coordinated",  value: "—" },
    { Icon: I.Heart,    label: "Lives Impacted",   value: "—" },
    { Icon: I.Award,    label: "Volunteers Mgd",   value: "—" },
    { Icon: I.ShieldMd, label: "Trust Level",      value: "—" },
  ],
};

const PLACEHOLDER_ACTIVITY = [
  { t: "Account created successfully",   time: "Just now" },
  { t: "Phone verification completed",   time: "Just now" },
  { t: "Profile set up",                 time: "Just now" },
];

//  Main component 
export default function ProfilePage() {
  const { userData } = useUser();
  const navigate =useNavigate();

  // No-data fallback 
  if (!userData) {
    return (
      <>
        <style>{CSS}</style>
        <div className="cover" />
        <div className="shell">
          <div className="no-profile-banner">
            <p>No profile data found.</p>
            <p style={{ marginTop: 8 }}>
              Please <a href="/signup">sign up</a> to create your profile.
            </p>
          </div>
        </div>
      </>
    );
  }

  const initials   = getInitials(userData);
  const roleLabel  = ROLE_LABELS[userData.role] ?? "ResQ Member";
  const badges     = getBadges(userData);
  const bio        = getBio(userData);
  const stats      = PLACEHOLDER_STATS[userData.role] ?? PLACEHOLDER_STATS.volunteer;
  const displayName = userData.displayName || userData.name || userData.orgName || "User";

  // Build contact rows based on role
  const contactRows = [
    { Icon: I.Mail,       label: "Email",          value: userData.email },
    { Icon: I.Phone,      label: "Phone",          value: userData.phone },
    userData.role === "volunteer" && { Icon: I.Phone, label: "Emergency Contact", value: userData.emergencyPhone },
    { Icon: I.MapPinMd,   label: "Service Area",   value: userData.location },
    userData.role === "volunteer"  && { Icon: I.Clock,      label: "Availability",      value: userData.availability },
    userData.role === "requester"  && { Icon: I.Zap,        label: "Emergency Type",    value: userData.emergencyType },
    userData.role === "provider"   && { Icon: I.User,        label: "Contact Person",    value: userData.contactPerson },
    userData.role === "provider"   && { Icon: I.Box,         label: "Resource Type",     value: userData.resourceType },
    userData.role === "ngo"        && { Icon: I.User,        label: "Officer Name",      value: userData.officerName },
    userData.role === "ngo"        && { Icon: I.Hash,        label: "Reg. Number",       value: userData.regNumber },
    userData.role === "volunteer"  && { Icon: I.Award,       label: "Skills",            value: userData.skills },
  ].filter(Boolean);

  return (
    <>
      <style>{CSS}</style>

      <div className="cover" />

      <div className="shell">
        {/* Header card */}
        <div className="card header-card">
          <div className="card-body">
            <div className="profile-header">
              <div className="profile-left">
                <div className="avatar">{initials}</div>
                <div className="profile-name-block">
                  <div className="profile-name">
                    {displayName}
                    <I.BadgeCheck />
                  </div>
                  <div className="profile-role">{roleLabel}</div>
                  <div className="profile-meta">
                    {userData.location && <span><I.MapPin /> {userData.location}</span>}
                    <span><I.Calendar /> Joined {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</span>
                  </div>
                </div>
              </div>
              <div className="btn-row">
                <button className="btn btn-outline"><I.Pencil /> Edit Profile</button>
                <button className="btn btn-primary" onClick={()=>navigate("/dashboard")}>View Dashboard</button>
              </div>
            </div>

            <p className="bio">{bio}</p>

            <div className="badge-row">
              {badges.map(b => (
                <span key={b} className="badge-pill">
                  <I.Shield /> {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {stats.map(s => (
            <StatCard key={s.label} Icon={s.Icon} label={s.label} value={s.value} />
          ))}
        </div>

        {/* Details */}
        <div className="details-grid">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Contact Details</div>
            </div>
            <div className="card-content" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {contactRows.map((row, i) => (
                <div key={i}>
                  <DetailRow Icon={row.Icon} label={row.label} value={row.value} />
                  {i < contactRows.length - 1 && <div className="separator" />}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Recent Activity</div>
            </div>
            <div className="card-content" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {PLACEHOLDER_ACTIVITY.map(a => (
                <div key={a.t} className="activity-item">
                  <div className="activity-dot" />
                  <div>
                    <div className="activity-text">{a.t}</div>
                    <div className="activity-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
