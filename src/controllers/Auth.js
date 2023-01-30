import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid';
import db from '../config/database.js';

export async function signin(req, res) {
    const { email, password } = req.body
    const token = uuid()
    try {

        const checarUsuario = await db.collection('usuarios').findOne({ email })
        if (!checarUsuario) return res.status(400).send("Usuário ou senha inválidos!")

        const isCorrectPassword = bcrypt.compareSync(password, checarUsuario.password)

        if (!isCorrectPassword) {
            return res.status(400).send("Usuário ou senha inválidos!")
        }        

        await db.collection("sessoes").insertOne({ idUsuario: checarUsuario._id, token })

        res.status(200).send(token)

    } catch (error) {
        res.status(500).send(error.message)
    }
}
export async function signup(req, res) {
    const { name, email, password } = req.body
   
    const passwordHashed = bcrypt.hashSync(password, 10)

    try {
        await db.collection("usuarios").insertOne({ name, email, password: passwordHashed })
        res.status(201).send("Usuario Cadastrado")

    } catch (error) {
        res.status(500).send(error.message)
    }
}


