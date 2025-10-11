"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
// Stats for admin
router.get("/stats", role_middleware_1.isAdmin, admin_controller_1.getStats);
// Validate product
router.put("/products/:id/validate", auth_middleware_1.requireModerator, admin_controller_1.validateProduct);
// Reject product
router.put("/products/:id/reject", auth_middleware_1.requireModerator, admin_controller_1.rejectProduct);
exports.default = router;
//# sourceMappingURL=admin.route.js.map