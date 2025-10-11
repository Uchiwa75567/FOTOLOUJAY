"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const role_middleware_1 = require("../middlewares/role.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Seul l’admin peut voir tous les utilisateurs
router.get("/", auth_middleware_1.requireAuth, role_middleware_1.isAdmin, user_controller_1.getAllUsers);
router.get("/:id", auth_middleware_1.requireAuth, user_controller_1.getUser);
router.post("/", auth_middleware_1.requireAuth, user_controller_1.createUser);
router.put("/:id", auth_middleware_1.requireAuth, user_controller_1.updateUser);
router.delete("/:id", auth_middleware_1.requireAuth, user_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map