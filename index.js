
import express from "express";
import db from "./config/db.js";
import userRoutes from "./routes/user.js"

const app = express();
const port = 8000;
db.connect();
app.get('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.sendStatus(200);
})



app.use('/user', userRoutes);


app.listen(port, () => {
  console.log(`Listening port ${port}`);
})