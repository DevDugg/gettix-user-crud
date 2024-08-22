import { Request, Response, Router } from "express";

import { BadRequestError } from "../errors/bad-request-error";
import { PrismaClient } from "@prisma/client";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

const router = Router();
const prisma = new PrismaClient();

router.delete(
  "/api/admin/delete",
  [body("username", "Username is required").notEmpty()],
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

    if (!existingAdmin) throw new BadRequestError("Admin with the given username doesn't exist");

    const deletedAdmin = await prisma.admin.delete({
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

    res.status(200).send({
      message: "Admin deleted successfully",
      deletedAdmin,
    });
  },
);

export { router as deleteAdminRouter };
