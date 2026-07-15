const amizadeModel = require('../src/models/amizadeModel');
const pool = require('../src/config/conexao');

jest.mock('../src/config/conexao', () => ({ query: jest.fn() }));

describe('amizadeModel.buscarUsuarios', () => {
  beforeEach(() => jest.clearAllMocks());

  test('busca usuarios pelo termo e retorna status do relacionamento', async () => {
    pool.query.mockResolvedValue({
      rows: [
        { id_usuario: 2, nome: 'Joao', email: 'joao@test.com', foto_url: null, status: null, id_usuario_origem: null }
      ]
    });

    const resultado = await amizadeModel.buscarUsuarios('joao', 1);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('FROM Usuario u'),
      ['%joao%', 1]
    );
    expect(resultado).toHaveLength(1);
  });
});

describe('amizadeModel.buscarEntre', () => {
  beforeEach(() => jest.clearAllMocks());

  test('retorna a amizade existente em qualquer direcao', async () => {
    pool.query.mockResolvedValue({
      rows: [{ id_usuario_origem: 1, id_usuario_destino: 2, status: 'ACEITA' }]
    });

    const resultado = await amizadeModel.buscarEntre(2, 1);

    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [2, 1]);
    expect(resultado).toEqual({ id_usuario_origem: 1, id_usuario_destino: 2, status: 'ACEITA' });
  });

  test('retorna null quando nao ha amizade', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const resultado = await amizadeModel.buscarEntre(1, 2);

    expect(resultado).toBeNull();
  });
});

describe('amizadeModel.solicitar', () => {
  beforeEach(() => jest.clearAllMocks());

  test('insere uma solicitacao pendente', async () => {
    pool.query.mockResolvedValue({
      rows: [{ id_usuario_origem: 1, id_usuario_destino: 2, status: 'PENDENTE', data_solicitacao: '2026-01-01' }]
    });

    const resultado = await amizadeModel.solicitar(1, 2);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("'PENDENTE'"),
      [1, 2]
    );
    expect(resultado.status).toBe('PENDENTE');
  });
});

describe('amizadeModel.reenviar', () => {
  beforeEach(() => jest.clearAllMocks());

  test('reabre a amizade existente como pendente', async () => {
    pool.query.mockResolvedValue({
      rows: [{ id_usuario_origem: 1, id_usuario_destino: 2, status: 'PENDENTE' }]
    });

    const resultado = await amizadeModel.reenviar(1, 2);

    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE Amizade'), [1, 2]);
    expect(resultado.status).toBe('PENDENTE');
  });
});

describe('amizadeModel.buscarPendentesRecebidos', () => {
  beforeEach(() => jest.clearAllMocks());

  test('retorna os pedidos pendentes recebidos pelo usuario', async () => {
    pool.query.mockResolvedValue({
      rows: [{ id_usuario: 2, nome: 'Joao', email: 'joao@test.com', foto_url: null, data_solicitacao: '2026-01-01' }]
    });

    const resultado = await amizadeModel.buscarPendentesRecebidos(1);

    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("a.status = 'PENDENTE'"), [1]);
    expect(resultado).toHaveLength(1);
  });

  test('retorna array vazio quando nao ha pedidos pendentes', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const resultado = await amizadeModel.buscarPendentesRecebidos(1);

    expect(resultado).toEqual([]);
  });
});

describe('amizadeModel.aceitar', () => {
  beforeEach(() => jest.clearAllMocks());

  test('aceita um pedido pendente', async () => {
    pool.query.mockResolvedValue({
      rows: [{ id_usuario_origem: 2, id_usuario_destino: 1, status: 'ACEITA' }]
    });

    const resultado = await amizadeModel.aceitar(2, 1);

    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("'ACEITA'"), [2, 1]);
    expect(resultado.status).toBe('ACEITA');
  });

  test('retorna null quando nao ha pedido pendente correspondente', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const resultado = await amizadeModel.aceitar(2, 1);

    expect(resultado).toBeNull();
  });
});

describe('amizadeModel.rejeitar', () => {
  beforeEach(() => jest.clearAllMocks());

  test('rejeita um pedido pendente', async () => {
    pool.query.mockResolvedValue({
      rows: [{ id_usuario_origem: 2, id_usuario_destino: 1, status: 'REJEITADA' }]
    });

    const resultado = await amizadeModel.rejeitar(2, 1);

    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("'REJEITADA'"), [2, 1]);
    expect(resultado.status).toBe('REJEITADA');
  });
});
