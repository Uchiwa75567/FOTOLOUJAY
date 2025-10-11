"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/photo.routes.ts
const express_1 = require("express");
const photo_controller_1 = require("../controllers/photo.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// publie un produit (upload obligatoire)
router.post("/", auth_middleware_1.requireAuth, photo_controller_1.uploadPhoto, photo_controller_1.createProduct);
// liste publique (acheteurs non-connectés)
router.get("/", photo_controller_1.listProducts);
// détails produit (public) — auth optionnelle
router.get("/:id", photo_controller_1.getProduct);
// republier un produit
router.put("/:id/republish", auth_middleware_1.requireAuth, photo_controller_1.republishProduct);
exports.default = router;
//# sourceMappingURL=photo.routes.js.map