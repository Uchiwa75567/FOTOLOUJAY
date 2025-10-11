"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.requireModerator = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Usage: router.put("/...": authMiddleware, requireModerator, controller)
 */
const requireModerator = async (req, res, next) => {
    try {
        const userIdRaw = req.userId;
        if (!userIdRaw)
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        const user = await prisma_1.default.user.findUnique({ where: { id: Number(userIdRaw) } });
        if (!user)
            return res.status(401).json({ message: "Utilisateur introuvable" });
        if (user.role !== "MODERATOR")
            return res.status(403).json({ message: "Accès réservé aux modérateurs" });
        // OK
        return next();
    }
    catch (err) {
        console.error("requireModerator error:", err);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.requireModerator = requireModerator;
const isAdmin = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Token manquant" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "ADMIN") {
            return res.status(403).json({ message: "Accès réservé aux administrateurs" });
        }
        // Stocke les infos de l'utilisateur dans la requête pour plus tard
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Token invalide ou expiré" });
    }
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=role.middleware.js.map