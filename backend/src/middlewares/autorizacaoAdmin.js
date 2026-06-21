const jwt = require('jsonwebtoken');

// verifica se o token pertence a um administrador (tipo: 'admin' no payload)
function autorizacaoAdmin(req, res, next) {
  const cabecalho = req.headers.authorization;
  if (!cabecalho) {
    return res.status(401).json({ erro: 'token nao enviado' });
  }

  const token = cabecalho.split(' ')[1];

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    if (dados.tipo !== 'admin') {
      return res.status(403).json({ erro: 'acesso negado' });
    }
    req.admin = dados;
    next();
  } catch (erro) {
    return res.status(401).json({ erro: 'token invalido' });
  }
}

module.exports = autorizacaoAdmin;
