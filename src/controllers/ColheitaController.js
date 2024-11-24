import db from "../config/db.js";

class ColheitaController {
    async buscaColheitas(req, res) {
        try {
            const require = await db.query("SELECT * FROM colheitas ORDER BY colheita_id ASC");
      
            const colheitas = require.rows;
  
            if (colheitas.length === 0) return res.status(404).json("Nenhuma colheita encontrada");
      
            res.status(200).json(colheitas);
          } catch (error) {
            console.log(error);
            res.status(422).json("Erro ao acessar banco de dados");
          }
    }

    async buscaColheita(req, res) {
        const id = req.params.id;
        
        try {
            const require = await db.query("SELECT * FROM colheitas WHERE colheita_id = $1", [id]);

            const colheita = require.rows;

            if(colheita.length === 0) return res.status(404).json("Nenhuma colheita encontrada");

            res.status(200).json(colheita)
        } catch (error) {
            console.log(error);
        }
    }

    async criaColheita(req, res) {
        const { plantio_id, qtd_colhida, observacoes } = req.body;

        if(!plantio_id) return res.status(422).json("ID da colheita deve ser preenchido");
        if(typeof plantio_id !== "number") return res.status(422).json("O campo PLANTIO ID deve ser um número");

        if(!qtd_colhida) return res.status(422).json("Quantidade colhida deve ser preenchida");
        if(typeof qtd_colhida !== "number") return res.status(422).json("O campo QUANTIDADE COLHIDA deve ser um número");
        
        try {
            const checaPlantio = await db.query("SELECT * FROM plantios WHERE plantio_id = $1", [plantio_id]);
            const plantioResult = checaPlantio.rows;

            if(plantioResult.length === 0) return res.status(404).json("Plantio não existe");

            const dataAtual = new Date()

            await db.query(
                `INSERT INTO colheitas(plantio_id, data_colheita, quantidade_colhida, observacoes)
                VALUES($1, $2, $3, $4)`,
                [plantio_id, dataAtual, qtd_colhida, observacoes]
            );

            await db.query(
                "UPDATE plantios SET status = $1 WHERE plantio_id = $2",
                ["Concluido", plantio_id]
            );

            res.status(201).json("Nova colheita cadastrada com sucesso");
        } catch (error) {
            console.log(error);
        }
    }

    async alteraRegistro(req, res) {
        const id = req.params.id;
        const { plantio_id, qtd_colhida, observacoes } = req.body;

        if(!plantio_id) return res.status(422).json("ID da colheita deve ser preenchido");
        if(typeof plantio_id !== "number") return res.status(422).json("O campo PLANTIO ID deve ser um número");

        if(!qtd_colhida) return res.status(422).json("Quantidade colhida deve ser preenchida");
        if(typeof qtd_colhida !== "number") return res.status(422).json("O campo QUANTIDADE COLHIDA deve ser um número");
        
        try {
            const checaPlantio = await db.query("SELECT * FROM plantios WHERE plantio_id = $1", [plantio_id]);
            const plantioResult = checaPlantio.rows;

            if(plantioResult.length === 0) return res.status(404).json("Plantio não existe");

            const dataAtual = new Date()
            await db.query(
                "UPDATE colheitas SET plantio_id = $1, data_colheita = $2, quantidade_colhida = $3, observacoes = $4 WHERE colheita_id = $5",
                [plantio_id, dataAtual, qtd_colhida, observacoes, id]
            );

            await db.query(
                "UPDATE plantios SET status = $1 WHERE plantio_id = $2",
                ["Concluido", plantio_id]
            );

            res.status(201).json("Nova colheita cadastrada com sucesso");
        } catch (error) {
            console.log(error);
        }
    }

    async alteraCampo(req, res) {
        const id = req.params.id;
        const { plantio_id, qtd_colhida, observacoes } = req.body;

        if (plantio_id) if(typeof plantio_id !== "number") return res.status(422).json("O campo PLANTIO ID deve ser um número");

        if (qtd_colhida) if(typeof qtd_colhida !== "number") return res.status(422).json("O campo QUANTIDADE COLHIDA deve ser um número");

        const dadosParaAtualizarColheita = {};
        if (qtd_colhida) dadosParaAtualizarColheita.quantidade_colhida = qtd_colhida;
        if (plantio_id) {
            try {
                const checaPlantio = await db.query("SELECT * FROM plantios WHERE plantio_id = $1", [plantio_id]);
                const plantioResult = checaPlantio.rows;
    
                if(plantioResult.length === 0) return res.status(404).json("Plantio não existe");
            } catch (error) {
                console.log(error);
            }
            dadosParaAtualizarColheita.plantio_id = plantio_id;
        }
        if (observacoes) dadosParaAtualizarColheita.observacoes = observacoes;
    
        if (Object.keys(dadosParaAtualizarColheita).length === 0)
          return res.status(400).json("Nenhum campo para atualizar");
    
        const campos = Object.keys(dadosParaAtualizarColheita);
        const valores = Object.values(dadosParaAtualizarColheita);
    
        const setClausula = campos.map((campo, index) => `${campo} = $${index + 1}`).join(', ');
    
        try {
            const result = await db.query(
                `UPDATE colheitas SET ${setClausula} WHERE colheita_id = $${campos.length + 1} RETURNING *`,
                [...valores, id]
            );
      
            if (result.rows.length === 0) return res.status(404).json('Colheita não existe');
    
            res.status(200).json("Colheita alterada com sucesso");
        } catch (error) {
            console.log(error);
        }
    }
    
    async deletaColheita(req, res) {
        const id = req.params.id;    

        try {
            const require = await db.query("SELECT * FROM colheitas WHERE colheita_id = $1", [id]);

            const colheita = require.rows;

            if(colheita.length === 0) return res.status(404).json("Nenhuma colheita encontrada");

            await db.query("DELETE FROM colheitas WHERE colheita_id = $1", [id]);

            res.status(200).json("Colheita deletada com sucesso");
        } catch (error) {
            console.log(error);
        }
    }
      
}

export default ColheitaController;