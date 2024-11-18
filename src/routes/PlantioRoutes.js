import express from "express";

import PlantioController from "../controllers/PlantioController.js";

const plantioController = new PlantioController();

const router = express.Router();

/* Rota de consulta de todos os fornecedores */
router.get('/plantings', plantioController.buscaPlantios);
/* Rota de consulta de um fornecedor */
router.get('/planting/:id', plantioController.buscaPlantios);
/* Rota de criação de um fornecedor */
router.post('/planting', plantioController.criaPlantio);
/* Rota de alteração total de um fornecedor */
router.put('/planting/:id', plantioController.alteraRegistro);
/* Rota de alteração parcial de um fornecedor */
router.patch('/planting/:id', plantioController.alteraCampo);
/* Rota de arquivação de uma fornecedor */
router.delete('/planting/:id', plantioController.deletaPlantio);

export default router;