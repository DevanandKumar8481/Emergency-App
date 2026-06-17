import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Droplet, Search, MapPin, Phone, Clock,
  AlertTriangle, Heart, Calendar
} from "lucide-react";

// Design tokens 
const C = {
  primary:       "#E5383B",
  primaryLight:  "#fde8e8",
  secondary:     "#6C63FF",
  secondaryLight:"#eeecff",
  success:       "#22c55e",
  successLight:  "#dcfce7",
  warning:       "#f59e0b",
  bg:            "#0a0a0f",
  card:          "rgba(255,255,255,0.06)", 
  border:        "#2e2f31",
  text:          "#e8e8f0",
  muted:         "#6c727e",
  gradHero:      "linear-gradient(135deg, #E5383B 0%, #a21caf 100%)",
  gradSecondary: "linear-gradient(135deg, #6C63FF 0%, #a21caf 100%)",
};

const S = {
  shell: {
    minHeight: "100vh",
    background: C.bg,
    fontFamily: "'Inter','Segoe UI',sans-serif",
    color: C.text,
  },
  header: {
    background: C.card,
    borderBottom: `1px solid ${C.border}`,
    padding: "0 24px",
    height: 68,
    display: "flex",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  logo: {
    fontWeight: 800, fontSize: 20,
    background: C.gradHero,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "-0.5px",
  },
  main: { maxWidth: 1200, margin: "0 auto", padding: "28px 20px 48px" },
  title: { fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", margin: 0 },
  sub:   { fontSize: 13, color: C.muted, marginTop: 4, marginBottom: 28 },
  card:  (extra = {}) => ({
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 20,
    padding: 24,
    boxShadow: "0 2px 12px rgba(0,0,0,.05)",
    ...extra,
  }),
  btnPrimary: (extra = {}) => ({
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "10px 20px", borderRadius: 10, border: "none",
    background: C.gradHero, color: "#fff",
    fontWeight: 600, fontSize: 14, cursor: "pointer",
    boxShadow: "0 4px 14px rgba(229,56,59,.35)",
    ...extra,
  }),
  btnOutline: (extra = {}) => ({
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "8px 14px", borderRadius: 9,
    border: `1.5px solid ${C.border}`, background: "transparent",
    fontWeight: 500, fontSize: 13, cursor: "pointer", color: C.text,
    ...extra,
  }),
  btnSecondary: (extra = {}) => ({
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "8px 14px", borderRadius: 9, border: "none",
    background: C.gradSecondary, color: "#fff",
    fontWeight: 500, fontSize: 13, cursor: "pointer",
    ...extra,
  }),
  input: {
    height: 44, width: "100%", padding: "0 12px 0 36px",
    borderRadius: 10, border: `1.5px solid ${C.border}`,
    fontSize: 14, background: C.card, color: C.text,
    outline: "none", boxSizing: "border-box",
  },
  select: {
    height: 44, padding: "0 14px", borderRadius: 10,
    border: `1.5px solid ${C.border}`, fontSize: 14,
    background: C.card, color: C.text, cursor: "pointer",
  },
  iconBox: (bg, size = 48, r = 12) => ({
    width: size, height: size, borderRadius: r,
    background: bg, display: "grid", placeItems: "center", flexShrink: 0,
  }),
};

const GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const DONORS = [
  { n: "Rahul Mehta",     l: "0.8 km · Connaught Pl.", last: "47 days ago",  verified: true },
  { n: "Sara Khan",       l: "1.4 km · Karol Bagh",    last: "92 days ago",  verified: true },
  { n: "Vikram Iyer",     l: "2.1 km · Saket",         last: "3 months ago", verified: true },
  { n: "Anonymous donor", l: "2.6 km · South Ext.",     last: "60 days ago",  verified: false },
];

const DRIVES = [
  { d: "Sat, Jun 14", t: "Civil Hospital · 9 AM" },
  { d: "Sun, Jun 22", t: "Red Cross Society" },
  { d: "Mon, Jul 01", t: "Apollo · World Donor Day" },
];

const STOCK = [
  { g: "O-", lvl: 18, color: C.primary },
  { g: "O+", lvl: 72, color: C.success },
  { g: "A+", lvl: 54, color: C.secondary },
  { g: "B-", lvl: 32, color: C.warning },
];

//Component
export default function DonatePage() {
  const [selectedGroup, setSelectedGroup] = useState("O-");
  const navigate = useNavigate();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div style={S.shell}>
      
      <main style={S.main}>
        <h1 style={S.title}>Blood Donation</h1>
        <p style={S.sub}>Find verified donors, blood banks and live requests.</p>

        {/* ── Search card ── */}
        <div style={S.card({ marginBottom: 20 })}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Blood group</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 8 }}>
              {GROUPS.map(b => (
                <button
                  key={b}
                  onClick={() => setSelectedGroup(b)}
                  style={{
                    padding: "10px 0", borderRadius: 12,
                    border: `2px solid ${selectedGroup === b ? C.primary : C.border}`,
                    background: selectedGroup === b ? C.gradHero : C.card,
                    color: selectedGroup === b ? "#ffffff" : C.text,
                    fontWeight: 800, fontSize: 16, cursor: "pointer",
                    boxShadow: selectedGroup === b ? "0 4px 14px rgba(229,56,59,.3)" : "none",
                    transition: "all .15s",
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginTop: 16 }}>
            <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
              <MapPin size={15} color={C.muted} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
              <input defaultValue="New Delhi" placeholder="City or pin code" style={S.input} />
            </div>
            <select style={S.select}>
              <option>Within 5 km</option>
              <option>10 km</option>
              <option>25 km</option>
            </select>
            <button style={S.btnPrimary()}>
              <Search size={15} /> Find donors
            </button>
          </div>
        </div>

        {/* ── Critical banner ── */}
        <div style={{
          borderRadius: 20, padding: "20px 24px", marginBottom: 20,
          background: `linear-gradient(to right, ${C.primaryLight}, #fef3c7)`,
          border: `1px solid ${C.primary}30`,
          display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
        }}>
          <div style={S.iconBox(C.primary)}>
            <AlertTriangle size={22} color="#fff" />
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.primary, letterSpacing: 0.5 }}>
              CRITICAL REQUEST · 8 MIN AGO
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, marginTop: 2 ,color:"#0a0a0f"}}>
              O- needed for surgery — Apollo Hospital, 1.1 km
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
              Patient: 34F · Trauma · 2 units required by 9 PM
            </div>
          </div>
          <button style={S.btnPrimary()}>
            <Heart size={15} /> I can donate
          </button>
        </div>

        {/* ── Main grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 16 }}>

          {/* Donors list */}
          <div style={S.card()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>
                Verified {selectedGroup} donors nearby
              </h3>
              <span style={{ fontSize: 12, color: C.muted }}>12 available now</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
              {DONORS.map(d => {
                const initials = d.n.split(" ").map(x => x[0]).join("").slice(0, 2);
                return (
                  <div key={d.n} style={{
                    padding: 16, borderRadius: 14, background: C.bg,
                    border: `1px solid ${C.border}`,
                  }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ position: "relative" }}>
                        <div style={{
                          ...S.iconBox(C.gradHero),
                          color: "#fff", fontWeight: 700, fontSize: 13,
                        }}>
                          {initials}
                        </div>
                        <span style={{
                          position: "absolute", bottom: -4, right: -4,
                          width: 22, height: 22, borderRadius: "50%",
                          background: C.primary, color: "#fff",
                          fontSize: 9, fontWeight: 800,
                          display: "grid", placeItems: "center",
                          border: `2px solid ${C.card}`,
                        }}>
                          {selectedGroup}
                        </span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 700, fontSize: 14 }}>{d.n}</span>
                          {d.verified && (
                            <span style={{
                              fontSize: 9, fontWeight: 700, padding: "2px 6px",
                              borderRadius: 6, background: C.successLight, color: C.success,
                            }}>✓ KYC</span>
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}>
                          <MapPin size={11} /> {d.l}
                        </div>
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                          <Clock size={11} /> Last donated {d.last}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button style={S.btnOutline({ flex: 1, justifyContent: "center" })}>
                        <Phone size={13} /> Call
                      </button>
                      <button style={S.btnSecondary({ flex: 1, justifyContent: "center" })}>
                        Request
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right rail */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Become a donor */}
            <div style={S.card()}>
              <Droplet size={28} color={C.primary} />
              <h3 style={{ fontSize: 17, fontWeight: 800, margin: "10px 0 4px" }}>Become a donor</h3>
              <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, margin: 0 }}>
                It takes 8 minutes. You'll be notified only when there's an urgent need near you.
              </p>
              <button style={{ ...S.btnPrimary(), width: "100%", justifyContent: "center", marginTop: 14 }} onClick={() => navigate("/becomeDonor")}>
                Register as donor
              </button>
            </div>

            {/* Blood drives */}
            <div style={S.card()}>
              <Calendar size={22} color={C.secondary} />
              <h3 style={{ fontSize: 15, fontWeight: 800, margin: "10px 0 12px" }}>Upcoming blood drives</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {DRIVES.map(e => (
                  <div key={e.d} style={{
                    display: "flex", gap: 12,
                    padding: "8px 10px", borderRadius: 10,
                    background: C.bg,
                  }}>
                    <div style={{ width: 3, borderRadius: 99, background: C.secondary, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{e.d}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{e.t}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blood bank stock */}
            <div style={S.card()}>
              <h3 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 14px" }}>Blood bank stock</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {STOCK.map(b => (
                  <div key={b.g}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700 }}>{b.g}</span>
                      <span style={{ color: C.muted }}>{b.lvl}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 99, background: C.border, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${b.lvl}%`, background: b.color, borderRadius: 99 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}