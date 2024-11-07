import express from "express";

import FornecedorController from "../controllers/FornecedorController.js";

const fornecedorController = new FornecedorController();

const router = express.Router();

/* Rota de consulta de todos os fornecedores */
router.get('/suppliers', fornecedorController.buscaFornecedores);
/* Rota de consulta de um fornecedor */
router.get('/supplier/:id', fornecedorController.buscaFornecedor);
/* Rota de criação de um fornecedor */
router.post('/supplier', fornecedorController.criaFornecedor);
/* Rota de alteração total de um fornecedor */
router.put('/supplier/:id', fornecedorController.alteraRegistro);
/* Rota de alteração parcial de um fornecedor */
router.patch('/supplier/:id', fornecedorController.alteraCampo);
/* Rota de arquivação de uma fornecedor */
router.delete('/supplier/:id', fornecedorController.arquivaFornecedor);
/* Rota de consulta de todos os fornecedores arquivados */
router.get('/suppliers/arc', fornecedorController.buscaFornecedoresArquivados);
/* Rota de consulta de um fornecedor arquivado */
router.get('/supplier/arc/:id', fornecedorController.buscaFornecedorArquivado);


export default router;