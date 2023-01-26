import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
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

app.listen(process.env.PORT, () => console.log(`Servidor rodou`));