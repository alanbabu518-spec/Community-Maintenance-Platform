import  {Router} from "express";
import { userController } from "./user.controller.js";

const router = Router();

router.get("/",userController.getUsers);
router.post("/",userController.createUser)

export default router;