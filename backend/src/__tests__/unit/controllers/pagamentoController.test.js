const { PrismaClient } = require('@prisma/client');
const PagamentoController = require('../../../controllers/Pagamento/pagamentoController');
const { mockPagamento, mockGestor, mockEvento } = require('../../helpers/mock-data.helper');

// Mock prisma client
jest.mock('@prisma/client');

describe('PagamentoController', () => {
  // Mock request and response
  let req;
  let res;
  let prisma;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      user: { id: mockGestor.id }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Set up the PrismaClient mock
    prisma = {
      pagamento: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      gestor: {
        findUnique: jest.fn(),
      },
      evento: {
        findUnique: jest.fn(),
      }
    };

    // Mock the PrismaClient constructor to return our mock
    PrismaClient.mockImplementation(() => prisma);
  });

  describe('criandoPagamento', () => {
    it('should create a new pagamento with valid data', async () => {
      // Arrange
      req.body = {
        valor: mockPagamento.valor,
        data: mockPagamento.data.toISOString(),
        metodoPagamento: 'PIX',
        statusPagamento: 'PENDENTE',
        gestorId: mockGestor.id,
        eventoId: mockEvento.id,
      };

      prisma.gestor.findUnique.mockResolvedValue(mockGestor);
      prisma.evento.findUnique.mockResolvedValue(mockEvento);
      prisma.pagamento.create.mockResolvedValue(mockPagamento);

      // Act
      await PagamentoController.criandoPagamento(req, res);

      // Assert
      expect(prisma.gestor.findUnique).toHaveBeenCalledWith({
        where: { id: mockGestor.id },
      });
      expect(prisma.evento.findUnique).toHaveBeenCalledWith({
        where: { id: mockEvento.id },
      });
      expect(prisma.pagamento.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          valor: mockPagamento.valor,
          data: expect.any(Date),
          metodoPagamento: 'PIX',
          statusPagamento: 'PENDENTE',
          gestorId: mockGestor.id,
          eventoId: mockEvento.id,
          relatorioId: null,
        }),
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockPagamento);
    });

    it('should return 400 when metodo pagamento is invalid', async () => {
      // Arrange
      req.body = {
        valor: mockPagamento.valor,
        data: mockPagamento.data.toISOString(),
        metodoPagamento: 'METODO_INVALIDO',
        statusPagamento: 'PENDENTE',
        gestorId: mockGestor.id,
        eventoId: mockEvento.id,
      };

      // Act
      await PagamentoController.criandoPagamento(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Método de pagamento inválido!" });
    });

    it('should return 400 when status pagamento is invalid', async () => {
      // Arrange
      req.body = {
        valor: mockPagamento.valor,
        data: mockPagamento.data.toISOString(),
        metodoPagamento: 'PIX',
        statusPagamento: 'STATUS_INVALIDO',
        gestorId: mockGestor.id,
        eventoId: mockEvento.id,
      };

      // Act
      await PagamentoController.criandoPagamento(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Status de pagamento inválido" });
    });

    it('should return 400 when gestor is not found', async () => {
      // Arrange
      req.body = {
        valor: mockPagamento.valor,
        data: mockPagamento.data.toISOString(),
        metodoPagamento: 'PIX',
        statusPagamento: 'PENDENTE',
        gestorId: 'gestor-invalido',
        eventoId: mockEvento.id,
      };

      prisma.gestor.findUnique.mockResolvedValue(null);

      // Act
      await PagamentoController.criandoPagamento(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Gestor não encontrado!" });
    });

    it('should return 400 when evento is not found', async () => {
      // Arrange
      req.body = {
        valor: mockPagamento.valor,
        data: mockPagamento.data.toISOString(),
        metodoPagamento: 'PIX',
        statusPagamento: 'PENDENTE',
        gestorId: mockGestor.id,
        eventoId: 'evento-invalido',
      };

      prisma.gestor.findUnique.mockResolvedValue(mockGestor);
      prisma.evento.findUnique.mockResolvedValue(null);

      // Act
      await PagamentoController.criandoPagamento(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Evento não encontrado!" });
    });

    it('should handle errors when creating a pagamento', async () => {
      // Arrange
      req.body = {
        valor: mockPagamento.valor,
        data: mockPagamento.data.toISOString(),
        metodoPagamento: 'PIX',
        statusPagamento: 'PENDENTE',
        gestorId: mockGestor.id,
        eventoId: mockEvento.id,
      };

      prisma.gestor.findUnique.mockResolvedValue(mockGestor);
      prisma.evento.findUnique.mockResolvedValue(mockEvento);
      prisma.pagamento.create.mockRejectedValue(new Error('Database error'));

      // Act
      await PagamentoController.criandoPagamento(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Erro ao criar o pagamento!",
          details: "Database error"
        })
      );
    });
  });

  describe('listarPagamentos', () => {
    it('should return all pagamentos', async () => {
      // Arrange
      const mockPagamentos = [mockPagamento, {...mockPagamento, id: 'pagamento-id-2'}];
      prisma.pagamento.findMany.mockResolvedValue(mockPagamentos);

      // Act
      await PagamentoController.listarPagamentos(req, res);

      // Assert
      expect(prisma.pagamento.findMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockPagamentos);
    });

    it('should handle errors when listing pagamentos', async () => {
      // Arrange
      prisma.pagamento.findMany.mockRejectedValue(new Error('Database error'));

      // Act
      await PagamentoController.listarPagamentos(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro ao listar pagamentos" });
    });
  });

  describe('buscarPagamentoPorId', () => {
    it('should return a pagamento by id', async () => {
      // Arrange
      req.params = { id: mockPagamento.id };
      prisma.pagamento.findUnique.mockResolvedValue(mockPagamento);

      // Act
      await PagamentoController.buscarPagamentoPorId(req, res);

      // Assert
      expect(prisma.pagamento.findUnique).toHaveBeenCalledWith({
        where: { id: mockPagamento.id },
      });
      expect(res.json).toHaveBeenCalledWith(mockPagamento);
    });

    it('should return 404 when pagamento is not found', async () => {
      // Arrange
      req.params = { id: 'non-existent-id' };
      prisma.pagamento.findUnique.mockResolvedValue(null);

      // Act
      await PagamentoController.buscarPagamentoPorId(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Pagamento não encontrado" });
    });

    it('should handle errors when fetching a pagamento by id', async () => {
      // Arrange
      req.params = { id: mockPagamento.id };
      prisma.pagamento.findUnique.mockRejectedValue(new Error('Database error'));

      // Act
      await PagamentoController.buscarPagamentoPorId(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro ao buscar pagamento" });
    });
  });

  describe('editarPagamento', () => {
    it('should update a pagamento with valid data', async () => {
      // Arrange
      req.params = { id: mockPagamento.id };
      req.body = {
        valor: 400.00,
        data: new Date().toISOString(),
        metodoPagamento: 'CARTAO',
        statusPagamento: 'PAGO',
      };

      const updatedPagamento = {
        ...mockPagamento,
        ...req.body,
        data: new Date(req.body.data),
      };

      prisma.pagamento.findUnique.mockResolvedValue(mockPagamento);
      prisma.pagamento.update.mockResolvedValue(updatedPagamento);

      // Act
      await PagamentoController.editarPagamento(req, res);

      // Assert
      expect(prisma.pagamento.findUnique).toHaveBeenCalledWith({
        where: { id: mockPagamento.id },
      });
      expect(prisma.pagamento.update).toHaveBeenCalledWith({
        where: { id: mockPagamento.id },
        data: expect.objectContaining({
          valor: 400.00,
          data: expect.any(Date),
          metodoPagamento: 'CARTAO',
          statusPagamento: 'PAGO',
          relatorioId: null,
        }),
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedPagamento);
    });

    it('should return 404 when pagamento is not found for update', async () => {
      // Arrange
      req.params = { id: 'non-existent-id' };
      req.body = {
        valor: 400.00,
      };

      prisma.pagamento.findUnique.mockResolvedValue(null);

      // Act
      await PagamentoController.editarPagamento(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Pagamento não encontrado" });
    });

    it('should return 400 when metodo pagamento is invalid for update', async () => {
      // Arrange
      req.params = { id: mockPagamento.id };
      req.body = {
        metodoPagamento: 'METODO_INVALIDO',
      };

      prisma.pagamento.findUnique.mockResolvedValue(mockPagamento);

      // Act
      await PagamentoController.editarPagamento(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Método de pagamento inválido!" });
    });

    it('should handle errors when updating a pagamento', async () => {
      // Arrange
      req.params = { id: mockPagamento.id };
      req.body = {
        valor: 400.00,
      };

      prisma.pagamento.findUnique.mockResolvedValue(mockPagamento);
      prisma.pagamento.update.mockRejectedValue(new Error('Database error'));

      // Act
      await PagamentoController.editarPagamento(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Erro ao editar pagamento",
          details: "Database error"
        })
      );
    });
  });

  describe('deletarPagamento', () => {
    it('should delete a pagamento by id', async () => {
      // Arrange
      req.params = { id: mockPagamento.id };
      prisma.pagamento.findUnique.mockResolvedValue(mockPagamento);
      prisma.pagamento.delete.mockResolvedValue(mockPagamento);

      // Act
      await PagamentoController.deletarPagamento(req, res);

      // Assert
      expect(prisma.pagamento.findUnique).toHaveBeenCalledWith({
        where: { id: mockPagamento.id },
      });
      expect(prisma.pagamento.delete).toHaveBeenCalledWith({
        where: { id: mockPagamento.id },
      });
      expect(res.json).toHaveBeenCalledWith({ mensagem: "Pagamento deletado com sucesso" });
    });

    it('should return 404 when pagamento is not found for deletion', async () => {
      // Arrange
      req.params = { id: 'non-existent-id' };
      prisma.pagamento.findUnique.mockResolvedValue(null);

      // Act
      await PagamentoController.deletarPagamento(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Pagamento não encontrado" });
    });

    it('should handle errors when deleting a pagamento', async () => {
      // Arrange
      req.params = { id: mockPagamento.id };
      prisma.pagamento.findUnique.mockResolvedValue(mockPagamento);
      prisma.pagamento.delete.mockRejectedValue(new Error('Database error'));

      // Act
      await PagamentoController.deletarPagamento(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro ao deletar pagamento" });
    });
  });
});
