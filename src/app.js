import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import joi from "joi";
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const usuarioSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref('password')).required()
})

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

try {
    await mongoClient.connect();
    db = mongoClient.db();
    console.log("MongoDB Connected!");
} catch (err) {
    res.sendStatus(500);
}

app.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body

    const { error } = usuarioSchema.validate({ name, email, password, confirmPassword })

    if (error) {
        const errorMessages = error.details.map(err => err.message)
        return res.status(422).send(errorMessages)
    }

    const passwordHashed = bcrypt.hashSync(password, 10)

    try {
        await db.collection("usuarios").insertOne({ name, email, password: passwordHashed })
        res.status(201).send("Usuario Cadastrado")

    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.post('/signin', async (req, res) => {
    const { email, password } = req.body
    const token = uuid()
    try {

        const checarUsuario = await db.collection('usuarios').findOne({ email })
        if (!checarUsuario) return res.status(400).send("Usuário ou senha inválidos!")

        const isCorrectPassword = bcrypt.compareSync(password, checarUsuario.password)

        if (!isCorrectPassword) {
            return res.status(400).send("Usuário ou senha inválidos!")
        }

        const token = uuid();

        await db.collection("sessoes").insertOne({ idUsuario: checarUsuario._id, token })

        res.status(200).send(token)

    } catch (error) {
        res.status(500).send(error.message)
    }
})

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
            name, image, value, quantity: 1
        });
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

app.post("/checkout", async (req, res) => {
    const { produtos, valorTotal, cardName, cardNumber, securityNumber, expirationDate } = req.body;
    const cartao = { cardName, cardNumber, securityNumber, expirationDate }
    const arrayProdutos = { produtos }
    const valor = { valorTotal }
    try {

        const produtoSchema = joi.array().items(joi.string().required())

        const validationProduto = produtoSchema.validate(arrayProdutos, { abortEarly: false })

        if (validationProduto.error) {
            return res.status(422).send(validationProduto.error.details)
        }

        const valorSchema = joi.object({
            valorTotal: joi.number().required()
        })

        const validationValor = valorSchema.validate(valor, { abortEarly: false })

        if (validationValor.error) {
            return res.status(422).send(validationValor.error.details)
        }

        const cardSchema = joi.object({
            cardName: joi.string().required(),
            cardNumber: joi.number().required(),
            securityNumber: joi.number().required(),
            expirationDate: joi.string().required()
        })

        const validationCard = cardSchema.validate(cartao, { abortEarly: false })

        if (validationCard.error) {
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

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Servidor rodou`));