// src/Components/usercontext.jsx
// ────────
// Drop-in replacement for the existing usercontext.
// Wires login/logout/signup to the real backend.
// ────────
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../services/api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [userData,  setUserData]  = useState(null);
  const [loading,   setLoading]   = useState(true);   // initial session restore
  const [authError, setAuthError] = useState(null);

  // ── Restore session on mount ──────────────────────
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) { setLoading(false); return; }

      try {
        const { data } = await authAPI.getMe();
        setUserData(data.user);
      } catch (err) {
        // Token expired — try to silently refresh
        if (err.status === 401) {
          try {
            await authAPI.refreshToken();
            const { data } = await authAPI.getMe();
            setUserData(data.user);
          } catch {
            localStorage.removeItem("accessToken");
          }
        }
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  // ── login() — called after a successful API response ────────────────────
  // Can be called with either:
  //   a) the user object returned by the backend  (preferred)
  //   b) any partial object (legacy local-only usage)
  const login = useCallback((userOrData) => {
    setUserData(userOrData);
    setAuthError(null);
  }, []);

  // ── logout() ───────────────
  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
      // Even if the server call fails, clear local state
      localStorage.removeItem("accessToken");
    }
    setUserData(null);
  }, []);

  // ── updateUser() — optimistic local update after PATCH /auth/me ─────────
  const updateUser = useCallback((updates) => {
    setUserData((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  const value = {
    userData,
    loading,
    authError,
    setAuthError,
    login,
    logout,
    updateUser,
    isAuthenticated: !!userData,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
};
