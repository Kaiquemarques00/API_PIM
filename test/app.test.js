import supertest from "supertest";
import app from "../src/app.js"

const request = supertest;

test("Deve responder na raiz", async () => {
    await request(app).get('/')
        .then(res => expect(res.status).toBe(200));
});