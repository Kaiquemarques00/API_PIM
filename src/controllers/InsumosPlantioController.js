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
        const id = req.params.id;
        try {
            const consultaInsumosPlantios = await db.query("SELECT * FROM insumos_plantios WHERE plantio_id = $1 ORDER BY insumo_plantio_id ASC", [id]);
            const insumosPlantios = consultaInsumosPlantios.rows;

            res.status(200).json(insumosPlantios);
        } catch (error) {
            console.log(error);
        }
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
                const alteraInsumoPlantio = await db.query("UPDATE insumos_plantios SET plantio_id = $1, insumo_nome = $2, quantidade_utilizada = $3 WHERE insumo_plantio_id = $4 RETURNING *", [consultaPlantio.rows[0].plantio_id, insumo, qtd_insumo, id]);
                if (alteraInsumoPlantio.rows.length === 0) return res.status(404).json("Insumo do plantio não encontrado");
            } catch (error) {
                console.log(error);
            }

            res.json("Insumo do plantio alterado com sucesso");
        } catch (error) {
            console.log(error);
        }
    }

    async alteraCampo(req, res) {
        const id = req.params.id;

        const { insumo, qtd_insumo } = req.body;

        if(insumo) if(typeof insumo != "string") return res.status(422).json("O campo INSUMO deve ser um texto");
        if(qtd_insumo) if(typeof qtd_insumo != "number") return res.status(422).json("O campo QUANTIDADE DE INSUMO deve ser um número");

        const dadosParaAtualizarInsumoPlantio = {};
        if (qtd_insumo) dadosParaAtualizarInsumoPlantio.quantidade_utilizada = qtd_insumo;
        if (insumo) {
            try {
                const consultaInsumo = await db.query("SELECT nome FROM insumos WHERE nome = $1", [insumo]);
                if(consultaInsumo.rows.length === 0) return res.status(404).json("Insumo não encontrado");
            
                const consultaPlantio = await db.query("SELECT plantio_id FROM plantios WHERE plantio_id = $1", [id]);
                if (consultaPlantio.rows.length === 0) return res.status(404).json("Plantio não encontrado");
            } catch (error) {
                console.log(error);
            }
            dadosParaAtualizarInsumoPlantio.insumo_nome = insumo;
        }
    
        if (Object.keys(dadosParaAtualizarInsumoPlantio).length === 0)
          return res.status(400).json("Nenhum campo para atualizar");
    
        const campos = Object.keys(dadosParaAtualizarInsumoPlantio);
        const valores = Object.values(dadosParaAtualizarInsumoPlantio);
    
        const setClausula = campos.map((campo, index) => `${campo} = $${index + 1}`).join(', ');
    
        try {

            const result = await db.query(
                `UPDATE insumos_plantios SET ${setClausula} WHERE insumo_plantio_id = $${campos.length + 1} RETURNING *`,
                [...valores, id]
            );
      
            if (result.rows.length === 0) return res.status(404).json('Insumo do plantio não existe');
    
            res.status(200).json("Insumo do plantio alterado com sucesso");
        } catch (error) {
            console.log(error);
        }
    }
    
    async deletaInsumoPlantio(req, res) {
        const id = req.params.id;    

        try {
            const require = await db.query("SELECT * FROM insumos_plantios WHERE insumo_plantio_id = $1", [id]);

            const insumoPlantio = require.rows;

            if(insumoPlantio.length === 0) return res.status(404).json("Nenhum insumo do plantio encontrado");

            await db.query("DELETE FROM insumos_plantios WHERE insumo_plantio_id = $1", [id]);

            res.status(200).json("Insumo do plantio deletado com sucesso");
        } catch (error) {
            console.log(error);
        }
    }
      
}

export default InsumoPlantioController;