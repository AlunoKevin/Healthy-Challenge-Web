const jogoService = require('../src/services/jogoService');

const partidaService = require('../src/services/partidaService');
const jogoModel = require('../src/models/jogoModel');
const usuarioModel = require('../src/models/usuarioModel');
const ligaService = require('../src/services/ligaService');
const leaderboardModel = require('../src/models/leaderboard');

jest.mock('../src/services/partidaService');
jest.mock('../src/models/jogoModel');
jest.mock('../src/models/usuarioModel');
jest.mock('../src/services/ligaService');
jest.mock('../src/models/leaderboard');

describe('jogoService', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('iniciarPartida', () => {

        test('deve iniciar uma nova partida', async () => {

            const partida = {
                rodada: 1,
                nivel: 1,
                dimensao: 5
            };

            partidaService.iniciarPartida.mockResolvedValue(partida);

            const resultado =
                await jogoService.iniciarPartida(1);

            expect(partidaService.iniciarPartida)
                .toHaveBeenCalledWith(1);

            expect(resultado).toEqual(partida);

        });

    });

    describe('jogar', () => {

        test('deve lançar erro quando a partida não existir', async () => {

            partidaService.buscarPartida.mockReturnValue(undefined);

            await expect(
                jogoService.jogar(1, [], 100)
            ).rejects.toMatchObject({
                status: 404
            });

        });

        test('deve retornar rodada correta quando acertar', async () => {

            const partida = {};

            partidaService.buscarPartida.mockReturnValue(partida);

            partidaService.validarJogada.mockReturnValue({

                resultado: 'acertou',

                rodada: 2,

                pontos_totais: 30

            });

            const resultado =
                await jogoService.jogar(1, [], 200);

            expect(resultado.resultado)
                .toBe('acertou');

            expect(partidaService.finalizarPartida)
                .not.toHaveBeenCalled();

        });

        test('deve finalizar partida em caso de derrota', async () => {

            const partida = {};

            partidaService.buscarPartida.mockReturnValue(partida);

            partidaService.validarJogada.mockReturnValue({

                resultado: 'derrota',

                motivo: 'tempo_esgotado'

            });

            const resultado =
                await jogoService.jogar(1, [], 0);

            expect(resultado.resultado)
                .toBe('derrota');

            expect(partidaService.finalizarPartida)
                .toHaveBeenCalledWith(1);

        });

        test('deve concluir o jogo quando receber vitória', async () => {

            const partida = {};

            partidaService.buscarPartida.mockReturnValue(partida);

            partidaService.validarJogada.mockReturnValue({

                resultado: 'vitoria',

                pontos_totais: 450

            });

            jogoModel.buscarDesafioMemoria.mockResolvedValue({
                id_desafio: 7
            });

            jogoModel.jaConcluiu.mockResolvedValue(false);

            jogoModel.registrarConclusao.mockResolvedValue();

            usuarioModel.buscarEstatisticas.mockResolvedValue({

                pontos_totais: 450,

                desafios_concluidos: 5

            });

            ligaService.atualizarProgressao.mockResolvedValue();

            jogoModel.atualizarLeaderboards.mockResolvedValue();

            ligaService.buscarMinhaLiga.mockResolvedValue({

                id_liga: 3,

                nome: 'Prata'

            });

            leaderboardModel.buscarPosicaoDoUsuario.mockResolvedValue({

                posicao: 8,

                pontuacao_total: 450

            });

            const resultado =
                await jogoService.jogar(1, [], 100);

            expect(jogoModel.buscarDesafioMemoria)
                .toHaveBeenCalled();

            expect(jogoModel.jaConcluiu)
                .toHaveBeenCalledWith(1, 7);

            expect(jogoModel.registrarConclusao)
                .toHaveBeenCalledWith(
                    1,
                    7,
                    450
                );

            expect(ligaService.atualizarProgressao)
                .toHaveBeenCalledWith(
                    1,
                    450
                );

            expect(jogoModel.atualizarLeaderboards)
                .toHaveBeenCalled();

            expect(partidaService.finalizarPartida)
                .toHaveBeenCalledWith(1);

            expect(resultado).toEqual({

                resultado: 'vitoria',

                pontos_totais: 450,

                desafios_concluidos: 5,

                liga: {

                    id_liga: 3,

                    nome: 'Prata'

                },

                ranking: {

                    posicao: 8,

                    pontuacao_total: 450

                },

                desafio_concluido: true,

                liga_atualizada: true

            });

        });

        test('deve lançar erro quando desafio de memória não existir', async () => {

            const partida = {};

            partidaService.buscarPartida.mockReturnValue(partida);

            partidaService.validarJogada.mockReturnValue({

                resultado: 'vitoria',

                pontos_totais: 100

            });

            jogoModel.buscarDesafioMemoria.mockResolvedValue(null);

            await expect(

                jogoService.jogar(1, [], 100)

            ).rejects.toMatchObject({

                status: 404

            });

        });

        test('deve lançar erro quando desafio já foi concluído', async () => {

            const partida = {};

            partidaService.buscarPartida.mockReturnValue(partida);

            partidaService.validarJogada.mockReturnValue({

                resultado: 'vitoria',

                pontos_totais: 100

            });

            jogoModel.buscarDesafioMemoria.mockResolvedValue({

                id_desafio: 5

            });

            jogoModel.jaConcluiu.mockResolvedValue(true);

            await expect(

                jogoService.jogar(1, [], 100)

            ).rejects.toMatchObject({

                status: 409

            });

        });

    });

    describe('abandonarPartida', () => {

        test('deve remover partida da memória', () => {

            jogoService.abandonarPartida(5);

            expect(partidaService.finalizarPartida)
                .toHaveBeenCalledWith(5);

        });

    });

});