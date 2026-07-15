const amizadeService = require('../src/services/amizadeService');
const amizadeModel = require('../src/models/amizadeModel');
const usuarioModel = require('../src/models/usuarioModel');

jest.mock('../src/models/amizadeModel');
jest.mock('../src/models/usuarioModel');

describe('amizadeService.buscarUsuarios', () => {
  beforeEach(() => jest.clearAllMocks());

  test('rejeita termo com menos de 2 caracteres', async () => {
    await expect(amizadeService.buscarUsuarios('a', 1)).rejects.toMatchObject({ status: 400 });
    expect(amizadeModel.buscarUsuarios).not.toHaveBeenCalled();
  });

  test('marca relacionamento AMIGOS quando status e ACEITA', async () => {
    amizadeModel.buscarUsuarios.mockResolvedValue([
      { id_usuario: 2, nome: 'Joao', email: 'joao@test.com', foto_url: null, status: 'ACEITA', id_usuario_origem: 1 }
    ]);

    const resultado = await amizadeService.buscarUsuarios('joao', 1);

    expect(resultado[0].relacionamento).toBe('AMIGOS');
  });

  test('marca PENDENTE_ENVIADO quando o proprio usuario enviou o pedido', async () => {
    amizadeModel.buscarUsuarios.mockResolvedValue([
      { id_usuario: 2, nome: 'Joao', email: 'joao@test.com', foto_url: null, status: 'PENDENTE', id_usuario_origem: 1 }
    ]);

    const resultado = await amizadeService.buscarUsuarios('joao', 1);

    expect(resultado[0].relacionamento).toBe('PENDENTE_ENVIADO');
  });

  test('marca PENDENTE_RECEBIDO quando o outro usuario enviou o pedido', async () => {
    amizadeModel.buscarUsuarios.mockResolvedValue([
      { id_usuario: 2, nome: 'Joao', email: 'joao@test.com', foto_url: null, status: 'PENDENTE', id_usuario_origem: 2 }
    ]);

    const resultado = await amizadeService.buscarUsuarios('joao', 1);

    expect(resultado[0].relacionamento).toBe('PENDENTE_RECEBIDO');
  });

  test('marca NENHUMA quando nao ha relacionamento ou ele foi rejeitado', async () => {
    amizadeModel.buscarUsuarios.mockResolvedValue([
      { id_usuario: 2, nome: 'Joao', email: 'joao@test.com', foto_url: null, status: null, id_usuario_origem: null },
      { id_usuario: 3, nome: 'Maria', email: 'maria@test.com', foto_url: null, status: 'REJEITADA', id_usuario_origem: 1 }
    ]);

    const resultado = await amizadeService.buscarUsuarios('jo', 1);

    expect(resultado[0].relacionamento).toBe('NENHUMA');
    expect(resultado[1].relacionamento).toBe('NENHUMA');
  });
});

describe('amizadeService.solicitarAmizade', () => {
  beforeEach(() => jest.clearAllMocks());

  test('rejeita adicionar a si mesmo', async () => {
    await expect(amizadeService.solicitarAmizade(1, 1)).rejects.toMatchObject({ status: 400 });
    expect(usuarioModel.buscarPorId).not.toHaveBeenCalled();
  });

  test('rejeita quando o usuario destino nao existe', async () => {
    usuarioModel.buscarPorId.mockResolvedValue(undefined);

    await expect(amizadeService.solicitarAmizade(1, 99)).rejects.toMatchObject({ status: 404 });
  });

  test('rejeita quando ja sao amigos', async () => {
    usuarioModel.buscarPorId.mockResolvedValue({ id_usuario: 2 });
    amizadeModel.buscarEntre.mockResolvedValue({ status: 'ACEITA' });

    await expect(amizadeService.solicitarAmizade(1, 2)).rejects.toMatchObject({ status: 409 });
    expect(amizadeModel.solicitar).not.toHaveBeenCalled();
  });

  test('rejeita quando ja existe pedido pendente', async () => {
    usuarioModel.buscarPorId.mockResolvedValue({ id_usuario: 2 });
    amizadeModel.buscarEntre.mockResolvedValue({ status: 'PENDENTE' });

    await expect(amizadeService.solicitarAmizade(1, 2)).rejects.toMatchObject({ status: 409 });
    expect(amizadeModel.solicitar).not.toHaveBeenCalled();
  });

  test('reabre a amizade quando o pedido anterior foi rejeitado', async () => {
    usuarioModel.buscarPorId.mockResolvedValue({ id_usuario: 2 });
    amizadeModel.buscarEntre.mockResolvedValue({ status: 'REJEITADA' });
    amizadeModel.reenviar.mockResolvedValue({ status: 'PENDENTE' });

    const resultado = await amizadeService.solicitarAmizade(1, 2);

    expect(amizadeModel.reenviar).toHaveBeenCalledWith(1, 2);
    expect(amizadeModel.solicitar).not.toHaveBeenCalled();
    expect(resultado.status).toBe('PENDENTE');
  });

  test('cria uma nova solicitacao quando nao ha relacionamento previo', async () => {
    usuarioModel.buscarPorId.mockResolvedValue({ id_usuario: 2 });
    amizadeModel.buscarEntre.mockResolvedValue(null);
    amizadeModel.solicitar.mockResolvedValue({ status: 'PENDENTE' });

    const resultado = await amizadeService.solicitarAmizade(1, 2);

    expect(amizadeModel.solicitar).toHaveBeenCalledWith(1, 2);
    expect(resultado.status).toBe('PENDENTE');
  });
});

describe('amizadeService.listarPendentes', () => {
  beforeEach(() => jest.clearAllMocks());

  test('repassa o id do usuario para o model', async () => {
    amizadeModel.buscarPendentesRecebidos.mockResolvedValue([{ id_usuario: 2 }]);

    const resultado = await amizadeService.listarPendentes(1);

    expect(amizadeModel.buscarPendentesRecebidos).toHaveBeenCalledWith(1);
    expect(resultado).toEqual([{ id_usuario: 2 }]);
  });
});

describe('amizadeService.aceitarAmizade', () => {
  beforeEach(() => jest.clearAllMocks());

  test('aceita o pedido usando quem enviou como origem', async () => {
    amizadeModel.aceitar.mockResolvedValue({ status: 'ACEITA' });

    const resultado = await amizadeService.aceitarAmizade(1, 2);

    expect(amizadeModel.aceitar).toHaveBeenCalledWith(2, 1);
    expect(resultado.status).toBe('ACEITA');
  });

  test('lanca 404 quando o pedido nao existe', async () => {
    amizadeModel.aceitar.mockResolvedValue(null);

    await expect(amizadeService.aceitarAmizade(1, 2)).rejects.toMatchObject({ status: 404 });
  });
});

describe('amizadeService.rejeitarAmizade', () => {
  beforeEach(() => jest.clearAllMocks());

  test('rejeita o pedido usando quem enviou como origem', async () => {
    amizadeModel.rejeitar.mockResolvedValue({ status: 'REJEITADA' });

    const resultado = await amizadeService.rejeitarAmizade(1, 2);

    expect(amizadeModel.rejeitar).toHaveBeenCalledWith(2, 1);
    expect(resultado.status).toBe('REJEITADA');
  });

  test('lanca 404 quando o pedido nao existe', async () => {
    amizadeModel.rejeitar.mockResolvedValue(null);

    await expect(amizadeService.rejeitarAmizade(1, 2)).rejects.toMatchObject({ status: 404 });
  });
});
