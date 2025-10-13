// src/routes/photo.routes.ts
import { Router } from "express";
import { createProductWithPhoto, listProducts, getProduct, republishProduct, getUserProducts } from "../controllers/photo.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// publie un produit (photo capturée obligatoire)
router.post("/", requireAuth, createProductWithPhoto);

// liste publique (acheteurs non-connectés)
router.get("/", listProducts);

// récupérer les produits de l'utilisateur connecté (tous les statuts)
router.get("/user/my-products", requireAuth, getUserProducts);

// détails produit (public) — auth optionnelle
router.get("/:id", getProduct);

// republier un produit
router.put("/:id/republish", requireAuth, republishProduct);

export default router;
