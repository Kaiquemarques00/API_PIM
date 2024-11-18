import express from "express";

import CulturaController from "../controllers/CulturaController.js";
import Token from "../middlewares/CheckToken.js";
import Role from "../middlewares/CheckRole.js";

const culturaController = new CulturaController();
const tokenMiddleware = new Token();
const RoleMiddleware = new Role();

const router = express.Router();

// Rota de consulta de todos as culturas 
router.get('/cultures', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], culturaController.buscaCulturas);
// Rota de consulta de uma cultura
router.get('/culture/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], culturaController.buscaCultura);
// Rota de criação de uma cultura
router.post('/culture', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], culturaController.criaCultura);
// Rota de alteração total de uma cultura
router.put('/culture/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], culturaController.alteraRegistro);
// Rota de alteração parcial de uma cultura 
router.patch('/culture/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], culturaController.alteraCampo);
// Rota de arquivação de uma cultura
router.delete('/culture/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], culturaController.deletaCultura);
export default router;