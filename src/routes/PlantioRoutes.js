import express from "express";

import PlantioController from "../controllers/PlantioController.js";
import Token from "../middlewares/CheckToken.js";
import Role from "../middlewares/CheckRole.js";

const plantioController = new PlantioController();
const tokenMiddleware = new Token();
const RoleMiddleware = new Role();

const router = express.Router();

/* Rota de consulta de todos os plantios */
router.get('/plantings', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], plantioController.buscaPlantios);
/* Rota de consulta de um plantio */
router.get('/planting/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], plantioController.buscaPlantio);
/* Rota de criação de um plantio */
router.post('/planting', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], plantioController.criaPlantio);
/* Rota de alteração total de um plantio */
router.put('/planting/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], plantioController.alteraRegistro);
/* Rota de alteração parcial de um plantio */
router.patch('/planting/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], plantioController.alteraCampo);
/* Rota de arquivação de um plantio */
router.delete('/planting/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], plantioController.deletaPlantio);

export default router;