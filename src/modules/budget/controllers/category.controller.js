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

router.patch('/', async (req, res) => {
  try{
    const username = req.username
    const { categoryId, categoryName, categoryColor } = req.body.category

    if (!categoryId || !categoryName || !categoryColor)
      throw new HttpError("Missing information for category update.", 400)

    const [userId] = await sql`SELECT user_id FROM users WHERE username=${username}`
    await sql`UPDATE categories SET category_name=${categoryName}, category_color=${categoryColor} WHERE user_id=${userId}`

    return res.status(200).json({
      success: true,
      message: "Category updated successfully."
    })
  } catch (err) {
    next(err)
  }
})

router.delete('/', async (req, res) => {
  try{
    const username = req.username
    const { categoryId } = req.body.category

    if (!categoryId)
      throw new HttpError("Missing category ID.", 400)

    const [userId] = await sql`SELECT user_id FROM users WHERE username=${username}`
    await sql`DELETE FROM categories WHERE category_id=${categoryId} AND user_id=${userId}`

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully."
    })
  } catch (err) {
    next(err)
  }
})

export default router;