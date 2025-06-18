const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Routes
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const setupRoutes = require("./routes/setupRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ✅ Middleware

// Helmet for security
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ✅ CORS — allow frontend from Render environment variable
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Log origin for debug (optional)
app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  next();
});

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ API routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/setup", setupRoutes);

// ✅ Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "QuickFix API is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use(errorHandler);

// 404 handler for /api
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/quickfix", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 API available at: http://localhost:${PORT}/api`);
});

module.exports = app
