

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../Components/usercontext";

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14m-7-7 7 7-7 7" />
  </svg>
);

const ROLES = [
  { id: "requester", title: "Requester",        desc: "Request emergency resources" },
  { id: "volunteer", title: "Volunteer",         desc: "Respond to nearby tasks" },
  { id: "provider",  title: "Resource Provider", desc: "List blood, food, transport" },
  { id: "ngo",       title: "NGO / Authority",   desc: "Coordinate at scale" },
];

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useUser();

  const [step,         setStep]         = useState(1);
  const [selectedRole, setSelectedRole] = useState("volunteer");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors,       setErrors]       = useState({});
  const [timer,        setTimer]        = useState(32);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", emergencyPhone: "",
    location: "", password: "", skills: "",
    availability: "On Call", emergencyType: "Medical",
    orgName: "", contactPerson: "", resourceType: "Blood",
    regNumber: "", officerName: "",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);

  // OTP countdown timer
  useEffect(() => {
    if (step !== 3 || timer <= 0) return;
    const iv = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(iv);
  }, [step, timer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validateForm = () => {
    const errs = {};
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (["volunteer", "requester"].includes(selectedRole)) {
      if (!formData.name.trim())         errs.name  = "Full name is required";
      if (!emailRx.test(formData.email)) errs.email = "Invalid email address";
    }
    if (["provider", "ngo"].includes(selectedRole)) {
      if (!formData.orgName.trim())      errs.orgName = "Organization name is required";
    }
    if (selectedRole === "volunteer") {
      if (!formData.emergencyPhone.trim()) errs.emergencyPhone = "Emergency contact is required";
      if (!formData.skills.trim())         errs.skills = "Please mention your skills";
    }
    if (selectedRole === "provider") {
      if (!formData.contactPerson.trim()) errs.contactPerson = "Contact person name is required";
      if (!emailRx.test(formData.email))  errs.email = "Invalid email address";
    }
    if (selectedRole === "ngo") {
      if (!formData.regNumber.trim())   errs.regNumber   = "Registration number is required";
      if (!formData.officerName.trim()) errs.officerName = "Officer name is required";
      if (!emailRx.test(formData.email)) errs.email       = "Invalid official email";
    }
    if (!formData.phone.trim())    errs.phone    = "Phone number is required";
    if (!formData.location.trim()) errs.location = "Location is required";
    if (formData.password.length < 6) errs.password = "Password must be at least 6 characters";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleStep2Continue = () => { if (validateForm()) setStep(3); };

  const handleOtpChange = (i, val) => {
    const clean = val.replace(/\D/g, "").slice(-1);
    const next  = [...otp]; next[i] = clean; setOtp(next);
    if (clean && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const handleOtpKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  // ── Final submit: call login() to set auth state everywhere
  const handleSubmit = () => {
    if (otp.join("").length < 6) {
      setErrors({ otp: "Please enter a valid 6-digit verification code" });
      return;
    }
    setIsSubmitting(true);

    const displayName =
      ["volunteer", "requester"].includes(selectedRole)
        ? formData.name
        : formData.orgName;

    // Simulate OTP verification 
    setTimeout(() => {
      // login() writes to context AND localStorage — Navbar updates instantly
      login({
        ...formData,
        role: selectedRole,
        displayName,
        stats: {
          livesAssisted: 0,
          avgResponse:   "—",
          trustScore:    "5.00",
          streak:        0,
        },
      });
      setIsSubmitting(false);
      navigate("/dashboard", { replace: true });
    }, 1500);
  };

  const getHeadingText = () => ({
    volunteer: "Volunteer Registration",
    requester: "Requester Registration",
    provider:  "Resource Provider Registration",
    ngo:       "NGO Registration",
  }[selectedRole] ?? "Tell us about you");

  return (
    <>
      <style>{styles}</style>
      <div className="main_container">
        <header className="resq-header">
          <span />
          <Link to="/login" className="resq-header-link">
            Already a member? <span>Sign in</span>
          </Link>
        </header>

        <div className="resq-main">
          {/* Progress stepper */}
          <div className="resq-stepper">
            {[1, 2, 3].map((n) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                <div className={`resq-step-node ${step >= n ? "active" : "inactive"}`}>
                  {step > n ? <CheckIcon /> : n}
                </div>
                {n < 3 && <div className={`resq-step-line ${step > n ? "done" : "pending"}`} />}
              </div>
            ))}
          </div>

          <div className="resq-card">

            {/* ── STEP 1: Role ── */}
            {step === 1 && (
              <div>
                <h1>Pick your role</h1>
                <p>You can change or add roles later from settings.</p>
                <div className="role-grid">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={`role-card ${selectedRole === r.id ? "selected" : ""}`}
                      onClick={() => setSelectedRole(r.id)}
                    >
                      <div className="role-title">{r.title}</div>
                      <div className="role-desc">{r.desc}</div>
                    </button>
                  ))}
                </div>
                <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
                  Continue <ArrowRight />
                </button>
              </div>
            )}

            {/* ── STEP 2: Details ── */}
            {step === 2 && (
              <div>
                <h1>{getHeadingText()}</h1>
                <p>We use this to match you with the closest verified people.</p>
                <div className="field-grid">

                  {["volunteer", "requester"].includes(selectedRole) && (
                    <>
                      <label>
                        <span className="field-label">Full Name</span>
                        <input className="field-input" name="name" placeholder="Aarav Sharma" value={formData.name} onChange={handleInputChange} />
                        {errors.name && <span className="error-txt">{errors.name}</span>}
                      </label>
                      <label>
                        <span className="field-label">Email</span>
                        <input className="field-input" type="email" name="email" placeholder="you@email.com" value={formData.email} onChange={handleInputChange} />
                        {errors.email && <span className="error-txt">{errors.email}</span>}
                      </label>
                    </>
                  )}

                  {selectedRole === "provider" && (
                    <>
                      <label>
                        <span className="field-label">Organization Name</span>
                        <input className="field-input" name="orgName" placeholder="Apollo Blood Bank" value={formData.orgName} onChange={handleInputChange} />
                        {errors.orgName && <span className="error-txt">{errors.orgName}</span>}
                      </label>
                      <label>
                        <span className="field-label">Contact Person Name</span>
                        <input className="field-input" name="contactPerson" placeholder="Jane Doe" value={formData.contactPerson} onChange={handleInputChange} />
                        {errors.contactPerson && <span className="error-txt">{errors.contactPerson}</span>}
                      </label>
                      <label>
                        <span className="field-label">Email</span>
                        <input className="field-input" type="email" name="email" placeholder="contact@org.com" value={formData.email} onChange={handleInputChange} />
                        {errors.email && <span className="error-txt">{errors.email}</span>}
                      </label>
                      <label>
                        <span className="field-label">Resource Type</span>
                        <select className="field-input" name="resourceType" value={formData.resourceType} onChange={handleInputChange}>
                          {["Blood", "Food", "Medicine", "Transport", "Shelter"].map((o) => <option key={o}>{o}</option>)}
                        </select>
                      </label>
                    </>
                  )}

                  {selectedRole === "ngo" && (
                    <>
                      <label>
                        <span className="field-label">Organization Name</span>
                        <input className="field-input" name="orgName" placeholder="Red Cross Base Operations" value={formData.orgName} onChange={handleInputChange} />
                        {errors.orgName && <span className="error-txt">{errors.orgName}</span>}
                      </label>
                      <label>
                        <span className="field-label">Registration Number</span>
                        <input className="field-input" name="regNumber" placeholder="NGO-8392-DL" value={formData.regNumber} onChange={handleInputChange} />
                        {errors.regNumber && <span className="error-txt">{errors.regNumber}</span>}
                      </label>
                      <label>
                        <span className="field-label">Officer Name</span>
                        <input className="field-input" name="officerName" placeholder="Captain Vance" value={formData.officerName} onChange={handleInputChange} />
                        {errors.officerName && <span className="error-txt">{errors.officerName}</span>}
                      </label>
                      <label>
                        <span className="field-label">Official Email</span>
                        <input className="field-input" type="email" name="email" placeholder="ops@ngo.org" value={formData.email} onChange={handleInputChange} />
                        {errors.email && <span className="error-txt">{errors.email}</span>}
                      </label>
                    </>
                  )}

                  <label>
                    <span className="field-label">{selectedRole === "ngo" ? "Official Phone" : "Mobile Number"}</span>
                    <input className="field-input" type="tel" name="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={handleInputChange} />
                    {errors.phone && <span className="error-txt">{errors.phone}</span>}
                  </label>

                  {selectedRole === "volunteer" && (
                    <>
                      <label>
                        <span className="field-label">Emergency Contact</span>
                        <input className="field-input" type="tel" name="emergencyPhone" placeholder="+91 98765 43210" value={formData.emergencyPhone} onChange={handleInputChange} />
                        {errors.emergencyPhone && <span className="error-txt">{errors.emergencyPhone}</span>}
                      </label>
                      <label className="full">
                        <span className="field-label">Skills (First Aid, Rescue, Medical, etc.)</span>
                        <input className="field-input" name="skills" placeholder="e.g. CPR Certified, Trauma response" value={formData.skills} onChange={handleInputChange} />
                        {errors.skills && <span className="error-txt">{errors.skills}</span>}
                      </label>
                      <div className="full">
                        <span className="field-label" style={{ marginBottom: "0.5rem" }}>Availability</span>
                        <div className="radio-group">
                          {["Full Time", "Weekends", "On Call"].map((m) => (
                            <label key={m} className="radio-label">
                              <input type="radio" name="availability" value={m} checked={formData.availability === m} onChange={handleInputChange} />
                              {m}
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {selectedRole === "requester" && (
                    <label>
                      <span className="field-label">Emergency Type</span>
                      <select className="field-input" name="emergencyType" value={formData.emergencyType} onChange={handleInputChange}>
                        {["Medical", "Blood", "Food", "Shelter", "Transport"].map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </label>
                  )}

                  <label className={["volunteer", "provider"].includes(selectedRole) ? "full" : ""}>
                    <span className="field-label">{selectedRole === "ngo" ? "City / Jurisdiction" : "Location"}</span>
                    <input className="field-input" name="location" placeholder="City, State, Zip Code" value={formData.location} onChange={handleInputChange} />
                    {errors.location && <span className="error-txt">{errors.location}</span>}
                  </label>

                  <label className="full">
                    <span className="field-label">Password</span>
                    <div style={{ position: "relative" }}>
                      <input className="field-input" type={showPassword ? "text" : "password"} name="password" placeholder="Min. 6 characters" value={formData.password} onChange={handleInputChange} />
                      <button type="button" className="pwd-toggle" onClick={() => setShowPassword((p) => !p)}>
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {errors.password && <span className="error-txt">{errors.password}</span>}
                  </label>
                </div>

                <div className="btn-row">
                  <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                  <button type="button" className="btn btn-primary" onClick={handleStep2Continue}>
                    Continue <ArrowRight />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: OTP ── */}
            {step === 3 && (
              <div>
                <h1>Verify your phone</h1>
                <p>We sent a 6-digit code to <strong>{formData.phone}</strong>. Enter it below.</p>

                {errors.otp && (
                  <div className="error-txt" style={{ textAlign: "center", marginBottom: "1rem" }}>
                    {errors.otp}
                  </div>
                )}

                <div className="otp-row">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      className="otp-box"
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    />
                  ))}
                </div>

                <p className="otp-note">
                  {timer > 0
                    ? `Resend code in ${timer}s`
                    : <button type="button" className="resq-resend" onClick={() => setTimer(32)}>Resend OTP</button>
                  }
                </p>

                <div className="btn-row">
                  <button type="button" className="btn btn-outline" onClick={() => setStep(2)} disabled={isSubmitting}>Back</button>
                  <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Verifying…" : "Verify & Enter"} <ArrowRight />
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="resq-note">
            By continuing you agree to our Terms and Privacy Policy.
            Verification is optional and only used for badge issuance.
          </p>
        </div>
      </div>
    </>
  );
}

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f0f13; }
  .main_container { min-height: 100vh; color: #f1f1f3; padding-bottom: 2rem; }
  .resq-header { max-width: 72rem; margin: 0 auto; padding: 1.5rem; display: flex; align-items: center; justify-content: space-between; }
  .resq-header-link { font-size: .875rem; color: #9ca3af; text-decoration: none; }
  .resq-header-link span { color: #ef4444; font-weight: 600; }
  .resq-main { max-width: 48rem; margin: 0 auto; padding: 1.5rem; }
  .resq-stepper { display: flex; align-items: center; justify-content: center; gap: .5rem; margin-bottom: 2rem; }
  .resq-step-node { width: 2rem; height: 2rem; border-radius: 50%; display: grid; place-items: center; font-size: .75rem; font-weight: 600; transition: all 0.3s ease; }
  .resq-step-node.active { background: #ef4444; color: #fff; }
  .resq-step-node.inactive { background: #27272a; color: #71717a; }
  .resq-step-line { width: 3rem; height: 2px; }
  .resq-step-line.done { background: #ef4444; }
  .resq-step-line.pending { background: #3f3f46; }
  .resq-card { background: #18181b; border: 1px solid #27272a; border-radius: 1rem; padding: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
  .resq-card h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.25rem; letter-spacing: -0.5px; }
  .resq-card p { font-size: .875rem; color: #9ca3af; margin-bottom: 1.5rem; }
  .role-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: .75rem; margin-bottom: 1.5rem; }
  .role-card { text-align: left; padding: 1.25rem; border-radius: .75rem; border: 1px solid #27272a; background: #212124; color: #fff; cursor: pointer; transition: all 0.2s; }
  .role-card:hover { border-color: #ef444480; }
  .role-card.selected { border-color: #ef4444; background: rgba(239,68,68,.05); }
  .role-title { font-weight: 600; font-size: .95rem; }
  .role-desc { font-size: .75rem; color: #9ca3af; margin-top: .25rem; }
  .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem 1rem; margin-bottom: 1.5rem; }
  @media (max-width: 600px) { .field-grid { grid-template-columns: 1fr; } }
  .field-grid .full { grid-column: 1 / -1; }
  .field-label { display: block; font-size: .75rem; font-weight: 600; color: #9ca3af; margin-bottom: .375rem; text-transform: uppercase; letter-spacing: 0.5px; }
  .field-input { width: 100%; height: 2.75rem; padding: 0 .75rem; background: #212124; border: 1px solid #27272a; border-radius: .5rem; color: #fff; outline: none; transition: border-color 0.2s; font-size: 0.95rem; }
  .field-input:focus { border-color: #ef4444; }
  select.field-input { appearance: none; cursor: pointer; }
  .pwd-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #ef4444; font-size: 0.75rem; font-weight: 700; cursor: pointer; text-transform: uppercase; }
  .error-txt { color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem; display: block; font-weight: 500; }
  .radio-group { display: flex; gap: 1.5rem; background: #212124; padding: 0.75rem 1rem; border: 1px solid #27272a; border-radius: 0.5rem; }
  .radio-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; cursor: pointer; color: #f1f1f3; }
  .radio-label input { accent-color: #ef4444; width: 1rem; height: 1rem; }
  .otp-row { display: flex; justify-content: center; gap: .5rem; margin: 2rem 0; }
  .otp-box { width: 3rem; height: 3.5rem; text-align: center; font-size: 1.5rem; font-weight: 700; background: #212124; border: 1px solid #27272a; border-radius: .5rem; color: #fff; outline: none; transition: all 0.2s; }
  .otp-box:focus { border-color: #ef4444; box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2); }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; height: 2.75rem; padding: 0 1.5rem; border-radius: .5rem; font-size: .9rem; font-weight: 600; cursor: pointer; border: none; transition: background 0.2s, transform 0.1s, opacity 0.2s; }
  .btn:active { transform: scale(0.98); }
  .btn:disabled { opacity: .65; cursor: not-allowed; }
  .btn-primary { background: #ef4444; color: #fff; width: 100%; }
  .btn-primary:hover:not(:disabled) { background: #dc2626; }
  .btn-outline { background: transparent; border: 1px solid #27272a; color: #d4d4d8; }
  .btn-outline:hover:not(:disabled) { background: #212124; }
  .btn-row { display: flex; gap: .75rem; }
  .btn-row .btn { flex: 1; }
  .resq-note { margin-top: 1.5rem; text-align: center; font-size: .75rem; color: #52525b; }
  .otp-note { text-align: center; font-size: .875rem; color: #9ca3af; margin-bottom: 1.5rem; }
  .resq-resend { background: none; border: none; color: #ef4444; font-weight: 600; cursor: pointer; text-decoration: underline; font-size: .875rem; }
`;