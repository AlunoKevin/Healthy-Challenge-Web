const jwt = require('jsonwebtoken');

// valida o token jwt enviado no header Authorization (formato "Bearer <token>")
function autenticacao(req, res, next) {
  const cabecalho = req.headers.authorization;
  if (!cabecalho) {
    return res.status(401).json({ erro: 'token nao enviado' });
  }

  const partes = cabecalho.split(' ');
  const token = partes[1];

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = dados;
    next();
  } catch (erro) {
    return res.status(401).json({ erro: 'token invalido' });
  }
}

module.exports = autenticacao;
