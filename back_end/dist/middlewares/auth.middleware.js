"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireModerator = exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
// Vérifie le token JWT
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Accès non autorisé" });
    }
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ message: "Invalid Authorization format" });
    }
    const token = parts[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // payload doit contenir { id, role }
        req.user = { id: payload.id, role: payload.role };
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.requireAuth = requireAuth;
// Vérifie si le user est modérateur
const requireModerator = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
    }
    if (req.user.role !== "MODERATOR") {
        return res.status(403).json({ message: "Accès réservé aux modérateurs" });
    }
    next();
};
exports.requireModerator = requireModerator;
//# sourceMappingURL=auth.middleware.js.map