const jogoController = require('../src/controllers/jogoController');
const jogoService = require('../src/services/jogoService');

jest.mock('../src/services/jogoService');

describe('jogoController', () => {

    let req;
    let res;

    beforeEach(() => {

        jest.clearAllMocks();

        req = {

            usuario:{
                id_usuario:1
            },

            body:{}

        };

        res = {

            status:jest.fn().mockReturnThis(),

            json:jest.fn()

        };

    });

    describe('iniciarPartida', () => {

        test('retorna partida iniciada', async () => {

            jogoService.iniciarPartida.mockResolvedValue({

                rodada:1,

                nivel:1

            });

            await jogoController.iniciarPartida(req,res);

            expect(jogoService.iniciarPartida)
                .toHaveBeenCalledWith(1);

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({

                    rodada:1,

                    nivel:1

                });

        });

        test('retorna erro do service', async () => {

            const erro = new Error('erro');

            erro.status = 404;

            jogoService.iniciarPartida.mockRejectedValue(erro);

            await jogoController.iniciarPartida(req,res);

            expect(res.status)
                .toHaveBeenCalledWith(404);

            expect(res.json)
                .toHaveBeenCalledWith({

                    erro:'erro'

                });

        });

    });

    describe('jogar', () => {

        test('retorna resultado da jogada', async () => {

            req.body = {

                posicoes:[[0,0]],

                tempo_restante:210

            };

            jogoService.jogar.mockResolvedValue({

                resultado:'acertou'

            });

            await jogoController.jogar(req,res);

            expect(jogoService.jogar)
                .toHaveBeenCalledWith(

                    1,

                    [[0,0]],

                    210

                );

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({

                    resultado:'acertou'

                });

        });

        test('retorna erro da jogada', async () => {

            req.body = {

                posicoes:[],

                tempo_restante:0

            };

            const erro = new Error('partida nao encontrada');

            erro.status = 404;

            jogoService.jogar.mockRejectedValue(erro);

            await jogoController.jogar(req,res);

            expect(res.status)
                .toHaveBeenCalledWith(404);

            expect(res.json)
                .toHaveBeenCalledWith({

                    erro:'partida nao encontrada'

                });

        });

    });

    describe('abandonarPartida', () => {

        test('encerra partida', async () => {

            jogoService.abandonarPartida.mockResolvedValue();

            await jogoController.abandonarPartida(req,res);

            expect(jogoService.abandonarPartida)
                .toHaveBeenCalledWith(1);

            expect(res.status)
                .toHaveBeenCalledWith(200);

            expect(res.json)
                .toHaveBeenCalledWith({

                    mensagem:'partida encerrada'

                });

        });

        test('retorna erro ao abandonar', async () => {

            const erro = new Error('erro');

            erro.status = 500;

            jogoService.abandonarPartida.mockRejectedValue(erro);

            await jogoController.abandonarPartida(req,res);

            expect(res.status)
                .toHaveBeenCalledWith(500);

            expect(res.json)
                .toHaveBeenCalledWith({

                    erro:'erro interno do servidor'

                });

        });

    });

});