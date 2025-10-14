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
    const { username, email, password, phone, address } = req.body;
    // Validation des champs obligatoires
    if (!username || !email || !password || !phone || !address) {
        return res.status(400).json({ message: "Username, email, mot de passe, téléphone et adresse obligatoires" });
    }
    // Validation téléphone sénégalais (9 chiffres, commence par 77, 78, 76, 70 ou 75)
    const phoneRegex = /^(77|78|76|70|75)[0-9]{7}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: "Numéro de téléphone invalide - doit être un numéro sénégalais de 9 chiffres commençant par 77, 78, 76, 70 ou 75" });
    }
    // Validation adresse (minimum 5 caractères)
    if (address.length < 5) {
        return res.status(400).json({ message: "Adresse trop courte (minimum 5 caractères)" });
    }
    try {
        const result = await auth_service_1.authService.register(username, email, password, phone, address);
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