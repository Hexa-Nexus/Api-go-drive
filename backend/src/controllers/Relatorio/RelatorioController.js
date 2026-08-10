const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class RelatorioController {
  // Método para gerar um relatório completo com todos os dados
  static async gerarRelatorioCompleto(req, res) {
    try {
      // Obtendo parâmetros de data da requisição
      const { dataInicio, dataFim } = req.query;
      
      // Criando filtro de data
      let filtroData = {};
      
      if (dataInicio || dataFim) {
        filtroData = {
          createdAt: {}
        };
        
        if (dataInicio) {
          filtroData.createdAt.gte = new Date(dataInicio);
        }
        
        if (dataFim) {
          filtroData.createdAt.lte = new Date(dataFim);
        }
      }

      // Busca todos os gestores com seus dados
      const gestores = await prisma.gestor.findMany({
        where: filtroData,
        select: {
          id: true,
          nome: true,
          email: true,
          cpf: true,
          admin: true,
          createdAt: true,
          updatedAt: true,
          // Não incluímos a senha por questões de segurança
        }
      });

      // Busca todos os motoristas com seus dados
      const motoristas = await prisma.motorista.findMany({
        where: filtroData,
        include: {
          gestor: {
            select: {
              id: true,
              nome: true,
              email: true,
            }
          }
        }
      });

      // Busca todos os carros com seus dados
      const carros = await prisma.carro.findMany({
        where: filtroData,
        include: {
          gestor: {
            select: {
              id: true,
              nome: true,
              email: true,
            }
          }
        }
      });

      // Criando filtro de data para eventos (usando dataSaida e dataEntrada)
      let filtroEventos = {};
      
      if (dataInicio || dataFim) {
        filtroEventos = {
          OR: [
            { dataSaida: {} },
            { dataEntrada: {} }
          ]
        };
        
        if (dataInicio) {
          filtroEventos.OR[0].dataSaida.gte = new Date(dataInicio);
          filtroEventos.OR[1].dataEntrada.gte = new Date(dataInicio);
        }
        
        if (dataFim) {
          filtroEventos.OR[0].dataSaida.lte = new Date(dataFim);
          filtroEventos.OR[1].dataEntrada.lte = new Date(dataFim);
        }
      }

      // Busca todos os eventos com seus relacionamentos
      const eventos = await prisma.evento.findMany({
        where: filtroEventos,
        include: {
          carro: true,
          gestor: {
            select: {
              id: true,
              nome: true,
              email: true,
            }
          },
          motorista: true,
          pagamentos: true,
        }
      });

      // Filtro de data para pagamentos (usando o campo data)
      let filtroPagamentos = {};
      
      if (dataInicio || dataFim) {
        filtroPagamentos = {
          data: {}
        };
        
        if (dataInicio) {
          filtroPagamentos.data.gte = new Date(dataInicio);
        }
        
        if (dataFim) {
          filtroPagamentos.data.lte = new Date(dataFim);
        }
      }

      // Busca todos os pagamentos com seus relacionamentos
      const pagamentos = await prisma.pagamento.findMany({
        where: filtroPagamentos,
        include: {
          gestor: {
            select: {
              id: true,
              nome: true,
              email: true,
            }
          },
          evento: true,
        }
      });

      // Calcular estatísticas gerais
      const estatisticas = {
        totalGestores: gestores.length,
        totalMotoristas: motoristas.length,
        totalCarros: carros.length,
        totalEventos: eventos.length,
        totalPagamentos: pagamentos.length,
        valorTotalPagamentos: pagamentos.reduce((acc, pagamento) => acc + pagamento.valor, 0),
        
        // Estatísticas de eventos
        eventosPendentes: eventos.filter(evento => evento.status === 'PENDENTE').length,
        eventosConcluidos: eventos.filter(evento => evento.status === 'CONCLUIDO').length,
        eventosCancelados: eventos.filter(evento => evento.status === 'CANCELADO').length,
        
        // Estatísticas de pagamentos
        pagamentosPendentes: pagamentos.filter(pagamento => pagamento.statusPagamento === 'PENDENTE').length,
        pagamentosPagos: pagamentos.filter(pagamento => pagamento.statusPagamento === 'PAGO').length,
        pagamentosCancelados: pagamentos.filter(pagamento => pagamento.statusPagamento === 'CANCELADO').length,

        // Estatísticas de carros e motoristas
        carrosDisponiveis: carros.filter(carro => carro.disponivel).length,
        carrosIndisponiveis: carros.filter(carro => !carro.disponivel).length,
        motoristasDisponiveis: motoristas.filter(motorista => motorista.disponivel).length,
        motoristasIndisponiveis: motoristas.filter(motorista => !motorista.disponivel).length,
      };

      // Calculando a distância total percorrida e média por evento
      let distanciaTotal = 0;
      let eventosComDistancia = 0;

      eventos.forEach(evento => {
        if (evento.odometroFinal && evento.odometroInicial) {
          const distancia = evento.odometroFinal - evento.odometroInicial;
          distanciaTotal += distancia;
          eventosComDistancia++;
        }
      });

      estatisticas.distanciaTotalPercorrida = distanciaTotal;
      estatisticas.distanciaMediaPorEvento = eventosComDistancia > 0 ? distanciaTotal / eventosComDistancia : 0;

      // Estrutura do relatório completo
      const relatorioCompleto = {
        dataGeracao: new Date(),
        filtros: {
          dataInicio: dataInicio ? new Date(dataInicio) : null,
          dataFim: dataFim ? new Date(dataFim) : null
        },
        estatisticas,
        gestores,
        motoristas,
        carros,
        eventos,
        pagamentos
      };

      return res.status(200).json(relatorioCompleto);
    } catch (error) {
      console.error('Erro ao gerar relatório completo:', error);
      return res.status(500).json({ 
        error: 'Erro ao gerar relatório completo', 
        details: error.message 
      });
    }
  }
}

module.exports = RelatorioController;
