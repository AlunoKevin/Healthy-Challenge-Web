const perfilController = require('../src/controllers/perfilController');
const perfilService = require('../src/services/perfilService');

jest.mock('../src/services/perfilService');

describe('perfilController.buscarPerfil', () => {

  let req;
  let res;

  beforeEach(() => {
    req = {
      usuario: {
        id_usuario: 1
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  test('retorna perfil com status 200', async () => {

    const perfilMock = {
      id_usuario: 1,
      nome: 'Kevin',
      email: 'kevin@test.com',
      pontos_totais: 500,
      grupos: [],
      amigos: []
    };

    perfilService.buscarPerfil.mockResolvedValue(perfilMock);

    await perfilController.buscarPerfil(req, res);

    expect(perfilService.buscarPerfil)
      .toHaveBeenCalledWith(1);

    expect(res.status)
      .toHaveBeenCalledWith(200);

    expect(res.json)
      .toHaveBeenCalledWith(perfilMock);
  });

  test('retorna 404 quando usuario nao existe', async () => {

    const erro = new Error('usuario nao encontrado');
    erro.status = 404;

    perfilService.buscarPerfil.mockRejectedValue(erro);

    await perfilController.buscarPerfil(req, res);

    expect(res.status)
      .toHaveBeenCalledWith(404);

    expect(res.json)
      .toHaveBeenCalledWith({
        erro: 'usuario nao encontrado'
      });
  });

  test('retorna 500 para erro interno', async () => {

    perfilService.buscarPerfil.mockRejectedValue(
      new Error('erro inesperado')
    );

    await perfilController.buscarPerfil(req, res);

    expect(res.status)
      .toHaveBeenCalledWith(500);

    expect(res.json)
      .toHaveBeenCalledWith({
        erro: 'erro interno do servidor'
      });
  });

});

describe('perfilController.atualizarPerfil', () => {

  let req;
  let res;

  beforeEach(() => {

    req = {
      usuario: {
        id_usuario: 1
      },
      body: {
        nome: 'Novo Nome',
        email: 'novo@test.com',
        nivel_dificuldade: 'D'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  test('atualiza perfil com sucesso', async () => {

    const perfilAtualizado = {
      id_usuario: 1,
      nome: 'Novo Nome',
      email: 'novo@test.com',
      nivel_dificuldade: 'D'
    };

    perfilService.atualizarPerfil
      .mockResolvedValue(perfilAtualizado);

    await perfilController.atualizarPerfil(req, res);

    expect(perfilService.atualizarPerfil)
      .toHaveBeenCalledWith(
        1,
        req.body
      );

    expect(res.status)
      .toHaveBeenCalledWith(200);

    expect(res.json)
      .toHaveBeenCalledWith(
        perfilAtualizado
      );
  });

  test('retorna 404 ao tentar atualizar usuario inexistente', async () => {

    const erro = new Error('usuario nao encontrado');
    erro.status = 404;

    perfilService.atualizarPerfil
      .mockRejectedValue(erro);

    await perfilController.atualizarPerfil(req, res);

    expect(res.status)
      .toHaveBeenCalledWith(404);

    expect(res.json)
      .toHaveBeenCalledWith({
        erro: 'usuario nao encontrado'
      });
  });

  test('retorna 500 para erro interno ao atualizar', async () => {

    perfilService.atualizarPerfil
      .mockRejectedValue(
        new Error('erro inesperado')
      );

    await perfilController.atualizarPerfil(req, res);

    expect(res.status)
      .toHaveBeenCalledWith(500);

    expect(res.json)
      .toHaveBeenCalledWith({
        erro: 'erro interno do servidor'
      });
  });

});