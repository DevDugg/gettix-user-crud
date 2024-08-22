import { Request, Response, Router } from "express";

import { BadRequestError } from "../errors/bad-request-error";
import { PrismaClient } from "@prisma/client";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

const router = Router();
const prisma = new PrismaClient();

router.get(
  "/api/admin",
  [body("username").isString().notEmpty().withMessage("Username is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { username } = req.body;

    const existingAdmin = await prisma.admin.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!existingAdmin) throw new BadRequestError("Admin not found");

    res.status(200).send(existingAdmin);
  },
);

export { router as getAdminRouter };
