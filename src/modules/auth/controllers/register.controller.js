import { Router } from "express";
import sql from "../../../database/db.js";
import bcrypt from 'bcrypt';
import HttpError from "../../../models/HttpError.js";

const router = Router();

router.post('/register', async (req, res, next) => {
  try{
    const { username, password } = req.body.user;

    // todo: Sanitize user inputs, implement password regex
    if (!username || !password)
      throw new HttpError("All user register form fields are required.", 400)

    const [userCheck] = await sql`SELECT username FROM users WHERE username=${ username }`
    if (userCheck)
      throw new HttpError("Username is already taken.", 409)

    // Hash user password with 10 salt rounds
    const hashedPassword = await bcrypt.hash(password, 10)
    await sql`INSERT INTO users (username, password) VALUES (${ username }, ${ hashedPassword })`

    return res.status(201).json({
      success: true,
      message: `New user ${ username } created successfully.`
    })
  } catch (err) {
    next(err)
  }
})

export default router