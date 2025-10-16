"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const photo_routes_1 = __importDefault(require("./routes/photo.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_route_1 = __importDefault(require("./routes/admin.route"));
const premium_routes_1 = __importDefault(require("./routes/premium.routes"));
const settings_routes_1 = __importDefault(require("./routes/settings.routes"));
const like_routes_1 = __importDefault(require("./routes/like.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
require("./cron/cleanup"); // démarre les crons
const app = (0, express_1.default)();
// Configuration CORS pour permettre les requêtes depuis le frontend Angular
const corsOptions = {
    origin: ['http://localhost:4200', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600 // 10 minutes
};
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: "5mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
const limiter = (0, express_rate_limit_1.default)({ windowMs: 60 * 1000, max: 120 }); // 120 req/min
app.use(limiter);
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/products", photo_routes_1.default);
app.use("/api/admin", admin_route_1.default);
app.use("/api/premium", premium_routes_1.default);
app.use("/api/settings", settings_routes_1.default);
app.use("/api/likes", like_routes_1.default);
app.use("/api/notifications", notification_routes_1.default);
// Static uploads (serve images)
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
const PORT = 3001;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
//# sourceMappingURL=index.js.map