const desafioService = require('../src/services/desafioService');
const desafioModel = require('../src/models/desafioModel');

jest.mock('../src/models/desafioModel');

describe('desafioService.listar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna lista de desafios ativos', async () => {
    desafioModel.listarAtivos.mockResolvedValue([
      { id_desafio: 1, titulo: 'Beber agua', pontuacao_prevista: 100 }
    ]);

    const resultado = await desafioService.listar();

    expect(resultado).toHaveLength(1);
    expect(desafioModel.listarAtivos).toHaveBeenCalled();
  });
});

describe('desafioService.inscrever', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('inscreve quando desafio existe e usuario nao esta inscrito', async () => {
    desafioModel.buscarPorId.mockResolvedValue({ id_desafio: 1, ativo: true });
    desafioModel.jaInscrito.mockResolvedValue(false);
    desafioModel.inscrever.mockResolvedValue({ id_usuario: 1, id_desafio: 1 });

    const resultado = await desafioService.inscrever(1, 1);

    expect(desafioModel.inscrever).toHaveBeenCalledWith(1, 1);
    expect(resultado.id_desafio).toBe(1);
  });

  test('lanca 404 quando desafio nao existe', async () => {
    desafioModel.buscarPorId.mockResolvedValue(null);

    await expect(desafioService.inscrever(1, 99))
      .rejects.toHaveProperty('status', 404);
  });

  test('lanca 409 quando usuario ja esta inscrito', async () => {
    desafioModel.buscarPorId.mockResolvedValue({ id_desafio: 1, ativo: true });
    desafioModel.jaInscrito.mockResolvedValue(true);

    await expect(desafioService.inscrever(1, 1))
      .rejects.toHaveProperty('status', 409);
  });
});

describe('desafioService.concluir', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('conclui quando inscrito e nao concluiu ainda', async () => {
    desafioModel.buscarPorId.mockResolvedValue({ id_desafio: 1, pontuacao_prevista: 200, ativo: true });
    desafioModel.jaInscrito.mockResolvedValue(true);
    desafioModel.jaConcluiu.mockResolvedValue(false);
    desafioModel.concluir.mockResolvedValue({ id_conclusao: 1, pontuacao: 200 });

    const resultado = await desafioService.concluir(1, 1);

    expect(desafioModel.concluir).toHaveBeenCalledWith(1, 1, 200);
    expect(resultado.pontuacao).toBe(200);
  });

  test('lanca 400 quando usuario nao esta inscrito', async () => {
    desafioModel.buscarPorId.mockResolvedValue({ id_desafio: 1, pontuacao_prevista: 200, ativo: true });
    desafioModel.jaInscrito.mockResolvedValue(false);

    await expect(desafioService.concluir(1, 1))
      .rejects.toHaveProperty('status', 400);
  });

  test('lanca 409 quando ja concluiu', async () => {
    desafioModel.buscarPorId.mockResolvedValue({ id_desafio: 1, pontuacao_prevista: 200, ativo: true });
    desafioModel.jaInscrito.mockResolvedValue(true);
    desafioModel.jaConcluiu.mockResolvedValue(true);

    await expect(desafioService.concluir(1, 1))
      .rejects.toHaveProperty('status', 409);
  });

  test('lanca 400 quando desafio esta inativo', async () => {
    desafioModel.buscarPorId.mockResolvedValue({ id_desafio: 1, pontuacao_prevista: 200, ativo: false });
    desafioModel.jaInscrito.mockResolvedValue(true);

    await expect(desafioService.concluir(1, 1))
      .rejects.toHaveProperty('status', 400);
  });
});

describe('desafioService.meusConcluidos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna desafios concluidos do usuario', async () => {
    desafioModel.buscarConcluidosDoUsuario.mockResolvedValue([
      { id_desafio: 1, titulo: 'Beber agua', pontuacao: 100 }
    ]);

    const resultado = await desafioService.meusConcluidos(1);

    expect(resultado).toHaveLength(1);
    expect(desafioModel.buscarConcluidosDoUsuario).toHaveBeenCalledWith(1);
  });
});

describe('desafioService.meusDesafios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retorna desafios do usuario', async () => {
    desafioModel.buscarDoUsuario.mockResolvedValue([
      { id_desafio: 1, titulo: 'Beber agua' }
    ]);

    const resultado = await desafioService.meusDesafios(1);

    expect(resultado).toHaveLength(1);
    expect(desafioModel.buscarDoUsuario).toHaveBeenCalledWith(1);
  });
});
