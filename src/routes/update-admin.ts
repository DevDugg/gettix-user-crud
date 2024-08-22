import { PrismaClient, Role } from "@prisma/client";
import { Request, Response, Router } from "express";

import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/password";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

const router = Router();
const prisma = new PrismaClient();

router.put(
  "/api/admin/update",
  [
    body("username", "Username is required").notEmpty(),
    body("password", "Password must be between 8 and 20 characters").trim().isLength({ min: 8, max: 20 }),
    body("role", "Role is required").notEmpty(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { username, password, role } = req.body;

    // validate the role
    if (!(role in Role)) throw new BadRequestError("Invalid role");

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

    // // throw error if exists
    if (!existingAdmin) throw new BadRequestError("Admin with the given username doesn't exist");
    // hash the password
    const hashedPassword = await Password.toHash(password);

    // create a new admin
    const updatedAdmin = await prisma.admin.update({
      where: { username },
      data: { password: hashedPassword, role },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).send({
      message: "Admin updated successfully",
      updatedAdmin,
    });
  },
);

export { router as updateAdminRouter };
