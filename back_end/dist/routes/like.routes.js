"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const like_controller_1 = require("../controllers/like.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const likeController = new like_controller_1.LikeController();
// All like routes require authentication
router.use(auth_middleware_1.requireAuth);
// Toggle like on a product
router.post('/:productId', likeController.toggleLike);
// Get like status for a product
router.get('/:productId/status', likeController.getLikeStatus);
// Get user's liked products
router.get('/user/likes', likeController.getUserLikes);
exports.default = router;
//# sourceMappingURL=like.routes.js.map