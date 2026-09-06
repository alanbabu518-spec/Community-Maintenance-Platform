import { prisma } from "./lib/prisma.js";

async function testDatabase() {
  try {
    const users = await prisma.user.findMany();

    console.log("Database connected successfully ✅");
    console.log("Users:", users);
  } catch (error) {
    console.error("Database connection failed !");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();