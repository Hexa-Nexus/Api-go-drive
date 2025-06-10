const request = require('supertest');
const Express = require('express');
const motoristaRouter = require('../../../routes/Motorista/motoristaRouter');
const { PrismaClient } = require('@prisma/client');
const { mockMotorista, mockGestor } = require('../../helpers/mock-data.helper');
const { generateMockToken, getAuthHeaders } = require('../../helpers/auth.helper');

// Mock controllers
jest.mock('../../../controllers/Motorista/MotoristaController', () => ({
  criar_motorista: jest.fn((req, res) => res.status(201).json({
    motorista: mockMotorista,
    mensagem: "Motorista criado com sucesso."
  })),
  obter_todos_motoristas: jest.fn((req, res) => res.status(200).json([mockMotorista])),
  obter_motorista_por_id: jest.fn((req, res) => res.status(200).json(mockMotorista)),
  obter_motorista_por_cpf: jest.fn((req, res) => res.status(200).json(mockMotorista)),
  atualizar_motorista: jest.fn((req, res) => res.status(200).json({
    motorista: mockMotorista,
    mensagem: "Motorista atualizado com sucesso"
  })),
  deletar_motorista: jest.fn((req, res) => res.status(200).json({ message: "Motorista deletado com sucesso" })),
}));

// Mock middleware
jest.mock('../../../middlewares/auth', () => jest.fn((req, res, next) => next()));

describe('Motorista Routes', () => {
  let app;
  const token = generateMockToken({ id: mockGestor.id, admin: true });
  const authHeaders = getAuthHeaders(token);

  beforeEach(() => {
    app = Express();
    app.use(Express.json());
    app.use('/api', motoristaRouter);
  });

  describe('POST /api/motorista', () => {
    it('should create a new motorista', async () => {
      const response = await request(app)
        .post('/api/motorista')
        .set(authHeaders)
        .send({
          nome: 'João Silva',
          telefone: '11987654321',
          cpf: '98765432100',
          habilitacao: 'ABC123456',
          gestorId: mockGestor.id,
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        motorista: mockMotorista,
        mensagem: "Motorista criado com sucesso."
      });
    });
  });

  describe('GET /api/motoristas', () => {
    it('should return all motoristas', async () => {
      const response = await request(app)
        .get('/api/motoristas')
        .set(authHeaders);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual([mockMotorista]);
    });
  });

  describe('GET /api/motorista/:id', () => {
    it('should return a motorista by id', async () => {
      const response = await request(app)
        .get(`/api/motorista/${mockMotorista.id}`)
        .set(authHeaders);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMotorista);
    });
  });

  describe('GET /api/motorista?cpf=X', () => {
    it('should return a motorista by CPF', async () => {
      const response = await request(app)
        .get('/api/motorista')
        .query({ cpf: mockMotorista.cpf })
        .set(authHeaders);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMotorista);
    });
  });

  describe('PUT /api/motorista/:id', () => {
    it('should update a motorista', async () => {
      const response = await request(app)
        .put(`/api/motorista/${mockMotorista.id}`)
        .set(authHeaders)
        .send({
          nome: 'Nome Atualizado',
          telefone: '11999999999',
          habilitacao: 'XYZ987654',
          disponivel: false,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        motorista: mockMotorista,
        mensagem: "Motorista atualizado com sucesso"
      });
    });
  });

  describe('DELETE /api/motorista/:id', () => {
    it('should delete a motorista', async () => {
      const response = await request(app)
        .delete(`/api/motorista/${mockMotorista.id}`)
        .set(authHeaders);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Motorista deletado com sucesso" });
    });
  });
});
