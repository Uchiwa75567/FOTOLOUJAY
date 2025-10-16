"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class NotificationController {
    // Get user notifications
    async getNotifications(req, res) {
        try {
            const userId = req.user.id;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const offset = (page - 1) * limit;
            const notifications = await prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip: offset,
                take: limit
            });
            const total = await prisma.notification.count({
                where: { userId }
            });
            const unreadCount = await prisma.notification.count({
                where: {
                    userId,
                    isRead: false
                }
            });
            res.json({
                success: true,
                notifications,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                },
                unreadCount
            });
        }
        catch (error) {
            console.error('Error getting notifications:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des notifications'
            });
        }
    }
    // Mark notification as read
    async markAsRead(req, res) {
        try {
            const userId = req.user.id;
            const { notificationId } = req.params;
            await prisma.notification.updateMany({
                where: {
                    id: parseInt(notificationId),
                    userId
                },
                data: { isRead: true }
            });
            res.json({
                success: true,
                message: 'Notification marquée comme lue'
            });
        }
        catch (error) {
            console.error('Error marking notification as read:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour de la notification'
            });
        }
    }
    // Mark all notifications as read
    async markAllAsRead(req, res) {
        try {
            const userId = req.user.id;
            await prisma.notification.updateMany({
                where: { userId },
                data: { isRead: true }
            });
            res.json({
                success: true,
                message: 'Toutes les notifications ont été marquées comme lues'
            });
        }
        catch (error) {
            console.error('Error marking all notifications as read:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour des notifications'
            });
        }
    }
    // Create notification (internal method for other controllers)
    static async createNotification(userId, type, title, message, productId) {
        try {
            await prisma.notification.create({
                data: {
                    userId,
                    type,
                    title,
                    message,
                    productId
                }
            });
        }
        catch (error) {
            console.error('Error creating notification:', error);
        }
    }
    // Delete notification
    async deleteNotification(req, res) {
        try {
            const userId = req.user.id;
            const { notificationId } = req.params;
            await prisma.notification.deleteMany({
                where: {
                    id: parseInt(notificationId),
                    userId
                }
            });
            res.json({
                success: true,
                message: 'Notification supprimée'
            });
        }
        catch (error) {
            console.error('Error deleting notification:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la suppression de la notification'
            });
        }
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map