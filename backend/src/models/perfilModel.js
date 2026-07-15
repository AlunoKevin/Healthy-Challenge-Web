const pool = require('../config/conexao');

async function buscarPerfil(idUsuario) {

    const sql = `
        SELECT
            u.id_usuario,
            u.nome,
            u.email,
            u.nivel_dificuldade,
            u.data_cadastro,
            u.dias_consecutivos,
            u.ultimo_acesso,
            u.bio,
            u.foto_url,

            l.id_liga,
            l.nome AS liga,

            e.desafios_concluidos,
            e.pontos_totais,
            e.media_pontos

        FROM Usuario u

        LEFT JOIN Liga l
            ON u.id_liga = l.id_liga

        LEFT JOIN vw_estatisticas_usuario e
            ON e.id_usuario = u.id_usuario

        WHERE u.id_usuario = $1;
    `;

    const resultado = await pool.query(sql,[idUsuario]);

    return resultado.rows[0];
}

async function buscarGrupos(idUsuario){

    const sql = `
        SELECT
            g.id_grupo,
            g.nome,
            g.descricao

        FROM Grupo g

        JOIN Usuario_Grupo ug
            ON ug.id_grupo = g.id_grupo

        WHERE ug.id_usuario = $1
    `;

    const resultado = await pool.query(sql,[idUsuario]);

    return resultado.rows;
}

async function buscarAmigos(idUsuario){

    const sql = `
        SELECT
            u.id_usuario,
            u.nome,
            u.email

        FROM Amizade a

        JOIN Usuario u
        ON u.id_usuario =

        CASE
            WHEN a.id_usuario_origem = $1
            THEN a.id_usuario_destino

            ELSE a.id_usuario_origem
        END

        WHERE
        (
            a.id_usuario_origem = $1
            OR
            a.id_usuario_destino = $1
        )
        AND
        a.status = 'ACEITA';
    `;

    const resultado = await pool.query(sql,[idUsuario]);

    return resultado.rows;
}

async function atualizarPerfil(idUsuario,dados){

    const sql = `
        UPDATE Usuario

        SET
            nome = COALESCE($1, nome),
            email = COALESCE($2, email),
            nivel_dificuldade = COALESCE($3, nivel_dificuldade),
            bio = COALESCE($4, bio),
            foto_url = COALESCE($5, foto_url)

        WHERE id_usuario = $6

        RETURNING
            id_usuario,
            nome,
            email,
            nivel_dificuldade,
            bio,
            foto_url
    `;

    const resultado = await pool.query(sql,[
        dados.nome ?? null,
        dados.email ?? null,
        dados.nivel_dificuldade ?? null,
        dados.bio ?? null,
        dados.foto_url ?? null,
        idUsuario
    ]);

    return resultado.rows[0];
}

module.exports = {
    buscarPerfil,
    buscarGrupos,
    buscarAmigos,
    atualizarPerfil
};