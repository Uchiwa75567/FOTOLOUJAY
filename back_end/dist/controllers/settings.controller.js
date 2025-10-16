"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashPassword_1 = require("../utils/hashPassword");
const prisma = new client_1.PrismaClient();
class SettingsController {
    // Update user profile information
    async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const { email, phone, address } = req.body;
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    email,
                    phone,
                    address,
                    updatedAt: new Date()
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    phone: true,
                    address: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
            res.json({
                success: true,
                message: 'Profil mis à jour avec succès',
                user: updatedUser
            });
        }
        catch (error) {
            console.error('Error updating profile:', error);
            if (error.code === 'P2002') {
                res.status(400).json({
                    success: false,
                    message: 'Cette adresse email est déjà utilisée'
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: 'Erreur lors de la mise à jour du profil'
                });
            }
        }
    }
    // Change user password
    async changePassword(req, res) {
        try {
            const userId = req.user.id;
            const { currentPassword, newPassword } = req.body;
            // Get current user
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }
            // Verify current password
            const isValidPassword = await bcrypt_1.default.compare(currentPassword, user.password);
            if (!isValidPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Mot de passe actuel incorrect'
                });
            }
            // Hash new password
            const hashedPassword = await (0, hashPassword_1.hashPassword)(newPassword);
            // Update password
            await prisma.user.update({
                where: { id: userId },
                data: {
                    password: hashedPassword,
                    updatedAt: new Date()
                }
            });
            res.json({
                success: true,
                message: 'Mot de passe changé avec succès'
            });
        }
        catch (error) {
            console.error('Error changing password:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors du changement de mot de passe'
            });
        }
    }
    // Get user profile
    async getProfile(req, res) {
        try {
            const userId = req.user.id;
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    phone: true,
                    address: true,
                    role: true,
                    premiumExpiry: true,
                    createdAt: true,
                    updatedAt: true
                }
            });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }
            res.json({
                success: true,
                user
            });
        }
        catch (error) {
            console.error('Error getting profile:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération du profil'
            });
        }
    }
}
exports.SettingsController = SettingsController;
//# sourceMappingURL=settings.controller.js.map