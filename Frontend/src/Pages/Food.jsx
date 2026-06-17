import { useState } from "react";
import {
  Utensils, Search, MapPin, Clock, Star, Shield,
  AlertTriangle, ChevronRight, Info, Phone, Navigation,
  TrendingUp, TrendingDown, Minus,
} from "lucide-react";


const C = {
  primary:   "#ff4d4f",
  secondary: "#8b5cf6",
  success:   "#22c55e",
  warning:   "#f59e0b",
  bg:        "#000000",
  card:      "#111111",
  border:    "#2a2a2a",
  text:      "#ffffff",
  muted:     "#b3b3b3",
  accent:    "#f59e0b",
  accentBg:  "#1a1a1a",
  gradHero:  "linear-gradient(135deg,#f59e0b 0%,#ef4444 100%)",
};
// CSS 
if (typeof document !== "undefined" && !document.getElementById("food-styles")) {
  const s = document.createElement("style");
  s.id = "food-styles";
  s.textContent = `
    @keyframes pulse-ring {
      0%   { transform:scale(1);   opacity:.55; }
      100% { transform:scale(1.8); opacity:0;   }
    }
    .item-card:hover { box-shadow:0 8px 28px rgba(0,0,0,.1); transform:translateY(-2px); }
    .item-card       { transition: box-shadow .2s, transform .2s; }
    .chip:hover      { background: #f59e0b !important; color:#fff !important; }
    .chip            { transition: background .15s, color .15s; cursor:pointer; }
    .tip-card:hover  { box-shadow:0 4px 16px rgba(0,0,0,.08); }
    .tip-card        { transition: box-shadow .2s; }
  `;
  document.head.appendChild(s);
}

// Data 
const FILTER_CHIPS = ["Cooked","Dry ration","Baby food","Vegetarian","Halal","Jain"];

const STATS = [
  { label: "Kitchens live",  value: "21",    tone: "ok"   },
  { label: "Meals avail.",   value: "3.4k",  tone: "ok"   },
  { label: "Open requests",  value: "7",     tone: "warn" },
  { label: "Served today",   value: "9,820", tone: "none" },
];

const ITEMS = [
  {
    name: "Akshaya Patra Kitchen",
    meta: "Bawana · Hot meals · Vegetarian",
    distanceKm: 6.4, available: 1200, capacity: 2000, unit: "meals",
    rating: 4.9, verified: true, status: "live",
    tags: ["Cooked","Vegetarian"],
  },
  {
    name: "Gurdwara Bangla Sahib · Langar",
    meta: "Free 24×7 · Walk-in or collect",
    distanceKm: 3.2, available: 600, capacity: 1000, unit: "meals",
    rating: 5.0, verified: true, status: "live",
    tags: ["Cooked","Vegetarian"],
  },
  {
    name: "Robin Hood Army · South cell",
    meta: "Surplus pickup from restaurants tonight",
    distanceKm: 1.7, available: 180, capacity: 250, unit: "packets",
    rating: 4.8, verified: true, status: "live",
    tags: ["Cooked","Halal"], eta: "30 min",
  },
  {
    name: "Feeding India · Ration drive",
    meta: "5kg ration kits · Family of 4 for a week",
    distanceKm: 4.0, available: 40, capacity: 120, unit: "kits",
    rating: 4.7, verified: true, status: "low",
    tags: ["Dry ration"],
  },
  {
    name: "Anjali — Home cook donor",
    meta: "20 baby food bowls (6-12 months) ready",
    distanceKm: 0.7, available: 20, unit: "bowls",
    rating: 4.9, verified: true, status: "live",
    tags: ["Baby food","Jain"], eta: "10 min",
  },
];

const TIPS = [
  { title: "Pickup window",      body: "Cooked food must be consumed within 4 hours of preparation." },
  { title: "Dietary tags",       body: "Filter by Jain, Halal or allergen-free to match recipients." },
  { title: "Logistics partner",  body: "Tag a transport volunteer to move bulk packets safely." },
];

//  Helpers 
const card = (extra = {}) => ({
  background: C.card, border: `1px solid ${C.border}`,
  borderRadius: 20, padding: 24,
  boxShadow: "0 2px 12px rgba(0,0,0,.05)", ...extra,
});

const statusCfg = {
  live: { dot: C.success,  label: "Live",     bg: "#dcfce7", color: C.success  },
  low:  { dot: C.warning,  label: "Low stock", bg: "#fef3c7", color: C.warning  },
  full: { dot: C.primary,  label: "Full",      bg: "#fde8e8", color: C.primary  },
};

function StatusBadge({ status }) {
  const cfg = statusCfg[status] || statusCfg.live;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:99,
      background:cfg.bg, color:cfg.color,
    }}>
      <span style={{
        width:6, height:6, borderRadius:"50%", background:cfg.dot,
        ...(status==="live" ? { animation:"pulse-ring 1.6s ease-out infinite", display:"inline-block" } : {}),
      }} />
      {cfg.label}
    </span>
  );
}

function StatTone({ tone }) {
  if (tone === "ok")   return <TrendingUp   size={13} color={C.success} />;
  if (tone === "warn") return <TrendingDown  size={13} color={C.warning} />;
  return <Minus size={13} color={C.muted} />;
}

function CapacityBar({ available, capacity, status }) {
  if (!capacity) return null;
  const pct = Math.round((available / capacity) * 100);
  const barColor = status === "low" ? C.warning : status === "full" ? C.primary : C.success;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
        <span style={{ color:C.muted }}>{available} / {capacity} {""}</span>
        <span style={{ fontWeight:600, color:barColor }}>{pct}%</span>
      </div>
      <div style={{ height:5, borderRadius:99, background:C.border, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:barColor, borderRadius:99 }} />
      </div>
    </div>
  );
}

// Main Component 
export default function Food() {
  const [search, setSearch]     = useState("");
  const [activeChips, setChips] = useState([]);

  function toggleChip(chip) {
    setChips(prev => prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]);
  }

  const filtered = ITEMS.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                        item.meta.toLowerCase().includes(search.toLowerCase());
    const matchChips  = activeChips.length === 0 ||
                        activeChips.every(c => item.tags.includes(c));
    return matchSearch && matchChips;
  });

  const isMobile = typeof window !== "undefined" && window.innerWidth < 900;

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Inter','Segoe UI',sans-serif", color:C.text }}>


      <main style={{ maxWidth:1200, margin:"0 auto", padding:"28px 20px 56px" }}>

        {/* ── Page title ── */}
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:6 }}>
          <div style={{
            width:48, height:48, borderRadius:14,
            background:C.accentBg, display:"grid", placeItems:"center",
          }}>
            <Utensils size={22} color={C.accent} />
          </div>
          <div>
            <h1 style={{ fontSize:26, fontWeight:800, letterSpacing:"-0.5px", margin:0 }}>
              Live Food Packets
            </h1>
            <p style={{ fontSize:13, color:C.muted, marginTop:2 }}>
              Community kitchens, NGO food banks and individual donors with ready meals.
            </p>
          </div>
        </div>

        {/* ── Stats strip ── */}
        <div style={{
          display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",
          gap:12, margin:"20px 0",
        }}>
          {STATS.map(s => (
            <div key={s.label} style={card({ padding:"16px 18px" })}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:11, color:C.muted, fontWeight:500 }}>{s.label}</span>
                <StatTone tone={s.tone} />
              </div>
              <div style={{ fontSize:24, fontWeight:800 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* ── Critical banner ── */}
        <div style={{
          borderRadius:20, padding:"18px 22px", marginBottom:20,
          background:"linear-gradient(to right,#fef3c7,#fde8e8)",
          border:`1px solid ${C.warning}40`,
          display:"flex", alignItems:"center", gap:16, flexWrap:"wrap",
        }}>
          <div style={{ width:44, height:44, borderRadius:12, background:C.warning, display:"grid", placeItems:"center", flexShrink:0 }}>
            <AlertTriangle size={20} color="#fff" />
          </div>
          <div style={{ flex:1, minWidth:220 }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.warning, letterSpacing:.5 }}>CRITICAL REQUEST · RIGHT NOW</div>
            <div style={{ fontSize:16, fontWeight:800, marginTop:2 }}>
              Flood relief shelter needs 400 meals tonight — Yamuna Bank
            </div>
            <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>
              Distribution at 8:30 PM · Vegetarian only
            </div>
          </div>
          <button style={{
            padding:"10px 20px", borderRadius:10, border:"none",
            background:C.gradHero, color:"#fff",
            fontWeight:700, fontSize:14, cursor:"pointer",
            boxShadow:"0 4px 14px rgba(245,158,11,.35)",
            flexShrink:0,
          }}>
            Pledge meals
          </button>
        </div>

        {/* ── Search + Chips ── */}
        <div style={card({ marginBottom:20 })}>
          {/* Search */}
          <div style={{ position:"relative", marginBottom:14 }}>
            <Search size={15} color={C.muted} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search kitchen, NGO or meal type..."
              style={{
                width:"100%", height:44, padding:"0 12px 0 36px",
                borderRadius:11, border:`1.5px solid ${C.border}`,
                fontSize:14, color:C.text, background:C.bg,
                outline:"none", boxSizing:"border-box",
              }}
            />
          </div>
          {/* Filter chips */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {FILTER_CHIPS.map(chip => {
              const active = activeChips.includes(chip);
              return (
                <button
                  key={chip}
                  className="chip"
                  onClick={() => toggleChip(chip)}
                  style={{
                    padding:"6px 14px", borderRadius:99, fontSize:13, fontWeight:600,
                    border:`1.5px solid ${active ? C.accent : C.border}`,
                    background: active ? C.accent : C.card,
                    color: active ? "#fff" : C.text,
                  }}
                >{chip}</button>
              );
            })}
          </div>
        </div>

        {/* ── Main grid ── */}
        <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"2fr 1fr", gap:16, alignItems:"start" }}>

          {/* Items list */}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ fontSize:13, color:C.muted, fontWeight:500, marginBottom:4 }}>
              {filtered.length} results · sorted by distance
            </div>
            {filtered.length === 0 && (
              <div style={card({ textAlign:"center", padding:40, color:C.muted })}>
                No results match your filters.
              </div>
            )}
            {filtered.map((item, i) => (
              <div key={i} className="item-card" style={card()}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                  
                  <div style={{
                    width:48, height:48, borderRadius:14, background:C.accentBg,
                    display:"grid", placeItems:"center", flexShrink:0,
                  }}>
                    <Utensils size={20} color={C.accent} />
                  </div>

                  {/* Info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                      <span style={{ fontWeight:700, fontSize:15 }}>{item.name}</span>
                      {item.verified && (
                        <span style={{ fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:6, background:"#dcfce7", color:C.success }}>
                          ✓ Verified
                        </span>
                      )}
                      <StatusBadge status={item.status} />
                    </div>
                    <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>{item.meta}</div>

                    {/* Tags */}
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:8 }}>
                      {item.tags.map(t => (
                        <span key={t} style={{
                          fontSize:11, fontWeight:600, padding:"2px 9px", borderRadius:99,
                          background:C.accentBg, color:C.accent,
                        }}>{t}</span>
                      ))}
                    </div>

                    {/* Capacity bar */}
                    {item.capacity && (
                      <CapacityBar available={item.available} capacity={item.capacity} status={item.status} />
                    )}

                    {/* Meta row */}
                    <div style={{ display:"flex", flexWrap:"wrap", gap:14, marginTop:10, fontSize:12, color:C.muted }}>
                      <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                        <MapPin size={11} /> {item.distanceKm} km
                      </span>
                      {item.eta && (
                        <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                          <Clock size={11} /> {item.eta}
                        </span>
                      )}
                      <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                        <Star size={11} color={C.warning} fill={C.warning} /> {item.rating}
                      </span>
                      <span style={{ fontWeight:600, color:C.accent }}>
                        {item.available} {item.unit} ready
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display:"flex", gap:8, marginTop:14, flexWrap:"wrap" }}>
                  <button style={{
                    flex:1, padding:"9px 0", borderRadius:9,
                    border:`1.5px solid ${C.border}`, background:"transparent",
                    fontSize:13, fontWeight:600, cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:5,
                  }}><Phone size={13} /> Contact</button>
                  <button style={{
                    flex:1, padding:"9px 0", borderRadius:9,
                    border:`1.5px solid ${C.border}`, background:"transparent",
                    fontSize:13, fontWeight:600, cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:5,
                  }}><Navigation size={13} /> Directions</button>
                  <button style={{
                    flex:2, padding:"9px 0", borderRadius:9, border:"none",
                    background:C.gradHero, color:"#fff",
                    fontSize:13, fontWeight:700, cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:5,
                    boxShadow:"0 4px 12px rgba(245,158,11,.3)",
                  }}>
                    Request food <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
       
            <div style={card()}>
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:14 }}>
                <Info size={16} color={C.accent} />
                <span style={{ fontWeight:800, fontSize:15 }}>Tips & guidelines</span>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {TIPS.map(tip => (
                  <div key={tip.title} className="tip-card" style={{
                    padding:"12px 14px", borderRadius:12,
                    background:C.bg, border:`1px solid ${C.border}`,
                  }}>
                    <div style={{ fontSize:13, fontWeight:700, marginBottom:4 }}>{tip.title}</div>
                    <div style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>{tip.body}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Become a donor */}
            <div style={card({ background:C.accentBg, border:`1px solid ${C.accent}30` })}>
              <Utensils size={26} color={C.accent} />
              <h3 style={{ fontSize:16, fontWeight:800, margin:"10px 0 6px" }}>
                Have spare food?
              </h3>
              <p style={{ fontSize:12, color:C.muted, lineHeight:1.6, margin:"0 0 14px" }}>
                List your home-cooked meals, restaurant surplus or ration kits — connect directly with those who need it.
              </p>
              <button style={{
                width:"100%", padding:"11px 0", borderRadius:10, border:"none",
                background:C.gradHero, color:"#fff",
                fontSize:14, fontWeight:700, cursor:"pointer",
              }}>
                List food resource
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}