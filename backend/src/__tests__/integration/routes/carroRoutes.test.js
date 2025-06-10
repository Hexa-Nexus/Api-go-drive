const request = require('supertest');
const Express = require('express');
const carroRouter = require('../../../routes/Carro/carroRouter');
const { PrismaClient } = require('@prisma/client');
const { mockCarro, mockGestor } = require('../../helpers/mock-data.helper');
const { generateMockToken, getAuthHeaders } = require('../../helpers/auth.helper');

// Mock controllers
jest.mock('../../../controllers/Carro/carroController', () => ({
  criandoCarro: jest.fn((req, res) => res.status(201).json(mockCarro)),
  obter_todos_carros: jest.fn((req, res) => res.status(200).json([mockCarro])),
  obter_carro_por_id: jest.fn((req, res) => res.status(200).json(mockCarro)),
  buscar_por_modelo: jest.fn((req, res) => res.status(200).json([mockCarro])),
  buscar_por_placa: jest.fn((req, res) => res.status(200).json(mockCarro)),
  atualizar_carro: jest.fn((req, res) => res.status(200).json(mockCarro)),
  deletar_carro: jest.fn((req, res) => res.status(200).json({ message: "carro deletado com sucesso" })),
}));

// Mock middleware
jest.mock('../../../middlewares/auth', () => jest.fn((req, res, next) => next()));

describe('Carro Routes', () => {
  let app;
  const token = generateMockToken({ id: mockGestor.id, admin: true });
  const authHeaders = getAuthHeaders(token);

  beforeEach(() => {
    app = Express();
    app.use(Express.json());
    app.use('/api', carroRouter);
  });

  describe('POST /api/carros', () => {
    it('should create a new car', async () => {
      const response = await request(app)
        .post('/api/carros')
        .set(authHeaders)
        .send({
          modelo: 'Civic',
          marca: 'Honda',
          ano: 2022,
          cor: 'Preto',
          placa: 'ABC1234',
          odometroAtual: 5000,
          disponivel: true,
          gestorId: mockGestor.id,
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCarro);
    });
  });

  describe('GET /api/carros', () => {
    it('should return all cars', async () => {
      const response = await request(app)
        .get('/api/carros')
        .set(authHeaders);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual([mockCarro]);
    });
  });

  describe('GET /api/carros/:id', () => {
    it('should return a car by id', async () => {
      const response = await request(app)
        .get(`/api/carros/${mockCarro.id}`)
        .set(authHeaders);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCarro);
    });
  });

  describe('GET /api/carros/buscar-modelo/:modelo', () => {
    it('should return cars by model', async () => {
      const response = await request(app)
        .get('/api/carros/buscar-modelo/Civic')
        .set(authHeaders);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual([mockCarro]);
    });
  });

  describe('GET /api/carros/placa/:placa', () => {
    it('should return a car by plate', async () => {
      const response = await request(app)
        .get('/api/carros/placa/ABC1234')
        .set(authHeaders);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCarro);
    });
  });

  describe('PUT /api/carros/:id', () => {
    it('should update a car', async () => {
      const response = await request(app)
        .put(`/api/carros/${mockCarro.id}`)
        .set(authHeaders)
        .send({
          modelo: 'Civic Updated',
          marca: 'Honda',
          ano: 2023,
          cor: 'Azul',
          odometroAtual: 6000,
          disponivel: true,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCarro);
    });
  });

  describe('DELETE /api/carros/:id', () => {
    it('should delete a car', async () => {
      const response = await request(app)
        .delete(`/api/carros/${mockCarro.id}`)
        .set(authHeaders);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "carro deletado com sucesso" });
    });
  });
});
