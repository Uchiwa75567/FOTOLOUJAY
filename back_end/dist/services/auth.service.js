"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const auth_repository_1 = require("../repositories/auth.repository");
const hashPassword_1 = require("../utils/hashPassword");
const generateToken_1 = require("../utils/generateToken");
const userRepository = __importStar(require("../repositories/user.repository"));
const prisma_1 = __importDefault(require("../config/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.authService = {
    login: async (email, password) => {
        const user = await auth_repository_1.authRepository.findByEmail(email);
        if (!user)
            throw new Error("Utilisateur non trouvé");
        const isValid = await (0, hashPassword_1.comparePassword)(password, user.password);
        if (!isValid)
            throw new Error("Mot de passe incorrect");
        // Générer access et refresh tokens
        const accessToken = (0, generateToken_1.generateAccessToken)(user.id, user.role);
        const refreshToken = (0, generateToken_1.generateRefreshToken)(user.id);
        // Stocker le refresh token en DB
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });
        return { accessToken, refreshToken, user };
    },
    register: async (username, email, password) => {
        // Check if user already exists
        const existingUser = await auth_repository_1.authRepository.findByEmail(email);
        if (existingUser)
            throw new Error("Utilisateur déjà existant");
        // Hash password
        const hashedPassword = await (0, hashPassword_1.hashPassword)(password);
        // Create user
        const user = await userRepository.create({
            username,
            email,
            password: hashedPassword,
        });
        // Générer access et refresh tokens
        const accessToken = (0, generateToken_1.generateAccessToken)(user.id, user.role);
        const refreshToken = (0, generateToken_1.generateRefreshToken)(user.id);
        // Stocker le refresh token en DB
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { refreshToken },
        });
        return { accessToken, refreshToken, user };
    },
    refresh: async (refreshToken) => {
        try {
            // Vérifier le refresh token
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET);
            const userId = decoded.id;
            // Récupérer l'utilisateur et vérifier que le refresh token correspond
            const user = await prisma_1.default.user.findUnique({
                where: { id: userId },
            });
            if (!user || user.refreshToken !== refreshToken) {
                throw new Error("Refresh token invalide");
            }
            // Générer nouveau access token
            const newAccessToken = (0, generateToken_1.generateAccessToken)(user.id, user.role);
            return { accessToken: newAccessToken, user };
        }
        catch (error) {
            throw new Error("Refresh token expiré ou invalide");
        }
    },
};
//# sourceMappingURL=auth.service.js.map