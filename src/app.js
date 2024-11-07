import express from 'express';
import dotenv from "dotenv";
import cors from 'cors'

import db from "./config/db.js";
import usuarioRoutes from "./routes/UsuarioRoutes.js"
import fornecedorRoutes from "./routes/FornecedorRoutes.js"

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
db.connect();

app.use('/', usuarioRoutes);
app.use('/', fornecedorRoutes);

export default app;