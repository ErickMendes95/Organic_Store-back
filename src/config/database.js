import { MongoClient } from "mongodb";
import dotenv from "dotenv";


dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

try {
    await mongoClient.connect();
    db = mongoClient.db();
    console.log("MongoDB Connected!");
} catch (err) {
    res.sendStatus(500);
    console.log("Fail in MongoDB!");
}

export default db; 