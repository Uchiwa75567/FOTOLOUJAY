"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.republishProduct = exports.getProduct = exports.listProducts = exports.createProduct = exports.uploadPhoto = exports.upload = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// === Configuration du stockage Multer ===
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(process.cwd(), "uploads");
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
exports.upload = (0, multer_1.default)({ storage });
// === Upload photo et création produit ===
const uploadPhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Aucune photo reçue" });
        }
        const { title, description, userId } = req.body;
        const photoUrl = `/uploads/${req.file.filename}`;
        const product = await prisma_1.default.product.create({
            data: {
                title,
                description,
                photoUrl,
                userId: Number(userId),
            },
        });
        res.status(201).json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'upload" });
    }
};
exports.uploadPhoto = uploadPhoto;
// === Création de produit sans upload (photoUrl vide) ===
const createProduct = async (req, res) => {
    try {
        const { title, description, userId } = req.body;
        const product = await prisma_1.default.product.create({
            data: {
                title,
                description,
                userId: Number(userId),
                photoUrl: "", // <-- Ajouté pour respecter Prisma
            },
        });
        res.status(201).json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création du produit" });
    }
};
exports.createProduct = createProduct;
// === Liste des produits ===
const listProducts = async (req, res) => {
    try {
        const products = await prisma_1.default.product.findMany({
            where: { status: "VALID" },
            include: { user: true },
            orderBy: [
                { vip: "desc" }, // VIP first
                { createdAt: "desc" },
            ],
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors du chargement des produits" });
    }
};
exports.listProducts = listProducts;
// === Récupérer un produit par ID ===
const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma_1.default.product.findUnique({
            where: { id: Number(id) },
            include: { user: true },
        });
        if (!product) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        // Increment views
        await prisma_1.default.product.update({
            where: { id: Number(id) },
            data: { views: { increment: 1 } },
        });
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.getProduct = getProduct;
// === Republier un produit ===
const republishProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma_1.default.product.update({
            where: { id: Number(id) },
            data: { status: "PENDING", updatedAt: new Date() },
        });
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors de la republication" });
    }
};
exports.republishProduct = republishProduct;
//# sourceMappingURL=photo.controller.js.map