/**
 * Mock data for testing
 */

// Mock Gestor data
const mockGestor = {
  id: 'gestor-id-1',
  admin: true,
  name: 'Admin User',
  cpf: '12345678900',
  email: 'admin@example.com',
  password: 'hashed-password',
  createdAt: new Date(),
  updatedAt: new Date()
};

// Mock Carro data
const mockCarro = {
  id: 'carro-id-1',
  modelo: 'Civic',
  marca: 'Honda',
  ano: 2022,
  cor: 'Preto',
  placa: 'ABC1234',
  odometroAtual: 5000,
  disponivel: true,
  gestorId: 'gestor-id-1',
  createdAt: new Date(),
  updatedAt: new Date()
};

// Mock Motorista data
const mockMotorista = {
  id: 'motorista-id-1',
  nome: 'João Silva',
  telefone: '11987654321',
  cpf: '98765432100',
  habilitacao: 'ABC123456',
  disponivel: true,
  gestorId: 'gestor-id-1',
  createdAt: new Date(),
  updatedAt: new Date()
};

// Mock Evento data
const mockEvento = {
  id: 'evento-id-1',
  tipoEvento: 'SAIDA',
  status: 'PENDENTE',
  dataSaida: new Date(),
  dataEntrada: null,
  odometroInicial: 5000,
  odometroFinal: null,
  carroId: 'carro-id-1',
  gestorId: 'gestor-id-1',
  motoristaId: 'motorista-id-1',
  relatorioId: null,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Mock Pagamento data
const mockPagamento = {
  id: 'pagamento-id-1',
  valor: 300.00,
  data: new Date(),
  metodoPagamento: 'PIX',
  statusPagamento: 'PENDENTE',
  gestorId: 'gestor-id-1',
  eventoId: 'evento-id-1',
  relatorioId: null,
  createdAt: new Date(),
  updatedAt: new Date()
};

module.exports = {
  mockGestor,
  mockCarro,
  mockMotorista,
  mockEvento,
  mockPagamento
};
