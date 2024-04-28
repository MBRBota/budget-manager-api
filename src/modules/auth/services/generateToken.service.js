import jwt from 'jsonwebtoken';

export const generateAccessToken = (username) => {
  return jwt.sign(
    { "username": username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  )
}

export const generateRefreshToken = (username) => {
  return jwt.sign(
    { "username": username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' }
  )
}