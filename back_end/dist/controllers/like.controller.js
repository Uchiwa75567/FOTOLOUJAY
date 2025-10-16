"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class LikeController {
    // Toggle like on a product
    async toggleLike(req, res) {
        try {
            const userId = req.user.id;
            const { productId } = req.params;
            // Check if product exists
            const product = await prisma.product.findUnique({
                where: { id: parseInt(productId) }
            });
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Produit non trouvé'
                });
            }
            // Check if user already liked this product
            const existingLike = await prisma.like.findUnique({
                where: {
                    userId_productId: {
                        userId,
                        productId: parseInt(productId)
                    }
                }
            });
            let liked;
            if (existingLike) {
                // Unlike: remove the like
                await prisma.like.delete({
                    where: { id: existingLike.id }
                });
                liked = false;
            }
            else {
                // Like: create new like
                await prisma.like.create({
                    data: {
                        userId,
                        productId: parseInt(productId)
                    }
                });
                liked = true;
            }
            // Get updated like count
            const likeCount = await prisma.like.count({
                where: { productId: parseInt(productId) }
            });
            res.json({
                success: true,
                liked,
                likeCount
            });
        }
        catch (error) {
            console.error('Error toggling like:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la gestion du like'
            });
        }
    }
    // Get like status for a product
    async getLikeStatus(req, res) {
        try {
            const userId = req.user.id;
            const { productId } = req.params;
            const like = await prisma.like.findUnique({
                where: {
                    userId_productId: {
                        userId,
                        productId: parseInt(productId)
                    }
                }
            });
            const likeCount = await prisma.like.count({
                where: { productId: parseInt(productId) }
            });
            res.json({
                success: true,
                liked: !!like,
                likeCount
            });
        }
        catch (error) {
            console.error('Error getting like status:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération du statut du like'
            });
        }
    }
    // Get user's liked products
    async getUserLikes(req, res) {
        try {
            const userId = req.user.id;
            const likes = await prisma.like.findMany({
                where: { userId },
                include: {
                    product: {
                        include: {
                            user: {
                                select: {
                                    username: true
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
            res.json({
                success: true,
                likes
            });
        }
        catch (error) {
            console.error('Error getting user likes:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des likes'
            });
        }
    }
}
exports.LikeController = LikeController;
//# sourceMappingURL=like.controller.js.map