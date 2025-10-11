import { Request, Response } from "express";
import * as userService from "../services/user.service";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // direction: 'top' => newest first (desc), 'bottom' => oldest first (asc)
    const { sort = "createdAt", order, direction } = req.query as Record<string, string>;
    let sortOrder = order ?? (direction === "bottom" ? "asc" : "desc"); // default: newest first (top)

    const users: any[] = await userService.getAllUsers();

    const sorted = users.slice().sort((a: any, b: any) => {
      const A = a[sort];
      const B = b[sort];

      if (A == null && B == null) return 0;
      if (A == null) return sortOrder === "asc" ? -1 : 1;
      if (B == null) return sortOrder === "asc" ? 1 : -1;

      const isDateA = A instanceof Date || /\d{4}-\d{2}-\d{2}T/.test(String(A));
      const isDateB = B instanceof Date || /\d{4}-\d{2}-\d{2}T/.test(String(B));
      if (isDateA && isDateB) {
        const diff = new Date(A).getTime() - new Date(B).getTime();
        return sortOrder === "asc" ? diff : -diff;
      }

      if (typeof A === "number" && typeof B === "number") {
        return sortOrder === "asc" ? A - B : B - A;
      }

      return sortOrder === "asc"
        ? String(A).localeCompare(String(B))
        : String(B).localeCompare(String(A));
    });

    const parsed = sorted.map((u: any) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : null,
      updatedAt: u.updatedAt ? new Date(u.updatedAt).toISOString() : null,
    }));

    return res.json(parsed);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await userService.getUserById(id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération de l’utilisateur" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const user = await userService.createUser(data);
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création de l’utilisateur" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const user = await userService.updateUser(id, data);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l’utilisateur" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await userService.deleteUser(id);
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression de l’utilisateur" });
  }
};
