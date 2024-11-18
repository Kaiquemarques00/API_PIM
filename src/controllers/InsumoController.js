import db from "../config/db.js";

class InsumoController {
    async buscaInsumos(req, res) {
        try {
            const require = await db.query("SELECT * FROM insumos ORDER BY insumo_id ASC");
      
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
        if(typeof nome !== "string") return res.status(422).json("O campo NOME deve ser um texto");

        if(!tipo) return res.status(422).json("Tipo do insumo deve ser preenchido");
        if(typeof tipo !== "string") return res.status(422).json("O campo TIPO deve ser um texto");

        if(!medida) return res.status(422).json("Unidade de medida do insumo deve ser preenchido/a");
        if(typeof medida !== "string") return res.status(422).json("O campo UNIDADE DE MEDIDA deve ser um texto");

        if(!qtd_estoque && typeof qtd_estoque !== 'number') return res.status(422).json("Quantidade em estoque do insumo deve ser preenchido/a");
        if(typeof qtd_estoque !== "number") return res.status(422).json("O campo QUANTIDADE ESTOQUE deve ser um número");

        if(!custo_por_unidade) return res.status(422).json("Custo por unidade do insumo deve ser preenchido");
        if(typeof custo_por_unidade !== "number") return res.status(422).json("O campo CUSTO POR UNIDADE deve ser um número");

        if(!fornecedor) return res.status(422).json("Nome do fornecedor do insumo deve ser preenchido");
        if(typeof fornecedor !== "string") return res.status(422).json("O campo FORNECEDOR deve ser um texto");

        try {
            const checaFornecedor = await db.query(`SELECT nome FROM fornecedores WHERE nome = $1`, [fornecedor]);

            const fornecedorCheck = checaFornecedor.rows;

            if(fornecedorCheck.length === 0) return res.status(422).json("Fornecedor não existe");

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
        const id = req.params.id;
        const { nome, tipo, medida, qtd_estoque, custo_por_unidade, fornecedor, observacoes } = req.body;

        if (!nome) return res.status(422).json("Nome do insumo deve ser preenchido");
        if (typeof nome !== "string") return res.status(422).json("O campo NOME deve ser um texto");

        if(!tipo) return res.status(422).json("Tipo do insumo deve ser preenchido");
        if (typeof tipo !== "string") return res.status(422).json("O campo TIPO deve ser um texto");

        if(!medida) return res.status(422).json("Unidade de medida do insumo deve ser preenchido/a");
        if (typeof medida !== "string") return res.status(422).json("O campo UNIDADE DE MEDIDA deve ser um texto");

        if(!qtd_estoque && typeof qtd_estoque !== 'number') return res.status(422).json("Quantidade em estoque do insumo deve ser preenchido/a");
        if (typeof qtd_estoque !== "number") return res.status(422).json("O campo QUANTIDADE ESTOQUE deve ser um número");

        if(!custo_por_unidade) return res.status(422).json("Custo por unidade do insumo deve ser preenchido");
        if (typeof custo_por_unidade !== "number") return res.status(422).json("O campo CUSTO POR UNIDADE deve ser um número");

        if(!fornecedor) return res.status(422).json("Nome do fornecedor do insumo deve ser preenchido");
        if (typeof fornecedor !== "string") return res.status(422).json("O campo FORNECEDOR deve ser um texto");

        try {
            const checaFornecedor = await db.query(`SELECT nome FROM fornecedores WHERE nome = $1`, [fornecedor]);

            const fornecedorCheck = checaFornecedor.rows;

            if(fornecedorCheck.length === 0) return res.status(404).json("Fornecedor não existe");
    
            const alteraInsumo = await db.query(
                "UPDATE insumos SET nome = $1, tipo = $2, unidade_medida = $3, quantidade_estoque = $4, custo_por_unidade = $5, fornecedor_nome = $6, observacoes = $7 WHERE insumo_id = $8 RETURNING *",
                [nome, tipo, medida, qtd_estoque, custo_por_unidade, fornecedor, observacoes, id]
            );

            if (alteraInsumo.rows.length === 0) return res.status(404).json("Insumo não encontrado");
        
            res.status(200).json("Insumo alterado com sucesso");
          } catch (error) {
            console.log(error);
          }
    }

    async alteraCampo(req, res) {
        const id = req.params.id;

        const { nome, tipo, medida, qtd_estoque, custo_por_unidade, fornecedor, observacoes } = req.body;

        if (nome) if (typeof nome !== "string") return res.status(422).json("O campo NOME deve ser um texto");
        if (tipo) if (typeof tipo !== "string") return res.status(422).json("O campo TIPO deve ser um texto");
        if (medida) if (typeof medida !== "string") return res.status(422).json("O campo UNIDADE DE MEDIDA deve ser um texto");
        if (qtd_estoque) if (typeof qtd_estoque !== "number") return res.status(422).json("O campo QUANTIDADE ESTOQUE deve ser um número");
        if (custo_por_unidade) if (typeof custo_por_unidade !== "number") return res.status(422).json("O campo CUSTO POR UNIDADE deve ser um número");
        if (fornecedor) if (typeof fornecedor !== "string") return res.status(422).json("O campo FORNECEDOR deve ser um texto");

        const dadosParaAtualizarInsumo = {};
        if (nome) dadosParaAtualizarInsumo.nome = nome;
        if (tipo) dadosParaAtualizarInsumo.tipo = tipo;
        if (medida) dadosParaAtualizarInsumo.unidade_medida = medida;
        if (qtd_estoque) dadosParaAtualizarInsumo.quantidade_estoque = qtd_estoque;
        if (custo_por_unidade) dadosParaAtualizarInsumo.custo_por_unidade = custo_por_unidade;
        if (fornecedor) {
            try {
                const checaFornecedor = await db.query(`SELECT nome FROM fornecedores WHERE nome = $1`, [fornecedor]);
                const fornecedorCheck = checaFornecedor.rows;
                if(fornecedorCheck.length === 0) return res.status(404).json("Fornecedor não existe");
            } catch (error) {
                console.log(error);
            }
            dadosParaAtualizarInsumo.fornecedor_nome = fornecedor;
        }
        if (observacoes) dadosParaAtualizarInsumo.observacoes = observacoes;
    
        if (Object.keys(dadosParaAtualizarInsumo).length === 0)
          return res.status(400).json("Nenhum campo para atualizar");
    
        const campos = Object.keys(dadosParaAtualizarInsumo);
        const valores = Object.values(dadosParaAtualizarInsumo);
    
        const setClausula = campos.map((campo, index) => `${campo} = $${index + 1}`).join(', ');
    
        try {

            const result = await db.query(
                `UPDATE insumos SET ${setClausula} WHERE insumo_id = $${campos.length + 1} RETURNING *`,
                [...valores, id]
            );
      
            if (result.rows.length === 0) return res.status(404).json('Insumo não existe');
    
            res.status(200).json("Insumo alterado com sucesso");
        } catch (error) {
            console.log(error);
        }
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