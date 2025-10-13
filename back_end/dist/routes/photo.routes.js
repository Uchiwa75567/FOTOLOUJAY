"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/photo.routes.ts
const express_1 = require("express");
const photo_controller_1 = require("../controllers/photo.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// publie un produit (photo capturée obligatoire)
router.post("/", auth_middleware_1.requireAuth, photo_controller_1.createProductWithPhoto);
// liste publique (acheteurs non-connectés)
router.get("/", photo_controller_1.listProducts);
// récupérer les produits de l'utilisateur connecté (tous les statuts)
router.get("/user/my-products", auth_middleware_1.requireAuth, photo_controller_1.getUserProducts);
// détails produit (public) — auth optionnelle
router.get("/:id", photo_controller_1.getProduct);
// republier un produit
router.put("/:id/republish", auth_middleware_1.requireAuth, photo_controller_1.republishProduct);
exports.default = router;
//# sourceMappingURL=photo.routes.js.map