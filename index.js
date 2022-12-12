import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// FOLDER SEPARATION LOGIC CHAIN (Read right to left): postRoutes (routes) <- controllers <- models
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';

const app = express();
dotenv.config();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({ limit: "30mb", extended: true})); // import img size limit
app.use(cors());

app.use('/posts', postRoutes);
app.use('/user', userRoutes);

// this should display on Heroku
app.get('/', (req, res) => {
    res.send("API is up and running!");
});

const PORT = process.env.PORT || 5000;

// 2nd parameters allows for removal of warnings. 
mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log("Server running on port " + PORT)))  // set up server if connection to mongoDB is successful
    .catch((error) => console.log(error));                                              // throw error