const pool = require('../src/config/conexao');
const jogoModel = require('../src/models/jogoModel');

jest.mock('../src/config/conexao');

describe('jogoModel', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('buscarDesafioMemoria', () => {

        test('retorna o desafio de memória', async () => {

            pool.query.mockResolvedValue({
                rows: [
                    {
                        id_desafio: 5,
                        pontuacao_prevista: 300
                    }
                ]
            });

            const resultado =
                await jogoModel.buscarDesafioMemoria();

            expect(pool.query).toHaveBeenCalled();

            expect(resultado).toEqual({
                id_desafio: 5,
                pontuacao_prevista: 300
            });

        });

        test('retorna undefined quando não existir', async () => {

            pool.query.mockResolvedValue({
                rows: []
            });

            const resultado =
                await jogoModel.buscarDesafioMemoria();

            expect(resultado).toBeUndefined();

        });

    });

    describe('registrarConclusao', () => {

        test('insere uma conclusão', async () => {

            const conclusao = {

                id_usuario: 1,

                id_desafio: 5,

                pontuacao: 420,

                status: 'concluido'

            };

            pool.query.mockResolvedValue({

                rows: [conclusao]

            });

            const resultado =
                await jogoModel.registrarConclusao(
                    1,
                    5,
                    420
                );

            expect(pool.query).toHaveBeenCalled();

            expect(resultado).toEqual(conclusao);

        });

    });

    describe('jaConcluiu', () => {

        test('retorna true quando existir conclusão', async () => {

            pool.query.mockResolvedValue({

                rowCount: 1

            });

            const resultado =
                await jogoModel.jaConcluiu(1,5);

            expect(resultado).toBe(true);

        });

        test('retorna false quando não existir', async () => {

            pool.query.mockResolvedValue({

                rowCount: 0

            });

            const resultado =
                await jogoModel.jaConcluiu(1,5);

            expect(resultado).toBe(false);

        });

    });

    describe('buscarPontuacaoTotal', () => {

        test('retorna a pontuação total', async () => {

            pool.query.mockResolvedValue({

                rows:[
                    {
                        pontos_totais:520
                    }
                ]

            });

            const resultado =
                await jogoModel.buscarPontuacaoTotal(1);

            expect(resultado).toEqual({

                pontos_totais:520

            });

        });

    });

    describe('atualizarLeaderboards', () => {

        test('atualiza as duas materialized views', async () => {

            pool.query.mockResolvedValue({});

            await jogoModel.atualizarLeaderboards();

            expect(pool.query).toHaveBeenNthCalledWith(
                1,
                'REFRESH MATERIALIZED VIEW mv_leaderboard_global'
            );

            expect(pool.query).toHaveBeenNthCalledWith(
                2,
                'REFRESH MATERIALIZED VIEW mv_leaderboard_grupo'
            );

        });

    });

    describe('atualizarLigas', () => {

        test('executa procedure atualizar_ligas', async () => {

            pool.query.mockResolvedValue({});

            await jogoModel.atualizarLigas();

            expect(pool.query).toHaveBeenCalledWith(
                'SELECT atualizar_ligas()'
            );

        });

    });

});