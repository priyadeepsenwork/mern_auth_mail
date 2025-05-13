import express from 'express'
import dotenv from 'dotenv'


import { conenctDB } from './db/connectDB.js'
import authRoutes from './routes/auth-route.js'

const app = express()
dotenv.config()

//*middlewares
app.use(express.json()) //allows us to parse incoming req in req.body

//*routes
app.use("/api/auth", authRoutes)


//*port connection
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    conenctDB()
    console.log(`Server is running on port: ${PORT}`)
})

