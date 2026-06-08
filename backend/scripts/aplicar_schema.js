// le o script sql do projeto e aplica no banco configurado no .env
const fs = require('fs');
const path = require('path');
const pool = require('../src/config/conexao');

async function aplicar() {
  const caminho = path.join(
    __dirname, '..', '..', 'docs', 'MODELO-ER', 'BD_Script_Completo.sql'
  );
  const sql = fs.readFileSync(caminho, 'utf8');
  await pool.query(sql);
  console.log('schema aplicado com sucesso');
  await pool.end();
}

aplicar().catch((erro) => {
  console.error('erro ao aplicar schema:', erro.message);
  process.exit(1);
});
