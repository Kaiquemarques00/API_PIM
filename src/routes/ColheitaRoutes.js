import express from "express";

import ColheitaController from "../controllers/ColheitaController.js";
import Token from "../middlewares/CheckToken.js";
import Role from "../middlewares/CheckRole.js";

const colheitaController = new ColheitaController();
const tokenMiddleware = new Token();
const RoleMiddleware = new Role();

const router = express.Router();

// Rota de consulta de todos as culturas 
router.get('/harvests', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], colheitaController.buscaColheitas);
// Rota de consulta de uma cultura
router.get('/harvest/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], colheitaController.buscaColheita);
// Rota de criação de uma cultura
router.post('/harvest', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], colheitaController.criaColheita);
// Rota de alteração total de uma cultura
router.put('/harvest/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], colheitaController.alteraRegistro);
// Rota de alteração parcial de uma cultura 
router.patch('/harvest/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], colheitaController.alteraCampo);
// Rota de arquivação de uma cultura
router.delete('/harvest/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], colheitaController.deletaColheita);
export default router;