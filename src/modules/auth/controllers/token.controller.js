import { Router } from "express";
import sql from "../../../database/db.js";
import jwt from 'jsonwebtoken';
import HttpError from "../../../models/HttpError.js";
import { generateAccessToken } from "../services/generateToken.service.js";

const router = Router();

router.get('/token', async (req, res, next) => {
  try{
    const refreshToken = req.cookies?.jwtRefreshToken;
  
    if (!refreshToken)
      throw new HttpError("Missing refresh token.", 401)

    const [foundUser] = await sql`SELECT username, refresh_token FROM users WHERE refresh_token=${ refreshToken }`
    if (!foundUser)
      throw new HttpError("Invalid token.", 403)

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || decoded.username !== foundUser.username)
          throw new HttpError("Invalid token.", 403)
        const accessToken = generateAccessToken(decoded.username)

        return res.status(200).json({
          success: true,
          message: `Access token refreshed.`,
          data: {
            username: decoded.username,
            accessToken: accessToken
          }
        })
      }
    )
  } catch (err) {
    next(err)
  }

})

export default router