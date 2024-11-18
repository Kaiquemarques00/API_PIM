import db from "../config/db.js";

class CulturaController {
    async buscaCulturas(req, res) {
        try {
            const require = await db.query("SELECT * FROM culturas ORDER BY cultura_id ASC");
      
            const culturas = require.rows;
  
            if (culturas.length === 0) return res.status(404).json("Nenhuma cultura encontrada");
      
            res.status(200).json(culturas);
          } catch (error) {
            console.log(error);
            res.status(422).json("Erro ao acessar banco de dados");
          }
    }

    async buscaCultura(req, res) {
        const id = req.params.id;

        try {
            const require = await db.query("SELECT * FROM culturas WHERE cultura_id = $1", [id]);

            const cultura = require.rows;

            if(cultura.length === 0) return res.status(404).json("Nenhuma cultura encontrada");

            res.status(200).json(cultura)
        } catch (error) {
            console.log(error);
        }
    }

    async criaCultura(req, res) {
        const { nome, ciclo, descricao } = req.body;

        if(!nome) return res.status(422).json("Nome da cultura deve ser preenchido");
        if(typeof nome !== "string") return res.status(422).json("O campo NOME deve ser um texto");

        if(!ciclo) return res.status(422).json("Ciclo da cultura deve ser preenchido");
        if(typeof ciclo !== "number") return res.status(422).json("O campo CICLO deve ser um número");

        if(!descricao) return res.status(422).json("Descrição da cultura deve ser preenchido");
        if(typeof descricao !== "string") return res.status(422).json("O campo DESCRIÇÃO deve ser um texto");

        try {

            await db.query(
                `INSERT INTO culturas(nome, ciclo_cultivo_dias, descricao)
                VALUES($1, $2, $3)`,
                [nome, ciclo, descricao]
            );

            res.status(201).json("Nova cultura cadastrada com sucesso");
        } catch (error) {
            console.log(error);
        }
    }

    async alteraRegistro(req, res) {
        const id = req.params.id;
        const { nome, ciclo, descricao } = req.body;

        if (!nome) return res.status(422).json("Nome da cultura deve ser preenchido");
        if (typeof nome !== "string") return res.status(422).json("O campo NOME deve ser um texto");

        if(!ciclo) return res.status(422).json("Ciclo da cultura deve ser preenchido");
        if (typeof ciclo !== "number") return res.status(422).json("O campo CICLO deve ser um número");

        if(!descricao) return res.status(422).json("Descrição da cultura deve ser preenchido/a");
        if (typeof descricao !== "string") return res.status(422).json("O campo DESCRIÇÃO deve ser um texto");


        try {
    
            const alteraCultura = await db.query(
                "UPDATE culturas SET nome = $1, ciclo_cultivo_dias = $2, descricao = $3 WHERE cultura_id = $4 RETURNING *",
                [nome, ciclo, descricao, id]
            );

            if (alteraCultura.rows.length === 0) return res.status(404).json("Cultura não encontrada");
        
            res.status(200).json("Cultura alterada com sucesso");
          } catch (error) {
            console.log(error);
          }
    }

    async alteraCampo(req, res) {
        const id = req.params.id;

        const { nome, ciclo, descricao } = req.body;

        if (nome) if (typeof nome !== "string") return res.status(422).json("O campo NOME deve ser um texto");
        if (ciclo) if (typeof ciclo !== "number") return res.status(422).json("O campo CICLO deve ser um número");
        if (descricao) if (typeof descricao !== "string") return res.status(422).json("O campo DESCRIÇÃO deve ser um texto");

        const dadosParaAtualizarCultura = {};
        if (nome) dadosParaAtualizarCultura.nome = nome;
        if (ciclo) dadosParaAtualizarCultura.ciclo_cultivo_dias = ciclo;
        if (descricao) dadosParaAtualizarCultura.descricao = descricao;
    
        if (Object.keys(dadosParaAtualizarCultura).length === 0)
          return res.status(400).json("Nenhum campo para atualizar");
    
        const campos = Object.keys(dadosParaAtualizarCultura);
        const valores = Object.values(dadosParaAtualizarCultura);
    
        const setClausula = campos.map((campo, index) => `${campo} = $${index + 1}`).join(', ');
    
        try {

            const result = await db.query(
                `UPDATE culturas SET ${setClausula} WHERE cultura_id = $${campos.length + 1} RETURNING *`,
                [...valores, id]
            );
      
            if (result.rows.length === 0) return res.status(404).json('Cultura não existe');
    
            res.status(200).json("Cultura alterada com sucesso");
        } catch (error) {
            console.log(error);
        }
    }
    
    async deletaCultura(req, res) {
        const id = req.params.id;    

        try {
            const require = await db.query("SELECT * FROM culturas WHERE cultura_id = $1", [id]);

            const cultura = require.rows;

            if(cultura.length === 0) return res.status(404).json("Nenhuma cultura encontrada");

            await db.query("DELETE FROM culturas WHERE cultura_id = $1", [id]);

            res.status(200).json("Cultura deletada com sucesso");
        } catch (error) {
            console.log(error);
        }
    }
      
}

export default CulturaController;