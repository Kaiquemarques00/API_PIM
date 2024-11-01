import supertest from "supertest";
import app from "../../src/app.js";

const request = supertest;

describe("Testes para funcionalidade de consulta de fornecedores", () => {

    test("Deve listar todos os fornecedores", async () => {
        const result = await request(app).get('/suppliers');

        expect(result.status).toBe(200);
        expect(result.body.length).toBeGreaterThan(0);
        result.body.map((supplier) => {
            expect(supplier).toHaveProperty('fornecedor_id');
            expect(supplier).toHaveProperty('nome');
            expect(supplier).toHaveProperty('cnpj');
            expect(supplier).toHaveProperty('email');
            expect(supplier).toHaveProperty('telefone');
            expect(supplier).toHaveProperty('rua');
            expect(supplier).toHaveProperty('numero');
            expect(supplier).toHaveProperty('bairro');
            expect(supplier).toHaveProperty('cidade');
            expect(supplier).toHaveProperty('estado');
            expect(supplier).toHaveProperty('cep');
            expect(supplier).toHaveProperty('observacoes');
        });
    });

    test("Deve listar um fornecedor pelo ID", async () => {
        const result = await request(app).get('/supplier/1');

        expect(result.status).toBe(200);
        expect(result.body.length).toBeGreaterThan(0);
        result.body.map((supplier) => {
            expect(supplier).toHaveProperty('fornecedor_id');
            expect(supplier).toHaveProperty('nome');
            expect(supplier).toHaveProperty('cnpj');
            expect(supplier).toHaveProperty('email');
            expect(supplier).toHaveProperty('telefone');
            expect(supplier).toHaveProperty('rua');
            expect(supplier).toHaveProperty('numero');
            expect(supplier).toHaveProperty('bairro');
            expect(supplier).toHaveProperty('cidade');
            expect(supplier).toHaveProperty('estado');
            expect(supplier).toHaveProperty('cep');
            expect(supplier).toHaveProperty('observacoes');
        });
    });

    test("Não deve listar nenhum fornecedor", async () => {
        const result = await request(app).get('/supplier/50');

        expect(result.status).toBe(404);
        expect(result.body).toBe("Fornecedor não existe");
    });

    test("Deve listar todos os fornecedores arquivados", async () => {
        const result = await request(app).get('/suppliers/arc');

        expect(result.status).toBe(200);
        expect(result.body.length).toBeGreaterThan(0);
        result.body.map((supplier) => {
            expect(supplier).toHaveProperty('fornecedor_id');
            expect(supplier).toHaveProperty('nome');
            expect(supplier).toHaveProperty('cnpj');
            expect(supplier).toHaveProperty('email');
            expect(supplier).toHaveProperty('telefone');
            expect(supplier).toHaveProperty('rua');
            expect(supplier).toHaveProperty('numero');
            expect(supplier).toHaveProperty('bairro');
            expect(supplier).toHaveProperty('cidade');
            expect(supplier).toHaveProperty('estado');
            expect(supplier).toHaveProperty('cep');
            expect(supplier).toHaveProperty('data_arquivacao');
        });
    });

    test("Deve listar um fornecedor arquivado pelo ID", async () => {
        const result = await request(app).get('/supplier/arc/3');

        expect(result.status).toBe(200);
        expect(result.body.length).toBeGreaterThan(0);
        result.body.map((supplier) => {
            expect(supplier).toHaveProperty('fornecedor_id');
            expect(supplier).toHaveProperty('nome');
            expect(supplier).toHaveProperty('cnpj');
            expect(supplier).toHaveProperty('email');
            expect(supplier).toHaveProperty('telefone');
            expect(supplier).toHaveProperty('rua');
            expect(supplier).toHaveProperty('numero');
            expect(supplier).toHaveProperty('bairro');
            expect(supplier).toHaveProperty('cidade');
            expect(supplier).toHaveProperty('estado');
            expect(supplier).toHaveProperty('cep');
            expect(supplier).toHaveProperty('data_arquivacao');
        });
    });

    test("Não deve listar nenhum fornecedor arquivado", async () => {
        const result = await request(app).get('/supplier/arc/50');

        expect(result.status).toBe(404);
        expect(result.body).toBe("Fornecedor não encontrado");
    });
});

describe("Testes para funcionalidade de cadastro de fornecedor", () => {
    
    test.skip("Deve cadastrar um novo fornecedor", async () => {
        const result = await request(app).post('/supplier')
            .send({ nome: "TargerLTDA", 
                    cnpj: "31.345.678/0001-90", 
                    telefone: "+55 (12) 3456-7896", 
                    email: "TargerLTDA@email.com", 
                    rua: "Rua das maravilhas", 
                    numero: 987, 
                    bairro: "Jardim Yolanda", 
                    cidade: "Cidade Jardim", 
                    estado: "São Paulo", 
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(201);
        expect(result.body).toBe("Novo fornecedor cadastrado com sucesso");
    });

    test("Não deve cadastrar um novo fornecedor sem nome", async () => {
        const result = await request(app).post('/supplier')
            .send({ cnpj: "32.345.678/0001-90", 
                    telefone: "+55 (12) 3456-7896", 
                    email: "TargerLTDA@email.com", 
                    rua: "Rua das maravilhas", 
                    numero: 987, 
                    bairro: "Jardim Yolanda", 
                    cidade: "Cidade Jardim", 
                    estado: "São Paulo", 
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Nome do fornecedor deve ser preenchido");
    });

    test("Não deve cadastrar um novo fornecedor sem CNPJ", async () => {
        const result = await request(app).post('/supplier')
            .send({ nome: "SupremeSA", 
                    telefone: "+55 (12) 3456-7896", 
                    email: "TargerLTDA@email.com", 
                    rua: "Rua das maravilhas", 
                    numero: 987, 
                    bairro: "Jardim Yolanda", 
                    cidade: "Cidade Jardim", 
                    estado: "São Paulo", 
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("CNPJ do fornecedor deve ser preenchido");
    });

    test("Não deve cadastrar um novo fornecedor sem telefone", async () => {
        const result = await request(app).post('/supplier')
            .send({ nome: "SupremeSA", 
                    cnpj: "33.345.678/0001-90", 
                    email: "TargerLTDA@email.com", 
                    rua: "Rua das maravilhas", 
                    numero: 987, 
                    bairro: "Jardim Yolanda", 
                    cidade: "Cidade Jardim", 
                    estado: "São Paulo", 
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Telefone do fornecedor deve ser preenchido");
    });

    test("Não deve cadastrar um novo fornecedor sem email", async () => {
        const result = await request(app).post('/supplier')
            .send({ nome: "SupremeSA", 
                    cnpj: "33.345.678/0001-90", 
                    telefone: "+55 (12) 3456-7896", 
                    rua: "Rua das maravilhas", 
                    numero: 987, 
                    bairro: "Jardim Yolanda", 
                    cidade: "Cidade Jardim", 
                    estado: "São Paulo", 
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Email do fornecedor deve ser preenchido");
    });

    test("Não deve cadastrar um novo fornecedor sem rua(endereço)", async () => {
        const result = await request(app).post('/supplier')
            .send({ nome: "SupremeSA", 
                    cnpj: "33.345.678/0001-90", 
                    telefone: "+55 (12) 3456-7896", 
                    email: "SupremeSA@email.com", 
                    numero: 987, 
                    bairro: "Jardim Yolanda", 
                    cidade: "Cidade Jardim", 
                    estado: "São Paulo", 
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Rua do fornecedor deve ser preenchido");
    });

    test("Não deve cadastrar um novo fornecedor sem número(endereço)", async () => {
        const result = await request(app).post('/supplier')
            .send({ nome: "SupremeSA", 
                    cnpj: "33.345.678/0001-90", 
                    telefone: "+55 (12) 3456-7896", 
                    email: "SupremeSA@email.com", 
                    rua: "Rua aparecida", 
                    bairro: "Jardim Yolanda", 
                    cidade: "Cidade Jardim", 
                    estado: "São Paulo", 
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Número do fornecedor deve ser preenchido");
    });

    test("Não deve cadastrar um novo fornecedor sem bairro(endereço)", async () => {
        const result = await request(app).post('/supplier')
            .send({ nome: "SupremeSA", 
                    cnpj: "33.345.678/0001-90", 
                    telefone: "+55 (12) 3456-7896", 
                    email: "SupremeSA@email.com", 
                    rua: "Rua aparecida", 
                    numero: 543, 
                    cidade: "Cidade Jardim", 
                    estado: "São Paulo", 
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Bairro do fornecedor deve ser preenchido");
    });

    test("Não deve cadastrar um novo fornecedor sem cidade(endereço)", async () => {
        const result = await request(app).post('/supplier')
            .send({ nome: "SupremeSA", 
                    cnpj: "33.345.678/0001-90", 
                    telefone: "+55 (12) 3456-7896", 
                    email: "SupremeSA@email.com", 
                    rua: "Rua aparecida", 
                    numero: 543, 
                    bairro: "Nova Jacareí", 
                    estado: "São Paulo", 
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Cidade do fornecedor deve ser preenchido");
    });

    test("Não deve cadastrar um novo fornecedor sem estado(endereço)", async () => {
        const result = await request(app).post('/supplier')
            .send({ nome: "SupremeSA", 
                    cnpj: "33.345.678/0001-90", 
                    telefone: "+55 (12) 3456-7896", 
                    email: "SupremeSA@email.com", 
                    rua: "Rua aparecida", 
                    numero: 543, 
                    bairro: "Nova Jacareí", 
                    cidade: "Capão", 
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Estado do fornecedor deve ser preenchido");
    });

    test("Não deve cadastrar um novo fornecedor sem cep(endereço)", async () => {
        const result = await request(app).post('/supplier')
            .send({ nome: "SupremeSA", 
                    cnpj: "33.345.678/0001-90", 
                    telefone: "+55 (12) 3456-7896", 
                    email: "SupremeSA@email.com", 
                    rua: "Rua aparecida", 
                    numero: 543, 
                    bairro: "Nova Jacareí", 
                    cidade: "Capão", 
                    estado: "Manaus", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("CEP do fornecedor deve ser preenchido");
    });

    test("Não deve cadastrar um fornecedor já cadastrado", async () => {
        const result = await request(app).post('/supplier')
            .send({ nome: "SupremeSA", 
                    cnpj: "33.345.678/0001-90", 
                    telefone: "+55 (12) 3456-7896", 
                    email: "SupremeSA@email.com", 
                    rua: "Rua aparecida", 
                    numero: 543, 
                    bairro: "Nova Jacareí", 
                    cidade: "Capão", 
                    estado: "Manaus",
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(409);
        expect(result.body).toBe("Fornecedor já cadastrado");
    });
});

describe("Testes para funcionalidade de alteração total de fornecedor", () => {
    test.skip("Deve alterar um fornecedor", async () => {
        const result = await request(app).put('/supplier/1')
            .send({ nome: "TesteSA", 
                    cnpj: "11.345.678/0001-90", 
                    telefone: "+55 (12) 1234-5678", 
                    email: "TargerLTDA@email.com", 
                    rua: "Rua das maravilhas", 
                    numero: 987, 
                    bairro: "Jardim Yolanda", 
                    cidade: "Cidade Jardim",
                    estado: "São Paulo", 
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(200);
        expect(result.body).toBe("Fornecedor alterado com sucesso");
    });

    test("Não deve alterar fornecedor sem nome", async () => {
        const result = await request(app).put('/supplier/8')
            .send({ cnpj: "32.345.678/0001-90", 
                    telefone: "+55 (12) 3456-7896", 
                    email: "TargerLTDA@email.com", 
                    rua: "Rua das maravilhas", 
                    numero: 987, 
                    bairro: "Jardim Yolanda", 
                    cidade: "Cidade Jardim", 
                    estado: "São Paulo", 
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Nome do fornecedor deve ser preenchido");
    });

    test("Não deve alterar fornecedor sem CNPJ", async () => {
        const result = await request(app).put('/supplier/8')
            .send({ nome: "SupremeSA", 
                    telefone: "+55 (12) 3456-7896", 
                    email: "TargerLTDA@email.com", 
                    rua: "Rua das maravilhas", 
                    numero: 987, 
                    bairro: "Jardim Yolanda", 
                    cidade: "Cidade Jardim", 
                    estado: "São Paulo", 
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("CNPJ do fornecedor deve ser preenchido");
    });

    test("Não deve alterar fornecedor sem telefone", async () => {
        const result = await request(app).put('/supplier/8')
            .send({ nome: "SupremeSA", 
                    cnpj: "33.345.678/0001-90", 
                    email: "TargerLTDA@email.com", 
                    rua: "Rua das maravilhas", 
                    numero: 987, 
                    bairro: "Jardim Yolanda", 
                    cidade: "Cidade Jardim", 
                    estado: "São Paulo", 
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Telefone do fornecedor deve ser preenchido");
    });

    test("Não deve alterar fornecedor sem email", async () => {
        const result = await request(app).put('/supplier/8')
            .send({ nome: "SupremeSA", 
                    cnpj: "33.345.678/0001-90", 
                    telefone: "+55 (12) 3456-7896", 
                    rua: "Rua das maravilhas", 
                    numero: 987, 
                    bairro: "Jardim Yolanda", 
                    cidade: "Cidade Jardim", 
                    estado: "São Paulo", 
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Email do fornecedor deve ser preenchido");
    });

    test("Não deve alterar fornecedor sem rua(endereço)", async () => {
        const result = await request(app).put('/supplier/8')
            .send({ nome: "SupremeSA", 
                    cnpj: "33.345.678/0001-90", 
                    telefone: "+55 (12) 3456-7896", 
                    email: "SupremeSA@email.com", 
                    numero: 987, 
                    bairro: "Jardim Yolanda", 
                    cidade: "Cidade Jardim", 
                    estado: "São Paulo", 
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Rua do fornecedor deve ser preenchido");
    });

    test("Não deve alterar fornecedor sem número(endereço)", async () => {
        const result = await request(app).put('/supplier/8')
            .send({ nome: "SupremeSA", 
                    cnpj: "33.345.678/0001-90", 
                    telefone: "+55 (12) 3456-7896", 
                    email: "SupremeSA@email.com", 
                    rua: "Rua aparecida", 
                    bairro: "Jardim Yolanda", 
                    cidade: "Cidade Jardim", 
                    estado: "São Paulo", 
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Número do fornecedor deve ser preenchido");
    });

    test("Não deve alterar fornecedor sem bairro(endereço)", async () => {
        const result = await request(app).put('/supplier/8')
            .send({ nome: "SupremeSA", 
                    cnpj: "33.345.678/0001-90", 
                    telefone: "+55 (12) 3456-7896", 
                    email: "SupremeSA@email.com", 
                    rua: "Rua aparecida", 
                    numero: 543, 
                    cidade: "Cidade Jardim", 
                    estado: "São Paulo", 
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Bairro do fornecedor deve ser preenchido");
    });

    test("Não deve alterar fornecedor sem cidade(endereço)", async () => {
        const result = await request(app).put('/supplier/8')
            .send({ nome: "SupremeSA", 
                    cnpj: "33.345.678/0001-90", 
                    telefone: "+55 (12) 3456-7896", 
                    email: "SupremeSA@email.com", 
                    rua: "Rua aparecida", 
                    numero: 543, 
                    bairro: "Nova Jacareí", 
                    estado: "São Paulo", 
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Cidade do fornecedor deve ser preenchido");
    });

    test("Não deve alterar fornecedor sem estado(endereço)", async () => {
        const result = await request(app).put('/supplier/8')
            .send({ nome: "SupremeSA", 
                    cnpj: "33.345.678/0001-90", 
                    telefone: "+55 (12) 3456-7896", 
                    email: "SupremeSA@email.com", 
                    rua: "Rua aparecida", 
                    numero: 543, 
                    bairro: "Nova Jacareí", 
                    cidade: "Capão", 
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Estado do fornecedor deve ser preenchido");
    });

    test("Não deve alterar fornecedor sem cep(endereço)", async () => {
        const result = await request(app).put('/supplier/8')
            .send({ nome: "SupremeSA", 
                    cnpj: "33.345.678/0001-90", 
                    telefone: "+55 (12) 3456-7896", 
                    email: "SupremeSA@email.com", 
                    rua: "Rua aparecida", 
                    numero: 543, 
                    bairro: "Nova Jacareí", 
                    cidade: "Capão", 
                    estado: "Manaus", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("CEP do fornecedor deve ser preenchido");
    });

    test("Não deve alterar um fornecedor não existente/achado", async () => {
        const result = await request(app).put('/supplier/55')
            .send({ nome: "TesteSA", 
                    cnpj: "11.345.678/0001-90", 
                    telefone: "+55 (12) 1234-5678", 
                    email: "TargerLTDA@email.com", 
                    rua: "Rua das maravilhas", 
                    numero: 987, 
                    bairro: "Jardim Yolanda", 
                    cidade: "Cidade Jardim", 
                    estado: "São Paulo", 
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(404);
        expect(result.body).toBe("Fornecedor não existe");
    });

    test("Não deve alterar um fornecedor não com um CNPJ já cadastrado", async () => {
        const result = await request(app).put('/supplier/1')
            .send({ nome: "TesteSA", 
                    cnpj: "11.345.678/0001-90", 
                    telefone: "+55 (12) 1234-5678", 
                    email: "TargerLTDA@email.com", 
                    rua: "Rua das maravilhas", 
                    numero: 987, 
                    bairro: "Jardim Yolanda", 
                    cidade: "Cidade Jardim", 
                    estado: "São Paulo", 
                    cep: "12345-678", 
                    observacoes: "Fornecedor criado com teste unitario"
                });

        expect(result.status).toBe(409);
        expect(result.body).toBe("Fornecedor com CNPJ já cadastrado");
    });
});

describe("Testes para funcionalidade de alteração parcial de fornecedor", () => {
    
    test("Deve alterar nome do fornecedor com sucesso", async () => {
        const result = await request(app).patch('/supplier/1')
            .send({ nome: 'JorgeLTDA'});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Fornecedor alterado com sucesso");
    });

    test.skip("Deve alterar CNPJ do fornecedor com sucesso", async () => {
        const result = await request(app).patch('/supplier/1')
            .send({ cnpj: '03.765.537/0001-12'});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Fornecedor alterado com sucesso");
    });

    test("Deve alterar E-mail do fornecedor com sucesso", async () => {
        const result = await request(app).patch('/supplier/1')
            .send({ email: 'JoregeLT@email.com'});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Fornecedor alterado com sucesso");
    });

    test("Deve alterar telefone do fornecedor com sucesso", async () => {
        const result = await request(app).patch('/supplier/1')
            .send({ telefone: '+55 (11)9874-5632'});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Fornecedor alterado com sucesso");
    });

    test("Deve alterar observações do fornecedor com sucesso", async () => {
        const result = await request(app).patch('/supplier/1')
            .send({ observacoes: 'Teste Teste'});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Fornecedor alterado com sucesso");
    });

    test("Deve alterar rua(endereço) do fornecedor com sucesso", async () => {
        const result = await request(app).patch('/supplier/1')
            .send({ rua: 'Rua Ayrton Senna'});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Fornecedor alterado com sucesso");
    });

    test("Deve alterar numero(endereço) do fornecedor com sucesso", async () => {
        const result = await request(app).patch('/supplier/1')
            .send({ numero: 107});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Fornecedor alterado com sucesso");
    });

    test("Deve alterar bairro(endereço) do fornecedor com sucesso", async () => {
        const result = await request(app).patch('/supplier/1')
            .send({ bairro: 'Lua meia'});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Fornecedor alterado com sucesso");
    });

    test("Deve alterar cidade(endereço) do fornecedor com sucesso", async () => {
        const result = await request(app).patch('/supplier/1')
            .send({ cidade: 'Mocca'});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Fornecedor alterado com sucesso");
    });

    test("Deve alterar estado(endereço) do fornecedor com sucesso", async () => {
        const result = await request(app).patch('/supplier/1')
            .send({ estado: 'Acre'});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Fornecedor alterado com sucesso");
    });

    test("Deve alterar CEP(endereço) do fornecedor com sucesso", async () => {
        const result = await request(app).patch('/supplier/1')
            .send({ cep: '98765-312'});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Fornecedor alterado com sucesso");
    });

    test("Não deve alterar fornecedor caso não tenha nenhum dado", async () => {
        const result = await request(app).patch('/supplier/1')
            .send();

        expect(result.status).toBe(400);
        expect(result.body).toBe("Nenhum campo do fornecedor para atualizar");
    });

    test("Não deve alterar fornecedor caso CNPJ já esteja cadastrado", async () => {
        const result = await request(app).patch('/supplier/55')
            .send({ nome: 'GrillzNA'});

        expect(result.status).toBe(404);
        expect(result.body).toBe("Fornecedor não existe");
    });
});

describe("Testes para funcionalidade de armazenamento de fornecedor", () => {
    
    test.skip("Deve armazenar um fornecedor", async () => {
        const result = await request(app).delete('/supplier/7');

        expect(result.status).toBe(200);
        expect(result.body).toBe("Fornecedor arquivado com sucesso");
    });

    test("Não deve armazenar um fornecedor não encontrado", async () => {
        const result = await request(app).delete('/supplier/55');

        expect(result.status).toBe(404);
        expect(result.body).toBe("Fornecedor não encontrado");
    });
});