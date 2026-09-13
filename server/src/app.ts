import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import userRoutes from "./modules/users/user.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import maintenanceRoutes from "./modules/maintenance/maintenance.routes.js";

import { errorMiddleware } from "./middleware/error.middleware.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/maintenance", maintenanceRoutes);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorMiddleware);

export default app;
