import { useState } from "react";
import {useNavigate} from "react-router-dom";


const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --primary:       #E53935;
    --primary-fg:    #fff;
    --secondary:     #7C3AED;
    --success:       #16A34A;
    --warning:       #D97706;
    --danger:        #DC2626;
    --bg:            #0F1117;
    --surface:       #161B27;
    --surface2:      #1E2535;
    --border:        rgba(255,255,255,0.08);
    --muted:         rgba(255,255,255,0.45);
    --fg:            #F1F5F9;
    --font-display:  'Space Grotesk', sans-serif;
    --font-body:     'Inter', sans-serif;
    --radius-sm:     10px;
    --radius-md:     16px;
    --radius-lg:     24px;
    --shadow-glass:  0 4px 32px rgba(0,0,0,0.45);
    --gradient-hero: linear-gradient(135deg,#E53935,#7C3AED);
    --gradient-emergency: linear-gradient(135deg,#E53935,#b91c1c);
  }

  body { background: var(--bg); color: var(--fg); font-family: var(--font-body); min-height: 100vh; }

  /* ── layout ── */
  .shell { max-width: 1100px; margin: 0 auto; padding: 32px 20px 60px; }
  .shell-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
  .shell-title { font-family: var(--font-display); font-size: clamp(22px,4vw,30px); font-weight: 700; }
  .shell-sub   { color: var(--muted); font-size: 14px; margin-top: 4px; }

  /* ── glass card ── */
  .card { background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); box-shadow: var(--shadow-glass); overflow: hidden; }

  /* ── summary grid ── */
  .summary-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; margin-bottom: 24px; }
  @media(min-width:768px){ .summary-grid { grid-template-columns: repeat(4,1fr); } }
  .stat-card  { padding: 20px; }
  .stat-icon  { width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center; margin-bottom: 12px; }
  .stat-val   { font-size: 26px; font-weight: 700; }
  .stat-label { font-size: 12px; color: var(--muted); margin-top: 2px; }

  /* ── track-id section ── */
  .track-section       { margin-bottom: 24px; }
  .track-card          { background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); box-shadow: var(--shadow-glass); padding: 24px; }
  .track-label         { font-family: var(--font-display); font-size: 16px; font-weight: 700; margin-bottom: 6px; }
  .track-sub           { color: var(--muted); font-size: 13px; margin-bottom: 18px; }
  .track-row           { display: flex; gap: 10px; flex-wrap: wrap; }
  .track-input         { flex: 1; min-width: 200px; background: rgba(255,255,255,0.06); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--fg); font-family: monospace; font-size: 14px; padding: 0 16px; height: 44px; outline: none; transition: border-color .2s; }
  .track-input::placeholder { color: var(--muted); }
  .track-input:focus   { border-color: rgba(229,57,53,0.5); }
  .track-btn           { background: var(--gradient-emergency); color: #fff; border: none; border-radius: var(--radius-sm); font-size: 14px; font-weight: 600; padding: 0 22px; height: 44px; cursor: pointer; display: flex; align-items: center; gap: 8px; white-space: nowrap; transition: opacity .15s, transform .1s; }
  .track-btn:hover     { opacity: .85; }
  .track-btn:active    { transform: scale(.97); }

  /* track result card */
  .track-result        { margin-top: 16px; border-radius: var(--radius-md); border: 1px solid var(--border); background: rgba(255,255,255,0.03); overflow: hidden; animation: fadeIn .25s ease; }
  .track-result-header { display: flex; align-items: center; gap: 14px; padding: 16px 18px; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
  .track-result-title  { font-weight: 600; font-size: 15px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .track-result-sub    { display: flex; align-items: center; gap: 8px; margin-top: 3px; font-size: 12px; color: var(--muted); flex-wrap: wrap; }
  .track-result-body   { padding: 20px 18px; display: grid; gap: 20px; }
  @media(min-width:760px){ .track-result-body { grid-template-columns: 1fr 1fr; } }
  .track-error         { display: flex; align-items: center; gap: 12px; padding: 16px 18px; color: #E53935; font-size: 14px; font-weight: 500; animation: fadeIn .25s ease; border-radius: var(--radius-md); border: 1px solid rgba(229,57,53,0.25); background: rgba(229,57,53,0.06); margin-top: 14px; }
  .track-loading       { display: flex; align-items: center; gap: 10px; padding: 16px 18px; color: var(--muted); font-size: 14px; animation: fadeIn .2s ease; }

  /* ── request list ── */
  .list-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding: 24px 24px 12px; }
  .list-title  { font-family: var(--font-display); font-size: 20px; font-weight: 700; }

  /* ── tabs ── */
  .tabs { display: flex; gap: 4px; background: rgba(255,255,255,0.06); border-radius: var(--radius-sm); padding: 4px; }
  .tab  { padding: 7px 14px; border-radius: 8px; font-size: 13px; font-weight: 500; border: none; cursor: pointer; background: transparent; color: var(--muted); transition: all .18s; }
  .tab.active { background: var(--surface2); color: var(--fg); box-shadow: 0 2px 8px rgba(0,0,0,0.3); }

  /* ── request item ── */
  .req-list { padding: 0 16px 20px; display: flex; flex-direction: column; gap: 12px; }
  .req-item { border-radius: var(--radius-md); border: 1px solid var(--border); background: rgba(255,255,255,0.03); transition: border-color .2s, box-shadow .2s; }
  .req-item:hover { border-color: rgba(229,57,53,0.3); box-shadow: 0 2px 20px rgba(0,0,0,0.3); }
  .req-item.open  { background: var(--surface2); border-color: rgba(229,57,53,0.25); box-shadow: 0 4px 24px rgba(0,0,0,0.4); }

  .req-row  { width: 100%; display: flex; align-items: center; gap: 14px; padding: 16px 18px; text-align: left; background: transparent; border: none; cursor: pointer; color: inherit; }
  .req-icon { width: 48px; height: 48px; border-radius: 14px; display: grid; place-items: center; flex-shrink: 0; }
  .req-meta { flex: 1; min-width: 0; }
  .req-name { font-weight: 600; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .req-sub  { display: flex; align-items: center; gap: 8px; margin-top: 4px; font-size: 12px; color: var(--muted); flex-wrap: wrap; }

  /* ── badge ── */
  .badge { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 999px; border: 1px solid transparent; white-space: nowrap; }

  /* ── critical pill ── */
  .critical-pill { display: none; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; color: var(--primary); background: rgba(229,57,53,0.12); padding: 5px 10px; border-radius: 8px; }
  @media(min-width:640px){ .critical-pill { display: flex; } }

  /* ── chevron ── */
  .chevron { transition: transform .2s; flex-shrink: 0; color: var(--muted); }
  .chevron.open { transform: rotate(90deg); }

  /* ── expanded detail ── */
  .req-detail  { padding: 0 18px 20px; }
  .divider     { height: 1px; background: var(--border); margin-bottom: 20px; }
  .detail-grid { display: grid; gap: 24px; }
  @media(min-width:900px){ .detail-grid { grid-template-columns: 1fr 1fr; } }

  /* ── timeline ── */
  .tl-title { font-size: 14px; font-weight: 600; margin-bottom: 14px; }
  .tl-step  { display: flex; gap: 12px; }
  .tl-dot-col { display: flex; flex-direction: column; align-items: center; }
  .tl-dot { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; border: 2px solid var(--border); font-size: 10px; font-weight: 700; color: var(--muted); background: var(--surface); flex-shrink: 0; }
  .tl-dot.done { background: var(--primary); border-color: var(--primary); color: #fff; }
  .tl-line { width: 2px; flex: 1; margin: 3px 0; background: var(--border); }
  .tl-line.done { background: var(--primary); }
  .tl-body  { padding-bottom: 18px; }
  .tl-label { font-size: 13px; font-weight: 500; color: var(--muted); }
  .tl-label.done { color: var(--fg); }
  .tl-time  { font-size: 11px; color: var(--muted); margin-top: 2px; }

  /* ── responder card ── */
  .responder-card   { background: rgba(255,255,255,0.05); border-radius: var(--radius-md); padding: 18px; margin-bottom: 14px; }
  .responder-row    { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .responder-avatar { width: 44px; height: 44px; border-radius: 50%; background: var(--gradient-hero); display: grid; place-items: center; color: #fff; font-size: 13px; font-weight: 700; flex-shrink: 0; }
  .responder-name   { font-size: 14px; font-weight: 600; }
  .responder-type   { font-size: 12px; color: var(--muted); }
  .phone-row        { display: flex; align-items: center; gap: 8px; font-family: monospace; font-size: 12px; color: var(--fg); }

  /* ── action buttons ── */
  .actions { display: flex; gap: 8px; }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 0 18px; height: 44px; border-radius: var(--radius-sm); font-size: 14px; font-weight: 600; border: none; cursor: pointer; transition: opacity .15s, transform .1s; flex: 1; }
  .btn:hover  { opacity: .85; }
  .btn:active { transform: scale(.97); }
  .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--fg); }
  .btn-primary { background: var(--gradient-emergency); color: #fff; box-shadow: 0 2px 14px rgba(229,57,53,0.35); }

  /* ── status notice ── */
  .status-notice { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.04); border-radius: var(--radius-md); padding: 14px; margin-top: 12px; }
  .notice-icon   { width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; flex-shrink: 0; }

  /* ── empty state ── */
  .empty { text-align: center; padding: 48px 20px; color: var(--muted); font-size: 14px; }

  /* ── animations ── */
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
  .animate-spin  { animation: spin 1.2s linear infinite; }
  .animate-pulse { animation: pulse 1.2s ease infinite; }
  .fade-in       { animation: fadeIn .25s ease; }
`;

// static data 
const requests = [
  {
    id: "REQ-2847",
    title: "O-negative blood needed",
    category: "blood",
    priority: "CRITICAL",
    status: "matched",
    createdAt: "Today, 10:23 AM",
    location: "Apollo Hospital, Sector 12",
    responder: { name: "Dr. Priya R.", type: "Verified Doctor", eta: "4 min", phone: "+91 98765 43210" },
    timeline: [
      { label: "Request submitted",       time: "10:23 AM", done: true  },
      { label: "AI matching in progress", time: "10:24 AM", done: true  },
      { label: "Responder assigned",      time: "10:25 AM", done: true  },
      { label: "Responder en route",      time: "10:26 AM", done: true  },
      { label: "Delivered",               time: "—",        done: false },
    ],
  },
  {
    id: "REQ-2841",
    title: "Transport to dialysis center",
    category: "transport",
    priority: "HIGH",
    status: "in-progress",
    createdAt: "Today, 8:15 AM",
    location: "Mrs. Mehta Residence, Sector 8",
    responder: { name: "Rahul M.", type: "Verified Volunteer", eta: "12 min", phone: "+91 98765 11111" },
    timeline: [
      { label: "Request submitted",       time: "8:15 AM", done: true  },
      { label: "AI matching in progress", time: "8:16 AM", done: true  },
      { label: "Responder assigned",      time: "8:18 AM", done: true  },
      { label: "Responder en route",      time: "8:22 AM", done: false },
      { label: "Picked up",               time: "—",       done: false },
      { label: "Dropped off",             time: "—",       done: false },
    ],
  },
  {
    id: "REQ-2819",
    title: "Insulin pen (NovoRapid)",
    category: "medicine",
    priority: "MEDIUM",
    status: "completed",
    createdAt: "Yesterday, 6:45 PM",
    location: "Green View Apartments, Sector 22",
    responder: { name: "Ananya K.", type: "Verified Pharmacist", eta: "Delivered", phone: "+91 98765 22222" },
    timeline: [
      { label: "Request submitted",       time: "6:45 PM", done: true },
      { label: "AI matching in progress", time: "6:46 PM", done: true },
      { label: "Responder assigned",      time: "6:48 PM", done: true },
      { label: "Responder en route",      time: "6:52 PM", done: true },
      { label: "Delivered",               time: "7:05 PM", done: true },
    ],
  },
  {
    id: "REQ-2805",
    title: "Food packets for family of 4",
    category: "food",
    priority: "MEDIUM",
    status: "completed",
    createdAt: "2 days ago",
    location: "Community Center, Sector 14",
    responder: { name: "FeedIndia NGO", type: "Verified Organization", eta: "Delivered", phone: "+91 98765 33333" },
    timeline: [
      { label: "Request submitted",       time: "4:10 PM", done: true },
      { label: "AI matching in progress", time: "4:11 PM", done: true },
      { label: "Responder assigned",      time: "4:13 PM", done: true },
      { label: "Responder en route",      time: "4:20 PM", done: true },
      { label: "Delivered",               time: "4:42 PM", done: true },
    ],
  },
  {
    id: "REQ-2798",
    title: "Emergency shelter for 2 nights",
    category: "shelter",
    priority: "HIGH",
    status: "cancelled",
    createdAt: "3 days ago",
    location: "Near Railway Station, Sector 1",
    responder: null,
    timeline: [
      { label: "Request submitted",       time: "9:00 AM", done: true },
      { label: "AI matching in progress", time: "9:01 AM", done: true },
      { label: "Cancelled by user",       time: "9:15 AM", done: true },
    ],
  },
];

// lookup maps 
const categoryColors = {
  blood:     { color: "#E53935", bg: "rgba(229,57,53,0.12)"   },
  transport: { color: "#D97706", bg: "rgba(217,119,6,0.12)"   },
  medicine:  { color: "#7C3AED", bg: "rgba(124,58,237,0.12)"  },
  food:      { color: "#16A34A", bg: "rgba(22,163,74,0.12)"   },
  shelter:   { color: "#94A3B8", bg: "rgba(148,163,184,0.12)" },
  medical:   { color: "#DC2626", bg: "rgba(220,38,38,0.12)"   },
};

const statusConfig = {
  matched:      { label: "Matched",     color: "rgba(229,57,53,0.15)",  border: "rgba(229,57,53,0.35)",   text: "#E53935" },
  "in-progress":{ label: "In Progress", color: "rgba(217,119,6,0.15)",  border: "rgba(217,119,6,0.35)",   text: "#D97706" },
  completed:    { label: "Completed",   color: "rgba(22,163,74,0.15)",  border: "rgba(22,163,74,0.35)",   text: "#16A34A" },
  cancelled:    { label: "Cancelled",   color: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.25)", text: "#94A3B8" },
  pending:      { label: "Pending",     color: "rgba(124,58,237,0.15)", border: "rgba(124,58,237,0.35)",  text: "#7C3AED" },
};

// inline SVG icons 
const Icons = {
  Droplet: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
    </svg>
  ),
  Truck: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  Pill: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
      <path d="m8.5 8.5 7 7"/>
    </svg>
  ),
  Utensils: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
      <path d="M7 2v20"/>
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
    </svg>
  ),
  Home: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  HeartPulse: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      <path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h5.27"/>
    </svg>
  ),
  MapPin: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Clock: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Phone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.07 3.4 2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  X: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/>
      <path d="m6 6 12 12"/>
    </svg>
  ),
  Loader: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  ),
  PackageCheck: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 16 2 2 4-4"/>
      <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/>
      <path d="m7.5 4.27 9 5.15"/>
      <polyline points="3.29 7 12 12 20.71 7"/>
      <line x1="12" y1="22" x2="12" y2="12"/>
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <path d="M12 9v4"/>
      <path d="M12 17h.01"/>
    </svg>
  ),
  AlertCircle: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 8v4"/>
      <path d="M12 16h.01"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14"/>
      <path d="M5 12h14"/>
    </svg>
  ),
  Eye: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  CheckCircle: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  ),
};

const categoryIcons = {
  blood:     Icons.Droplet,
  transport: Icons.Truck,
  medicine:  Icons.Pill,
  food:      Icons.Utensils,
  shelter:   Icons.Home,
  medical:   Icons.HeartPulse,
};

//  status icon helper
function StatusIcon({ status }) {
  if (status === "matched")
    return <Icons.PackageCheck size={14} />;
  if (status === "in-progress")
    return <span className="animate-spin" style={{ display: "inline-flex" }}><Icons.Loader size={14} /></span>;
  if (status === "completed")
    return <Icons.CheckCircle size={14} />;
  if (status === "cancelled")
    return <Icons.X size={14} />;
  return <Icons.Clock size={14} />;
}

// sub-components
function StatCard({ label, value, color, bg, Icon }) {
  return (
    <div className="card stat-card">
      <div className="stat-icon" style={{ background: bg }}>
        <span style={{ color, display: "flex" }}><Icon /></span>
      </div>
      <div className="stat-val">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function Timeline({ steps }) {
  return (
    <div>
      <div className="tl-title">Progress Timeline</div>
      {steps.map((step, i) => {
        const isLast    = i === steps.length - 1;
        const nextDone  = !isLast && steps[i + 1]?.done;
        return (
          <div className="tl-step" key={step.label}>
            <div className="tl-dot-col">
              <div className={`tl-dot ${step.done ? "done" : ""}`}>
                {step.done ? <Icons.Check /> : i + 1}
              </div>
              {!isLast && <div className={`tl-line ${step.done && nextDone ? "done" : ""}`} />}
            </div>
            <div className="tl-body">
              <div className={`tl-label ${step.done ? "done" : ""}`}>{step.label}</div>
              <div className="tl-time">{step.time}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ResponderCard({ responder }) {
  const initials = responder.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  return (
    <div className="responder-card">
      <div className="tl-title" style={{ marginBottom: 10 }}>Responder Details</div>
      <div className="responder-row">
        <div className="responder-avatar">{initials}</div>
        <div style={{ flex: 1 }}>
          <div className="responder-name">{responder.name}</div>
          <div className="responder-type">{responder.type}</div>
        </div>
        <span
          className="badge"
          style={{ background: "rgba(22,163,74,0.15)", color: "#16A34A", borderColor: "rgba(22,163,74,0.35)" }}
        >
          {responder.eta}
        </span>
      </div>
      <div className="phone-row">
        <span style={{ color: "#7C3AED", display: "flex" }}><Icons.Phone /></span>
        {responder.phone}
      </div>
    </div>
  );
}

function RequestItem({ req, isOpen, onToggle, scrollRef }) {
  const CatIcon   = categoryIcons[req.category] || Icons.HeartPulse;
  const catColor  = categoryColors[req.category] || { color: "#94A3B8", bg: "rgba(148,163,184,0.12)" };
  const status    = statusConfig[req.status];
  const isActive  = ["matched", "in-progress", "pending"].includes(req.status);

  return (
    <div ref={scrollRef} className={`req-item ${isOpen ? "open" : ""}`}>
      <button className="req-row" onClick={onToggle}>
        <div className="req-icon" style={{ background: catColor.bg, color: catColor.color }}>
          <CatIcon />
        </div>
        <div className="req-meta">
          <div className="req-name">
            <span>{req.title}</span>
            <span className="badge" style={{ background: status.color, color: status.text, borderColor: status.border }}>
              <StatusIcon status={req.status} />
              {status.label}
            </span>
          </div>
          <div className="req-sub">
            <span style={{ fontFamily: "monospace" }}>{req.id}</span>
            <span>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Icons.MapPin /> {req.location}</span>
            <span>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Icons.Clock /> {req.createdAt}</span>
          </div>
        </div>
        {req.priority === "CRITICAL" && (
          <div className="critical-pill">
            <Icons.AlertTriangle /> CRITICAL
          </div>
        )}
        <span className={`chevron ${isOpen ? "open" : ""}`}><Icons.ChevronRight /></span>
      </button>

      {isOpen && (
        <div className="req-detail">
          <div className="divider" />
          <div className="detail-grid">
            <Timeline steps={req.timeline} />
            <div>
              {req.responder && <ResponderCard responder={req.responder} />}
              <div className="actions">
                {isActive && (
                  <button className="btn btn-outline">
                    <Icons.X size={16} /> Cancel Request
                  </button>
                )}
                <button className="btn btn-outline">
                  <Icons.MapPin size={14} /> View on Map
                </button>
              </div>
              {req.status === "completed" && (
                <div className="status-notice">
                  <div className="notice-icon" style={{ background: "rgba(22,163,74,0.15)" }}>
                    <span style={{ color: "#16A34A", display: "flex" }}><Icons.CheckCircle /></span>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>Request fulfilled</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>This request was successfully completed.</div>
                  </div>
                </div>
              )}
              {req.status === "cancelled" && (
                <div className="status-notice">
                  <div className="notice-icon" style={{ background: "rgba(148,163,184,0.1)" }}>
                    <span style={{ color: "#94A3B8", display: "flex" }}><Icons.X size={20} /></span>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>Request cancelled</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>You cancelled this request before a responder was assigned.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Track-by-ID result card ─────
function TrackResultCard({ req, onViewInList }) {
  const CatIcon  = categoryIcons[req.category] || Icons.HeartPulse;
  const catColor = categoryColors[req.category] || { color: "#94A3B8", bg: "rgba(148,163,184,0.12)" };
  const status   = statusConfig[req.status];

  return (
    <div className="track-result fade-in">
      <div className="track-result-header">
        <div className="req-icon" style={{ background: catColor.bg, color: catColor.color }}>
          <CatIcon />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="track-result-title">
            {req.title}
            <span className="badge" style={{ background: status.color, color: status.text, borderColor: status.border }}>
              <StatusIcon status={req.status} />
              {status.label}
            </span>
          </div>
          <div className="track-result-sub">
            <span style={{ fontFamily: "monospace" }}>{req.id}</span>
            <span>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Icons.MapPin /> {req.location}</span>
            <span>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Icons.Clock /> {req.createdAt}</span>
          </div>
        </div>
        <button
          className="btn btn-outline"
          style={{ flex: "none", fontSize: 13, height: 36, padding: "0 14px" }}
          onClick={onViewInList}
        >
          View in list <Icons.ChevronRight />
        </button>
      </div>
      <div className="track-result-body">
        <Timeline steps={req.timeline} />
        <div>
          {req.responder && <ResponderCard responder={req.responder} />}
        </div>
      </div>
    </div>
  );
}

// ── TrackByID section ───────────
function TrackByID({ onViewInList }) {
  const [inputVal, setInputVal]   = useState("");
  const [trackState, setTrackState] = useState(null); // null | "loading" | { found, req }

  function handleTrack() {
    const id = inputVal.trim().toUpperCase().replace(/\s/g, "");
    if (!id) return;
    setTrackState("loading");
    setTimeout(() => {
      const req = requests.find((r) => r.id === id);
      setTrackState({ found: !!req, req: req || null, id });
    }, 420);
  }

  return (
    <div className="track-section">
      <div className="track-card">
        <div className="track-label">Track by Request ID</div>
        <div className="track-sub">Enter your request ID (e.g. REQ-2847) to instantly view its status</div>
        <div className="track-row">
          <input
            className="track-input"
            type="text"
            placeholder="e.g. REQ-2847"
            maxLength={12}
            autoComplete="off"
            spellCheck={false}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTrack()}
          />
          <button className="track-btn" onClick={handleTrack}>
            <Icons.Search /> Track
          </button>
        </div>

        {/* loading */}
        {trackState === "loading" && (
          <div className="track-loading">
            <span className="animate-spin" style={{ display: "inline-flex" }}>
              <Icons.Loader size={16} />
            </span>
            Searching…
          </div>
        )}

        {/* error */}
        {trackState && trackState !== "loading" && !trackState.found && (
          <div className="track-error">
            <Icons.AlertCircle />
            No request found for <strong style={{ fontFamily: "monospace", margin: "0 4px" }}>{trackState.id}</strong>. Please check the ID and try again.
          </div>
        )}

        {/* result */}
        {trackState && trackState !== "loading" && trackState.found && (
          <TrackResultCard
            req={trackState.req}
            onViewInList={() => onViewInList(trackState.req.id)}
          />
        )}
      </div>
    </div>
  );
}

// main page component
export default function TrackPage() {
  const [expandedId, setExpandedId] = useState("REQ-2847");
  const [tab, setTab]               = useState("all");
   const navigate = useNavigate();

  // refs for scroll-to behaviour
  const itemRefs = Object.fromEntries(requests.map((r) => [r.id, { current: null }]));

  function handleViewInList(id) {
    setExpandedId(id);
    setTab("all");
    setTimeout(() => {
      itemRefs[id]?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  }

  const filtered = requests.filter((r) => {
    if (tab === "active")    return ["matched", "in-progress", "pending"].includes(r.status);
    if (tab === "completed") return r.status === "completed";
    if (tab === "cancelled") return r.status === "cancelled";
    return true;
  });

  const activeCount    = requests.filter((r) => ["matched", "in-progress", "pending"].includes(r.status)).length;
  const completedCount = requests.filter((r) => r.status === "completed").length;

  const stats = [
    {
      label: "Active Requests", value: String(activeCount),
      color: "#E53935", bg: "rgba(229,57,53,0.12)",
      Icon: () => <span className="animate-spin" style={{ display: "inline-flex" }}><Icons.Loader size={20} /></span>,
    },
    {
      label: "Completed", value: String(completedCount),
      color: "#16A34A", bg: "rgba(22,163,74,0.12)",
      Icon: () => <Icons.CheckCircle size={20} />,
    },
    {
      label: "Avg Response", value: "2m 41s",
      color: "#7C3AED", bg: "rgba(124,58,237,0.12)",
      Icon: () => <Icons.Clock size={20} />,
    },
    {
      label: "Success Rate", value: "96%",
      color: "#D97706", bg: "rgba(217,119,6,0.12)",
      Icon: () => <Icons.PackageCheck size={20} />,
    },
  ];

  const TABS = ["all", "active", "completed", "cancelled"];

  return (
    <>
      <style>{CSS}</style>
      <div className="shell">

        {/* header */}
        <div className="shell-header">
          <div>
            <div className="shell-title">Track My Requests</div>
            <div className="shell-sub">Real-time status of all your emergency requests and deliveries</div>
          </div>
          <button className="btn btn-primary" style={{ flex: "none", width: "auto" }} onClick={()=>navigate("/request")}>
            <Icons.Plus /> New Request
          </button>
        </div>

        {/* track by ID  */}
        <TrackByID onViewInList={handleViewInList} />

        {/* summary stats */}
        <div className="summary-grid">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* request history */}
        <div className="card">
          <div className="list-header">
            <div className="list-title">Request History</div>
            <div className="tabs">
              {TABS.map((t) => (
                <button
                  key={t}
                  className={`tab ${tab === t ? "active" : ""}`}
                  onClick={() => setTab(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="req-list">
            {filtered.length === 0 && (
              <div className="empty">
                <Icons.Eye />
                <p style={{ marginTop: 12 }}>No requests found in this category.</p>
              </div>
            )}
            {filtered.map((req) => (
              <RequestItem
                key={req.id}
                req={req}
                isOpen={expandedId === req.id}
                onToggle={() => setExpandedId(expandedId === req.id ? null : req.id)}
                scrollRef={(el) => { if (itemRefs[req.id]) itemRefs[req.id].current = el; }}
              />
            ))}
          </div>
        </div>

      </div>
    </>
  );
}