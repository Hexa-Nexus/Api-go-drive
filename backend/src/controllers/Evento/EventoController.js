const { PrismaClient, TipoEvento, StatusEvento, StatusPagamento, MetodoPagamento, RelatorioTipo } = require("@prisma/client");
const prisma = new PrismaClient();

class EventoController {
  // Criando um novo evento
  static async criar_novo_Eventos(req, res) {
    const {
      tipoEvento,
      status,
      odometroFinal,
      carroId,
      gestorId,
      motoristId,
      relatorioId,
      metodoPagamento,
    } = req.body;

    try {
      const carro = await prisma.carro.findUnique({
        where: { id: carroId },
      });

      if (!carro) {
        return res.status(400).json({ error: "Carro não encontrado" });
      }

      if (!carro.disponivel) {
        return res.status(400).json({ error: "Carro já está alugado" });
      }

      const motorista = await prisma.motorista.findUnique({
        where: { id: motoristId },
      });

      if (!motorista) {
        return res.status(400).json({ error: "Motorista não encontrado" });
      }

      if (!motorista.disponivel) {
        return res
          .status(400)
          .json({ error: "Motorista já está alugando um carro" });
      }

      const gestor = await prisma.gestor.findUnique({
        where: { id: gestorId },
      });

      if (!gestor) {
        return res.status(400).json({ error: "Gestor não encontrado" });
      }

      const novoEvento = await prisma.evento.create({
        data: {
          tipoEvento: TipoEvento.SAIDA, // Substituindo por um valor do enum
          status: StatusEvento.PENDENTE, // Substituindo por um valor do enum
          dataSaida: new Date(),
          odometroInicial: carro.odometroAtual,
          odometroFinal: null,
          carro: { connect: { id: carroId } },
          gestor: { connect: { id: gestorId } },
          motorista: { connect: { id: motoristId } },
          ...(relatorioId
            ? { relatorio: { connect: { id: relatorioId } } }
            : {}),
        },
      });

      await prisma.carro.update({
        where: { id: carroId },
        data: { disponivel: false },
      });

      await prisma.motorista.update({
        where: { id: motoristId },
        data: { disponivel: false },
      });

      return res.status(201).json({
        evento: novoEvento,
        mensagem:
          "Evento criado com status PENDENTE. Aguarde a atualização para finalizar.",
      });
    } catch (error) {
      console.error("Erro ao criar o evento", error);
      return res
        .status(500)
        .json({ error: "Erro ao criar evento", details: error.message });
    }
  }

  // Obter todos eventos
  static async obter_todos_eventos(req, res) {
    try {
      // Verificar os status distintos no banco de dados
      const statusDistintos = await prisma.$queryRaw`SELECT DISTINCT status FROM Evento`;
      console.log("Status distintos no banco de dados:", statusDistintos);

      // Extrair parâmetros de consulta
      const { status, motoristaId, motoristaNome, carroId, carroNome, carroPlaca, dataInicial, dataFinal } = req.query;

      // Debug de parâmetros recebidos
      console.log("Parâmetros recebidos:", { status, motoristaId, motoristaNome, carroId, carroNome, carroPlaca, dataInicial, dataFinal });

      // Construir filtros
      let where = {};

      // Filtro por status
      if (status) {
        where.status = status;

        // Log extra para depuração
        console.log(`Aplicando filtro de status: ${status}`);
        console.log("Where after status filter:", JSON.stringify(where));
      }

      // Filtro por motorista (ID ou nome)
      if (motoristaId) {
        where.motoristaId = motoristaId;
        console.log(`Filtrando por motorista ID: ${motoristaId}`);
      } else if (motoristaNome) {
        // Usar o operador contains para busca parcial por nome
        where = {
          ...where,
          motorista: {
            nome: {
              contains: motoristaNome,
              // O mode: 'insensitive' pode não ser suportado em todas as versões do Prisma
              // Converter para minúsculas para garantir compatibilidade
              mode: 'insensitive'
            }
          }
        };
        console.log(`Filtrando por nome de motorista: ${motoristaNome}`);
      }

      // Filtro por carro (ID, modelo ou placa)
      if (carroId) {
        where.carroId = carroId;
        console.log(`Filtrando por carro ID: ${carroId}`);
      } else if (carroNome || carroPlaca) {
        // Construir o filtro de carro
        const carroFilter = {};

        if (carroNome) {
          carroFilter.modelo = {
            contains: carroNome,
            // O mode: 'insensitive' pode não ser suportado em todas as versões do Prisma
            // Converter para minúsculas para garantir compatibilidade
            mode: 'insensitive'
          };
          console.log(`Filtrando por modelo de carro: ${carroNome}`);
        }

        if (carroPlaca) {
          carroFilter.placa = {
            contains: carroPlaca,
            // O mode: 'insensitive' pode não ser suportado em todas as versões do Prisma
            // Converter para minúsculas para garantir compatibilidade
            mode: 'insensitive'
          };
          console.log(`Filtrando por placa de carro: ${carroPlaca}`);
        }

        // Adicionar o filtro de carro ao where
        where = {
          ...where,
          carro: carroFilter
        };
      }

      // Filtro por intervalo de datas
      if (dataInicial || dataFinal) {
        where.dataSaida = {};

        if (dataInicial) {
          // Converter para o início do dia (00:00:00)
          const dataIni = new Date(dataInicial);
          dataIni.setHours(0, 0, 0, 0);
          where.dataSaida.gte = dataIni;
          console.log(`Filtrando por data inicial: ${dataIni.toISOString()}`);
        }

        if (dataFinal) {
          // Converter para o final do dia (23:59:59)
          const dataFim = new Date(dataFinal);
          dataFim.setHours(23, 59, 59, 999);
          where.dataSaida.lte = dataFim;
          console.log(`Filtrando por data final: ${dataFim.toISOString()}`);
        }
      }

      // Buscar eventos com os filtros
      console.log("Filtros aplicados:", JSON.stringify(where, null, 2));

      const eventos = await prisma.evento.findMany({
        where,
        include: {
          carro: true,
          gestor: true,
          motorista: true,
          pagamentos: true,
          relatorio: true,
        },
        orderBy: {
          dataSaida: 'desc' // Ordenar do mais recente para o mais antigo
        }
      });

      console.log(`Total de eventos encontrados: ${eventos.length}`);
      console.log(`Status dos eventos encontrados: ${eventos.map(e => e.status).join(', ')}`);

      return res.status(200).json(eventos);
    } catch (error) {
      console.error("Erro ao obter eventos:", error);
      return res.status(500).json({ error: "Erro ao obter eventos", details: error.message });
    }
  }

  // Update no evento
  static async concluir_evento(req, res) {
    const { eventoId, metodoPagamento, odometroFinal } = req.body;

    try {
      const evento = await prisma.evento.findUnique({
        where: { id: eventoId },
        include: {
          carro: true,
          motorista: true,
          gestor: true,
        },
      });

      if (!evento) {
        return res.status(400).json({ error: "Evento não encontrado" });
      }

      if (evento.status !== StatusEvento.PENDENTE) {
        return res
          .status(400)
          .json({ error: "Evento não está em status PENDENTE" });
      }

      if (odometroFinal === null || odometroFinal <= evento.odometroInicial) {
        return res.status(400).json({ error: "Odômetro final inválido" });
      }

      const distanciaPercorrida = odometroFinal - evento.odometroInicial;
      const valorPagamento = distanciaPercorrida * 2;

      const pagamento = await prisma.pagamento.create({
        data: {
          valor: valorPagamento,
          metodoPagamento: metodoPagamento || MetodoPagamento.CARTAO, // Usando o enum MetodoPagamento
          statusPagamento: StatusPagamento.PENDENTE, // Usando o enum StatusPagamento
          gestor: { connect: { id: evento.gestorId } },
          evento: { connect: { id: evento.id } },
          data: new Date(),
        },
      });

      const eventoConcluido = await prisma.evento.update({
        where: { id: evento.id },
        data: {
          tipoEvento: TipoEvento.ENTRADA,
          status: StatusEvento.CONCLUIDO, // Usando o enum StatusEvento
          odometroFinal,
          dataEntrada: new Date(),
          pagamentos: { connect: { id: pagamento.id } },
        },
        include: {
          carro: true,
          motorista: true,
          gestor: true
        }
      });

      const relatorioCriado = await prisma.relatorio.create({
        data: {
          tipo: RelatorioTipo.FINANCEIRO, // Usando o enum RelatorioTipo
          gestor: { connect: { id: evento.gestorId } },
          eventos: { connect: { id: eventoConcluido.id } },
          pagamentos: { connect: { id: pagamento.id } },
        },
      });

      await prisma.pagamento.update({
        where: { id: pagamento.id },
        data: {
          statusPagamento: StatusPagamento.PAGO, // Usando o enum StatusPagamento
          relatorio: { connect: { id: relatorioCriado.id } },
        },
      });

      await prisma.carro.update({
        where: { id: evento.carroId },
        data: { disponivel: true, odometroAtual: odometroFinal },
      });

      await prisma.motorista.update({
        where: { id: evento.motoristaId },
        data: { disponivel: true },
      });

      return res.status(200).json({
        evento: {
          id: eventoConcluido.id,
          dataSaida: eventoConcluido.dataSaida,
          dataEntrada: eventoConcluido.dataEntrada,
          motorista: {
            nome: evento.motorista.nome
          },
          carro: {
            modelo: evento.carro.modelo,
            placa: evento.carro.placa
          },
          gestor: {
            nome: evento.gestor.nome
          },
          odometroInicial: eventoConcluido.odometroInicial,
          odometroFinal: eventoConcluido.odometroFinal
        },
        relatorio: relatorioCriado,
        pagamento
      });
    } catch (error) {
      console.error("Erro ao concluir o evento", error);
      return res
        .status(500)
        .json({ error: "Erro ao concluir evento", details: error.message });
    }
  }

  // Obter um evento por id
  static async obter_evento_por_id(req, res) {
    const { id } = req.params;

    try {
      const evento = await prisma.evento.findUnique({
        where: { id },
        include: {
          carro: true,
          gestor: true,
          motorista: true,
          pagamentos: true,
          relatorio: true,
        },
      });

      if (!evento) {
        return res.status(404).json({ error: "Evento não encontrado" });
      }

      return res.status(200).json(evento);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ error: " Erro ao obter o evento " });
    }
  }

  // Deletar o evento
  static async deletar_evento(req, res) {
    const { id } = req.params;

    try {
      // verificar se evento existe
      const evento = await prisma.evento.findUnique({
        where: { id },
        include: { carro: true, motorista: true },
      });

      if (!evento) {
        return res.status(404).json({ erro: "Evento não encontrado " });
      }

      // Bloquear exclusão se o evento já foi concluido
      if (evento.dataEntrada || evento.status === StatusEvento.CONCLUIDO) {
        return res
          .status(400)
          .json({ error: "Não é possível excluir um evento concluído " });
      }

      // excluir o evento
      await prisma.evento.delete({ where: { id } });

      // Liberar o carro e o motorista
      await prisma.carro.update({
        where: { id: evento.carroId },
        data: { disponivel: true },
      });

      await prisma.motorista.update({
        where: { id: evento.motoristaId },
        data: { disponivel: true },
      });

      return res.status(200).json({ message: "Evento deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar evento: ", error);
      return res
        .status(500)
        .json({ error: "Erro ao deletar evento", details: error.message });
    }
  }

  // Cancelar evento (independente do status)
  static async cancelar_evento(req, res) {
    const { id } = req.params;
    const { motivoCancelamento } = req.body;

    try {
      // Verificar se o evento existe
      const evento = await prisma.evento.findUnique({
        where: { id },
        include: {
          carro: true,
          motorista: true,
          pagamentos: true
        },
      });

      if (!evento) {
        return res.status(404).json({ error: "Evento não encontrado" });
      }

      // Atualizar o status do evento para CANCELADO
      const eventoCancelado = await prisma.evento.update({
        where: { id },
        data: {
          status: StatusEvento.CANCELADO,
          motivoCancelamento: motivoCancelamento || "Cancelado pelo usuário"
        },
      });

      // Se o evento tinha pagamentos associados, atualizá-los para CANCELADO
      if (evento.pagamentos && evento.pagamentos.length > 0) {
        for (const pagamento of evento.pagamentos) {
          await prisma.pagamento.update({
            where: { id: pagamento.id },
            data: { statusPagamento: StatusPagamento.CANCELADO },
          });
        }
      }

      // Liberar o carro e o motorista se o evento estiver PENDENTE
      if (evento.status === StatusEvento.PENDENTE) {
        await prisma.carro.update({
          where: { id: evento.carroId },
          data: { disponivel: true },
        });

        await prisma.motorista.update({
          where: { id: evento.motoristaId },
          data: { disponivel: true },
        });
      }

      return res.status(200).json({
        message: "Evento cancelado com sucesso",
        evento: eventoCancelado
      });
    } catch (error) {
      console.error("Erro ao cancelar evento:", error);
      return res
        .status(500)
        .json({ error: "Erro ao cancelar evento", details: error.message });
    }
  }

  // Obter eventos por carro
  static async obter_eventos_por_carro(req, res) {
    const { id } = req.params;
    const { dataInicial, dataFinal } = req.query;

    try {
      // Verificar se o carro existe
      const carro = await prisma.carro.findUnique({
        where: { id },
      });

      if (!carro) {
        return res.status(404).json({ error: "Carro não encontrado" });
      }

      // Montar o filtro de data
      let dateFilter = {};
      if (dataInicial) {
        dateFilter.dataSaida = { gte: new Date(dataInicial) };
      }
      if (dataFinal) {
        dateFilter.dataSaida = {
          ...dateFilter.dataSaida,
          lte: new Date(dataFinal)
        };
      }

      // Buscar eventos do carro com filtro de data
      const eventos = await prisma.evento.findMany({
        where: {
          carroId: id,
          ...dateFilter
        },
        include: {
          motorista: {
            select: {
              id: true,
              nome: true,
              cpf: true,
              telefone: true
            }
          },
          pagamentos: {
            select: {
              id: true,
              valor: true,
              data: true,
              metodoPagamento: true,
              statusPagamento: true
            }
          },
          gestor: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          dataSaida: 'desc'
        }
      });

      // Adicionar informações adicionais para cada evento
      const eventosProcessados = eventos.map(evento => {
        // Calcular a distância percorrida (se disponível)
        let distanciaPercorrida = null;
        if (evento.odometroInicial !== null && evento.odometroFinal !== null) {
          distanciaPercorrida = evento.odometroFinal - evento.odometroInicial;
        }

        // Calcular a duração do evento (se disponível)
        let duracaoHoras = null;
        if (evento.dataSaida && evento.dataEntrada) {
          const diffMs = new Date(evento.dataEntrada) - new Date(evento.dataSaida);
          duracaoHoras = Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10; // Arredonda para 1 casa decimal
        }

        // Calcular o valor total dos pagamentos
        const valorTotalPagamentos = evento.pagamentos.reduce((total, pagamento) => {
          return total + (pagamento.statusPagamento === 'PAGO' ? pagamento.valor : 0);
        }, 0);

        return {
          ...evento,
          distanciaPercorrida,
          duracaoHoras,
          valorTotalPagamentos
        };
      });

      // Calcular estatísticas
      const totalEventos = eventos.length;
      const eventosFinalizados = eventos.filter(e => e.status === 'CONCLUIDO').length;
      const eventosCancelados = eventos.filter(e => e.status === 'CANCELADO').length;
      const eventosPendentes = eventos.filter(e => e.status === 'PENDENTE').length;

      // Calcular estatísticas adicionais
      const distanciaTotal = eventosProcessados.reduce((total, evento) => {
        return total + (evento.distanciaPercorrida || 0);
      }, 0);

      const valorTotalArrecadado = eventosProcessados.reduce((total, evento) => {
        return total + evento.valorTotalPagamentos;
      }, 0);

      return res.status(200).json({
        eventos: eventosProcessados,
        estatisticas: {
          total: totalEventos,
          concluidos: eventosFinalizados,
          cancelados: eventosCancelados,
          pendentes: eventosPendentes,
          distanciaTotal,
          valorTotalArrecadado
        }
      });
    } catch (error) {
      console.error("Erro ao obter eventos do carro:", error);
      return res.status(500).json({ error: "Erro ao obter eventos do carro" });
    }
  }

  // Obter eventos por motorista
  static async obter_eventos_por_motorista(req, res) {
    const { id } = req.params;
    const { dataInicial, dataFinal } = req.query;

    try {
      // Verificar se o motorista existe
      const motorista = await prisma.motorista.findUnique({
        where: { id },
      });

      if (!motorista) {
        return res.status(404).json({ error: "Motorista não encontrado" });
      }

      // Montar o filtro de data
      let dateFilter = {};
      if (dataInicial) {
        dateFilter.dataSaida = { gte: new Date(dataInicial) };
      }
      if (dataFinal) {
        dateFilter.dataSaida = {
          ...dateFilter.dataSaida,
          lte: new Date(dataFinal)
        };
      }

      // Buscar eventos do motorista com filtro de data
      const eventos = await prisma.evento.findMany({
        where: {
          motoristaId: id,
          ...dateFilter
        },
        include: {
          carro: true,
          pagamentos: true,
        },
        orderBy: {
          dataSaida: 'desc'
        }
      });

      // Calcular estatísticas
      const totalEventos = eventos.length;
      const eventosFinalizados = eventos.filter(e => e.status === 'CONCLUIDO').length;
      const eventosCancelados = eventos.filter(e => e.status === 'CANCELADO').length;
      const eventosPendentes = eventos.filter(e => e.status === 'PENDENTE').length;

      return res.status(200).json({
        eventos,
        estatisticas: {
          total: totalEventos,
          concluidos: eventosFinalizados,
          cancelados: eventosCancelados,
          pendentes: eventosPendentes
        }
      });
    } catch (error) {
      console.error("Erro ao obter eventos do motorista:", error);
      return res.status(500).json({ error: "Erro ao obter eventos do motorista" });
    }
  }

  // Verificar todos os status de eventos no banco
  static async verificar_status_eventos(req, res) {
    try {
      // Buscar todos os eventos
      const eventos = await prisma.evento.findMany({
        select: {
          id: true,
          status: true
        }
      });

      // Agrupar por status
      const statusCount = {};
      eventos.forEach(evento => {
        if (!statusCount[evento.status]) {
          statusCount[evento.status] = 0;
        }
        statusCount[evento.status]++;
      });

      return res.status(200).json({
        total: eventos.length,
        countByStatus: statusCount,
        eventos: eventos
      });
    } catch (error) {
      console.error("Erro ao verificar status dos eventos:", error);
      return res.status(500).json({ error: "Erro ao verificar status", details: error.message });
    }
  }
}

module.exports = EventoController;
