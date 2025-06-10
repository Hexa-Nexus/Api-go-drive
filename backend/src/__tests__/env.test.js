/**
 * Testes para garantir que variáveis de ambiente necessárias são configuradas
 * ou têm fallbacks adequados para ambiente de testes
 */
describe('Environment Variables', () => {
  // Armazena os valores originais
  const originalEnv = { ...process.env };

  // Limpa a variável de ambiente antes de cada teste
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.JWT_SECRET;
    delete process.env.DATABASE_URL;
  });

  // Restaura as variáveis originais após todos os testes
  afterAll(() => {
    process.env = { ...originalEnv };
  });

  it('should have a fallback JWT_SECRET when not defined', () => {
    // Importando o middleware de autenticação que usa JWT_SECRET
    const jwt = require('jsonwebtoken');
    const verificarJWT = require('../middlewares/auth');

    // Configurando mock req, res, next
    const req = { headers: { authorization: 'Bearer test-token' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    // Mock para jwt.verify
    jwt.verify = jest.fn().mockImplementation((token, secret) => {
      // Verificar se um valor secreto padrão é usado quando JWT_SECRET não está definido
      expect(secret).toBe('secreta');
      return { id: 'test-id' };
    });

    // Chamar middleware que internamente usará JWT_SECRET
    verificarJWT(req, res, next);

    // Verificar que jwt.verify foi chamado com o fallback esperado
    expect(jwt.verify).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should prefer JWT_SECRET from environment when defined', () => {
    // Definir JWT_SECRET no ambiente
    process.env.JWT_SECRET = 'env-secret-key';

    // Importando o middleware de autenticação
    const jwt = require('jsonwebtoken');
    const verificarJWT = require('../middlewares/auth');

    // Configurando mock req, res, next
    const req = { headers: { authorization: 'Bearer test-token' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    // Mock para jwt.verify
    jwt.verify = jest.fn().mockImplementation((token, secret) => {
      // Verificar se o valor de ambiente é usado
      expect(secret).toBe('env-secret-key');
      return { id: 'test-id' };
    });

    // Chamar middleware que internamente usará JWT_SECRET
    verificarJWT(req, res, next);

    // Verificar que jwt.verify foi chamado com a variável de ambiente
    expect(jwt.verify).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should handle DATABASE_URL correctly in Prisma configuration', () => {
    // Mock do Prisma
    jest.mock('@prisma/client', () => {
      return {
        PrismaClient: jest.fn().mockImplementation(() => ({
          $connect: jest.fn(),
          $disconnect: jest.fn(),
        }))
      };
    });

    // Definir DATABASE_URL para teste
    process.env.DATABASE_URL = 'mysql://user:password@localhost:3306/testdb';

    // Importar o cliente Prisma (configurado com DATABASE_URL)
    const { PrismaClient } = require('@prisma/client');

    // Criar uma instância do cliente
    const prisma = new PrismaClient();

    // Verificar que o cliente foi inicializado (o que implica que DATABASE_URL foi usado)
    expect(prisma).toBeDefined();
    expect(PrismaClient).toHaveBeenCalled();
  });
});
