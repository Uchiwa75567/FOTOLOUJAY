import { Router } from "express";
import { requireAuth, requireModerator, requireAdmin } from "../middlewares/auth.middleware";
import { validateProduct, rejectProduct, getStats, getPendingProducts } from "../controllers/admin.controller";

const router = Router();

// Stats for admin
router.get("/stats", requireAuth, requireAdmin, getStats);

// Moderator endpoints
router.get("/moderator/pending-products", requireAuth, requireModerator, getPendingProducts);
router.put("/moderator/products/:id/validate", requireAuth, requireModerator, validateProduct);
router.put("/moderator/products/:id/reject", requireAuth, requireModerator, rejectProduct);

export default router;
