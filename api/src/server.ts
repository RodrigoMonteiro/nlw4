import 'reflect-metadata'
import "./database"
// Toda tipagem do express está em outra biblioteca, que precisamos baixar para termos 
//acesso as fucionalidades do express
import express from 'express'
import { router } from './routes'

const app = express()
app.use(express.json())
app.use(router)


app.listen(3000, () => {
    console.log("Backend executando...")
})
