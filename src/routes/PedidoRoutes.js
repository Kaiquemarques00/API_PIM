import express from "express";

import PedidoController from "../controllers/PedidoVendaController.js";
import Token from "../middlewares/CheckToken.js";
import Role from "../middlewares/CheckRole.js";

const pedidoController = new PedidoController();
const tokenMiddleware = new Token();
const RoleMiddleware = new Role();

const router = express.Router();

// Rota de consulta de todos os pedidos
router.get('/orders', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], pedidoController.buscaPedidos);
// Rota de consulta de um pedido
router.get('/order/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], pedidoController.buscaPedido);
// Rota de consulta de todas as vendas
router.get('/sales', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], pedidoController.buscaVendas);
// Rota de consulta de uma venda
router.get('/sale/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], pedidoController.buscaVenda);
// Rota de criação de uma cultura
router.post('/order', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], pedidoController.criaPedido);
// Rota de alteração parcial de uma cultura 
router.patch('/order/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], pedidoController.alteraCampo);
// Rota de arquivação de uma cultura
router.delete('/order/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], pedidoController.deletaPedido);
// Rota deleta venda
router.delete('/sale/:id', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador', 'Funcionario'])], pedidoController.deletaVenda);

export default router;