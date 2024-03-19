import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import indexRoutes from './routers/indexRouter.js'
import './utils/db.js';
dotenv.config();
const app = express();

app.use(cors({
    origin: "*"
}));

app.use(express.json());

app.use(indexRoutes);

app.get('/', (req, res) => {
    return res.status(200).send("Welcome to RateX Backend");
});

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
});
