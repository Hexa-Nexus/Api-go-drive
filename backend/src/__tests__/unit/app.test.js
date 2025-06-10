const request = require('supertest');
const Express = require('express');

// Mock the express module
jest.mock('express', () => {
  const expressMock = jest.fn(() => expressMock);
  expressMock.json = jest.fn().mockReturnValue('json middleware');
  expressMock.urlencoded = jest.fn().mockReturnValue('urlencoded middleware');
  expressMock.use = jest.fn();
  expressMock.get = jest.fn();
  expressMock.listen = jest.fn().mockReturnValue({ on: jest.fn() });
  return expressMock;
});

// Mock cors
jest.mock('cors', () => jest.fn(() => 'cors middleware'));

// Mock swagger modules
jest.mock('swagger-jsdoc', () => jest.fn(() => 'swagger docs'));
jest.mock('swagger-ui-express', () => ({
  serve: 'swagger serve',
  setup: jest.fn(() => 'swagger setup'),
}));

// Mock route modules
jest.mock('../../../routes/Carro/carroRouter', () => 'carro router');
jest.mock('../../../routes/Evento/eventoRouter', () => 'evento router');
jest.mock('../../../routes/Motorista/motoristaRouter', () => 'motorista router');
jest.mock('../../../routes/Gestor/GestorRoutes', () => 'gestor router');
jest.mock('../../../routes/Pagamento/PagamentoRouter', () => 'pagamento router');

describe('App.js', () => {
  let app;
  let originalConsoleLog;

  beforeAll(() => {
    // Suppress console.log output during tests
    originalConsoleLog = console.log;
    console.log = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore console.log
    console.log = originalConsoleLog;
  });

  it('should set up the Express app with all middlewares and routes', () => {
    // Import app.js which should execute all the setup code
    app = require('../../../app');

    // Check if Express was initialized
    expect(Express).toHaveBeenCalled();

    // Check if middlewares were set up
    expect(Express.use).toHaveBeenCalledWith(expect.anything(), 'cors middleware');
    expect(Express.json).toHaveBeenCalled();
    expect(Express.urlencoded).toHaveBeenCalledWith({ extended: true });
    expect(Express.use).toHaveBeenCalledWith('/api-docs', 'swagger serve', 'swagger setup');

    // Check if routes were set up
    expect(Express.use).toHaveBeenCalledWith('/api', 'carro router');
    expect(Express.use).toHaveBeenCalledWith('/api', 'evento router');
    expect(Express.use).toHaveBeenCalledWith('/api', 'motorista router');
    expect(Express.use).toHaveBeenCalledWith('/api', 'gestor router');
    expect(Express.use).toHaveBeenCalledWith('/api', 'pagamento router');

    // Check if the root route was set up
    expect(Express.get).toHaveBeenCalledWith('/', expect.any(Function));

    // Check if the app is listening
    expect(Express.listen).toHaveBeenCalledWith(3000, expect.any(Function));
  });
});
