const { PrismaClient } = require('@prisma/client');
const GestorController = require('../../../controllers/Gestor/GestorController');
const { mockGestor } = require('../../helpers/mock-data.helper');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock the required modules
jest.mock('@prisma/client');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('GestorController', () => {
  // Mock request and response
  let req;
  let res;
  let prisma;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: 'user-id-1' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Set up the PrismaClient mock
    prisma = {
      gestor: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    // Mock the PrismaClient constructor to return our mock
    PrismaClient.mockImplementation(() => prisma);
  });

  describe('criandoGestor', () => {
    it('should create a new gestor with valid data', async () => {
      // Arrange
      req.body = {
        name: 'Test User',
        cpf: '12345678909', // Valid CPF format for test
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = 'hashed_password';
      bcrypt.hash.mockResolvedValue(hashedPassword);

      prisma.gestor.findFirst.mockResolvedValueOnce(null); // CPF check
      prisma.gestor.findFirst.mockResolvedValueOnce(null); // Email check
      prisma.gestor.create.mockResolvedValue({
        id: 'new-gestor-id',
        ...req.body,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      await GestorController.criandoGestor(req, res);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(prisma.gestor.findFirst).toHaveBeenCalledWith({
        where: { cpf: '12345678909' },
      });
      expect(prisma.gestor.findFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(prisma.gestor.create).toHaveBeenCalledWith({
        data: {
          name: 'Test User',
          cpf: '12345678909',
          email: 'test@example.com',
          password: hashedPassword,
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: 'new-gestor-id',
        name: 'Test User',
        cpf: '12345678909',
        email: 'test@example.com',
      }));
    });

    it('should return 400 when CPF is already registered', async () => {
      // Arrange
      req.body = {
        name: 'Test User',
        cpf: '12345678909',
        email: 'test@example.com',
        password: 'password123',
      };

      bcrypt.hash.mockResolvedValue('hashed_password');

      // Mock CPF already exists
      prisma.gestor.findFirst.mockResolvedValueOnce(mockGestor);

      // Act
      await GestorController.criandoGestor(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Gestor com CPF já existente!" });
    });

    it('should return 400 when email is already registered', async () => {
      // Arrange
      req.body = {
        name: 'Test User',
        cpf: '12345678909',
        email: 'test@example.com',
        password: 'password123',
      };

      bcrypt.hash.mockResolvedValue('hashed_password');

      // Mock CPF not exists but email exists
      prisma.gestor.findFirst.mockResolvedValueOnce(null); // CPF check
      prisma.gestor.findFirst.mockResolvedValueOnce(mockGestor); // Email check

      // Act
      await GestorController.criandoGestor(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Email já existente!" });
    });

    it('should handle errors when creating a gestor', async () => {
      // Arrange
      req.body = {
        name: 'Test User',
        cpf: '12345678909',
        email: 'test@example.com',
        password: 'password123',
      };

      bcrypt.hash.mockResolvedValue('hashed_password');

      prisma.gestor.findFirst.mockResolvedValueOnce(null); // CPF check
      prisma.gestor.findFirst.mockResolvedValueOnce(null); // Email check
      prisma.gestor.create.mockRejectedValue(new Error('Database error'));

      // Act
      await GestorController.criandoGestor(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Erro ao criar o gestor!",
          details: "Database error"
        })
      );
    });
  });

  describe('loginGestor', () => {
    it('should login a gestor with valid credentials', async () => {
      // Arrange
      req.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockToken = 'jwt_token';
      const mockStoredGestor = {
        ...mockGestor,
        email: 'test@example.com',
        password: 'hashed_password',
      };

      prisma.gestor.findUnique.mockResolvedValue(mockStoredGestor);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      // Act
      await GestorController.loginGestor(req, res);

      // Assert
      expect(prisma.gestor.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockStoredGestor.id, email: mockStoredGestor.email },
        expect.any(String),
        { expiresIn: '12h' }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login realizado com sucesso!',
        token: mockToken,
        id: mockStoredGestor.id,
        name: mockStoredGestor.name,
      });
    });

    it('should return 404 when email is not found', async () => {
      // Arrange
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      prisma.gestor.findUnique.mockResolvedValue(null);

      // Act
      await GestorController.loginGestor(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Email não encontrado!" });
    });

    it('should return 401 when password is incorrect', async () => {
      // Arrange
      req.body = {
        email: 'test@example.com',
        password: 'wrong_password',
      };

      prisma.gestor.findUnique.mockResolvedValue({
        ...mockGestor,
        email: 'test@example.com',
        password: 'hashed_password',
      });
      bcrypt.compare.mockResolvedValue(false);

      // Act
      await GestorController.loginGestor(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Senha incorreta!" });
    });

    it('should handle errors during login', async () => {
      // Arrange
      req.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      prisma.gestor.findUnique.mockRejectedValue(new Error('Database error'));

      // Act
      await GestorController.loginGestor(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Erro ao realizar login!",
          details: "Database error"
        })
      );
    });
  });

  describe('buscarGestores', () => {
    it('should return all gestores', async () => {
      // Arrange
      const mockGestores = [mockGestor, {...mockGestor, id: 'gestor-id-2', cpf: '98765432100'}];
      prisma.gestor.findMany.mockResolvedValue(mockGestores);

      // Act
      await GestorController.buscarGestores(req, res);

      // Assert
      expect(prisma.gestor.findMany).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockGestores);
    });

    it('should handle errors when fetching all gestores', async () => {
      // Arrange
      prisma.gestor.findMany.mockRejectedValue(new Error('Database error'));

      // Act
      await GestorController.buscarGestores(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Erro ao buscar os gestores! ",
          details: "Database error"
        })
      );
    });
  });

  describe('buscarGestorId', () => {
    it('should return a gestor by ID', async () => {
      // Arrange
      req.params = { id: mockGestor.id };
      prisma.gestor.findUnique.mockResolvedValue(mockGestor);

      // Act
      await GestorController.buscarGestorId(req, res);

      // Assert
      expect(prisma.gestor.findUnique).toHaveBeenCalledWith({
        where: { id: mockGestor.id },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockGestor);
    });

    it('should return 404 when gestor is not found', async () => {
      // Arrange
      req.params = { id: 'non-existent-id' };
      prisma.gestor.findUnique.mockResolvedValue(null);

      // Act
      await GestorController.buscarGestorId(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Gestor não encontrado!" });
    });

    it('should handle errors when fetching a gestor by ID', async () => {
      // Arrange
      req.params = { id: mockGestor.id };
      prisma.gestor.findUnique.mockRejectedValue(new Error('Database error'));

      // Act
      await GestorController.buscarGestorId(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "Erro ao buscar Gestor! ",
          details: "Database error"
        })
      );
    });
  });
});
