// src/middlewares/role.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * Usage: router.put("/...": authMiddleware, requireModerator, controller)
 */
export const requireModerator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) return res.status(401).json({ message: "Utilisateur non authentifié" });

    if (user.role !== "MODERATOR") return res.status(403).json({ message: "Accès réservé aux modérateurs" });

    // OK
    return next();
  } catch (err) {
    console.error("requireModerator error:", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

interface TokenPayload {
  id: number;
  email: string;
  role: string;
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;

    if (decoded.role !== "ADMIN") {
      return res.status(403).json({ message: "Accès réservé aux administrateurs" });
    }

    // Stocke les infos de l'utilisateur dans la requête pour plus tard
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide ou expiré" });
  }
};
