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
        const { cultura, area_plantada, status, observacoes } = req.body;

        if(!cultura) return res.status(422).json("Nome da cultura deve ser preenchido");
        if(typeof cultura !== "string") return res.status(422).json("O campo CULTURA deve ser um texto");

        if(!area_plantada) return res.status(422).json("Área plantada deve ser preenchida");
        if(typeof area_plantada !== "number") return res.status(422).json("O campo ÁREA PLANTADA deve ser um número");

        if(!status) return res.status(422).json("Status do plantio deve ser preenchido");
        if(typeof status !== "string") return res.status(422).json("O campo STATUS deve ser um texto");

        const statusFormat = status.charAt(0).toUpperCase() + status.slice(1);
        if (statusFormat != "Planejado" && statusFormat != "Em andamento" && statusFormat != "Concluido" && statusFormat != "Cancelado") return res.status(422).json("Campo que faz referência ao status do plantio incorreto");

        const calculaColheita = (data, dias) => new Date(data.setDate(data.getDate() + dias));
        const dataAtual = new Date();
        
        try {
            const checaCultura = await db.query("SELECT nome FROM culturas WHERE nome = $1", [cultura]);
            const culturaResult = checaCultura.rows;

            if(culturaResult.length === 0) return res.status(404).json("Cultura não existe");

            const cicloCultura = (await db.query(`SELECT ciclo_cultivo_dias FROM culturas WHERE nome = $1`, [cultura]));
            const duracaoCiclo = cicloCultura.rows[0].ciclo_cultivo_dias;

            const inicio_plantio = new Date().toLocaleDateString('en-us')
            const fim_plantio = calculaColheita(dataAtual, duracaoCiclo).toLocaleDateString('en-us');

            await db.query(
                `INSERT INTO plantios(cultura_nome, data_inicio, previsao_colheita, area_plantada, status, observacoes)
                VALUES($1, $2, $3, $4, $5, $6)`,
                [cultura, inicio_plantio, fim_plantio, area_plantada, statusFormat, observacoes]
            );

            res.status(201).json("Novo plantio cadastrado com sucesso");
        } catch (error) {
            console.log(error);
        }
    }

    async alteraRegistro(req, res) {
        const id = req.params.id;
        const { cultura, area_plantada, status, observacoes } = req.body;

        if(!cultura) return res.status(422).json("Nome da cultura deve ser preenchido");
        if(typeof cultura !== "string") return res.status(422).json("O campo CULTURA deve ser um texto");

        if(!area_plantada) return res.status(422).json("Área plantada deve ser preenchida");
        if(typeof area_plantada !== "number") return res.status(422).json("O campo ÁREA PLANTADA deve ser um número");

        if(!status) return res.status(422).json("Status do plantio deve ser preenchido");
        if(typeof status !== "string") return res.status(422).json("O campo STATUS deve ser um texto");

        const statusFormat = status.charAt(0).toUpperCase() + status.slice(1);
        if (statusFormat != "Planejado" && statusFormat != "Em andamento" && statusFormat != "Concluido" && statusFormat != "Cancelado") return res.status(422).json("Campo que faz referência ao status do plantio incorreto");

        const calculaColheita = (data, dias) => new Date(data.setDate(data.getDate() + dias));
        const dataAtual = new Date();
        
        try {
            const checaCultura = await db.query("SELECT nome FROM culturas WHERE nome = $1", [cultura]);
            const culturaResult = checaCultura.rows;

            if(culturaResult.length === 0) return res.status(404).json("Cultura não existe");

            const cicloCultura = (await db.query(`SELECT ciclo_cultivo_dias FROM culturas WHERE nome = $1`, [cultura]));
            const duracaoCiclo = cicloCultura.rows[0].ciclo_cultivo_dias;

            const inicio_plantio = new Date().toLocaleDateString('en-us')
            const fim_plantio = calculaColheita(dataAtual, duracaoCiclo).toLocaleDateString('en-us');
    
            await db.query(
                "UPDATE plantios SET cultura_nome = $1, data_inicio = $2, previsao_colheita = $3, area_plantada = $4, status = $5, observacoes = $6 WHERE plantio_id = $7",
                [cultura, inicio_plantio, fim_plantio, area_plantada, statusFormat, observacoes, id]
            );
        
            res.status(200).json("Plantio alterado com sucesso");
          } catch (error) {
            console.log(error);
          }
    }

    async alteraCampo(req, res) {
        const id = req.params.id;
        let statusFormat;

        const { cultura, area_plantada, status, observacoes } = req.body;

        if (cultura) if(typeof cultura !== "string") return res.status(422).json("O campo CULTURA deve ser um texto");

        if (area_plantada) if(typeof area_plantada !== "number") return res.status(422).json("O campo ÁREA PLANTADA deve ser um número");

        if (status) if(typeof status !== "string") return res.status(422).json("O campo STATUS deve ser um texto");

        if (status) {
            statusFormat = status.charAt(0).toUpperCase() + status.slice(1);
            if (statusFormat != "Planejado" && statusFormat != "Em andamento" && statusFormat != "Concluido" && statusFormat != "Cancelado") return res.status(422).json("Campo que faz referência ao status do plantio incorreto");
        }

        const dadosParaAtualizarPlantio = {};
        if (area_plantada) dadosParaAtualizarPlantio.area_plantada = area_plantada;
        if (status) dadosParaAtualizarPlantio.status = statusFormat;
        if (cultura) {
            try {
                const checaCultura = await db.query("SELECT nome FROM culturas WHERE nome = $1", [cultura]);
                const culturaResult = checaCultura.rows;
    
                if(culturaResult.length === 0) return res.status(404).json("Cultura não existe");
            } catch (error) {
                console.log(error);
            }
            dadosParaAtualizarPlantio.cultura_nome = cultura;
        }
        if (observacoes) dadosParaAtualizarPlantio.observacoes = observacoes;
    
        if (Object.keys(dadosParaAtualizarPlantio).length === 0)
          return res.status(400).json("Nenhum campo para atualizar");
    
        const campos = Object.keys(dadosParaAtualizarPlantio);
        const valores = Object.values(dadosParaAtualizarPlantio);
    
        const setClausula = campos.map((campo, index) => `${campo} = $${index + 1}`).join(', ');
    
        try {
            const result = await db.query(
                `UPDATE plantios SET ${setClausula} WHERE plantio_id = $${campos.length + 1} RETURNING *`,
                [...valores, id]
            );
      
            if (result.rows.length === 0) return res.status(404).json('Plantio não existe');
    
            res.status(200).json("Plantio alterado com sucesso");
        } catch (error) {
            console.log(error);
        }
    }
    
    async deletaColheita(req, res) {
        const id = req.params.id;    

        try {
            const require = await db.query("SELECT * FROM plantios WHERE plantio_id = $1", [id]);

            const plantio = require.rows;

            if(plantio.length === 0) return res.status(404).json("Nenhum plantio encontrado");

            await db.query("DELETE FROM plantios WHERE plantio_id = $1", [id]);

            res.status(200).json("Plantio deletado com sucesso");
        } catch (error) {
            console.log(error);
        }
    }
      
}

export default ColheitaController;