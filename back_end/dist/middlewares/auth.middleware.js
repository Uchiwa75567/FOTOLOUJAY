"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireModerator = exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log("[AUTH] No authorization header provided");
        return res.status(401).json({ message: "Accès non autorisé - Header Authorization manquant" });
    }
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        console.log("[AUTH] Invalid Authorization format:", authHeader);
        return res.status(401).json({ message: "Format Authorization invalide - Utilisez 'Bearer <token>'" });
    }
    const token = parts[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (!payload.id || !payload.role) {
            console.log("[AUTH] Token payload incomplete:", payload);
            return res.status(401).json({ message: "Token invalide - Payload incomplet (id/role manquants)" });
        }
        // Check expiration (already in verify, but explicit)
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            console.log("[AUTH] Token expired:", payload.exp, "now:", now);
            return res.status(401).json({ message: "Token expiré - Reloggez-vous" });
        }
        req.user = { id: payload.id, role: payload.role };
        console.log("[AUTH] Token verified for user ID:", payload.id, "role:", payload.role);
        next();
    }
    catch (err) {
        console.log("[AUTH] JWT verification failed:", err.message);
        return res.status(401).json({ message: "Token invalide ou expiré - " + err.message });
    }
};
exports.requireAuth = requireAuth;
const requireModerator = (req, res, next) => {
    if (!req.user) {
        console.log("[MODERATOR] No user in request - Auth required first");
        return res.status(401).json({ message: "Utilisateur non authentifié - Authentifiez-vous d'abord" });
    }
    const allowedRoles = ["MODERATOR", "ADMIN"];
    if (!allowedRoles.includes(req.user.role)) {
        console.log("[MODERATOR] Insufficient role:", req.user.role, "- Required:", allowedRoles);
        return res.status(403).json({
            message: `Accès réservé aux modérateurs ou admins - Votre rôle: ${req.user.role}`
        });
    }
    console.log("[MODERATOR] Access granted to user ID:", req.user.id, "role:", req.user.role);
    next();
};
exports.requireModerator = requireModerator;
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        console.log("[ADMIN] No user in request - Auth required first");
        return res.status(401).json({ message: "Utilisateur non authentifié - Authentifiez-vous d'abord" });
    }
    if (req.user.role !== "ADMIN") {
        console.log("[ADMIN] Insufficient role:", req.user.role, "- Required: ADMIN");
        return res.status(403).json({
            message: `Accès réservé aux administrateurs - Votre rôle: ${req.user.role}`
        });
    }
    console.log("[ADMIN] Access granted to user ID:", req.user.id);
    next();
};
exports.requireAdmin = requireAdmin;
//# sourceMappingURL=auth.middleware.js.map