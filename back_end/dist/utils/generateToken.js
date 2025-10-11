"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateToken = (userId, role) => {
    const secret = process.env.JWT_SECRET;
    return jsonwebtoken_1.default.sign({ id: userId, role: role ?? "USER" }, secret, { expiresIn: "7d" });
};
exports.generateToken = generateToken;
//# sourceMappingURL=generateToken.js.map