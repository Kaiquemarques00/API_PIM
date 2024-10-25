import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserController {
  async buscaArc(req, res) {
    try {
      const require = await db.query("SELECT * FROM usuarios_arquivados");

      const usersArc = require.rows;

      res.status(200).json(usersArc);
    } catch (error) {
      console.log(error);
    }
  }

  async buscaUserArc(req, res) {
    const id = req.params.id;

    try {
      const require = await db.query(
        "SELECT usuario_id, nome, email, tipo_usuario, data_arquivacao FROM usuarios_arquivados WHERE usuario_id = $1",
        [id]
      );

      const user = require.rows;

      if (!user.length > 0) return res.status(404).json("User not found");

      res.status(200).json(user);
    } catch (error) {
      console.log(error);
    }
  }

  async busca(req, res) {
    try {
      const require = await db.query("SELECT * FROM usuarios");

      const users = require.rows;

      if (!users) return res.status(422).json("Requisição Não feita");

      res.status(200).json(users);
    } catch (error) {
      console.log(error);
    }
  }

  async buscaUser(req, res) {
    const id = req.params.id;

    try {
      const require = await db.query(
        "SELECT usuario_id, nome, email, tipo_usuario, data_criacao FROM usuarios WHERE usuario_id = $1",
        [id]
      );

      const user = require.rows;

      if (!user.length > 0) return res.status(404).json("User not found");

      res.status(200).json(user);
    } catch (error) {
      console.log(error);
    }
  }

  async register(req, res) {
    
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

      const checkUserExists = await db.query(
        "SELECT * FROM usuarios WHERE email = $1",
        [email]
      );

      if (checkUserExists.rows.length > 0)
        return res.status(422).json("User exists");

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(senha, salt);

      await db.query(
        "INSERT INTO usuarios(nome, email, senha, tipo_usuario) VALUES ($1, $2, $3, $4)",
        [String(nome), String(email), hashedPassword, String(roleFormat)]
      );

      res.status(201).json("Usuário criado com sucesso");
    } catch (error) {
      console.log(error);
    }
  }

  async delete(req, res) {
    const id = req.params.id;

    try {
      const getUser = await db.query("SELECT * FROM usuarios WHERE usuario_id = $1", [id]);
      const user = getUser.rows;

      if(!user.length > 0) return res.status(404).json("User Not Found");

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

      await db.query("INSERT INTO usuarios_arquivados (usuario_id, nome, email, senha, tipo_usuario) VALUES ( $1, $2, $3, $4, $5 )", [user[0].usuario_id, user[0].nome, user[0].email, user[0].senha, user[0].tipo_usuario]);
      
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

      const checkUserExists = await db.query(
        "SELECT * FROM usuarios WHERE email = $1",
        [email]
      );

      if (checkUserExists.rows.length > 0)
        return res.status(422).json("User exists");

      const salt = bcrypt.genSaltSync(10);

      const hashedPassword = bcrypt.hashSync(senha, salt);

      await db.query(
        "UPDATE usuarios SET nome = $1, email = $2, senha = $3, tipo_usuario = $4 WHERE usuario_id = $5",
        [nome, email, hashedPassword, roleFormat, id]
      );

      res.status(200).json("Usuário alterado com sucesso");
    } catch (error) {
      console.log(error);
    }
  }

  async alteraCampo(req, res) {
    const id = req.params.id;
    let hashedPassword;
    let roleFormat;

    const { nome, email, senha, role } = req.body;

    if (role) {
      roleFormat = role.charAt(0).toUpperCase() + role.slice(1);
    }


    if (senha) {

      if(senha.length < 8) return res.status(422).json("A senha deve ter mais de 8 caracteres");

      const salt = bcrypt.genSaltSync(10);

      hashedPassword = bcrypt.hashSync(senha, salt);
    }

    if (role && roleFormat) {
      if (roleFormat != "Administrador" && roleFormat != "Gerente" && roleFormat != "Funcionario") return res.status(422).json("Campo que faz referência ao nivel de usuário incorreto");
    }

    const dadosParaAtualizar = {};
    if (nome) dadosParaAtualizar.nome = nome;
    if (email) dadosParaAtualizar.email = email;
    if (senha) dadosParaAtualizar.senha = hashedPassword;
    if (role) dadosParaAtualizar.tipo_usuario = roleFormat;

    if (Object.keys(dadosParaAtualizar).length === 0)
      return res.status(400).json("Nenhum campo para atualizar");

    const campos = Object.keys(dadosParaAtualizar);
    const valores = Object.values(dadosParaAtualizar);

    const setClause = campos.map((campo, index) => `${campo} = $${index + 1}`).join(', ');

    try {
      const checkUserExists = await db.query(
        "SELECT * FROM usuarios WHERE email = $1",
        [email]
      );

      if (checkUserExists.rows.length > 0)
        return res.status(422).json("User exists");

      const result = await db.query(
        `UPDATE usuarios SET ${setClause} WHERE usuario_id = $${campos.length + 1} RETURNING *`,
        [...valores, id]
      );
  
      if (result.rows.length === 0) return res.status(404).json('User not exists');

      res.status(200).json("Usuário alterado com sucesso");
    } catch (error) {
      console.log(error);
    }
  }

  async login(req, res) {
    const { email, senha } = req.body;

    if (!email) return res.status(422).json("Email é obrigatório");
    if (!senha) return res.status(422).json("Senha é obrigatória");

    const checkUser = await db.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);

    if (!checkUser.rows.length > 0)
      return res.status(404).json("User not found");

    const user = checkUser.rows[0];

    const checkSenha = await bcrypt.compare(senha, user.senha);

    if (!checkSenha) return res.status(422).json("Senha incorreta");

    try {
      const secret = process.env.SECRET;

      const token = jwt.sign(
        {
          id: user.usuario_id,
          role: user.tipo_usuario
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

export default UserController;
