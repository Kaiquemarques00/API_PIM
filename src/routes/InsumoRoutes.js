import express from "express";

import InsumoController from "../controllers/InsumoController.js";

const insumoController = new InsumoController();

const router = express.Router();

/* Rota de consulta de todos os fornecedores */
router.get('/inputs', insumoController.buscaInsumos);
/* Rota de consulta de um fornecedor */
router.get('/input/:id', insumoController.buscaInsumo);
/* Rota de criação de um fornecedor */
router.post('/input', insumoController.criaInsumo);
/* Rota de alteração total de um fornecedor */
router.put('/input/:id', insumoController.alteraRegistro);
/* Rota de alteração parcial de um fornecedor */
router.patch('/input/:id', insumoController.alteraCampo);
/* Rota de arquivação de uma fornecedor */
router.delete('/input/:id', insumoController.deletaInsumo);

export default router;