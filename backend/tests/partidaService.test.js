const partidaService = require('../src/services/partidaService');
const partidas = require('../src/memory/partidas');
const perfilModel = require('../src/models/perfilModel');
const matrizUtils = require('../src/utils/matrizUtils');

jest.mock('../src/memory/partidas');
jest.mock('../src/models/perfilModel');
jest.mock('../src/utils/matrizUtils');

describe('partidaService', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('calcularMultiplicadorCombo', () => {

        test('combo 1 retorna 1', () => {
            expect(partidaService.calcularMultiplicadorCombo(1)).toBe(1);
        });

        test('combo 2 retorna 1.1', () => {
            expect(partidaService.calcularMultiplicadorCombo(2)).toBe(1.1);
        });

        test('combo 5 retorna 1.25', () => {
            expect(partidaService.calcularMultiplicadorCombo(5)).toBe(1.25);
        });

        test('combo 8 retorna 1.5', () => {
            expect(partidaService.calcularMultiplicadorCombo(8)).toBe(1.5);
        });

        test('combo 12 retorna 2', () => {
            expect(partidaService.calcularMultiplicadorCombo(12)).toBe(2);
        });

    });

    describe('calcularPontos', () => {

        test('calcula corretamente os pontos', () => {

            const partida = {
                tempoRestante: 180,
                quantidadeAtivos: 4,
                multiplicador: 1.5,
                combo: 5
            };

            const pontos = partidaService.calcularPontos(partida);

            expect(pontos).toBe(
                Math.round(
                    15 * 4 * 1.5 * 1.25
                ) + 6
            );

        });

    });

    describe('aumentarNivel', () => {

        test('aumenta o nível a cada três rodadas', () => {

            const partida = {
                rodada: 3,
                nivel: 1
            };

            partidaService.aumentarNivel(partida);

            expect(partida.nivel).toBe(2);

        });

        test('não aumenta quando não é múltiplo de três', () => {

            const partida = {
                rodada: 2,
                nivel: 1
            };

            partidaService.aumentarNivel(partida);

            expect(partida.nivel).toBe(1);

        });

    });

    describe('aumentarQuantidadeAtivos', () => {

        test('incrementa quantidade de ativos', () => {

            const partida = {
                dificuldade: 'F',
                quantidadeAtivos: 2
            };

            partidaService.aumentarQuantidadeAtivos(partida);

            expect(partida.quantidadeAtivos).toBe(3);

        });

        test('não ultrapassa o máximo', () => {

            const partida = {
                dificuldade: 'F',
                quantidadeAtivos: 10
            };

            partidaService.aumentarQuantidadeAtivos(partida);

            expect(partida.quantidadeAtivos).toBe(10);

        });

    });

    describe('gerarNovaRodada', () => {

        test('gera uma nova matriz', () => {

            matrizUtils.gerarMatriz.mockReturnValue([[1]]);

            const partida = {
                dimensao: 5,
                quantidadeAtivos: 2
            };

            partidaService.gerarNovaRodada(partida);

            expect(matrizUtils.gerarMatriz).toHaveBeenCalledWith(
                5,
                2
            );

            expect(partida.matriz).toEqual([[1]]);

        });

    });

    describe('iniciarPartida', () => {

        test('cria uma nova partida', async () => {

            partidas.existePartida.mockReturnValue(false);

            perfilModel.buscarPerfil.mockResolvedValue({
                nivel_dificuldade: 'F'
            });

            matrizUtils.gerarMatriz.mockReturnValue([[0]]);

            partidas.criarPartida.mockImplementation(() => {});

            const resposta =
                await partidaService.iniciarPartida(1);

            expect(partidas.criarPartida).toHaveBeenCalled();

            expect(resposta.rodada).toBe(1);
            expect(resposta.nivel).toBe(1);
            expect(resposta.dimensao).toBe(5);
            expect(resposta.quantidade_ativos).toBe(2);

        });

        test('erro quando usuário já possui partida', async () => {

            partidas.existePartida.mockReturnValue(true);

            await expect(
                partidaService.iniciarPartida(1)
            ).rejects.toThrow(
                'usuario ja possui uma partida ativa'
            );

        });

        test('erro quando usuário não existe', async () => {

            partidas.existePartida.mockReturnValue(false);

            perfilModel.buscarPerfil.mockResolvedValue(null);

            await expect(
                partidaService.iniciarPartida(1)
            ).rejects.toThrow(
                'usuario nao encontrado'
            );

        });

    });

    describe('buscarPartida', () => {

        test('retorna a partida armazenada', () => {

            const partida = {
                idUsuario: 1
            };

            partidas.buscarPartida.mockReturnValue(partida);

            const resultado =
                partidaService.buscarPartida(1);

            expect(resultado).toEqual(partida);

        });

    });

    describe('finalizarPartida', () => {

        test('remove partida da memória', () => {

            partidaService.finalizarPartida(5);

            expect(partidas.removerPartida)
                .toHaveBeenCalledWith(5);

        });

    });

    describe('validarJogada', () => {

        test('retorna derrota por tempo', () => {

            const partida = {
                pontos: 50,
                rodada: 4
            };

            const resultado =
                partidaService.validarJogada(
                    partida,
                    [],
                    0
                );

            expect(resultado.resultado).toBe('derrota');
            expect(resultado.motivo).toBe('tempo_esgotado');

        });

        test('retorna derrota por posição incorreta', () => {

            matrizUtils.validarJogada.mockReturnValue(false);

            const partida = {
                matriz: [],
                combo: 4,
                pontos: 80,
                rodada: 6
            };

            const resultado =
                partidaService.validarJogada(
                    partida,
                    [],
                    100
                );

            expect(resultado.resultado).toBe('derrota');
            expect(resultado.motivo).toBe('posicao_incorreta');
            expect(partida.combo).toBe(1);

        });

        test('retorna acerto', () => {

            matrizUtils.validarJogada.mockReturnValue(true);

            matrizUtils.gerarMatriz.mockReturnValue([[1]]);

            const partida = {

                dificuldade: 'F',

                matriz: [],

                combo: 1,

                pontos: 0,

                rodada: 1,

                nivel: 1,

                quantidadeAtivos: 2,

                multiplicador: 1,

                tempoRestante: 200,

                tempoMemorizacao: 4,

                dimensao: 5

            };

            const resultado =
                partidaService.validarJogada(
                    partida,
                    [],
                    200
                );

            expect(resultado.resultado)
                .toBe('acertou');

            expect(resultado.rodada)
                .toBe(2);

            expect(resultado.quantidade_ativos)
                .toBe(3);

            expect(resultado.pontos_totais)
                .toBeGreaterThan(0);

        });

        test('retorna vitória quando ultrapassa número máximo de rodadas', () => {

            matrizUtils.validarJogada.mockReturnValue(true);

            const partida = {

                dificuldade: 'F',

                matriz: [],

                combo: 5,

                pontos: 300,

                rodada: 9,

                nivel: 3,

                quantidadeAtivos: 10,

                multiplicador: 1,

                tempoRestante: 200,

                tempoMemorizacao: 4,

                dimensao: 5

            };

            const resultado =
                partidaService.validarJogada(
                    partida,
                    [],
                    200
                );

            expect(resultado.resultado)
                .toBe('vitoria');

            expect(resultado.pontos_totais)
                .toBeGreaterThan(300);

        });

    });

});