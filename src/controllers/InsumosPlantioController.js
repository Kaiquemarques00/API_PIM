import db from "../config/db.js";

class InsumoPlantioController {
    async buscaInsumosPlantios(req, res) {
        try {
            const consultaInsumosPlantios = await db.query("SELECT * FROM insumos_plantios ORDER BY insumo_plantio_id ASC");
            const insumosPlantios = consultaInsumosPlantios.rows;

            res.status(200).json(insumosPlantios);
        } catch (error) {
            console.log(error);
        }
    }

    async buscaInsumoPlantio(req, res) {
        res.status(200).json("Rota de busca de insumo em plantio funcionando");
    }

    async criaInsumoPlantio(req, res) {
        const id = req.params.id;
        const { insumo, qtd_insumo } = req.body;

        if(!insumo) return res.status(422).json("Insumo deve ser preenchido");
        if(typeof insumo != "string") return res.status(422).json("O campo INSUMO deve ser um texto");

        if(!qtd_insumo) return res.status(422).json("Quantidade de insumo deve ser preenchida");
        if(typeof qtd_insumo != "number") return res.status(422).json("O campo QUANTIDADE DE INSUMO deve ser um número");

        try {
            const consultaInsumo = await db.query("SELECT nome FROM insumos WHERE nome = $1", [insumo]);
            if(consultaInsumo.rows.length === 0) return res.status(404).json("Insumo não encontrado");

            const consultaPlantio = await db.query("SELECT plantio_id FROM plantios WHERE plantio_id = $1", [id]);
            if (consultaPlantio.rows.length === 0) return res.status(404).json("Plantio não encontrado");

            try {
                await db.query("INSERT INTO insumos_plantios(plantio_id, insumo_nome, quantidade_utilizada) VALUES ($1, $2, $3)", [id, insumo, qtd_insumo]);
            } catch (error) {
                console.log(error);
            }

            res.json("Insumo direcionado a plantio com sucesso");
        } catch (error) {
            console.log(error);
        }
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