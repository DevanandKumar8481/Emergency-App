import { useNavigate } from "react-router-dom";
import { useState } from "react";
import heroPhoto from "../assets/photo.jpg";

const resources = [
  { emoji: "🩸", label: "Blood Donors", color: "#e53e3e", bg: "#fff5f5", path: "/donate" },
  { emoji: "🚚", label: "Transport", color: "#3182ce", bg: "#ebf8ff", path: "/transport" },
  { emoji: "💊", label: "Medicines", color: "#38a169", bg: "#f0fff4", path: "/medicine" },
  { emoji: "🍱", label: "Food Packets", color: "#d69e2e", bg: "#fffff0", path: "/food" },
  { emoji: "🏠", label: "Shelter", color: "#805ad5", bg: "#faf5ff", path: "/shelter" },
];

const stats = [
  { value: "4.2 Cr+", label: "People affected annually", sub: "across India" },
  { value: "68%", label: "Resource coordination failures", sub: "in major disasters" },
  { value: "< 3 min", label: "Target response time", sub: "AI-matched dispatch" },
  { value: "5", label: "Emergency categories", sub: "covered end-to-end" },
];

const steps = [
  { n: "01", emoji: "🔔", title: "Create Request", desc: "Tap once. Share location, urgency and resource type." },
  { n: "02", emoji: "🧠", title: "AI Finds Help", desc: "Our priority engine ranks the nearest verified providers." },
  { n: "03", emoji: "⚡", title: "Real-Time Match", desc: "Both parties get a live thread, ETA and navigation." },
  { n: "04", emoji: "🛡️", title: "Resource Delivered", desc: "Confirmation, feedback, and impact logged on-chain-of-trust." },
];

const metrics = [
  { label: "Urgency Score", value: 94, color: "#e53e3e" },
  { label: "Match Confidence", value: 88, color: "#3182ce" },
  { label: "ETA Accuracy", value: 76, color: "#38a169" },
];

const liveStats = [
  { v: "248", l: "Donors" },
  { v: "42", l: "Shelters" },
  { v: "117", l: "Vehicles" },
];


const Landing = () => {
  const navigate = useNavigate();
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: "#0a0a0f", color: "#e8e8f0", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        .btn-primary {
          background: linear-gradient(135deg, #e53e3e, #c53030);
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: opacity 0.2s, transform 0.1s;
        }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-outline {
          background: transparent;
          color: #e8e8f0;
          border: 1px solid rgba(255,255,255,0.25);
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s;
        }
        .btn-outline:hover { background: rgba(255,255,255,0.08); }
        .glass {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
        }
        .glass-strong {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(16px);
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .pulse-ring { animation: pulse-ring 2s infinite; }
        .float-slow { animation: float 4s ease-in-out infinite; }
        .text-gradient {
          background: linear-gradient(135deg, #f56565, #ed64a6, #9f7aea);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .resource-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .resource-card { transition: transform 0.2s, box-shadow 0.2s; }
        .step-card:hover { transform: translateY(-2px); }
        .step-card { transition: transform 0.2s; }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .resources-grid { grid-template-columns: 1fr 1fr !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .ai-map-grid { grid-template-columns: 1fr !important; }
          .hero-h1 { font-size: 36px !important; }
          .floating-card { display: none !important; }
        }
      `}</style>


      <section style={{ paddingTop: 120, paddingBottom: 80, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 80, right: "5%", width: 500, height: 500, borderRadius: "50%", background: "rgba(229,62,62,0.08)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: "5%", width: 400, height: 400, borderRadius: "50%", background: "rgba(99,102,241,0.07)", filter: "blur(60px)", pointerEvents: "none" }} />

        <div className="hero-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <div className="glass" style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999, padding: "6px 16px", fontSize: 12, fontWeight: 600, marginBottom: 24 }}>

              <span style={{
                position: "relative", display: "inline-flex", width: 8, height: 8
              }} >
                <span
                  className="pulse-ring" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#f56565", opacity: 0.6 }} />
                <span style={{ position: "relative", width: 8, height: 8, borderRadius: "50%", background: "#f56565", display: "inline-block" }} ></span>
              </span>
              Live · 1,284 active responders right now
            </div>

            <h1 className="hero-h1 text-gradient" style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1, marginBottom: 20 }}>
              Connecting Help When{" "}
              <span style={{ display: "block", background: "linear-gradient(135deg, #f56565, #ed64a6, #9f7aea)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Every Second
              </span>
              Counts
            </h1>
            <p style={{ fontSize: 17, color: "rgba(232,232,240,0.65)", lineHeight: 1.7, maxWidth: 480, marginBottom: 32 }}>
              A community-powered emergency resource sharing platform for blood, transport, medicines, food and shelter — coordinated in real time by AI.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 32 }}>
              <button className="btn-primary" style={{ fontSize: 15 }} onClick={() => navigate("/request")}>❤️ Request Help</button>
              <button className="btn-outline" style={{ fontSize: 15 }} onClick={() => navigate("/becomeDonor")} >Become a Donor</button>
              <button className="btn-outline" style={{ fontSize: 15, borderColor: "transparent" }} onClick={() => navigate("/map")} >Explore Resources →</button>
            </div>

            <div style={{ display: "flex", gap: 24, fontSize: 12, color: "rgba(232,232,240,0.5)" }}>
              <span>🪪 Aadhaar verified</span>
              <span>📍 Real-time GPS</span>
              <span>✨ AI prioritized</span>
            </div>
          </div>

          <div className="float-slow" style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: -16, background: "linear-gradient(135deg, rgba(229,62,62,0.15), rgba(99,102,241,0.15))", borderRadius: 32, filter: "blur(20px)" }} />
            <div className="glass-strong" style={{ position: "relative", borderRadius: 28, padding: 12 }}>
              <img
                src={heroPhoto}
                alt="Live Emergency Network"
                style={{
                  borderRadius: 20,
                  width: "100%",
                  display: "block",
                  objectFit: "cover",
                  height: 320,
                }}
              />

              <div className="floating-card glass-strong" style={{ position: "absolute", left: -20, top: 30, borderRadius: 16, padding: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(229,62,62,0.15)", display: "grid", placeItems: "center", fontSize: 18 }}>🩸</div>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(232,232,240,0.5)" }}>O- needed · 1.2km</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Matched in 47s</div>
                </div>
              </div>

              <div className="floating-card glass-strong" style={{ position: "absolute", right: -20, bottom: 40, borderRadius: 16, padding: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(99,102,241,0.15)", display: "grid", placeItems: "center", fontSize: 18 }}>📍</div>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(232,232,240,0.5)" }}>Shelter · Sector 22</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>38 beds available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* STATS */}
      < section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 64px" }
      }>
        <div className="glass-strong" style={{ borderRadius: 24, padding: 8 }}>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "rgba(255,255,255,0.06)", borderRadius: 18, overflow: "hidden" }}>
            {stats.map(s => (
              <div key={s.label} style={{ background: "#0d0d18", padding: "28px 32px" }}>
                <div style={{ fontSize: 36, fontWeight: 800, background: "linear-gradient(135deg, #f56565, #9f7aea)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{s.value}</div>
                <div style={{ fontSize: 13, fontWeight: 500, marginTop: 6, color: "#e8e8f0" }}>{s.label}</div>
                <div style={{ fontSize: 11, color: "rgba(232,232,240,0.4)", marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* RESOURCES */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto 48px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#f56565", textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>Resources</div>
          <h2 style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1, marginBottom: 12 }}>Five lifelines. One network.</h2>
          <p style={{ fontSize: 15, color: "rgba(232,232,240,0.55)", lineHeight: 1.6 }}>Every category is verified, geo-tagged and routed by AI to the right person at the right time.</p>
        </div>
        <div className="resources-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }} >
          {resources.map(r => (
            <div key={r.label} className="resource-card glass" style={{ borderRadius: 20, padding: 24, cursor: "pointer" }} onClick={() => navigate(r.path)} >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: r.bg, display: "grid", placeItems: "center", fontSize: 22, marginBottom: 16 }}>{r.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{r.label}</div>
              <div style={{ fontSize: 12, color: "rgba(232,232,240,0.4)", marginTop: 4 }} onClick={() => (navigate(r.path))}>View live availability →</div>
            </div>
          ))}
        </div>
      </section >

      {/* HOW IT WORKS */}
      < section style={{ padding: "80px 0", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", maxWidth: 520, margin: "0 auto 64px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9f7aea", textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>How it works</div>
            <h2 style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1 }}>From SOS to safety in 4 steps</h2>
          </div>
          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, position: "relative" }}>
            <div style={{ position: "absolute", top: 52, left: "12%", right: "12%", height: 1, background: "linear-gradient(90deg, #f56565, #9f7aea, #38a169)", opacity: 0.4, pointerEvents: "none" }} />
            {steps.map(s => (
              <div key={s.n} className="step-card glass-strong" style={{ borderRadius: 20, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #f56565, #9f7aea)", display: "grid", placeItems: "center", fontSize: 20 }}>{s.emoji}</div>
                  <span style={{ fontSize: 28, fontWeight: 800, color: "rgba(232,232,240,0.12)" }}>{s.n}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(232,232,240,0.55)", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* AI + MAP PREVIEW */}
      < section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <div className="ai-map-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* AI Panel */}
          <div className="glass-strong" style={{ borderRadius: 28, padding: 32, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(229,62,62,0.1)", filter: "blur(40px)" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#f56565", textTransform: "uppercase", letterSpacing: 2, display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                🧠 AI MATCHING
              </div>
              <h3 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2, marginBottom: 10 }}>Priority engine that thinks like a dispatcher.</h3>
              <p style={{ fontSize: 13, color: "rgba(232,232,240,0.55)", lineHeight: 1.6, marginBottom: 24 }}>Distance · Severity · Availability · Blood-group · Live demand — fused into a single urgency score.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {metrics.map(m => (
                  <div key={m.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                      <span style={{ fontWeight: 500 }}>{m.label}</span>
                      <span style={{ color: "rgba(232,232,240,0.4)" }}>{m.value}%</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${m.value}%`, background: m.color, borderRadius: 4, transition: "width 1s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Panel */}
          <div className="glass-strong" style={{ borderRadius: 28, padding: 32, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(99,102,241,0.1)", filter: "blur(40px)" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9f7aea", textTransform: "uppercase", letterSpacing: 2, display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                📍 LIVE HEATMAP
              </div>
              <h3 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2, marginBottom: 10 }}>See your city respond in real time.</h3>
              <p style={{ fontSize: 13, color: "rgba(232,232,240,0.55)", lineHeight: 1.6, marginBottom: 24 }}>Donors, shelters, medical shops and transport — overlaid on one interactive map.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
                {liveStats.map(s => (
                  <div key={s.l} className="glass" style={{ borderRadius: 14, padding: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 26, fontWeight: 800, background: "linear-gradient(135deg, #f56565, #9f7aea)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{s.v}</div>
                    <div style={{ fontSize: 11, color: "rgba(232,232,240,0.45)", marginTop: 4 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center", background: "linear-gradient(135deg, #6366f1, #9f7aea)" }} onClick={() => navigate("/map")}>Open Live Map</button>
            </div>
          </div>
        </div>
      </section >

      {/* CTA */}
      < section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 28, padding: "64px 48px", background: "linear-gradient(135deg, #e53e3e, #c53030, #9f1239)", textAlign: "center" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.15, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>👥</div>
            <h2 style={{ fontSize: 42, fontWeight: 800, color: "#fff", marginBottom: 12, letterSpacing: -1 }}>Join 12,000+ volunteers saving lives.</h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.6 }}>Become a verified responder, list a resource, or simply share the app — every action matters.</p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
              <button style={{ background: "#fff", color: "#c53030", border: "none", padding: "12px 28px", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "opacity 0.2s" }} onClick={() => navigate("/signup")} >
                Create account
              </button>
            </div>
          </div>
        </div>
      </section >

      {/* FOOTER */}
      < footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "40px 24px", maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#f56565" }}>ResQ</span>
          <span style={{ fontSize: 18, fontWeight: 300, color: "#e8e8f0" }}>Link</span>
          <p style={{ fontSize: 12, color: "rgba(232,232,240,0.35)", marginTop: 4 }}>Connecting help when every second counts</p>
        </div>
        <div style={{ display: "flex", gap: 24, fontSize: 13, color: "rgba(232,232,240,0.45)" }}>
          {["About", "Privacy", "Terms", "Contact"].map(item => (
            <a key={item} href="#" style={{ transition: "color 0.2s" }}>{item}</a>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "rgba(232,232,240,0.3)" }}>© 2025 ResQ Link. All rights reserved.</div>
      </footer >
    </div >
  );
}

export default Landing