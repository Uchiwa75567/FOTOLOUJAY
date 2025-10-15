import { Router } from 'express';
import { SettingsController } from '../controllers/settings.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();
const settingsController = new SettingsController();

// All settings routes require authentication
router.use(requireAuth);

// Get user profile
router.get('/profile', settingsController.getProfile);

// Update user profile
router.put('/profile', settingsController.updateProfile);

// Change password
router.put('/password', settingsController.changePassword);

export default router;
