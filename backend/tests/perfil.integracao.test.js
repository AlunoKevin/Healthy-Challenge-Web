const pool = require('../src/config/conexao');

const perfilModel =
    require('../src/models/perfilModel');

describe('Perfil Integration Tests', () => {

    let idUsuario;
    let idLiga;
    let idGrupo;
    let idAmigo;

    beforeAll(async () => {

        /*
            cria liga
        */
        const ligaResult = await pool.query(`
            INSERT INTO Liga(nome, descricao)
            VALUES ('Liga Teste', 'Liga para testes')
            RETURNING id_liga
        `);

        idLiga = ligaResult.rows[0].id_liga;

        /*
            cria usuario principal
        */
        const usuarioResult = await pool.query(`
            INSERT INTO Usuario(
                nome,
                email,
                senha_hash,
                nivel_dificuldade,
                id_liga
            )
            VALUES(
                'Usuario Teste',
                'usuario_teste@email.com',
                'hash',
                'M',
                $1
            )
            RETURNING id_usuario
        `,[idLiga]);

        idUsuario = usuarioResult.rows[0].id_usuario;

        /*
            cria amigo
        */
        const amigoResult = await pool.query(`
            INSERT INTO Usuario(
                nome,
                email,
                senha_hash,
                nivel_dificuldade,
                id_liga
            )
            VALUES(
                'Amigo Teste',
                'amigo@email.com',
                'hash',
                'F',
                $1
            )
            RETURNING id_usuario
        `,[idLiga]);

        idAmigo = amigoResult.rows[0].id_usuario;

        /*
            cria amizade
        */
        await pool.query(`
            INSERT INTO Amizade(
                id_usuario_origem,
                id_usuario_destino,
                status
            )
            VALUES($1,$2,'ACEITA')
        `,[idUsuario,idAmigo]);

        /*
            cria grupo
        */
        const grupoResult = await pool.query(`
            INSERT INTO Grupo(
                nome,
                descricao
            )
            VALUES(
                'Grupo Teste',
                'Grupo de integração'
            )
            RETURNING id_grupo
        `);

        idGrupo = grupoResult.rows[0].id_grupo;

        /*
            adiciona usuario ao grupo
        */
        await pool.query(`
            INSERT INTO Usuario_Grupo(
                id_usuario,
                id_grupo
            )
            VALUES($1,$2)
        `,[idUsuario,idGrupo]);

        /*
            atualiza leaderboard
        */

        await pool.query(`
            REFRESH MATERIALIZED VIEW
            mv_leaderboard_global
        `);
    });

    afterAll(async () => {

        await pool.query(`
            DELETE FROM Usuario_Grupo
            WHERE id_usuario = $1
        `,[idUsuario]);

        await pool.query(`
            DELETE FROM Amizade
            WHERE
                id_usuario_origem = $1
                OR
                id_usuario_destino = $1
        `,[idUsuario]);

        await pool.query(`
            DELETE FROM Grupo
            WHERE id_grupo = $1
        `,[idGrupo]);

        await pool.query(`
            DELETE FROM Usuario
            WHERE id_usuario IN ($1,$2)
        `,[idUsuario,idAmigo]);

        await pool.query(`
            DELETE FROM Liga
            WHERE id_liga = $1
        `,[idLiga]);

        await pool.end();
    });

    test(
        'buscarPerfil retorna dados do usuario',
        async () => {

            const perfil =
                await perfilModel.buscarPerfil(
                    idUsuario
                );

            expect(perfil).toBeDefined();

            expect(perfil.nome)
                .toBe('Usuario Teste');

            expect(perfil.email)
                .toBe(
                    'usuario_teste@email.com'
                );

            expect(
                perfil.nivel_dificuldade
            ).toBe('M');
        }
    );

    test(
        'buscarGrupos retorna grupos do usuario',
        async () => {

            const grupos =
                await perfilModel.buscarGrupos(
                    idUsuario
                );

            expect(grupos.length)
                .toBeGreaterThan(0);

            expect(grupos[0].nome)
                .toBe('Grupo Teste');
        }
    );

    test(
        'buscarAmigos retorna amigos do usuario',
        async () => {

            const amigos =
                await perfilModel.buscarAmigos(
                    idUsuario
                );

            expect(amigos.length)
                .toBe(1);

            expect(amigos[0].nome)
                .toBe('Amigo Teste');
        }
    );

});