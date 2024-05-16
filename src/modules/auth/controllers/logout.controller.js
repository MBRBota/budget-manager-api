import { Router } from "express";
import sql from "../../../database/db.js";

const router = Router();

router.post('/logout', async (req, res, next) => {
  try{
    const username = req.username;

    await sql`UPDATE users SET refresh_token = NULL WHERE username=${username}`

    res.clearCookie('jwtRefreshToken', { httpOnly: true, secure: true })

    return res.status(201).json({
      success: true,
      message: `User logged out successfully.`
    })
  } catch (err) {
    next(err)
  }
})

export default router