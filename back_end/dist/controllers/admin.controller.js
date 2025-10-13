"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectProduct = exports.validateProduct = exports.getPendingProducts = exports.getStats = void 0;
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
 * GET /api/moderator/pending-products
 * Role: MODERATOR
 */
const getPendingProducts = async (req, res) => {
    try {
        const pendingProducts = await prisma_1.default.product.findMany({
            where: { status: "PENDING" },
            include: { user: true },
            orderBy: { createdAt: "desc" },
        });
        res.json(pendingProducts);
    }
    catch (err) {
        console.error("getPendingProducts error:", err);
        res.status(500).json({ message: "Erreur lors de la récupération des produits en attente" });
    }
};
exports.getPendingProducts = getPendingProducts;
/**
 * PUT /api/moderator/products/:id/validate
 * Role: MODERATOR
 * Body: { description? } - Optionnel, met à jour la description si fournie
 */
const validateProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { description } = req.body;
        const updateData = { status: "VALID" };
        if (description) {
            updateData.description = description;
        }
        const product = await prisma_1.default.product.update({
            where: { id },
            data: updateData,
            include: { user: true },
        });
        // Send notification
        await (0, notification_service_1.notifyProductValidated)(product.user.email, product.title);
        return res.json({ ...product, message: "Produit validé avec succès" });
    }
    catch (err) {
        console.error("validateProduct error:", err);
        return res.status(404).json({ message: "Produit introuvable" });
    }
};
exports.validateProduct = validateProduct;
/**
 * PUT /api/moderator/products/:id/reject
 * Role: MODERATOR
 * Body: { reason? } - Optionnel, met à jour la raison de rejet si fournie
 */
const rejectProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { reason } = req.body;
        const updateData = { status: "DELETED" };
        if (reason) {
            updateData.rejectionReason = reason;
        }
        const product = await prisma_1.default.product.update({
            where: { id },
            data: updateData,
            include: { user: true },
        });
        // Send notification
        await (0, notification_service_1.notifyProductRejected)(product.user.email, product.title, reason);
        return res.json({ ...product, message: "Produit rejeté avec succès" });
    }
    catch (err) {
        console.error("rejectProduct error:", err);
        return res.status(404).json({ message: "Produit introuvable" });
    }
};
exports.rejectProduct = rejectProduct;
//# sourceMappingURL=admin.controller.js.map