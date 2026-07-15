const perfilModel = require('../models/perfilModel');

async function buscarPerfil(idUsuario){

    const perfil = await perfilModel.buscarPerfil(idUsuario);

    if(!perfil){
        const erro = new Error('usuario nao encontrado');
        erro.status = 404;
        throw erro;
    }

    const grupos = await perfilModel.buscarGrupos(idUsuario);

    const amigos = await perfilModel.buscarAmigos(idUsuario);

    return {
        ...perfil,
        grupos,
        amigos
    };
}

async function atualizarPerfil(idUsuario, dados){

    const perfilAtualizado = await perfilModel.atualizarPerfil(idUsuario, dados);

    if(!perfilAtualizado){
        const erro = new Error('usuario nao encontrado');
        erro.status = 404;
        throw erro;
    }

    return perfilAtualizado;
}

module.exports = { buscarPerfil, atualizarPerfil };