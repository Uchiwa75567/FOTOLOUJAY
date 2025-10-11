import { Request, Response } from "express";
import multer from "multer";
export declare const upload: multer.Multer;
export declare const uploadPhoto: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createProduct: (req: Request, res: Response) => Promise<void>;
export declare const listProducts: (req: Request, res: Response) => Promise<void>;
export declare const getProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const republishProduct: (req: Request, res: Response) => Promise<void>;
