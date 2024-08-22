import { Request, Response, Router } from "express";

import { PrismaClient } from "@prisma/client";
import { validateRequest } from "../middlewares/validate-request";

const router = Router();
const prisma = new PrismaClient();

router.get("/api/admins", validateRequest, async (req: Request, res: Response) => {
  const admins = await prisma.admin.findMany({
    select: {
      id: true,
      username: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).send(admins);
});

export { router as getAdminsRouter };
