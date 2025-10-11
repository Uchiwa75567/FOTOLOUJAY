// src/index.ts
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import photoRoutes from "./routes/photo.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.route";
import "./cron/cleanup"; // démarre les crons

const app = express();

app.use(helmet());
app.use(cors());
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
