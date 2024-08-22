import { PrismaClient } from "@prisma/client";
import { app } from "./app";

const prisma = new PrismaClient();

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT key missing");

  try {
    prisma.$connect();
    console.log("DB connected");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("Listening on 3000");
  });
};

start()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
