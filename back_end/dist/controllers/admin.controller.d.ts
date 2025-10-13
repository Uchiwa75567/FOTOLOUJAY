import { Request, Response } from "express";
/**
 * GET /api/admin/stats
 * Role: ADMIN
 */
export declare const getStats: (req: Request, res: Response) => Promise<void>;
/**
 * GET /api/moderator/pending-products
 * Role: MODERATOR
 */
export declare const getPendingProducts: (req: Request, res: Response) => Promise<void>;
/**
 * PUT /api/moderator/products/:id/validate
 * Role: MODERATOR
 * Body: { description? } - Optionnel, met à jour la description si fournie
 */
export declare const validateProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
/**
 * PUT /api/moderator/products/:id/reject
 * Role: MODERATOR
 * Body: { reason? } - Optionnel, met à jour la raison de rejet si fournie
 */
export declare const rejectProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
