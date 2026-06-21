const ligaService = require('../services/ligaService');

async function listar(req, res) {
  try {
    const ligas = await ligaService.listar();
    res.json(ligas);
  } catch (erro) {
    const status = erro.status || 500;
    res.status(status).json({ erro: status === 500 ? 'erro interno' : erro.message });
  }
}

async function minhaLiga(req, res) {
  try {
    const liga = await ligaService.buscarMinhaLiga(req.usuario.id_usuario);
    res.json(liga);
  } catch (erro) {
    const status = erro.status || 500;
    res.status(status).json({ erro: status === 500 ? 'erro interno' : erro.message });
  }
}

module.exports = { listar, minhaLiga };
