import { Router } from "express";
import authRouter from "../modules/auth/controllers/auth.controller.js";
import budgetRouter from "../modules/budget/controllers/budget.controller.js";

const router = Router();

router.use('/auth', authRouter);
router.use('/budget', budgetRouter);

export default router;