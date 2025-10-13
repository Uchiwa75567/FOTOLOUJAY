"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const auth_middleware_2 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Seul l'admin peut voir tous les utilisateurs
router.get("/", auth_middleware_2.requireAuth, auth_middleware_1.requireAdmin, user_controller_1.getAllUsers);
// Mettre à jour son propre profil (phone, address)
router.put("/profile", auth_middleware_2.requireAuth, user_controller_1.updateProfile);
router.get("/:id", auth_middleware_2.requireAuth, user_controller_1.getUser);
router.post("/", auth_middleware_2.requireAuth, user_controller_1.createUser);
router.put("/:id", auth_middleware_2.requireAuth, user_controller_1.updateUser);
router.delete("/:id", auth_middleware_2.requireAuth, user_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map