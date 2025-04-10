// controllers/pagamentoController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { formasPermitidas, validarMetodoPagamento, statusPagamento, validarStatusPagamento} = require('./validadorPagamentos');

class PagamentoController {
  // Criando um novo pagamento
  static async criandoPagamento(req, res) {
    const {
      valor,
      data,
      metodoPagamento,
      statusPagamento,
      gestorId,
      eventoId,
      relatorioId, // Opcional
    } = req.body;

    try {

      // Valida o método de pagamento
  if (!validarMetodoPagamento(metodoPagamento)) {
    return res.status(400).json({ error: "Método de pagamento inválido!" });
  }
  
  if(!validarStatusPagamento(statusPagamento)) {
    return res.status(400).json({error: "Status de pagamento inválido"})
  }


      // Verifica se o gestor existe
      const gestor = await prisma.gestor.findUnique({
        where: { id: gestorId },
      });

      if (!gestor) {
        return res.status(400).json({ error: "Gestor não encontrado!" });
      }

      // Verifica se o evento existe
      const evento = await prisma.evento.findUnique({
        where: { id: eventoId },
      });

      if (!evento) {
        return res.status(400).json({ error: "Evento não encontrado!" });
      }

      

      // Cria o pagamento
      const novoPagamento = await prisma.pagamento.create({
        data: {
          valor,
          data: new Date(data),
          metodoPagamento,
          statusPagamento,
          gestorId,
          eventoId,
          relatorioId: relatorioId || null, // se não existir, seta como null
        },
      });

      return res.status(201).json(novoPagamento);
    } catch (error) {
      console.error("Erro ao criar o pagamento!", error);
      return res.status(500).json({
        error: "Erro ao criar o pagamento!",
        details: error.message,
      });
    }
  }


  static async listarPagamentos(req, res) {
    try {
      const pagamentos = await prisma.pagamento.findMany();
      return res.json(pagamentos);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar pagamentos" });
    }
  }

  static async buscarPagamentoPorId(req, res) {
    const { id } = req.params;
    try {
      const pagamento = await prisma.pagamento.findUnique({ where: { id } });
      if (!pagamento) return res.status(404).json({ error: "Pagamento não encontrado" });
      return res.json(pagamento);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar pagamento" });
    }
  }


  static async editarPagamento(req, res) {
    const { id } = req.params;
    const {
      valor,
      data,
      metodoPagamento,
      statusPagamento,
      gestorId,
      eventoId,
      relatorioId,
    } = req.body;
  
    try {
      // Verifica se o pagamento existe
      const pagamentoExistente = await prisma.pagamento.findUnique({
        where: { id },
      });
  
      if (!pagamentoExistente) {
        return res.status(404).json({ error: "Pagamento não encontrado" });
      }
  
      // Valida o método de pagamento, se informado
      if (metodoPagamento && !validarMetodoPagamento(metodoPagamento)) {
        return res.status(400).json({ error: "Método de pagamento inválido!" });
      }
  
      // Valida o status de pagamento, se informado
      if (statusPagamento && !validarStatusPagamento(statusPagamento)) {
        return res.status(400).json({ error: "Status de pagamento inválido!" });
      }
  
      // Verifica se o gestor existe, se gestorId for informado
      if (gestorId) {
        const gestor = await prisma.gestor.findUnique({
          where: { id: gestorId },
        });
  
        if (!gestor) {
          return res.status(400).json({ error: "Gestor não encontrado!" });
        }
      }
  
      // Verifica se o evento existe, se eventoId for informado
      if (eventoId) {
        const evento = await prisma.evento.findUnique({
          where: { id: eventoId },
        });
  
        if (!evento) {
          return res.status(400).json({ error: "Evento não encontrado!" });
        }
      }
  
      // Monta o objeto com os campos que realmente foram enviados
      const dadosAtualizados = {};
  
      if (valor !== undefined) dadosAtualizados.valor = valor;
      if (data) dadosAtualizados.data = new Date(data);
      if (metodoPagamento) dadosAtualizados.metodoPagamento = metodoPagamento;
      if (statusPagamento) dadosAtualizados.statusPagamento = statusPagamento;
      if (gestorId) dadosAtualizados.gestorId = gestorId;
      if (eventoId) dadosAtualizados.eventoId = eventoId;
      dadosAtualizados.relatorioId = relatorioId || null; // mesmo se undefined, seta como null
  
      // Atualiza o pagamento
      const pagamentoAtualizado = await prisma.pagamento.update({
        where: { id },
        data: dadosAtualizados,
      });
  
      return res.status(200).json(pagamentoAtualizado);
    } catch (error) {
      console.error("Erro ao editar Pagamento:", error);
      return res.status(400).json({
        error: "Erro ao editar pagamento",
        details: error.message,
      });
    }
  }
  

  static async deletarPagamento(req, res) {
    const { id } = req.params;
    try {
      const pagamento = await prisma.pagamento.findUnique({ where: { id } });
      if (!pagamento) return res.status(404).json({ error: "Pagamento não encontrado" });

      await prisma.pagamento.delete({ where: { id } });
      return res.json({ mensagem: "Pagamento deletado com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao deletar pagamento" });
    }
  }
}




module.exports = PagamentoController;