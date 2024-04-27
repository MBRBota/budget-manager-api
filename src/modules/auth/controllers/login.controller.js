import { Router } from "express";
import sql from "../../../database/db.js";
import bcrypt from 'bcrypt';

const router = Router();

router.post('/login', async (req, res) => {
  try{
    const { username, password } = req.body.user;
  
    if (!username || !password)
      throw new Error("Username and password are required.")

    const [foundUser] = await sql`SELECT username, password FROM users WHERE username=${ username }`
    if (!foundUser)
      throw new Error("User does not exist.")

    const matchPassword = await bcrypt.compare(password, foundUser.password)
    if (!matchPassword)
      throw new Error("Wrong password.")

    return res.status(200).json({
      success: true,
      message: `Successfully logged into ${ username } account.`
    })
  } catch (err) {
    return res.status(418).json({
      success: false,
      message: err.message
    })
  }

})

export default router