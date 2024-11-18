import db from "../config/db.js";

class InsumoPlantioController {
    async buscaInsumosPlantios(req, res) {
        res.status(200).json("Rota de busca de insumos em plantios funcionando");
    }

    async buscaInsumoPlantio(req, res) {
        res.status(200).json("Rota de busca de insumo em plantio funcionando");
    }

    async criaInsumoPlantio(req, res) {
        res.status(200).json("Rota de criação de insumo em plantio funcionando");
    }

    async alteraRegistro(req, res) {
        res.status(200).json("Rota de alteração total de insumo em plantio funcionando");
    }

    async alteraCampo(req, res) {
        res.status(200).json("Rota de alteração parcial de insumo em plantio funcionando");
    }
    
    async deletaInsumoPlantio(req, res) {
        res.status(200).json("Rota de deleção de insumo em plantio funcionando");
    }
      
}

export default InsumoPlantioController;