import express from 'express';
import dotenv from "dotenv";
import cors from 'cors'

import db from "./config/db.js";
import userRoutes from "./routes/UserRoutes.js"

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
db.connect();

app.use('/', userRoutes);

export default app;