import { Router } from "express";
import HttpError from "../../../models/HttpError.js";
import sql from "../../../database/db.js";

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const username = req.username

    // Retrieve default (null user-id rows) and user-made custom categories
    const userCategories = await sql`
      SELECT
        category_id AS "categoryId",
        category_name AS "categoryName",
        category_color AS "categoryColor"
      FROM categories
      LEFT JOIN users
      USING (user_id)
      WHERE
        username=${username}
        OR user_id IS NULL
    `

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: { userCategories: [...userCategories] }
    })
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const username = req.username
    const { categoryName, categoryColor } = req.body.category

    if (!categoryName || !categoryColor)
      throw new HttpError("New category information incomplete/missing.", 400)

    const [{user_id}] = await sql`SELECT user_id FROM users WHERE username=${username}`
    const [newCategory] = await sql`
      INSERT INTO categories
        (category_name, category_color, user_id)
      VALUES
        (${categoryName}, ${categoryColor}, ${user_id})
      RETURNING
        category_id AS "categoryId",
        category_name AS "categoryName",
        category_color AS "categoryColor"
    `

    return res.status(201).json({
      success: true,
      message: "Category added successfully.",
      data: { newCategory }
    })
  } catch (err) {
    next(err)
  }
})

router.patch('/', async (req, res, next) => {
  try{
    const username = req.username
    const { categoryId, categoryName, categoryColor } = req.body.category

    if (!categoryId || !categoryName || !categoryColor)
      throw new HttpError("Missing information for category update.", 400)

    const [{user_id}] = await sql`SELECT user_id FROM users WHERE username=${username}`
    const [updatedCategory] = await sql`
      UPDATE categories
      SET
        category_name=${categoryName}, category_color=${categoryColor}
      WHERE
        user_id=${user_id}
        AND category_id=${categoryId}
      RETURNING
        category_id AS "categoryId",
        category_name AS "categoryName",
        category_color AS "categoryColor"
    `

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      data: { updatedCategory }
    })
  } catch (err) {
    next(err)
  }
})

router.delete('/', async (req, res, next) => {
  try{
    const username = req.username
    const categoryId = req.body.category

    if (!categoryId)
      throw new HttpError("Missing category ID.", 400)

    const [{user_id}] = await sql`SELECT user_id FROM users WHERE username=${username}`
    await sql`DELETE FROM categories WHERE category_id=${categoryId} AND user_id=${user_id}`

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully."
    })
  } catch (err) {
    next(err)
  }
})

export default router;