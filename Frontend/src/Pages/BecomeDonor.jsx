import { useState } from "react";

// Icons (inline SVG to avoid external deps)
const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const HeartIcon = ({ filled = false, size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

//  Toast
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = (msg, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };
  return { toasts, success: (m) => show(m, "success"), error: (m) => show(m, "error") };
}

function ToastContainer({ toasts }) {
  return (
    <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          padding: "10px 20px", borderRadius: 999, fontSize: 13, fontWeight: 600,
          background: t.type === "success" ? "#16a34a" : "#e11d48", color: "#fff",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)", animation: "fadeIn 0.2s ease",
          whiteSpace: "nowrap"
        }}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// Constants 
const BLOOD = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

const initial = {
  fullName: "", age: "", gender: "", bloodGroup: "",
  phone: "", email: "", city: "", address: "",
  lastDonation: "", available: true, consent: false,
};

// Shared field helpers
const inputBase = {
  width: "100%", borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.15)",
  background: "#111827", padding: "12px 16px", fontSize: 14, color: "#e8e8f0",
  outline: "none", boxSizing: "border-box", transition: "all 0.2s",
  fontFamily: "inherit",
};
const inputErr = { ...inputBase, borderColor: "#f43f5e" };

function FieldLabel({ children }) {
  return <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#e8e8f0", marginBottom: 8 }}>{children}</label>;
}
function ErrMsg({ msg }) {
  if (!msg) return null;
  return <p style={{ marginTop: 6, fontSize: 12, color: "#e11d48" }}>{msg}</p>;
}

// Step 1 
function StepOne({ data, errors, update }) {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#e8e8f0", margin: 0 }}>Personal Details</h2>
      <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Basic info used to match you with requests.</p>

      <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
        <div>
          <FieldLabel>Full name</FieldLabel>
          <input style={errors.fullName ? inputErr : inputBase} value={data.fullName}
            onChange={(e) => update("fullName", e.target.value)} placeholder="Aarav Sharma" />
          <ErrMsg msg={errors.fullName} />
        </div>
        <div>
          <FieldLabel>Age</FieldLabel>
          <input type="number" min={18} max={65} style={errors.age ? inputErr : inputBase}
            value={data.age} onChange={(e) => update("age", e.target.value)} placeholder="18 – 65" />
          <ErrMsg msg={errors.age} />
        </div>

        <div>
          <FieldLabel>Gender</FieldLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {GENDERS.map((g) => {
              const active = data.gender === g;
              return (
                <button key={g} type="button" onClick={() => update("gender", g)}
                  style={{
                    borderRadius: 999, border: active ? "1.5px solid #e11d48" : "1.5px solid #e2e8f0",
                    background: active ? "rgba(225,29,72,0.15)" : "#111827", color: active ? "#e11d48" : "#e8e8f0",
                    padding: "10px 14px", fontSize: 13, fontWeight: active ? 700 : 500,
                    cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
                  }}>
                  {g}
                </button>
              );
            })}
          </div>
          <ErrMsg msg={errors.gender} />
        </div>

        <div>
          <FieldLabel>Blood group</FieldLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {BLOOD.map((b) => {
              const active = data.bloodGroup === b;
              return (
                <button key={b} type="button" onClick={() => update("bloodGroup", b)}
                  style={{
                    borderRadius: 999, border: active ? "1.5px solid #e11d48" : "1.5px solid #e2e8f0",
                    background: active ? "rgba(225,29,72,0.15)" : "#111827", color: active ? "#e11d48" : "#e8e8f0",
                    padding: "10px 4px", fontSize: 13, fontWeight: 700,
                    cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
                  }}>
                  {b}
                </button>
              );
            })}
          </div>
          <ErrMsg msg={errors.bloodGroup} />
        </div>
      </div>
    </div>
  );
}

// Step 2 
function StepTwo({ data, errors, update }) {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#e8e8f0", margin: 0 }}>Contact & Location</h2>
      <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Where can hospitals reach you in an emergency?</p>

      <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
        <div>
          <FieldLabel>Phone number</FieldLabel>
          <input style={errors.phone ? inputErr : inputBase} value={data.phone}
            onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210" />
          <ErrMsg msg={errors.phone} />
        </div>
        <div>
          <FieldLabel>Email</FieldLabel>
          <input type="email" style={errors.email ? inputErr : inputBase} value={data.email}
            onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
          <ErrMsg msg={errors.email} />
        </div>
        <div>
          <FieldLabel>City</FieldLabel>
          <input style={errors.city ? inputErr : inputBase} value={data.city}
            onChange={(e) => update("city", e.target.value)} placeholder="Mumbai" />
          <ErrMsg msg={errors.city} />
        </div>
        <div>
          <FieldLabel>Last donation (optional)</FieldLabel>
          <input type="date" style={inputBase} value={data.lastDonation}
            onChange={(e) => update("lastDonation", e.target.value)} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <FieldLabel>Address</FieldLabel>
          <textarea rows={3} style={{ ...(errors.address ? inputErr : inputBase), resize: "none" }}
            value={data.address} onChange={(e) => update("address", e.target.value)}
            placeholder="Street, area, landmark, pincode" />
          <ErrMsg msg={errors.address} />
        </div>
      </div>
    </div>
  );
}

//Summary box 
function Summary({ label, value, highlight }) {
  return (
    <div style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)", padding: "12px 16px" }}>
      <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8", margin: 0 }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: highlight ? 800 : 600, color: highlight ? "#e11d48" : "#f8fafc", marginTop: 4, marginBottom: 0 }}>
        {value || "—"}
      </p>
    </div>
  );
}

// Step 3 
function StepThree({ data, errors, update }) {
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#e8e8f0", margin: 0 }}>Review & Confirm</h2>
      <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>Double-check your details before we add you to the donor list.</p>

      <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        <Summary label="Full name" value={data.fullName} />
        <Summary label="Age" value={data.age} />
        <Summary label="Gender" value={data.gender} />
        <Summary label="Blood group" value={data.bloodGroup} highlight />
        <Summary label="Phone" value={data.phone} />
        <Summary label="Email" value={data.email} />
        <Summary label="City" value={data.city} />
        <Summary label="Last donation" value={data.lastDonation || "—"} />
        <div style={{ gridColumn: "1 / -1" }}>
          <Summary label="Address" value={data.address} />
        </div>
      </div>

      <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
          <input type="checkbox" checked={data.available}
            onChange={(e) => update("available", e.target.checked)}
            style={{ marginTop: 2, width: 16, height: 16, accentColor: "#e11d48", cursor: "pointer" }} />
          <span style={{ fontSize: 13, color: "#e2e8f0" }}>
            I'm currently <strong>available</strong> to donate. (You can toggle this anytime.)
          </span>
        </label>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
          <input type="checkbox" checked={data.consent}
            onChange={(e) => update("consent", e.target.checked)}
            style={{ marginTop: 2, width: 16, height: 16, accentColor: "#e11d48", cursor: "pointer" }} />
          <span style={{ fontSize: 13, color: "#e2e8f0" }}>
            I agree to ResQ Link's donor terms and consent to be contacted by verified hospitals for blood requests.
          </span>
        </label>
        <ErrMsg msg={errors.consent} />
      </div>
    </div>
  );
}

// ─── Main Component
export default function BecomeDonor() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  const update = (k, v) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!data.fullName.trim()) e.fullName = "Full name is required";
      else if (data.fullName.trim().length < 2) e.fullName = "Name is too short";
      const age = Number(data.age);
      if (!data.age) e.age = "Age is required";
      else if (!Number.isInteger(age) || age < 18 || age > 65) e.age = "Age must be between 18 and 65";
      if (!data.gender) e.gender = "Select a gender";
      if (!data.bloodGroup) e.bloodGroup = "Select your blood group";
    }
    if (s === 2) {
      if (!/^\+?\d{10,15}$/.test(data.phone.replace(/\s/g, ""))) e.phone = "Enter a valid phone number";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Enter a valid email";
      if (!data.city.trim()) e.city = "City is required";
      if (!data.address.trim() || data.address.trim().length < 6) e.address = "Enter a complete address";
    }
    if (s === 3) {
      if (!data.consent) e.consent = "You must agree to continue";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(3, s + 1));
    else toast.error("Please fix the highlighted fields");
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  const submit = () => {
    if (!validateStep(3)) return;
    setSubmitted(true);
    toast.success("You're registered as a donor!");
  };

  const pageStyle = {
    minHeight: "100vh",
    background: "#0a0a0f",
    color: "#e8e8f0",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  };

  if (submitted) {
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <ToastContainer toasts={toast.toasts} />
        <div style={{
          maxWidth: 440, width: "100%", borderRadius: 24, background: "#111827",
          border: "1.5px solid rgba(255,255,255,0.15)", boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          padding: 40, textAlign: "center",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: "#fff1f2",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px", color: "#e11d48",
          }}>
            <HeartIcon filled size={32} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#e8e8f0", margin: "0 0 8px" }}>
            Welcome, {data.fullName.split(" ")[0]}!
          </h1>
          <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>
            You're now part of the ResQ Link donor network. We'll notify you when a <strong>{data.bloodGroup}</strong> request is near {data.city}.
          </p>
          <button
            onClick={() => { setData(initial); setStep(1); setSubmitted(false); }}
            style={{
              marginTop: 28, display: "inline-flex", alignItems: "center", justifyContent: "center",
              borderRadius: 999, background: "#e11d48", color: "#fff", border: "none",
              padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer",
              transition: "background 0.15s", fontFamily: "inherit",
            }}
            onMouseEnter={(e) => e.target.style.background = "#be123c"}
            onMouseLeave={(e) => e.target.style.background = "#e11d48"}
          >
            Register another donor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <ToastContainer toasts={toast.toasts} />
      <div
        style={{
          position: "fixed",
          top: "-250px",
          left: "-250px",
          width: "500px",
          height: "500px",
          background: "rgba(229,56,59,0.20)",
          borderRadius: "50%",
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "fixed",
          bottom: "-250px",
          right: "-250px",
          width: "500px",
          height: "500px",
          background: "rgba(168,85,247,0.15)",
          borderRadius: "50%",
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, color: "#e8e8f0", margin: 0, letterSpacing: "-0.02em" }}>
              Become a Donor
            </h1>
            <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 6 }}>Register in 3 steps. It takes less than 5 minutes.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#94a3b8" }}>
            <span style={{ color: "#16a34a" }}><ShieldCheckIcon /></span>
            End-to-end encrypted
          </div>
        </div>

        {/* Stepper */}
        <div style={{ marginTop: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          {[1, 2, 3].map((n, i) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, border: "2px solid",
                background: step === n ? "#e11d48" : step > n ? "#16a34a" : "#fff",
                borderColor: step === n ? "#e11d48" : step > n ? "#16a34a" : "#e2e8f0",
                color: step >= n ? "#fff" : "#94a3b8",
                boxShadow: step === n ? "0 4px 12px rgba(225,29,72,0.3)" : "none",
                transition: "all 0.2s",
              }}>
                {step > n ? <CheckIcon /> : n}
              </div>
              {i < 2 && (
                <div style={{ height: 2, width: 64, background: step > n ? "#16a34a" : "#e2e8f0", transition: "background 0.3s" }} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{
          marginTop: 32, borderRadius: 24, background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.06)", padding: "clamp(24px, 4vw, 40px)",
        }}>
          {step === 1 && <StepOne data={data} errors={errors} update={update} />}
          {step === 2 && <StepTwo data={data} errors={errors} update={update} />}
          {step === 3 && <StepThree data={data} errors={errors} update={update} />}

          {/* Navigation */}
          <div style={{ marginTop: 40, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={back} disabled={step === 1}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                borderRadius: 999, border: "1.5px solid rgba(255,255,255,0.15)", background: "#111827",
                color: "#e8e8f0", padding: "10px 20px", fontSize: 13, fontWeight: 600,
                cursor: step === 1 ? "not-allowed" : "pointer", opacity: step === 1 ? 0.4 : 1,
                transition: "all 0.15s", fontFamily: "inherit",
              }}>
              <ArrowLeftIcon /> Back
            </button>

            {step < 3 ? (
              <button onClick={next}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  borderRadius: 999, background: "#e11d48", color: "#fff", border: "none",
                  padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(225,29,72,0.3)", transition: "background 0.15s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#be123c"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#e11d48"}
              >
                Next <ArrowRightIcon />
              </button>
            ) : (
              <button onClick={submit}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  borderRadius: 999, background: "#16a34a", color: "#fff", border: "none",
                  padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(22,163,74,0.3)", transition: "background 0.15s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#15803d"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#16a34a"}
              >
                <HeartIcon filled /> Confirm registration
              </button>
            )}
          </div>
        </div>

        {/* Footer note */}
        <div style={{ marginTop: 24, display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#94a3b8", padding: "0 8px" }}>
          <span style={{ marginTop: 1, flexShrink: 0 }}><InfoIcon /></span>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Your data is stored securely and never sold. Only your name, blood group, and approximate distance are shown publicly.
            Exact address and phone are shared only with the hospital after you accept a request.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        input:focus, textarea:focus {
          border-color: #f43f5e !important;
          box-shadow: 0 0 0 3px rgba(244,63,94,0.12);
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}