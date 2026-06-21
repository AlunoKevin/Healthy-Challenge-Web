const desafioController = require('../src/controllers/desafioController');
const desafioService = require('../src/services/desafioService');

jest.mock('../src/services/desafioService');

// cria objeto res com encadeamento de status e json
function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('desafioController.listar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 200 com lista de desafios', async () => {
    desafioService.listar.mockResolvedValue([{ id_desafio: 1, titulo: 'Beber agua' }]);
    const req = {};
    const res = mockRes();

    await desafioController.listar(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id_desafio: 1, titulo: 'Beber agua' }]);
  });

  test('retorna 500 quando service lanca erro', async () => {
    desafioService.listar.mockRejectedValue(new Error('falha'));
    const req = {};
    const res = mockRes();

    await desafioController.listar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ erro: 'erro interno do servidor' });
  });
});

describe('desafioController.meusDesafios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 200 com desafios do usuario', async () => {
    desafioService.meusDesafios.mockResolvedValue([{ id_desafio: 1, titulo: 'Beber agua' }]);
    const req = { usuario: { id_usuario: 1 } };
    const res = mockRes();

    await desafioController.meusDesafios(req, res);

    expect(desafioService.meusDesafios).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('retorna 500 quando service lanca erro', async () => {
    desafioService.meusDesafios.mockRejectedValue(new Error('falha'));
    const req = { usuario: { id_usuario: 1 } };
    const res = mockRes();

    await desafioController.meusDesafios(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ erro: 'erro interno do servidor' });
  });
});

describe('desafioController.inscrever', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 201 ao inscrever com sucesso', async () => {
    desafioService.inscrever.mockResolvedValue({ id_usuario: 1, id_desafio: 1 });
    const req = { usuario: { id_usuario: 1 }, params: { id: '1' } };
    const res = mockRes();

    await desafioController.inscrever(req, res);

    expect(desafioService.inscrever).toHaveBeenCalledWith(1, '1');
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id_usuario: 1, id_desafio: 1 });
  });

  test('retorna 404 quando desafio nao existe', async () => {
    const erro = new Error('desafio nao encontrado');
    erro.status = 404;
    desafioService.inscrever.mockRejectedValue(erro);
    const req = { usuario: { id_usuario: 1 }, params: { id: '99' } };
    const res = mockRes();

    await desafioController.inscrever(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ erro: 'desafio nao encontrado' });
  });

  test('retorna 409 quando usuario ja esta inscrito', async () => {
    const erro = new Error('usuario ja inscrito neste desafio');
    erro.status = 409;
    desafioService.inscrever.mockRejectedValue(erro);
    const req = { usuario: { id_usuario: 1 }, params: { id: '1' } };
    const res = mockRes();

    await desafioController.inscrever(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ erro: 'usuario ja inscrito neste desafio' });
  });

  test('retorna 500 quando service lanca erro sem status', async () => {
    desafioService.inscrever.mockRejectedValue(new Error('falha inesperada'));
    const req = { usuario: { id_usuario: 1 }, params: { id: '1' } };
    const res = mockRes();

    await desafioController.inscrever(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ erro: 'erro interno do servidor' });
  });

  test('retorna 400 quando id nao e um numero valido', async () => {
    const req = { usuario: { id_usuario: 1 }, params: { id: 'abc' } };
    const res = mockRes();

    await desafioController.inscrever(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ erro: 'id invalido' });
  });
});

describe('desafioController.concluir', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 200 ao concluir com sucesso', async () => {
    desafioService.concluir.mockResolvedValue({ id_conclusao: 1, pontuacao: 200 });
    const req = { usuario: { id_usuario: 1 }, params: { id: '1' } };
    const res = mockRes();

    await desafioController.concluir(req, res);

    expect(desafioService.concluir).toHaveBeenCalledWith(1, '1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id_conclusao: 1, pontuacao: 200 });
  });

  test('retorna 400 quando usuario nao esta inscrito', async () => {
    const erro = new Error('usuario nao esta inscrito neste desafio');
    erro.status = 400;
    desafioService.concluir.mockRejectedValue(erro);
    const req = { usuario: { id_usuario: 1 }, params: { id: '1' } };
    const res = mockRes();

    await desafioController.concluir(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ erro: 'usuario nao esta inscrito neste desafio' });
  });

  test('retorna 400 quando desafio esta inativo', async () => {
    const erro = new Error('desafio inativo');
    erro.status = 400;
    desafioService.concluir.mockRejectedValue(erro);
    const req = { usuario: { id_usuario: 1 }, params: { id: '1' } };
    const res = mockRes();

    await desafioController.concluir(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ erro: 'desafio inativo' });
  });

  test('retorna 409 quando ja concluiu o desafio', async () => {
    const erro = new Error('desafio ja concluido');
    erro.status = 409;
    desafioService.concluir.mockRejectedValue(erro);
    const req = { usuario: { id_usuario: 1 }, params: { id: '1' } };
    const res = mockRes();

    await desafioController.concluir(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ erro: 'desafio ja concluido' });
  });

  test('retorna 500 quando service lanca erro sem status', async () => {
    desafioService.concluir.mockRejectedValue(new Error('falha inesperada'));
    const req = { usuario: { id_usuario: 1 }, params: { id: '1' } };
    const res = mockRes();

    await desafioController.concluir(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ erro: 'erro interno do servidor' });
  });

  test('retorna 400 quando id nao e um numero valido', async () => {
    const req = { usuario: { id_usuario: 1 }, params: { id: 'xyz' } };
    const res = mockRes();

    await desafioController.concluir(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ erro: 'id invalido' });
  });
});

describe('desafioController.meusConcluidos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna 200 com desafios concluidos do usuario', async () => {
    desafioService.meusConcluidos.mockResolvedValue([{ id_desafio: 1, pontuacao: 100 }]);
    const req = { usuario: { id_usuario: 1 } };
    const res = mockRes();

    await desafioController.meusConcluidos(req, res);

    expect(desafioService.meusConcluidos).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('retorna 500 quando service lanca erro', async () => {
    desafioService.meusConcluidos.mockRejectedValue(new Error('falha'));
    const req = { usuario: { id_usuario: 1 } };
    const res = mockRes();

    await desafioController.meusConcluidos(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ erro: 'erro interno do servidor' });
  });
});

describe('desafioController.criar', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  test('retorna 201 ao criar desafio com dados validos', async () => {
    desafioService.criar.mockResolvedValue({ id_desafio: 1, titulo: 'Beber agua', pontuacao_prevista: 100, ativo: true });
    const req = { body: { titulo: 'Beber agua', descricao: null, pontuacao_prevista: 100 } };
    const res = mockRes();

    await desafioController.criar(req, res);

    expect(desafioService.criar).toHaveBeenCalledWith('Beber agua', null, 100);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('retorna 400 quando titulo esta ausente', async () => {
    const req = { body: { pontuacao_prevista: 100 } };
    const res = mockRes();

    await desafioController.criar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ erro: 'titulo e pontuacao_prevista sao obrigatorios' });
  });

  test('retorna 400 quando pontuacao_prevista esta ausente', async () => {
    const req = { body: { titulo: 'Beber agua' } };
    const res = mockRes();

    await desafioController.criar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ erro: 'titulo e pontuacao_prevista sao obrigatorios' });
  });

  test('retorna 400 quando pontuacao_prevista e zero', async () => {
    const req = { body: { titulo: 'Beber agua', pontuacao_prevista: 0 } };
    const res = mockRes();

    await desafioController.criar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ erro: 'titulo e pontuacao_prevista sao obrigatorios' });
  });

  test('retorna 500 quando service lanca erro sem status', async () => {
    desafioService.criar.mockRejectedValue(new Error('falha'));
    const req = { body: { titulo: 'Beber agua', pontuacao_prevista: 100 } };
    const res = mockRes();

    await desafioController.criar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ erro: 'erro interno do servidor' });
  });
});

describe('desafioController.atualizar', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  test('retorna 200 ao atualizar com dados validos', async () => {
    desafioService.atualizar.mockResolvedValue({ id_desafio: 1, titulo: 'Novo', pontuacao_prevista: 200 });
    const req = { params: { id: '1' }, body: { titulo: 'Novo', descricao: null, pontuacao_prevista: 200 } };
    const res = mockRes();

    await desafioController.atualizar(req, res);

    expect(desafioService.atualizar).toHaveBeenCalledWith('1', 'Novo', null, 200);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('retorna 400 quando id nao e valido', async () => {
    const req = { params: { id: 'abc' }, body: { titulo: 'Novo', pontuacao_prevista: 100 } };
    const res = mockRes();

    await desafioController.atualizar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ erro: 'id invalido' });
  });

  test('retorna 400 quando titulo esta ausente', async () => {
    const req = { params: { id: '1' }, body: { pontuacao_prevista: 100 } };
    const res = mockRes();

    await desafioController.atualizar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ erro: 'titulo e pontuacao_prevista sao obrigatorios' });
  });

  test('retorna 400 quando pontuacao_prevista e zero', async () => {
    const req = { params: { id: '1' }, body: { titulo: 'Novo', pontuacao_prevista: 0 } };
    const res = mockRes();

    await desafioController.atualizar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ erro: 'titulo e pontuacao_prevista sao obrigatorios' });
  });

  test('retorna 404 quando desafio nao existe', async () => {
    const erro = new Error('desafio nao encontrado');
    erro.status = 404;
    desafioService.atualizar.mockRejectedValue(erro);
    const req = { params: { id: '99' }, body: { titulo: 'Novo', pontuacao_prevista: 100 } };
    const res = mockRes();

    await desafioController.atualizar(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('retorna 500 quando service lanca erro sem status', async () => {
    desafioService.atualizar.mockRejectedValue(new Error('falha'));
    const req = { params: { id: '1' }, body: { titulo: 'Novo', pontuacao_prevista: 100 } };
    const res = mockRes();

    await desafioController.atualizar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('desafioController.inativar', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  test('retorna 200 ao inativar desafio existente', async () => {
    desafioService.inativar.mockResolvedValue({ id_desafio: 1, ativo: false });
    const req = { params: { id: '1' } };
    const res = mockRes();

    await desafioController.inativar(req, res);

    expect(desafioService.inativar).toHaveBeenCalledWith('1');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('retorna 400 quando id nao e valido', async () => {
    const req = { params: { id: 'abc' } };
    const res = mockRes();

    await desafioController.inativar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ erro: 'id invalido' });
  });

  test('retorna 404 quando desafio nao existe', async () => {
    const erro = new Error('desafio nao encontrado');
    erro.status = 404;
    desafioService.inativar.mockRejectedValue(erro);
    const req = { params: { id: '99' } };
    const res = mockRes();

    await desafioController.inativar(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('retorna 500 quando service lanca erro sem status', async () => {
    desafioService.inativar.mockRejectedValue(new Error('falha'));
    const req = { params: { id: '1' } };
    const res = mockRes();

    await desafioController.inativar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
