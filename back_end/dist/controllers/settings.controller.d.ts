import { Request, Response } from 'express';
export declare class SettingsController {
    updateProfile(req: Request, res: Response): Promise<void>;
    changePassword(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
