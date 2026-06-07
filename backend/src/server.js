const app = require('./app');
require('dotenv').config();

const porta = process.env.PORT || 3001;

app.listen(porta, () => {
  console.log('servidor rodando na porta ' + porta);
});
