// Re-export all routers
const carroRouter = require('./Carro/carroRouter');
const eventoRouter = require('./Evento/EventoRouter');
const motoristaRouter = require('./Motorista/motoristaRouter');
const gestorRouter = require('./Gestor/GestorRoutes');
const pagamentoRouter = require('./Pagamento/PagamentoRouter');
const relatorioRouter = require('./RelatorioRouter');

module.exports = {
  carroRouter,
  eventoRouter,
  motoristaRouter,
  gestorRouter,
  pagamentoRouter,
  relatorioRouter
};
