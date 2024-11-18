import express from "express";

import PlantioController from "../controllers/PlantioController.js";

const plantioController = new PlantioController();

const router = express.Router();

/* Rota de consulta de todos os plantios */
router.get('/plantings', plantioController.buscaPlantios);
/* Rota de consulta de um plantio */
router.get('/planting/:id', plantioController.buscaPlantio);
/* Rota de criação de um plantio */
router.post('/planting', plantioController.criaPlantio);
/* Rota de alteração total de um plantio */
router.put('/planting/:id', plantioController.alteraRegistro);
/* Rota de alteração parcial de um plantio */
router.patch('/planting/:id', plantioController.alteraCampo);
/* Rota de arquivação de um plantio */
router.delete('/planting/:id', plantioController.deletaPlantio);

export default router;