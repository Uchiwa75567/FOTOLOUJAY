import express from "express";
import {
  createProductWithPhotos,
  createProductWithPhoto,
  createProduct,
  listProducts,
  getUserProducts,
  getProduct,
  republishProduct
} from "../controllers/photo.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = express.Router();

// Routes pour les produits avec photos multiples
router.post("/", requireAuth, createProductWithPhotos);

// Route legacy pour compatibilité
router.post("/single", requireAuth, createProductWithPhoto);

// Route pour créer un produit sans photo (pour tests)
router.post("/no-photo", createProduct);

// Liste des produits validés
router.get("/", listProducts);

// Produits de l'utilisateur connecté
router.get("/user/my-products", requireAuth, getUserProducts);

// Détail d'un produit
router.get("/:id", getProduct);

// Republication d'un produit
router.put("/:id/republish", republishProduct);

export default router;
