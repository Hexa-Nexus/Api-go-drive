const { PrismaClient } = require('@prisma/client');
const MotoristaController = require('../../../controllers/Motorista/motoristaController');
const { mockMotorista, mockGestor } = require('../../helpers/mock-data.helper');

// Mock prisma client
jest.mock('@prisma/client');

describe('MotoristaController', () => {
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
      motorista: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      gestor: {
        findUnique: jest.fn(),
      }
    };

    // Mock the PrismaClient constructor to return our mock
    PrismaClient.mockImplementation(() => prisma);
  });

  describe('criar_motorista', () => {
    it('should create a new motorista with valid data', async () => {
      // Arrange
      req.body = {
        nome: mockMotorista.nome,
        telefone: mockMotorista.telefone,
        cpf: mockMotorista.cpf,
        habilitacao: mockMotorista.habilitacao,
        gestorId: mockGestor.id,
      };

      prisma.motorista.findUnique.mockResolvedValueOnce(null); // CPF check
      prisma.motorista.findUnique.mockResolvedValueOnce(null); // Habilitação check
      prisma.gestor.findUnique.mockResolvedValue(mockGestor);
      prisma.motorista.create.mockResolvedValue(mockMotorista);

      // Act
      await MotoristaController.criar_motorista(req, res);

      // Assert
      expect(prisma.motorista.findUnique).toHaveBeenCalledWith({
        where: { cpf: mockMotorista.cpf },
      });
      expect(prisma.motorista.findUnique).toHaveBeenCalledWith({
        where: { habilitacao: mockMotorista.habilitacao },
      });
      expect(prisma.gestor.findUnique).toHaveBeenCalledWith({
        where: { id: mockGestor.id },
      });
      expect(prisma.motorista.create).toHaveBeenCalledWith({
        data: {
          nome: mockMotorista.nome,
          telefone: mockMotorista.telefone,
          cpf: mockMotorista.cpf,
          habilitacao: mockMotorista.habilitacao,
          gestorId: mockGestor.id,
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        motorista: mockMotorista,
        mensagem: "Motorista criado com sucesso.",
      });
    });

    it('should return 400 when CPF is already registered', async () => {
      // Arrange
      req.body = {
        nome: mockMotorista.nome,
        telefone: mockMotorista.telefone,
        cpf: mockMotorista.cpf,
        habilitacao: mockMotorista.habilitacao,
        gestorId: mockGestor.id,
      };

      prisma.motorista.findUnique.mockResolvedValueOnce(mockMotorista); // CPF já existe

      // Act
      await MotoristaController.criar_motorista(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Já existe um motorista com esse CPF." });
    });

    it('should return 400 when habilitacao is already registered', async () => {
      // Arrange
      req.body = {
        nome: mockMotorista.nome,
        telefone: mockMotorista.telefone,
        cpf: mockMotorista.cpf,
        habilitacao: mockMotorista.habilitacao,
        gestorId: mockGestor.id,
      };

      prisma.motorista.findUnique.mockResolvedValueOnce(null); // CPF check
      prisma.motorista.findUnique.mockResolvedValueOnce(mockMotorista); // Habilitação já existe

      // Act
      await MotoristaController.criar_motorista(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Já existe um motorista com essa habilitação." });
    });

    it('should return 400 when gestor is not found', async () => {
      // Arrange
      req.body = {
        nome: mockMotorista.nome,
        telefone: mockMotorista.telefone,
        cpf: mockMotorista.cpf,
        habilitacao: mockMotorista.habilitacao,
        gestorId: 'gestor-inexistente',
      };

      prisma.motorista.findUnique.mockResolvedValueOnce(null); // CPF check
      prisma.motorista.findUnique.mockResolvedValueOnce(null); // Habilitação check
      prisma.gestor.findUnique.mockResolvedValue(null); // Gestor não encontrado

      // Act
      await MotoristaController.criar_motorista(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Gestor não encontrado." });
    });

    it('should handle errors when creating a motorista', async () => {
      // Arrange
      req.body = {
        nome: mockMotorista.nome,
        telefone: mockMotorista.telefone,
        cpf: mockMotorista.cpf,
        habilitacao: mockMotorista.habilitacao,
        gestorId: mockGestor.id,
      };

      prisma.motorista.findUnique.mockResolvedValueOnce(null); // CPF check
      prisma.motorista.findUnique.mockResolvedValueOnce(null); // Habilitação check
      prisma.gestor.findUnique.mockResolvedValue(mockGestor);
      prisma.motorista.create.mockRejectedValue(new Error('Database error'));

      // Act
      await MotoristaController.criar_motorista(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Erro ao criar motorista",
          details: "Database error"
        })
      );
    });
  });

  describe('obter_todos_motoristas', () => {
    it('should return all motoristas', async () => {
      // Arrange
      const mockMotoristas = [mockMotorista, {...mockMotorista, id: 'motorista-id-2', cpf: '98765432100', habilitacao: 'XYZ987654'}];
      prisma.motorista.findMany.mockResolvedValue(mockMotoristas);

      // Act
      await MotoristaController.obter_todos_motoristas(req, res);

      // Assert
      expect(prisma.motorista.findMany).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockMotoristas);
    });

    it('should handle errors when fetching all motoristas', async () => {
      // Arrange
      prisma.motorista.findMany.mockRejectedValue(new Error('Database error'));

      // Act
      await MotoristaController.obter_todos_motoristas(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro ao obter motoristas" });
    });
  });

  describe('obter_motorista_por_id', () => {
    it('should return a motorista by id', async () => {
      // Arrange
      req.params = { id: mockMotorista.id };
      prisma.motorista.findUnique.mockResolvedValue(mockMotorista);

      // Act
      await MotoristaController.obter_motorista_por_id(req, res);

      // Assert
      expect(prisma.motorista.findUnique).toHaveBeenCalledWith({
        where: { id: mockMotorista.id },
        select: expect.objectContaining({
          id: true,
          nome: true,
          telefone: true,
          cpf: true,
          habilitacao: true,
          disponivel: true,
          gestorId: true,
        }),
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockMotorista);
    });

    it('should return 404 when motorista is not found', async () => {
      // Arrange
      req.params = { id: 'non-existent-id' };
      prisma.motorista.findUnique.mockResolvedValue(null);

      // Act
      await MotoristaController.obter_motorista_por_id(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Motorista não encontrado" });
    });

    it('should handle errors when fetching a motorista by id', async () => {
      // Arrange
      req.params = { id: mockMotorista.id };
      prisma.motorista.findUnique.mockRejectedValue(new Error('Database error'));

      // Act
      await MotoristaController.obter_motorista_por_id(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro ao obter o motorista" });
    });
  });

  describe('atualizar_motorista', () => {
    it('should update a motorista with valid data', async () => {
      // Arrange
      req.params = { id: mockMotorista.id };
      req.body = {
        nome: 'Nome Atualizado',
        telefone: '11999999999',
        habilitacao: 'DEF654321',
        disponivel: false,
      };

      const updatedMotorista = {
        ...mockMotorista,
        ...req.body,
      };

      prisma.motorista.findUnique.mockResolvedValue(mockMotorista);
      prisma.motorista.update.mockResolvedValue(updatedMotorista);

      // Act
      await MotoristaController.atualizar_motorista(req, res);

      // Assert
      expect(prisma.motorista.findUnique).toHaveBeenCalledWith({
        where: { id: mockMotorista.id },
      });
      expect(prisma.motorista.update).toHaveBeenCalledWith({
        where: { id: mockMotorista.id },
        data: expect.objectContaining(req.body),
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        motorista: updatedMotorista,
        mensagem: "Motorista atualizado com sucesso",
      });
    });

    it('should return 404 when motorista is not found for update', async () => {
      // Arrange
      req.params = { id: 'non-existent-id' };
      req.body = {
        nome: 'Nome Atualizado',
      };

      prisma.motorista.findUnique.mockResolvedValue(null);

      // Act
      await MotoristaController.atualizar_motorista(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Motorista não encontrado" });
    });

    it('should handle errors when updating a motorista', async () => {
      // Arrange
      req.params = { id: mockMotorista.id };
      req.body = {
        nome: 'Nome Atualizado',
      };

      prisma.motorista.findUnique.mockResolvedValue(mockMotorista);
      prisma.motorista.update.mockRejectedValue(new Error('Database error'));

      // Act
      await MotoristaController.atualizar_motorista(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro ao atualizar motorista" });
    });
  });

  describe('deletar_motorista', () => {
    it('should delete a motorista by id', async () => {
      // Arrange
      req.params = { id: mockMotorista.id };
      prisma.motorista.findUnique.mockResolvedValue(mockMotorista);
      prisma.motorista.delete.mockResolvedValue(mockMotorista);

      // Act
      await MotoristaController.deletar_motorista(req, res);

      // Assert
      expect(prisma.motorista.findUnique).toHaveBeenCalledWith({
        where: { id: mockMotorista.id },
      });
      expect(prisma.motorista.delete).toHaveBeenCalledWith({
        where: { id: mockMotorista.id },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Motorista deletado com sucesso" });
    });

    it('should return 404 when motorista is not found for deletion', async () => {
      // Arrange
      req.params = { id: 'non-existent-id' };
      prisma.motorista.findUnique.mockResolvedValue(null);

      // Act
      await MotoristaController.deletar_motorista(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Motorista não encontrado" });
    });

    it('should handle errors when deleting a motorista', async () => {
      // Arrange
      req.params = { id: mockMotorista.id };
      prisma.motorista.findUnique.mockResolvedValue(mockMotorista);
      prisma.motorista.delete.mockRejectedValue(new Error('Database error'));

      // Act
      await MotoristaController.deletar_motorista(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Erro ao deletar motorista",
          details: "Database error"
        })
      );
    });
  });

  describe('obter_motorista_por_cpf', () => {
    it('should return a motorista by CPF', async () => {
      // Arrange
      req.query = { cpf: mockMotorista.cpf };
      prisma.motorista.findFirst.mockResolvedValue(mockMotorista);

      // Act
      await MotoristaController.obter_motorista_por_cpf(req, res);

      // Assert
      expect(prisma.motorista.findFirst).toHaveBeenCalledWith({
        where: {
          cpf: mockMotorista.cpf.replace(/\D/g, ''),
          gestorId: req.user.id
        },
        select: expect.objectContaining({
          id: true,
          nome: true,
          telefone: true,
          cpf: true,
          habilitacao: true,
          disponivel: true,
          gestorId: true,
        }),
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockMotorista);
    });

    it('should return 400 when CPF is not provided', async () => {
      // Arrange
      req.query = {}; // CPF não fornecido

      // Act
      await MotoristaController.obter_motorista_por_cpf(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "CPF não fornecido" });
    });

    it('should return 404 when motorista is not found by CPF', async () => {
      // Arrange
      req.query = { cpf: mockMotorista.cpf };
      prisma.motorista.findFirst.mockResolvedValue(null);

      // Act
      await MotoristaController.obter_motorista_por_cpf(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Motorista não encontrado" });
    });

    it('should handle errors when fetching a motorista by CPF', async () => {
      // Arrange
      req.query = { cpf: mockMotorista.cpf };
      prisma.motorista.findFirst.mockRejectedValue(new Error('Database error'));

      // Act
      await MotoristaController.obter_motorista_por_cpf(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro ao obter o motorista" });
    });
  });
});
