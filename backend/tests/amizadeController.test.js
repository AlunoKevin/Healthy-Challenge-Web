const amizadeController = require('../src/controllers/amizadeController');
const amizadeService = require('../src/services/amizadeService');

jest.mock('../src/services/amizadeService');

let req;
let res;

beforeEach(() => {
  req = {
    usuario: { id_usuario: 1 },
    query: {},
    params: {},
    body: {}
  };

  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  jest.clearAllMocks();
});

describe('amizadeController.buscarUsuarios', () => {
  test('retorna 200 com a lista de usuarios', async () => {
    req.query.q = 'joao';
    amizadeService.buscarUsuarios.mockResolvedValue([{ id_usuario: 2, nome: 'Joao' }]);

    await amizadeController.buscarUsuarios(req, res);

    expect(amizadeService.buscarUsuarios).toHaveBeenCalledWith('joao', 1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id_usuario: 2, nome: 'Joao' }]);
  });

  test('retorna 400 quando o termo e invalido', async () => {
    const erro = new Error('informe ao menos 2 caracteres para buscar');
    erro.status = 400;
    amizadeService.buscarUsuarios.mockRejectedValue(erro);

    await amizadeController.buscarUsuarios(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ erro: erro.message });
  });
});

describe('amizadeController.solicitar', () => {
  test('retorna 201 ao criar a solicitacao', async () => {
    req.body.id_usuario_destino = 2;
    amizadeService.solicitarAmizade.mockResolvedValue({ status: 'PENDENTE' });

    await amizadeController.solicitar(req, res);

    expect(amizadeService.solicitarAmizade).toHaveBeenCalledWith(1, 2);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ status: 'PENDENTE' });
  });

  test('retorna 409 quando ja existe solicitacao', async () => {
    const erro = new Error('já existe uma solicitação pendente entre vocês');
    erro.status = 409;
    amizadeService.solicitarAmizade.mockRejectedValue(erro);

    await amizadeController.solicitar(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ erro: erro.message });
  });

  test('retorna 500 para erro inesperado', async () => {
    amizadeService.solicitarAmizade.mockRejectedValue(new Error('falha'));

    await amizadeController.solicitar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ erro: 'erro interno do servidor' });
  });
});

describe('amizadeController.listarPendentes', () => {
  test('retorna 200 com os pedidos pendentes', async () => {
    amizadeService.listarPendentes.mockResolvedValue([{ id_usuario: 3 }]);

    await amizadeController.listarPendentes(req, res);

    expect(amizadeService.listarPendentes).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id_usuario: 3 }]);
  });
});

describe('amizadeController.aceitar', () => {
  test('retorna 200 ao aceitar', async () => {
    req.params.idOrigem = '2';
    amizadeService.aceitarAmizade.mockResolvedValue({ status: 'ACEITA' });

    await amizadeController.aceitar(req, res);

    expect(amizadeService.aceitarAmizade).toHaveBeenCalledWith(1, '2');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('retorna 404 quando o pedido nao existe', async () => {
    const erro = new Error('solicitação de amizade não encontrada');
    erro.status = 404;
    amizadeService.aceitarAmizade.mockRejectedValue(erro);

    await amizadeController.aceitar(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ erro: erro.message });
  });
});

describe('amizadeController.rejeitar', () => {
  test('retorna 200 ao rejeitar', async () => {
    req.params.idOrigem = '2';
    amizadeService.rejeitarAmizade.mockResolvedValue({ status: 'REJEITADA' });

    await amizadeController.rejeitar(req, res);

    expect(amizadeService.rejeitarAmizade).toHaveBeenCalledWith(1, '2');
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
