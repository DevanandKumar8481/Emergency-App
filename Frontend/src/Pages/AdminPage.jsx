import { useState } from "react";

const kpis = [
  { l: "Total users", v: "48,219", d: "+312 today", color: "#f56565" },
  { l: "Active requests", v: "1,284", d: "↑ 18% vs yest", color: "#fcd34d" },
  { l: "Pending verifications", v: "27", d: "Avg 4h SLA", color: "#a5b4fc" },
  { l: "Successful rescues", v: "9,632", d: "All-time", color: "#4ade80" },
];

const volunteers = [
  { n: "Priya Reddy", r: "Medical · Doctor", id: "MCI-9821", t: "12 min ago", initials: "PR" },
  { n: "Karan Mehta", r: "Transport", id: "DL-2204", t: "1h ago", initials: "KM" },
  { n: "Sara Khan", r: "Blood donor", id: "AAD-****72", t: "3h ago", initials: "SK" },
  { n: "Apollo Bank", r: "NGO partner", id: "REG-4421", t: "Yesterday", initials: "AB" },
];

const modQueue = [
  { t: "Suspicious blood request", s: "Flagged 3×", color: "#f56565" },
  { t: "Duplicate shelter listing", s: "AI confidence 92%", color: "#fcd34d" },
  { t: "Inappropriate image", s: "User report", color: "#f56565" },
  { t: "Possible spam donor", s: "Auto-flagged", color: "#fcd34d" },
];

const bars = [
  { l: "Blood", v: 85, color: "#f56565" },
  { l: "Medical", v: 72, color: "#f87171" },
  { l: "Transport", v: 64, color: "#a5b4fc" },
  { l: "Medicine", v: 48, color: "#4ade80" },
  { l: "Food", v: 56, color: "#fcd34d" },
  { l: "Shelter", v: 38, color: "#818cf8" },
  { l: "Rescue", v: 22, color: "#fb923c" },
];

const liveActivity = [
  { t: "Aarav S. accepted blood task", color: "#4ade80" },
  { t: "New shelter listing: Sector 14", color: "#a5b4fc" },
  { t: "Critical alert: NH-48 accident", color: "#f56565" },
  { t: "Priya R. verified as doctor", color: "#4ade80" },
  { t: "Bulk SMS sent · 4,200 users", color: "#a5b4fc" },
  { t: "Spam flag · auto-resolved", color: "#fcd34d" },
];

const quickLinks = [
  { emoji: "👥", t: "User Management", d: "48k+ users" },
  { emoji: "📄", t: "Disaster Reports", d: "Generate PDF" },
  { emoji: "🛡️", t: "NGO Partners", d: "32 verified" },
];

export default function AdminPage() {
  const [approved, setApproved] = useState({});
  const [rejected, setRejected] = useState({});
  const [dismissed, setDismissed] = useState({});

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: "#0a0a0f", color: "#e8e8f0", minHeight: "100vh" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .glass { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); }
        .glass-strong { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); }
        select {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          color: #e8e8f0;
          font-size: 12px;
          padding: 6px 12px;
          outline: none;
          font-family: inherit;
          cursor: pointer;
        }
        .icon-btn { transition: background 0.15s, transform 0.1s; cursor: pointer; border: none; }
        .icon-btn:hover { opacity: 0.85; transform: scale(1.05); }
        .row-hover:hover { background: rgba(255,255,255,0.04) !important; }
        .quick-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.3); transform: translateY(-2px); }
        .quick-card { transition: box-shadow 0.2s, transform 0.2s; cursor: pointer; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .pulse { animation: pulse 2s ease-in-out infinite; }
        @media (max-width: 900px) {
          .grid-4 { grid-template-columns: 1fr 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .grid-ql { grid-template-columns: 1fr !important; }
          .tbl-id, .tbl-time { display: none; }
        }
        @media (max-width: 500px) {
          .grid-4 { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "84px 24px 60px" }}>

        {/* Page title */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.5, marginBottom: 4 }}>Admin Control Center</h1>
          <p style={{ fontSize: 13, color: "rgba(232,232,240,0.45)" }}>Verifications, moderation, analytics and disaster reports.</p>
        </div>

        {/* KPIs -Key Performance Indicators*/}
        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
          {kpis.map(k => (
            <div key={k.l} className="glass-strong" style={{ borderRadius: 18, padding: "18px 20px" }}>
              <div style={{ fontSize: 10, color: "rgba(232,232,240,0.4)", textTransform: "uppercase", letterSpacing: 2 }}>{k.l}</div>
              <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8, letterSpacing: -1 }}>{k.v}</div>
              <div style={{ marginTop: 8, fontSize: 11, display: "flex", alignItems: "center", gap: 4, color: k.color }}>↑ {k.d}</div>
            </div>
          ))}
        </div>

        {/* Verifications + Moderation */}
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>

          {/* Verification Table */}
          <div className="glass-strong" style={{ borderRadius: 24, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>🛡️</span>
                <h3 style={{ fontSize: 17, fontWeight: 700 }}>Pending volunteer verifications</h3>
              </div>
              <button className="icon-btn" style={{ fontSize: 12, padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#e8e8f0" }}>View all</button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    {["Volunteer", "Role", "ID", "Submitted", "Action"].map((h, i) => (
                      <th key={h} style={{ textAlign: i === 4 ? "right" : "left", fontWeight: 500, fontSize: 11, color: "rgba(232,232,240,0.4)", paddingBottom: 10, paddingRight: i < 4 ? 12 : 0 }}
                        className={h === "ID" ? "tbl-id" : h === "Submitted" ? "tbl-time" : ""}
                      >{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {volunteers.map((u) => {
                    const done = approved[u.n] || rejected[u.n];
                    return (
                      <tr key={u.n} className="row-hover" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", opacity: done ? 0.45 : 1, transition: "opacity 0.3s" }}>
                        <td style={{ padding: "12px 12px 12px 0" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #f56565, #9f7aea)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{u.initials}</div>
                            <span style={{ fontWeight: 500 }}>{u.n}</span>
                          </div>
                        </td>
                        <td className="" style={{ color: "rgba(232,232,240,0.5)", paddingRight: 12 }}>{u.r}</td>
                        <td className="tbl-id" style={{ color: "rgba(232,232,240,0.4)", fontFamily: "monospace", fontSize: 11, paddingRight: 12 }}>{u.id}</td>
                        <td className="tbl-time" style={{ color: "rgba(232,232,240,0.4)", paddingRight: 12 }}>{u.t}</td>
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: 4 }}>
                            {/* View */}
                            <button className="icon-btn" style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(255,255,255,0.06)", color: "#e8e8f0", display: "grid", placeItems: "center", fontSize: 14 }} title="View">👁</button>
                            {/* Reject */}
                            {!approved[u.n] && (
                              <button className="icon-btn" onClick={() => setRejected(r => ({ ...r, [u.n]: true }))}
                                style={{ width: 30, height: 30, borderRadius: 8, background: rejected[u.n] ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.08)", color: "#f87171", display: "grid", placeItems: "center", fontSize: 14 }} title="Reject">✕</button>
                            )}
                            {/* Approve */}
                            {!rejected[u.n] && (
                              <button className="icon-btn" onClick={() => setApproved(a => ({ ...a, [u.n]: true }))}
                                style={{ width: 30, height: 30, borderRadius: 8, background: approved[u.n] ? "#16a34a" : "rgba(74,222,128,0.15)", color: approved[u.n] ? "#fff" : "#4ade80", display: "grid", placeItems: "center", fontSize: 14 }} title="Approve">✓</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>


          <div className="glass-strong" style={{ borderRadius: 24, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <span style={{ fontSize: 18 }}>⚠️</span>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Moderation queue</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {modQueue.map((m, i) => {
                if (dismissed[i]) return null;
                return (
                  <div key={m.t} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: m.color, flexShrink: 0, marginTop: 5 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.t}</div>
                      <div style={{ fontSize: 11, color: "rgba(232,232,240,0.4)", marginTop: 2 }}>{m.s}</div>
                    </div>
                    <button className="icon-btn" onClick={() => setDismissed(d => ({ ...d, [i]: true }))}
                      style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "rgba(232,232,240,0.6)", whiteSpace: "nowrap" }}>Review</button>
                  </div>
                );
              })}
              {Object.keys(dismissed).length === modQueue.length && (
                <div style={{ textAlign: "center", padding: "20px 0", fontSize: 13, color: "rgba(232,232,240,0.35)" }}>✓ Queue cleared</div>
              )}
            </div>
          </div>
        </div>

        {/* Bar Chart + Live Activity */}
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>

          {/* Bar Chart */}
          <div className="glass-strong" style={{ borderRadius: 24, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>📊</span>
                <h3 style={{ fontSize: 17, fontWeight: 700 }}>Requests by category (7 days)</h3>
              </div>
              <select><option>Last 7 days</option><option>Last 30 days</option></select>
            </div>
            <div style={{ height: 220, display: "flex", alignItems: "flex-end", gap: 10 }}>
              {bars.map(b => (
                <div key={b.l} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%" }}>
                  <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end", position: "relative" }}>
                    <div style={{ width: "100%", background: "rgba(255,255,255,0.06)", borderRadius: "6px 6px 0 0", height: "100%", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: b.color, borderRadius: "6px 6px 0 0", height: `${b.v}%`, opacity: 0.85, transition: "height 0.5s ease" }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(232,232,240,0.4)", fontWeight: 500 }}>{b.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Activity */}
          <div className="glass-strong" style={{ borderRadius: 24, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <span style={{ fontSize: 18 }}>⚡</span>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Live activity</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {liveActivity.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, paddingBottom: 12, marginBottom: 12, borderBottom: i < liveActivity.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <span className="pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, flexShrink: 0, marginTop: 3 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12 }}>{a.t}</div>
                    <div style={{ fontSize: 11, color: "rgba(232,232,240,0.35)", marginTop: 2 }}>{i + 1} min ago</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid-ql" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {quickLinks.map(x => (
            <div key={x.t} className="glass quick-card" style={{ borderRadius: 18, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #f56565, #9f7aea)", display: "grid", placeItems: "center", fontSize: 22, flexShrink: 0 }}>{x.emoji}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{x.t}</div>
                <div style={{ fontSize: 12, color: "rgba(232,232,240,0.4)", marginTop: 2 }}>{x.d}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}