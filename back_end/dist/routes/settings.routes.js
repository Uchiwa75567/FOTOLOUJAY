"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settings_controller_1 = require("../controllers/settings.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const settingsController = new settings_controller_1.SettingsController();
// All settings routes require authentication
router.use(auth_middleware_1.requireAuth);
// Get user profile
router.get('/profile', settingsController.getProfile);
// Update user profile
router.put('/profile', settingsController.updateProfile);
// Change password
router.put('/password', settingsController.changePassword);
exports.default = router;
//# sourceMappingURL=settings.routes.js.map