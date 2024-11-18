import express from "express";

import CulturaController from "../controllers/CulturaController.js";

const culturaController = new CulturaController();

const router = express.Router();

// Rota de consulta de todos as culturas 
router.get('/cultures', culturaController.buscaCulturas);
// Rota de consulta de uma cultura

router.get('/culture/:id', culturaController.buscaCultura);
// Rota de criação de uma cultura
router.post('/culture', culturaController.criaCultura);
// Rota de alteração total de uma cultura
router.put('/culture/:id', culturaController.alteraRegistro);
// Rota de alteração parcial de uma cultura 
router.patch('/culture/:id', culturaController.alteraCampo);
// Rota de arquivação de uma cultura
router.delete('/culture/:id', culturaController.deletaCultura);
export default router;