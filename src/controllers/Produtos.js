import db from "../config/database.js";

export async function buscarProdutos(req, res) {
    try {
        const produtos = await db.collection('produtos').find().toArray();

        res.send(produtos);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
export async function adicionarProdutos(req, res) {
    const { name, image, value } = req.body;

    try {
        await db.collection("produtos").insertOne({
            name, image, value, quantity: 1
        });
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
export async function checkout(req, res) {
    const {cardName, cardNumber, securityNumber, expirationDate,products, value } = req.body;
    
    try {

        await db.collection("comprasFinalizadas").insertOne({
            products: products,
            totalValue: value,
            cardName: cardName,
            cardNumber: cardNumber,
            securityNumber: securityNumber,
            expirationDate: expirationDate
        })

        res.sendStatus(200)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

