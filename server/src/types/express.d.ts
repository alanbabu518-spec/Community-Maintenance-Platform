import type { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface AuthenticatedUser {
      userId: number;
      role: UserRole;
      tokenVersion: number;
    }

    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};