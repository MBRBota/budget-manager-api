import { Router } from "express";
import { verifyToken } from "../../../middleware/verifyToken.middleware.js";
import categoryController from "./category.controller.js";
import expenseController from "./expense.controller.js";

const router = Router();

// JWT verfication middleware for resource API calls
router.use(verifyToken)
router.use('/category', categoryController)
router.use('/expense', expenseController)


export default router;