
import express from "express";
import db from "./config/db.js";
import userRoutes from "./routes/user.js"
import postRoutes from "./routes/post.js"
import likeRoutes from "./routes/like.js"
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser())
const port = 8000;
//Cors Origin 
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allow specified methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specified headers
  credentials: true // Allow credentials (cookies, authorization headers)
}));

// Middleware to log request body
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

try {
  db.connect();
  console.log('Postgres Database Connected')
} catch (error) {
  console.log(`Database Error: ${error}`)
  
}

app.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

    res.sendStatus(200);
})



app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/like', likeRoutes);


app.listen(port, () => {
  console.log(`Listening port ${port}`);
})