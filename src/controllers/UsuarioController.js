import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UsuarioController {
  async buscaUsuariosArquivados(req, res) {
    try {
      /* Consulta banco de dados */
      const require = await db.query(
        "SELECT * FROM usuarios_arquivados ORDER BY usuario_id ASC"
      );

      /* Armazena retorno da consulta do banco de dados */
      const usuariosArquivados = require.rows;

      res.status(200).json(usuariosArquivados);
    } catch (error) {
      console.log(error);
    }
  }

  async buscaUsuarioArquivado(req, res) {
    const id = req.params.id;

    try {
      /* Consulta no banco de dados o ID da requisição */
      const require = await db.query(
        "SELECT usuario_id, nome, email, tipo_usuario, data_arquivacao FROM usuarios_arquivados WHERE usuario_id = $1",
        [id]
      );

      /* Armazena retorno da consulta do banco de dados */
      const usuarioArquivado = require.rows;

      /* Verifica se o usuário existe ou não através do feedback da consulta */
      if (!usuarioArquivado.length > 0)
        return res.status(404).json("Usuário não encontrado");

      /* Feedback de sucesso */
      res.status(200).json(usuarioArquivado);
    } catch (error) {
      console.log(error);
    }
  }

  async buscaUsuarios(req, res) {
    try {
      const require = await db.query(
        "SELECT * FROM usuarios ORDER BY usuario_id ASC"
      );

      const usuarios = require.rows;

      if (!usuarios) return res.status(422).json("Requisição Não feita");

      res.status(200).json(usuarios);
    } catch (error) {
      console.log(error);
    }
  }

  async buscaUsuario(req, res) {
    const id = req.params.id;

    try {
      const require = await db.query(
        "SELECT usuario_id, nome, email, tipo_usuario, data_criacao FROM usuarios WHERE usuario_id = $1",
        [id]
      );

      const usuario = require.rows;

      if (!usuario.length > 0)
        return res.status(404).json("Usuário não encontrado");

      res.status(200).json(usuario);
    } catch (error) {
      console.log(error);
    }
  }

  async criaUsuario(req, res) {
    /* Desestrutura o JSON da requisição e separa seus dados */
    const { nome, email, senha, role } = req.body;

    try {
      //if (!nome || !email || !senha || !role) return res.status(422).json("Campos obrigatórios faltando");
      // Verifica se campos estão vazios
      if (!nome) return res.status(422).json("Nome deve ser preenchido");
      if (!email) return res.status(422).json("Email deve ser preenchido");
      if (!senha) return res.status(422).json("Senha deve ser preenchido");
      if (!role)
        return res.status(422).json("Tipo de usuário deve ser preenchido");

      /* Verifica se entradas são do tipo esperado */
      if (typeof nome !== "string")
        return res.status(422).json("O campo NOME deve ser um texto");
      if (typeof email !== "string")
        return res.status(422).json("O campo EMAIL deve ser um texto");
      if (typeof senha !== "string")
        return res.status(422).json("O campo SENHA deve ser um texto");
      if (typeof role !== "string")
        return res.status(422).json("O campo TIPO USUÁRIO deve ser um texto");

      // Verifica definição da senha
      if (senha.length < 8)
        return res.status(422).json("A senha deve ter mais de 8 caracteres");

      // Formata para a primeira letra do tipo de usuario ser maiuscula
      const roleFormat = role.charAt(0).toUpperCase() + role.slice(1);
      const emailFormat = email.charAt(0).toUpperCase() + email.slice(1);

      // Verifica se os tipos de usuarios correspondem aos tipos pré definidos
      if (
        roleFormat != "Administrador" &&
        roleFormat != "Funcionario"
      )
        return res
          .status(422)
          .json("Campo que faz referência ao nivel de usuário incorreto");

      // Consulta no banco de dados através do email
      const checkUsuarioExiste = await db.query(
        "SELECT * FROM usuarios WHERE email = $1",
        [emailFormat]
      );

      // Verifica se o usuário que vai ser criado já existe
      if (checkUsuarioExiste.rows.length > 0)
        return res.status(422).json("Usuário já existe");

      // Formata senha criptografa a mesma
      const salt = bcrypt.genSaltSync(10);
      const hashedSenha = bcrypt.hashSync(senha, salt);

      // Cria usuário no banco de dados
      await db.query(
        "INSERT INTO usuarios(nome, email, senha, tipo_usuario) VALUES ($1, $2, $3, $4)",
        [String(nome), String(emailFormat), hashedSenha, String(roleFormat)]
      );

      // Feedback de sucesso
      res.status(201).json("Usuário criado com sucesso");
    } catch (error) {
      console.log(error);
    }
  }

  async arquivaUsuario(req, res) {
    const id = req.params.id;

    try {
      // Consulta usuario da requisição do ID no banco de dados
      const consultaUsuario = await db.query(
        "SELECT * FROM usuarios WHERE usuario_id = $1",
        [id]
      );

      // Armazena retorno da consulta
      const usuario = consultaUsuario.rows;

      // Verifica se usuário foi encontrado
      if (!usuario.length > 0)
        return res.status(404).json("Usuário não encontrado");

      // Verifica se tabela de usuarios arquivados existe
      const check = await db.query(
        "SELECT EXISTS ( SELECT FROM pg_tables WHERE tablename = 'usuarios_arquivados')"
      );

      // Cria tabela de usuarios arquivados
      if (!check.rows[0].exists) {
        try {
          await db.query(`CREATE TABLE usuarios_arquivados(
              usuario_id INT PRIMARY KEY,
              nome VARCHAR(100) NOT NULL,
              email VARCHAR(100) NOT NULL UNIQUE,
              senha VARCHAR(100) NOT NULL,
              tipo_usuario VARCHAR(30) NOT NULL CHECK (tipo_usuario IN ('Administrador', 'Gerente', 'Funcionario')),
              data_arquivacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);
        } catch (error) {
          console.log(error);
        }
      }

      // Insere usuario em tabela de usuario arquivado
      await db.query(
        "INSERT INTO usuarios_arquivados (usuario_id, nome, email, senha, tipo_usuario) VALUES ( $1, $2, $3, $4, $5 )",
        [
          usuario[0].usuario_id,
          usuario[0].nome,
          usuario[0].email,
          usuario[0].senha,
          usuario[0].tipo_usuario,
        ]
      );

      // Deleta usuario da tabela usuario
      await db.query("DELETE FROM usuarios WHERE usuario_id = $1", [id]);

      // Feedback de sucesso
      res.status(200).json("Usuário arquivado com sucesso");
    } catch (error) {
      console.log(error);
    }
  }

  async alteraRegistro(req, res) {
    const id = req.params.id;

    const { nome, email, senha, role } = req.body;

    try {
      //if (!nome || !email || !senha || !role) return res.status(422).json("Campos obrigatórios faltando");
      // Verifica se campos foram preenchidos
      if (!nome) return res.status(422).json("Nome deve ser preenchido");
      if (!email) return res.status(422).json("Email deve ser preenchido");
      if (!senha) return res.status(422).json("Senha deve ser preenchido");
      if (!role)
        return res.status(422).json("Tipo de usuário deve ser preenchido");

      // Verifica se campos tem o tipo de dado certo
      if (typeof nome !== "string")
        return res.status(422).json("O campo NOME deve ser um texto");
      if (typeof email !== "string")
        return res.status(422).json("O campo EMAIL deve ser um texto");
      if (typeof senha !== "string")
        return res.status(422).json("O campo SENHA deve ser um texto");
      if (typeof role !== "string")
        return res.status(422).json("O campo TIPO USUÁRIO deve ser um texto");

      // Verifica tamanho da senha
      if (senha.length < 8)
        return res.status(422).json("A senha deve ter mais de 8 caracteres");

      // Formata dados de tipo de usuario
      const roleFormat = role.charAt(0).toUpperCase() + role.slice(1);
      const emailFormat = email.charAt(0).toUpperCase() + email.slice(1);

      // Verifica se tipo de usuario esta correto
      if (
        roleFormat != "Administrador" &&
        roleFormat != "Funcionario"
      )
        return res
          .status(422)
          .json("Campo que faz referência ao nivel de usuário incorreto");

      // Consulta usuario no banco pelo email
      const checkUsuarioExiste = await db.query(
        "SELECT * FROM usuarios WHERE email = $1",
        [emailFormat]
      );

      // Verifica se email ja foi cadastrado
      if (checkUsuarioExiste.rows.length > 0)
        return res.status(422).json("Usuário já existe");

      // Criptografa senha
      const salt = bcrypt.genSaltSync(10);
      const hashedSenha = bcrypt.hashSync(senha, salt);

      // Atualiza usuario no banco de dados
      await db.query(
        "UPDATE usuarios SET nome = $1, email = $2, senha = $3, tipo_usuario = $4 WHERE usuario_id = $5",
        [nome, emailFormat, hashedSenha, roleFormat, id]
      );

      // Mensagem de feedback
      res.status(200).json("Usuário alterado com sucesso");
    } catch (error) {
      console.log(error);
    }
  }

  async alteraCampo(req, res) {
    const id = req.params.id;
    let hashedSenha;
    let roleFormat;
    let emailFormat;

    const { nome, email, senha, role } = req.body;

    if (nome)
      if (typeof nome !== "string")
        return res.status(422).json("O campo NOME deve ser um texto");
    if (email)
      if (typeof email !== "string")
        return res.status(422).json("O campo EMAIL deve ser um texto");
    if (senha)
      if (typeof senha !== "string")
        return res.status(422).json("O campo SENHA deve ser um texto");
    if (role)
      if (typeof role !== "string")
        return res.status(422).json("O campo TIPO USUÁRIO deve ser um texto");

    if (role) {
      roleFormat = role.charAt(0).toUpperCase() + role.slice(1);
    }

    if (email) {
      emailFormat = email.charAt(0).toUpperCase() + email.slice(1);
    }

    if (senha) {
      if (senha.length < 8)
        return res.status(422).json("A senha deve ter mais de 8 caracteres");

      const salt = bcrypt.genSaltSync(10);

      hashedSenha = bcrypt.hashSync(senha, salt);
    }

    if (role && roleFormat) {
      if (roleFormat != "Administrador" && roleFormat != "Funcionario")
        return res
          .status(422)
          .json("Campo que faz referência ao nivel de usuário incorreto");
    }


    // Cria um objeto que recebe o dado que estiver preenchido para atualização
    const dadosParaAtualizar = {};
    if (nome) dadosParaAtualizar.nome = nome;
    if (emailFormat) dadosParaAtualizar.email = emailFormat;
    if (senha) dadosParaAtualizar.senha = hashedSenha;
    if (role) dadosParaAtualizar.tipo_usuario = roleFormat;

    // Verifica se há algum dado para atualizar
    if (Object.keys(dadosParaAtualizar).length === 0)
      return res.status(400).json("Nenhum campo para atualizar");

    // Desestrutura objeto para atualização
    const campos = Object.keys(dadosParaAtualizar);
    const valores = Object.values(dadosParaAtualizar);

    // Função para percorrer o objeto
    const setClausula = campos
      .map((campo, index) => `${campo} = $${index + 1}`)
      .join(", ");

    try {
      // consulta usuario
      const checkUserExists = await db.query(
        "SELECT * FROM usuarios WHERE email = $1",
        [emailFormat]
      );

      if (checkUserExists.rows.length > 0)
        return res.status(422).json("Usuário já existe");

      // Atualiza usuario de acordo com dado preenchido
      const result = await db.query(
        `UPDATE usuarios SET ${setClausula} WHERE usuario_id = $${
          campos.length + 1
        } RETURNING *`,
        [...valores, id]
      );

      if (result.rows.length === 0)
        return res.status(404).json("Usuário não existe");

      res.status(200).json("Usuário alterado com sucesso");
    } catch (error) {
      console.log(error);
    }
  }

  async autenticaUsuario(req, res) {
    const { email, senha } = req.body;

    // Verifica se emal e senha foi preenchido
    if (!email) return res.status(422).json("Email é obrigatório");
    if (!senha) return res.status(422).json("Senha é obrigatória");

    const primeiraLetraEmail = email.charAt(0);
    let emailFormatado = email.charAt(0).toUpperCase() + email.slice(1);;
    
    if (primeiraLetraEmail === primeiraLetraEmail.toLowerCase()) {
      emailFormatado = email.charAt(0).toUpperCase() + email.slice(1);
    }

    // Consulta usuario
    const checkUsuario = await db.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [emailFormatado]
    );

    // Verifica se usuario existe
    if (!checkUsuario.rows.length > 0)
      return res.status(404).json("Usuário não encontrado");

    // Armazena usuario se existir
    const usuario = checkUsuario.rows[0];

    // Checa se a senha está certa
    const checkSenha = await bcrypt.compare(senha, usuario.senha);

    if (!checkSenha) return res.status(422).json("Senha incorreta");

    try {
      const secret = process.env.SECRET;

      // Cria token
      const token = jwt.sign(
        {
          id: usuario.usuario_id,
          role: usuario.tipo_usuario,
        },
        secret,
        {
          expiresIn: 86400,
        }
      );

      res.status(200).json({ token: token });
    } catch (error) {
      console.log(error);
    }
  }
}

export default UsuarioController;
