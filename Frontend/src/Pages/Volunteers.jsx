import { useState } from "react";
import {
  CheckCircle2, X, MapPin, Clock, Award, Star,
  MessageSquare, Navigation, Phone, Trophy, Flame, Heart,
} from "lucide-react";

const C = {
  primary: "#E5383B",
  secondary: "#6C63FF",
  success: "#22c55e",
  warning: "#f59e0b",
  bg: "#f8f9fc",
  card: "#ffffff",
  border: "#e8eaed",
  text: "#111827",
  muted: "#6b7280",
  gradHero: "linear-gradient(135deg,#E5383B 0%,#a21caf 100%)",
  gradEmerg: "linear-gradient(135deg,#E5383B 0%,#f59e0b 100%)",
};

// CSS 
if (typeof document !== "undefined" && !document.getElementById("vol-styles")) {
  const s = document.createElement("style");
  s.id = "vol-styles";
  s.textContent = `
    @keyframes pulse-ring {
      0%   { transform:scale(1);   opacity:.55; }
      100% { transform:scale(1.8); opacity:0;   }
    }
    .badge-icon:hover { transform: scale(1.12); }
    .badge-icon { transition: transform .18s; }
    .task-card:hover { border-color: rgba(229,56,59,.35) !important; box-shadow: 0 6px 24px rgba(0,0,0,.09); }
    .task-card { transition: border-color .15s, box-shadow .15s; }
    .icon-btn:hover { opacity: .8; }
    .icon-btn { transition: opacity .15s; }
  `;
  document.head.appendChild(s);
}

// Data 
const TASKS = [
  { title: "Drop insulin pen to Mrs. Mehta", cat: "Medicine", dist: "0.8 km", eta: "9 min", pts: "+20", urg: "HIGH" },
  { title: "Drive accident victim to AIIMS", cat: "Transport", dist: "1.4 km", eta: "12 min", pts: "+35", urg: "CRITICAL" },
  { title: "Deliver 30 meal packets to shelter", cat: "Food", dist: "2.1 km", eta: "18 min", pts: "+15", urg: "MEDIUM" },
];

const BADGES = [
  { icon: Heart, label: "Saver", bg: C.primary },
  { icon: Award, label: "Quick", bg: C.secondary },
  { icon: Flame, label: "Streak", bg: C.warning },
  { icon: Star, label: "Trusted", bg: C.success },
  { icon: Trophy, label: "Hero", bg: C.primary },
  { icon: CheckCircle2, label: "Verified", bg: C.secondary },
];

const URG_STYLE = {
  CRITICAL: { bg: C.primary, color: "#fff" },
  HIGH: { bg: C.warning, color: "#fff" },
  MEDIUM: { bg: C.secondary, color: "#fff" },
};

//  Helpers
const card = (extra = {}) => ({
  background: C.card,
  border: `1px solid ${C.border}`,
  borderRadius: 24,
  padding: 24,
  boxShadow: "0 2px 12px rgba(0,0,0,.05)",
  ...extra,
});

const btn = (bg, color = "#fff", extra = {}) => ({
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
  padding: "8px 16px", borderRadius: 9, border: "none",
  background: bg, color,
  fontWeight: 600, fontSize: 13, cursor: "pointer",
  ...extra,
});

const btnOutline = (extra = {}) => ({
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5,
  padding: "8px 12px", borderRadius: 9,
  border: `1.5px solid ${C.border}`, background: "transparent",
  fontWeight: 500, fontSize: 13, cursor: "pointer", color: C.text,
  ...extra,
});

// Component 
export default function VolunteerPage() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const [onDuty, setOnDuty] = useState(true);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter','Segoe UI',sans-serif", color: C.text }}>

      {/* Header */}
      <header style={{
        background: C.card, borderBottom: `1px solid ${C.border}`,
        padding: "0 24px", height: 68,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{
          fontWeight: 800, fontSize: 20,
          background: C.gradHero,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text", letterSpacing: "-0.5px",
        }}>ResQ Link</div>
        <button
          onClick={() => setOnDuty(v => !v)}
          style={btn(onDuty ? C.success : C.muted, "#fff", { padding: "9px 18px" })}
        >
          <CheckCircle2 size={15} />
          {onDuty ? "On duty" : "Off duty"}
        </button>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px 48px" }}>
        
        <div >
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", margin: 0 }}>Volunteer Portal</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: "4px 0 24px" }}>You're saving lives. Here's what needs you right now.</p>
        </div>

        {/* Hero + Badges */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
          gap: 16, marginBottom: 20,
        }}>
          <div style={{ ...card({ padding: 32 }), position: "relative", overflow: "hidden" }}>
            <div style={{
              position: "absolute", top: -80, right: -80,
              width: 300, height: 300, borderRadius: "50%",
              background: C.gradHero, opacity: .15, filter: "blur(60px)",
            }} />
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
              {/* Avatar */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{
                  width: 88, height: 88, borderRadius: 22,
                  background: C.gradHero,
                  display: "grid", placeItems: "center",
                  color: "#fff", fontSize: 28, fontWeight: 800,
                  boxShadow: "0 8px 24px rgba(229,56,59,.35)",
                }}>AS</div>
                <span style={{
                  position: "absolute", bottom: -4, right: -4,
                  width: 30, height: 30, borderRadius: 10,
                  background: C.warning,
                  display: "grid", placeItems: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,.15)",
                }}>
                  <Trophy size={14} color="#fff" />
                </span>
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.primary, letterSpacing: 0.5 }}>
                  FIRST RESPONDER · LEVEL 3
                </div>
                <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", margin: "4px 0 8px" }}>
                  Aarav Sharma
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, fontSize: 13, color: C.muted }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Star size={14} color={C.warning} fill={C.warning} /> 4.92
                  </span>
                  <span>·</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Heart size={14} color={C.primary} /> 27 lives
                  </span>
                  <span>·</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Flame size={14} color={C.warning} /> 12-day streak
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                    <span style={{ fontWeight: 600 }}>Progress to Gold</span>
                    <span style={{ color: C.muted }}>68%</span>
                  </div>
                  <div style={{ height: 7, borderRadius: 99, background: "#e8eaed", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: "68%", background: C.gradEmerg, borderRadius: 99 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div style={card()}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>
              Badges
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              {BADGES.map(b => (
                <div key={b.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer" }}>
                  <div className="badge-icon" style={{
                    width: 48, height: 48, borderRadius: 16,
                    background: b.bg,
                    display: "grid", placeItems: "center",
                    boxShadow: `0 4px 12px ${b.bg}55`,
                  }}>
                    <b.icon size={20} color="#fff" />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: C.muted }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Available Tasks */}
        <div style={card()}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>Available tasks near you</h3>
              <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>AI-prioritized by urgency × distance × your skills</p>
            </div>
            <button style={btnOutline()}>Filters</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {TASKS.map((t, i) => {
              const urg = URG_STYLE[t.urg] || URG_STYLE.MEDIUM;
              return (
                <div key={i} className="task-card" style={{
                  padding: 20, borderRadius: 18,
                  background: C.bg, border: `1px solid ${C.border}`,
                }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                        <span style={{
                          fontSize: 10, fontWeight: 800,
                          padding: "3px 9px", borderRadius: 99,
                          background: urg.bg, color: urg.color,
                        }}>{t.urg}</span>
                        <span style={{ fontSize: 11, color: C.muted }}>{t.cat}</span>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{t.title}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, fontSize: 12, color: C.muted }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <MapPin size={11} /> {t.dist}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Clock size={11} /> {t.eta}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, color: C.success, fontWeight: 600 }}>
                          <Award size={11} /> Compassion pts {t.pts}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                      <button className="icon-btn" style={btnOutline({ padding: "8px 10px" })}>
                        <X size={15} />
                      </button>

                      <button className="icon-btn" style={btn(C.secondary, "#fff", { padding: "8px 10px" })}>
                        <Phone size={15} />
                      </button>

                      <button className="icon-btn" style={btnOutline({ padding: "8px 10px" })}>
                        <MessageSquare size={15} />
                      </button>

                      <button className="icon-btn" style={btn(C.gradEmerg, "#fff", { padding: "8px 16px", boxShadow: "0 4px 14px rgba(229,56,59,.3)" })}>
                        <Navigation size={14} /> Accept
                      </button>
                      
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}