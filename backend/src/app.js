const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.send('Healthy Challenge API esta rodando!');
});

app.use('/auth', authRoutes);
app.use('/leaderboard', leaderboardRoutes);

module.exports = app;
