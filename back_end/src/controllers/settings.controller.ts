import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { hashPassword } from '../utils/hashPassword';

const prisma = new PrismaClient();

export class SettingsController {
  // Update user profile information
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
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
    } catch (error: any) {
      console.error('Error updating profile:', error);
      if (error.code === 'P2002') {
        res.status(400).json({
          success: false,
          message: 'Cette adresse email est déjà utilisée'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erreur lors de la mise à jour du profil'
        });
      }
    }
  }

  // Change user password
  async changePassword(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
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
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: 'Mot de passe actuel incorrect'
        });
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

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
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du changement de mot de passe'
      });
    }
  }

  // Get user profile
  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

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
    } catch (error) {
      console.error('Error getting profile:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du profil'
      });
    }
  }
}
