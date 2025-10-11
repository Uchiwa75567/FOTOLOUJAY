"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getAllUsers = void 0;
const userService = __importStar(require("../services/user.service"));
const getAllUsers = async (req, res) => {
    try {
        // direction: 'top' => newest first (desc), 'bottom' => oldest first (asc)
        const { sort = "createdAt", order, direction } = req.query;
        let sortOrder = order ?? (direction === "bottom" ? "asc" : "desc"); // default: newest first (top)
        const users = await userService.getAllUsers();
        const sorted = users.slice().sort((a, b) => {
            const A = a[sort];
            const B = b[sort];
            if (A == null && B == null)
                return 0;
            if (A == null)
                return sortOrder === "asc" ? -1 : 1;
            if (B == null)
                return sortOrder === "asc" ? 1 : -1;
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
        const parsed = sorted.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            role: u.role,
            createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : null,
            updatedAt: u.updatedAt ? new Date(u.updatedAt).toISOString() : null,
        }));
        return res.json(parsed);
    }
    catch (err) {
        return res.status(500).json({ message: err.message || "Server error" });
    }
};
exports.getAllUsers = getAllUsers;
const getUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const user = await userService.getUserById(id);
        if (!user)
            return res.status(404).json({ message: "Utilisateur introuvable" });
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération de l’utilisateur" });
    }
};
exports.getUser = getUser;
const createUser = async (req, res) => {
    try {
        const data = req.body;
        const user = await userService.createUser(data);
        res.status(201).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création de l’utilisateur" });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const data = req.body;
        const user = await userService.updateUser(id, data);
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la mise à jour de l’utilisateur" });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await userService.deleteUser(id);
        res.json({ message: "Utilisateur supprimé avec succès" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la suppression de l’utilisateur" });
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.controller.js.map