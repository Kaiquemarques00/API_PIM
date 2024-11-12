import express from "express";

import InsumoController from "../controllers/InsumoController.js";
import Token from "../middlewares/CheckToken.js";
import Role from "../middlewares/CheckRole.js";

const insumoController = new InsumoController();
const tokenMiddleware = new Token();
const RoleMiddleware = new Role();

const router = express.Router();

/* Rota de consulta de todos os fornecedores */
router.get('/inputs', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], insumoController.buscaInsumos);
/* Rota de consulta de um fornecedor */
router.get('/input/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], insumoController.buscaInsumo);
/* Rota de criação de um fornecedor */
router.post('/input', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], insumoController.criaInsumo);
/* Rota de alteração total de um fornecedor */
router.put('/input/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], insumoController.alteraRegistro);
/* Rota de alteração parcial de um fornecedor */
router.patch('/input/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], insumoController.alteraCampo);
/* Rota de arquivação de uma fornecedor */
router.delete('/input/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], insumoController.deletaInsumo);

export default router;