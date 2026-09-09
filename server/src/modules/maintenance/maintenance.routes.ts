import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { maintenanceController } from "./maintenance.controller.js";
import { authorize } from "../../middleware/role.middleware.js";

const router = Router();

/**
 * @openapi
 * /api/maintenance:
 *   post:
 *     summary: Create a maintenance request
 *     tags:
 *       - Maintenance
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - unitId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Water leakage
 *               description:
 *                 type: string
 *                 example: Water is leaking from the bathroom
 *               category:
 *                 type: string
 *                 example: PLUMBING
 *               priority:
 *                 type: string
 *                 enum:
 *                   - LOW
 *                   - MEDIUM
 *                   - HIGH
 *                   - URGENT
 *                 example: HIGH
 *               unitId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Maintenance request created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */

router.post(
  "/",
  authMiddleware,
  authorize("RESIDENT"),
  maintenanceController.createRequest,
);

/**
 * @openapi
 * /api/maintenance:
 *   get:
 *     summary: Get maintenance requests
 *     tags:
 *       - Maintenance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of requests per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - OPEN
 *             - ACKNOWLEDGED
 *             - ASSIGNED
 *             - IN_PROGRESS
 *             - RESOLVED
 *             - CLOSED
 *         description: Filter by maintenance status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum:
 *             - LOW
 *             - MEDIUM
 *             - HIGH
 *             - URGENT
 *         description: Filter by priority
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by maintenance category
 *     responses:
 *       200:
 *         description: Maintenance requests retrieved successfully
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Authentication required
 */

router.get("/", authMiddleware, maintenanceController.getRequests);

/**
 * @openapi
 * /api/maintenance/{id}/assign:
 *   patch:
 *     summary: Assign a technician to a maintenance request
 *     tags:
 *       - Maintenance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Maintenance request ID
 *         example: 20
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - technicianId
 *             properties:
 *               technicianId:
 *                 type: integer
 *                 example: 29
 *     responses:
 *       200:
 *         description: Technician assigned successfully
 *       400:
 *         description: Invalid request ID, invalid technician, or request is not acknowledged
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Technician or maintenance request not found
 */

router.patch(
  "/:id/assign",
  authMiddleware,
  authorize("ADMIN", "MANAGER"),
  maintenanceController.assignTechnician,
);

/**
 * @openapi
 * /api/maintenance/{id}:
 *   get:
 *     summary: Get a maintenance request by ID
 *     tags:
 *       - Maintenance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Maintenance request ID
 *         example: 20
 *     responses:
 *       200:
 *         description: Maintenance request retrieved successfully
 *       400:
 *         description: Invalid request ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: You are not authorized to access this maintenance request
 *       404:
 *         description: Maintenance request not found
 */

router.get("/:id", authMiddleware, maintenanceController.getRequestById);

/**
 * @openapi
 * /api/maintenance/{id}:
 *   patch:
 *     summary: Update a maintenance request
 *     tags:
 *       - Maintenance
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Maintenance request ID
 *         example: 20
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated water leakage
 *               description:
 *                 type: string
 *                 example: Leakage has become worse
 *               category:
 *                 type: string
 *                 example: PLUMBING
 *               priority:
 *                 type: string
 *                 enum:
 *                   - LOW
 *                   - MEDIUM
 *                   - HIGH
 *                   - URGENT
 *                 example: URGENT
 *               status:
 *                 type: string
 *                 enum:
 *                   - OPEN
 *                   - ACKNOWLEDGED
 *                   - ASSIGNED
 *                   - IN_PROGRESS
 *                   - RESOLVED
 *                   - CLOSED
 *                 example: ACKNOWLEDGED
 *               unitId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Maintenance request updated successfully
 *       400:
 *         description: Invalid request ID, validation error, or invalid status transition
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Maintenance request not found
 */

router.patch(
  "/:id",
  authMiddleware,
  authorize("ADMIN", "MANAGER"),
  maintenanceController.updateRequest,
);

export default router;
