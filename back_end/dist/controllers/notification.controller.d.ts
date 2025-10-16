import { Request, Response } from 'express';
import { NotificationType } from '@prisma/client';
export declare class NotificationController {
    getNotifications(req: Request, res: Response): Promise<void>;
    markAsRead(req: Request, res: Response): Promise<void>;
    markAllAsRead(req: Request, res: Response): Promise<void>;
    static createNotification(userId: number, type: NotificationType, title: string, message: string, productId?: number): Promise<void>;
    deleteNotification(req: Request, res: Response): Promise<void>;
}
