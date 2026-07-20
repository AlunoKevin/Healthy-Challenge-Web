const matrizUtils = require('../src/utils/matriz');

describe('matrizUtils', () => {

    describe('criarMatriz', () => {

        test('cria matriz NxN preenchida com zeros', () => {

            const matriz = matrizUtils.criarMatriz(4);

            expect(matriz.length).toBe(4);

            matriz.forEach(linha => {

                expect(linha.length).toBe(4);

                linha.forEach(valor => {
                    expect(valor).toBe(0);
                });

            });

        });

    });

    describe('gerarPosicoesAleatorias', () => {

        test('gera exatamente a quantidade solicitada', () => {

            const posicoes =
                matrizUtils.gerarPosicoesAleatorias(5,6);

            expect(posicoes.length).toBe(6);

        });

        test('não gera posições repetidas', () => {

            const posicoes =
                matrizUtils.gerarPosicoesAleatorias(6,10);

            const conjunto = new Set(
                posicoes.map(([l,c])=>`${l}-${c}`)
            );

            expect(conjunto.size)
                .toBe(posicoes.length);

        });

        test('todas as posições estão dentro da matriz', () => {

            const dimensao = 7;

            const posicoes =
                matrizUtils.gerarPosicoesAleatorias(
                    dimensao,
                    12
                );

            posicoes.forEach(([linha,coluna])=>{

                expect(linha).toBeGreaterThanOrEqual(0);
                expect(linha).toBeLessThan(dimensao);

                expect(coluna).toBeGreaterThanOrEqual(0);
                expect(coluna).toBeLessThan(dimensao);

            });

        });

    });

    describe('ativarPosicoes', () => {

        test('marca corretamente as posições da matriz', () => {

            const matriz =
                matrizUtils.criarMatriz(3);

            matrizUtils.ativarPosicoes(

                matriz,

                [

                    [0,1],
                    [2,2]

                ]

            );

            expect(matriz[0][1]).toBe(1);

            expect(matriz[2][2]).toBe(1);

            expect(matriz[0][0]).toBe(0);

            expect(matriz[1][1]).toBe(0);

        });

    });

    describe('obterPosicoesAtivas', () => {

        test('retorna somente as posições iguais a 1', () => {

            const matriz = [

                [0,1,0],

                [1,0,0],

                [0,0,1]

            ];

            expect(

                matrizUtils.obterPosicoesAtivas(matriz)

            ).toEqual(

                [

                    [0,1],

                    [1,0],

                    [2,2]

                ]

            );

        });

        test('retorna vetor vazio quando não houver posições ativas', () => {

            const matriz = [

                [0,0],

                [0,0]

            ];

            expect(

                matrizUtils.obterPosicoesAtivas(matriz)

            ).toEqual([]);

        });

    });

    describe('compararJogada', () => {

        const matriz = [

            [0,1,0],

            [1,0,0],

            [0,0,1]

        ];

        test('retorna true para jogada correta', () => {

            expect(

                matrizUtils.compararJogada(

                    matriz,

                    [

                        [0,1],

                        [1,0],

                        [2,2]

                    ]

                )

            ).toBe(true);

        });

        test('ordem das posições não influencia', () => {

            expect(

                matrizUtils.compararJogada(

                    matriz,

                    [

                        [2,2],

                        [0,1],

                        [1,0]

                    ]

                )

            ).toBe(true);

        });

        test('retorna false quando faltar posição', () => {

            expect(

                matrizUtils.compararJogada(

                    matriz,

                    [

                        [0,1],

                        [1,0]

                    ]

                )

            ).toBe(false);

        });

        test('retorna false quando houver posição errada', () => {

            expect(

                matrizUtils.compararJogada(

                    matriz,

                    [

                        [0,1],

                        [1,0],

                        [0,0]

                    ]

                )

            ).toBe(false);

        });

        test('retorna false quando houver posições extras', () => {

            expect(

                matrizUtils.compararJogada(

                    matriz,

                    [

                        [0,1],
                        [1,0],
                        [2,2],
                        [2,1]

                    ]

                )

            ).toBe(false);

        });

        test('retorna false para vetor vazio', () => {

            expect(

                matrizUtils.compararJogada(

                    matriz,

                    []

                )

            ).toBe(false);

        });

    });

    describe('gerarMatriz', () => {

        test('gera matriz com dimensão correta', () => {

            const matriz =
                matrizUtils.gerarMatriz(5,4);

            expect(matriz.length).toBe(5);

            matriz.forEach(linha=>{

                expect(linha.length).toBe(5);

            });

        });

        test('gera exatamente a quantidade de posições ativas', () => {

            const matriz =
                matrizUtils.gerarMatriz(7,9);

            const ativos =
                matrizUtils.obterPosicoesAtivas(matriz);

            expect(ativos.length).toBe(9);

        });

        test('todos os valores são 0 ou 1', () => {

            const matriz =
                matrizUtils.gerarMatriz(6,8);

            matriz.forEach(linha=>{

                linha.forEach(valor=>{

                    expect([0,1]).toContain(valor);

                });

            });

        });

    });

});