import { Request, Response } from "express";
import { initiatePremiumPayment, processPremiumPayment } from "../services/premium.service";

export const getPremiumPacks = async (req: Request, res: Response) => {
  try {
    const packs = [
      { id: "week_500", name: "Pack Semaine", price: 500, duration: 7, unit: "jours" },
      { id: "month_3000", name: "Pack Mois", price: 3000, duration: 30, unit: "jours" },
      { id: "month_20000", name: "Pack Premium", price: 20000, duration: 30, unit: "jours" }
    ];

    res.json({ packs });
  } catch (error) {
    console.error("Erreur lors de la récupération des packs premium:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const initiatePremiumPurchase = async (req: Request, res: Response) => {
  try {
    const { packId } = req.body;
    const userId = (req as any).user.id;

    if (!packId) {
      return res.status(400).json({ message: "Pack ID requis" });
    }

    const result = await initiatePremiumPayment(userId, packId);
    res.json(result);
  } catch (error: any) {
    console.error("Erreur lors de l'initiation du paiement premium:", error);
    if (error.message === "Pack premium invalide") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Erreur lors de l'initiation du paiement" });
  }
};

export const handlePremiumWebhook = async (req: Request, res: Response) => {
  try {
    const { type_event, token } = req.body;

    if (type_event === 'sale_complete' && token) {
      const result = await processPremiumPayment(token);
      console.log('Paiement premium traité avec succès:', result);
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error("Erreur lors du traitement du webhook premium:", error);
    res.status(500).json({ message: "Erreur lors du traitement du webhook" });
  }
};

export const getPremiumStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Cette logique sera déplacée dans le service plus tard
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { premiumExpiry: true, role: true }
    });

    await prisma.$disconnect();

    const isPremium = user.premiumExpiry && user.premiumExpiry > new Date();
    const daysRemaining = isPremium
      ? Math.ceil((user.premiumExpiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : 0;

    res.json({
      isPremium,
      premiumExpiry: user.premiumExpiry,
      daysRemaining
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du statut premium:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
