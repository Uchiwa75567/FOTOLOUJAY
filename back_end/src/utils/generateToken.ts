import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET as string;

export const generateAccessToken = (userId: number, role?: string) => {
  return jwt.sign({ id: userId, role: role ?? "USER" }, secret, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ id: userId }, secret, { expiresIn: "7d" });
};
