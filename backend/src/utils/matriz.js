

// Cria uma matriz NxN preenchida com zeros
function criarMatriz(dimensao) {
    return Array.from(
        { length: dimensao },
        () => Array(dimensao).fill(0)
    );
}

// Gera posições aleatórias sem repetição
function gerarPosicoesAleatorias(dimensao, quantidade) {

    const usadas = new Set();

    while (usadas.size < quantidade) {

        const linha = Math.floor(Math.random() * dimensao);
        const coluna = Math.floor(Math.random() * dimensao);

        usadas.add(`${linha}-${coluna}`);
    }

    return [...usadas].map(posicao => {

        const [linha, coluna] = posicao
            .split('-')
            .map(Number);

        return [linha, coluna];
    });
}

// Marca as posições da matriz com valor 1
function ativarPosicoes(matriz, posicoes) {

    for (const [linha, coluna] of posicoes) {
        matriz[linha][coluna] = 1;
    }

    return matriz;
}

// Retorna todas as posições que possuem valor 1
function obterPosicoesAtivas(matriz) {

    const posicoes = [];

    for (let linha = 0; linha < matriz.length; linha++) {

        for (let coluna = 0; coluna < matriz[linha].length; coluna++) {

            if (matriz[linha][coluna] === 1) {
                posicoes.push([linha, coluna]);
            }

        }

    }

    return posicoes;
}

// Compara as posições enviadas pelo usuário com as posições corretas.
// A ordem das posições não importa.
function compararJogada(matriz, jogadaUsuario) {

    const posicoesCorretas = obterPosicoesAtivas(matriz);

    if (posicoesCorretas.length !== jogadaUsuario.length) {
        return false;
    }

    const corretas = new Set(
        posicoesCorretas.map(([linha, coluna]) => `${linha}-${coluna}`)
    );

    for (const [linha, coluna] of jogadaUsuario) {

        if (!corretas.has(`${linha}-${coluna}`)) {
            return false;
        }

    }

    return true;
}

// Gera uma matriz completa pronta para ser enviada ao frontend
function gerarMatriz(dimensao, quantidadeAtivos) {

    const matriz = criarMatriz(dimensao);

    const posicoes = gerarPosicoesAleatorias(
        dimensao,
        quantidadeAtivos
    );

    ativarPosicoes(matriz, posicoes);

    return matriz;
}

module.exports = {
    criarMatriz,
    gerarPosicoesAleatorias,
    ativarPosicoes,
    obterPosicoesAtivas,
    compararJogada,
    gerarMatriz
};