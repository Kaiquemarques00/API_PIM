import express from "express";

import SupplierController from "../controllers/SupplierController.js";

const supplierController = new SupplierController();

const router = express.Router();

/* Rota de consulta de todos os fornecedores */
router.get('/suppliers', supplierController.buscaFornecedores);
/* Rota de consulta de um fornecedor */
router.get('/supplier/:id', supplierController.buscaFornecedor);
/* Rota de criação de um fornecedor */
router.post('/supplier', supplierController.criaFornecedor);
/* Rota de alteração total de um fornecedor */
router.put('/supplier/:id', supplierController.alteraRegistro);
/* Rota de alteração parcial de um fornecedor */
router.patch('/supplier/:id', supplierController.alteraCampo);
/* Rota de arquivação de uma fornecedor */
router.delete('/supplier/:id', supplierController.arquivaFornecedor);
/* Rota de consulta de todos os fornecedores arquivados */
router.get('/suppliers/arc', supplierController.buscaFornecedoresArquivados);
/* Rota de consulta de um fornecedor arquivado */
router.get('/supplier/arc/:id', supplierController.buscaFornecedorArquivado);


export default router;