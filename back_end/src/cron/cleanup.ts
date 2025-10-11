// src/cron/cleanup.ts
import cron from "node-cron";
import prisma from "../config/prisma";
import { notifyProductReminder } from "../services/notification.service";

/**
 * Cron 1: Purge hebdomadaire — chaque dimanche à 00:00
 * Stratégie : produits VALID publiés il y a >= 7 jours => marquer DELETED
 */
cron.schedule("0 0 * * 0", async () => {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const res = await prisma.product.updateMany({
      where: {
        status: "VALID",
        createdAt: { lt: weekAgo },
      },
      data: { status: "DELETED" },
    });

    console.log(`[CRON] Purge hebdo: ${res.count} produits marqués DELETED`);
  } catch (err) {
    console.error("[CRON] Erreur purge hebdo:", err);
  }
});

/**
 * Cron 2: Rappel quotidien — tous les jours à 01:00
 * Cherche les produits VALID publiés il y a >=6 jours (donc suppression à J+7)
 * et envoi notification au vendeur
 */
cron.schedule("0 1 * * *", async () => {
  try {
    const sixDaysAgo = new Date();
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

    const toRemind = await prisma.product.findMany({
      where: {
        status: "VALID",
        createdAt: { lt: sixDaysAgo },
      },
      include: { user: true },
    });

    for (const p of toRemind) {
      await notifyProductReminder(p.user.email, p.title);
    }
  } catch (err) {
    console.error("[CRON] Erreur rappel:", err);
  }
});
