const partidaService = require('./partidaService');
const ligaService = require('./ligaService');

const jogoModel = require('../models/jogoModel');
const usuarioModel = require('../models/usuarioModel');
const leaderboardModel = require('../models/leaderboard');

async function iniciarPartida(idUsuario){

    return partidaService.iniciarPartida(idUsuario);

}

async function jogar(idUsuario,posicoes,tempoRestante){

    const partida = partidaService.buscarPartida(idUsuario);

    if(!partida){

        const erro = new Error('partida nao encontrada');
        erro.status = 404;
        throw erro;

    }

    const resultado = partidaService.validarJogada(partida,posicoes,tempoRestante);

    if(resultado.resultado === 'acertou'){

        return resultado;

    }

    if(resultado.resultado === 'derrota'){

        partidaService.finalizarPartida(idUsuario);

        return resultado;

    }

    return await concluirPartida(idUsuario,resultado);

}

async function concluirPartida(idUsuario,resultado){

    // procura o desafio do jogo
    const desafio = await jogoModel.buscarDesafioMemoria();

    if(!desafio){

        const erro = new Error(
            'desafio de memoria nao encontrado'
        );

        erro.status = 404;

        throw erro;

    }

    // impede concluir duas vezes
    const concluido =await jogoModel.jaConcluiu(idUsuario,desafio.id_desafio);

    if(concluido){

        const erro = new Error(
            'desafio ja concluido'
        );

        erro.status = 409;

        throw erro;

    }

    // converte a pontuação interna do jogo em pontos do sistema
    const pontosConcedidos = Math.min(
        20,
        Math.max(
            1,
            Math.round(resultado.pontos_totais / 20)
        )
    );

    // registra a conclusão com pontuação limitada
    await jogoModel.registrarConclusao(
        idUsuario,
        desafio.id_desafio,
        pontosConcedidos
    );

    // estatisticas atualizadas
    const estatisticas =await usuarioModel.buscarEstatisticas(idUsuario);

    // atualiza a liga
    await ligaService.atualizarProgressao(idUsuario,estatisticas.pontos_totais);

    // atualiza as views materializadas
    await jogoModel.atualizarLeaderboards();

    // liga atual
    const liga =await ligaService.buscarMinhaLiga(idUsuario);

    // ranking atualizado
    const ranking =await leaderboardModel.buscarPosicaoDoUsuario(idUsuario);

    // remove a partida da memoria
    partidaService.finalizarPartida(idUsuario);

    return{

        resultado:'vitoria',

        pontos_jogo:
            resultado.pontos_totais,

        pontos_concedidos:
            pontosConcedidos,

        pontos_totais:
            estatisticas.pontos_totais,

        desafios_concluidos:
            estatisticas.desafios_concluidos,

        liga,

        ranking,

        desafio_concluido:true,

        liga_atualizada:true

    };

}

function abandonarPartida(idUsuario){

    partidaService.finalizarPartida(idUsuario);

}

module.exports = {
    iniciarPartida,
    jogar,
    abandonarPartida

};