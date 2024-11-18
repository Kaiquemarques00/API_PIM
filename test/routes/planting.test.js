import supertest from "supertest";
import app from "../../src/app.js";

const request = supertest;

describe("Testes para funcionalidade de consulta de plantios", () => {

    test("Deve listar todos os plantios", async () => {
        const result = await request(app).get('/plantings');

        expect(result.status).toBe(200);
        expect(result.body.length).toBeGreaterThan(0);
        result.body.map((planting) => {
            expect(planting).toHaveProperty('plantio_id');
            expect(planting).toHaveProperty('cultura_nome');
            expect(planting).toHaveProperty('data_inicio');
            expect(planting).toHaveProperty('previsao_colheita');
            expect(planting).toHaveProperty('area_plantada');
            expect(planting).toHaveProperty('status');
            expect(planting).toHaveProperty('observacoes');
        });
    });
    
    test("Deve listar um plantio pelo ID", async () => {
        const result = await request(app).get('/planting/1');

        expect(result.status).toBe(200);
        expect(result.body.length).toBeGreaterThan(0);
        result.body.map((planting) => {
            expect(planting).toHaveProperty('plantio_id');
            expect(planting).toHaveProperty('cultura_nome');
            expect(planting).toHaveProperty('data_inicio');
            expect(planting).toHaveProperty('previsao_colheita');
            expect(planting).toHaveProperty('area_plantada');
            expect(planting).toHaveProperty('status');
            expect(planting).toHaveProperty('observacoes');
        });
    });

    test("Não deve listar nenhum plantio", async () => {
        const result = await request(app).get('/planting/50');

        expect(result.status).toBe(404);
        expect(result.body).toBe("Nenhum plantio encontrado");
    });
});

describe("Testes para funcionalidade de cadastro de plantios", () => {
    
    test.skip("Deve cadastrar um novo plantio", async () => {
        const result = await request(app).post('/planting')
            .send({ cultura: "teste",
                    area_plantada: 22.2,
                    status: "concluido"
                });

        expect(result.body).toBe("Novo plantio cadastrado com sucesso");
        expect(result.status).toBe(201);
        
    });

    test("Não deve cadastrar um novo plantio sem cultura referenciada", async () => {
        const result = await request(app).post('/planting')
            .send({ area_plantada: 22.2,
                    status: "concluido"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Nome da cultura deve ser preenchido");
    });

    test("Não deve cadastrar um novo plantio sem area plantada", async () => {
        const result = await request(app).post('/planting')
            .send({ cultura: "teste",
                    status: "concluido"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Área plantada deve ser preenchida");
    });

    test("Não deve cadastrar um novo plantio sem status", async () => {
        const result = await request(app).post('/planting')
            .send({ cultura: "teste",
                area_plantada: 22.2
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Status do plantio deve ser preenchido");
    });

    test("Não deve cadastrar um novo plantio sem dado do tipo string no campo cultura", async () => {
        const result = await request(app).post('/planting')
            .send({ cultura: 1, 
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo CULTURA deve ser um texto");
    });

    test("Não deve cadastrar um novo plantio sem dado do tipo number no campo área plantada", async () => {
        const result = await request(app).post('/planting')
            .send({ cultura: 'tsete',
                    area_plantada: [], 
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo ÁREA PLANTADA deve ser um número");
    });

    test("Não deve cadastrar um novo plantio sem dado do tipo string no campo status", async () => {
        const result = await request(app).post('/planting')
            .send({ cultura: 'tsete',
                    area_plantada: 11,
                    status: 1 
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo STATUS deve ser um texto");
    });

    test("Não deve cadastrar um novo insumo sem cultura existente", async () => {
        const result = await request(app).post('/planting')
            .send({ cultura: "testee",
                    area_plantada: 22.2,
                    status: "concluido"
                });

        expect(result.status).toBe(404);
        expect(result.body).toBe("Cultura não existe");
    });

    test("Não deve cadastrar um novo insumo sem status existente", async () => {
        const result = await request(app).post('/planting')
            .send({ cultura: "testee",
                    area_plantada: 22.2,
                    status: "concluidoo"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Campo que faz referência ao status do plantio incorreto");
    });
    
});

describe("Testes para funcionalidade de alteração total de plantios", () => {
    test.skip("Deve alterar um plantio", async () => {
        const result = await request(app).put('/planting/3')
            .send({ cultura: "teste",
                    area_plantada: 22.2,
                    status: "concluido"
                });

        expect(result.body).toBe("Plantio alterado com sucesso");
        expect(result.status).toBe(200);
        
    });

    test("Não deve alterar um plantio sem cultura referenciada", async () => {
        const result = await request(app).put('/planting/3')
            .send({ area_plantada: 22.2,
                    status: "concluido"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Nome da cultura deve ser preenchido");
    });

    test("Não deve alterar um plantio sem area plantada", async () => {
        const result = await request(app).put('/planting/3')
            .send({ cultura: "teste",
                    status: "concluido"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Área plantada deve ser preenchida");
    });

    test("Não deve alterar um plantio sem status", async () => {
        const result = await request(app).put('/planting/3')
            .send({ cultura: "teste",
                area_plantada: 22.2
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Status do plantio deve ser preenchido");
    });

    test("Não deve alterar um plantio sem dado do tipo string no campo cultura", async () => {
        const result = await request(app).put('/planting/3')
            .send({ cultura: 1, 
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo CULTURA deve ser um texto");
    });

    test("Não deve alterar um plantio sem dado do tipo number no campo área plantada", async () => {
        const result = await request(app).put('/planting/3')
            .send({ cultura: 'tsete',
                    area_plantada: [], 
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo ÁREA PLANTADA deve ser um número");
    });

    test("Não deve alterar um plantio sem dado do tipo string no campo status", async () => {
        const result = await request(app).put('/planting/3')
            .send({ cultura: 'tsete',
                    area_plantada: 11,
                    status: 1 
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo STATUS deve ser um texto");
    });

    test("Não deve alterar um insumo sem cultura existente", async () => {
        const result = await request(app).put('/planting/3')
            .send({ cultura: "testee",
                    area_plantada: 22.2,
                    status: "concluido"
                });

        expect(result.status).toBe(404);
        expect(result.body).toBe("Cultura não existe");
    });

    test("Não deve alterar um insumo sem status existente", async () => {
        const result = await request(app).put('/planting/3')
            .send({ cultura: "testee",
                    area_plantada: 22.2,
                    status: "concluidoo"
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Campo que faz referência ao status do plantio incorreto");
    });

});

describe("Testes para funcionalidade de alteração parcial de plantios", () => {
    
    test("Deve alterar cultura do plantio com sucesso", async () => {
        const result = await request(app).patch('/planting/3')
            .send({ cultura: 'teste'});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Plantio alterado com sucesso");
    });

    test("Deve alterar area plantada do plantio com sucesso", async () => {
        const result = await request(app).patch('/planting/3')
            .send({ area_plantada: 12.6});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Plantio alterado com sucesso");
    });

    test("Deve alterar status do plantio com sucesso", async () => {
        const result = await request(app).patch('/planting/3')
            .send({ status: 'concluido'});

        expect(result.status).toBe(200);
        expect(result.body).toBe("Plantio alterado com sucesso");
    });


    test("Não deve alterar nome da cultura do plantio", async () => {
        const result = await request(app).patch('/planting/3')
            .send({ cultura: "EcoGeni"});

        expect(result.status).toBe(404);
        expect(result.body).toBe("Cultura não existe");
    });

    test("Não deve alterar um plantio sem dado do tipo string no campo cultura", async () => {
        const result = await request(app).patch('/planting/3')
            .send({ cultura: 1, 
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo CULTURA deve ser um texto");
    });

    test("Não deve alterar um plantio sem dado do tipo number no campo área plantada", async () => {
        const result = await request(app).patch('/planting/3')
            .send({ area_plantada: 'oi', 
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo ÁREA PLANTADA deve ser um número");
    });

    test("Não deve alterar um plantio sem dado do tipo string no status", async () => {
        const result = await request(app).patch('/planting/3')
            .send({ status: true, 
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("O campo STATUS deve ser um texto");
    });

    test("Não deve alterar um plantio com dado inserido em status incorreto", async () => {
        const result = await request(app).patch('/planting/3')
            .send({ status: 'concluidooo', 
                });

        expect(result.status).toBe(422);
        expect(result.body).toBe("Campo que faz referência ao status do plantio incorreto");
    });

    test("Não deve alterar plantio sem dados para atualizar", async () => {
        const result = await request(app).patch('/planting/3')
            .send();

        expect(result.status).toBe(400);
        expect(result.body).toBe("Nenhum campo para atualizar");
    });

    test("Não deve alterar insumo não encontrado", async () => {
        const result = await request(app).patch('/planting/55')
            .send({ cultura: "teste"});

        expect(result.status).toBe(404);
        expect(result.body).toBe("Plantio não existe");
    });
});

describe("Testes para funcionalidade de deleção de plantios", () => {
    
    test.skip("Deve deletar um plantio", async () => {
        const result = await request(app).delete('/planting/2');

        expect(result.status).toBe(200);
        expect(result.body).toBe("Plantio deletado com sucesso");
    });

    test("Não deve deletar um plantio não encontrado", async () => {
        const result = await request(app).delete('/planting/55');

        expect(result.status).toBe(404);
        expect(result.body).toBe("Nenhum plantio encontrado");
    });
});