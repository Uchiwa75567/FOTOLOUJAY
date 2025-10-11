import { Request, Response, NextFunction } from "express";
/**
 * Usage: router.put("/...": authMiddleware, requireModerator, controller)
 */
export declare const requireModerator: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const isAdmin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
