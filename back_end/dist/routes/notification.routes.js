"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const notificationController = new notification_controller_1.NotificationController();
// All notification routes require authentication
router.use(auth_middleware_1.requireAuth);
// Get user notifications
router.get('/', notificationController.getNotifications);
// Mark notification as read
router.put('/:notificationId/read', notificationController.markAsRead);
// Mark all notifications as read
router.put('/read-all', notificationController.markAllAsRead);
// Delete notification
router.delete('/:notificationId', notificationController.deleteNotification);
exports.default = router;
//# sourceMappingURL=notification.routes.js.map