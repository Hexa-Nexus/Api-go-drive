const { PrismaClient, TipoEvento, StatusEvento, StatusPagamento, MetodoPagamento, RelatorioTipo } = require('@prisma/client');
const EventoController = require('../../../controllers/Evento/EventoController');
const { mockEvento, mockCarro, mockGestor, mockMotorista, mockPagamento } = require('../../helpers/mock-data.helper');

// Mock prisma client
const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    carro: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    motorista: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    gestor: {
      findUnique: jest.fn(),
    },
    evento: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    pagamento: {
      create: jest.fn(),
      update: jest.fn(),
    },
    relatorio: {
      create: jest.fn(),
    }
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
    TipoEvento: { SAIDA: 'SAIDA', ENTRADA: 'ENTRADA' },
    StatusEvento: { PENDENTE: 'PENDENTE', CONCLUIDO: 'CONCLUIDO' },
    StatusPagamento: { PENDENTE: 'PENDENTE', PAGO: 'PAGO' },
    MetodoPagamento: { CARTAO: 'CARTAO', PIX: 'PIX', DINHEIRO: 'DINHEIRO' },
    RelatorioTipo: { FINANCEIRO: 'FINANCEIRO' }
  };
});

describe('EventoController', () => {
  // Mock request and response
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('criar_novo_Eventos', () => {
    it('should create a new evento when valid data is provided', async () => {
      // Arrange
      req.body = {
        tipoEvento: TipoEvento.SAIDA,
        status: StatusEvento.PENDENTE,
        carroId: mockCarro.id,
        gestorId: mockGestor.id,
        motoristId: mockMotorista.id,
      };

      prisma.carro.findUnique.mockResolvedValue({
        ...mockCarro,
        disponivel: true,
      });
      prisma.motorista.findUnique.mockResolvedValue({
        ...mockMotorista,
        disponivel: true,
      });
      prisma.gestor.findUnique.mockResolvedValue(mockGestor);
      prisma.evento.create.mockResolvedValue(mockEvento);

      // Act
      await EventoController.criar_novo_Eventos(req, res);

      // Assert
      expect(prisma.carro.findUnique).toHaveBeenCalledWith({
        where: { id: mockCarro.id },
      });
      expect(prisma.motorista.findUnique).toHaveBeenCalledWith({
        where: { id: mockMotorista.id },
      });
      expect(prisma.gestor.findUnique).toHaveBeenCalledWith({
        where: { id: mockGestor.id },
      });
      expect(prisma.evento.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          tipoEvento: TipoEvento.SAIDA,
          status: StatusEvento.PENDENTE,
          dataSaida: expect.any(Date),
          odometroInicial: mockCarro.odometroAtual,
        }),
      });
      expect(prisma.carro.update).toHaveBeenCalledWith({
        where: { id: mockCarro.id },
        data: { disponivel: false },
      });
      expect(prisma.motorista.update).toHaveBeenCalledWith({
        where: { id: mockMotorista.id },
        data: { disponivel: false },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        evento: mockEvento,
        mensagem: expect.any(String),
      }));
    });

    it('should return 400 when car is not found', async () => {
      // Arrange
      req.body = {
        tipoEvento: TipoEvento.SAIDA,
        status: StatusEvento.PENDENTE,
        carroId: 'invalid-car-id',
        gestorId: mockGestor.id,
        motoristId: mockMotorista.id,
      };

      prisma.carro.findUnique.mockResolvedValue(null);

      // Act
      await EventoController.criar_novo_Eventos(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Carro não encontrado" });
    });

    it('should return 400 when car is not available', async () => {
      // Arrange
      req.body = {
        tipoEvento: TipoEvento.SAIDA,
        status: StatusEvento.PENDENTE,
        carroId: mockCarro.id,
        gestorId: mockGestor.id,
        motoristId: mockMotorista.id,
      };

      prisma.carro.findUnique.mockResolvedValue({
        ...mockCarro,
        disponivel: false,
      });

      // Act
      await EventoController.criar_novo_Eventos(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Carro já está alugado" });
    });

    it('should return 400 when driver is not found', async () => {
      // Arrange
      req.body = {
        tipoEvento: TipoEvento.SAIDA,
        status: StatusEvento.PENDENTE,
        carroId: mockCarro.id,
        gestorId: mockGestor.id,
        motoristId: 'invalid-driver-id',
      };

      prisma.carro.findUnique.mockResolvedValue({
        ...mockCarro,
        disponivel: true,
      });
      prisma.motorista.findUnique.mockResolvedValue(null);

      // Act
      await EventoController.criar_novo_Eventos(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Motorista não encontrado" });
    });

    it('should return 400 when driver is not available', async () => {
      // Arrange
      req.body = {
        tipoEvento: TipoEvento.SAIDA,
        status: StatusEvento.PENDENTE,
        carroId: mockCarro.id,
        gestorId: mockGestor.id,
        motoristId: mockMotorista.id,
      };

      prisma.carro.findUnique.mockResolvedValue({
        ...mockCarro,
        disponivel: true,
      });
      prisma.motorista.findUnique.mockResolvedValue({
        ...mockMotorista,
        disponivel: false,
      });

      // Act
      await EventoController.criar_novo_Eventos(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Motorista já está alugando um carro" });
    });

    it('should return 400 when gestor is not found', async () => {
      // Arrange
      req.body = {
        tipoEvento: TipoEvento.SAIDA,
        status: StatusEvento.PENDENTE,
        carroId: mockCarro.id,
        gestorId: 'invalid-gestor-id',
        motoristId: mockMotorista.id,
      };

      prisma.carro.findUnique.mockResolvedValue({
        ...mockCarro,
        disponivel: true,
      });
      prisma.motorista.findUnique.mockResolvedValue({
        ...mockMotorista,
        disponivel: true,
      });
      prisma.gestor.findUnique.mockResolvedValue(null);

      // Act
      await EventoController.criar_novo_Eventos(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Gestor não encontrado" });
    });

    it('should handle errors when creating an evento', async () => {
      // Arrange
      req.body = {
        tipoEvento: TipoEvento.SAIDA,
        status: StatusEvento.PENDENTE,
        carroId: mockCarro.id,
        gestorId: mockGestor.id,
        motoristId: mockMotorista.id,
      };

      prisma.carro.findUnique.mockResolvedValue({
        ...mockCarro,
        disponivel: true,
      });
      prisma.motorista.findUnique.mockResolvedValue({
        ...mockMotorista,
        disponivel: true,
      });
      prisma.gestor.findUnique.mockResolvedValue(mockGestor);
      prisma.evento.create.mockRejectedValue(new Error('Database error'));

      // Act
      await EventoController.criar_novo_Eventos(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: "Erro ao criar evento",
        details: "Database error"
      }));
    });
  });

  describe('obeter_todos_eventos', () => {
    it('should return all eventos', async () => {
      // Arrange
      const mockEventos = [mockEvento, {...mockEvento, id: 'evento-id-2'}];
      prisma.evento.findMany.mockResolvedValue(mockEventos);

      // Act
      await EventoController.obeter_todos_eventos(req, res);

      // Assert
      expect(prisma.evento.findMany).toHaveBeenCalledWith({
        include: {
          carro: true,
          gestor: true,
          motorista: true,
          pagamentos: true,
          relatorio: true,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEventos);
    });

    it('should handle errors when fetching all eventos', async () => {
      // Arrange
      prisma.evento.findMany.mockRejectedValue(new Error('Database error'));

      // Act
      await EventoController.obeter_todos_eventos(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: " Erro ao obter o evento " });
    });
  });

  describe('concluir_evento', () => {
    it('should conclude an evento with valid data', async () => {
      // Arrange
      const mockEventoConcluido = {
        ...mockEvento,
        tipoEvento: TipoEvento.ENTRADA,
        status: StatusEvento.CONCLUIDO,
        odometroFinal: 5100,
        dataEntrada: new Date()
      };

      const mockRelatorio = {
        id: 'relatorio-id-1',
        tipo: RelatorioTipo.FINANCEIRO,
        gestorId: mockGestor.id
      };

      req.body = {
        eventoId: mockEvento.id,
        metodoPagamento: MetodoPagamento.PIX,
        odometroFinal: 5100,
      };

      prisma.evento.findUnique.mockResolvedValue({
        ...mockEvento,
        status: StatusEvento.PENDENTE,
        carro: mockCarro,
        motorista: mockMotorista,
        gestor: mockGestor
      });
      prisma.pagamento.create.mockResolvedValue(mockPagamento);
      prisma.evento.update.mockResolvedValue(mockEventoConcluido);
      prisma.relatorio.create.mockResolvedValue(mockRelatorio);

      // Act
      await EventoController.concluir_evento(req, res);

      // Assert
      expect(prisma.evento.findUnique).toHaveBeenCalledWith({
        where: { id: mockEvento.id },
        include: {
          carro: true,
          motorista: true,
          gestor: true,
        },
      });
      expect(prisma.pagamento.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          metodoPagamento: MetodoPagamento.PIX,
          statusPagamento: StatusPagamento.PENDENTE,
        }),
      });
      expect(prisma.evento.update).toHaveBeenCalledWith({
        where: { id: mockEvento.id },
        data: expect.objectContaining({
          tipoEvento: TipoEvento.ENTRADA,
          status: StatusEvento.CONCLUIDO,
          odometroFinal: 5100,
          dataEntrada: expect.any(Date),
        }),
        include: {
          carro: true,
          motorista: true,
          gestor: true
        }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        evento: expect.any(Object),
        relatorio: mockRelatorio,
        pagamento: mockPagamento
      }));
    });

    it('should return 400 when evento is not found', async () => {
      // Arrange
      req.body = {
        eventoId: 'invalid-evento-id',
        metodoPagamento: MetodoPagamento.PIX,
        odometroFinal: 5100,
      };

      prisma.evento.findUnique.mockResolvedValue(null);

      // Act
      await EventoController.concluir_evento(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Evento não encontrado" });
    });

    it('should return 400 when evento is not pending', async () => {
      // Arrange
      req.body = {
        eventoId: mockEvento.id,
        metodoPagamento: MetodoPagamento.PIX,
        odometroFinal: 5100,
      };

      prisma.evento.findUnique.mockResolvedValue({
        ...mockEvento,
        status: StatusEvento.CONCLUIDO,
        carro: mockCarro,
        motorista: mockMotorista,
        gestor: mockGestor
      });

      // Act
      await EventoController.concluir_evento(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Evento não está em status PENDENTE" });
    });

    it('should return 400 when odometer reading is invalid', async () => {
      // Arrange
      req.body = {
        eventoId: mockEvento.id,
        metodoPagamento: MetodoPagamento.PIX,
        odometroFinal: 4900, // Lower than initial reading
      };

      prisma.evento.findUnique.mockResolvedValue({
        ...mockEvento,
        status: StatusEvento.PENDENTE,
        carro: mockCarro,
        motorista: mockMotorista,
        gestor: mockGestor
      });

      // Act
      await EventoController.concluir_evento(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Odômetro final inválido" });
    });

    it('should handle errors when concluding an evento', async () => {
      // Arrange
      req.body = {
        eventoId: mockEvento.id,
        metodoPagamento: MetodoPagamento.PIX,
        odometroFinal: 5100,
      };

      prisma.evento.findUnique.mockResolvedValue({
        ...mockEvento,
        status: StatusEvento.PENDENTE,
        carro: mockCarro,
        motorista: mockMotorista,
        gestor: mockGestor
      });
      prisma.pagamento.create.mockRejectedValue(new Error('Database error'));

      // Act
      await EventoController.concluir_evento(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: "Erro ao concluir evento",
        details: "Database error"
      }));
    });
  });

  describe('obert_evento_por_id', () => {
    it('should return an evento by id', async () => {
      // Arrange
      req.params = { id: mockEvento.id };
      prisma.evento.findUnique.mockResolvedValue(mockEvento);

      // Act
      await EventoController.obert_evento_por_id(req, res);

      // Assert
      expect(prisma.evento.findUnique).toHaveBeenCalledWith({
        where: { id: mockEvento.id },
        include: {
          carro: true,
          gestor: true,
          motorista: true,
          pagamentos: true,
          relatorio: true,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEvento);
    });

    it('should return 404 when evento is not found', async () => {
      // Arrange
      req.params = { id: 'non-existent-id' };
      prisma.evento.findUnique.mockResolvedValue(null);

      // Act
      await EventoController.obert_evento_por_id(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Evento não encontrado" });
    });

    it('should handle errors when fetching an evento by id', async () => {
      // Arrange
      req.params = { id: mockEvento.id };
      prisma.evento.findUnique.mockRejectedValue(new Error('Database error'));

      // Act
      await EventoController.obert_evento_por_id(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: " Erro ao obter o evento " });
    });
  });

  describe('deletar_evento', () => {
    it('should delete an evento successfully', async () => {
      // Arrange
      req.params = { id: mockEvento.id };
      prisma.evento.findUnique.mockResolvedValue({
        ...mockEvento,
        dataEntrada: null,
        carro: mockCarro,
        motorista: mockMotorista
      });
      prisma.evento.delete.mockResolvedValue(mockEvento);

      // Act
      await EventoController.deletar_evento(req, res);

      // Assert
      expect(prisma.evento.findUnique).toHaveBeenCalledWith({
        where: { id: mockEvento.id },
        include: { carro: true, motorista: true },
      });
      expect(prisma.evento.delete).toHaveBeenCalledWith({
        where: { id: mockEvento.id },
      });
      expect(prisma.carro.update).toHaveBeenCalledWith({
        where: { id: mockCarro.id },
        data: { disponivel: true },
      });
      expect(prisma.motorista.update).toHaveBeenCalledWith({
        where: { id: mockMotorista.id },
        data: { disponivel: true },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Evento deletado com sucesso" });
    });

    it('should return 404 when evento is not found', async () => {
      // Arrange
      req.params = { id: 'non-existent-id' };
      prisma.evento.findUnique.mockResolvedValue(null);

      // Act
      await EventoController.deletar_evento(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ erro: "Evento não encontrado " });
    });

    it('should return 400 when trying to delete a completed evento', async () => {
      // Arrange
      req.params = { id: mockEvento.id };
      prisma.evento.findUnique.mockResolvedValue({
        ...mockEvento,
        dataEntrada: new Date(), // Evento já concluído
        carro: mockCarro,
        motorista: mockMotorista
      });

      // Act
      await EventoController.deletar_evento(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Não é possível excluir um evento concluído " });
    });

    it('should handle errors when deleting an evento', async () => {
      // Arrange
      req.params = { id: mockEvento.id };
      prisma.evento.findUnique.mockResolvedValue({
        ...mockEvento,
        dataEntrada: null,
        carro: mockCarro,
        motorista: mockMotorista
      });
      prisma.evento.delete.mockRejectedValue(new Error('Database error'));

      // Act
      await EventoController.deletar_evento(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: "Erro ao deletar evento",
        details: "Database error"
      }));
    });
  });
});
