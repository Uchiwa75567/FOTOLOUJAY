import { Request, Response } from "express";
import { AuthRequest } from "../interface/types";
import prisma from "../config/prisma";
import path from "path";
import fs from "fs";

// === Création produit avec photo capturée (base64) ===
export const createProductWithPhoto = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, photoBase64, phone, address } = req.body;
    const userId = req.user?.id;

    // Vérification de l'utilisateur authentifié
    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // Vérification obligatoire des champs
    if (!title || !description || !photoBase64 || !phone || !address) {
      return res.status(400).json({ message: "Titre, description, photo, téléphone et adresse obligatoires" });
    }

    if (description.length < 10) {
      return res.status(400).json({ message: "Description trop courte (minimum 10 caractères)" });
    }

    // Validation téléphone sénégalais (9 chiffres, commence par 77, 78, 76, 70 ou 75)
    const phoneRegex = /^(77|78|76|70|75)[0-9]{7}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Numéro de téléphone invalide - doit être un numéro sénégalais de 9 chiffres commençant par 77, 78, 76, 70 ou 75" });
    }

    // Validation adresse (minimum 5 caractères)
    if (address.length < 5) {
      return res.status(400).json({ message: "Adresse trop courte (minimum 5 caractères)" });
    }

    // Vérification obligatoire de la photo capturée
    if (!photoBase64) {
      return res.status(400).json({ message: "Photo obligatoire - vous devez photographier le produit" });
    }

    // Validation du format base64
    if (!photoBase64.startsWith('data:image/')) {
      return res.status(400).json({ message: "Format photo invalide" });
    }

    // Créer le dossier uploads s'il n'existe pas
    const uploadPath = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    // Générer nom unique pour la photo
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = photoBase64.split(';')[0].split('/')[1]; // jpg, png, etc.
    const filename = `${uniqueSuffix}.${extension}`;
    const filepath = path.join(uploadPath, filename);

    // Extraire les données base64 et sauvegarder
    const base64Data = photoBase64.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filepath, buffer);

    const photoUrl = `/uploads/${filename}`;

    // Mettre à jour les informations de l'utilisateur
    await prisma.user.update({
      where: { id: userId },
      data: { phone, address },
    });

    // Créer le produit en PENDING pour modération manuelle
    const product = await prisma.product.create({
      data: {
        title,
        description,
        photoUrl,
        userId,
        status: "PENDING",
      },
    });

    res.status(201).json({ 
      ...product, 
      message: "Produit créé en attente de validation par un modérateur." 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création du produit" });
  }
};

// === Création de produit sans upload (photoUrl vide) ===
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, description, userId } = req.body;

    const product = await prisma.product.create({
      data: {
        title,
        description,
        userId: Number(userId),
        photoUrl: "", // <-- Ajouté pour respecter Prisma
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création du produit" });
  }
};

// === Liste des produits ===
export const listProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { status: "VALID" },
      include: { user: true },
      orderBy: [
        { vip: "desc" }, // VIP first
        { createdAt: "desc" },
      ],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du chargement des produits" });
  }
};

// === Récupérer les produits de l'utilisateur connecté (tous les statuts) ===
export const getUserProducts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    const products = await prisma.product.findMany({
      where: { userId },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(products);
  } catch (error) {
    console.error("getUserProducts error:", error);
    res.status(500).json({ message: "Erreur lors du chargement de vos produits" });
  }
};

// === Récupérer un produit par ID ===
export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    // Increment views
    await prisma.product.update({
      where: { id: Number(id) },
      data: { views: { increment: 1 } },
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// === Republier un produit ===
export const republishProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: { status: "PENDING", updatedAt: new Date() },
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la republication" });
  }
};
