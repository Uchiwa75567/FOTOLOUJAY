import { Router } from "express";
import { getPremiumPacks, initiatePremiumPurchase, getPremiumStatus, handlePremiumWebhook } from "../controllers/premium.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Récupérer les packs premium disponibles (public)
router.get('/packs', getPremiumPacks);

// Initier l'achat d'un pack premium (nécessite authentification)
router.post('/purchase', requireAuth, initiatePremiumPurchase);

// Récupérer le statut premium de l'utilisateur (nécessite authentification)
router.get('/status', requireAuth, getPremiumStatus);

// Webhook PayTech (pas d'authentification - appelé par PayTech)
router.post('/webhook', handlePremiumWebhook);

export default router;
