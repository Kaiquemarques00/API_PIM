import express from "express";
import UsuarioController from "../controllers/UsuarioController.js";
import Token from "../middlewares/CheckToken.js";
import Role from "../middlewares/CheckRole.js";

const usuarioController = new UsuarioController();
const tokenMiddleware = new Token();
const RoleMiddleware = new Role();


const router = express.Router();

router.get('/', (req, res) => res.status(200).json("Rota padrão"));
/* Rota de consulta de todos os usuários */
router.get('/users', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador'])], usuarioController.buscaUsuarios);
/* Rota privada  teste */
router.get('/user/:id', usuarioController.buscaUsuario);
/* Rota de registro de usuário */
router.post('/user', usuarioController.criaUsuario);
/* Rota de Deleção de usuário */
router.put('/user/:id', usuarioController.alteraRegistro);
/* Rota de Deleção de usuário */
router.patch('/user/:id', usuarioController.alteraCampo);
/* Rota de Deleção de usuário */
router.delete('/user/:id', usuarioController.arquivaUsuario);
/* Rota teste para usuarios arquivados */
router.get('/users/arc', usuarioController.buscaUsuariosArquivados);
/* Rota teste para um usuario arquivado */
router.get('/user/arc/:id', usuarioController.buscaUsuarioArquivado);


/* Rota de autenticação */
router.post('/auth/login', usuarioController.autenticaUsuario);



/* Rota teste para nivel de acesso 1 */
router.get('/admin', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Administrador'])], (req, res) => {
    
      // Se o token for válido e o usuário for admin
      return res.json({ message: 'Acesso concedido. Bem-vindo ao conteúdo protegido!' });
});
/* Rota teste para nivel de acesso 2 */
router.get('/funcionario', [tokenMiddleware.checkToken, RoleMiddleware.checkRole(['Funcionario', 'Administrador'])], (req, res) => {
    return res.json({ message: 'Acesso concedido. Bem-vindo ao conteúdo geral!' });
});

export default router;