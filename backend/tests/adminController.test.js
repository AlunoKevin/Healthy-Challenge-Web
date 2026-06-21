const adminController = require('../src/controllers/adminController');
const adminService = require('../src/services/adminService');

jest.mock('../src/services/adminService');

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('adminController.login', () => {
  beforeEach(() => jest.clearAllMocks());

  test('retorna 400 quando campos obrigatorios ausentes', async () => {
    const req = { body: { email: 'admin@test.com' } };
    const res = mockRes();

    await adminController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ erro: 'email, senha e chave_de_acesso sao obrigatorios' });
  });

  test('retorna 200 com token quando login bem-sucedido', async () => {
    adminService.loginAdmin.mockResolvedValue({ token: 'token_admin' });
    const req = { body: { email: 'admin@test.com', senha: 'senha123', chave_de_acesso: 'chave' } };
    const res = mockRes();

    await adminController.login(req, res);

    expect(adminService.loginAdmin).toHaveBeenCalledWith('admin@test.com', 'senha123', 'chave');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: 'token_admin' });
  });

  test('retorna 401 quando credenciais invalidas', async () => {
    const erro = new Error('credenciais invalidas');
    erro.status = 401;
    adminService.loginAdmin.mockRejectedValue(erro);
    const req = { body: { email: 'admin@test.com', senha: 'errada', chave_de_acesso: 'errada' } };
    const res = mockRes();

    await adminController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ erro: 'credenciais invalidas' });
  });

  test('retorna 500 quando service lanca erro sem status', async () => {
    adminService.loginAdmin.mockRejectedValue(new Error('falha inesperada'));
    const req = { body: { email: 'admin@test.com', senha: 'senha', chave_de_acesso: 'chave' } };
    const res = mockRes();

    await adminController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ erro: 'erro interno do servidor' });
  });
});
