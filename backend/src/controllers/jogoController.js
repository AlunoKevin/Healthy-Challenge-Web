const jogoService = require('../services/jogoService');

// inicia uma nova partida
async function iniciarPartida(req, res) {

    try {

        const partida = await jogoService.iniciarPartida(
            req.usuario.id_usuario
        );

        return res.status(200).json(partida);

    } catch (erro) {

        const status = erro.status || 500;

        const mensagem =
            status === 500
                ? 'erro interno do servidor'
                : erro.message;

        return res.status(status).json({
            erro: mensagem
        });

    }

}

// recebe uma jogada do usuario
async function jogar(req, res) {

    try {

        const resultado = await jogoService.jogar(

            req.usuario.id_usuario,

            req.body.posicoes,

            req.body.tempo_restante

        );

        return res.status(200).json(resultado);

    } catch (erro) {

        const status = erro.status || 500;

        const mensagem =
            status === 500
                ? 'erro interno do servidor'
                : erro.message;

        return res.status(status).json({
            erro: mensagem
        });

    }

}

// abandona a partida atual
async function abandonarPartida(req, res) {

    try {

        await jogoService.abandonarPartida(
            req.usuario.id_usuario
        );

        return res.status(200).json({

            mensagem: 'partida encerrada'

        });

    } catch (erro) {

        const status = erro.status || 500;

        const mensagem =
            status === 500
                ? 'erro interno do servidor'
                : erro.message;

        return res.status(status).json({

            erro: mensagem

        });

    }

}

module.exports = {
    iniciarPartida,
    jogar,
    abandonarPartida
};