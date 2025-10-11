"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/cron/cleanup.ts
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = __importDefault(require("../config/prisma"));
const notification_service_1 = require("../services/notification.service");
/**
 * Cron 1: Purge hebdomadaire — chaque dimanche à 00:00
 * Stratégie : produits VALID publiés il y a >= 7 jours => marquer DELETED
 */
node_cron_1.default.schedule("0 0 * * 0", async () => {
    try {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const res = await prisma_1.default.product.updateMany({
            where: {
                status: "VALID",
                createdAt: { lt: weekAgo },
            },
            data: { status: "DELETED" },
        });
        console.log(`[CRON] Purge hebdo: ${res.count} produits marqués DELETED`);
    }
    catch (err) {
        console.error("[CRON] Erreur purge hebdo:", err);
    }
});
/**
 * Cron 2: Rappel quotidien — tous les jours à 01:00
 * Cherche les produits VALID publiés il y a >=6 jours (donc suppression à J+7)
 * et envoi notification au vendeur
 */
node_cron_1.default.schedule("0 1 * * *", async () => {
    try {
        const sixDaysAgo = new Date();
        sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
        const toRemind = await prisma_1.default.product.findMany({
            where: {
                status: "VALID",
                createdAt: { lt: sixDaysAgo },
            },
            include: { user: true },
        });
        for (const p of toRemind) {
            await (0, notification_service_1.notifyProductReminder)(p.user.email, p.title);
        }
    }
    catch (err) {
        console.error("[CRON] Erreur rappel:", err);
    }
});
//# sourceMappingURL=cleanup.js.map