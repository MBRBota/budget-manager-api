import { Router } from "express";
import registerController from "./register.controller.js";
import loginController from "./login.controller.js";
import tokenController from "./token.controller.js";

const router = Router();

router.use(registerController)
router.use(loginController)
router.use(tokenController)

export default router;