import { Router } from "express";
import sql from "../../../database/db";
import bcrypt from 'bcrypt';

const router = Router();

router.post('/register', async (req, res) => {
  try{
    const { username, password } = req.body.user;

    if (!username || !password)
      throw new Error("All user register form fields are required.")

    const userCheck = await sql`SELECT username FROM users WHERE username=${ username }`
    if (userCheck.rows[0])
      throw new Error("Username is already taken.")

    const hashedPassword = await bcrypt.hash(password, 10)
    await sql`INSERT INTO users (username, password) VALUES (${ username }, ${ hashedPassword })`

    return res.status(201).json({
      success: true,
      message: `New user ${ username } created successfully.`
    })
  } catch (err) {
    return res.status(418).json({
      success: false,
      message: err.message
    })
  }
})

export default router