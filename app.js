import express from "express";
import cors from "cors";
import "dotenv/config";

import { authenticate, sync } from "./config/database.js";

// ROUTES
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import posRoutes from "./routes/pos.js";

const app = express();

/* ===== BODY PARSERS ===== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===== CORS ===== */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/* ===== ROUTES ===== */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pos", posRoutes);

/* ===== HEALTH CHECK ===== */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

/* ===== DEFAULT ROOT ===== */
app.get("/", (req, res) => {
  res.send("Backend API Running...");
});

/* ===== 404 HANDLER ===== */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ===== START SERVER ===== */
(async () => {
  try {
    // Authenticate DBs
    await authenticate();

    // Sync DBs (use alter:true for dev)
    await sync({ alter: true });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1); 
  }
})();