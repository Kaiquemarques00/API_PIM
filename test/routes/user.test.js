import supertest from "supertest";
import app from "../../src/app.js";

const request = supertest;

describe("Testes para funcionalidades de usuários de consulta de usuários", () => {

    test("Deve listar todos os usuários", async () => {
        const result = await request(app).get('/users');

        expect(result.status).toBe(200);
        expect(result.body.length).toBeGreaterThan(0);
        result.body.map((user) => {
            expect(user).toHaveProperty('nome');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('senha');
            expect(user).toHaveProperty('tipo_usuario');
            expect(user).toHaveProperty('data_criacao');
        });
    });

    test("Deve listar um usuário pelo ID", async () => {
        const result = await request(app).get('/user/43');

        expect(result.status).toBe(200);
        expect(result.body.length).toBeGreaterThan(0);
        result.body.map((user) => {
            expect(user).toHaveProperty('nome');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('tipo_usuario');
            expect(user).toHaveProperty('data_criacao');
        });
    });

    test("Não deve consultar um usuário ativo caso não seja encontrado", async () => {
        const result = await request(app).get('/user/arc/22');

        expect(result.status).toBe(404);
        expect(result.body).toBe("User not found");
    });

    test("Deve listar todos os usuários arquivados", async () => {
        const result = await request(app).get('/users/arc');

        expect(result.status).toBe(200);
        expect(result.body.length).toBeGreaterThan(0);
        result.body.map((user) => {
            expect(user).toHaveProperty('nome');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('senha');
            expect(user).toHaveProperty('tipo_usuario');
            expect(user).toHaveProperty('data_arquivacao');
        });
    });

    test("Deve listar um usuário arquivado pelo ID", async () => {
        const result = await request(app).get('/user/arc/3');

        expect(result.status).toBe(200);
        expect(result.body.length).toBeGreaterThan(0);
        result.body.map((user) => {
            expect(user).toHaveProperty('nome');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('tipo_usuario');
            expect(user).toHaveProperty('data_arquivacao');
        });
    });

    test("Não deve consultar um usuário arquivado caso não seja encontrado", async () => {
        const result = await request(app).get('/user/arc/1');

        expect(result.status).toBe(404);
        expect(result.body).toBe("User not found");
    });
});

describe("Testes para funcionalidades de inserção de usuários", () => {

    test.skip("Deve inserir usuário com sucesso", async () => {
        const result = await request(app).post('/user')
            .send({ nome: 'Kaique', email: 'k12123teste@email.com', senha: '123', role: 'administrador'});

        expect(result.status).toBe(201);
    });

    test("Não deve inserir usuário sem nome", async () => {
        const result = await request(app).post('/user')
            .send({ email: 'kteste@email.com', senha: '123', role: 'administrador'});

        expect(result.status).toBe(422);
        expect(result.body).toBe("Nome deve ser preenchido");
    });

    test("Não deve inserir usuário sem email", async () => {
        const result = await request(app).post('/user')
            .send({ nome: "kaique", senha: '123', role: 'administrador'});

        expect(result.status).toBe(422);
        expect(result.body).toBe("Email deve ser preenchido");
    });

    test("Não deve inserir usuário sem senha", async () => {
        const result = await request(app).post('/user')
            .send({ nome: "Kaique", email: 'kteste@email.com', role: 'administrador'});

        expect(result.status).toBe(422);
        expect(result.body).toBe("Senha deve ser preenchido");
    });

    test("Não deve inserir usuário sem tipo de usuário", async () => {
        const result = await request(app).post('/user')
            .send({ nome: "Kaique", email: 'kteste@email.com', senha: '123'});

        expect(result.status).toBe(422);
        expect(result.body).toBe("Tipo de usuário deve ser preenchido");
    });

    test("Não deve inserir usuário sem tipo de usuário correto", async () => {
        const result = await request(app).post('/user')
            .send({ nome: "Kaique", email: 'kteste@email.com', senha: '12312345678', role: 'administrado'});

        expect(result.status).toBe(422);
        expect(result.body).toBe("Campo que faz referência ao nivel de usuário incorreto");
    });

    test("Não deve inserir usuário com senha menor que 8 caracteres", async () => {
        const result = await request(app).post('/user')
            .send({ nome: "Kaique", email: 'kteste@email.com', senha: '123', role: 'administrador'});

        expect(result.status).toBe(422);
        expect(result.body).toBe("A senha deve ter mais de 8 caracteres");
    });

    test("Não deve inserir usuário já existente", async () => {
        const result = await request(app).post('/user')
            .send({ nome: 'Kaique', email: 'k12123teste@email.com', senha: '12345678', role: 'administrador'});

        expect(result.status).toBe(422);
        expect(result.body).toBe("User exists");
    }); 
});

describe("Testes para funcionalidades de deleção/arquivação de usuários", () => {

    test.skip("Deve deletar um usuário pelo ID", async () => {
        const result = await request(app).delete('/user/10');

        expect(result.status).toBe(200);
        //expect(result.body).toBe("Usuário arquivado com sucesso");
    });

    test("Não deve deletar um usuário pelo ID caso não seja encotrado", async () => {
        const result = await request(app).delete('/user/2');

        expect(result.status).toBe(404);
        expect(result.body).toBe("User Not Found");
    });

});

describe("Testes para funcionalidades de alteração completa de usuário", () => {

    test.skip("Deve alterar um usuário com sucesso", async () => {
        const result = await request(app).put('/user/44')
            .send({ nome: 'Jorge', email: 'Jorge123@email.com', senha: '321123123', role: 'administrador'});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Usuário alterado com sucesso");
    });

    test("Não deve alterar usuário sem nome", async () => {
        const result = await request(app).put('/user/44')
            .send({ email: 'kteste@email.com', senha: '123', role: 'administrador'});

        expect(result.status).toBe(422);
        expect(result.body).toBe("Nome deve ser preenchido");
    });

    test("Não deve alterar usuário sem email", async () => {
        const result = await request(app).put('/user/44')
            .send({ nome: "kaique", senha: '123', role: 'administrador'});

        expect(result.status).toBe(422);
        expect(result.body).toBe("Email deve ser preenchido");
    });

    test("Não deve alterar usuário sem senha", async () => {
        const result = await request(app).put('/user/44')
            .send({ nome: "Kaique", email: 'kteste@email.com', role: 'administrador'});

        expect(result.status).toBe(422);
        expect(result.body).toBe("Senha deve ser preenchido");
    });

    test("Não deve alterar usuário sem tipo de usuário", async () => {
        const result = await request(app).put('/user/44')
            .send({ nome: "Kaique", email: 'kteste@email.com', senha: '123'});

        expect(result.status).toBe(422);
        expect(result.body).toBe("Tipo de usuário deve ser preenchido");
    });

    test("Não deve alterar usuário sem tipo de usuário correto", async () => {
        const result = await request(app).put('/user/44')
            .send({ nome: "Kaique", email: 'kteste@email.com', senha: '12312345678', role: 'administrado'});

        expect(result.status).toBe(422);
        expect(result.body).toBe("Campo que faz referência ao nivel de usuário incorreto");
    });

    test("Não deve alterar usuário com senha menor que 8 caracteres", async () => {
        const result = await request(app).put('/user/44')
            .send({ nome: "Kaique", email: 'kteste@email.com', senha: '123', role: 'administrador'});

        expect(result.status).toBe(422);
        expect(result.body).toBe("A senha deve ter mais de 8 caracteres");
    });

    test("Não deve alterar usuário já existente", async () => {
        const result = await request(app).put('/user/44')
            .send({ nome: 'Kaique', email: 'Jorge123@email.com', senha: '12345678', role: 'administrador'});

        expect(result.status).toBe(422);
        expect(result.body).toBe("User exists");
    }); 
});

describe("Testes para funcionalidades de alteração parcial de usuário", () => {

    test("Deve alterar nome do usuário com sucesso", async () => {
        const result = await request(app).patch('/user/44')
            .send({ nome: 'Jorge'});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Usuário alterado com sucesso");
    });

    test.skip("Deve alterar email do usuário com sucesso", async () => {
        const result = await request(app).patch('/user/44')
            .send({ email: 'Jorge123123123@email.com'});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Usuário alterado com sucesso");
    });

    test("Deve alterar senha do usuário com sucesso", async () => {
        const result = await request(app).patch('/user/44')
            .send({ senha: '123456789'});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Usuário alterado com sucesso");
    });

    test("Deve alterar tipo do usuário com sucesso", async () => {
        const result = await request(app).patch('/user/44')
            .send({ role: 'gerente'});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Usuário alterado com sucesso");
    });

    test("Não deve alterar senha se a mesma for menor que 8 caracteres", async () => {
        const result = await request(app).patch('/user/44')
            .send({ senha: '1234567'});

        expect(result.status).toBe(422);
        expect(result.body).toBe("A senha deve ter mais de 8 caracteres");
    });

    test("Não deve alterar tipo de usuario caso formatação esteja errada", async () => {
        const result = await request(app).patch('/user/44')
            .send({ role: 'gerent'});

        expect(result.status).toBe(422);
        expect(result.body).toBe("Campo que faz referência ao nivel de usuário incorreto");
    });

    test("Não deve alterar usuário caso não tenha nenhum dado", async () => {
        const result = await request(app).patch('/user/44')
            .send();

        expect(result.status).toBe(400);
        expect(result.body).toBe("Nenhum campo para atualizar");
    });

    test("Não deve alterar usuário caso não tenha nenhum dado", async () => {
        const result = await request(app).patch('/user/44')
            .send({ email: "k12123teste@email.com" });

        expect(result.status).toBe(422);
        expect(result.body).toBe("User exists");
    });

    test("Não deve alterar usuário caso não tenha nenhum dado", async () => {
        const result = await request(app).patch('/user/4')
            .send({ nome: "Kaiqey" });

        expect(result.status).toBe(404);
        expect(result.body).toBe("User not exists");
    });
});

describe("Testes para funcionalidades de autenticação de usuário", () => {

    test("Não deve autenticar se não tiver email inserido", async () => {
        const result = await request(app).post('/auth/login')
            .send({ senha: 'admin12345'});

        expect(result.status).toBe(422);
        expect(result.body).toBe("Email é obrigatório");
    });

    test("Não deve autenticar se não tiver senha inserida", async () => {
        const result = await request(app).post('/auth/login')
            .send({ email: 'Kaique1@email.com'});

        expect(result.status).toBe(422);
        expect(result.body).toBe("Senha é obrigatória");
    });

    test("Não deve autenticar se não tiver senha inserida", async () => {
        const result = await request(app).post('/auth/login')
            .send({email: 'Rove@email.com', senha: '1235254435'});

        expect(result.status).toBe(404);
        expect(result.body).toBe("User not found");
    });

    test("Não deve autenticar se senha estiver incorreta", async () => {
        const result = await request(app).post('/auth/login')
            .send({email: 'Kaique1@email.com', senha: '1235254435'});

        expect(result.status).toBe(422);
        expect(result.body).toBe("Senha incorreta");
    });

    test("Não deve autenticar se senha estiver incorreta", async () => {
        const result = await request(app).post('/auth/login')
            .send({email: 'Kaique12@email.com', senha: 'admin123456'});

        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty('token');
    });
});