import supertest from "supertest";
import app from "../../src/app.js";

const request = supertest;

describe("Testes para funcionalidade de consulta de culturas", () => {

    test("Deve listar todas as culturas", async () => {
        const result = await request(app).get('/cultures');

        expect(result.status).toBe(200);
        expect(result.body.length).toBeGreaterThan(0);
        result.body.map((culture) => {
            expect(culture).toHaveProperty('nome');
            expect(culture).toHaveProperty('ciclo_cultivo_dias');
            expect(culture).toHaveProperty('descricao');
        });
    });
    
    test("Deve listar uma cultura pelo ID", async () => {
        const result = await request(app).get('/culture/1');

        expect(result.status).toBe(200);
        expect(result.body.length).toBeGreaterThan(0);
        result.body.map((culture) => {
            expect(culture).toHaveProperty('nome');
            expect(culture).toHaveProperty('ciclo_cultivo_dias');
            expect(culture).toHaveProperty('descricao');
        });
    });

    test("Não deve listar nenhuma cultura", async () => {
        const result = await request(app).get('/culture/50');

        expect(result.status).toBe(404);
        expect(result.body).toBe("Nenhuma cultura encontrada");
    });
});

describe("Testes para funcionalidade de cadastro de cultura", () => {
    
    test.skip("Deve cadastrar uma nova cultura", async () => {
        const result = await request(app).post('/culture')
            .send({ nome: "Semente de Manga rosa", 
                    ciclo: 88, 
                    descricao: "Teste número 12"
                });

                expect(result.body).toBe("Nova cultura cadastrada com sucesso");
        expect(result.status).toBe(201);
        
    });

    test("Não deve cadastrar uma nova cultura sem nome", async () => {
        const result = await request(app).post('/culture')
            .send({ ciclo: 88, 
                    descricao: "Teste número 12"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Nome da cultura deve ser preenchido");
    });

    test("Não deve cadastrar uma nova cultura sem ciclo de cultivo", async () => {
        const result = await request(app).post('/culture')
            .send({ nome: "teste unitário", 
                    descricao: "Teste número 12"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Ciclo da cultura deve ser preenchido");
    });

    test("Não deve cadastrar uma nova cultura sem descrição", async () => {
        const result = await request(app).post('/culture')
            .send({ nome: "teste unitário", 
                    ciclo: 333
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Descrição da cultura deve ser preenchido");
    });


    test("Não deve cadastrar uma nova cultura sem dado do tipo string no campo nome", async () => {
        const result = await request(app).post('/culture')
            .send({ nome: 1, 
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo NOME deve ser um texto");
    });

    test("Não deve cadastrar uma nova cultura sem dado do tipo number no campo ciclo", async () => {
        const result = await request(app).post('/culture')
            .send({ nome: "easiif",
                    ciclo: [1, 2],
                    descricao: "fegfsgsfdg"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo CICLO deve ser um número");
    });

    test("Não deve cadastrar uma nova cultura sem dado do tipo string no campo descrição", async () => {
        const result = await request(app).post('/culture')
            .send({ nome: "oi",
                    ciclo: 456,
                    descricao: true
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo DESCRIÇÃO deve ser um texto");
    });
    
});

describe("Testes para funcionalidade de alteração total de cultura", () => {
    test.skip("Deve alterar uma cultura totalmente", async () => {
        const result = await request(app).put('/culture/3')
            .send({ nome: "Semente de Manga rosa", 
                    ciclo: 77, 
                    descricao: "Teste unitario de alteração total"
                });
        expect(result.body).toBe("Insumo alterado com sucesso");
        expect(result.status).toBe(200);
    });

    test("Não deve alterar uma nova cultura sem nome", async () => {
        const result = await request(app).put('/culture/3')
            .send({ ciclo: 11, 
                    descricao: "Teste unitário total"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Nome da cultura deve ser preenchido");
    });

    test("Não deve alterar uma nova cultura sem ciclo", async () => {
        const result = await request(app).put('/culture/3')
            .send({ nome: "TEste", 
                    descricao: "Teste unitário total"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Ciclo da cultura deve ser preenchido");
    });

    test("Não deve alterar uma nova cultura sem descrição", async () => {
        const result = await request(app).put('/culture/3')
            .send({ nome: "TEsetes", 
                    ciclo: 33
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Descrição da cultura deve ser preenchido/a");
    });


    test("Não deve alterar uma nova cultura sem dado do tipo string no campo nome", async () => {
        const result = await request(app).put('/culture/3')
            .send({ nome: 1, 
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo NOME deve ser um texto");
    });

    test("Não deve alterar uma nova cultura sem dado do tipo number no campo ciclo", async () => {
        const result = await request(app).put('/culture/3')
            .send({ nome: "43234234",
                    ciclo: "ola",
                    descricao: "fsfsfsf"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo CICLO deve ser um número");
    });

    test("Não deve alterar uma nova cultura sem dado do tipo string no campo descrição", async () => {
        const result = await request(app).put('/culture/3')
            .send({ nome: "324234",
                    ciclo: 123,
                    descricao: {}, 
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo DESCRIÇÃO deve ser um texto");
    });

    test("Não deve alterar uma cultura inexistente", async () => {
        const result = await request(app).put('/culture/55')
            .send({ nome: "Semente de Manga rosa", 
                    ciclo: 55, 
                    descricao: "TEssssssste"
            });

        expect(result.status).toBe(404);
        expect(result.body).toBe("Cultura não encontrada");
    });

});

describe("Testes para funcionalidade de alteração parcial de culturas", () => {
    
    test("Deve alterar nome da cultura com sucesso", async () => {
        const result = await request(app).patch('/culture/4')
            .send({ nome: 'teste'});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Cultura alterada com sucesso");
    });

    test("Deve alterar ciclo da cultura com sucesso", async () => {
        const result = await request(app).patch('/culture/4')
            .send({ ciclo: 11});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Cultura alterada com sucesso");
    });

    test("Deve alterar descrição da cultura com sucesso", async () => {
        const result = await request(app).patch('/culture/4')
            .send({ descricao: "123"});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Cultura alterada com sucesso");
    });

    test("Não deve alterar uma nova cultura sem dado do tipo string no campo nome", async () => {
        const result = await request(app).patch('/culture/4')
            .send({ nome: 1, 
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo NOME deve ser um texto");
    });

    test("Não deve alterar uma nova cultura sem dado do tipo number no campo ciclo", async () => {
        const result = await request(app).patch('/culture/4')
            .send({ ciclo: "ola", 
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo CICLO deve ser um número");
    });

    test("Não deve alterar uma nova cultura sem dado do tipo string no campo descrição", async () => {
        const result = await request(app).patch('/culture/4')
            .send({ descricao: 123, 
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo DESCRIÇÃO deve ser um texto");
    });

    test("Não deve alterar cultura não encontrada", async () => {
        const result = await request(app).patch('/culture/55')
            .send({ nome: "EcoGenix"});

        expect(result.status).toBe(404);
        expect(result.body).toBe("Cultura não existe");
    });

    test("Não deve alterar cultura sem dados para atualizar", async () => {
        const result = await request(app).patch('/culture/4')
            .send();

        expect(result.status).toBe(400);
        expect(result.body).toBe("Nenhum campo para atualizar");
    });
});

describe("Testes para funcionalidade de deleção de cultura", () => {
    
    test.skip("Deve deletar uma cultura", async () => {
        const result = await request(app).delete('/cultura/4');

        expect(result.status).toBe(200);
        expect(result.body).toBe("Cultura deletada com sucesso");
    });

    test("Não deve deletar uma cultura não encontrada", async () => {
        const result = await request(app).delete('/culture/55');

        expect(result.status).toBe(404);
        expect(result.body).toBe("Nenhuma cultura encontrada");
    });
});