"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secret = process.env.JWT_SECRET;
const generateAccessToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ id: userId, role: role ?? "USER" }, secret, { expiresIn: "15m" });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, secret, { expiresIn: "7d" });
};
exports.generateRefreshToken = generateRefreshToken;
//# sourceMappingURL=generateToken.js.map