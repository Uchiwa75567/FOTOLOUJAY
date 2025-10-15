import { Router } from 'express';
import { LikeController } from '../controllers/like.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();
const likeController = new LikeController();

// All like routes require authentication
router.use(requireAuth);

// Toggle like on a product
router.post('/:productId', likeController.toggleLike);

// Get like status for a product
router.get('/:productId/status', likeController.getLikeStatus);

// Get user's liked products
router.get('/user/likes', likeController.getUserLikes);

export default router;
