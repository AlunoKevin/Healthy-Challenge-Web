const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const adminService = require('../src/services/adminService');

jest.mock('../src/services/adminService');

describe('POST /admin/login', () => {
  beforeEach(() => jest.clearAllMocks());

  test('retorna 200 com token quando credenciais corretas', async () => {
    adminService.loginAdmin.mockResolvedValue({ token: 'token_admin' });

    const res = await request(app)
      .post('/admin/login')
      .send({ email: 'admin@test.com', senha: 'senha123', chave_de_acesso: 'chave' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token', 'token_admin');
  });

  test('retorna 400 quando body incompleto', async () => {
    const res = await request(app)
      .post('/admin/login')
      .send({ email: 'admin@test.com' });

    expect(res.status).toBe(400);
  });
});

describe('GET /admin/status', () => {
  test('retorna 401 sem token', async () => {
    const res = await request(app).get('/admin/status');
    expect(res.status).toBe(401);
  });

  test('retorna 403 com token de usuario comum', async () => {
    const token = jwt.sign(
      { id_usuario: 1, email: 'user@test.com' },
      process.env.JWT_SECRET || 'segredo_teste'
    );

    const res = await request(app)
      .get('/admin/status')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });

  test('retorna 200 com token admin valido', async () => {
    const token = jwt.sign(
      { id_administrador: 1, email: 'admin@test.com', tipo: 'admin' },
      process.env.JWT_SECRET || 'segredo_teste'
    );

    const res = await request(app)
      .get('/admin/status')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
  });
});
