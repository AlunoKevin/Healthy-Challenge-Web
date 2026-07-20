const partidas = require('../memory/partidas');
const matrizUtils = require('../utils/matrizUtils');
const perfilModel = require('../models/perfilModel');
// possivelmente mudar para a pasta config e criar um arquivo de configuracao do jogo
const CONFIGURACAO = {
    F: {
        dimensao: 5,
        ativos: 2,
        tempo: 240,
        memorizacao: 4,
        multiplicador: 1,
        maxAtivos: 10,
        rodadasMaximas: 9
    },

    M: {
        dimensao: 6,
        ativos: 4,
        tempo: 240,
        memorizacao: 3.5,
        multiplicador: 1.5,
        maxAtivos: 18,
        rodadasMaximas: 12
    },

    D: {
        dimensao: 7,
        ativos: 6,
        tempo: 240,
        memorizacao: 3,
        multiplicador: 2,
        maxAtivos: 28,
        rodadasMaximas: 15
    }
};

function configuracao(dificuldade){
    return CONFIGURACAO[dificuldade];
}

// refatorado
function calcularPontos(partida){
    const BASE = 15;
    const bonusTempo =Math.floor(partida.tempoRestante / 30);
    const multiplicadorCombo = calcularMultiplicadorCombo(partida.combo);

    return Math.round(BASE *partida.quantidadeAtivos *partida.multiplicador *multiplicadorCombo) + bonusTempo;
}

function calcularMultiplicadorCombo(combo){

    if(combo <= 1){
        return 1;
    }

    if(combo <= 3){
        return 1.1;
    }

    if(combo <= 6){
        return 1.25;
    }

    if(combo <= 9){
        return 1.5;
    }

    return 2;
}

function aumentarNivel(partida){

    if(partida.rodada % 3 === 0){
        partida.nivel++;
    }

}

function aumentarQuantidadeAtivos(partida){

    const limite =
        configuracao(partida.dificuldade).maxAtivos;

    if(partida.quantidadeAtivos < limite){
        partida.quantidadeAtivos++;
    }

}

function atualizarTempo(partida, tempoRestante){

    partida.tempoRestante = Math.min(
        configuracao(partida.dificuldade).tempo,
        tempoRestante + 10
    );

}

function gerarNovaRodada(partida){

    partida.matriz = matrizUtils.gerarMatriz(
        partida.dimensao,
        partida.quantidadeAtivos
    );

}

function respostaRodada(partida,pontos){

    return{

        resultado:'acertou',

        rodada:partida.rodada,

        nivel:partida.nivel,

        pontos_ganhos:pontos,

        pontos_totais:partida.pontos,

        bonus_tempo:10,

        tempo_restante:partida.tempoRestante,

        tempo_memorizacao:partida.tempoMemorizacao,

        quantidade_ativos:partida.quantidadeAtivos,

        matriz:partida.matriz

    };

}

async function iniciarPartida(idUsuario){

    if(partidas.existePartida(idUsuario)){
        const erro = new Error('usuario ja possui uma partida ativa');
        erro.status = 409;
        throw erro;
    }

    const perfil = await perfilModel.buscarPerfil(idUsuario);

    if(!perfil){
        const erro = new Error('usuario nao encontrado');
        erro.status = 404;
        throw erro;
    }

    const config =
        configuracao(perfil.nivel_dificuldade);

    const partida = {

        idUsuario,

        dificuldade:perfil.nivel_dificuldade,

        rodada:1,

        nivel:1,

        pontos:0,

        combo:1,

        dimensao:config.dimensao,

        quantidadeAtivos:config.ativos,

        tempoRestante:config.tempo,

        tempoMemorizacao:config.memorizacao,

        multiplicador:config.multiplicador,

        matriz:matrizUtils.gerarMatriz(
            config.dimensao,
            config.ativos
        )

    };

    partidas.criarPartida(idUsuario,partida);

    return{

        rodada:partida.rodada,

        nivel:partida.nivel,

        dimensao:partida.dimensao,

        tempo_memorizacao:partida.tempoMemorizacao,

        tempo_restante:partida.tempoRestante,

        quantidade_ativos:partida.quantidadeAtivos,

        matriz:partida.matriz

    };

}

function buscarPartida(idUsuario){
    return partidas.buscarPartida(idUsuario);
}

function finalizarPartida(idUsuario){
    partidas.removerPartida(idUsuario);
}

function validarJogada(partida,posicoesSelecionadas,tempoRestante){

    if(tempoRestante <= 0){

        return{

            resultado:'derrota',

            motivo:'tempo_esgotado',

            pontos_totais:partida.pontos,

            rodadas:partida.rodada

        };

    }

    const correto = matrizUtils.validarJogada(
        partida.matriz,
        posicoesSelecionadas
    );

    if(!correto){

        partida.combo = 1;

        return{

            resultado:'derrota',

            motivo:'posicao_incorreta',

            pontos_totais:partida.pontos,

            rodadas:partida.rodada

        };

    }

    atualizarTempo(partida,tempoRestante);

    partida.combo++;

    const pontos =calcularPontos(partida);


    partida.pontos += pontos;
    partida.rodada++;

    aumentarNivel(partida);

    aumentarQuantidadeAtivos(partida);

    if(partida.rodada >configuracao(partida.dificuldade).rodadasMaximas){

        return{

            resultado:'vitoria',

            combo:partida.combo,

            pontos_totais:partida.pontos

        };

    }

    gerarNovaRodada(partida);

    return respostaRodada(
        partida,
        pontos
    );

}

module.exports = {
    iniciarPartida,
    buscarPartida,
    finalizarPartida,
    validarJogada,
    calcularMultiplicadorCombo,
    calcularPontos,
    aumentarNivel,
    aumentarQuantidadeAtivos,
    gerarNovaRodada

};