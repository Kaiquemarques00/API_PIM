import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UsuarioController {
  async buscaUsuariosArquivados(req, res) {
    try {
      const require = await db.query("SELECT * FROM usuarios_arquivados ORDER BY usuario_id ASC");

      const usuariosArquivados = require.rows;

      res.status(200).json(usuariosArquivados);
    } catch (error) {
      console.log(error);
    }
  }

  async buscaUsuarioArquivado(req, res) {
    const id = req.params.id;

    try {
      const require = await db.query(
        "SELECT usuario_id, nome, email, tipo_usuario, data_arquivacao FROM usuarios_arquivados WHERE usuario_id = $1",
        [id]
      );

      const usuarioArquivado = require.rows;

      if (!usuarioArquivado.length > 0) return res.status(404).json("Usuário não encontrado");

      res.status(200).json(usuarioArquivado);
    } catch (error) {
      console.log(error);
    }
  }

  async buscaUsuarios(req, res) {
    try {
      const require = await db.query("SELECT * FROM usuarios ORDER BY usuario_id ASC");

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

      if (!usuario.length > 0) return res.status(404).json("Usuário não encontrado");

      res.status(200).json(usuario);
    } catch (error) {
      console.log(error);
    }
  }

  async criaUsuario(req, res) {
    
    const { nome, email, senha, role } = req.body;

    try {

      //if (!nome || !email || !senha || !role) return res.status(422).json("Campos obrigatórios faltando");
      if (!nome) return res.status(422).json("Nome deve ser preenchido");
      if (!email) return res.status(422).json("Email deve ser preenchido");
      if (!senha) return res.status(422).json("Senha deve ser preenchido");
      if (!role) return res.status(422).json("Tipo de usuário deve ser preenchido");

      if(senha.length < 8) return res.status(422).json("A senha deve ter mais de 8 caracteres");
  
      const roleFormat = role.charAt(0).toUpperCase() + role.slice(1);
  
      if (roleFormat != "Administrador" && roleFormat != "Gerente" && roleFormat != "Funcionario") return res.status(422).json("Campo que faz referência ao nivel de usuário incorreto");

      const checkUsuarioExiste = await db.query(
        "SELECT * FROM usuarios WHERE email = $1",
        [email]
      );

      if (checkUsuarioExiste.rows.length > 0)
        return res.status(422).json("Usuário já existe");

      const salt = bcrypt.genSaltSync(10);
      const hashedSenha = bcrypt.hashSync(senha, salt);

      await db.query(
        "INSERT INTO usuarios(nome, email, senha, tipo_usuario) VALUES ($1, $2, $3, $4)",
        [String(nome), String(email), hashedSenha, String(roleFormat)]
      );

      res.status(201).json("Usuário criado com sucesso");
    } catch (error) {
      console.log(error);
    }
  }

  async arquivaUsuario(req, res) {
    const id = req.params.id;

    try {
      const consultaUsuario = await db.query("SELECT * FROM usuarios WHERE usuario_id = $1", [id]);
      const usuario = consultaUsuario.rows;

      if(!usuario.length > 0) return res.status(404).json("Usuário não encontrado");

      const check = await db.query("SELECT EXISTS ( SELECT FROM pg_tables WHERE tablename = 'usuarios_arquivados')");

      if (!check.rows[0].exists) {
        try {
          await db.query(`CREATE TABLE usuarios_arquivados(
              usuario_id INT PRIMARY KEY,
              nome VARCHAR(100) NOT NULL,
              email VARCHAR(100) NOT NULL UNIQUE,
              senha VARCHAR(100) NOT NULL,
              tipo_usuario VARCHAR(30) NOT NULL CHECK (tipo_usuario IN ('Administrador', 'Gerente', 'Funcionario')),
              data_arquivacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`)
        } catch (error) {
          console.log(error);
        }
      }

      await db.query("INSERT INTO usuarios_arquivados (usuario_id, nome, email, senha, tipo_usuario) VALUES ( $1, $2, $3, $4, $5 )", [usuario[0].usuario_id, usuario[0].nome, usuario[0].email, usuario[0].senha, usuario[0].tipo_usuario]);
      
      await db.query("DELETE FROM usuarios WHERE usuario_id = $1", [id]);

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
      if (!nome) return res.status(422).json("Nome deve ser preenchido");
      if (!email) return res.status(422).json("Email deve ser preenchido");
      if (!senha) return res.status(422).json("Senha deve ser preenchido");
      if (!role) return res.status(422).json("Tipo de usuário deve ser preenchido");
       
      if(senha.length < 8) return res.status(422).json("A senha deve ter mais de 8 caracteres");

      const roleFormat = role.charAt(0).toUpperCase() + role.slice(1);
      if (roleFormat != "Administrador" && roleFormat != "Gerente" && roleFormat != "Funcionario") return res.status(422).json("Campo que faz referência ao nivel de usuário incorreto");

      const checkUsuarioExiste = await db.query(
        "SELECT * FROM usuarios WHERE email = $1",
        [email]
      );

      if (checkUsuarioExiste.rows.length > 0)
        return res.status(422).json("Usuário já existe");

      const salt = bcrypt.genSaltSync(10);

      const hashedSenha = bcrypt.hashSync(senha, salt);

      await db.query(
        "UPDATE usuarios SET nome = $1, email = $2, senha = $3, tipo_usuario = $4 WHERE usuario_id = $5",
        [nome, email, hashedSenha, roleFormat, id]
      );

      res.status(200).json("Usuário alterado com sucesso");
    } catch (error) {
      console.log(error);
    }
  }

  async alteraCampo(req, res) {
    const id = req.params.id;
    let hashedSenha;
    let roleFormat;

    const { nome, email, senha, role } = req.body;

    if (role) {
      roleFormat = role.charAt(0).toUpperCase() + role.slice(1);
    }


    if (senha) {

      if(senha.length < 8) return res.status(422).json("A senha deve ter mais de 8 caracteres");

      const salt = bcrypt.genSaltSync(10);

      hashedSenha = bcrypt.hashSync(senha, salt);
    }

    if (role && roleFormat) {
      if (roleFormat != "Administrador" && roleFormat != "Gerente" && roleFormat != "Funcionario") return res.status(422).json("Campo que faz referência ao nivel de usuário incorreto");
    }

    const dadosParaAtualizar = {};
    if (nome) dadosParaAtualizar.nome = nome;
    if (email) dadosParaAtualizar.email = email;
    if (senha) dadosParaAtualizar.senha = hashedSenha;
    if (role) dadosParaAtualizar.tipo_usuario = roleFormat;

    if (Object.keys(dadosParaAtualizar).length === 0)
      return res.status(400).json("Nenhum campo para atualizar");

    const campos = Object.keys(dadosParaAtualizar);
    const valores = Object.values(dadosParaAtualizar);

    const setClausula = campos.map((campo, index) => `${campo} = $${index + 1}`).join(', ');

    try {
      const checkUserExists = await db.query(
        "SELECT * FROM usuarios WHERE email = $1",
        [email]
      );

      if (checkUserExists.rows.length > 0)
        return res.status(422).json("Usuário já existe");

      const result = await db.query(
        `UPDATE usuarios SET ${setClausula} WHERE usuario_id = $${campos.length + 1} RETURNING *`,
        [...valores, id]
      );
  
      if (result.rows.length === 0) return res.status(404).json('Usuário não existe');

      res.status(200).json("Usuário alterado com sucesso");
    } catch (error) {
      console.log(error);
    }
  }

  async autenticaUsuario(req, res) {
    const { email, senha } = req.body;

    if (!email) return res.status(422).json("Email é obrigatório");
    if (!senha) return res.status(422).json("Senha é obrigatória");

    const checkUsuario = await db.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);

    if (!checkUsuario.rows.length > 0)
      return res.status(404).json("Usuário não encontrado");

    const usuario = checkUsuario.rows[0];

    const checkSenha = await bcrypt.compare(senha, usuario.senha);

    if (!checkSenha) return res.status(422).json("Senha incorreta");

    try {
      const secret = process.env.SECRET;

      const token = jwt.sign(
        {
          id: usuario.usuario_id,
          role: usuario.tipo_usuario
        },
        secret, {
          expiresIn: 86400
        }
      );

      res.status(200).json({ token: token });
    } catch (error) {
      console.log(error);
    }
  }
}

export default UsuarioController;
