process.env.JWT_SECRET = 'segredo_teste';

const authService = require('../src/services/authService');
const usuarioModel = require('../src/models/usuarioModel');

jest.mock('../src/models/usuarioModel');

describe('authService.cadastrar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('cria usuario quando o email nao existe', async () => {
    usuarioModel.buscarPorEmail.mockResolvedValue(undefined);
    usuarioModel.criar.mockResolvedValue({ id_usuario: 1, email: 'a@a.com' });

    const dados = { nome: 'ana', email: 'a@a.com', senha: '123456' };
    const usuario = await authService.cadastrar(dados);

    expect(usuario.id_usuario).toBe(1);
    expect(usuarioModel.criar).toHaveBeenCalled();
    // a senha nunca pode ser salva em texto puro
    const argumento = usuarioModel.criar.mock.calls[0][0];
    expect(argumento.senha_hash).not.toBe('123456');
  });

  test('lanca erro 409 quando o email ja existe', async () => {
    usuarioModel.buscarPorEmail.mockResolvedValue({ id_usuario: 1 });

    const dados = { nome: 'ana', email: 'a@a.com', senha: '123456' };
    await expect(authService.cadastrar(dados)).rejects.toHaveProperty('status', 409);
  });
});

describe('authService.login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('devolve token quando a senha confere', async () => {
    const senha_hash = await authService.getHashSenha('123456');
    usuarioModel.buscarPorEmail.mockResolvedValue({
      id_usuario: 1, email: 'a@a.com', senha_hash: senha_hash
    });
    usuarioModel.atualizarUltimoAcesso.mockResolvedValue();

    const resultado = await authService.login('a@a.com', '123456');
    expect(resultado.token).toBeDefined();
    expect(resultado.usuario.email).toBe('a@a.com');
  });

  test('lanca 401 quando a senha esta errada', async () => {
    const senha_hash = await authService.getHashSenha('123456');
    usuarioModel.buscarPorEmail.mockResolvedValue({
      id_usuario: 1, email: 'a@a.com', senha_hash: senha_hash
    });

    await expect(authService.login('a@a.com', 'errada'))
      .rejects.toHaveProperty('status', 401);
  });
});
