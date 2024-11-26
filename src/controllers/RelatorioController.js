import db from "../config/db.js";

class RelatorioController {
    async vendasPorPeriodo(req, res) {
        const { mesI, mesF } = req.query;

        if(!mesI) return res.status(422).json("Mês inicial deve ser preenchido");
        if(!mesF) return res.status(422).json("Mês final deve ser preenchido");
        
        try {
            const consultaPedidosMes = await db.query(`SELECT * FROM pedidos
                                                    WHERE data_pedido >= '2024-${mesI}-01' AND data_pedido < '2024-${mesF}-01' AND status = 'Concluido'
                                                    ORDER BY pedido_id ASC`);

            res.status(200).json(consultaPedidosMes.rows);
        } catch (error) {
            console.log(error);
        }
    }

    async vendasPorCultura(req, res) {
        
        try {
            const consultaQuantidadePedidos = await db.query(`
                SELECT cultura_nome, COUNT(*) as frequencia
                FROM pedidos
                GROUP BY cultura_nome
                ORDER BY frequencia DESC;
            `);

            res.status(200).json(consultaQuantidadePedidos.rows);
        } catch (error) {
            console.log(error);
        }
    }

    async vendasReceitaTotal(req, res) {
        
        try {
            const pedidosResult = await db.query("SELECT * FROM pedidos");

            const consultaQuantidadePedidos = await db.query(`
                SELECT p.pedido_id, p.cultura_nome, p.preco_unitario, SUM(p.quantidade) AS total_vendido,
                    SUM(p.quantidade * p.preco_unitario) AS pedido_total
                FROM pedidos p
                GROUP BY p.pedido_id, p.cultura_nome, p.preco_unitario
                ORDER BY pedido_total DESC
                LIMIT $1;
            `, [pedidosResult.rows.length]);

            const consultaReceitaTotal = await db.query(`
                    SELECT SUM(p.quantidade * p.preco_unitario) AS receita_total
                    FROM pedidos p
                    WHERE status = 'Concluido'
                `)
            

            res.status(200).json({
                pedidos: consultaQuantidadePedidos.rows,
                receita_total: consultaReceitaTotal.rows[0]
            });
        } catch (error) {
            console.log(error);
        }
    }

    async plantiosPorPeriodo(req, res) {
        const { mesI, mesF } = req.query;

        if(!mesI) return res.status(422).json("Mês inicial deve ser preenchido");
        if(!mesF) return res.status(422).json("Mês final deve ser preenchido");
        
        try {
            const consultaPlantiosMes = await db.query(`SELECT * FROM plantios
                                                    WHERE data_inicio >= '2024-${mesI}-01' AND data_inicio < '2024-${mesF}-01'
                                                    ORDER BY plantio_id ASC`);

            res.status(200).json(consultaPlantiosMes.rows);
        } catch (error) {
            console.log(error);
        }
    }

    async culturasPorPlantio(req, res) {
        
        try {
            const consultaQuantidadeCulturas = await db.query(`
                SELECT cultura_nome, COUNT(*) as frequencia
                FROM plantios
                GROUP BY cultura_nome
                ORDER BY frequencia DESC;
            `);

            res.status(200).json(consultaQuantidadeCulturas.rows);
        } catch (error) {
            console.log(error);
        }
    }

    async statusPorPlantio(req, res) {
        
        try {
            const consultaStatusPlantios = await db.query(`
                SELECT status, COUNT(*) as frequencia
                FROM plantios
                GROUP BY status
                ORDER BY frequencia DESC;
            `);

            res.status(200).json(consultaStatusPlantios.rows);
        } catch (error) {
            console.log(error);
        }
    }

    async colheitaPorPeriodo(req, res) {
        const { mesI, mesF } = req.query;

        if(!mesI) return res.status(422).json("Mês inicial deve ser preenchido");
        if(!mesF) return res.status(422).json("Mês final deve ser preenchido");
        
        try {
            const consultaColheitaMes = await db.query(`SELECT * FROM colheitas
                                                    WHERE data_colheita >= '2024-${mesI}-01' AND data_colheita < '2024-${mesF}-01'
                                                    ORDER BY plantio_id ASC`);

            res.status(200).json(consultaColheitaMes.rows);
        } catch (error) {
            console.log(error);
        }
    }

    async InsumosPorFornecedor(req, res) {
        try {
            const consultaInsumosFornecedores = await db.query(`
                SELECT fornecedor_nome, COUNT(*) as frequencia
                FROM insumos
                GROUP BY fornecedor_nome
                ORDER BY frequencia DESC;
            `);
    
            res.status(200).json(consultaInsumosFornecedores.rows);
        } catch (error) {
            console.log(error);
        }
    }
}

export default RelatorioController;