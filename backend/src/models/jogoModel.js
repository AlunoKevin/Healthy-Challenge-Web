const pool = require('../config/conexao');

async function buscarDesafioMemoria() {

    const sql = `

        SELECT
            id_desafio,
            pontuacao_prevista

        FROM Desafio

        WHERE titulo = 'Jogo da Memoria'

        LIMIT 1

    `;

    const resultado = await pool.query(sql);

    return resultado.rows[0];

}

async function registrarConclusao(idUsuario,idDesafio,pontuacao){

    const sql = `

        INSERT INTO Conclusao_Desafio
        (

            id_usuario,

            id_desafio,

            status,

            pontuacao,

            data_conclusao

        )

        VALUES

        (

            $1,

            $2,

            'concluido',

            $3,

            CURRENT_TIMESTAMP

        )

        RETURNING *

    `;

    const resultado = await pool.query(

        sql,

        [

            idUsuario,

            idDesafio,

            pontuacao

        ]

    );

    return resultado.rows[0];

}

async function jaConcluiu(idUsuario,idDesafio){

    const sql = `

        SELECT 1

        FROM Conclusao_Desafio

        WHERE

            id_usuario = $1

            AND

            id_desafio = $2

    `;

    const resultado = await pool.query(

        sql,

        [

            idUsuario,

            idDesafio

        ]

    );

    return resultado.rowCount > 0;

}

async function buscarPontuacaoTotal(idUsuario){

    const sql = `

        SELECT

            pontos_totais

        FROM vw_estatisticas_usuario

        WHERE id_usuario = $1

    `;

    const resultado = await pool.query(

        sql,

        [idUsuario]

    );

    return resultado.rows[0];

}

async function atualizarLeaderboards(){

    await pool.query(

        'REFRESH MATERIALIZED VIEW mv_leaderboard_global'

    );

    await pool.query(

        'REFRESH MATERIALIZED VIEW mv_leaderboard_grupo'

    );

}

async function atualizarLigas(){

    await pool.query(

        'SELECT atualizar_ligas()'

    );

}

module.exports = {
    buscarDesafioMemoria,
    registrarConclusao,
    jaConcluiu,
    buscarPontuacaoTotal,
    atualizarLeaderboards,
    atualizarLigas
};