import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import joi from "joi";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

try {
    await mongoClient.connect();
    db = mongoClient.db();
    console.log("MongoDB Connected!");
} catch (err) {
    res.sendStatus(500);
}

app.get('/produtos', async (req, res) => {
    try {
        const produtos = await db.collection('produtos').find().toArray();

        res.send(produtos);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.post('/produtos', async (req, res) => {
    const { name, image, value } = req.body;

    try {
        await db.collection("produtos").insertOne({
            name, image, value
        });
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.post("/checkout", async (req, res) => {
    const {produtos, valorTotal, cardName, cardNumber, securityNumber, expirationDate} = req.body;
    const cartao = {cardName, cardNumber, securityNumber, expirationDate}
    const arrayProdutos = {produtos}
    const valor = {valorTotal}
    try {

        const produtoSchema = joi.array().items(joi.string().required())

        const validationProduto = produtoSchema.validate(arrayProdutos, {abortEarly: false})

        if(validationProduto.error){
            return res.status(422).send(validationProduto.error.details)
        }
        
        const valorSchema = joi.object({
            valorTotal: joi.number().required()
        })

        const validationValor = valorSchema.validate(valor, {abortEarly: false})

        if(validationValor.error){
            return res.status(422).send(validationValor.error.details)
        }

        const cardSchema = joi.object({
            cardName: joi.string().required(),
            cardNumber: joi.number().required(),
            securityNumber: joi.number().required(),
            expirationDate: joi.string().required()
        })

        const validationCard = cardSchema.validate(cartao, {abortEarly: false})

        if(validationCard.error){
            return res.status(422).send(validationCard.error.details)
        }

        await db.collection("comprasFinalizadas").insertOne({
            produtos: produtos, 
            valorTotal: valorTotal, 
            cardName: cardName, 
            cardNumber: cardNumber, 
            securityNumber: securityNumber, 
            expirationDate: expirationDate
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
})

PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Servidor rodou`));