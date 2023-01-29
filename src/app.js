import express from "express";
import cors from "cors";
import authRouter from "./routes/AuthRoutes.js";
import productsRouter from "./routes/ProdutosRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use(authRouter)
app.use (productsRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Servidor rodou`));