import { Router } from "express";
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { requireAdmin } from "../middlewares/auth.middleware";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Seul l’admin peut voir tous les utilisateurs
router.get("/", requireAuth, requireAdmin, getAllUsers);

router.get("/:id", requireAuth, getUser);
router.post("/", requireAuth, createUser);
router.put("/:id", requireAuth, updateUser);
router.delete("/:id", requireAuth, deleteUser);

export default router;
