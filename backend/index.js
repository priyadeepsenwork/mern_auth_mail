import express from "express";
import cookieParser from "cookie-parser";

//import dotenv from 'dotenv'

import { conenctDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth-route.js";

const app = express();
//dotenv.config()

//*middlewares
app.use(express.json()); //allows us to parse incoming requests in req.body
app.use(cookieParser()); //allows us to parse incoming cookies

//*routes
app.use("/api/auth", authRoutes);

//*port connection
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  conenctDB();
  console.log(`Server is running on port: ${PORT}`);
});
