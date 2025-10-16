"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.republishProduct = exports.getProduct = exports.getUserProducts = exports.listProducts = exports.createProduct = exports.createProductWithPhoto = exports.createProductWithPhotos = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// === Création produit avec photos multiples ===
const createProductWithPhotos = async (req, res) => {
    try {
        const { title, description, price, photos } = req.body; // photos: array of base64 strings
        const userId = req.user?.id;
        // Vérification de l'utilisateur authentifié
        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }
        // Vérification obligatoire des champs
        if (!title || !description || !price || !photos || photos.length === 0) {
            return res.status(400).json({ message: "Titre, description, prix et au moins une photo obligatoires" });
        }
        if (description.length < 10) {
            return res.status(400).json({ message: "Description trop courte (minimum 10 caractères)" });
        }
        if (price <= 0) {
            return res.status(400).json({ message: "Prix doit être positif" });
        }
        // Créer le dossier uploads s'il n'existe pas
        const uploadPath = path_1.default.join(process.cwd(), "uploads");
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath);
        }
        // Créer le produit
        const product = await prisma_1.default.product.create({
            data: {
                title,
                description,
                price: Math.round(price * 100), // Convertir en centimes
                userId,
                status: "PENDING",
            },
        });
        // Traiter les photos
        const photoUrls = [];
        for (let i = 0; i < photos.length; i++) {
            const photoBase64 = photos[i];
            // Validation du format base64
            if (!photoBase64.startsWith('data:image/')) {
                continue; // Skip invalid photos
            }
            // Générer nom unique pour la photo
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9) + "-" + i;
            const extension = photoBase64.split(';')[0].split('/')[1];
            const filename = `${uniqueSuffix}.${extension}`;
            const filepath = path_1.default.join(uploadPath, filename);
            // Extraire les données base64 et sauvegarder
            const base64Data = photoBase64.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            fs_1.default.writeFileSync(filepath, buffer);
            const photoUrl = `/uploads/${filename}`;
            photoUrls.push(photoUrl);
            // Créer l'entrée ProductPhoto
            await prisma_1.default.productPhoto.create({
                data: {
                    url: photoUrl,
                    isMain: i === 0, // Première photo = principale
                    order: i,
                    productId: product.id,
                },
            });
        }
        res.status(201).json({
            ...product,
            price: product.price / 100, // Retourner en euros
            photos: photoUrls,
            message: "Produit créé en attente de validation par un modérateur."
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création du produit" });
    }
};
exports.createProductWithPhotos = createProductWithPhotos;
// === Création produit avec photo capturée (base64) - LEGACY ===
const createProductWithPhoto = async (req, res) => {
    try {
        const { title, description, price, photoBase64 } = req.body;
        const userId = req.user?.id;
        // Vérification de l'utilisateur authentifié
        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }
        // Vérification obligatoire des champs
        if (!title || !description || !price || !photoBase64) {
            return res.status(400).json({ message: "Titre, description, prix et photo obligatoires" });
        }
        if (description.length < 10) {
            return res.status(400).json({ message: "Description trop courte (minimum 10 caractères)" });
        }
        if (price <= 0) {
            return res.status(400).json({ message: "Prix doit être positif" });
        }
        // Validation du format base64
        if (!photoBase64.startsWith('data:image/')) {
            return res.status(400).json({ message: "Format photo invalide" });
        }
        // Créer le dossier uploads s'il n'existe pas
        const uploadPath = path_1.default.join(process.cwd(), "uploads");
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath);
        }
        // Générer nom unique pour la photo
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = photoBase64.split(';')[0].split('/')[1];
        const filename = `${uniqueSuffix}.${extension}`;
        const filepath = path_1.default.join(uploadPath, filename);
        // Extraire les données base64 et sauvegarder
        const base64Data = photoBase64.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        fs_1.default.writeFileSync(filepath, buffer);
        const photoUrl = `/uploads/${filename}`;
        // Créer le produit
        const product = await prisma_1.default.product.create({
            data: {
                title,
                description,
                price: Math.round(price * 100), // Convertir en centimes
                userId,
                status: "PENDING",
            },
        });
        // Créer l'entrée ProductPhoto
        await prisma_1.default.productPhoto.create({
            data: {
                url: photoUrl,
                isMain: true,
                order: 0,
                productId: product.id,
            },
        });
        res.status(201).json({
            ...product,
            price: product.price / 100, // Retourner en euros
            photos: [photoUrl],
            message: "Produit créé en attente de validation par un modérateur."
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création du produit" });
    }
};
exports.createProductWithPhoto = createProductWithPhoto;
// === Création de produit sans upload (photoUrl vide) ===
const createProduct = async (req, res) => {
    try {
        const { title, description, userId } = req.body;
        const product = await prisma_1.default.product.create({
            data: {
                title,
                description,
                price: 0, // Default price
                userId: Number(userId),
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
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        role: true,
                        phone: true,
                        address: true,
                        premiumExpiry: true
                    }
                },
                photos: {
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: [
                { vip: "desc" },
                { createdAt: "desc" },
            ],
        });
        // Transformer les données pour compatibilité
        const transformedProducts = products.map(product => ({
            ...product,
            price: product.price / 100, // Convertir en euros
            photoUrl: product.photos.find(p => p.isMain)?.url || product.photos[0]?.url || '',
            photos: product.photos
        }));
        res.json(transformedProducts);
    }
    catch (error) {
        res.status(500).json({ message: "Erreur lors du chargement des produits" });
    }
};
exports.listProducts = listProducts;
// === Récupérer les produits de l'utilisateur connecté (tous les statuts) ===
const getUserProducts = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }
        const products = await prisma_1.default.product.findMany({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        role: true,
                        phone: true,
                        address: true,
                        premiumExpiry: true
                    }
                },
                photos: {
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { createdAt: "desc" },
        });
        // Transformer les données pour compatibilité
        const transformedProducts = products.map(product => ({
            ...product,
            price: product.price / 100, // Convertir en euros
            photoUrl: product.photos.find(p => p.isMain)?.url || product.photos[0]?.url || '',
            photos: product.photos
        }));
        res.json(transformedProducts);
    }
    catch (error) {
        console.error("getUserProducts error:", error);
        res.status(500).json({ message: "Erreur lors du chargement de vos produits" });
    }
};
exports.getUserProducts = getUserProducts;
// === Récupérer un produit par ID ===
const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma_1.default.product.findUnique({
            where: { id: Number(id) },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        role: true,
                        phone: true,
                        address: true,
                        premiumExpiry: true
                    }
                },
                photos: {
                    orderBy: { order: 'asc' }
                }
            },
        });
        if (!product) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        // Increment views
        await prisma_1.default.product.update({
            where: { id: Number(id) },
            data: { views: { increment: 1 } },
        });
        // Transformer les données pour compatibilité
        const transformedProduct = {
            ...product,
            price: product.price / 100, // Convertir en euros
            photoUrl: product.photos.find(p => p.isMain)?.url || product.photos[0]?.url || '',
            photos: product.photos
        };
        res.json(transformedProduct);
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