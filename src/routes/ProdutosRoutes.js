import { buscarProdutos, adicionarProdutos, checkout } from "../controllers/Produtos.js";
import {Router} from "express"

const productsRouter = Router()

//Rotas das receitas
productsRouter.get('/produtos', buscarProdutos)
productsRouter.post('/produtos', adicionarProdutos)
productsRouter.post("/checkout", checkout)

export default productsRouter