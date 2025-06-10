const request = require('supertest');
const Express = require('express');

// Mock dos routers
jest.mock('../../routes/Carro/carroRouter', () => jest.fn());
jest.mock('../../routes/Evento/eventoRouter', () => jest.fn());
jest.mock('../../routes/Motorista/motoristaRouter', () => jest.fn());
jest.mock('../../routes/Gestor/GestorRoutes', () => jest.fn());
jest.mock('../../routes/Pagamento/PagamentoRouter', () => jest.fn());

// Mock de Express e seus métodos
const mockUse = jest.fn();
const mockListen = jest.fn().mockReturnValue({
  on: jest.fn()
});
const mockGet = jest.fn().mockImplementation((path, callback) => {
  if (path === '/') {
    return { path, callback };
  }
});

jest.mock('express', () => {
  return jest.fn().mockImplementation(() => {
    return {
      use: mockUse,
      listen: mockListen,
      get: mockGet,
    };
  });
});

// Outros mocks
jest.mock('cors', () => jest.fn(() => 'cors-middleware'));
jest.mock('swagger-jsdoc', () => jest.fn(() => 'swagger-docs'));
jest.mock('swagger-ui-express', () => ({
  serve: 'swagger-serve',
  setup: jest.fn(() => 'swagger-setup')
}));

// Mock de console.log para testes silenciosos
const originalConsoleLog = console.log;
console.log = jest.fn();

describe('API Integration', () => {
  let app;

  // Limpar mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Restaurar console.log após os testes
  afterAll(() => {
    console.log = originalConsoleLog;
  });

  it('should setup all API routes correctly', () => {
    // Importar o app.js que configura todas as rotas
    app = require('../../app');

    // Verificar se o middleware cors foi configurado
    expect(mockUse).toHaveBeenCalledWith(expect.anything(), 'cors-middleware');

    // Verificar se a configuração do swagger foi feita corretamente
    expect(mockUse).toHaveBeenCalledWith('/api-docs', 'swagger-serve', 'swagger-setup');

    // Verificar se todas as rotas da API foram registradas
    const carroRouter = require('../../routes/Carro/carroRouter');
    const eventoRouter = require('../../routes/Evento/eventoRouter');
    const motoristaRouter = require('../../routes/Motorista/motoristaRouter');
    const gestorRouter = require('../../routes/Gestor/GestorRoutes');
    const pagamentoRouter = require('../../routes/Pagamento/PagamentoRouter');

    expect(mockUse).toHaveBeenCalledWith('/api', carroRouter);
    expect(mockUse).toHaveBeenCalledWith('/api', eventoRouter);
    expect(mockUse).toHaveBeenCalledWith('/api', motoristaRouter);
    expect(mockUse).toHaveBeenCalledWith('/api', gestorRouter);
    expect(mockUse).toHaveBeenCalledWith('/api', pagamentoRouter);

    // Verificar se a rota raiz foi configurada
    expect(mockGet).toHaveBeenCalledWith('/', expect.any(Function));

    // Verificar se o servidor foi configurado para ouvir na porta correta
    expect(mockListen).toHaveBeenCalledWith(3000, expect.any(Function));
  });

  it('should test root endpoint response', () => {
    // Simular a chamada do callback da rota raiz
    const rootRoute = mockGet.mock.results[0].value;

    // Mock de req e res
    const req = {};
    const res = {
      send: jest.fn()
    };

    // Executar o callback da rota raiz
    if (rootRoute && rootRoute.path === '/' && rootRoute.callback) {
      rootRoute.callback(req, res);
      expect(res.send).toHaveBeenCalledWith("Hello World!");
    }
  });
});
