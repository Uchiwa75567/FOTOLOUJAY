// src/routes/photo.routes.ts
import { Router } from "express";
import { createProductWithPhoto, listProducts, getProduct, republishProduct } from "../controllers/photo.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// publie un produit (photo capturée obligatoire)
router.post("/", requireAuth, createProductWithPhoto);

// liste publique (acheteurs non-connectés)
router.get("/", listProducts);

// détails produit (public) — auth optionnelle
router.get("/:id", getProduct);

// republier un produit
router.put("/:id/republish", requireAuth, republishProduct);

export default router;
