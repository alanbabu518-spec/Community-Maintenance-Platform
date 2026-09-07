import  {Router} from "express";
import { userController } from "./user.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, userController.getUsers);
router.post("/",userController.createUser)

export default router;