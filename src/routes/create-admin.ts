import { PrismaClient, Role } from "@prisma/client";
import { Request, Response, Router } from "express";

import { BadRequestError } from "../errors/bad-request-error";
import { Password } from "../services/password";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

const router = Router();
const prisma = new PrismaClient();

router.post(
  "/api/admin/create",
  [
    body("username", "Username is required").notEmpty(),
    body("password", "Password is required").trim().isLength({ min: 8, max: 20 }),
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
    if (existingAdmin) throw new BadRequestError("Admin with the given username already exists");
    // hash the password
    const hashedPassword = await Password.toHash(password);

    // create a new admin
    const newAdmin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).send(newAdmin);
  },
);

export { router as createAdminRouter };
