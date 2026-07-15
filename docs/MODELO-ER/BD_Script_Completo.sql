-- =====================================================
-- DROP SECTION
-- =====================================================

DROP TABLE IF EXISTS Configuracao_Pontuacao CASCADE;
DROP TABLE IF EXISTS Amizade CASCADE;
DROP TABLE IF EXISTS Usuario_Desafio CASCADE;
DROP TABLE IF EXISTS Grupo_Desafio CASCADE;
DROP TABLE IF EXISTS Usuario_Grupo CASCADE;
DROP TABLE IF EXISTS Usuario_Habito CASCADE;
DROP TABLE IF EXISTS Administrador_Habito CASCADE;
DROP TABLE IF EXISTS Administrador_Jogo CASCADE;
DROP TABLE IF EXISTS Conclusao_Desafio CASCADE;
DROP TABLE IF EXISTS Historico_Atividades CASCADE;
DROP TABLE IF EXISTS Desafio CASCADE;
DROP TABLE IF EXISTS Jogo CASCADE;
DROP TABLE IF EXISTS Habito CASCADE;
DROP TABLE IF EXISTS Grupo CASCADE;
DROP TABLE IF EXISTS Usuario CASCADE;
DROP TABLE IF EXISTS Liga CASCADE;
DROP TABLE IF EXISTS Administrador CASCADE;

-- =====================================================
-- LIGA
-- =====================================================

CREATE TABLE Liga(
    id_liga BIGSERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    descricao TEXT
);

-- =====================================================
-- USUARIO
-- =====================================================

CREATE TABLE Usuario(
    id_usuario BIGSERIAL PRIMARY KEY,

    id_liga BIGINT,

    nome VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    senha_hash VARCHAR(255) NOT NULL,

    nivel_dificuldade CHAR(1) NOT NULL,

    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    ultimo_acesso TIMESTAMP,

    dias_consecutivos INTEGER DEFAULT 0,

    bio TEXT,

    foto_url TEXT,

    CONSTRAINT fk_usuario_liga
        FOREIGN KEY(id_liga)
        REFERENCES Liga(id_liga),

    CONSTRAINT ck_dificuldade
        CHECK(nivel_dificuldade IN ('F','M','D'))
);

-- =====================================================
-- GRUPO
-- =====================================================

CREATE TABLE Grupo(
    id_grupo BIGSERIAL PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,

    descricao TEXT
);

-- =====================================================
-- HABITO
-- =====================================================

CREATE TABLE Habito(
    id_habito BIGSERIAL PRIMARY KEY,

    nome VARCHAR(100) NOT NULL,

    categoria VARCHAR(50),

    descricao TEXT
);

-- =====================================================
-- ADMINISTRADOR
-- =====================================================

CREATE TABLE Administrador(
    id_administrador BIGSERIAL PRIMARY KEY,

    email VARCHAR(150) UNIQUE NOT NULL,

    senha VARCHAR(255) NOT NULL,

    chave_de_acesso VARCHAR(255) NOT NULL
);

-- =====================================================
-- JOGO
-- =====================================================

CREATE TABLE Jogo(
    id_jogo BIGSERIAL PRIMARY KEY,

    fase_atual INTEGER NOT NULL,

    multiplicador_pontos NUMERIC(10,2)
        DEFAULT 1.00
);

-- =====================================================
-- DESAFIO
-- =====================================================

CREATE TABLE Desafio(
    id_desafio BIGSERIAL PRIMARY KEY,

    id_jogo BIGINT NOT NULL,

    id_administrador BIGINT NOT NULL,

    titulo VARCHAR(150) NOT NULL,

    descricao TEXT,

    pontuacao_prevista INTEGER NOT NULL,

    ativo BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_desafio_jogo
        FOREIGN KEY(id_jogo)
        REFERENCES Jogo(id_jogo),

    CONSTRAINT fk_desafio_admin
        FOREIGN KEY(id_administrador)
        REFERENCES Administrador(id_administrador)
);

-- =====================================================
-- CONCLUSAO DESAFIO
-- =====================================================

CREATE TABLE Conclusao_Desafio(
    id_conclusao BIGSERIAL PRIMARY KEY,

    id_usuario BIGINT NOT NULL,

    id_desafio BIGINT NOT NULL,

    status VARCHAR(30) NOT NULL,

    pontuacao INTEGER NOT NULL,

    data_conclusao TIMESTAMP,

    CONSTRAINT fk_cd_usuario
        FOREIGN KEY(id_usuario)
        REFERENCES Usuario(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_cd_desafio
        FOREIGN KEY(id_desafio)
        REFERENCES Desafio(id_desafio)
        ON DELETE CASCADE,

    CONSTRAINT uq_usuario_desafio
        UNIQUE(id_usuario,id_desafio)
);

-- =====================================================
-- HISTORICO
-- =====================================================

CREATE TABLE Historico_Atividades(
    id_atividade BIGSERIAL PRIMARY KEY,

    id_usuario BIGINT NOT NULL,

    data_acesso TIMESTAMP NOT NULL,

    tempo_acessado INTEGER NOT NULL,

    atividades_realizadas TEXT,

    CONSTRAINT fk_hist_usuario
        FOREIGN KEY(id_usuario)
        REFERENCES Usuario(id_usuario)
        ON DELETE CASCADE
);

-- =====================================================
-- USUARIO GRUPO
-- =====================================================

CREATE TABLE Usuario_Grupo(
    id_usuario BIGINT NOT NULL,
    id_grupo BIGINT NOT NULL,

    PRIMARY KEY(id_usuario,id_grupo),

    FOREIGN KEY(id_usuario)
        REFERENCES Usuario(id_usuario)
        ON DELETE CASCADE,

    FOREIGN KEY(id_grupo)
        REFERENCES Grupo(id_grupo)
        ON DELETE CASCADE
);

-- =====================================================
-- USUARIO HABITO
-- =====================================================

CREATE TABLE Usuario_Habito(
    id_usuario BIGINT NOT NULL,
    id_habito BIGINT NOT NULL,

    PRIMARY KEY(id_usuario,id_habito),

    FOREIGN KEY(id_usuario)
        REFERENCES Usuario(id_usuario)
        ON DELETE CASCADE,

    FOREIGN KEY(id_habito)
        REFERENCES Habito(id_habito)
        ON DELETE CASCADE
);

-- =====================================================
-- ADMINISTRADOR HABITO
-- =====================================================

CREATE TABLE Administrador_Habito(
    id_administrador BIGINT NOT NULL,
    id_habito BIGINT NOT NULL,

    PRIMARY KEY(id_administrador,id_habito),

    FOREIGN KEY(id_administrador)
        REFERENCES Administrador(id_administrador),

    FOREIGN KEY(id_habito)
        REFERENCES Habito(id_habito)
);

-- =====================================================
-- ADMINISTRADOR JOGO
-- =====================================================

CREATE TABLE Administrador_Jogo(
    id_administrador BIGINT NOT NULL,
    id_jogo BIGINT NOT NULL,

    PRIMARY KEY(id_administrador,id_jogo),

    FOREIGN KEY(id_administrador)
        REFERENCES Administrador(id_administrador),

    FOREIGN KEY(id_jogo)
        REFERENCES Jogo(id_jogo)
);

-- =====================================================
-- USUARIO DESAFIO
-- =====================================================

CREATE TABLE Usuario_Desafio(
    id_usuario BIGINT NOT NULL,
    id_desafio BIGINT NOT NULL,

    data_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY(id_usuario,id_desafio),

    FOREIGN KEY(id_usuario)
        REFERENCES Usuario(id_usuario)
        ON DELETE CASCADE,

    FOREIGN KEY(id_desafio)
        REFERENCES Desafio(id_desafio)
        ON DELETE CASCADE
);

-- =====================================================
-- GRUPO DESAFIO
-- =====================================================

CREATE TABLE Grupo_Desafio(
    id_grupo BIGINT NOT NULL,
    id_desafio BIGINT NOT NULL,

    PRIMARY KEY(id_grupo,id_desafio),

    FOREIGN KEY(id_grupo)
        REFERENCES Grupo(id_grupo)
        ON DELETE CASCADE,

    FOREIGN KEY(id_desafio)
        REFERENCES Desafio(id_desafio)
        ON DELETE CASCADE
);

-- =====================================================
-- AMIZADE
-- =====================================================

CREATE TABLE Amizade(
    id_usuario_origem BIGINT NOT NULL,

    id_usuario_destino BIGINT NOT NULL,

    data_solicitacao TIMESTAMP NOT NULL,

    data_aceitar TIMESTAMP,

    status VARCHAR(20) NOT NULL,

    PRIMARY KEY(
        id_usuario_origem,
        id_usuario_destino
    ),

    FOREIGN KEY(id_usuario_origem)
        REFERENCES Usuario(id_usuario)
        ON DELETE CASCADE,

    FOREIGN KEY(id_usuario_destino)
        REFERENCES Usuario(id_usuario)
        ON DELETE CASCADE,

    CHECK(
        id_usuario_origem <>
        id_usuario_destino
    )
);

-- =====================================================
-- CONFIGURACAO PONTUACAO
-- =====================================================

CREATE TABLE Configuracao_Pontuacao(
    id_configuracao BIGSERIAL PRIMARY KEY,

    id_administrador BIGINT NOT NULL,

    id_conclusao BIGINT NOT NULL,

    data_modificacao TIMESTAMP NOT NULL,

    qtd_campos_alterados INTEGER NOT NULL,

    FOREIGN KEY(id_administrador)
        REFERENCES Administrador(id_administrador),

    FOREIGN KEY(id_conclusao)
        REFERENCES Conclusao_Desafio(id_conclusao)
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_cd_usuario
ON Conclusao_Desafio(id_usuario);

CREATE INDEX idx_cd_desafio
ON Conclusao_Desafio(id_desafio);

CREATE INDEX idx_hist_usuario
ON Historico_Atividades(id_usuario);

CREATE INDEX idx_usuario_liga
ON Usuario(id_liga);

CREATE INDEX idx_desafio_jogo
ON Desafio(id_jogo);

CREATE VIEW vw_leaderboard_global AS
SELECT
    u.id_usuario,
    u.nome,
    COALESCE(SUM(cd.pontuacao),0) AS pontuacao_total,
    RANK() OVER(
        ORDER BY
        COALESCE(SUM(cd.pontuacao),0) DESC
    ) AS posicao
FROM Usuario u
LEFT JOIN Conclusao_Desafio cd
    ON u.id_usuario = cd.id_usuario
GROUP BY
    u.id_usuario,
    u.nome;
    
 --- GRUPO VIEW LEADERBOARD
CREATE VIEW vw_leaderboard_grupo AS
SELECT
    g.id_grupo,
    g.nome AS grupo,

    u.id_usuario,
    u.nome AS usuario,

    COALESCE(SUM(cd.pontuacao),0)
        AS pontuacao_total,

    RANK() OVER(
        PARTITION BY g.id_grupo
        ORDER BY
        COALESCE(SUM(cd.pontuacao),0) DESC
    ) AS posicao_grupo

FROM Grupo g

JOIN Usuario_Grupo ug
    ON g.id_grupo = ug.id_grupo

JOIN Usuario u
    ON ug.id_usuario = u.id_usuario

LEFT JOIN Conclusao_Desafio cd
    ON u.id_usuario = cd.id_usuario

GROUP BY
    g.id_grupo,
    g.nome,
    u.id_usuario,
    u.nome;
    
    
--- ESTATISTICAS USUARIO

CREATE VIEW vw_estatisticas_usuario AS
SELECT
    u.id_usuario,
    u.nome,

    COUNT(DISTINCT cd.id_desafio)
        AS desafios_concluidos,

    COALESCE(SUM(cd.pontuacao),0)
        AS pontos_totais,

    AVG(cd.pontuacao)
        AS media_pontos

FROM Usuario u

LEFT JOIN Conclusao_Desafio cd
    ON u.id_usuario = cd.id_usuario

GROUP BY
    u.id_usuario,
    u.nome;
    
--- RANKING DAS LIGAS

CREATE VIEW vw_ranking_ligas AS
SELECT
    l.id_liga,
    l.nome,

    COALESCE(
        SUM(cd.pontuacao),
        0
    ) AS pontuacao_total

FROM Liga l

LEFT JOIN Usuario u
    ON l.id_liga = u.id_liga

LEFT JOIN Conclusao_Desafio cd
    ON u.id_usuario = cd.id_usuario

GROUP BY
    l.id_liga,
    l.nome

ORDER BY pontuacao_total DESC;


-- =====================================================
-- MATERIALIZED VIEWS
-- =====================================================


CREATE MATERIALIZED VIEW mv_leaderboard_global AS
SELECT
    u.id_usuario,
    u.nome,
    COALESCE(SUM(cd.pontuacao),0) AS pontuacao_total,
    RANK() OVER (
        ORDER BY COALESCE(SUM(cd.pontuacao),0) DESC
    ) AS posicao
FROM Usuario u
LEFT JOIN Conclusao_Desafio cd
    ON u.id_usuario = cd.id_usuario
GROUP BY
    u.id_usuario,
    u.nome;
    
    
    
    
CREATE MATERIALIZED VIEW mv_leaderboard_grupo AS
SELECT
    g.id_grupo,
    g.nome AS grupo,

    u.id_usuario,
    u.nome AS usuario,

    COALESCE(SUM(cd.pontuacao),0)
        AS pontuacao_total,

    RANK() OVER (
        PARTITION BY g.id_grupo
        ORDER BY COALESCE(SUM(cd.pontuacao),0) DESC
    ) AS posicao_grupo

FROM Grupo g

JOIN Usuario_Grupo ug
    ON g.id_grupo = ug.id_grupo

JOIN Usuario u
    ON ug.id_usuario = u.id_usuario

LEFT JOIN Conclusao_Desafio cd
    ON u.id_usuario = cd.id_usuario

GROUP BY
    g.id_grupo,
    g.nome,
    u.id_usuario,
    u.nome;


-- =====================================================
-- LEAGUE DATA
-- =====================================================


INSERT INTO Liga(nome, descricao)
VALUES
('Bronze','0-499 pontos'),
('Silver','500-1499 pontos'),
('Gold','1500-2999 pontos'),
('Platinum','3000-5999 pontos'),
('Diamond','6000-9999 pontos'),
('Master','10000-14999 pontos'),
('Grandmaster','15000-24999 pontos'),
('Challenger','25000+ pontos');

-- =====================================================
-- FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION concluir_desafio(
    p_usuario BIGINT,
    p_desafio BIGINT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_pontos INTEGER;
    v_ativo BOOLEAN;
BEGIN

    SELECT
        ativo,
        pontuacao_prevista
    INTO
        v_ativo,
        v_pontos
    FROM Desafio
    WHERE id_desafio = p_desafio;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Desafio não encontrado.';
    END IF;

    IF NOT v_ativo THEN
        RAISE EXCEPTION 'Desafio inativo.';
    END IF;

    INSERT INTO Conclusao_Desafio(
        id_usuario,
        id_desafio,
        status,
        pontuacao,
        data_conclusao
    )
    VALUES(
        p_usuario,
        p_desafio,
        'CONCLUIDO',
        v_pontos,
        CURRENT_TIMESTAMP
    );

END;
$$;

CREATE OR REPLACE FUNCTION entrar_grupo(
    p_usuario BIGINT,
    p_grupo BIGINT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN

    INSERT INTO Usuario_Grupo(
        id_usuario,
        id_grupo
    )
    VALUES(
        p_usuario,
        p_grupo
    )
    ON CONFLICT DO NOTHING;

END;
$$;


CREATE OR REPLACE FUNCTION sair_grupo(
    p_usuario BIGINT,
    p_grupo BIGINT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN

    DELETE FROM Usuario_Grupo
    WHERE
        id_usuario = p_usuario
    AND
        id_grupo = p_grupo;

END;
$$;

CREATE OR REPLACE FUNCTION solicitar_amizade(
    p_origem BIGINT,
    p_destino BIGINT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN

    INSERT INTO Amizade(
        id_usuario_origem,
        id_usuario_destino,
        data_solicitacao,
        status
    )
    VALUES(
        p_origem,
        p_destino,
        CURRENT_TIMESTAMP,
        'PENDENTE'
    );

END;
$$;

CREATE OR REPLACE FUNCTION aceitar_amizade(
    p_origem BIGINT,
    p_destino BIGINT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN

    UPDATE Amizade
    SET
        status = 'ACEITA',
        data_aceitar = CURRENT_TIMESTAMP
    WHERE
        id_usuario_origem = p_origem
    AND
        id_usuario_destino = p_destino;

END;
$$;

CREATE OR REPLACE FUNCTION rejeitar_amizade(
    p_origem BIGINT,
    p_destino BIGINT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN

    UPDATE Amizade
    SET status = 'REJEITADA'
    WHERE
        id_usuario_origem = p_origem
    AND
        id_usuario_destino = p_destino;

END;
$$;

CREATE OR REPLACE FUNCTION atualizar_streak()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_ultimo TIMESTAMP;
BEGIN

    SELECT ultimo_acesso
    INTO v_ultimo
    FROM Usuario
    WHERE id_usuario = NEW.id_usuario;

    UPDATE Usuario
    SET

        dias_consecutivos =

        CASE

            WHEN v_ultimo IS NULL
            THEN 1

            WHEN DATE(v_ultimo) = DATE(NEW.data_acesso)
            THEN dias_consecutivos

            WHEN DATE(v_ultimo)
                 = DATE(NEW.data_acesso) - 1
            THEN dias_consecutivos + 1

            ELSE 1

        END,

        ultimo_acesso = NEW.data_acesso

    WHERE id_usuario = NEW.id_usuario;

    RETURN NEW;

END;
$$;

CREATE OR REPLACE FUNCTION validar_amizade()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

    IF EXISTS(
        SELECT 1
        FROM Amizade
        WHERE
            (
                id_usuario_origem = NEW.id_usuario_origem
                AND
                id_usuario_destino = NEW.id_usuario_destino
            )
            OR
            (
                id_usuario_origem = NEW.id_usuario_destino
                AND
                id_usuario_destino = NEW.id_usuario_origem
            )
    )
    THEN
        RAISE EXCEPTION
        'Amizade já existe.';
    END IF;

    RETURN NEW;

END;
$$;

CREATE OR REPLACE FUNCTION validar_desafio_ativo()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_ativo BOOLEAN;
BEGIN

    SELECT ativo
    INTO v_ativo
    FROM Desafio
    WHERE id_desafio = NEW.id_desafio;

    IF NOT v_ativo THEN
        RAISE EXCEPTION
        'Desafio inativo.';
    END IF;

    RETURN NEW;

END;
$$;

CREATE OR REPLACE FUNCTION atualizar_ligas()
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    usuario_record RECORD;
    nova_liga BIGINT;
BEGIN

    FOR usuario_record IN

        SELECT
            u.id_usuario,
            COALESCE(SUM(cd.pontuacao),0)
                AS pontos_totais
        FROM Usuario u
        LEFT JOIN Conclusao_Desafio cd
            ON u.id_usuario = cd.id_usuario
        GROUP BY u.id_usuario

    LOOP

        SELECT id_liga
        INTO nova_liga
        FROM Liga
        WHERE nome =
        CASE
            WHEN usuario_record.pontos_totais >= 25000 THEN 'Challenger'
            WHEN usuario_record.pontos_totais >= 15000 THEN 'Grandmaster'
            WHEN usuario_record.pontos_totais >= 10000 THEN 'Master'
            WHEN usuario_record.pontos_totais >= 6000 THEN 'Diamond'
            WHEN usuario_record.pontos_totais >= 3000 THEN 'Platinum'
            WHEN usuario_record.pontos_totais >= 1500 THEN 'Gold'
            WHEN usuario_record.pontos_totais >= 500 THEN 'Silver'
            ELSE 'Bronze'
        END;

        UPDATE Usuario
        SET id_liga = nova_liga
        WHERE id_usuario = usuario_record.id_usuario;

    END LOOP;

END;
$$;

CREATE OR REPLACE FUNCTION refresh_leaderboards()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN

    REFRESH MATERIALIZED VIEW mv_leaderboard_global;

    REFRESH MATERIALIZED VIEW mv_leaderboard_grupo;

    PERFORM atualizar_ligas();

    RETURN NULL;

END;
$$;

-- =====================================================
-- TRIGGERS
-- =====================================================


CREATE TRIGGER trg_streak
AFTER INSERT
ON Historico_Atividades
FOR EACH ROW
EXECUTE FUNCTION atualizar_streak();

CREATE TRIGGER trg_validar_amizade
BEFORE INSERT
ON Amizade
FOR EACH ROW
EXECUTE FUNCTION validar_amizade();

CREATE TRIGGER trg_validar_desafio
BEFORE INSERT
ON Conclusao_Desafio
FOR EACH ROW
EXECUTE FUNCTION validar_desafio_ativo();

CREATE TRIGGER trg_refresh_leaderboards
AFTER INSERT OR UPDATE OR DELETE
ON Conclusao_Desafio
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_leaderboards();
