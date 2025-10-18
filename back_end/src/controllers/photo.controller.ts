import { Request, Response } from "express";
import { AuthRequest } from "../interface/types";
import prisma from "../config/prisma";
import path from "path";
import fs from "fs";

// === Création produit avec photos multiples ===
export const createProductWithPhotos = async (req: AuthRequest, res: Response) => {
  try {
  const { title, description, price, photos, condition } = req.body; // photos: array of base64 strings
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
    const uploadPath = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    // Créer le produit
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: Math.round(price * 100), // Convertir en centimes
        userId,
        status: "PENDING",
        condition: condition ?? null,
      },
    });

    // Traiter les photos
    const photoUrls: string[] = [];
    for (let i = 0; i < photos.length; i++) {
      const photoBase64 = photos[i];

      try {
        // Validation du format base64
        if (!photoBase64.startsWith('data:image/')) {
          continue; // Skip invalid photos
        }

        const parts = photoBase64.split(',');
        if (parts.length !== 2) {
          continue; // Invalid format
        }

        const base64Data = parts[1];
        if (!base64Data) {
          continue; // No data
        }

        // Générer nom unique pour la photo
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9) + "-" + i;
        const extension = photoBase64.split(';')[0].split('/')[1];
        const filename = `${uniqueSuffix}.${extension}`;
        const filepath = path.join(uploadPath, filename);

        // Extraire les données base64 et sauvegarder
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(filepath, buffer);

        const photoUrl = `/uploads/${filename}`;
        photoUrls.push(photoUrl);

        // Créer l'entrée ProductPhoto
        await prisma.productPhoto.create({
          data: {
            url: photoUrl,
            isMain: i === 0, // Première photo = principale
            order: i,
            productId: product.id,
          },
        });
      } catch (photoError) {
        console.error(`Error processing photo ${i}:`, photoError);
        // Continue with next photo
      }
    }

    res.status(201).json({
      ...product,
      price: product.price / 100, // Retourner en euros
      photos: photoUrls,
      condition: product.condition,
      message: "Produit créé en attente de validation par un modérateur."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création du produit" });
  }
};

// === Création produit avec photo capturée (base64) - LEGACY ===
export const createProductWithPhoto = async (req: AuthRequest, res: Response) => {
  try {
  const { title, description, price, photoBase64, condition } = req.body;
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
    const uploadPath = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    // Générer nom unique pour la photo
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = photoBase64.split(';')[0].split('/')[1];
    const filename = `${uniqueSuffix}.${extension}`;
    const filepath = path.join(uploadPath, filename);

    // Extraire les données base64 et sauvegarder
    const base64Data = photoBase64.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filepath, buffer);

    const photoUrl = `/uploads/${filename}`;

    // Créer le produit
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: Math.round(price * 100), // Convertir en centimes
        userId,
        status: "PENDING",
        condition: condition ?? null,
      },
    });

    // Créer l'entrée ProductPhoto
    await prisma.productPhoto.create({
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
      condition: product.condition,
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
  const { title, description, userId, condition } = req.body;

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: 0, // Default price
        userId: Number(userId),
        condition: condition ?? null,
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
      photos: product.photos,
      condition: product.condition ?? null,
    }));

    res.json(transformedProducts);
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
      photos: product.photos,
      condition: product.condition ?? null,
    }));

    res.json(transformedProducts);
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
    await prisma.product.update({
      where: { id: Number(id) },
      data: { views: { increment: 1 } },
    });

    // Transformer les données pour compatibilité
    const transformedProduct = {
      ...product,
      price: product.price / 100, // Convertir en euros
      photoUrl: product.photos.find(p => p.isMain)?.url || product.photos[0]?.url || '',
      photos: product.photos,
      condition: product.condition ?? null,
    };

    res.json(transformedProduct);
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
