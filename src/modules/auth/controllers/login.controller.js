import { Router } from "express";
import sql from "../../../database/db.js";
import bcrypt from 'bcrypt';
import HttpError from "../../../models/HttpError.js";
import { generateAccessToken, generateRefreshToken } from "../services/generateToken.service.js";

const router = Router();

router.post('/login', async (req, res, next) => {
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

    const accessToken = generateAccessToken(foundUser.username)
    const refreshToken = generateRefreshToken(foundUser.username)

    await sql`UPDATE users SET refresh_token=${ refreshToken } WHERE username=${ username }`

    res.cookie('jwtRefreshToken', refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
    return res.status(200).json({
      success: true,
      message: `Successfully logged into ${ username } account.`,
      data: {
        username: foundUser.username,
        accessToken: accessToken
      }
    })
  } catch (err) {
    next(err)
  }

})

export default router