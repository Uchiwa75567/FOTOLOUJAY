import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validation des champs obligatoires
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe obligatoires" });
  }

  try {
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  // Validation des champs obligatoires
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email et mot de passe obligatoires" });
  }

  try {
    const result = await authService.register(username, email, password);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Nouveau endpoint pour refresh token
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token obligatoire" });
  }

  try {
    const result = await authService.refresh(refreshToken);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};
