import supertest from "supertest";
import app from "../../src/app.js";

const request = supertest;

describe("Testes para funcionalidade de consulta de plantios", () => {

    test("Deve listar todos os insumos", async () => {
        const result = await request(app).get('/inputs');

        expect(result.status).toBe(200);
        expect(result.body.length).toBeGreaterThan(0);
        result.body.map((supplier) => {
            expect(supplier).toHaveProperty('nome');
            expect(supplier).toHaveProperty('tipo');
            expect(supplier).toHaveProperty('unidade_medida');
            expect(supplier).toHaveProperty('quantidade_estoque');
            expect(supplier).toHaveProperty('custo_por_unidade');
            expect(supplier).toHaveProperty('fornecedor_nome');
            expect(supplier).toHaveProperty('observacoes');
        });
    });
    
    test("Deve listar um insumo pelo ID", async () => {
        const result = await request(app).get('/input/10');

        expect(result.status).toBe(200);
        expect(result.body.length).toBeGreaterThan(0);
        result.body.map((supplier) => {
            expect(supplier).toHaveProperty('nome');
            expect(supplier).toHaveProperty('tipo');
            expect(supplier).toHaveProperty('unidade_medida');
            expect(supplier).toHaveProperty('quantidade_estoque');
            expect(supplier).toHaveProperty('custo_por_unidade');
            expect(supplier).toHaveProperty('fornecedor_nome');
            expect(supplier).toHaveProperty('observacoes');
        });
    });

    test("Não deve listar nenhum insumo", async () => {
        const result = await request(app).get('/input/50');

        expect(result.status).toBe(404);
        expect(result.body).toBe("Nenhum insumo encontrado");
    });
});

describe("Testes para funcionalidade de cadastro de plantios", () => {
    
    test.skip("Deve cadastrar um novo insumo", async () => {
        const result = await request(app).post('/input')
            .send({ nome: "Semente de Manga rosa", 
                    tipo: "Semente", 
                    medida: "KG", 
                    qtd_estoque: 0, 
                    custo_por_unidade: 45.99, 
                    fornecedor: "InovaWave",  
                    observacoes: "Insumo criado com teste unitario"
                });

                expect(result.body).toBe("Novo insumo cadastrado com sucesso");
        expect(result.status).toBe(201);
        
    });

    test("Não deve cadastrar um novo insumo sem nome", async () => {
        const result = await request(app).post('/input')
            .send({ tipo: "Semente", 
                    medida: "KG", 
                    qtd_estoque: 0, 
                    custo_por_unidade: 45.99, 
                    fornecedor: "InovaWave",  
                    observacoes: "Insumo criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Nome do insumo deve ser preenchido");
    });

    test("Não deve cadastrar um novo insumo sem tipo", async () => {
        const result = await request(app).post('/input')
            .send({ nome: "Semente", 
                    medida: "KG", 
                    qtd_estoque: 0, 
                    custo_por_unidade: 45.99, 
                    fornecedor: "InovaWave",  
                    observacoes: "Insumo criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Tipo do insumo deve ser preenchido");
    });

    test("Não deve cadastrar um novo insumo sem unidade de medida", async () => {
        const result = await request(app).post('/input')
            .send({ nome: "teste", 
                    tipo: "teste", 
                    qtd_estoque: 0, 
                    custo_por_unidade: 45.99, 
                    fornecedor: "InovaWave",  
                    observacoes: "Insumo criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Unidade de medida do insumo deve ser preenchido/a");
    });

    test("Não deve cadastrar um novo insumo sem quantidade em estoque", async () => {
        const result = await request(app).post('/input')
            .send({ nome: "teste", 
                    tipo: "teste", 
                    medida: "teste", 
                    custo_por_unidade: 45.99, 
                    fornecedor: "InovaWave",  
                    observacoes: "Insumo criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Quantidade em estoque do insumo deve ser preenchido/a");
    });

    test("Não deve cadastrar um novo insumo sem custo por unidade", async () => {
        const result = await request(app).post('/input')
            .send({ nome: "teste", 
                    tipo: "teste", 
                    medida: "teste", 
                    qtd_estoque: 55.05, 
                    fornecedor: "InovaWave",  
                    observacoes: "Insumo criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Custo por unidade do insumo deve ser preenchido");
    });

    test("Não deve cadastrar um novo insumo sem nome de fornecedor", async () => {
        const result = await request(app).post('/input')
            .send({ nome: "teste", 
                    tipo: "teste", 
                    medida: "teste", 
                    qtd_estoque: 55.05, 
                    custo_por_unidade: 11.5,  
                    observacoes: "Insumo criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Nome do fornecedor do insumo deve ser preenchido");
    });

    test("Não deve cadastrar um novo insumo sem dado do tipo string no campo nome", async () => {
        const result = await request(app).post('/input')
            .send({ nome: 1, 
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo NOME deve ser um texto");
    });

    test("Não deve cadastrar um novo insumo sem dado do tipo string no campo tipo", async () => {
        const result = await request(app).post('/input')
            .send({ nome: "teste", 
                    tipo: 123,
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo TIPO deve ser um texto");
    });

    test("Não deve cadastrar um novo insumo sem dado do tipo string no campo unidade de medida", async () => {
        const result = await request(app).post('/input')
            .send({ nome: "teste", 
                    tipo: "teset",
                    medida: [],

                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo UNIDADE DE MEDIDA deve ser um texto");
    });

    test("Não deve cadastrar um novo insumo sem dado do tipo number no campo quantidade em estoque", async () => {
        const result = await request(app).post('/input')
            .send({ nome: "teste", 
                    tipo: "teset",
                    medida: "ML",
                    qtd_estoque: "fsdafasdf",
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo QUANTIDADE ESTOQUE deve ser um número");
    });

    test("Não deve cadastrar um novo insumo sem dado do tipo number no campo custo por unidade", async () => {
        const result = await request(app).post('/input')
            .send({ nome: "teste", 
                    tipo: "teset",
                    medida: "ML",
                    qtd_estoque: 12.5,
                    custo_por_unidade: {oi: "teste"},
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo CUSTO POR UNIDADE deve ser um número");
    });

    test("Não deve cadastrar um novo insumo sem dado do tipo string no campo nome do fornecedor", async () => {
        const result = await request(app).post('/input')
            .send({ nome: "teste", 
                    tipo: "teset",
                    medida: "ML",
                    qtd_estoque: 12.5,
                    custo_por_unidade: 55.55,
                    fornecedor: true
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo FORNECEDOR deve ser um texto");
    });

    test("Não deve cadastrar um novo insumo sem fornecedor existente", async () => {
        const result = await request(app).post('/input')
            .send({ nome: "Semente de Manga rosa", 
                    tipo: "Semente", 
                    medida: "KG", 
                    qtd_estoque: 0, 
                    custo_por_unidade: 45.99, 
                    fornecedor: "teste",  
                    observacoes: "Insumo criado com teste unitario"
            });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Fornecedor não existe");
    });
    
});

describe("Testes para funcionalidade de alteração total de plantios", () => {
    test.skip("Deve alterar um insumo totalmente", async () => {
        const result = await request(app).put('/input/10')
            .send({ nome: "Semente de Manga rosa", 
                    tipo: "Semente", 
                    medida: "KG", 
                    qtd_estoque: 0, 
                    custo_por_unidade: 45.99, 
                    fornecedor: "InovaWave",  
                    observacoes: "Insumo criado com teste unitario"
                });
        expect(result.body).toBe("Insumo alterado com sucesso");
        expect(result.status).toBe(200);
    });

    test("Não deve alterar um novo insumo sem nome", async () => {
        const result = await request(app).put('/input/10')
            .send({ tipo: "Semente", 
                    medida: "KG", 
                    qtd_estoque: 0, 
                    custo_por_unidade: 45.99, 
                    fornecedor: "InovaWave",  
                    observacoes: "Insumo criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Nome do insumo deve ser preenchido");
    });

    test("Não deve alterar um novo insumo sem tipo", async () => {
        const result = await request(app).put('/input/10')
            .send({ nome: "Semente", 
                    medida: "KG", 
                    qtd_estoque: 0, 
                    custo_por_unidade: 45.99, 
                    fornecedor: "InovaWave",  
                    observacoes: "Insumo criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Tipo do insumo deve ser preenchido");
    });

    test("Não deve alterar um novo insumo sem unidade de medida", async () => {
        const result = await request(app).put('/input/10')
            .send({ nome: "teste", 
                    tipo: "teste", 
                    qtd_estoque: 0, 
                    custo_por_unidade: 45.99, 
                    fornecedor: "InovaWave",  
                    observacoes: "Insumo criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Unidade de medida do insumo deve ser preenchido/a");
    });

    test("Não deve alterar um novo insumo sem quantidade em estoque", async () => {
        const result = await request(app).put('/input/10')
            .send({ nome: "teste", 
                    tipo: "teste", 
                    medida: "teste", 
                    custo_por_unidade: 45.99, 
                    fornecedor: "InovaWave",  
                    observacoes: "Insumo criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Quantidade em estoque do insumo deve ser preenchido/a");
    });

    test("Não deve alterar um novo insumo sem custo por unidade", async () => {
        const result = await request(app).put('/input/10')
            .send({ nome: "teste", 
                    tipo: "teste", 
                    medida: "teste", 
                    qtd_estoque: 55.05, 
                    fornecedor: "InovaWave",  
                    observacoes: "Insumo criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Custo por unidade do insumo deve ser preenchido");
    });

    test("Não deve alterar um novo insumo sem nome de fornecedor", async () => {
        const result = await request(app).put('/input/10')
            .send({ nome: "teste", 
                    tipo: "teste", 
                    medida: "teste", 
                    qtd_estoque: 55.05, 
                    custo_por_unidade: 11.5,  
                    observacoes: "Insumo criado com teste unitario"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Nome do fornecedor do insumo deve ser preenchido");
    });

    test("Não deve alterar um novo insumo sem dado do tipo string no campo nome", async () => {
        const result = await request(app).put('/input/10')
            .send({ nome: 1, 
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo NOME deve ser um texto");
    });

    test("Não deve alterar um novo insumo sem dado do tipo string no campo tipo", async () => {
        const result = await request(app).put('/input/10')
            .send({ nome: "teste", 
                    tipo: 123,
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo TIPO deve ser um texto");
    });

    test("Não deve alterar um novo insumo sem dado do tipo string no campo unidade de medida", async () => {
        const result = await request(app).put('/input/10')
            .send({ nome: "teste", 
                    tipo: "teset",
                    medida: [],

                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo UNIDADE DE MEDIDA deve ser um texto");
    });

    test("Não deve alterar um novo insumo sem dado do tipo number no campo quantidade em estoque", async () => {
        const result = await request(app).put('/input/10')
            .send({ nome: "teste", 
                    tipo: "teset",
                    medida: "ML",
                    qtd_estoque: "fsdafasdf",
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo QUANTIDADE ESTOQUE deve ser um número");
    });

    test("Não deve alterar um novo insumo sem dado do tipo number no campo custo por unidade", async () => {
        const result = await request(app).put('/input/10')
            .send({ nome: "teste", 
                    tipo: "teset",
                    medida: "ML",
                    qtd_estoque: 12.5,
                    custo_por_unidade: {oi: "teste"},
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo CUSTO POR UNIDADE deve ser um número");
    });

    test("Não deve alterar um novo insumo sem dado do tipo string no campo nome do fornecedor", async () => {
        const result = await request(app).put('/input/10')
            .send({ nome: "teste", 
                    tipo: "teset",
                    medida: "ML",
                    qtd_estoque: 12.5,
                    custo_por_unidade: 55.55,
                    fornecedor: true
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo FORNECEDOR deve ser um texto");
    });

    test("Não deve alterar um novo insumo sem fornecedor existente", async () => {
        const result = await request(app).put('/input/10')
            .send({ nome: "Semente de Manga rosa", 
                    tipo: "Semente", 
                    medida: "KG", 
                    qtd_estoque: 0, 
                    custo_por_unidade: 45.99, 
                    fornecedor: "teste",  
                    observacoes: "Insumo criado com teste unitario"
            });

        expect(result.status).toBe(404);
        expect(result.body).toBe("Fornecedor não existe");
    });

    test("Não deve alterar um insumo inexistente", async () => {
        const result = await request(app).put('/input/55')
            .send({ nome: "Semente de Manga rosa", 
                    tipo: "Semente", 
                    medida: "KG", 
                    qtd_estoque: 0, 
                    custo_por_unidade: 45.99, 
                    fornecedor: "EcoGenix",  
                    observacoes: "Insumo criado com teste unitario"
            });

        expect(result.status).toBe(404);
        expect(result.body).toBe("Insumo não encontrado");
    });

});

describe("Testes para funcionalidade de alteração parcial de plantios", () => {
    
    test("Deve alterar nome do insumo com sucesso", async () => {
        const result = await request(app).patch('/input/10')
            .send({ nome: 'teste'});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Insumo alterado com sucesso");
    });

    test("Deve alterar tipo do insumo com sucesso", async () => {
        const result = await request(app).patch('/input/10')
            .send({ tipo: 'teste'});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Insumo alterado com sucesso");
    });

    test("Deve alterar unidade de medida do insumo com sucesso", async () => {
        const result = await request(app).patch('/input/10')
            .send({ medida: 'teste'});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Insumo alterado com sucesso");
    });

    test("Deve alterar quantidade em estoque do insumo com sucesso", async () => {
        const result = await request(app).patch('/input/10')
            .send({ qtd_estoque: 1.26});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Insumo alterado com sucesso");
    });

    test("Deve alterar custo por unidade do insumo com sucesso", async () => {
        const result = await request(app).patch('/input/10')
            .send({ custo_por_unidade: 26.26});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Insumo alterado com sucesso");
    });

    test("Deve alterar nome do fornecedor do insumo com sucesso", async () => {
        const result = await request(app).patch('/input/10')
            .send({ fornecedor: "EcoGenix"});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Insumo alterado com sucesso");
    });

    test("Não deve alterar nome do fornecedor do insumo", async () => {
        const result = await request(app).patch('/input/10')
            .send({ fornecedor: "EcoGeni"});

        expect(result.status).toBe(404);
        expect(result.body).toBe("Fornecedor não existe");
    });

    test("Não deve alterar um novo insumo sem dado do tipo string no campo nome", async () => {
        const result = await request(app).patch('/input/10')
            .send({ nome: 1, 
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo NOME deve ser um texto");
    });

    test("Não deve alterar um novo insumo sem dado do tipo string no campo tipo", async () => {
        const result = await request(app).patch('/input/10')
            .send({ tipo: 1, 
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo TIPO deve ser um texto");
    });

    test("Não deve alterar um novo insumo sem dado do tipo string no campo medida", async () => {
        const result = await request(app).patch('/input/10')
            .send({ medida: true, 
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo UNIDADE DE MEDIDA deve ser um texto");
    });

    test("Não deve alterar insumo não encontrado", async () => {
        const result = await request(app).patch('/input/55')
            .send({ fornecedor: "EcoGenix"});

        expect(result.status).toBe(404);
        expect(result.body).toBe("Insumo não existe");
    });
});

describe("Testes para funcionalidade de deleção de plantios", () => {
    
    test.skip("Deve deletar um insumo", async () => {
        const result = await request(app).delete('/input/14');

        expect(result.status).toBe(200);
        expect(result.body).toBe("Insumo deletado com sucesso");
    });

    test("Não deve deletar um insumo não encontrado", async () => {
        const result = await request(app).delete('/input/55');

        expect(result.status).toBe(404);
        expect(result.body).toBe("Nenhum insumo encontrado");
    });
});