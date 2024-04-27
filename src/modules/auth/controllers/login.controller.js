import { Router } from "express";
import sql from "../../../database/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import HttpError from "../../../models/HttpError.js";
import { errorHandler } from "../../../handlers/errorHandler.js";

const router = Router();

router.post('/login', async (req, res) => {
  try{
    const { username, password } = req.body.user;
  
    if (!username || !password)
      throw new HttpError("Username and password are required.", 400)

    const [foundUser] = await sql`SELECT username, password FROM users WHERE username=${ username }`
    if (!foundUser)
      throw new HttpError("User does not exist.", 404)

    const matchPassword = await bcrypt.compare(password, foundUser.password)
    if (!matchPassword)
      throw new HttpError("Wrong password.", 400)

    const accessToken = jwt.sign(
      { "username": foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
      { "username": foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    )

    await sql`UPDATE users SET refresh_token=${ refreshToken } WHERE username=${ username }`

    res.cookie('jwtRefreshToken', refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
    return res.status(200).json({
      success: true,
      message: `Successfully logged into ${ username } account.`,
      accessToken: accessToken
    })
  } catch (err) {
    errorHandler(err)
  }

})

export default router