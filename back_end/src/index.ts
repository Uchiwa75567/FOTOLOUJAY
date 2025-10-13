// src/index.ts
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import type { CorsOptions } from "cors";
import photoRoutes from "./routes/photo.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.route";
import "./cron/cleanup"; // démarre les crons

const app = express();

// Configuration CORS pour permettre les requêtes depuis le frontend Angular
const corsOptions: CorsOptions = {
  origin: ['http://localhost:4200', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // 10 minutes
};

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors(corsOptions));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 }); // 120 req/min
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", photoRoutes);
app.use("/api/admin", adminRoutes);

// Static uploads (serve images)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const PORT = 3001;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
