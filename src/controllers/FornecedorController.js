import db from "../config/db.js";

class FornecedorController {
  async buscaFornecedores(req, res) {
    try {
      const require = await db.query(`
              SELECT fornecedor_id, nome, cnpj, email, telefone, rua, numero, bairro, cidade, estado, cep, observacoes
              FROM fornecedores
              INNER JOIN fornecedores_endereco ON fornecedores.fornecedor_id = fornecedores_endereco.id
              ORDER BY fornecedor_id ASC
            `);

      const suppliers = require.rows;

      if (suppliers.length === 0)
        return res.status(404).json("Nenhum fornecedor encontrado");

      res.status(200).json(suppliers);
    } catch (error) {
      console.log(error);
      res.status(422).json("Erro ao acessar banco de dados");
    }
  }

  async buscaFornecedor(req, res) {
    const id = req.params.id;

    try {
      const require = await db.query(
        `
          SELECT fornecedor_id, nome, cnpj, email, telefone, rua, numero, bairro, cidade, estado, cep, observacoes
          FROM fornecedores
          INNER JOIN fornecedores_endereco ON fornecedores.fornecedor_id = fornecedores_endereco.id
          WHERE fornecedores.fornecedor_id = $1
        `,
        [id]
      );

      if (require.rows.length < 1)
        return res.status(404).json("Fornecedor não existe");

      res.status(200).json(require.rows);
    } catch (error) {
      console.log(error);
      res.status(422).json("Erro ao acessar banco de dados");
    }
  }

  async buscaFornecedoresArquivados(req, res) {
    try {
      const require = await db.query("SELECT * FROM fornecedores_arquivados");

      if (require.rows.length === 0)
        return res.status(422).json("Nenhum fornecedor arquivado encontrado");

      res.status(200).json(require.rows);
    } catch (error) {
      console.log(error);
    }
  }

  async buscaFornecedorArquivado(req, res) {
    const id = req.params.id;

    try {
      const require = await db.query(
        "SELECT * FROM fornecedores_arquivados WHERE fornecedor_id = $1",
        [id]
      );

      if (require.rows.length === 0)
        return res.status(404).json("Fornecedor não encontrado");

      res.status(200).json(require.rows);
    } catch (error) {
      console.log(error);
    }
  }

  async criaFornecedor(req, res) {
    const { nome, cnpj, telefone, email, observacoes } = req.body;
    const { rua, numero, bairro, cidade, estado, cep } = req.body;

    /* Gerenciamento de erro para cadastro do fornecedor */
    if (!nome)
      return res.status(422).json("Nome do fornecedor deve ser preenchido");
    if (!cnpj)
      return res.status(422).json("CNPJ do fornecedor deve ser preenchido");
    if (!telefone)
      return res.status(422).json("Telefone do fornecedor deve ser preenchido");
    if (!email)
      return res.status(422).json("Email do fornecedor deve ser preenchido");
    /* Gerenciamento de erro para cadastro de endereço do fornecedor */
    if (!rua)
      return res.status(422).json("Rua do fornecedor deve ser preenchido");
    if (!numero)
      return res.status(422).json("Número do fornecedor deve ser preenchido");
    if (!bairro)
      return res.status(422).json("Bairro do fornecedor deve ser preenchido");
    if (!cidade)
      return res.status(422).json("Cidade do fornecedor deve ser preenchido");
    if (!estado)
      return res.status(422).json("Estado do fornecedor deve ser preenchido");
    if (!cep)
      return res.status(422).json("CEP do fornecedor deve ser preenchido");

    if (typeof nome !== "string")
      return res.status(422).json("O campo NOME deve ser um texto");
    if (typeof cnpj !== "string")
      return res.status(422).json("O campo CNPJ deve ser um texto");
    if (typeof telefone !== "string")
      return res.status(422).json("O campo TELEFONE deve ser um texto");
    if (typeof email !== "string")
      return res.status(422).json("O campo EMAIL deve ser um texto");

    if (typeof rua !== "string")
      return res.status(422).json("O campo RUA deve ser um texto");
    if (typeof numero !== "number")
      return res.status(422).json("O campo NÚMERO deve ser um número");
    if (typeof bairro !== "string")
      return res.status(422).json("O campo BAIRRO deve ser um texto");
    if (typeof cidade !== "string")
      return res.status(422).json("O campo CIDADE deve ser um texto");
    if (typeof estado !== "string")
      return res.status(422).json("O campo ESTADO deve ser um texto");
    if (typeof cep !== "string")
      return res.status(422).json("O campo CEP deve ser um texto");

    try {
      const require = await db.query(
        "SELECT * FROM fornecedores WHERE cnpj = $1",
        [cnpj]
      );

      if (require.rows.length > 0)
        return res.status(409).json("Fornecedor já cadastrado");

      const fornecedor = await db.query(
        "INSERT INTO fornecedores(nome, cnpj, email, telefone, observacoes) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [nome, cnpj, email, telefone, observacoes]
      );

      const fornecedorID = fornecedor.rows[0].fornecedor_id;

      await db.query(
        "INSERT INTO fornecedores_endereco(id, rua, numero, bairro, cidade, estado, CEP) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [fornecedorID, rua, numero, bairro, cidade, estado, cep]
      );

      res.status(201).json("Novo fornecedor cadastrado com sucesso");
    } catch (error) {
      console.log(error);
      res.status(422).json("Erro ao acessar banco de dados");
    }
  }

  async alteraRegistro(req, res) {
    const id = req.params.id;

    const { nome, cnpj, telefone, email, observacoes } = req.body;
    const { rua, numero, bairro, cidade, estado, cep } = req.body;

    /* Gerenciamento de erro para cadastro do fornecedor */
    if (!nome)
      return res.status(422).json("Nome do fornecedor deve ser preenchido");
    if (!cnpj)
      return res.status(422).json("CNPJ do fornecedor deve ser preenchido");
    if (!telefone)
      return res.status(422).json("Telefone do fornecedor deve ser preenchido");
    if (!email)
      return res.status(422).json("Email do fornecedor deve ser preenchido");
    /* Gerenciamento de erro para cadastro de endereço do fornecedor */
    if (!rua)
      return res.status(422).json("Rua do fornecedor deve ser preenchido");
    if (!numero)
      return res.status(422).json("Número do fornecedor deve ser preenchido");
    if (!bairro)
      return res.status(422).json("Bairro do fornecedor deve ser preenchido");
    if (!cidade)
      return res.status(422).json("Cidade do fornecedor deve ser preenchido");
    if (!estado)
      return res.status(422).json("Estado do fornecedor deve ser preenchido");
    if (!cep)
      return res.status(422).json("CEP do fornecedor deve ser preenchido");

    if (typeof nome !== "string")
      return res.status(422).json("O campo NOME deve ser um texto");
    if (typeof cnpj !== "string")
      return res.status(422).json("O campo CNPJ deve ser um texto");
    if (typeof telefone !== "string")
      return res.status(422).json("O campo TELEFONE deve ser um texto");
    if (typeof email !== "string")
      return res.status(422).json("O campo EMAIL deve ser um texto");

    if (typeof rua !== "string")
      return res.status(422).json("O campo RUA deve ser um texto");
    if (typeof numero !== "number")
      return res.status(422).json("O campo NÚMERO deve ser um número");
    if (typeof bairro !== "string")
      return res.status(422).json("O campo BAIRRO deve ser um texto");
    if (typeof cidade !== "string")
      return res.status(422).json("O campo CIDADE deve ser um texto");
    if (typeof estado !== "string")
      return res.status(422).json("O campo ESTADO deve ser um texto");
    if (typeof cep !== "string")
      return res.status(422).json("O campo CEP deve ser um texto");

    try {
      const checkSupplierExists = await db.query(
        "SELECT * FROM fornecedores WHERE fornecedor_id = $1",
        [id]
      );

      if (checkSupplierExists.rows.length === 0)
        return res.status(404).json("Fornecedor não existe");

      const require = await db.query(
        "SELECT * FROM fornecedores WHERE cnpj = $1",
        [cnpj]
      );

      if (require.rows.length > 0)
        return res.status(409).json("Fornecedor com CNPJ já cadastrado");

      await db.query(
        "UPDATE fornecedores SET nome = $1, cnpj = $2, telefone = $3, email = $4, observacoes = $5 WHERE fornecedor_id = $6",
        [nome, cnpj, telefone, email, observacoes, id]
      );

      await db.query(
        "UPDATE fornecedores_endereco SET rua = $1, numero = $2, bairro = $3, cidade = $4, estado = $5, cep = $6 WHERE id = $7",
        [rua, numero, bairro, cidade, estado, cep, id]
      );

      res.status(200).json("Fornecedor alterado com sucesso");
    } catch (error) {
      console.log(error);
    }
  }

  async alteraCampo(req, res) {
    const id = req.params.id;

    const { nome, cnpj, email, telefone, observacoes } = req.body;
    const { rua, numero, bairro, cidade, estado, cep } = req.body;

    if (nome)
      if (typeof nome !== "string")
        return res.status(422).json("O campo NOME deve ser um texto");
    if (cnpj)
      if (typeof cnpj !== "string")
        return res.status(422).json("O campo CNPJ deve ser um texto");
    if (telefone)
      if (typeof telefone !== "string")
        return res.status(422).json("O campo TELEFONE deve ser um texto");
    if (email)
      if (typeof email !== "string")
        return res.status(422).json("O campo EMAIL deve ser um texto");

    if (rua)
      if (typeof rua !== "string")
        return res.status(422).json("O campo RUA deve ser um texto");
    if (numero)
      if (typeof numero !== "number")
        return res.status(422).json("O campo NÚMERO deve ser um número");
    if (bairro)
      if (typeof bairro !== "string")
        return res.status(422).json("O campo BAIRRO deve ser um texto");
    if (cidade)
      if (typeof cidade !== "string")
        return res.status(422).json("O campo CIDADE deve ser um texto");
    if (estado)
      if (typeof estado !== "string")
        return res.status(422).json("O campo ESTADO deve ser um texto");
    if (cep)
      if (typeof cep !== "string")
        return res.status(422).json("O campo CEP deve ser um texto");

    const dadosParaAtualizarFornecedor = {};
    if (nome) dadosParaAtualizarFornecedor.nome = nome;
    if (cnpj) dadosParaAtualizarFornecedor.cnpj = cnpj;
    if (email) dadosParaAtualizarFornecedor.email = email;
    if (telefone) dadosParaAtualizarFornecedor.telefone = telefone;
    if (observacoes) dadosParaAtualizarFornecedor.observacoes = observacoes;

    const dadosParaAtualizarEndereco = {};
    if (rua) dadosParaAtualizarEndereco.rua = rua;
    if (numero) dadosParaAtualizarEndereco.numero = numero;
    if (bairro) dadosParaAtualizarEndereco.bairro = bairro;
    if (cidade) dadosParaAtualizarEndereco.cidade = cidade;
    if (estado) dadosParaAtualizarEndereco.estado = estado;
    if (cep) dadosParaAtualizarEndereco.cep = cep;

    if (
      Object.keys(dadosParaAtualizarFornecedor).length === 0 &&
      Object.keys(dadosParaAtualizarEndereco).length === 0
    )
      return res.status(400).json("Nenhum campo do fornecedor para atualizar");

    const camposFornecedor = Object.keys(dadosParaAtualizarFornecedor);
    const valoresFornecedor = Object.values(dadosParaAtualizarFornecedor);
    const setClauseSupplier = camposFornecedor
      .map((campo, index) => `${campo} = $${index + 1}`)
      .join(", ");

    const camposEndereco = Object.keys(dadosParaAtualizarEndereco);
    const valoresEndereco = Object.values(dadosParaAtualizarEndereco);
    const setClauseAddress = camposEndereco
      .map((campoA, indexA) => `${campoA} = $${indexA + 1}`)
      .join(", ");

    try {
      const checkSupplierExists = await db.query(
        "SELECT * FROM fornecedores WHERE fornecedor_id = $1",
        [id]
      );

      if (checkSupplierExists.rows.length === 0)
        return res.status(404).json("Fornecedor não existe");

      if (cnpj) {
        const checkSupplierExists = await db.query(
          `SELECT * FROM fornecedores WHERE fornecedores.cnpj = $1`,
          [cnpj]
        );

        if (checkSupplierExists.rows.length > 0)
          return res.status(409).json("Fornecedor com CNPJ já cadastrado");
      }

      if (Object.keys(dadosParaAtualizarFornecedor).length > 0) {
        await db.query(
          `UPDATE fornecedores SET ${setClauseSupplier} WHERE fornecedor_id = $${
            camposFornecedor.length + 1
          } RETURNING *`,
          [...valoresFornecedor, id]
        );
      }

      if (Object.keys(dadosParaAtualizarEndereco).length > 0) {
        await db.query(
          `UPDATE fornecedores_endereco SET ${setClauseAddress} WHERE id = $${
            camposEndereco.length + 1
          } RETURNING *`,
          [...valoresEndereco, id]
        );
      }

      res.status(200).json("Fornecedor alterado com sucesso");
    } catch (error) {
      console.log(error);
    }
  }

  async arquivaFornecedor(req, res) {
    const id = req.params.id;

    try {
      const supplierExists = await db.query(
        `
          SELECT fornecedor_id, nome, cnpj, email, telefone, rua, numero, bairro, cidade, estado, cep, observacoes
          FROM fornecedores
          INNER JOIN fornecedores_endereco ON fornecedores.fornecedor_id = fornecedores_endereco.id
          WHERE fornecedores.fornecedor_id = $1
        `,
        [id]
      );
      const supplier = supplierExists.rows;

      if (supplier.length === 0)
        return res.status(404).json("Fornecedor não encontrado");

      const checkTable = await db.query(
        "SELECT EXISTS ( SELECT FROM pg_tables WHERE tablename = 'fornecedores_arquivados')"
      );

      if (!checkTable.rows[0].exists) {
        try {
          await db.query(`CREATE TABLE fornecedores_arquivados(
                fornecedor_id INT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                cnpj VARCHAR(18) NOT NULL UNIQUE,
                telefone VARCHAR(20),
                email VARCHAR(100),
                rua VARCHAR(100),
                numero INT,
                bairro VARCHAR(50), 
                cidade VARCHAR(50), 
                estado VARCHAR(50), 
                cep VARCHAR(30), 
                data_arquivacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              )`);
        } catch (error) {
          console.log(error);
        }
      }

      await db.query(
        "INSERT INTO fornecedores_arquivados (fornecedor_id, nome, cnpj, telefone, email, rua, numero, bairro, cidade, estado, cep) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 )",
        [
          supplier[0].fornecedor_id,
          supplier[0].nome,
          supplier[0].cnpj,
          supplier[0].telefone,
          supplier[0].email,
          supplier[0].rua,
          supplier[0].numero,
          supplier[0].bairro,
          supplier[0].cidade,
          supplier[0].estado,
          supplier[0].cep,
        ]
      );

      await db.query("DELETE FROM fornecedores_endereco WHERE id = $1", [id]);
      await db.query("DELETE FROM fornecedores WHERE fornecedor_id = $1", [id]);

      res.status(200).json("Fornecedor arquivado com sucesso");
    } catch (error) {
      console.log(error);
    }
  }
}

export default FornecedorController;
