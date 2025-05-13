import express from 'express'
import { login, logout, signup } from '../controllers/auth-controller'

const router = express.Router()

//auth-routes
router.get("/signup", signup)

router.get("/login", login)

router.get("/logout", logout)

export default router