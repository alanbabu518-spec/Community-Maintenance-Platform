import { Router } from "express";
import { userController } from "./user.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */

router.get(
  "/",
  authMiddleware,
  authorize("ADMIN", "MANAGER"),
  userController.getUsers,
);

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create a user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - passwordHash
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               passwordHash:
 *                 type: string
 *                 example: hashed-password
 *               role:
 *                 type: string
 *                 enum:
 *                   - RESIDENT
 *                   - ADMIN
 *                   - MANAGER
 *                   - TECHNICIAN
 *                 example: RESIDENT
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid user data
 */

router.post("/", userController.createUser);

export default router;
