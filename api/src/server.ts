// Toda tipagem do express está em outra biblioteca, que precisamos baixar para termos 
//acesso as fucionalidades do express
import express from 'express'

const app = express()



app.get('/',(req, res) => {
    // return  res.send("Hello world - NLW#4! ") 
    return  res.json("Hello world - NLW#4! ")
})
app.post('/',(req, res) => {
    return  res.json({message: "Os dados foram salvos com sucesso!"})
})

app.listen(3000, () => {
    console.log("Backend executando...")
})
