import { Router } from "express";
import registerController from "./register.controller.js";
import loginController from "./login.controller.js";

const router = Router();

router.use(registerController)
router.use(loginController)

export default router;