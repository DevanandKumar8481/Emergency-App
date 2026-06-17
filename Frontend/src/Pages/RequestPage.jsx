import { useState, useRef, useEffect } from "react";

const categories = [
  { id: "medical", emoji: "❤️", label: "Medical" },
  { id: "blood", emoji: "🩸", label: "Blood" },
  { id: "transport", emoji: "🚚", label: "Transport" },
  { id: "medicine", emoji: "💊", label: "Medicine" },
  { id: "food", emoji: "🍱", label: "Food" },
  { id: "shelter", emoji: "🏠", label: "Shelter" },
];

const priorities = [
  { id: "low", label: "Low", activeStyle: { background: "#2d2d3a", color: "#e8e8f0", border: "1.5px solid #555" } },
  { id: "med", label: "Medium", activeStyle: { background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1.5px solid rgba(99,102,241,0.4)" } },
  { id: "high", label: "High", activeStyle: { background: "rgba(234,179,8,0.15)", color: "#fcd34d", border: "1.5px solid rgba(234,179,8,0.4)" } },
  { id: "critical", label: "Critical", activeStyle: { background: "#e53e3e", color: "#fff", border: "1.5px solid #e53e3e" } },
];

const responders = [
  { n: "Dr. Priya R.", t: "O- · Verified · 0.6 km", eta: "4 min", initials: "PR" },
  { n: "Apollo Blood Bank", t: "Open 24×7 · 1.1 km", eta: "8 min", initials: "AB" },
  { n: "Rahul M.", t: "O- · 1.4 km", eta: "9 min", initials: "RM" },
];

const hospitals = [
  "Apollo Hospital · 1.1 km · 24×7",
  "Civil Hospital · 2.4 km · ER open",
  "Fortis · 3.0 km · Trauma center",
];

export default function RequestPage() {
  const [cat, setCat] = useState("blood");
  const [pri, setPri] = useState("high");

  // Form fields
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");

  // Photo upload
  const [photos, setPhotos] = useState([]); // Array of { file, url }
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Voice
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const descBeforeRecordRef = useRef("");

  // Submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Auto-detect GPS location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await res.json();

          const place =
            data.address?.suburb ||
            data.address?.neighbourhood ||
            data.address?.city ||
            data.display_name;

          setLocation(place);
        } catch {
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
      },
      () => {
        alert("Unable to fetch location.");
      }
    );
  };

  // PHOTO UPLOAD 
  const MAX_PHOTOS = 5;
  const MAX_SIZE_MB = 10;

  const addFiles = (files) => {
    setError("");
    const remaining = MAX_PHOTOS - photos.length;
    const toAdd = Array.from(files).slice(0, remaining);
    const newPhotos = [];
    for (const file of toAdd) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`Each image must be under ${MAX_SIZE_MB}MB.`);
        continue;
      }
      newPhotos.push({ file, url: URL.createObjectURL(file) });
    }
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  //  VOICE INPUT 
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const toggleVoice = () => {
    if (!SpeechRecognition) {
      setError("Voice input isn't supported in this browser. Try Chrome or Edge.");
      return;
    }
    if (isRecording) {
      stopVoice();
    } else {
      startVoice();
    }
  };

  const startVoice = () => {
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognitionRef.current = recognition;
    descBeforeRecordRef.current = desc;

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (e) => {
      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      const base = descBeforeRecordRef.current;
      setDesc((base ? base + " " : "") + transcript);
    };

    recognition.onerror = (e) => {
      if (e.error === "not-allowed") {
        setError("Microphone access denied. Please allow mic permission and try again.");
      }
      stopVoice();
    };

    recognition.onend = () => {
      if (recognitionRef.current) stopVoice();
    };

    recognition.start();
  };

  const stopVoice = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  // SUBMIT
  const handleSubmit = async () => {
    setError("");

    if (!title.trim()) { setError("Please enter a title for your request."); return; }
    if (!desc.trim()) { setError("Please describe the situation."); return; }
    if (!location.trim()) { setError("Please enter your location."); return; }
    if (!contact.trim()) { setError("Please enter a contact number."); return; }

    setIsSubmitting(true);

    // Simulate API call — replace with your real endpoint
    const formData = new FormData();
    formData.append("category", cat);
    formData.append("priority", pri);
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("location", location);
    formData.append("contact", contact);
    photos.forEach((p, i) => formData.append(`photo_${i}`, p.file));

    try {
      // await fetch("/api/requests", { method: "POST", body: formData });
      await new Promise((r) => setTimeout(r, 1400)); 
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN 
  if (submitted) {
    return (
      <div style={{ fontFamily: "system-ui,-apple-system,sans-serif", background: "#0a0a0f", color: "#e8e8f0", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 24, padding: "40px 36px", textAlign: "center", maxWidth: 380 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Request Sent!</h2>
          <p style={{ fontSize: 14, color: "rgba(232,232,240,0.6)", marginBottom: 8 }}>
            Your emergency request has been broadcast to nearby responders.
          </p>
          <div style={{ fontSize: 13, color: "rgba(232,232,240,0.5)", marginBottom: 20, lineHeight: 1.6 }}>
            <strong>{categories.find(c => c.id === cat)?.label}</strong> · {priorities.find(p => p.id === pri)?.label} priority<br />
            {title}<br />
            {photos.length} photo{photos.length !== 1 ? "s" : ""} attached
          </div>
          <div style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 12, padding: 12, marginBottom: 20, fontSize: 13, color: "#4ade80" }}>
            🔔 3 responders notified · ETA ~4 min
          </div>
          <button
            onClick={() => { setSubmitted(false); setTitle(""); setDesc(""); setPhotos([]); }}
            style={{ background: "linear-gradient(135deg,#e53e3e,#c53030)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", width: "100%" }}
          >
            Submit another request
          </button>
        </div>
      </div>
    );
  }

  //MAIN FORM 
  return (
    <div style={{ fontFamily: "system-ui,-apple-system,sans-serif", background: "#0a0a0f", color: "#e8e8f0", minHeight: "100vh" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        .glass { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); }
        .glass-strong { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); }
        input, textarea {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          color: #e8e8f0;
          font-size: 14px;
          width: 100%;
          padding: 10px 14px;
          outline: none;
          transition: border-color 0.2s;
          font-family: inherit;
        }
        input::placeholder, textarea::placeholder { color: rgba(232,232,240,0.3); }
        input:focus, textarea:focus { border-color: rgba(229,62,62,0.6); box-shadow: 0 0 0 3px rgba(229,62,62,0.1); }
        textarea { resize: vertical; }
        .cat-btn { transition: all 0.15s; cursor: pointer; }
        .cat-btn:hover { border-color: rgba(229,62,62,0.4) !important; }
        .pri-btn { transition: all 0.15s; cursor: pointer; }
        .pri-btn:hover { border-color: rgba(229,62,62,0.4) !important; }
        .hospital-row:hover { background: rgba(255,255,255,0.04); }
        .submit-btn { transition: opacity 0.2s, transform 0.1s; cursor: pointer; }
        .submit-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .voice-btn { font-size: 12px; font-weight: 500; display: flex; align-items: center; gap: 4px; background: none; border: none; cursor: pointer; padding: 4px 8px; border-radius: 8px; transition: background 0.15s; }
        .voice-btn:hover { background: rgba(165,180,252,0.1); }
        .drop-zone { border: 2px dashed rgba(255,255,255,0.12); border-radius: 16px; padding: 28px 20px; text-align: center; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
        .drop-zone:hover, .drop-zone.dragging { border-color: rgba(229,62,62,0.4); background: rgba(229,62,62,0.03); }
        .photo-thumb { position: relative; border-radius: 10px; overflow: hidden; width: 70px; height: 70px; flex-shrink: 0; }
        .photo-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .photo-remove { position: absolute; top: 3px; right: 3px; background: rgba(0,0,0,0.7); border: none; border-radius: 50%; width: 18px; height: 18px; cursor: pointer; color: #fff; font-size: 11px; display: flex; align-items: center; justify-content: center; padding: 0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .recording-dot { width: 8px; height: 8px; background: #e53e3e; border-radius: 50%; display: inline-block; animation: pulse 1s infinite; margin-right: 6px; }
        @media (max-width: 900px) { .main-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 600px) { .loc-grid { grid-template-columns: 1fr !important; } .pri-grid { grid-template-columns: 1fr 1fr !important; } .cat-grid { grid-template-columns: repeat(3, 1fr) !important; } }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "88px 24px 0" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.5, marginBottom: 6 }}>Request emergency help</h1>
        <p style={{ fontSize: 14, color: "rgba(232,232,240,0.5)" }}>Be specific. AI will match you with the closest verified responder.</p>
      </div>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 60px" }}>
        <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>

          {/* FORM */}
          <div className="glass-strong" style={{ borderRadius: 24, padding: 32 }}>

            {/* Category */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 13, fontWeight: 600 }}>What do you need?</label>
              <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginTop: 12 }}>
                {categories.map(c => (
                  <button type="button" key={c.id} className="cat-btn" onClick={() => setCat(c.id)} style={{
                    padding: "10px 6px", borderRadius: 14,
                    border: cat === c.id ? "2px solid #e53e3e" : "1.5px solid rgba(255,255,255,0.1)",
                    background: cat === c.id ? "rgba(229,62,62,0.08)" : "rgba(255,255,255,0.03)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer",
                  }}>
                    <span style={{ fontSize: 20 }}>{c.emoji}</span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: cat === c.id ? "#f56565" : "rgba(232,232,240,0.6)" }}>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="O-negative blood needed for surgery" />
            </div>

            {/* Description + Voice */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600 }}>Describe the situation</label>
                <button
                  type="button"
                  className="voice-btn"
                  onClick={toggleVoice}
                  style={{ color: isRecording ? "#f87171" : "#a5b4fc", background: isRecording ? "rgba(229,62,62,0.1)" : "none" }}
                >
                  {isRecording ? (
                    <><span className="recording-dot" />Stop recording</>
                  ) : (
                    <>🎤 Voice report</>
                  )}
                </button>
              </div>
              {isRecording && (
                <div style={{ fontSize: 11, color: "#f87171", marginBottom: 6, display: "flex", alignItems: "center" }}>
                  <span className="recording-dot" /> Listening… speak now
                </div>
              )}
              <textarea
                rows={4}
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="Patient age, condition, exact need, when by…"
                style={{ padding: "12px 14px" }}
              />
            </div>

            {/* Priority */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 12 }}>Priority level</label>
              <div className="pri-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {priorities.map(p => (
                  <button type="button" key={p.id} className="pri-btn" onClick={() => setPri(p.id)} style={{
                    padding: "10px 0", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer",
                    ...(pri === p.id ? p.activeStyle : { background: "rgba(255,255,255,0.03)", color: "rgba(232,232,240,0.5)", border: "1.5px solid rgba(255,255,255,0.1)" }),
                  }}>
                    {p.label}
                  </button>
                ))}
              </div>
              {pri === "critical" && (
                <div style={{ marginTop: 12, display: "flex", alignItems: "flex-start", gap: 8, padding: 12, borderRadius: 12, background: "rgba(229,62,62,0.08)", border: "1px solid rgba(229,62,62,0.2)", fontSize: 12, color: "#f87171", lineHeight: 1.6 }}>
                  <span>⚠️</span>
                  Critical requests are broadcast to all verified responders within 10 km and ping nearest hospitals.
                </div>
              )}
            </div>

            {/* Location & Contact */}
            <div className="loc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Location</label>
                <div style={{ position: "relative" }}>
                  <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Detected via GPS · tap to change" style={{ paddingLeft: 34 }} />
                  <button type="button" onClick={detectLocation} title="Use Current Location"
                    style={{
                      position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", cursor: "pointer", fontSize: 18,
                    }}>📍
                  </button>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Contact number</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>📞</span>
                  <input value={contact} onChange={e => setContact(e.target.value)} placeholder="+91 98765 43210" style={{ paddingLeft: 34 }} />
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>
                Attach photos <span style={{ fontWeight: 400, color: "rgba(232,232,240,0.4)" }}>(optional)</span>
              </label>
              <div
                className={`drop-zone${isDragging ? " dragging" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Drop images here or tap to upload</div>
                <div style={{ fontSize: 11, color: "rgba(232,232,240,0.4)", marginTop: 4 }}>Up to 5 images · 10MB each</div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={e => addFiles(e.target.files)}
              />
              {photos.length > 0 && (
                <>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                    {photos.map((p, i) => (
                      <div key={i} className="photo-thumb">
                        <img src={p.url} alt={`upload ${i + 1}`} />
                        <button className="photo-remove" onClick={() => removePhoto(i)}>✕</button>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(232,232,240,0.4)", marginTop: 4 }}>
                    {photos.length}/5 photo{photos.length !== 1 ? "s" : ""} added
                  </div>
                </>
              )}
            </div>

            {/* Error */}
            {error && (
              <div style={{ marginBottom: 16, padding: "12px 14px", borderRadius: 10, background: "rgba(229,62,62,0.1)", border: "1px solid rgba(229,62,62,0.3)", fontSize: 13, color: "#f87171" }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="button"
              className="submit-btn"
              disabled={isSubmitting}
              onClick={handleSubmit}
              style={{
                width: "100%", padding: "14px", borderRadius: 12,
                background: "linear-gradient(135deg, #e53e3e, #c53030)",
                color: "#fff", border: "none", fontSize: 15, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {isSubmitting ? "⏳ Sending…" : "📤 Request Immediate Help"}
            </button>
          </div>

          {/* SIDEBAR */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="glass-strong" style={{ borderRadius: 24, padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#a5b4fc", textTransform: "uppercase", letterSpacing: 2, display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                ✨ AI MATCH PREVIEW
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.3, marginBottom: 16 }}>3 likely responders within 1.5 km</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {responders.map(r => (
                  <div key={r.n} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#e53e3e,#9f7aea)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                      {r.initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.n}</div>
                      <div style={{ fontSize: 11, color: "rgba(232,232,240,0.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.t}</div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#4ade80", flexShrink: 0 }}>{r.eta}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-strong" style={{ borderRadius: 24, padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Nearby hospitals</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {hospitals.map(h => (
                  <div key={h} className="hospital-row" style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 8px", borderRadius: 10, fontSize: 13, color: "rgba(232,232,240,0.7)", cursor: "pointer", transition: "background 0.15s" }}>
                    <span style={{ fontSize: 13, flexShrink: 0 }}>📍</span>
                    {h}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: 20, borderRadius: 20, background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#a5b4fc", marginBottom: 8 }}>💡 TIPS FOR FASTER MATCH</div>
              <ul style={{ fontSize: 12, color: "rgba(232,232,240,0.55)", lineHeight: 1.8, paddingLeft: 16 }}>
                <li>Include blood group if medical</li>
                <li>Mention quantity needed</li>
                <li>Enable GPS for precise location</li>
                <li>Add a contact number</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
