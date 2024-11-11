import db from "../config/db.js";

class InsumoController {
    async buscaInsumos(req, res) {
        try {
            const require = await db.query(`SELECT * FROM insumos`);
      
            const insumos = require.rows;
  
            if (insumos.length === 0) return res.status(404).json("Nenhum insumo encontrado");
      
            res.status(200).json(insumos);
          } catch (error) {
            console.log(error);
            res.status(422).json("Erro ao acessar banco de dados");
          }
    }

    async buscaInsumo(req, res) {
        const id = req.params.id;

        try {
            const require = await db.query("SELECT * FROM insumos WHERE insumo_id = $1", [id]);

            const insumo = require.rows;

            if(insumo.length === 0) return res.status(404).json("Nenhum insumo encontrado");

            res.status(200).json(insumo)
        } catch (error) {
            console.log(error);
        }
    }


    async criaInsumo(req, res) {
        const { nome, tipo, medida, qtd_estoque, custo_por_unidade, fornecedor, observacoes } = req.body;

        if(!nome) return res.status(422).json("Nome do insumo deve ser preenchido");
        if(!tipo) return res.status(422).json("Tipo do insumo deve ser preenchido");
        if(!medida) return res.status(422).json("Unidade de medida do insumo deve ser preenchido/a");
        if(!qtd_estoque) return res.status(422).json("Quantidade em estoque do insumo deve ser preenchido/a");
        if(!custo_por_unidade) return res.status(422).json("Custo por unidade do insumo deve ser preenchido");
        if(!fornecedor) return res.status(422).json("Nome do fornecedor do insumo deve ser preenchido");


        try {
            await db.query(
                `INSERT INTO insumos(nome, tipo, unidade_medida, quantidade_estoque, custo_por_unidade, fornecedor_nome, observacoes)
                VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [nome, tipo, medida, qtd_estoque, custo_por_unidade, fornecedor, observacoes]
            );

            res.status(201).json("Novo insumo cadastrado com sucesso");
        } catch (error) {
            console.log(error);
        } 
    }

    async alteraRegistro(req, res) {
        res.status(200).json("Rota altera totalmente insumo");
    }

    async alteraCampo(req, res) {
        res.status(200).json("Rota altera parcialmente insumo");
    }
    
    async deletaInsumo(req, res) {
        const id = req.params.id;
        

        try {
            const require = await db.query("SELECT * FROM insumos WHERE insumo_id = $1", [id]);

            const insumo = require.rows;

            if(insumo.length === 0) return res.status(404).json("Nenhum insumo encontrado");

            await db.query("DELETE FROM insumos WHERE insumo_id = $1", [id]);

            res.status(200).json("Insumo deletado com sucesso");
        } catch (error) {
            console.log(error);
        }
    }
      
}

export default InsumoController;