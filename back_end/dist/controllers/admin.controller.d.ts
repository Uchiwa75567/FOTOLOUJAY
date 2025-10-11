import { Request, Response } from "express";
/**
 * GET /api/admin/stats
 * Role: ADMIN
 */
export declare const getStats: (req: Request, res: Response) => Promise<void>;
/**
 * PUT /api/admin/products/:id/validate
 * Role: MODERATOR
 */
export declare const validateProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * PUT /api/admin/products/:id/reject
 * Role: MODERATOR
 * body.reason (optionnel)
 */
export declare const rejectProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
