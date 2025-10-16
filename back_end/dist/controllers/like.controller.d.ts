import { Request, Response } from 'express';
export declare class LikeController {
    toggleLike(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getLikeStatus(req: Request, res: Response): Promise<void>;
    getUserLikes(req: Request, res: Response): Promise<void>;
}
