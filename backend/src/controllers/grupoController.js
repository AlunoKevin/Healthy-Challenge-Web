const grupoService = require('../services/grupoService');

// cria um novo grupo
async function criar(req, res) {
  try {
    const { nome, descricao } = req.body;
    const grupo = await grupoService.criar(nome, descricao);
    res.status(201).json(grupo);
  } catch (erro) {
    const status = erro.status || 500;
    res.status(status).json({ erro: status === 500 ? 'erro interno' : erro.message });
  }
}

// adiciona um membro ao grupo
async function adicionarMembro(req, res) {
  try {
    const idGrupo = parseInt(req.params.id);
    if (isNaN(idGrupo)) {
      return res.status(400).json({ erro: 'id do grupo invalido' });
    }
    const { id_usuario } = req.body;
    if (!id_usuario || !Number.isInteger(Number(id_usuario))) {
      return res.status(400).json({ erro: 'id_usuario invalido' });
    }
    await grupoService.adicionarMembro(idGrupo, parseInt(id_usuario));
    res.status(201).json({ ok: true });
  } catch (erro) {
    const status = erro.status || 500;
    res.status(status).json({ erro: status === 500 ? 'erro interno' : erro.message });
  }
}

// remove um membro do grupo
async function removerMembro(req, res) {
  try {
    const idGrupo = parseInt(req.params.id);
    const idUsuario = parseInt(req.params.userId);
    if (isNaN(idGrupo) || isNaN(idUsuario)) {
      return res.status(400).json({ erro: 'id invalido' });
    }
    await grupoService.removerMembro(idGrupo, idUsuario, req.usuario.id_usuario);
    res.json({ ok: true });
  } catch (erro) {
    const status = erro.status || 500;
    res.status(status).json({ erro: status === 500 ? 'erro interno' : erro.message });
  }
}

module.exports = { criar, adicionarMembro, removerMembro };
