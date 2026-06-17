// server.js  ─── ResQ Link API entry point
require("dotenv").config();

const express      = require("express");
const cors         = require("cors");
const helmet       = require("helmet");
const morgan       = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit    = require("express-rate-limit");

const connectDB          = require("./config/db");
const { errorHandler }   = require("./middleware/errorHandler");
const authRoutes          = require("./routes/authRoutes");
const userRoutes          = require("./routes/userRoutes");

// ─── Connect to MongoDB ───────────
connectDB();

// ─── App setup ────────────────────
const app = express();

// Security headers
app.use(helmet());

// CORS — allow configured origins (supports credentials for cookies)
const allowedOrigins = (process.env.CLIENT_ORIGINS || "http://localhost:3000,http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow server-to-server (no origin) or allowed list
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: ${origin} not allowed`));
    },
    credentials: true,           // Required for cookie-based auth
    methods:     ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET || "cookie_secret"));

// HTTP request logger (skip in test env)
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Global rate limiter (safety net — per-route limiters are stricter)
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max:      300,
    standardHeaders: true,
    legacyHeaders:   false,
    message: { success: false, message: "Too many requests. Please try again later." },
  })
);

// ─── Routes ───────────────────────
app.use("/api/auth",  authRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ResQ Link API is running 🚀",
    env:     process.env.NODE_ENV,
    time:    new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// ─── Start server ─────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🚨  ResQ Link API  🚨               ║
║   Port:   ${PORT}                         ║
║   Env:    ${(process.env.NODE_ENV || "development").padEnd(12)}             ║
║   Docs:   /api/health                 ║
╚═══════════════════════════════════════╝
  `);
});

module.exports = app; // for testing
