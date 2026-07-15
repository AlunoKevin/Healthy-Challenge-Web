const pool = require('../src/config/conexao');
const perfilModel = require('../src/models/perfilModel');

jest.mock('../src/config/conexao');

describe('perfilModel.buscarPerfil', () => {

  test('retorna perfil quando encontrado', async () => {

    pool.query.mockResolvedValue({
      rows: [{
        id_usuario: 1,
        nome: 'Kevin',
        email: 'kevin@test.com',
        nivel_dificuldade: 'M',
        data_cadastro: '2026-07-01',
        dias_consecutivos: 5,
        ultimo_acesso: '2026-07-14',
        id_liga: 2,
        liga: 'Prata',
        desafios_concluidos: 12,
        pontos_totais: 3200,
        media_pontos: 266.66,
        bio: 'Gosto de correr',
        foto_url: 'data:image/png;base64,abc'
      }]
    });

    const resultado = await perfilModel.buscarPerfil(1);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('FROM Usuario u'),
      [1]
    );

    expect(pool.query.mock.calls[0][0]).toEqual(expect.stringContaining('bio'));
    expect(pool.query.mock.calls[0][0]).toEqual(expect.stringContaining('foto_url'));

    expect(resultado).toEqual({
      id_usuario: 1,
      nome: 'Kevin',
      email: 'kevin@test.com',
      nivel_dificuldade: 'M',
      data_cadastro: '2026-07-01',
      dias_consecutivos: 5,
      ultimo_acesso: '2026-07-14',
      id_liga: 2,
      liga: 'Prata',
      desafios_concluidos: 12,
      pontos_totais: 3200,
      media_pontos: 266.66,
      bio: 'Gosto de correr',
      foto_url: 'data:image/png;base64,abc'
    });
  });

  test('retorna undefined quando usuario nao existe', async () => {

    pool.query.mockResolvedValue({
      rows: []
    });

    const resultado = await perfilModel.buscarPerfil(999);

    expect(resultado).toBeUndefined();
  });

});

describe('perfilModel.buscarGrupos', () => {

  test('retorna grupos do usuario', async () => {

    pool.query.mockResolvedValue({
      rows: [
        {
          id_grupo: 1,
          nome: 'Academia',
          descricao: 'Grupo da academia'
        },
        {
          id_grupo: 2,
          nome: 'Corrida',
          descricao: 'Grupo de corrida'
        }
      ]
    });

    const resultado = await perfilModel.buscarGrupos(1);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('FROM Grupo g'),
      [1]
    );

    expect(resultado).toEqual([
      {
        id_grupo: 1,
        nome: 'Academia',
        descricao: 'Grupo da academia'
      },
      {
        id_grupo: 2,
        nome: 'Corrida',
        descricao: 'Grupo de corrida'
      }
    ]);
  });

  test('retorna array vazio quando nao possui grupos', async () => {

    pool.query.mockResolvedValue({
      rows: []
    });

    const resultado = await perfilModel.buscarGrupos(1);

    expect(resultado).toEqual([]);
  });

});

describe('perfilModel.buscarAmigos', () => {

  test('retorna amigos do usuario', async () => {

    pool.query.mockResolvedValue({
      rows: [
        {
          id_usuario: 2,
          nome: 'Joao',
          email: 'joao@test.com'
        },
        {
          id_usuario: 3,
          nome: 'Maria',
          email: 'maria@test.com'
        }
      ]
    });

    const resultado = await perfilModel.buscarAmigos(1);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('FROM Amizade a'),
      [1]
    );

    expect(resultado).toEqual([
      {
        id_usuario: 2,
        nome: 'Joao',
        email: 'joao@test.com'
      },
      {
        id_usuario: 3,
        nome: 'Maria',
        email: 'maria@test.com'
      }
    ]);
  });

  test('retorna array vazio quando nao possui amigos', async () => {

    pool.query.mockResolvedValue({
      rows: []
    });

    const resultado = await perfilModel.buscarAmigos(1);

    expect(resultado).toEqual([]);
  });

});

describe('perfilModel.atualizarPerfil', () => {

  test('atualiza perfil corretamente', async () => {

    pool.query.mockResolvedValue({
      rows: [{
        id_usuario: 1,
        nome: 'Novo Nome',
        email: 'novo@test.com',
        nivel_dificuldade: 'D',
        bio: null,
        foto_url: null
      }]
    });

    const resultado = await perfilModel.atualizarPerfil(
      1,
      {
        nome: 'Novo Nome',
        email: 'novo@test.com',
        nivel_dificuldade: 'D'
      }
    );

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE Usuario'),
      [
        'Novo Nome',
        'novo@test.com',
        'D',
        null,
        null,
        1
      ]
    );

    expect(resultado).toEqual({
      id_usuario: 1,
      nome: 'Novo Nome',
      email: 'novo@test.com',
      nivel_dificuldade: 'D',
      bio: null,
      foto_url: null
    });
  });

  test('atualiza somente a bio sem afetar os demais campos', async () => {

    pool.query.mockResolvedValue({
      rows: [{
        id_usuario: 1,
        nome: 'Kevin',
        email: 'kevin@test.com',
        nivel_dificuldade: 'M',
        bio: 'Nova bio',
        foto_url: null
      }]
    });

    const resultado = await perfilModel.atualizarPerfil(
      1,
      { bio: 'Nova bio' }
    );

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('COALESCE'),
      [
        null,
        null,
        null,
        'Nova bio',
        null,
        1
      ]
    );

    expect(resultado.bio).toBe('Nova bio');
  });

  test('atualiza somente a foto_url sem afetar os demais campos', async () => {

    pool.query.mockResolvedValue({
      rows: [{
        id_usuario: 1,
        nome: 'Kevin',
        email: 'kevin@test.com',
        nivel_dificuldade: 'M',
        bio: null,
        foto_url: 'data:image/png;base64,xyz'
      }]
    });

    const resultado = await perfilModel.atualizarPerfil(
      1,
      { foto_url: 'data:image/png;base64,xyz' }
    );

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('COALESCE'),
      [
        null,
        null,
        null,
        null,
        'data:image/png;base64,xyz',
        1
      ]
    );

    expect(resultado.foto_url).toBe('data:image/png;base64,xyz');
  });

  test('retorna undefined quando usuario nao existe', async () => {

    pool.query.mockResolvedValue({
      rows: []
    });

    const resultado = await perfilModel.atualizarPerfil(
      999,
      {
        nome: 'Teste',
        email: 'teste@test.com',
        nivel_dificuldade: 'F'
      }
    );

    expect(resultado).toBeUndefined();
  });

});