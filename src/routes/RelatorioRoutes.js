import express from "express";

import RelatorioController from "../controllers/RelatorioController.js";
import Token from "../middlewares/CheckToken.js";
import Role from "../middlewares/CheckRole.js";

const relatorioController = new RelatorioController();
const tokenMiddleware = new Token();
const RoleMiddleware = new Role();

const router = express.Router();

/* Rota de consulta de Vendas por período */
router.get('/report/sale/period', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], relatorioController.vendasPorPeriodo);
/* Rota de consulta de Venda por cultura */
router.get('/report/sale/culture', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], relatorioController.vendasPorCultura);
/* Rota de consulta de Receita total de vendas */
router.get('/report/sale/revenue', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], relatorioController.vendasReceitaTotal);
/* Rota de consulta de plantios por periodos*/
router.get('/report/plantings/period', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], relatorioController.plantiosPorPeriodo);
/* Rota de consulta de culturas por plantios*/
router.get('/report/plantings/cultures', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], relatorioController.culturasPorPlantio);
/* Rota de consulta plantios por status*/
router.get('/report/plantings/status', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], relatorioController.statusPorPlantio);
/* Rota de consulta Colheita por periodo*/
router.get('/report/harvest/period', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], relatorioController.colheitaPorPeriodo);
/* Rota de consulta insumos por fornecedores*/
router.get('/report/inputs/suppliers', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], relatorioController.InsumosPorFornecedor);


export default router;