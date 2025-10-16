import { Request, Response } from "express";
import { AuthRequest } from "../interface/types";
export declare const createProductWithPhotos: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createProductWithPhoto: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createProduct: (req: Request, res: Response) => Promise<void>;
export declare const listProducts: (req: Request, res: Response) => Promise<void>;
export declare const getUserProducts: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const republishProduct: (req: Request, res: Response) => Promise<void>;
