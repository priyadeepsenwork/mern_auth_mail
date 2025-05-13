import express from 'express'
import dotenv from 'dotenv'

import { conenctDB } from './db/connectDB.js'
import authRoutes from './routes/auth-route.js'

const app = express()
dotenv.config()


//*routes
app.get('/', (req, res) => {
    res.send(`Hello World`)
})
app.use("/api/auth", authRoutes)


//*port connection
const PORT = 3000
app.listen(PORT, () => {
    conenctDB()
    console.log(`Server is running on port: ${PORT}`)
})

