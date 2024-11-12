import express from "express";

import FornecedorController from "../controllers/FornecedorController.js";
import Token from "../middlewares/CheckToken.js";
import Role from "../middlewares/CheckRole.js";

const fornecedorController = new FornecedorController();
const tokenMiddleware = new Token();
const RoleMiddleware = new Role();

const router = express.Router();

/* Rota de consulta de todos os fornecedores */
router.get('/suppliers', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], fornecedorController.buscaFornecedores);
/* Rota de consulta de um fornecedor */
router.get('/supplier/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], fornecedorController.buscaFornecedor);
/* Rota de criação de um fornecedor */
router.post('/supplier', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], fornecedorController.criaFornecedor);
/* Rota de alteração total de um fornecedor */
router.put('/supplier/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], fornecedorController.alteraRegistro);
/* Rota de alteração parcial de um fornecedor */
router.patch('/supplier/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], fornecedorController.alteraCampo);
/* Rota de arquivação de uma fornecedor */
router.delete('/supplier/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], fornecedorController.arquivaFornecedor);
/* Rota de consulta de todos os fornecedores arquivados */
router.get('/suppliers/arc', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], fornecedorController.buscaFornecedoresArquivados);
/* Rota de consulta de um fornecedor arquivado */
router.get('/supplier/arc/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], fornecedorController.buscaFornecedorArquivado);


export default router;