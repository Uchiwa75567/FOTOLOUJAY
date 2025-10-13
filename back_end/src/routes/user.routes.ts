import { Router } from "express";
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
} from "../controllers/user.controller";
import { requireAdmin } from "../middlewares/auth.middleware";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Seul l'admin peut voir tous les utilisateurs
router.get("/", requireAuth, requireAdmin, getAllUsers);

// Mettre à jour son propre profil (phone, address)
router.put("/profile", requireAuth, updateProfile);

router.get("/:id", requireAuth, getUser);
router.post("/", requireAuth, createUser);
router.put("/:id", requireAuth, updateUser);
router.delete("/:id", requireAuth, deleteUser);

export default router;