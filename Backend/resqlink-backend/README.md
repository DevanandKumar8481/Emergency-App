# ResQ Link — Backend API

Full Node.js + Express + MongoDB authentication backend for the ResQ Link emergency response platform.

---

## Project Structure

```
resqlink-backend/
├── config/
│   └── db.js                    # MongoDB connection
├── controllers/
│   └── authController.js        # All auth logic
├── middleware/
│   ├── auth.js                  # JWT protect / restrictTo / optionalAuth
│   ├── validate.js              # express-validator error formatter
│   └── errorHandler.js          # Global error handler + asyncHandler
├── models/
│   └── User.js                  # Mongoose schema (all 4 roles)
├── routes/
│   ├── authRoutes.js            # /api/auth/*
│   └── userRoutes.js            # /api/users/*
├── utils/
│   ├── jwt.js                   # Sign / verify tokens
│   ├── otp.js                   # Generate / verify OTP
│   └── apiResponse.js           # Consistent { success, message, data }
├── frontend-integration/        # Drop-in replacements for your React files
│   ├── api.js           →  src/services/api.js
│   ├── usercontext.jsx  →  src/Components/usercontext.jsx
│   ├── LoginPage.jsx    →  src/Pages/LoginPage.jsx
│   └── SignupPage.jsx   →  src/Pages/SignupPage.jsx
├── .env.example
├── server.js
└── package.json
```

---

## Quick Start

### 1. Install dependencies
```bash
cd resqlink-backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/resqlink
JWT_SECRET=your_super_secret_32_char_minimum_key
JWT_REFRESH_SECRET=another_secret_key
CLIENT_ORIGINS=http://localhost:5173
```

### 3. Start MongoDB
```bash
# Option A — local
mongod

# Option B — Docker
docker run -d -p 27017:27017 --name resq-mongo mongo:7

# Option C — MongoDB Atlas (paste Atlas URI into MONGODB_URI)
```

### 4. Run the server
```bash
npm run dev      # nodemon (auto-restart)
npm start        # production
```

Server starts at **http://localhost:5000**

---

## API Reference

### Base URL
```
http://localhost:5000/api
```

### Health check
```
GET /api/health
```

---

### Auth endpoints  `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | — | Register new user |
| POST | `/verify-otp` | — | Verify phone OTP (completes signup) |
| POST | `/resend-otp` | — | Resend phone OTP |
| POST | `/login` | — | Email + password login |
| POST | `/login/phone` | — | Send login OTP to phone |
| POST | `/login/phone/verify` | — | Verify login OTP |
| POST | `/refresh` | — | Refresh access token |
| POST | `/logout` | ✅ | Logout (clears tokens) |
| GET | `/me` | ✅ | Get current user profile |
| PATCH | `/me` | ✅ | Update profile |
| PATCH | `/change-password` | ✅ | Change password |
| DELETE | `/me` | ✅ | Deactivate account |

---

### Signup — POST `/api/auth/signup`

**Body (Volunteer example):**
```json
{
  "role":           "volunteer",
  "name":           "Aarav Sharma",
  "email":          "aarav@example.com",
  "password":       "secret123",
  "phone":          "+919876543210",
  "emergencyPhone": "+919876543211",
  "location":       "Mumbai, Maharashtra",
  "skills":         "CPR Certified, Trauma response",
  "availability":   "On Call"
}
```

**Body (Provider example):**
```json
{
  "role":          "provider",
  "orgName":       "Apollo Blood Bank",
  "contactPerson": "Jane Doe",
  "email":         "contact@apollo.com",
  "password":      "secret123",
  "phone":         "+919876543210",
  "location":      "Delhi",
  "resourceType":  "Blood"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Account created. Please verify your phone.",
  "data": {
    "userId": "665abc123...",
    "phone":  "+919876543210",
    "otp":    "482910"      ← DEV ONLY, removed in production
  }
}
```

---

### Verify OTP — POST `/api/auth/verify-otp`
```json
{ "userId": "665abc123...", "otp": "482910" }
```
**Response `200`:** Returns `{ accessToken, user }` and sets httpOnly cookies.

---

### Login — POST `/api/auth/login`
```json
{ "email": "aarav@example.com", "password": "secret123" }
```
**Response `200`:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "user": { "_id": "...", "role": "volunteer", "displayName": "Aarav", ... }
  }
}
```

---

### Phone OTP Login (2-step)

**Step 1 — send OTP:**
```
POST /api/auth/login/phone
{ "phone": "+919876543210" }
```

**Step 2 — verify OTP:**
```
POST /api/auth/login/phone/verify
{ "userId": "665abc...", "otp": "382910" }
```

---

### Protected routes

Pass the JWT in either:
- **Header:** `Authorization: Bearer <token>`
- **Cookie:** `accessToken` (set automatically on login)

---

## Integrating with the React frontend

### 1. Copy integration files
```bash
cp frontend-integration/api.js          ../src/services/api.js
cp frontend-integration/usercontext.jsx ../src/Components/usercontext.jsx
cp frontend-integration/LoginPage.jsx   ../src/Pages/LoginPage.jsx
cp frontend-integration/SignupPage.jsx  ../src/Pages/SignupPage.jsx
```

### 2. Add environment variable to your Vite project
```env
# .env (in your React project root)
VITE_API_URL=http://localhost:5000/api
```

### 3. Wrap your app with UserProvider (already done if you have it)
```jsx
// src/main.jsx
import { UserProvider } from "./Components/usercontext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
```

---

## Security features

| Feature | Detail |
|---------|--------|
| Password hashing | bcrypt with salt rounds = 12 |
| Access token | JWT, 7-day expiry, httpOnly cookie + Authorization header |
| Refresh token | JWT, 30-day expiry, httpOnly cookie, stored hash in DB |
| Token rotation | New refresh token issued on every `/refresh` call |
| Account lockout | 5 failed logins → 30-minute lock |
| OTP security | 6-digit, 10-minute expiry, max 5 attempts, single-use |
| Rate limiting | Auth routes: 20 req/15min · OTP routes: 5 req/10min |
| CORS | Configured per `CLIENT_ORIGINS` env variable |
| Helmet | Security headers on all responses |
| Input validation | express-validator on all routes |

---

## OTP in production

The `otp` field is **only returned in the API response** when `NODE_ENV=development`.

In production, integrate a real SMS provider. Replace the `console.log` in:
- `controllers/authController.js` → `signup()`, `resendOtp()`, `loginWithPhone()`

**Twilio example:**
```js
const twilio = require("twilio");
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

await client.messages.create({
  body: `Your ResQ Link OTP is: ${otp}. Valid for 10 minutes.`,
  from: process.env.TWILIO_PHONE_NUMBER,
  to:   phone,
});
```

---

## MongoDB collections

After first signup, MongoDB will have:
- `users` — main user collection (all roles)

Indexes created automatically:
- `email` — unique, sparse
- `phone` — unique, sparse
- `role`  — regular index for filtering

---

## Error response format

All errors follow:
```json
{
  "success": false,
  "message": "Human-readable error",
  "errors":  { "field": "Field-level error" }   ← only for validation failures
}
```

Common status codes:
- `400` — Bad request / validation
- `401` — Not authenticated
- `403` — Forbidden (wrong role)
- `404` — Not found
- `409` — Conflict (duplicate email/phone)
- `422` — Validation failed (field errors)
- `423` — Account locked
- `429` — Rate limited
- `500` — Server error
