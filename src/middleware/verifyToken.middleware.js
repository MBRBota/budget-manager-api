import jwt from "jsonwebtoken"
import HttpError from "../models/HttpError.js"


// JWT verification middleware
export const verifyToken = (req, res, next) => {
  try{
    const authHeader = req.headers['authorization']
    if (!authHeader)
      throw new HttpError("Unauthorized.", 401)

    // Extract JWT token from "Bearer {token}" authorization header
    const token = authHeader.split(" ")[1]

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err, decoded) => {
        if(err)
          throw new HttpError("Invalid token.", 403)
        req.username = decoded.username
        next()
      }
    )
  } catch (err) {
    next(err)
  }
}