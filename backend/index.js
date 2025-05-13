import express from 'express'
import dotenv from 'dotenv'
import { conenctDB } from './db/connectDB.js'


const app = express()
dotenv.config()

app.get('/', (req, res) => {
    res.send(`Hello World`)
})

const PORT = 3000
app.listen(PORT, () => {
    conenctDB()
    console.log(`Server is running on port: ${PORT}`)
})

