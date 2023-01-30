import { signin, signup } from "../controllers/Auth.js"
import {Router} from "express"

const authRouter = Router()

// Rotas de autenticação
authRouter.post('/signup', signup)
authRouter.post('/signin', signin)

export default authRouter