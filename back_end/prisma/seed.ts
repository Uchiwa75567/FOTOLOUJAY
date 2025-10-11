import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const admins = [
    { username: "admin", email: "admin@fotoloujay.com", password: "admin123" },
    { username: "pabassdiame76", email: "pabassdiame76@gmail.com", password: "passer123" },
    { username: "bachirdev", email: "bachirdev@gmail.com", password: "passer123" },
  ];

  const moderators = [
    { username: "moderator1", email: "moderator1@fotoloujay.com", password: "moderator123" },
    { username: "moderator2", email: "moderator2@fotoloujay.com", password: "moderator123" },
  ];

  const users = [
    { username: "user1", email: "user1@fotoloujay.com", password: "user123" },
    { username: "user2", email: "user2@fotoloujay.com", password: "user123" },
  ];

  // Créer admins
  for (const a of admins) {
    const existing = await prisma.user.findUnique({ where: { email: a.email } });
    if (!existing) {
      const hashed = await bcrypt.hash(a.password, 10);
      await prisma.user.create({
        data: {
          username: a.username,
          email: a.email,
          password: hashed,
          role: "ADMIN",
        },
      });
      console.log(`✅ Admin créé : ${a.email} / ${a.password}`);
    } else {
      console.log(`ℹ️ Admin déjà existant : ${a.email}`);
    }
  }

  // Créer modérateurs
  for (const m of moderators) {
    const existing = await prisma.user.findUnique({ where: { email: m.email } });
    if (!existing) {
      const hashed = await bcrypt.hash(m.password, 10);
      await prisma.user.create({
        data: {
          username: m.username,
          email: m.email,
          password: hashed,
          role: "MODERATOR",
        },
      });
      console.log(`✅ Modérateur créé : ${m.email} / ${m.password}`);
    } else {
      console.log(`ℹ️ Modérateur déjà existant : ${m.email}`);
    }
  }

  // Créer utilisateurs standards
  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (!existing) {
      const hashed = await bcrypt.hash(u.password, 10);
      await prisma.user.create({
        data: {
          username: u.username,
          email: u.email,
          password: hashed,
          role: "USER",
        },
      });
      console.log(`✅ Utilisateur créé : ${u.email} / ${u.password}`);
    } else {
      console.log(`ℹ️ Utilisateur déjà existant : ${u.email}`);
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
