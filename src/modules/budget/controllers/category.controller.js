import { Router } from "express";
import HttpError from "../../../models/HttpError";

const router = Router();

router.get('/', async (req, res) => {
  try {
    const username = req.username

    const userCategories = await sql`SELECT category_id, category_name, category_color FROM categories LEFT JOIN users USING (user_id) WHERE username=${username} OR user_id IS NULL`

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: [...userCategories]
    })
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res) => {
  try {
    const username = req.username
    const { categoryName, categoryColor } = req.body.category

    if (!categoryName || !categoryColor)
      throw new HttpError("New category information incomplete/missing.", 400)

    const [userId] = await sql`SELECT user_id FROM users WHERE username=${username}`
    await sql`INSERT INTO categories (category_name, category_color, user_id) VALUES (${categoryName}, ${categoryColor}, ${userId})`

    return res.status(201).json({
      success: true,
      message: "Category added successfully."
    })
  } catch (err) {
    next(err)
  }
})

export default router;