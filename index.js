
import express from "express";
import db from "./config/db.js";
import userRoutes from "./routes/user.js"
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

const port = 8000;
//Cors Origin 
app.use(cors());

// Middleware to log request body
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies


db.connect();
app.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

    res.sendStatus(200);
})



app.use('/user', userRoutes);


app.listen(port, () => {
  console.log(`Listening port ${port}`);
})