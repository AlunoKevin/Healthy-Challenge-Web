const request = require('supertest');
const express = require('express');

const jogoController = require('../src/controllers/jogoController');

jest.mock('../src/controllers/jogoController', () => ({
    iniciarPartida: jest.fn((req, res) => res.status(200).json({ ok: true })),
    jogar: jest.fn((req, res) => res.status(200).json({ ok: true })),
    abandonarPartida: jest.fn((req, res) => res.status(200).json({ ok: true }))
}));

// Mock do middleware de autenticação
jest.mock('../src/middlewares/autenticacao', () => {
    return (req, res, next) => {
        req.usuario = {
            id_usuario: 1
        };
        next();
    };
});

const jogoRoutes = require('../src/routes/jogoRoutes');

const app = express();

app.use(express.json());
app.use('/jogo', jogoRoutes);

describe('Rotas de Jogo', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /jogo/iniciar', () => {

        test('deve chamar iniciarPartida', async () => {

            const resposta = await request(app)
                .post('/jogo/iniciar');

            expect(resposta.status).toBe(200);

            expect(jogoController.iniciarPartida)
                .toHaveBeenCalledTimes(1);

        });

    });

    describe('POST /jogo/jogada', () => {

        test('deve chamar jogar', async () => {

            const resposta = await request(app)
                .post('/jogo/jogada')
                .send({
                    posicoes: [[0,0]],
                    tempo_restante: 210
                });

            expect(resposta.status).toBe(200);

            expect(jogoController.jogar)
                .toHaveBeenCalledTimes(1);

        });

    });

    describe('DELETE /jogo/abandonar', () => {

        test('deve chamar abandonarPartida', async () => {

            const resposta = await request(app)
                .delete('/jogo/abandonar');

            expect(resposta.status).toBe(200);

            expect(jogoController.abandonarPartida)
                .toHaveBeenCalledTimes(1);

        });

    });

});