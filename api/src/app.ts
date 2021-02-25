import 'reflect-metadata'
import createConnection from "./database"
// Toda tipagem do express está em outra biblioteca, que precisamos baixar para termos 
//acesso as fucionalidades do express
import express from 'express'
import { router } from './routes'

createConnection()

const app = express()
app.use(express.json())
app.use(router)

export{app}