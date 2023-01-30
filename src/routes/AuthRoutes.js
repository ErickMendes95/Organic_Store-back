import { signin, signup } from "../controllers/Auth.js"
import {Router} from "express"
import { usuarioSchema} from "../model/AuthSchema.js"
import { loginSchema } from "../model/LoginSchema.js"
import {validateSchema} from "../middlewares/validateSchema.js"

const authRouter = Router()

// Rotas de autenticação
authRouter.post('/signup',validateSchema(usuarioSchema), signup)
authRouter.post('/signin', validateSchema(loginSchema), signin)

export default authRouter