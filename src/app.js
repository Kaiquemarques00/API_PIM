import express from 'express';
import dotenv from "dotenv";
import cors from 'cors'

import db from "./config/db.js";
import usuarioRoutes from "./routes/UsuarioRoutes.js"
import fornecedorRoutes from "./routes/FornecedorRoutes.js"
import insumoRoutes from "./routes/InsumoRoutes.js"
import culturaRoutes from "./routes/CulturaRoutes.js"
import plantioRoutes from "./routes/PlantioRoutes.js"
import insumoPlantioRoutes from "./routes/InsumoPlantioRoutes.js"
import colheitaRoutes from "./routes/ColheitaRoutes.js"
import PedidosVendasRoutes from "./routes/PedidoRoutes.js"
import relatorioRoutes from "./routes/RelatorioRoutes.js"

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
db.connect();

app.use('/', usuarioRoutes);
app.use('/', fornecedorRoutes);
app.use('/', insumoRoutes);
app.use('/', culturaRoutes);
app.use('/', plantioRoutes);
app.use('/', insumoPlantioRoutes);
app.use('/', colheitaRoutes);
app.use('/', PedidosVendasRoutes);
app.use('/', relatorioRoutes);

export default app;