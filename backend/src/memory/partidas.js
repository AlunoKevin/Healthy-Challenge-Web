
const partidas = new Map();

// cria uma nova partida
function criarPartida(idUsuario, partida) {
    partidas.set(idUsuario, partida);
    return partida;
}

// retorna a partida de um usuário
function buscarPartida(idUsuario) {
    return partidas.get(idUsuario);
}

// atualiza a partida
function atualizarPartida(idUsuario, partida) {
    partidas.set(idUsuario, partida);
    return partida;
}

// remove a partida
function removerPartida(idUsuario) {
    return partidas.delete(idUsuario);
}

// Verifica se existe uma partida ativa
function existePartida(idUsuario) {
    return partidas.has(idUsuario);
}

// remove todas as partidas 
function limparPartidas() {
    partidas.clear();
}

// qtd de partidas ativas ( para testes )
function quantidadePartidas() {
    return partidas.size;
}

module.exports = {
    criarPartida,
    buscarPartida,
    atualizarPartida,
    removerPartida,
    existePartida,
    limparPartidas,
    quantidadePartidas
};