"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const auth_service_1 = require("../services/auth.service");
const login = async (req, res) => {
    const { email, password } = req.body;
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
    try {
        const result = await auth_service_1.authService.register(username, email, password);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.register = register;
//# sourceMappingURL=auth.controller.js.map