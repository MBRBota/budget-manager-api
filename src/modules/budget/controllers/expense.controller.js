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
        category_id AS "categoryId",
        category_name AS "categoryName",
        category_color AS "categoryColor"
      FROM expenses
      INNER JOIN users
      USING (user_id)
      INNER JOIN categories
      USING (category_id)
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

    const [{user_id}] = await sql`SELECT user_id FROM users WHERE username=${username}`
    const [newExpense] = await sql`
      WITH inserted AS (
        INSERT INTO expenses
          (expense_sum, expense_date, user_id, category_id)
        VALUES
          (${expenseSum}, ${expenseDate}, ${user_id}, ${categoryId})
        RETURNING *
      )
      SELECT
        expense_id AS "expenseId",
        expense_sum AS "expenseSum",
        expense_date AS "expenseDate",
        category_id AS "categoryId",
        category_name AS "categoryName",
        category_color AS "categoryColor"
      FROM inserted
      INNER JOIN categories
      USING (category_id)
      `

    return res.status(201).json({
      success: true,
      message: "Expense added successfully.",
      data: { newExpense }
    })
  } catch (err) {
    next(err)
  }
})

router.patch('/', async (req, res, next) => {
  try{
    const username = req.username
    const { expenseId, expenseSum, expenseDate, categoryId } = req.body.expense

    if (!expenseId || !expenseSum || !expenseDate || !categoryId)
      throw new HttpError("Missing information for expense update.", 400)

    const [{user_id}] = await sql`SELECT user_id FROM users WHERE username=${username}`
    const [updatedExpense] = await sql`
      WITH updated AS (
        UPDATE expenses
        SET
          expense_sum=${expenseSum}, expense_date=${expenseDate}, category_id=${categoryId}
        WHERE
          user_id=${user_id}
          AND expense_id=${expenseId}
        RETURNING *
      )
      SELECT
        expense_id AS "expenseId",
        expense_sum AS "expenseSum",
        expense_date AS "expenseDate",
        category_id AS "categoryId",
        category_name AS "categoryName",
        category_color AS "categoryColor"
      FROM updated
      INNER JOIN categories
      USING (category_id)
      `

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully.",
      data: { updatedExpense }
    })
  } catch (err) {
    next(err)
  }
})

router.delete('/', async (req, res, next) => {
  try{
    const username = req.username
    const expenseId = req.body.expense

    if (!expenseId)
      throw new HttpError("Missing expense ID.", 400)

    const [{user_id}] = await sql`SELECT user_id FROM users WHERE username=${username}`
    await sql`DELETE FROM expenses WHERE expense_id=${expenseId} AND user_id=${user_id}`

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully."
    })
  } catch (err) {
    next(err)
  }
})

export default router;