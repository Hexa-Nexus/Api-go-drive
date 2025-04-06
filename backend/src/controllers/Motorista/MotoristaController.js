const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  validarCPF,
  validarHabilitacao,
  validarTelefone,
} = require("./validadorMotorista");

class MotoristaController {
  // Criando um motorista
  static async criar_motorista(req, res) {
    const { nome, telefone, cpf, habilitacao, gestorId } = req.body;

    try {
      // Validar CPF
      if (!validarCPF(cpf)) {
        return res.status(400).json({ error: "CPF inválido." });
      }

      // Validar Habilitação
      if (!validarHabilitacao(habilitacao)) {
        return res
          .status(400)
          .json({ error: "Número de habilitação inválido." });
      }

      // Validar Telefone
      if (!validarTelefone(telefone)) {
        return res.status(400).json({ error: "Telefone inválido." });
      }

      // Verificar se já existe um motorista com o mesmo CPF
      const motoristaExistente = await prisma.motorista.findUnique({
        where: { cpf: cpf },
      });

      if (motoristaExistente) {
        return res
          .status(400)
          .json({ error: "Já existe um motorista com esse CPF." });
      }

      // Verificar se já existe um motorista com a mesma habilitação
      const habilitacaoExistente = await prisma.motorista.findUnique({
        where: { habilitacao: habilitacao },
      });

      if (habilitacaoExistente) {
        return res
          .status(400)
          .json({ error: "Já existe um motorista com essa habilitação." });
      }

      // Verificar se o gestor existe
      const gestor = await prisma.gestor.findUnique({
        where: { id: gestorId },
      });

      if (!gestor) {
        return res.status(400).json({ error: "Gestor não encontrado." });
      }

      // Criar o novo motorista
      const novoMotorista = await prisma.motorista.create({
        data: {
          nome,
          telefone,
          cpf,
          habilitacao,
          gestorId, // Relacionamento com o gestor
        },
      });

      return res.status(201).json({
        motorista: novoMotorista,
        mensagem: "Motorista criado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao criar o motorista", error);
      return res
        .status(500)
        .json({ error: "Erro ao criar motorista", details: error.message });
    }
  }

  // Obter todos os motoristas
  static async obter_todos_motoristas(req, res) {
    try {
      const motoristas = await prisma.motorista.findMany({});

      return res.status(200).json(motoristas);
    } catch (error) {
      console.error("Erro ao obter os motoristas", error);
      return res.status(500).json({ error: "Erro ao obter motoristas" });
    }
  }

  // Obter um motorista por CPF
  static async obter_motorista_por_cpf(req, res) {
    const { cpf } = req.body;
    console.log("Recebendo CPF:", cpf);

    if (!cpf) {
      return res.status(400).json({ error: "CPF não fornecido" });
    }

    try {
      const motorista = await prisma.motorista.findUnique({
        where: { cpf },
        select: {
          id:true,
          nome: true,
          telefone: true,
          cpf: true,
          habilitacao: true,
          disponivel: true,
          gestorId: true
        },
      });

      if (!motorista) {
        return res.status(404).json({ error: "Motorista não encontrado" });
      }

      return res.status(200).json(motorista);
    } catch (error) {
      console.error("Erro ao obter o motorista:", error); // Log para ver o erro exato
      return res.status(500).json({ error: "Erro ao obter o motorista" });
    }
  }

  // Deletar o motorista
  static async deletar_motorista(req, res) {
    const { id } = req.params;

    try {
      // Verificar se o motorista existe no banco de dados
      const motorista = await prisma.motorista.findUnique({
        where: { id },
      });

      if (!motorista) {
        return res.status(404).json({ error: "Motorista não encontrado" });
      }

      // Deletar o motorista do banco de dados
      await prisma.motorista.delete({
        where: { id },
      });

      // Retornar sucesso após deleção
      return res
        .status(200)
        .json({ message: "Motorista deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar motorista: ", error);
      return res.status(500).json({
        error: "Erro ao deletar motorista",
        details: error.message,
      });
    }
  }
}

module.exports = MotoristaController;
