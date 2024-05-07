import { Router } from "express";
import HttpError from "../../../models/HttpError.js";
import sql from "../../../database/db.js";

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const username = req.username

    const userExpenses = await sql`
      SELECT
        expense_id AS "expenseId",
        expense_sum AS "expenseSum",
        expense_date AS "expenseDate",
        category_id AS "categoryId"
      FROM expenses
      INNER JOIN users
      USING (user_id)
      WHERE username=${username}
    `

    return res.status(200).json({
      success: true,
      message: "Expenses retrieved successfully.",
      data: { userExpenses: [...userExpenses] }
    })
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const username = req.username
    const { expenseSum, expenseDate, categoryId } = req.body.expense

    if (!expenseSum || !expenseDate || !categoryId)
      throw new HttpError("New expense information incomplete/missing.", 400)

    const [userId] = await sql`SELECT user_id FROM users WHERE username=${username}`
    await sql`
      INSERT INTO expenses
        (expense_sum, expense_date, user_id, category_id)
      VALUES
        (${expenseSum}, ${expenseDate}, ${userId}, ${categoryId})
      `

    return res.status(201).json({
      success: true,
      message: "Expense added successfully."
    })
  } catch (err) {
    next(err)
  }
})

router.patch('/', async (req, res, next) => {
  try{
    const username = req.username
    const { expenseId, expenseSum, expenseDate, categoryId } = req.body.category

    if (!expenseId || !expenseSum || !expenseDate || !categoryId)
      throw new HttpError("Missing information for expense update.", 400)

    const [userId] = await sql`SELECT user_id FROM users WHERE username=${username}`
    await sql`
      UPDATE expenses
      SET
        expense_sum=${expenseSum}, expense_date=${expenseDate}, category_id=${categoryId}
      WHERE
        user_id=${userId}
        AND expense_id=${expenseId}
    `

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully."
    })
  } catch (err) {
    next(err)
  }
})

router.delete('/', async (req, res, next) => {
  try{
    const username = req.username
    const { expenseId } = req.body.category

    if (!expenseId)
      throw new HttpError("Missing expense ID.", 400)

    const [userId] = await sql`SELECT user_id FROM users WHERE username=${username}`
    await sql`DELETE FROM expenses WHERE expense_id=${expenseId} AND user_id=${userId}`

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully."
    })
  } catch (err) {
    next(err)
  }
})

export default router;