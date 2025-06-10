const { PrismaClient } = require('@prisma/client');
const CarroController = require('../../../controllers/Carro/carroController');
const { mockCarro, mockGestor } = require('../../helpers/mock-data.helper');

// Mock prisma client
const prisma = new PrismaClient();

describe('CarroController', () => {
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

  describe('criandoCarro', () => {
    it('should create a new car when valid data is provided', async () => {
      // Arrange
      req.body = {
        modelo: mockCarro.modelo,
        marca: mockCarro.marca,
        ano: mockCarro.ano,
        cor: mockCarro.cor,
        placa: mockCarro.placa,
        odometroAtual: mockCarro.odometroAtual,
        disponivel: mockCarro.disponivel,
        gestorId: mockCarro.gestorId,
      };

      prisma.gestor.findUnique.mockResolvedValue(mockGestor);
      prisma.carro.findFirst.mockResolvedValue(null); // No existing car with this plate
      prisma.carro.create.mockResolvedValue(mockCarro);

      // Act
      await CarroController.criandoCarro(req, res);

      // Assert
      expect(prisma.gestor.findUnique).toHaveBeenCalledWith({
        where: { id: mockCarro.gestorId },
      });
      expect(prisma.carro.findFirst).toHaveBeenCalledWith({
        where: { placa: mockCarro.placa },
      });
      expect(prisma.carro.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          modelo: mockCarro.modelo,
          marca: mockCarro.marca,
          ano: mockCarro.ano,
          cor: mockCarro.cor,
          placa: mockCarro.placa,
          odometroAtual: mockCarro.odometroAtual,
          disponivel: mockCarro.disponivel,
          gestorId: mockCarro.gestorId,
        }),
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCarro);
    });

    it('should return 400 when gestor is not found', async () => {
      // Arrange
      req.body = {
        modelo: mockCarro.modelo,
        marca: mockCarro.marca,
        ano: mockCarro.ano,
        cor: mockCarro.cor,
        placa: mockCarro.placa,
        odometroAtual: mockCarro.odometroAtual,
        disponivel: mockCarro.disponivel,
        gestorId: 'invalid-gestor-id',
      };

      prisma.gestor.findUnique.mockResolvedValue(null);

      // Act
      await CarroController.criandoCarro(req, res);

      // Assert
      expect(prisma.gestor.findUnique).toHaveBeenCalledWith({
        where: { id: 'invalid-gestor-id' },
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Gestor não encontrado!" });
    });

    it('should return 400 when plate is already in use', async () => {
      // Arrange
      req.body = {
        modelo: mockCarro.modelo,
        marca: mockCarro.marca,
        ano: mockCarro.ano,
        cor: mockCarro.cor,
        placa: mockCarro.placa,
        odometroAtual: mockCarro.odometroAtual,
        disponivel: mockCarro.disponivel,
        gestorId: mockCarro.gestorId,
      };

      prisma.gestor.findUnique.mockResolvedValue(mockGestor);
      prisma.carro.findFirst.mockResolvedValue(mockCarro); // Plate already exists

      // Act
      await CarroController.criandoCarro(req, res);

      // Assert
      expect(prisma.gestor.findUnique).toHaveBeenCalledWith({
        where: { id: mockCarro.gestorId },
      });
      expect(prisma.carro.findFirst).toHaveBeenCalledWith({
        where: { placa: mockCarro.placa },
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Essa placa já está em uso!" });
    });

    it('should handle errors when creating a car', async () => {
      // Arrange
      req.body = {
        modelo: mockCarro.modelo,
        marca: mockCarro.marca,
        ano: mockCarro.ano,
        cor: mockCarro.cor,
        placa: mockCarro.placa,
        odometroAtual: mockCarro.odometroAtual,
        disponivel: mockCarro.disponivel,
        gestorId: mockCarro.gestorId,
      };

      prisma.gestor.findUnique.mockResolvedValue(mockGestor);
      prisma.carro.findFirst.mockResolvedValue(null);
      prisma.carro.create.mockRejectedValue(new Error('Database error'));

      // Act
      await CarroController.criandoCarro(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Erro ao criar o Carro!",
          details: "Database error"
        })
      );
    });
  });

  describe('obter_todos_carros', () => {
    it('should return all cars', async () => {
      // Arrange
      const mockCarros = [mockCarro, {...mockCarro, id: 'carro-id-2', placa: 'XYZ5678'}];
      prisma.carro.findMany.mockResolvedValue(mockCarros);

      // Act
      await CarroController.obter_todos_carros(req, res);

      // Assert
      expect(prisma.carro.findMany).toHaveBeenCalledWith({
        include: {
          eventos: true,
        },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCarros);
    });

    it('should handle errors when fetching all cars', async () => {
      // Arrange
      prisma.carro.findMany.mockRejectedValue(new Error('Database error'));

      // Act
      await CarroController.obter_todos_carros(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro ao obter os carros" });
    });
  });

  describe('obter_carro_por_id', () => {
    it('should return a car by id', async () => {
      // Arrange
      req.params = { id: mockCarro.id };
      prisma.carro.findUnique.mockResolvedValue(mockCarro);

      // Act
      await CarroController.obter_carro_por_id(req, res);

      // Assert
      expect(prisma.carro.findUnique).toHaveBeenCalledWith({
        where: { id: mockCarro.id },
        select: expect.objectContaining({
          id: true,
          modelo: true,
          marca: true,
          ano: true,
          cor: true,
          placa: true,
          disponivel: true,
          odometroAtual: true,
        }),
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCarro);
    });

    it('should return 404 when car is not found', async () => {
      // Arrange
      req.params = { id: 'non-existent-id' };
      prisma.carro.findUnique.mockResolvedValue(null);

      // Act
      await CarroController.obter_carro_por_id(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "carro não encontrado" });
    });

    it('should handle errors when fetching a car by id', async () => {
      // Arrange
      req.params = { id: mockCarro.id };
      prisma.carro.findUnique.mockRejectedValue(new Error('Database error'));

      // Act
      await CarroController.obter_carro_por_id(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro ao obter o carro" });
    });
  });

  describe('buscar_por_modelo', () => {
    it('should return cars by model', async () => {
      // Arrange
      const mockCarros = [mockCarro, {...mockCarro, id: 'carro-id-2', placa: 'XYZ5678'}];
      req.params = { modelo: 'Civic' };
      prisma.carro.findMany.mockResolvedValue(mockCarros);

      // Act
      await CarroController.buscar_por_modelo(req, res);

      // Assert
      expect(prisma.carro.findMany).toHaveBeenCalledWith({
        where: {
          modelo: {
            contains: 'Civic',
          },
        },
        include: { eventos: true },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCarros);
    });

    it('should return 404 when no cars are found by model', async () => {
      // Arrange
      req.params = { modelo: 'NonExistentModel' };
      prisma.carro.findMany.mockResolvedValue([]);

      // Act
      await CarroController.buscar_por_modelo(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Nenhum carro encontrado com esse modelo" });
    });

    it('should handle errors when searching cars by model', async () => {
      // Arrange
      req.params = { modelo: 'Civic' };
      prisma.carro.findMany.mockRejectedValue(new Error('Database error'));

      // Act
      await CarroController.buscar_por_modelo(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro ao buscar carro por modelo" });
    });
  });

  describe('buscar_por_placa', () => {
    it('should return a car by plate', async () => {
      // Arrange
      const carroPlaca = {...mockCarro, placa: 'ABC1234'};
      req.params = { placa: 'abc1234' };
      prisma.carro.findMany.mockResolvedValue([carroPlaca]);

      // Act
      await CarroController.buscar_por_placa(req, res);

      // Assert
      expect(prisma.carro.findMany).toHaveBeenCalledWith({
        where: {
          placa: {
            contains: 'abc1234',
          },
        },
        include: { eventos: true },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(carroPlaca);
    });

    it('should return 404 when no car is found by plate', async () => {
      // Arrange
      req.params = { placa: 'XYZ9999' };
      prisma.carro.findMany.mockResolvedValue([]);

      // Act
      await CarroController.buscar_por_placa(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Carro não encontrado pela placa" });
    });

    it('should handle errors when searching a car by plate', async () => {
      // Arrange
      req.params = { placa: 'ABC1234' };
      prisma.carro.findMany.mockRejectedValue(new Error('Database error'));

      // Act
      await CarroController.buscar_por_placa(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro ao buscar carro por placa" });
    });
  });

  describe('atualizar_carro', () => {
    it('should update a car when valid data is provided', async () => {
      // Arrange
      req.params = { id: mockCarro.id };
      req.body = {
        modelo: 'Civic Updated',
        marca: 'Honda',
        ano: 2023,
        cor: 'Azul',
        odometroAtual: 6000,
        disponivel: true,
      };

      const updatedCarro = {
        ...mockCarro,
        ...req.body,
      };

      prisma.carro.findUnique.mockResolvedValue(mockCarro);
      prisma.carro.findFirst.mockResolvedValue(null); // No other car with the same plate
      prisma.carro.update.mockResolvedValue(updatedCarro);

      // Act
      await CarroController.atualizar_carro(req, res);

      // Assert
      expect(prisma.carro.findUnique).toHaveBeenCalledWith({
        where: { id: mockCarro.id },
      });
      expect(prisma.carro.update).toHaveBeenCalledWith({
        where: { id: mockCarro.id },
        data: expect.objectContaining(req.body),
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedCarro);
    });

    it('should return 404 when car is not found for update', async () => {
      // Arrange
      req.params = { id: 'non-existent-id' };
      req.body = {
        modelo: 'Civic Updated',
      };

      prisma.carro.findUnique.mockResolvedValue(null);

      // Act
      await CarroController.atualizar_carro(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Carro não encontrado" });
    });

    it('should handle errors when updating a car', async () => {
      // Arrange
      req.params = { id: mockCarro.id };
      req.body = {
        modelo: 'Civic Updated',
      };

      prisma.carro.findUnique.mockResolvedValue(mockCarro);
      prisma.carro.findFirst.mockResolvedValue(null);
      prisma.carro.update.mockRejectedValue(new Error('Database error'));

      // Act
      await CarroController.atualizar_carro(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Erro ao atualizar o carro" });
    });
  });

  describe('deletar_carro', () => {
    it('should delete a car by id', async () => {
      // Arrange
      req.params = { id: mockCarro.id };
      prisma.carro.findUnique.mockResolvedValue(mockCarro);
      prisma.carro.delete.mockResolvedValue(mockCarro);

      // Act
      await CarroController.deletar_carro(req, res);

      // Assert
      expect(prisma.carro.findUnique).toHaveBeenCalledWith({
        where: { id: mockCarro.id },
      });
      expect(prisma.carro.delete).toHaveBeenCalledWith({
        where: { id: mockCarro.id },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "carro deletado com sucesso" });
    });

    it('should return 404 when car is not found for deletion', async () => {
      // Arrange
      req.params = { id: 'non-existent-id' };
      prisma.carro.findUnique.mockResolvedValue(null);

      // Act
      await CarroController.deletar_carro(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "carro não encontrado" });
    });

    it('should handle errors when deleting a car', async () => {
      // Arrange
      req.params = { id: mockCarro.id };
      prisma.carro.findUnique.mockResolvedValue(mockCarro);
      prisma.carro.delete.mockRejectedValue(new Error('Database error'));

      // Act
      await CarroController.deletar_carro(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Erro ao deletar carro",
          details: "Database error"
        })
      );
    });
  });
});
