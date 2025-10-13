import { Request, Response } from "express";
export declare const getPremiumPacks: (req: Request, res: Response) => Promise<void>;
export declare const initiatePremiumPurchase: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const handlePremiumWebhook: (req: Request, res: Response) => Promise<void>;
export declare const getPremiumStatus: (req: Request, res: Response) => Promise<void>;
