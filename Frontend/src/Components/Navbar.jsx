import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { useUser } from "./usercontext";

const ALL_LINKS = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/map",       label: "Live Map" },
  { to: "/donate",    label: "Blood Donation" },
  { to: "/alerts",    label: "Alerts" },
  { to: "/analytics", label: "Analytics" },
  { to: "/adminpage", label: "Admin Panel", adminOnly: true },
  { to: "/trackpage", label: "Track Request" },
];

const NON_ADMIN_ROLES = ["requester", "volunteer", "provider"];

if (typeof document !== "undefined" && !document.getElementById("navbar-resp-styles")) {
  const s = document.createElement("style");
  s.id = "navbar-resp-styles";
  s.textContent = `
    @media (max-width: 768px) {
      .nb-desktop-links  { display: none !important; }
      .nb-desktop-right  { display: none !important; }
      .nb-hamburger      { display: flex  !important; }
    }
    @media (min-width: 769px) {
      .nb-hamburger { display: none !important; }
    }
    @keyframes drawerIn  { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0);     opacity: 1; } }
    @keyframes drawerOut { from { transform: translateX(0);     opacity: 1; } to { transform: translateX(-100%); opacity: 0; } }
    .nb-drawer         { animation: drawerIn  .25s ease forwards; }
    .nb-drawer.closing { animation: drawerOut .22s ease forwards; }
    @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
    .nb-overlay        { animation: fadeIn .2s ease forwards; }
    .nb-mob-link:hover  { background: rgba(245,101,101,0.06) !important; color: #e8e8f0 !important; }
    .nb-desk-link:hover { color: #e8e8f0 !important; }
    .nb-logout-btn:hover { background: rgba(239,68,68,0.08) !important; }
    .nb-avatar:hover { opacity: .85; transform: scale(1.05); }
    .nb-avatar { transition: opacity .15s, transform .15s; }
  `;
  document.head.appendChild(s);
}

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { userData, isLoggedIn, logout } = useUser();

  const [open,    setOpen]    = useState(false);
  const [closing, setClosing] = useState(false);

  // Derived values 
  const visibleLinks = ALL_LINKS.filter((link) => {
    if (!link.adminOnly) return true;
    if (!userData) return false;
    return !NON_ADMIN_ROLES.includes(userData.role);
  });

  // Use pre-computed initials stored at login, fallback to computing on the fly
  const initials = userData?.initials || (() => {
    const name = userData?.displayName || userData?.name || userData?.orgName || "";
    return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "U";
  })();

  const roleLabel = userData
    ? ({
        volunteer: "Volunteer",
        requester:  "Requester",
        provider:   "Resource Provider",
        ngo:        "NGO / Authority",
      }[userData.role] ?? "")
    : "";

  // Drawer helpers 
  function closeDrawer() {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 210);
  }

  function handleLogout() {
    closeDrawer();
    logout();
    navigate("/login");
  }

  // Render 
  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 60, padding: "0 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(10,10,15,0.92)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
      }}>

        {/* Logo */}
        <Link to={isLoggedIn ? "/dashboard" : "/login"} style={{ display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#f56565" }}>ResQ</span>
          <span style={{ fontSize: 20, fontWeight: 300, color: "#e8e8f0" }}>Link</span>
        </Link>

        {/* Desktop nav links — only shown when logged in */}
        {isLoggedIn && (
          <div className="nb-desktop-links" style={{ display: "flex", gap: 22, fontSize: 14 }}>
            {visibleLinks.map((l) => (
              <Link key={l.to} to={l.to} className="nb-desk-link" style={{
                textDecoration: "none",
                color: pathname === l.to ? "#e8e8f0" : "rgba(232,232,240,0.5)",
                fontWeight: pathname === l.to ? 600 : 400,
                borderBottom: pathname === l.to ? "1.5px solid #f56565" : "none",
                paddingBottom: 2,
                transition: "color .15s",
              }}>{l.label}</Link>
            ))}
          </div>
        )}

        {/* Desktop right section */}
        <div className="nb-desktop-right" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isLoggedIn ? (
            /* Logged in: avatar → profile page  */
            <Link
              to="/profile"
              className="nb-avatar"
              title={`${userData?.displayName || "Profile"} · ${roleLabel}`}
              style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "linear-gradient(135deg,#f66565,#e53e3e)",
                display: "flex", alignItems: "center", justifyContent: "center",
                textDecoration: "none", fontWeight: 700, fontSize: 14, color: "#fff",
                flexShrink: 0,
              }}
            >
              {initials}
            </Link>
          ) : (
            /*  Not logged in: Sign in + Sign up buttons */
            <>
              <Link to="/login" style={{
                padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                textDecoration: "none", color: "#e8e8f0",
                border: "1.5px solid rgba(255,255,255,0.2)",
              }}>Sign in</Link>
              <Link to="/signup" style={{
                background: "linear-gradient(135deg,#e53e3e,#c53030)",
                color: "#fff", padding: "8px 16px",
                borderRadius: 8, fontSize: 13, fontWeight: 700,
                textDecoration: "none",
              }}>Sign up</Link>
            </>
          )}
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="nb-hamburger"
          onClick={() => setOpen(true)}
          style={{
            display: "none",
            alignItems: "center", justifyContent: "center",
            width: 38, height: 38, borderRadius: 9,
            border: "1.5px solid rgba(255,255,255,0.15)",
            background: "transparent", cursor: "pointer",
          }}
        >
          <Menu size={18} color="#e8e8f0" />
        </button>
      </nav>

      <div style={{ height: 60 }} />

      {/*  Mobile Drawer  */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="nb-overlay"
            onClick={closeDrawer}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.45)" }}
          />

          {/* Drawer panel */}
          <div
            className={`nb-drawer${closing ? " closing" : ""}`}
            style={{
              position: "fixed", top: 0, left: 0, bottom: 0,
              width: "82vw", maxWidth: 340,
              zIndex: 201,
              background: "#ffffff",
              borderRadius: "0 24px 24px 0",
              boxShadow: "4px 0 32px rgba(0,0,0,0.18)",
              display: "flex", flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Drawer header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 20px",
              borderBottom: "1px solid #f0f0f4",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {isLoggedIn ? (
                  /* Avatar in drawer */
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "linear-gradient(135deg,#f56565,#e53e3e)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 14, color: "#fff",
                  }}>
                    {initials}
                  </div>
                ) : (
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "#f0f0f4",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <User size={18} color="#9ca3af" />
                  </div>
                )}

                <div>
                  <span style={{ fontWeight: 800, fontSize: 16, color: "#111" }}>
                    ResQ<span style={{ color: "#f56565" }}>Link</span>
                  </span>
                  {isLoggedIn && roleLabel && (
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{roleLabel}</div>
                  )}
                  {isLoggedIn && userData?.displayName && (
                    <div style={{ fontSize: 12, color: "#374151", fontWeight: 600, marginTop: 1 }}>
                      {userData.displayName}
                    </div>
                  )}
                </div>
              </div>

              <button onClick={closeDrawer} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <X size={22} color="#6b7280" />
              </button>
            </div>

            {/* Nav links */}
            <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
              {isLoggedIn && visibleLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={closeDrawer}
                  className="nb-mob-link"
                  style={{
                    display: "block",
                    padding: "14px 16px",
                    borderRadius: 10,
                    textDecoration: "none",
                    fontSize: 16,
                    fontWeight: pathname === l.to ? 700 : 500,
                    color: pathname === l.to ? "#f56565" : "#111827",
                    background: pathname === l.to ? "rgba(245,101,101,0.07)" : "transparent",
                    marginBottom: 2,
                    transition: "background .15s, color .15s",
                  }}
                >
                  {l.label}
                </Link>
              ))}

              {/* Profile link — only when logged in */}
              {isLoggedIn && (
                <Link
                  to="/profile"
                  onClick={closeDrawer}
                  className="nb-mob-link"
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "14px 16px", borderRadius: 10,
                    textDecoration: "none", fontSize: 16,
                    fontWeight: pathname === "/profile" ? 700 : 500,
                    color: pathname === "/profile" ? "#f56565" : "#111827",
                    background: pathname === "/profile" ? "rgba(245,101,101,0.07)" : "transparent",
                    marginBottom: 2,
                    transition: "background .15s, color .15s",
                  }}
                >
                  <User size={18} /> My Profile
                </Link>
              )}
            </nav>

            {/* Bottom CTA */}
            <div style={{ padding: "16px 16px 28px", borderTop: "1px solid #f0f0f4" }}>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="nb-logout-btn"
                  style={{
                    width: "100%", padding: "13px 0", borderRadius: 12,
                    border: "1.5px solid #fee2e2", background: "#fff",
                    color: "#e53e3e", fontWeight: 700, fontSize: 14,
                    cursor: "pointer", display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 8,
                    transition: "background .15s",
                  }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              ) : (
                <div style={{ display: "flex", gap: 10 }}>
                  <Link to="/login" onClick={closeDrawer} style={{
                    flex: 1, padding: "12px 0", borderRadius: 12,
                    border: "1.5px solid #e8eaed", background: "#fff",
                    color: "#111", fontWeight: 600, fontSize: 14,
                    textDecoration: "none", textAlign: "center", display: "block",
                  }}>Sign in</Link>
                  <Link to="/signup" onClick={closeDrawer} style={{
                    flex: 1, padding: "12px 0", borderRadius: 12,
                    background: "linear-gradient(135deg,#e53e3e,#c53030)",
                    color: "#fff", fontWeight: 700, fontSize: 14,
                    textDecoration: "none", textAlign: "center", display: "block",
                  }}>Sign up</Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}