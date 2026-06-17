import { useState } from "react";
import {
  Droplet, Truck, Pill, Utensils, Home, HeartPulse,
  Search, Layers, Navigation, Crosshair, Filter
} from "lucide-react";


const C = {
  primary: "#E5383B",
  secondary: "#6C63FF",
  success: "#22c55e",
  warning: "#f59e0b",
  bg: "#0a0a0f",
  card: "rgba(27, 25, 25, 0.18)", 
  border: "#2a2c2f", 
  text: "#e8e8f0", 
  muted: "#727885", 
  gradHero: "linear-gradient(135deg,#E5383B 0%,#a21caf 100%)",
};

const TYPE_COLOR = {
  blood: C.primary,
  medical: C.primary,
  transport: C.secondary,
  medicine: C.success,
  food: C.warning,
  shelter: C.secondary,
};

// CSS (pulse animation) 
if (typeof document !== "undefined" && !document.getElementById("map-styles")) {
  const s = document.createElement("style");
  s.id = "map-styles";
  s.textContent = `
    @keyframes pulse-ring {
      0%   { transform:scale(1);    opacity:.55; }
      100% { transform:scale(1.8);  opacity:0;   }
    }
    .map-pin-tooltip { opacity:0; transition:opacity .15s; pointer-events:none; }
    .map-pin:hover .map-pin-tooltip { opacity:1; }
  `;
  document.head.appendChild(s);
}

//  Data
const FILTERS = [
  { id: "all", label: "All", icon: Layers, color: C.text },
  { id: "blood", label: "Blood", icon: Droplet, color: C.primary },
  { id: "medical", label: "Medical", icon: HeartPulse, color: C.primary },
  { id: "transport", label: "Transport", icon: Truck, color: C.secondary },
  { id: "medicine", label: "Medicine", icon: Pill, color: C.success },
  { id: "food", label: "Food", icon: Utensils, color: C.warning },
  { id: "shelter", label: "Shelter", icon: Home, color: C.secondary },
];

const PINS = [
  { x: 22, y: 30, type: "blood", urg: true, label: "O- needed", dist: 1.2 },
  { x: 65, y: 22, type: "shelter", urg: false, label: "38 beds", dist: 2.4 },
  { x: 48, y: 55, type: "medical", urg: true, label: "Trauma case", dist: 0.8 },
  { x: 78, y: 60, type: "transport", urg: false, label: "Ambulance free", dist: 3.1 },
  { x: 35, y: 70, type: "food", urg: false, label: "200 meals/day", dist: 1.7 },
  { x: 58, y: 78, type: "medicine", urg: false, label: "Insulin available", dist: 2.9 },
  { x: 14, y: 60, type: "blood", urg: false, label: "Donor online", dist: 3.6 },
  { x: 88, y: 40, type: "shelter", urg: false, label: "Community hall", dist: 4.2 },
];

// Component 
export default function MapPage() {
  const [active, setActive] = useState("all");
  const isMobile = typeof window !== "undefined" && window.innerWidth < 900;

  const visiblePins = PINS.filter(p => active === "all" || p.type === active);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Inter','Segoe UI',sans-serif", color: C.text }}>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px 48px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", margin: 0 }}>Live Resource Map</h1>
        <p style={{ fontSize: 13, color: C.muted, margin: "4px 0 24px" }}>
          Real-time view of helpers, requests and safe zones around you.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 340px", gap: 16 }}>

          {/* ── Map canvas ── */}
          <div style={{
            position: "relative", borderRadius: 24, overflow: "hidden",
            height: "70vh", minHeight: 520,
            background: C.card, border: `1px solid ${C.border}`,
            boxShadow: "0 4px 24px rgba(0,0,0,.07)",
          }}>
            {/* Grid background */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `
                linear-gradient(to right, ${C.border} 1px, transparent 1px),
                linear-gradient(to bottom, ${C.border} 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              opacity: 0.7,
            }} />

            {/* Heatmap blobs */}
            <div style={{
              position: "absolute", inset: 0,
              background: `
                radial-gradient(ellipse at 30% 40%, rgba(229,56,59,.12) 0%, transparent 45%),
                radial-gradient(ellipse at 70% 60%, rgba(108,99,255,.12) 0%, transparent 45%)`,
            }} />

            {/* SVG roads */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0 45 Q30 50 55 35 T100 50" stroke="#d1d5db" strokeWidth="0.8" fill="none" />
              <path d="M20 0 Q25 40 40 60 T50 100" stroke="#d1d5db" strokeWidth="0.6" fill="none" />
              <path d="M70 0 L75 100" stroke="#d1d5db" strokeWidth="0.5" fill="none" />
            </svg>

            <div style={{
              position: "absolute", left: "50%", top: "50%",
              transform: "translate(-50%,-50%)",
            }}>
              <span style={{
                position: "absolute",
                width: 48, height: 48,
                top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                borderRadius: "50%",
                background: `${C.secondary}30`,
                animation: "pulse-ring 1.8s ease-out infinite",
                display: "block",
              }} />
              <span style={{
                display: "block", width: 24, height: 24, borderRadius: "50%",
                background: C.secondary, border: `4px solid ${C.card}`,
                boxShadow: "0 2px 8px rgba(0,0,0,.2)",
              }} />
            </div>

            {/* Pins */}
            {visiblePins.map((p, i) => {
              const col = TYPE_COLOR[p.type];
              const Icon = {
                blood: Droplet, medical: HeartPulse, transport: Truck,
                medicine: Pill, food: Utensils, shelter: Home,
              }[p.type];
              return (
                <div key={i} className="map-pin" style={{
                  position: "absolute",
                  left: `${p.x}%`, top: `${p.y}%`,
                  transform: "translate(-50%,-100%)",
                  cursor: "pointer",
                }}>
                  {p.urg && (
                    <span style={{
                      position: "absolute",
                      width: 40, height: 40,
                      top: "50%", left: "50%",
                      transform: "translate(-50%,-50%)",
                      borderRadius: "50%",
                      background: `${col}40`,
                      animation: "pulse-ring 1.4s ease-out infinite",
                      display: "block",
                    }} />
                  )}
                  <div style={{
                    position: "relative",
                    width: 28, height: 28, borderRadius: "50%",
                    background: col, border: `2px solid ${C.card}`,
                    display: "grid", placeItems: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,.2)",
                  }}>
                    <Icon size={13} color="#fff" />
                  </div>
                  {/* Tooltip */}
                  <div className="map-pin-tooltip" style={{
                    position: "absolute",
                    left: "50%", top: "calc(100% + 6px)",
                    transform: "translateX(-50%)",
                    background: "rgba(255,255,255,.95)",
                    backdropFilter: "blur(8px)",
                    border: `1px solid ${C.border}`,
                    borderRadius: 8, padding: "4px 10px",
                    fontSize: 11, fontWeight: 600,
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 12px rgba(0,0,0,.1)",
                    zIndex: 10,
                  }}>
                    {p.label}
                  </div>
                </div>
              );
            })}

            {/* Search overlay */}
            <div style={{
              position: "absolute", top: 14, left: 14, right: 14,
              display: "flex", gap: 8,
            }}>
              <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
                <Search size={15} color={C.muted} style={{
                  position: "absolute", left: 10, top: "50%",
                  transform: "translateY(-50%)",
                }} />
                <input
                  placeholder="Search area or pin code"
                  style={{
                    width: "100%", height: 44, padding: "0 12px 0 34px",
                    borderRadius: 12, border: `1.5px solid ${C.border}`,
                    background: "#0a0a0f",
                    backdropFilter: "blur(10px)",
                    fontSize: 14, color: C.text,
                    outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>
              <button style={{
                width: 44, height: 44, borderRadius: 12,
                background: "#0a0a0f",
                backdropFilter: "blur(10px)",
                border: `1.5px solid ${C.border}`,
                cursor: "pointer", display: "grid", placeItems: "center",
              }}>
                <Filter size={16} color={C.text} />
              </button>
            </div>

            {/* Floating controls (bottom-right) */}
            <div style={{
              position: "absolute", bottom: 60, right: 14,
              display: "flex", flexDirection: "column", gap: 8,
            }}>
              <button style={{
                width: 44, height: 44, borderRadius: 12,
                background: "rgba(23, 19, 27, 0.92)", backdropFilter: "blur(10px)",
                border: `1.5px solid ${C.border}`, cursor: "pointer",
                display: "grid", placeItems: "center",
              }}>
                <Crosshair size={16} color={C.text} />
              </button>
              <button style={{
                width: 44, height: 44, borderRadius: 12,
                background: C.gradHero, border: "none",
                cursor: "pointer", display: "grid", placeItems: "center",
                boxShadow: `0 4px 14px rgba(229,56,59,.4)`,
              }}>
                <Navigation size={16} color="#fff" />
              </button>
            </div>

            {/* Filter chips (bottom bar) */}
            <div style={{
              position: "absolute", bottom: 14, left: 14, right: 68,
              display: "flex", gap: 8, overflowX: "auto",
              paddingBottom: 2,
            }}>
              {FILTERS.map(f => {
                const isActive = active === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setActive(f.id)}
                    style={{
                      flexShrink: 0,
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "7px 12px", borderRadius: 99,
                      border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                      background: isActive ? C.text : "rgba(28, 26, 26, 0.92)",
                      color: isActive ? "#0d0b0b" : C.text,
                      backdropFilter: "blur(10px)",
                      boxShadow: isActive ? "0 2px 8px rgba(0,0,0,.2)" : "0 1px 4px rgba(0,0,0,.08)",
                      transition: "all .15s",
                    }}
                  >
                    <f.icon size={13} color={isActive ? "#1a1818" : f.color} />
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Side list */}
          <aside>
            <div style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 24, padding: 24,
              boxShadow: "0 2px 12px rgba(0,0,0,.05)",
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Within 5 km</h3>
              <p style={{ fontSize: 12, color: C.muted, margin: "4px 0 16px" }}>
                Sorted by urgency × distance
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: "60vh", overflowY: "auto" }}>
                {PINS.map((p, i) => {
                  const col = TYPE_COLOR[p.type];
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: 12, borderRadius: 14,
                      background: C.bg, border: `1px solid ${C.border}`,
                      cursor: "pointer", transition: "border-color .15s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = `${C.primary}50`}
                      onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: 12,
                        background: `${col}18`,
                        display: "grid", placeItems: "center", flexShrink: 0,
                      }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: col, display: "block" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.label}
                        </div>
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 2, textTransform: "capitalize" }}>
                          {p.type} · {p.dist.toFixed(1)} km
                        </div>
                      </div>
                      {p.urg && (
                        <span style={{
                          fontSize: 9, fontWeight: 800,
                          padding: "3px 8px", borderRadius: 99,
                          background: C.primary, color: "#fff",
                          flexShrink: 0,
                        }}>
                          URGENT
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}