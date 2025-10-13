"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const premium_controller_1 = require("../controllers/premium.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Récupérer les packs premium disponibles (public)
router.get('/packs', premium_controller_1.getPremiumPacks);
// Initier l'achat d'un pack premium (nécessite authentification)
router.post('/purchase', auth_middleware_1.requireAuth, premium_controller_1.initiatePremiumPurchase);
// Récupérer le statut premium de l'utilisateur (nécessite authentification)
router.get('/status', auth_middleware_1.requireAuth, premium_controller_1.getPremiumStatus);
// Webhook PayTech (pas d'authentification - appelé par PayTech)
router.post('/webhook', premium_controller_1.handlePremiumWebhook);
exports.default = router;
//# sourceMappingURL=premium.routes.js.map