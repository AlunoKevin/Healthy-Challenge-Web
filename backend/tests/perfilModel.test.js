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
        media_pontos: 266.66
      }]
    });

    const resultado = await perfilModel.buscarPerfil(1);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('FROM Usuario u'),
      [1]
    );

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
      media_pontos: 266.66
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
        nivel_dificuldade: 'D'
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
        1
      ]
    );

    expect(resultado).toEqual({
      id_usuario: 1,
      nome: 'Novo Nome',
      email: 'novo@test.com',
      nivel_dificuldade: 'D'
    });
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