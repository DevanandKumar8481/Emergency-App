// src/services/api.js
// ─────────────────────────────────
// Central API client for ResQ Link frontend.
// Drop this in src/services/api.js and import from any component.
// ─────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── Low-level fetch wrapper ──────
async function request(endpoint, options = {}) {
  const token = localStorage.getItem("accessToken");

  const config = {
    credentials: "include",           // send/receive cookies automatically
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  const res  = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    // Attach status so callers can check it
    const err    = new Error(data.message || "Request failed");
    err.status   = res.status;
    err.errors   = data.errors;   // field-level validation errors
    err.data     = data;
    throw err;
  }

  return data;
}

// ─── Auth helpers ─────────────────
const saveTokens = (accessToken) => {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
};

const clearTokens = () => {
  localStorage.removeItem("accessToken");
};

// ─── Auth API ─────────────────────
export const authAPI = {
  /**
   * Register a new user.
   * Returns { userId, phone, otp? }   (otp only in dev mode)
   */
  signup: async (formData, role) => {
    const body = { ...formData, role };
    const data = await request("/auth/signup", { method: "POST", body });
    return data;
  },

  /**
   * Verify the phone OTP sent during signup.
   * On success, saves the access token and returns the user object.
   */
  verifyOtp: async (userId, otp) => {
    const data = await request("/auth/verify-otp", {
      method: "POST",
      body: { userId, otp },
    });
    if (data.data?.accessToken) saveTokens(data.data.accessToken);
    return data;
  },

  /** Resend the phone OTP */
  resendOtp: async (userId) =>
    request("/auth/resend-otp", { method: "POST", body: { userId } }),

  /**
   * Email + password login.
   * Returns { user, accessToken } or { requiresVerification, userId, phone }
   */
  login: async (email, password) => {
    const data = await request("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    if (data.data?.accessToken) saveTokens(data.data.accessToken);
    return data;
  },

  /** Step 1 of phone-OTP login — sends OTP */
  loginWithPhone: async (phone) =>
    request("/auth/login/phone", { method: "POST", body: { phone } }),

  /** Step 2 of phone-OTP login — verifies OTP */
  verifyLoginOtp: async (userId, otp) => {
    const data = await request("/auth/login/phone/verify", {
      method: "POST",
      body: { userId, otp },
    });
    if (data.data?.accessToken) saveTokens(data.data.accessToken);
    return data;
  },

  /** Get the currently authenticated user */
  getMe: () => request("/auth/me"),

  /** Update the current user's profile */
  updateMe: (updates) =>
    request("/auth/me", { method: "PATCH", body: updates }),

  /** Change password */
  changePassword: (currentPassword, newPassword) =>
    request("/auth/change-password", {
      method: "PATCH",
      body: { currentPassword, newPassword },
    }),

  /** Logout — clears server session + local token */
  logout: async () => {
    try {
      await request("/auth/logout", { method: "POST" });
    } finally {
      clearTokens();
    }
  },

  /** Delete own account */
  deleteMe: async () => {
    const data = await request("/auth/me", { method: "DELETE" });
    clearTokens();
    return data;
  },

  /** Silently refresh the access token using the httpOnly refresh-token cookie */
  refreshToken: async () => {
    const data = await request("/auth/refresh", { method: "POST" });
    if (data.data?.accessToken) saveTokens(data.data.accessToken);
    return data;
  },
};

// ─── Users API ────────────────────
export const usersAPI = {
  getVolunteers: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/users/volunteers${qs ? `?${qs}` : ""}`);
  },
  getProviders: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/users/providers${qs ? `?${qs}` : ""}`);
  },
  getProfile: (id) => request(`/users/${id}`),
  setOnlineStatus: (id, isOnline) =>
    request(`/users/${id}/online`, { method: "PATCH", body: { isOnline } }),
};

export default { authAPI, usersAPI };
