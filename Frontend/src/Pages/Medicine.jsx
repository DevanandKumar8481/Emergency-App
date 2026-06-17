import { useState } from "react";
import {
  Pill, Search, MapPin, Clock, Star, AlertTriangle,
  ChevronRight, Info, Phone, Navigation,
  TrendingUp, TrendingDown, Minus,
} from "lucide-react";


const C = {
  primary:  "#E5383B",
  success:  "#22c55e",
  warning:  "#f59e0b",
  bg:       "#0a0a0f",      
  card:     "#111118",      
  border:   "#2a2a3a",      
  text:     "#e8e8f0",     
  muted:    "#8b8ba0",     
  accent:   "#E5383B",
  accentBg: "#fde8e8",
  gradient: "linear-gradient(135deg,#E5383B 0%,#a21caf 100%)",
};
//css
if (typeof document !== "undefined" && !document.getElementById("med-avail-styles")) {
  const s = document.createElement("style");
  s.id = "med-avail-styles";
  s.textContent = `
    @keyframes pulse-ring {
      0%   { transform:scale(1);   opacity:.55; }
      100% { transform:scale(1.8); opacity:0;   }
    }
    .md-item:hover { box-shadow:0 8px 28px rgba(0,0,0,.1); transform:translateY(-2px); }
    .md-item       { transition:box-shadow .2s,transform .2s; }
    .md-chip:hover { opacity:.85; }
    .md-chip       { transition:opacity .15s,background .15s,color .15s; cursor:pointer; }
    .md-tip:hover  { box-shadow:0 4px 14px rgba(0,0,0,.07); }
    .md-tip        { transition:box-shadow .18s; }
    .md-btn:hover  { opacity:.85; }
    .md-btn        { transition:opacity .15s; }
  `;
  document.head.appendChild(s);
}

// Data
const FILTER_CHIPS = ["Insulin","Antibiotics","Inhalers","Oncology","Pediatric","Vaccines"];

const STATS = [
  { label: "Pharmacies live",  value: "54",  tone: "ok"  },
  { label: "Critical SKUs",    value: "3",   tone: "bad" },
  { label: "Donors",           value: "19",  tone: null  },
  { label: "Requests solved",  value: "212", tone: "ok"  },
];

const ITEMS = [
  { name: "MedPlus Pharmacy · 24×7",      meta: "Karol Bagh · Cold-chain certified",              distanceKm: 1.0, available: 38,  capacity: 60,  unit: "strips", rating: 4.8, verified: true, status: "live",     tags: ["Insulin","Antibiotics","Inhalers"], eta: "8 min"  },
  { name: "Apollo Hospital Pharmacy",      meta: "Sarita Vihar · Includes oncology stock",         distanceKm: 4.2, available: 12,  capacity: 50,  unit: "units",  rating: 4.7, verified: true, status: "low",      tags: ["Oncology","Vaccines"] },
  { name: "Priya Sharma — Surplus donor",  meta: "Lajpat Nagar · 2 sealed Lantus pens (Exp 2027)", distanceKm: 1.8, available: 2,   unit: "pens",   rating: 5.0, verified: true, status: "critical", tags: ["Insulin"], eta: "14 min" },
  { name: "Wellness Forever · Saket",      meta: "Open till midnight · Pediatric specialist",      distanceKm: 3.1, available: 84,  capacity: 120, unit: "items",  rating: 4.6, verified: true, status: "live",     tags: ["Pediatric","Antibiotics"] },
  { name: "Govt. Jan Aushadhi Kendra",     meta: "Generic medicines at 70% off MRP",               distanceKm: 2.3, available: 210, capacity: 300, unit: "items",  rating: 4.4, verified: true, status: "live",     tags: ["Antibiotics","Inhalers"] },
];

const TIPS = [
  { title: "Show prescription", body: "Schedule H / X medicines require a valid prescription." },
  { title: "Cold-chain meds",   body: "Insulin and vaccines must stay between 2-8°C in transit." },
  { title: "Generics save",     body: "Jan Aushadhi sells the same molecules 70% cheaper." },
];

//  Helpers
const STATUS_CFG = {
  live:     { dot: "#22c55e", label: "Live",      bg: "#dcfce7", color: "#22c55e" },
  low:      { dot: "#f59e0b", label: "Low stock", bg: "#fef3c7", color: "#f59e0b" },
  critical: { dot: "#E5383B", label: "Critical",  bg: "#fde8e8", color: "#E5383B" },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.live;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:99,
      background:cfg.bg, color:cfg.color,
    }}>
      <span style={{
        width:6, height:6, borderRadius:"50%", background:cfg.dot, display:"inline-block",
        ...(status==="live" ? { animation:"pulse-ring 1.6s ease-out infinite" } : {}),
      }} />
      {cfg.label}
    </span>
  );
}

function CapacityBar({ available, capacity }) {
  if (!capacity) return null;
  const pct = Math.min(100, Math.round((available / capacity) * 100));
  const color = pct < 25 ? C.warning : C.accent;
  return (
    <div style={{ marginTop:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
        <span style={{ color:C.muted }}>{available} / {capacity}</span>
        <span style={{ fontWeight:700, color }}>{pct}%</span>
      </div>
      <div style={{ height:5, borderRadius:99, background:C.border, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:99 }} />
      </div>
    </div>
  );
}

function StatTone({ tone }) {
  if (tone === "ok")  return <TrendingUp  size={13} color={C.success} />;
  if (tone === "bad") return <TrendingDown size={13} color={C.primary} />;
  return <Minus size={13} color={C.muted} />;
}

const card = (extra = {}) => ({
  background: C.card, border:`1px solid ${C.border}`,
  borderRadius:20, padding:24,
  boxShadow:"0 2px 12px rgba(0,0,0,.05)", ...extra,
});

// Component 
export default function Medicine() {
  const [search, setSearch]     = useState("");
  const [activeChips, setChips] = useState([]);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 900;

  function toggleChip(c) {
    setChips(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  }

  const filtered = ITEMS.filter(item => {
    const q = search.toLowerCase();
    const matchSearch = item.name.toLowerCase().includes(q) || item.meta.toLowerCase().includes(q);
    const matchChips  = activeChips.length === 0 || activeChips.every(c => item.tags.includes(c));
    return matchSearch && matchChips;
  });

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Inter','Segoe UI',sans-serif", color:C.text }}>

      <main style={{ maxWidth:1200, margin:"0 auto", padding:"28px 20px 56px" }}>

        {/* Title */}
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:6 }}>
          <div style={{ width:50, height:50, borderRadius:14, background:C.accentBg, display:"grid", placeItems:"center" }}>
            <Pill size={22} color={C.accent} />
          </div>
          <div>
            <h1 style={{ fontSize:26, fontWeight:800, letterSpacing:"-0.5px", margin:0 }}>Live Medicine Availability</h1>
            <p style={{ fontSize:13, color:C.muted, margin:"2px 0 0" }}>Verified pharmacies, hospital stocks and individual donors with surplus medicines.</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:12, margin:"20px 0" }}>
          {STATS.map(s => (
            <div key={s.label} style={card({ padding:"16px 18px" })}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                <span style={{ fontSize:11, color:C.muted }}>{s.label}</span>
                <StatTone tone={s.tone} />
              </div>
              <div style={{ fontSize:24, fontWeight:800 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Critical banner */}
        <div style={{
          borderRadius:20, padding:"18px 22px", marginBottom:20,
          background:"linear-gradient(to right,#fde8e8,#faf5ff)",
          border:`1px solid ${C.accent}40`,
          display:"flex", alignItems:"center", gap:16, flexWrap:"wrap",
        }}>
          <div style={{ width:44, height:44, borderRadius:12, background:C.accent, display:"grid", placeItems:"center", flexShrink:0 }}>
            <AlertTriangle size={20} color="#fff" />
          </div>
          <div style={{ flex:1, minWidth:220 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.accent, letterSpacing:.5 }}>CRITICAL · RIGHT NOW</div>
            <div style={{ fontSize:16, fontWeight:800, marginTop:2 }}>Insulin Lantus 100IU short citywide — 3 verified suppliers left</div>
            <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>Diabetic ICU patient · Need by 6 PM</div>
          </div>
          <button className="md-btn" style={{
            padding:"10px 20px", borderRadius:10, border:"none",
            background:C.gradient, color:"#fff",
            fontWeight:700, fontSize:14, cursor:"pointer",
            boxShadow:`0 4px 14px ${C.accent}55`, flexShrink:0,
          }}>Reserve unit</button>
        </div>

        {/* Search + Chips */}
        <div style={card({ marginBottom:20 })}>
          <div style={{ position:"relative", marginBottom:14 }}>
            <Search size={15} color={C.muted} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search medicine, brand or condition…"
              style={{
                width:"100%", height:44, padding:"0 12px 0 36px",
                borderRadius:11, border:`1.5px solid ${C.border}`,
                fontSize:14, color:C.text, background:C.bg,
                outline:"none", boxSizing:"border-box",
              }}
            />
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {FILTER_CHIPS.map(chip => {
              const on = activeChips.includes(chip);
              return (
                <button key={chip} className="md-chip" onClick={() => toggleChip(chip)} style={{
                  padding:"6px 14px", borderRadius:99, fontSize:13, fontWeight:600,
                  border:`1.5px solid ${on ? C.accent : C.border}`,
                  background: on ? C.accent : C.card,
                  color: on ? "#fff" : C.text,
                }}>{chip}</button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"2fr 1fr", gap:16, alignItems:"start" }}>

          {/* Items */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ fontSize:13, color:C.muted, marginBottom:4 }}>{filtered.length} results · sorted by distance</div>
            {filtered.length === 0 && (
              <div style={card({ textAlign:"center", padding:40, color:C.muted })}>No results match your filters.</div>
            )}
            {filtered.map((item, i) => (
              <div key={i} className="md-item" style={card()}>
                <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:C.accentBg, display:"grid", placeItems:"center", flexShrink:0 }}>
                    <Pill size={20} color={C.accent} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                      <span style={{ fontWeight:700, fontSize:15 }}>{item.name}</span>
                      {item.verified && (
                        <span style={{ fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:6, background:"#dcfce7", color:C.success }}>✓ Verified</span>
                      )}
                      <StatusBadge status={item.status} />
                    </div>
                    <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>{item.meta}</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:8 }}>
                      {item.tags.map(t => (
                        <span key={t} style={{ fontSize:11, fontWeight:600, padding:"2px 9px", borderRadius:99, background:C.accentBg, color:C.accent }}>{t}</span>
                      ))}
                    </div>
                    <CapacityBar available={item.available} capacity={item.capacity} />
                    <div style={{ display:"flex", flexWrap:"wrap", gap:14, marginTop:10, fontSize:12, color:C.muted }}>
                      <span style={{ display:"flex", alignItems:"center", gap:4 }}><MapPin size={11} /> {item.distanceKm} km</span>
                      {item.eta && <span style={{ display:"flex", alignItems:"center", gap:4 }}><Clock size={11} /> {item.eta}</span>}
                      <span style={{ display:"flex", alignItems:"center", gap:4 }}><Star size={11} color={C.warning} fill={C.warning} /> {item.rating}</span>
                      <span style={{ fontWeight:600, color:C.accent }}>{item.available} {item.unit} in stock</span>
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:8, marginTop:14, flexWrap:"wrap" }}>
                  <button className="md-btn" style={{ flex:1, padding:"9px 0", borderRadius:9, border:`1.5px solid ${C.border}`, background:"transparent", fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}><Phone size={13} /> Contact</button>
                  <button className="md-btn" style={{ flex:1, padding:"9px 0", borderRadius:9, border:`1.5px solid ${C.border}`, background:"transparent", fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}><Navigation size={13} /> Directions</button>
                  <button className="md-btn" style={{ flex:2, padding:"9px 0", borderRadius:9, border:"none", background:C.gradient, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5, boxShadow:`0 4px 12px ${C.accent}40` }}>
                    Reserve unit <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right rail */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={card()}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:14 }}>
                <Info size={16} color={C.accent} />
                <span style={{ fontWeight:800, fontSize:15 }}>Tips & guidelines</span>
              </div>
              {TIPS.map(tip => (
                <div key={tip.title} className="md-tip" style={{ padding:"12px 14px", borderRadius:12, background:C.bg, border:`1px solid ${C.border}`, marginBottom:10 }}>
                  <div style={{ fontSize:13, fontWeight:700, marginBottom:4 }}>{tip.title}</div>
                  <div style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>{tip.body}</div>
                </div>
              ))}
            </div>
            <div style={card({ background:C.accentBg, border:`1px solid ${C.accent}30` })}>
              <Pill size={26} color={C.accent} />
              <h3 style={{ fontSize:16, fontWeight:800, margin:"10px 0 6px" }}>Have surplus medicines?</h3>
              <p style={{ fontSize:12, color:C.muted, lineHeight:1.6, margin:"0 0 14px" }}>
                List sealed, unexpired medicines and connect directly with those who need them most.
              </p>
              <button className="md-btn" style={{ width:"100%", padding:"11px 0", borderRadius:10, border:"none", background:C.gradient, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer" }}>
                List a medicine
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}