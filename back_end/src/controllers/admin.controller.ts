// src/controllers/admin.controller.ts
import { Request, Response } from "express";
import prisma from "../config/prisma";
import { notifyProductValidated, notifyProductRejected } from "../services/notification.service";
import { NotificationController } from "./notification.controller";

/**
 * GET /api/admin/stats
 * Role: ADMIN
 */
export const getStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalProducts = await prisma.product.count();
    const validProducts = await prisma.product.count({ where: { status: "VALID" } });
    const pendingProducts = await prisma.product.count({ where: { status: "PENDING" } });
    const deletedProducts = await prisma.product.count({ where: { status: "DELETED" } });
    const vipUsers = await prisma.user.count({ where: { role: "VIP" } });
    const adminUsers = await prisma.user.count({ where: { role: "ADMIN" } });
    const moderatorUsers = await prisma.user.count({ where: { role: "MODERATOR" } });

    const stats = {
      totalUsers,
      totalProducts,
      validProducts,
      pendingProducts,
      deletedProducts,
      vipUsers,
      adminUsers,
      moderatorUsers,
    };

    res.json(stats);
  } catch (err) {
    console.error("getStats error:", err);
    res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
  }
};

/**
 * GET /api/moderator/pending-products
 * Role: MODERATOR
 */
export const getPendingProducts = async (req: Request, res: Response) => {
  try {
    const pendingProducts = await prisma.product.findMany({
      where: { status: "PENDING" },
      include: {
        user: true,
        photos: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    const transformed = pendingProducts.map(product => ({
      ...product,
      price: (product as any).price ? (product as any).price / 100 : 0,
      photoUrl: product.photos?.find(p => p.isMain)?.url || product.photos?.[0]?.url || '',
      photos: product.photos || [],
      condition: product.condition ?? null,
    }));

    res.json(transformed);
  } catch (err) {
    console.error("getPendingProducts error:", err);
    res.status(500).json({ message: "Erreur lors de la récupération des produits en attente" });
  }
};

/**
 * PUT /api/moderator/products/:id/validate
 * Role: MODERATOR
 * Body: { description? } - Optionnel, met à jour la description si fournie
 */
export const validateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { description } = req.body;

    const updateData: any = { status: "VALID" };
    if (description) {
      updateData.description = description;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        photos: {
          orderBy: { order: 'asc' }
        }
      },
    });

    // Send notification to user
    await NotificationController.createNotification(
      product.userId,
      "PRODUCT_APPROVED",
      "Produit validé",
      `Votre produit "${product.title}" a été validé et est maintenant visible sur la plateforme.`,
      product.id
    );

    // Send email notification
    await notifyProductValidated(product.user.email, product.title);

    const transformed = {
      ...product,
      price: (product as any).price ? (product as any).price / 100 : 0,
      photoUrl: product.photos?.find(p => p.isMain)?.url || product.photos?.[0]?.url || '',
      photos: product.photos || [],
      condition: product.condition ?? null,
    };

    return res.json({ ...transformed, message: "Produit validé avec succès" });
  } catch (err) {
    console.error("validateProduct error:", err);
    return res.status(404).json({ message: "Produit introuvable" });
  }
};

/**
 * PUT /api/moderator/products/:id/reject
 * Role: MODERATOR
 * Body: { reason? } - Optionnel, met à jour la raison de rejet si fournie
 */
export const rejectProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { reason } = req.body;

    const updateData: any = { status: "DELETED" };
    if (reason) {
      updateData.rejectionReason = reason;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        photos: {
          orderBy: { order: 'asc' }
        }
      },
    });

    // Send notification to user
    await NotificationController.createNotification(
      product.userId,
      "PRODUCT_REJECTED",
      "Produit rejeté",
      `Votre produit "${product.title}" a été rejeté.${reason ? ` Raison: ${reason}` : ""}`,
      product.id
    );

    // Send email notification
    await notifyProductRejected(product.user.email, product.title, reason);

    const transformed = {
      ...product,
      price: (product as any).price ? (product as any).price / 100 : 0,
      photoUrl: product.photos?.find(p => p.isMain)?.url || product.photos?.[0]?.url || '',
      photos: product.photos || [],
      condition: product.condition ?? null,
    };

    return res.json({ ...transformed, message: "Produit rejeté avec succès" });
  } catch (err) {
    console.error("rejectProduct error:", err);
    return res.status(404).json({ message: "Produit introuvable" });
  }
};
