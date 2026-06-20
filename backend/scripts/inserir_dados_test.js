const pool = require('../src/config/conexao');
const bcrypt = require('bcrypt');

// possivelmente refatorar este metodo e diminuir seu tamanho e colocar em outro lugar para ser reutilizado mais veses
// atualizacao das views etc acho que se enquadra nisso
// funcao principal para inserir dados de teste no banco, seguindo a logica de negocio definida no schema, criando usuarios, grupos, desafios e associando eles, alem de atualizar as views e ligas para garantir que os dados inseridos sejam refletidos corretamente


async function inserirDadosTeste() {
  try {
    console.log(' Iniciando inserção de dados de teste...');

    // criando usuarios seguindo a logica de negocio definida no squema
    const senhaHash = await bcrypt.hash('senha123', 10);
    
    const usuarios = [
      ['João Silva', 'joao@teste.com', senhaHash, 'F'], // F = Fácil
      ['Maria Santos', 'maria@teste.com', senhaHash, 'M'], // M = Médio
      ['Pedro Costa', 'pedro@teste.com', senhaHash, 'D'], // D = Difícil
      ['Ana Lima', 'ana@teste.com', senhaHash, 'M'],
      ['Carlos Souza', 'carlos@teste.com', senhaHash, 'F']
    ];

    for (const [nome, email, senha, nivel] of usuarios) {
      await pool.query(
        `INSERT INTO Usuario (nome, email, senha_hash, nivel_dificuldade) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (email) DO NOTHING`,
        [nome, email, senha, nivel]
      );
    }
    console.log(' Usuários criados');

    // pegar os IDs dos usuários criados para usar nas próximas etapas
    const usersResult = await pool.query('SELECT id_usuario, nome FROM Usuario ORDER BY id_usuario');
    const userIds = usersResult.rows;
    console.log(` ${userIds.length} usuários encontrados:`, userIds.map(u => `${u.nome} (ID: ${u.id_usuario})`).join(', '));

    if (userIds.length === 0) {
      console.log(' Nenhum usuário foi criado. Verifique se os emails já existem.');
      return;
    }

    // Criar um grupo e associar os usuários a ele
    await pool.query(
      `INSERT INTO Grupo (nome, descricao) 
       VALUES ($1, $2) 
       ON CONFLICT DO NOTHING`,
      ['Desafio Semanal', 'Grupo de desafios semanais para teste']
    );
    
    const groupResult = await pool.query(`SELECT id_grupo FROM Grupo WHERE nome = 'Desafio Semanal'`);
    const groupId = groupResult.rows[0]?.id_grupo;
    
    if (!groupId) {
      console.log(' Grupo não criado. Verifique se já existe.');
      return;
    }
    console.log(` Grupo criado, ID: ${groupId}`);

    // associar usuarios ao grupo recem criado
    for (const user of userIds) {
      await pool.query(
        `INSERT INTO Usuario_Grupo (id_usuario, id_grupo) 
         VALUES ($1, $2) 
         ON CONFLICT (id_usuario, id_grupo) DO NOTHING`,
        [user.id_usuario, groupId]
      );
    }
    console.log(' usuarios adicionados ao grupo');

    console.log(`passou aqui2`);

    
    console.log(' criando desafios para teste');
    
    // verificar se ja tem adm se nao criar
    const adminCheck = await pool.query(`SELECT id_administrador FROM Administrador LIMIT 1`);
    let adminId;
    
    if (adminCheck.rows.length === 0) {
      // criar  default admin
      const adminHash = await bcrypt.hash('admin123', 10);
      await pool.query(
        `INSERT INTO Administrador (email, senha, chave_de_acesso) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (email) DO NOTHING`,
        ['admin@teste.com', adminHash, 'chave_admin_123']
      );
      const newAdmin = await pool.query(`SELECT id_administrador FROM Administrador WHERE email = 'admin@teste.com'`);
      adminId = newAdmin.rows[0].id_administrador;
      console.log(` Administrador criado, ID: ${adminId}`);
    } else {
      adminId = adminCheck.rows[0].id_administrador;
      console.log(` Administrador existente, ID: ${adminId}`);
    }

    // criar um jogo pra assosiar aos desafios possivelmente remover da logica de negocio se nao conseguirmos inserir apis de outros jogos como sudoku e ou nao termos tempo para colocar o jogo de memorizacao matricial
    await pool.query(
      `INSERT INTO Jogo (fase_atual, multiplicador_pontos) 
       VALUES ($1, $2) 
       ON CONFLICT DO NOTHING`,
      [1, 1.0]
    );
    const jogoResult = await pool.query(`SELECT id_jogo FROM Jogo ORDER BY id_jogo DESC LIMIT 1`);
    const jogoId = jogoResult.rows[0].id_jogo;
    console.log(` Jogo criado, ID: ${jogoId}`);

    // desafios preliminares 
    const desafios = [
      ['Beber 2L de água', 'Completar a meta diária de água', 10],
      ['Caminhar 30 min', 'Caminhar por 30 minutos', 20],
      ['Meditação diária', 'Meditar por 10 minutos', 15],
      ['Exercícios físicos', 'Completar treino de 15 min', 25],
      ['Leitura', 'Ler por 20 minutos', 10]
    ];

    const desafioIds = [];
    for (const [titulo, descricao, pontuacao] of desafios) {
      await pool.query(
        `INSERT INTO Desafio (id_jogo, id_administrador, titulo, descricao, pontuacao_prevista, ativo) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         ON CONFLICT DO NOTHING`,
        [jogoId, adminId, titulo, descricao, pontuacao, true]
      );
    }
    
    const desafioResult = await pool.query(`SELECT id_desafio FROM Desafio WHERE id_jogo = $1 ORDER BY id_desafio`, [jogoId]);
    desafioResult.rows.forEach(d => desafioIds.push(d.id_desafio));
    console.log(` ${desafioIds.length} desafios criados`);

    // associar deafios completos
    let totalConclusoes = 0;
    for (const user of userIds) {
      // numero aleatorio
      const numDesafios = Math.floor(Math.random() * 3) + 2;
      const shuffled = [...desafioIds].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < numDesafios && i < shuffled.length; i++) {
        const desafioId = shuffled[i];
        const dataConclusao = new Date();
        dataConclusao.setDate(dataConclusao.getDate() - Math.floor(Math.random() * 10)); // Random date in last 10 days
        
        // associar pontos aa complecao dos desafios
        const pontosResult = await pool.query(
          `SELECT pontuacao_prevista FROM Desafio WHERE id_desafio = $1`,
          [desafioId]
        );
        const pontos = pontosResult.rows[0]?.pontuacao_prevista || 10;
        
        await pool.query(
          `INSERT INTO Conclusao_Desafio (id_usuario, id_desafio, status, pontuacao, data_conclusao) 
           VALUES ($1, $2, $3, $4, $5) 
           ON CONFLICT (id_usuario, id_desafio) DO NOTHING`,
          [user.id_usuario, desafioId, 'CONCLUIDO', pontos, dataConclusao]
        );
        totalConclusoes++;
      }
    }
    console.log(` ${totalConclusoes} conclusões de desafio criadas`);

    // atualiando views
    console.log(' Atualizando views materializadas...');
    await pool.query('REFRESH MATERIALIZED VIEW mv_leaderboard_global');
    await pool.query('REFRESH MATERIALIZED VIEW mv_leaderboard_grupo');
    console.log(' Views materializadas atualizadas');

    // update liga
    console.log(' Atualizando ligas dos usuários...');
    await pool.query('SELECT atualizar_ligas()');
    console.log(' Ligas atualizadas');

    

    // nao ta dando mais erro 
    // console.log(' passou aqui'); // verificar se os dados foram inseridos corretamente nas tabelas e se as views estão refletindo as mudanças

    // local de verificacao final para garantir que os dados foram inseridos corretamente e que as views estão refletindo as mudanças, printando os resultados no console
    console.log('\n VERIFICANDO DADOS INSERIDOS:');
    
    const globalCheck = await pool.query('SELECT * FROM mv_leaderboard_global ORDER BY posicao LIMIT 5');
    console.log('\n Leaderboard Global:');
    if (globalCheck.rows.length > 0) {
      console.table(globalCheck.rows);
    } else {
      console.log(' Nenhum dado encontrado no leaderboard global');
    }

    const groupCheck = await pool.query(
      `SELECT * FROM mv_leaderboard_grupo WHERE id_grupo = $1 ORDER BY posicao_grupo`,
      [groupId]
    );
    console.log(`\n Leaderboard do Grupo (ID: ${groupId}):`);
    if (groupCheck.rows.length > 0) {
      console.table(groupCheck.rows);
    } else {
      console.log(' Nenhum dado encontrado no leaderboard do grupo');
    }

    console.log('\n Dados de teste inseridos com sucesso!');
    console.log(` Resumo: ${userIds.length} usuários, 1 grupo, ${desafioIds.length} desafios, ${totalConclusoes} conclusões`);

  } catch (error) {
    console.error(' Erro ao inserir dados:', error.message);
    console.error('Detalhes:', error);
  } finally {
    await pool.end();
  }
}

// rodar a funcao de insercao de dados de teste
inserirDadosTeste();