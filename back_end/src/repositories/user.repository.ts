import prisma from "../config/prisma";
import { Role } from "@prisma/client";

export const findAll = async () => {
  return prisma.user.findMany();
};

export const findById = async (id: number) => {
  return prisma.user.findUnique({ where: { id } });
};

export const create = async (data: { username: string; email: string; password: string; role?: Role }) => {
  return prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role || "USER",
    },
  });
};

export const update = async (id: number, data: Partial<{ username: string; email: string; password: string; role: Role }>) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

export const remove = async (id: number) => {
  return prisma.user.delete({ where: { id } });
};
