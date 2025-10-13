"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.register = exports.login = void 0;
const auth_service_1 = require("../services/auth.service");
const login = async (req, res) => {
    const { email, password } = req.body;
    // Validation des champs obligatoires
    if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe obligatoires" });
    }
    try {
        const result = await auth_service_1.authService.login(email, password);
        res.json(result);
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
};
exports.login = login;
const register = async (req, res) => {
    const { username, email, password } = req.body;
    // Validation des champs obligatoires
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email et mot de passe obligatoires" });
    }
    try {
        const result = await auth_service_1.authService.register(username, email, password);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.register = register;
// Nouveau endpoint pour refresh token
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token obligatoire" });
    }
    try {
        const result = await auth_service_1.authService.refresh(refreshToken);
        res.json(result);
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
};
exports.refreshToken = refreshToken;
//# sourceMappingURL=auth.controller.js.map