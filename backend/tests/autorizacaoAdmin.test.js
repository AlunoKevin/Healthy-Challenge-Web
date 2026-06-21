const jwt = require('jsonwebtoken');
const autorizacaoAdmin = require('../src/middlewares/autorizacaoAdmin');

jest.mock('jsonwebtoken');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('autorizacaoAdmin', () => {
  beforeEach(() => jest.clearAllMocks());

  test('retorna 401 quando token nao enviado', () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    autorizacaoAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ erro: 'token nao enviado' });
    expect(next).not.toHaveBeenCalled();
  });

  test('retorna 401 quando token invalido', () => {
    jwt.verify.mockImplementation(() => { throw new Error('invalid'); });
    const req = { headers: { authorization: 'Bearer token_invalido' } };
    const res = mockRes();
    const next = jest.fn();

    autorizacaoAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ erro: 'token invalido' });
    expect(next).not.toHaveBeenCalled();
  });

  test('retorna 403 quando tipo nao e admin', () => {
    jwt.verify.mockReturnValue({ id_usuario: 1, email: 'user@test.com' });
    const req = { headers: { authorization: 'Bearer token_usuario' } };
    const res = mockRes();
    const next = jest.fn();

    autorizacaoAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ erro: 'acesso negado' });
    expect(next).not.toHaveBeenCalled();
  });

  test('chama next e popula req.admin com token admin valido', () => {
    const payload = { id_administrador: 1, email: 'admin@test.com', tipo: 'admin' };
    jwt.verify.mockReturnValue(payload);
    const req = { headers: { authorization: 'Bearer token_admin' } };
    const res = mockRes();
    const next = jest.fn();

    autorizacaoAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.admin).toEqual(payload);
  });
});
