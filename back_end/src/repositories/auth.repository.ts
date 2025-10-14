import prisma from "../config/prisma";

export const authRepository = {
  findByEmail: async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },
};

