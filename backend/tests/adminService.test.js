const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminModel = require('../src/models/adminModel');
const adminService = require('../src/services/adminService');

jest.mock('../src/models/adminModel');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('adminService.loginAdmin', () => {
  beforeEach(() => jest.clearAllMocks());

  test('retorna token quando credenciais corretas', async () => {
    adminModel.buscarAdminPorEmail.mockResolvedValue({
      id_administrador: 1,
      email: 'admin@test.com',
      senha: 'hash',
      chave_de_acesso: 'chave_certa'
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token_gerado');

    const resultado = await adminService.loginAdmin('admin@test.com', 'senha123', 'chave_certa');

    expect(resultado).toEqual({ token: 'token_gerado' });
    expect(jwt.sign).toHaveBeenCalledWith(
      { id_administrador: 1, email: 'admin@test.com', tipo: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '1d' }
    );
  });

  test('lanca 401 quando email nao existe', async () => {
    adminModel.buscarAdminPorEmail.mockResolvedValue(undefined);

    await expect(adminService.loginAdmin('x@test.com', 'senha', 'chave'))
      .rejects.toMatchObject({ status: 401 });
  });

  test('lanca 401 quando senha incorreta', async () => {
    adminModel.buscarAdminPorEmail.mockResolvedValue({
      id_administrador: 1, email: 'admin@test.com', senha: 'hash', chave_de_acesso: 'chave'
    });
    bcrypt.compare.mockResolvedValue(false);

    await expect(adminService.loginAdmin('admin@test.com', 'errada', 'chave'))
      .rejects.toMatchObject({ status: 401 });
  });

  test('lanca 401 quando chave incorreta', async () => {
    adminModel.buscarAdminPorEmail.mockResolvedValue({
      id_administrador: 1, email: 'admin@test.com', senha: 'hash', chave_de_acesso: 'chave_certa'
    });
    bcrypt.compare.mockResolvedValue(true);

    await expect(adminService.loginAdmin('admin@test.com', 'senha123', 'chave_errada'))
      .rejects.toMatchObject({ status: 401 });
  });
});
