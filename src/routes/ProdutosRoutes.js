import { buscarProdutos, adicionarProdutos, checkout } from "../controllers/Produtos.js";
import {Router} from "express"
import { validateSchema } from "../middlewares/validateSchema.js";
import { cardSchema } from "../model/CardSchema.js";

const productsRouter = Router()

//Rotas das receitas
productsRouter.get('/produtos', buscarProdutos)
productsRouter.post('/produtos', adicionarProdutos)
productsRouter.post("/checkout", validateSchema(cardSchema), checkout)

export default productsRouter