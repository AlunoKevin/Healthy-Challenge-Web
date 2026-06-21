const pool = require('../src/config/conexao');
const adminModel = require('../src/models/adminModel');

jest.mock('../src/config/conexao');

describe('adminModel.buscarAdminPorEmail', () => {
  test('retorna admin quando encontrado', async () => {
    pool.query.mockResolvedValue({
      rows: [{ id_administrador: 1, email: 'admin@test.com', senha: 'hash', chave_de_acesso: 'chave' }]
    });

    const resultado = await adminModel.buscarAdminPorEmail('admin@test.com');

    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM Administrador WHERE email = $1',
      ['admin@test.com']
    );
    expect(resultado).toEqual({ id_administrador: 1, email: 'admin@test.com', senha: 'hash', chave_de_acesso: 'chave' });
  });

  test('retorna undefined quando nao encontrado', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const resultado = await adminModel.buscarAdminPorEmail('nao@existe.com');

    expect(resultado).toBeUndefined();
  });
});
