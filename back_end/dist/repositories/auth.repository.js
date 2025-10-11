"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRepository = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
exports.authRepository = {
    findByEmail: async (email) => {
        return prisma_1.default.user.findUnique({ where: { email } });
    },
};
//# sourceMappingURL=auth.repository.js.map