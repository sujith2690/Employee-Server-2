import express from 'express'
import { loginUser, signUpUser } from '../controllers/authController.js';

const authRoute = express.Router()

authRoute.post("/signup", signUpUser)
authRoute.post("/login", loginUser)


export default authRoute;