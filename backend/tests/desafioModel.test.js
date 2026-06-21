const desafioModel = require('../src/models/desafioModel');
const pool = require('../src/config/conexao');

jest.mock('../src/config/conexao', () => ({ query: jest.fn() }));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('desafioModel.listarAtivos', () => {
  test('retorna lista de desafios ativos', async () => {
    pool.query.mockResolvedValue({ rows: [{ id_desafio: 1, titulo: 'Beber agua', ativo: true }] });

    const resultado = await desafioModel.listarAtivos();

    expect(resultado).toHaveLength(1);
    expect(resultado[0].titulo).toBe('Beber agua');
  });
});

describe('desafioModel.buscarPorId', () => {
  test('retorna o desafio quando encontrado', async () => {
    pool.query.mockResolvedValue({ rows: [{ id_desafio: 1, titulo: 'Beber agua' }] });

    const resultado = await desafioModel.buscarPorId(1);

    expect(resultado.id_desafio).toBe(1);
  });

  test('retorna null quando nao encontrado', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const resultado = await desafioModel.buscarPorId(99);

    expect(resultado).toBeNull();
  });
});

describe('desafioModel.inscrever', () => {
  test('retorna a inscricao criada', async () => {
    pool.query.mockResolvedValue({ rows: [{ id_usuario: 1, id_desafio: 2, data_inicio: '2026-06-21' }] });

    const resultado = await desafioModel.inscrever(1, 2);

    expect(resultado.id_usuario).toBe(1);
    expect(resultado.id_desafio).toBe(2);
  });
});

describe('desafioModel.jaInscrito', () => {
  test('retorna true quando usuario ja esta inscrito', async () => {
    pool.query.mockResolvedValue({ rowCount: 1 });

    const resultado = await desafioModel.jaInscrito(1, 2);

    expect(resultado).toBe(true);
  });

  test('retorna false quando usuario nao esta inscrito', async () => {
    pool.query.mockResolvedValue({ rowCount: 0 });

    const resultado = await desafioModel.jaInscrito(1, 99);

    expect(resultado).toBe(false);
  });
});

describe('desafioModel.concluir', () => {
  test('retorna o registro de conclusao', async () => {
    pool.query.mockResolvedValue({
      rows: [{ id_conclusao: 1, id_usuario: 1, id_desafio: 2, status: 'concluido', pontuacao: 100 }]
    });

    const resultado = await desafioModel.concluir(1, 2, 100);

    expect(resultado.status).toBe('concluido');
    expect(resultado.pontuacao).toBe(100);
  });
});

describe('desafioModel.jaConcluiu', () => {
  test('retorna true quando desafio ja foi concluido', async () => {
    pool.query.mockResolvedValue({ rowCount: 1 });

    const resultado = await desafioModel.jaConcluiu(1, 2);

    expect(resultado).toBe(true);
  });

  test('retorna false quando desafio ainda nao foi concluido', async () => {
    pool.query.mockResolvedValue({ rowCount: 0 });

    const resultado = await desafioModel.jaConcluiu(1, 2);

    expect(resultado).toBe(false);
  });
});

describe('desafioModel.buscarDoUsuario', () => {
  test('retorna os desafios em que o usuario esta inscrito', async () => {
    pool.query.mockResolvedValue({
      rows: [
        { id_desafio: 1, titulo: 'Beber agua', pontuacao_prevista: 100, ativo: true, data_inicio: '2026-06-21' }
      ]
    });

    const resultado = await desafioModel.buscarDoUsuario(1);

    expect(resultado).toHaveLength(1);
    expect(resultado[0].titulo).toBe('Beber agua');
  });

  test('retorna lista vazia quando usuario nao tem desafios', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const resultado = await desafioModel.buscarDoUsuario(99);

    expect(resultado).toHaveLength(0);
  });
});
