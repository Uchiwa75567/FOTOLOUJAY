"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectProduct = exports.validateProduct = exports.getStats = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const notification_service_1 = require("../services/notification.service");
/**
 * GET /api/admin/stats
 * Role: ADMIN
 */
const getStats = async (req, res) => {
    try {
        const totalUsers = await prisma_1.default.user.count();
        const totalProducts = await prisma_1.default.product.count();
        const validProducts = await prisma_1.default.product.count({ where: { status: "VALID" } });
        const pendingProducts = await prisma_1.default.product.count({ where: { status: "PENDING" } });
        const deletedProducts = await prisma_1.default.product.count({ where: { status: "DELETED" } });
        const vipUsers = await prisma_1.default.user.count({ where: { role: "VIP" } });
        const adminUsers = await prisma_1.default.user.count({ where: { role: "ADMIN" } });
        const moderatorUsers = await prisma_1.default.user.count({ where: { role: "MODERATOR" } });
        const stats = {
            totalUsers,
            totalProducts,
            validProducts,
            pendingProducts,
            deletedProducts,
            vipUsers,
            adminUsers,
            moderatorUsers,
        };
        res.json(stats);
    }
    catch (err) {
        console.error("getStats error:", err);
        res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
    }
};
exports.getStats = getStats;
/**
 * PUT /api/admin/products/:id/validate
 * Role: MODERATOR
 */
const validateProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const product = await prisma_1.default.product.update({
            where: { id },
            data: { status: "VALID" },
            include: { user: true },
        });
        // Send notification
        await (0, notification_service_1.notifyProductValidated)(product.user.email, product.title);
        return res.json(product);
    }
    catch (err) {
        console.error("validateProduct error:", err);
        return res.status(404).json({ message: "Produit introuvable" });
    }
};
exports.validateProduct = validateProduct;
/**
 * PUT /api/admin/products/:id/reject
 * Role: MODERATOR
 * body.reason (optionnel)
 */
const rejectProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { reason } = req.body;
        const product = await prisma_1.default.product.update({
            where: { id },
            data: { status: "DELETED" },
            include: { user: true },
        });
        // Send notification
        await (0, notification_service_1.notifyProductRejected)(product.user.email, product.title, reason);
        return res.json({ product, reason: reason ?? null });
    }
    catch (err) {
        console.error("rejectProduct error:", err);
        return res.status(404).json({ message: "Produit introuvable" });
    }
};
exports.rejectProduct = rejectProduct;
//# sourceMappingURL=admin.controller.js.map