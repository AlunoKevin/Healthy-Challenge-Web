const partidas = require('../src/memory/partidas');

describe('memory/partidas', () => {

    beforeEach(() => {
        partidas.limparPartidas();
    });

    test('cria uma partida', () => {

        const partida = {
            idUsuario: 1,
            rodada: 1
        };

        const resultado = partidas.criarPartida(1, partida);

        expect(resultado).toEqual(partida);

        expect(partidas.quantidadePartidas())
            .toBe(1);

    });

    test('busca uma partida existente', () => {

        const partida = {
            rodada: 3
        };

        partidas.criarPartida(10, partida);

        expect(
            partidas.buscarPartida(10)
        ).toEqual(partida);

    });

    test('retorna undefined para partida inexistente', () => {

        expect(
            partidas.buscarPartida(999)
        ).toBeUndefined();

    });

    test('atualiza uma partida existente', () => {

        partidas.criarPartida(1, {
            rodada: 1
        });

        const novaPartida = {
            rodada: 2,
            pontos: 50
        };

        const resultado =
            partidas.atualizarPartida(1, novaPartida);

        expect(resultado)
            .toEqual(novaPartida);

        expect(
            partidas.buscarPartida(1)
        ).toEqual(novaPartida);

    });

    test('remove uma partida existente', () => {

        partidas.criarPartida(1, {});

        const removido =
            partidas.removerPartida(1);

        expect(removido)
            .toBe(true);

        expect(
            partidas.buscarPartida(1)
        ).toBeUndefined();

        expect(
            partidas.quantidadePartidas()
        ).toBe(0);

    });

    test('retorna false ao remover partida inexistente', () => {

        expect(
            partidas.removerPartida(100)
        ).toBe(false);

    });

    test('verifica existência da partida', () => {

        partidas.criarPartida(5, {});

        expect(
            partidas.existePartida(5)
        ).toBe(true);

        expect(
            partidas.existePartida(6)
        ).toBe(false);

    });

    test('limpa todas as partidas', () => {

        partidas.criarPartida(1, {});
        partidas.criarPartida(2, {});
        partidas.criarPartida(3, {});

        expect(
            partidas.quantidadePartidas()
        ).toBe(3);

        partidas.limparPartidas();

        expect(
            partidas.quantidadePartidas()
        ).toBe(0);

        expect(
            partidas.buscarPartida(1)
        ).toBeUndefined();

        expect(
            partidas.buscarPartida(2)
        ).toBeUndefined();

        expect(
            partidas.buscarPartida(3)
        ).toBeUndefined();

    });

    test('retorna corretamente a quantidade de partidas', () => {

        expect(
            partidas.quantidadePartidas()
        ).toBe(0);

        partidas.criarPartida(1, {});
        partidas.criarPartida(2, {});

        expect(
            partidas.quantidadePartidas()
        ).toBe(2);

    });

});