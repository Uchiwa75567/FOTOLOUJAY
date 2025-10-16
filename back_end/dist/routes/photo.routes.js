"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const photo_controller_1 = require("../controllers/photo.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
// Routes pour les produits avec photos multiples
router.post("/", auth_middleware_1.requireAuth, photo_controller_1.createProductWithPhotos);
// Route legacy pour compatibilité
router.post("/single", auth_middleware_1.requireAuth, photo_controller_1.createProductWithPhoto);
// Route pour créer un produit sans photo (pour tests)
router.post("/no-photo", photo_controller_1.createProduct);
// Liste des produits validés
router.get("/", photo_controller_1.listProducts);
// Produits de l'utilisateur connecté
router.get("/user/my-products", auth_middleware_1.requireAuth, photo_controller_1.getUserProducts);
// Détail d'un produit
router.get("/:id", photo_controller_1.getProduct);
// Republication d'un produit
router.put("/:id/republish", photo_controller_1.republishProduct);
exports.default = router;
//# sourceMappingURL=photo.routes.js.map