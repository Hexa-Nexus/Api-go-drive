const request = require('supertest');
const Express = require('express');
const gestorRouter = require('../../../routes/Gestor/GestorRoutes');
const { PrismaClient } = require('@prisma/client');
const { mockGestor } = require('../../helpers/mock-data.helper');
const { generateMockToken, getAuthHeaders } = require('../../helpers/auth.helper');

// Mock controllers
jest.mock('../../../controllers/Gestor/GestorController', () => ({
  loginGestor: jest.fn((req, res) => res.status(200).json({
    message: "Login realizado com sucesso!",
    token: "mock-token",
    id: mockGestor.id,
    name: mockGestor.name,
  })),
  criandoGestor: jest.fn((req, res) => res.status(201).json(mockGestor)),
  buscarGestores: jest.fn((req, res) => res.status(200).json([mockGestor])),
  buscarGestorId: jest.fn((req, res) => res.status(200).json(mockGestor)),
  buscarGestorPorCPF: jest.fn((req, res) => res.status(200).json(mockGestor)),
  editarGestor: jest.fn((req, res) => res.status(200).json(mockGestor)),
  deletarGestor: jest.fn((req, res) => res.status(200).json({ message: "Gestor deletado com sucesso" })),
}));

// Mock middleware
jest.mock('../../../middlewares/auth', () => jest.fn((req, res, next) => next()));

describe('Gestor Routes', () => {
  let app;
  const token = generateMockToken({ id: mockGestor.id, admin: true });
  const authHeaders = getAuthHeaders(token);

  beforeEach(() => {
    app = Express();
    app.use(Express.json());
    app.use('/api', gestorRouter);
  });

  describe('POST /api/login', () => {
    it('should login a gestor', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'admin@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Login realizado com sucesso!",
        token: "mock-token",
        id: mockGestor.id,
        name: mockGestor.name,
      });
    });
  });

  describe('POST /api/gestor', () => {
    it('should create a new gestor', async () => {
      const response = await request(app)
        .post('/api/gestor')
        .set(authHeaders)
        .send({
          name: 'Admin User',
          cpf: '12345678900',
          email: 'admin@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockGestor);
    });
  });

  describe('GET /api/gestores', () => {
    it('should return all gestores', async () => {
      const response = await request(app)
        .get('/api/gestores')
        .set(authHeaders);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual([mockGestor]);
    });
  });

  describe('GET /api/gestor/:id', () => {
    it('should return a gestor by id', async () => {
      const response = await request(app)
        .get(`/api/gestor/${mockGestor.id}`)
        .set(authHeaders);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockGestor);
    });
  });

  describe('GET /api/gestor/cpf/:cpf', () => {
    it('should return a gestor by CPF', async () => {
      const response = await request(app)
        .get(`/api/gestor/cpf/${mockGestor.cpf}`)
        .set(authHeaders);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockGestor);
    });
  });

  describe('PUT /api/gestor/:id', () => {
    it('should update a gestor', async () => {
      const response = await request(app)
        .put(`/api/gestor/${mockGestor.id}`)
        .set(authHeaders)
        .send({
          name: 'Updated Admin User',
          email: 'updated@example.com',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockGestor);
    });
  });

  describe('DELETE /api/gestor/:id', () => {
    it('should delete a gestor', async () => {
      const response = await request(app)
        .delete(`/api/gestor/${mockGestor.id}`)
        .set(authHeaders);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Gestor deletado com sucesso" });
    });
  });
});
