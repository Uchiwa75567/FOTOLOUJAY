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
  const { username, email, password, phone, address } = req.body;

  // Validation des champs obligatoires
  if (!username || !email || !password || !phone || !address) {
    return res.status(400).json({ message: "Username, email, mot de passe, téléphone et adresse obligatoires" });
  }

  // Validation téléphone sénégalais (9 chiffres, commence par 77, 78, 76, 70 ou 75)
  const phoneRegex = /^(77|78|76|70|75)[0-9]{7}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: "Numéro de téléphone invalide - doit être un numéro sénégalais de 9 chiffres commençant par 77, 78, 76, 70 ou 75" });
  }

  // Validation adresse (minimum 5 caractères)
  if (address.length < 5) {
    return res.status(400).json({ message: "Adresse trop courte (minimum 5 caractères)" });
  }

  try {
    const result = await authService.register(username, email, password, phone, address);
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
