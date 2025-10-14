"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.findById = exports.findAll = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const findAll = async () => {
    return prisma_1.default.user.findMany();
};
exports.findAll = findAll;
const findById = async (id) => {
    return prisma_1.default.user.findUnique({ where: { id } });
};
exports.findById = findById;
const create = async (data) => {
    return prisma_1.default.user.create({
        data: {
            username: data.username,
            email: data.email,
            password: data.password,
            role: data.role || "USER",
            phone: data.phone,
            address: data.address,
        },
    });
};
exports.create = create;
const update = async (id, data) => {
    return prisma_1.default.user.update({
        where: { id },
        data,
    });
};
exports.update = update;
const remove = async (id) => {
    return prisma_1.default.user.delete({ where: { id } });
};
exports.remove = remove;
//# sourceMappingURL=user.repository.js.map