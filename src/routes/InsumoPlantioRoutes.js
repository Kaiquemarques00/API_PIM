import express from "express";

import InsumoPlantioController from "../controllers/InsumosPlantioController.js";

const insumoPlantioController = new InsumoPlantioController();

const router = express.Router();

/* Rota de consulta de todos os fornecedores */
router.get('/inputs_plantings', insumoPlantioController.buscaInsumosPlantios);
/* Rota de consulta de um fornecedor */
router.get('/input_planting/:id', insumoPlantioController.buscaInsumoPlantio);
/* Rota de criação de um fornecedor */
router.post('/input_planting/:id', insumoPlantioController.criaInsumoPlantio);
/* Rota de alteração total de um fornecedor */
router.put('/input_planting/:id', insumoPlantioController.alteraRegistro);
/* Rota de alteração parcial de um fornecedor */
router.patch('/input_planting/:id', insumoPlantioController.alteraCampo);
/* Rota de arquivação de uma fornecedor */
router.delete('/input_planting/:id', insumoPlantioController.deletaInsumoPlantio);

export default router;