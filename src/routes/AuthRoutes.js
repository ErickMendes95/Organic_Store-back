import { signin, signup } from "../controllers/Auth.js"
import {Router} from "express"

const authRouter = Router()

// Rotas de autenticação
authRouter.post('/signup', signin)
authRouter.post('/signin', signup)

export default authRouter