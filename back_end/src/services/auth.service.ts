import { authRepository } from "../repositories/auth.repository";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken";
import * as userRepository from "../repositories/user.repository";
import prisma from "../config/prisma";
import jwt from "jsonwebtoken";

export const authService = {
  login: async (email: string, password: string) => {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new Error("Utilisateur non trouvé");

    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw new Error("Mot de passe incorrect");

    // Générer access et refresh tokens
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Stocker le refresh token en DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return { accessToken, refreshToken, user };
  },

  register: async (username: string, email: string, password: string) => {
    // Check if user already exists
    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) throw new Error("Utilisateur déjà existant");

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    // Générer access et refresh tokens
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Stocker le refresh token en DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return { accessToken, refreshToken, user };
  },

  refresh: async (refreshToken: string) => {
    try {
      // Vérifier le refresh token
      const decoded: any = jwt.verify(refreshToken, process.env.JWT_SECRET as string);
      const userId = decoded.id;

      // Récupérer l'utilisateur et vérifier que le refresh token correspond
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new Error("Refresh token invalide");
      }

      // Générer nouveau access token
      const newAccessToken = generateAccessToken(user.id, user.role);

      return { accessToken: newAccessToken, user };
    } catch (error) {
      throw new Error("Refresh token expiré ou invalide");
    }
  },
};
