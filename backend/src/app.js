const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const desafioRoutes = require('./routes/desafioRoutes');
const ligaRoutes = require('./routes/ligaRoutes');
const adminRoutes = require('./routes/adminRoutes');
const grupoRoutes = require('./routes/grupoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const perfilRoutes = require('./routes/perfilRoutes');
const historicoRoutes = require('./routes/historicoRoutes');
const amizadeRoutes = require('./routes/amizadeRoutes');
const jogoRoutes = require('./routes/jogoRoutes');

const app = express();

app.use(cors());

// limite maior que o padrao (100kb) para caber a foto de perfil em base64
app.use(express.json({ limit: '4mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.send('Healthy Challenge API esta rodando!');
});

app.use('/auth', authRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/desafios', desafioRoutes);
app.use('/ligas', ligaRoutes);
app.use('/admin', adminRoutes);
app.use('/grupos', grupoRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/perfil', perfilRoutes);
app.use('/historico', historicoRoutes);
app.use('/amizades', amizadeRoutes);
app.use('/jogo', jogoRoutes);

module.exports = app;