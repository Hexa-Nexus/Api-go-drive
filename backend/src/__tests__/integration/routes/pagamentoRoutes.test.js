const request = require('supertest');
const Express = require('express');
const pagamentoRouter = require('../../../routes/Pagamento/PagamentoRouter');
const { PrismaClient } = require('@prisma/client');
const { mockPagamento, mockGestor, mockEvento } = require('../../helpers/mock-data.helper');
const { generateMockToken, getAuthHeaders } = require('../../helpers/auth.helper');

// Mock controllers
jest.mock('../../../controllers/Pagamento/pagamentoController', () => ({
  criandoPagamento: jest.fn((req, res) => res.status(201).json(mockPagamento)),
  listarPagamentos: jest.fn((req, res) => res.status(200).json([mockPagamento])),
  buscarPagamentoPorId: jest.fn((req, res) => res.status(200).json(mockPagamento)),
  editarPagamento: jest.fn((req, res) => res.status(200).json(mockPagamento)),
  deletarPagamento: jest.fn((req, res) => res.status(200).json({ mensagem: "Pagamento deletado com sucesso" })),
}));

// Mock middleware
jest.mock('../../../middlewares/auth', () => jest.fn((req, res, next) => next()));

describe('Pagamento Routes', () => {
  let app;
  const token = generateMockToken({ id: mockGestor.id, admin: true });
  const authHeaders = getAuthHeaders(token);

  beforeEach(() => {
    app = Express();
    app.use(Express.json());
    app.use('/api', pagamentoRouter);
  });

  describe('POST /api/pagamentos', () => {
    it('should create a new pagamento', async () => {
      const response = await request(app)
        .post('/api/pagamentos')
        .set(authHeaders)
        .send({
          valor: 300.00,
          data: new Date().toISOString(),
          metodoPagamento: 'PIX',
          statusPagamento: 'PENDENTE',
          gestorId: mockGestor.id,
          eventoId: mockEvento.id,
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockPagamento);
    });
  });

  describe('GET /api/pagamentos', () => {
    it('should return all pagamentos', async () => {
      const response = await request(app)
        .get('/api/pagamentos')
        .set(authHeaders);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual([mockPagamento]);
    });
  });

  describe('GET /api/pagamentos/:id', () => {
    it('should return a pagamento by id', async () => {
      const response = await request(app)
        .get(`/api/pagamentos/${mockPagamento.id}`)
        .set(authHeaders);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPagamento);
    });
  });

  describe('PUT /api/pagamentos/:id', () => {
    it('should update a pagamento', async () => {
      const response = await request(app)
        .put(`/api/pagamentos/${mockPagamento.id}`)
        .set(authHeaders)
        .send({
          valor: 400.00,
          data: new Date().toISOString(),
          metodoPagamento: 'CARTAO',
          statusPagamento: 'PAGO',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPagamento);
    });
  });

  describe('DELETE /api/pagamentos/:id', () => {
    it('should delete a pagamento', async () => {
      const response = await request(app)
        .delete(`/api/pagamentos/${mockPagamento.id}`)
        .set(authHeaders);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ mensagem: "Pagamento deletado com sucesso" });
    });
  });
});
