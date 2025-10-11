import { Request } from "express";
import { Role } from "@prisma/client";
export interface AuthRequest extends Request {
    user?: {
        id: number;
        role: Role;
    };
}
export interface TokenPayload {
    id: number;
    email: string;
    role: string;
}
