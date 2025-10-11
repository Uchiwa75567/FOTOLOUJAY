import { Response, NextFunction } from "express";
import { AuthRequest } from "../interface/types";
export declare const requireAuth: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireModerator: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
