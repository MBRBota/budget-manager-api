import { Router } from "express";
import registerController from "./register.controller.js";
import loginController from "./login.controller.js";
import logoutController from "./logout.controller.js"
import tokenController from "./token.controller.js";
import { verifyToken } from "../../../middleware/verifyToken.middleware.js";

const router = Router();

router.use(registerController)
router.use(loginController)
router.use(tokenController)
router.use(verifyToken)
router.use(logoutController)

export default router;