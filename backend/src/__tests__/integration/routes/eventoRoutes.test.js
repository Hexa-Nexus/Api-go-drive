const request = require('supertest');
const Express = require('express');
const eventoRouter = require('../../../routes/Evento/eventoRouter');
const { PrismaClient } = require('@prisma/client');
const { mockEvento, mockCarro, mockGestor, mockMotorista } = require('../../helpers/mock-data.helper');
const { generateMockToken, getAuthHeaders } = require('../../helpers/auth.helper');

// Mock controllers
jest.mock('../../../controllers/Evento/EventoController', () => ({
  criar_novo_Eventos: jest.fn((req, res) => res.status(201).json(mockEvento)),
  concluir_evento: jest.fn((req, res) => res.status(200).json({
    evento: mockEvento,
    mensagem: "Evento concluído com sucesso"
  })),
  obeter_todos_eventos: jest.fn((req, res) => res.status(200).json([mockEvento])),
  obert_evento_por_id: jest.fn((req, res) => res.status(200).json(mockEvento)),
  deletar_evento: jest.fn((req, res) => res.status(200).json({ message: "Evento deletado com sucesso" })),
}));

// Mock middleware
jest.mock('../../../middlewares/auth', () => jest.fn((req, res, next) => next()));

describe('Evento Routes', () => {
  let app;
  const token = generateMockToken({ id: mockGestor.id, admin: true });
  const authHeaders = getAuthHeaders(token);

  beforeEach(() => {
    app = Express();
    app.use(Express.json());
    app.use('/api', eventoRouter);
  });

  describe('POST /api/evento', () => {
    it('should create a new evento', async () => {
      const response = await request(app)
        .post('/api/evento')
        .set(authHeaders)
        .send({
          tipoEvento: 'SAIDA',
          status: 'PENDENTE',
          dataSaida: new Date().toISOString(),
          odometroInicial: 5000,
          carroId: mockCarro.id,
          gestorId: mockGestor.id,
          motoristaId: mockMotorista.id,
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockEvento);
    });
  });

  describe('PUT /api/evento', () => {
    it('should conclude an evento', async () => {
      const response = await request(app)
        .put('/api/evento')
        .set(authHeaders)
        .send({
          id: mockEvento.id,
          dataEntrada: new Date().toISOString(),
          odometroFinal: 5100,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        evento: mockEvento,
        mensagem: "Evento concluído com sucesso"
      });
    });
  });

  describe('GET /api/eventos', () => {
    it('should return all eventos', async () => {
      const response = await request(app)
        .get('/api/eventos')
        .set(authHeaders);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toEqual([mockEvento]);
    });
  });

  describe('GET /api/evento/:id', () => {
    it('should return an evento by id', async () => {
      const response = await request(app)
        .get(`/api/evento/${mockEvento.id}`)
        .set(authHeaders);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEvento);
    });
  });

  describe('DELETE /api/evento/:id', () => {
    it('should delete an evento', async () => {
      const response = await request(app)
        .delete(`/api/evento/${mockEvento.id}`)
        .set(authHeaders);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Evento deletado com sucesso" });
    });
  });
});
