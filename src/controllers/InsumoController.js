import db from "../config/db.js";

class InsumoController {
    async buscaInsumos(req, res) {
        res.status(200).json("Rota busca insumos");
    }

    async buscaInsumo(req, res) {
        res.status(200).json("Rota busca insumo");
    }


    async criaInsumo(req, res) {
        res.status(200).json("Rota cria insumo");
    }

    async alteraRegistro(req, res) {
        res.status(200).json("Rota altera totalmente insumo");
    }

    async alteraCampo(req, res) {
        res.status(200).json("Rota altera parcialmente insumo");
    }
    
    async deletaInsumo(req, res) {
        res.status(200).json("Rota deleta insumo");
    }
      
}

export default InsumoController;