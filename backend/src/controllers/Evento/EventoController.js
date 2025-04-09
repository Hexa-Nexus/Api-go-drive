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
  static async obeter_todos_eventos(req, res) {
    try {
      const eventos = await prisma.evento.findMany({
        include: {
          carro: true,
          gestor: true,
          motorista: true,
          pagamentos: true,
          relatorio: true,
        },
      });
      return res.status(200).json(eventos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: " Erro ao obter o evento " });
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
          status: StatusEvento.CONCLUIDO, // Usando o enum StatusEvento
          odometroFinal,
          dataEntrada: new Date(),
          pagamentos: { connect: { id: pagamento.id } },
        },
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
        evento: eventoConcluido,
        relatorio: relatorioCriado,
        pagamento,
      });
    } catch (error) {
      console.error("Erro ao concluir o evento", error);
      return res
        .status(500)
        .json({ error: "Erro ao concluir evento", details: error.message });
    }
  }

  // Obter um evento por id
  static async obert_evento_por_id(req, res) {
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
      if (evento.dataEntrada) {
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
}

module.exports = EventoController;
