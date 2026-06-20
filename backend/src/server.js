const app = require('./app');
require('dotenv').config();

const porta = process.env.PORT || 3001;

app.listen(porta, () => {
  console.log('servidor rodando na porta ' + porta);
});

console.log(process.env.JWT_SECRET); // verificar se ta tudo certinho com a variavel de ambiente