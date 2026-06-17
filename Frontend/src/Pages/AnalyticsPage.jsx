import { useState, useEffect } from "react";

const kpis = [
  { emoji: "❤️", label: "Lives assisted", v: "9,632", d: "+12.4%", up: true, color: "#f56565", bg: "rgba(245,101,101,0.12)" },
  { emoji: "⏱️", label: "Avg response", v: "2m 41s", d: "−18s", up: true, color: "#a5b4fc", bg: "rgba(165,180,252,0.12)" },
  { emoji: "👥", label: "Active volunteers", v: "12,408", d: "+3.1%", up: true, color: "#4ade80", bg: "rgba(74,222,128,0.12)" },
  { emoji: "📍", label: "Cities covered", v: "247", d: "+8 new", up: true, color: "#fcd34d", bg: "rgba(252,211,77,0.12)" },
];

const donutSlices = [
  { l: "Blood", v: 32, color: "#f56565" },
  { l: "Medical", v: 24, color: "#a5b4fc" },
  { l: "Medicine", v: 18, color: "#4ade80" },
  { l: "Food", v: 14, color: "#fcd34d" },
  { l: "Other", v: 12, color: "#f97316" },
];

const responders = [
  { n: "Priya Reddy", c: "127 tasks", s: 4.98, initials: "PR" },
  { n: "Aarav Sharma", c: "94 tasks", s: 4.92, initials: "AS" },
  { n: "Sara Khan", c: "82 tasks", s: 4.89, initials: "SK" },
  { n: "Vikram Iyer", c: "71 tasks", s: 4.85, initials: "VI" },
];

const heatmap = Array.from({ length: 84 }, () => {
  const v = Math.random();
  return v < 0.2 ? 0.1 : v < 0.5 ? 0.25 : v < 0.8 ? 0.5 : 0.9;
});

function DonutChart() {
  const r = 15.9;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const slices = donutSlices.map(s => {
    const len = (s.v / 100) * circ;
    const dash = `${len} ${circ - len}`;
    const dashOffset = -offset;
    offset += len;
    return { ...s, dash, dashOffset };
  });

  return (
    <div style={{ position: "relative", width: 176, height: 176, margin: "0 auto" }}>
      <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
        {slices.map(s => (
          <circle key={s.l} cx="18" cy="18" r={r} fill="none"
            stroke={s.color} strokeWidth="4"
            strokeDasharray={s.dash}
            strokeDashoffset={s.dashOffset}
          />
        ))}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>1.2k</div>
          <div style={{ fontSize: 11, color: "rgba(232,232,240,0.45)" }}>requests</div>
        </div>
      </div>
    </div>
  );
}

function LineChart() {
  return (
    <div style={{ position: "relative", height: 220 }}>
      <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f56565" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f56565" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 120 Q 40 100 80 110 T 160 80 T 240 95 T 320 60 T 400 45 L 400 200 L 0 200 Z" fill="url(#lineGrad)" />
        <path d="M0 120 Q 40 100 80 110 T 160 80 T 240 95 T 320 60 T 400 45" stroke="#f56565" strokeWidth="2.5" fill="none" />
        <path d="M0 150 Q 60 140 120 130 T 240 125 T 360 105 L 400 100" stroke="#a5b4fc" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.6" />
      </svg>
      <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 16, fontSize: 11 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ display: "inline-block", width: 14, height: 2, background: "#f56565", borderRadius: 2 }} /> Actual
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(232,232,240,0.5)" }}>
          <span style={{ display: "inline-block", width: 14, height: 2, background: "#a5b4fc", borderRadius: 2, borderTop: "2px dashed #a5b4fc" }} /> Target
        </span>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: "#0a0a0f", color: "#e8e8f0", minHeight: "100vh" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .glass-strong { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); }
        select {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          color: #e8e8f0;
          font-size: 12px;
          padding: 6px 12px;
          outline: none;
          cursor: pointer;
          font-family: inherit;
        }
        .responder-row:hover { background: rgba(255,255,255,0.06) !important; }
        .hospital-row:hover { background: rgba(255,255,255,0.04); }
        @media (max-width: 900px) {
          .grid-4 { grid-template-columns: 1fr 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .grid-4 { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "84px 24px 60px" }}>

        {/* Page Title */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.5, marginBottom: 4 }}>Analytics & Impact</h1>
          <p style={{ fontSize: 13, color: "rgba(232,232,240,0.45)" }}>Real-time community metrics and disaster response insights.</p>
        </div>

        {/* KPI CARDS */}
        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
          {kpis.map(k => (
            <div key={k.label} className="glass-strong" style={{ borderRadius: 18, padding: "20px 20px" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: k.bg, display: "grid", placeItems: "center", fontSize: 18, marginBottom: 12 }}>{k.emoji}</div>
              <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1, lineHeight: 1 }}>{k.v}</div>
              <div style={{ fontSize: 11, color: "rgba(232,232,240,0.45)", marginTop: 4 }}>{k.label}</div>
              <div style={{ marginTop: 8, fontSize: 11, display: "flex", alignItems: "center", gap: 4, color: k.up ? "#4ade80" : "#f87171" }}>
                {k.up ? "↑" : "↓"} {k.d} this month
              </div>
            </div>
          ))}
        </div>

        {/* LINE CHART + DONUT */}
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>

          {/* Line Chart */}
          <div className="glass-strong" style={{ borderRadius: 24, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>Response time trend</h3>
                <p style={{ fontSize: 12, color: "rgba(232,232,240,0.45)", marginTop: 2 }}>Average time from SOS to first responder accepting</p>
              </div>
              <select><option>Last 30 days</option><option>Last 7 days</option><option>Last 90 days</option></select>
            </div>
            <LineChart />
            {/* X axis labels */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(232,232,240,0.3)", marginTop: 8, paddingRight: 4 }}>
              {["May 12", "May 17", "May 22", "May 27", "Jun 1", "Jun 6", "Jun 10"].map(d => <span key={d}>{d}</span>)}
            </div>
          </div>

          {/* Donut */}
          <div className="glass-strong" style={{ borderRadius: 24, padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Request mix</h3>
            <p style={{ fontSize: 12, color: "rgba(232,232,240,0.45)", marginTop: 2, marginBottom: 20 }}>By category, last 7 days</p>
            <DonutChart />
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              {donutSlices.map(s => (
                <div key={s.l} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, color: "rgba(232,232,240,0.7)" }}>{s.l}</span>
                  <span style={{ fontWeight: 700 }}>{s.v}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LEADERBOARD + HEATMAP */}
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* Top Responders */}
          <div className="glass-strong" style={{ borderRadius: 24, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <span style={{ fontSize: 18 }}>🏆</span>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Top responders this month</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {responders.map((u, i) => (
                <div
                  key={u.n}
                  className="responder-row"
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", transition: "background 0.15s", cursor: "pointer" }}
                >
                  <div style={{ width: 28, textAlign: "center", fontSize: 12, fontWeight: 700, color: i === 0 ? "#fcd34d" : "rgba(232,232,240,0.4)" }}>#{i + 1}</div>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #f56565, #9f7aea)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{u.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{u.n}</div>
                    <div style={{ fontSize: 11, color: "rgba(232,232,240,0.45)" }}>{u.c}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fcd34d" }}>★ {u.s}</div>
                </div>
              ))}
            </div>
          </div>

          {/* City Heatmap */}
          <div className="glass-strong" style={{ borderRadius: 24, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <span style={{ fontSize: 18 }}>📊</span>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>City heatmap (requests)</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 4 }}>
              {heatmap.map((op, i) => (
                <div
                  key={i}
                  title={`Intensity: ${Math.round(op * 100)}%`}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 3,
                    background: `rgba(245, 101, 101, ${op})`,
                    cursor: "default",
                  }}
                />
              ))}
            </div>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "rgba(232,232,240,0.4)" }}>
              <span>Less</span>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {[0.1, 0.25, 0.5, 0.7, 0.9].map(v => (
                  <div key={v} style={{ width: 16, height: 16, borderRadius: 3, background: `rgba(245,101,101,${v})` }} />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}