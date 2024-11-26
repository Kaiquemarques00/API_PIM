import db from "../config/db.js";

class PedidoVendaController {
    async buscaPedidos(req, res) {
        try {
            const require = await db.query("SELECT * FROM pedidos ORDER BY pedido_id ASC");
      
            const pedidos = require.rows;
  
            if (pedidos.length === 0) return res.status(404).json("Nenhum pedido encontrado");
      
            res.status(200).json(pedidos);
          } catch (error) {
            console.log(error);
            res.status(422).json("Erro ao acessar banco de dados");
          }
    }

    async buscaPedido(req, res) {
        const id = req.params.id;
        
        try {
            const require = await db.query("SELECT * FROM pedidos WHERE pedido_id = $1", [id]);

            const pedido = require.rows;

            if(pedido.length === 0) return res.status(404).json("Nenhum pedido encontrado");

            res.status(200).json(pedido)
        } catch (error) {
            console.log(error);
        }
    }

    async criaPedido(req, res) {
        const { status, usuario_id, observacoes } = req.body;
        const { cultura, quantidade, preco_unitario } = req.body;

        if(!usuario_id) return res.status(422).json("Id do usuário deve ser preenchido");
        if(typeof usuario_id !== "number") return res.status(422).json("O campo USUARIO ID deve ser um número");

        if(!status) return res.status(422).json("Status do plantio deve ser preenchido");
        if(typeof status !== "string") return res.status(422).json("O campo STATUS deve ser um texto");

        const statusFormat = status.charAt(0).toUpperCase() + status.slice(1);
        if (statusFormat != "Pendente" && statusFormat != "Em andamento" && statusFormat != "Concluido") return res.status(422).json("Campo que faz referência ao status do pedido incorreto");
        
        const dataAtual = new Date();
        
        try {
            const checaUsuario = await db.query("SELECT * FROM usuarios WHERE usuario_id = $1", [usuario_id]);
            const usuarioResult = checaUsuario.rows;

            if(usuarioResult.length === 0) return res.status(404).json("Usuário não existe");

            const checaCultura = await db.query("SELECT nome FROM culturas WHERE nome = $1", [cultura]);
            const culturaResult = checaCultura.rows;

            if(culturaResult.length === 0) return res.status(404).json("Cultura não existe");

                if(!quantidade) return res.status(422).json("Quantidade deve ser preenchido");
                if(typeof quantidade !== "number") return res.status(422).json("O campo QUANTIDADE deve ser um número");

                if(!preco_unitario) return res.status(422).json("Preço deve ser preenchido");
                if(typeof preco_unitario !== "number") return res.status(422).json("O campo PREÇO UNITÁRIO deve ser um número");  

                try {
                    await db.query(
                        `INSERT INTO produtos_vendidos(pedido_id, cultura_nome, quantidade, preco_unitario)
                        VALUES($1, $2, $3, $4) RETURNING *`,
                        [pedido.pedido_id, cultura, quantidade, preco_unitario]
                    );
                } catch (error) {
                    console.log(error);
                }

                res.status(201).json("Novo produto vendido cadastrado com sucesso");
            }
        } catch (error) {
            console.log(error);
        }
    }

    async alteraCampo(req, res) {
        const id = req.params.id;
        const { status, usuario_id, observacoes } = req.body;
        const { cultura, quantidade, preco_unitario } = req.body;

        if (status) if(typeof status !== "string") return res.status(422).json("O campo STATUS deve ser um texto");
        if (usuario_id) if(typeof usuario_id !== "number") return res.status(422).json("O campo USUÁRIO ID deve ser um número");

        if (cultura) if(typeof cultura !== "string") return res.status(422).json("O campo CULTURA deve ser um texto");
        if (quantidade) if(typeof quantidade !== "number") return res.status(422).json("O campo QUANTIDADE deve ser um número");
        if (preco_unitario) if(typeof preco_unitario !== "number") return res.status(422).json("O campo PREÇO UNITÁRIO deve ser um número");

        const dadosParaAtualizarPedido = {};
        if (status) dadosParaAtualizarPedido.status = status;
        if (usuario_id) {
            try {
                const checaUsuario = await db.query("SELECT * FROM usuarios WHERE usuario_id = $1", [usuario_id]);
                const usuarioResult = checaUsuario.rows;

                if(usuarioResult.length === 0) return res.status(404).json("Usuário não existe");
            } catch (error) {
                console.log(error);
            }
            dadosParaAtualizarPedido.usuario_id = usuario_id;
        }
        if (cultura) {
            try {
                const checaCultura = await db.query("SELECT nome FROM culturas WHERE nome = $1", [cultura]);
                const culturaResult = checaCultura.rows;
    
                if(culturaResult.length === 0) return res.status(404).json("Cultura não existe");

                dadosParaAtualizarPedido.cultura_nome = cultura;
            } catch (error) {
                console.log(error);
            }
        }
        if (quantidade) dadosParaAtualizarPedido.quantidade = quantidade;
        if (preco_unitario) dadosParaAtualizarPedido.preco_unitario = preco_unitario;
        if (observacoes) dadosParaAtualizarPedido.observacoes = observacoes;

        if (Object.keys(dadosParaAtualizarPedido).length === 0) return res.status(400).json("Nenhum campo do fornecedor para atualizar");
    
            const camposPedido = Object.keys(dadosParaAtualizarPedido);
            const valoresPedidos = Object.values(dadosParaAtualizarPedido);
            const setClauseOrders = camposPedido
              .map((campo, index) => `${campo} = $${index + 1}`)
              .join(", ");
    
        try {

            
            const resultPedido = await db.query(
                `UPDATE pedidos SET ${setClauseOrders} WHERE pedido_id = $${
                    camposPedido.length + 1
                } RETURNING *`,
                [...valoresPedidos, id]
            );

            if (resultPedido.rows.length === 0) return res.status(200).json("Pedido não existe")
    
            res.status(200).json("Pedido alterado com sucesso");
        } catch (error) {
            console.log(error);
        }
    }
    
    async deletaPedido(req, res) {
        const id = req.params.id;    

        try {
            const require = await db.query("SELECT * FROM pedidos WHERE pedido_id = $1", [id]);

            const pedido = require.rows;

            if(pedido.length === 0) return res.status(404).json("Nenhum pedido encontrado");

            await db.query("DELETE FROM pedidos WHERE pedido_id = $1", [id]);

            res.status(200).json("Pedido deletado com sucesso");
        } catch (error) {
            console.log(error);
        }
    }
}

export default PedidoVendaController;