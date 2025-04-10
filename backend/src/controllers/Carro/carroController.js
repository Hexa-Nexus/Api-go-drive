const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class CarroController {
  // Criando um novo carro
  static async criandoCarro(req, res) {
    const {
      modelo,
      marca,
      ano,
      cor,
      placa,
      odometroAtual,
      disponivel,
      gestorId,
    } = req.body;

    try {
      // Valida se o gestorId é válido
      const gestor = await prisma.gestor.findUnique({
        where: { id: gestorId },
      });

      if (!gestor) {
        return res.status(400).json({ error: "Gestor não encontrado!" });
      }

      // Buscando o carro pela placa (use findFirst para campos não únicos)
      const carro = await prisma.carro.findFirst({
        where: { placa: placa }, // Busca o carro pela placa
      });

      if (carro) {
        return res.status(400).json({ error: "Veículo já cadastrado!" });
      }

      const novoCarro = await prisma.carro.create({
        data: {
          modelo,
          marca,
          ano,
          cor,
          placa,
          odometroAtual,
          disponivel,
          gestorId: gestorId, // Não precisa de 'connect' se você está apenas passando o ID diretamente
        },
      });
      return res.status(201).json(novoCarro);
    } catch (error) {
      console.error("Erro ao criar um novo carro!", error);
      return res
        .status(500)
        .json({ error: "Erro ao criar o Carro!", details: error.message });
    }
  }

  // Obter todos os carros
  static async obter_todos_carros(req, res) {
    try {
      const carros = await prisma.carro.findMany({
        include: {
          eventos: true,
        },
      });
      return res.status(200).json(carros);
    } catch (error) {
      console.error("Erro ao obter os carros:", error);
      return res.status(500).json({ error: "Erro ao obter os carros" });
    }
  }

  // obter carro por id
  static async obter_carro_por_id(req, res) {
    const { id } = req.params;

    try {
      const carro = await prisma.carro.findUnique({
        where: { id },
        select: {
          modelo: true,
          marca: true,
          ano: true,
          cor: true,
          placa: true,
          disponivel: true,
          odometroAtual: true,
        },
      });

      if (!carro) {
        return res.status(404).json({ error: "carro não encontrado" });
      }

      return res.status(200).json(carro);
    } catch (error) {
      console.error("Erro ao obter o carro:", error); // Log para ver o erro exato
      return res.status(500).json({ error: "Erro ao obter o carro" });
    }
  }

  //  Buscar carro por modelo
  static async buscar_por_modelo(req, res) {
    const { modelo } = req.params;
    try {
      const carros = await prisma.carro.findMany({
        where: {
          modelo: {
            contains: modelo,
          },
        },
        include: { eventos: true },
      });

      if (carros.length === 0) {
        return res
          .status(404)
          .json({ error: "Nenhum carro encontrado com esse modelo" });
      }
      return res.status(200).json(carros);
    } catch (error) {
      console.error("Erro ao buscar carro por modelo:", error);
      return res.status(500).json({ error: "Erro ao buscar carro por modelo" });
    }
  }

  // Obter carro por placa
  static async buscar_por_placa(req, res) {
    const { placa } = req.params;
    try {
      const carros = await prisma.carro.findMany({
        where: {
          placa: {
            contains: placa, // ou equals: placa (se quiser exato)
          },
        },
        include: { eventos: true },
      });

      // Normaliza para comparar ignorando maiúsculas/minúsculas
      const carro = carros.find(
        (c) => c.placa.toLowerCase() === placa.toLowerCase()
      );

      if (!carro) {
        return res
          .status(404)
          .json({ error: "Carro não encontrado pela placa" });
      }

      return res.status(200).json(carro);
    } catch (error) {
      console.error("Erro ao buscar carro por placa:", error);
      return res.status(500).json({ error: "Erro ao buscar carro por placa" });
    }
  }

  // Update no carro
  static async atualizar_carro(req, res) {
    const { modelo, marca, ano, cor, placa, disponivel, odometroAtual } =
      req.body;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "carroId é obrigatório" });
    }

    try {
      // Verificar se o carro existe
      const carroExistente = await prisma.carro.findUnique({
        where: { id: id },
      });

      if (!carroExistente) {
        return res.status(404).json({ error: "Carro não encontrado" });
      }

      // Atualizar os dados do carro
      const carroAtualizado = await prisma.carro.update({
        where: { id: id },
        data: {
          modelo,
          marca,
          ano,
          cor,
          placa,
          disponivel,
          odometroAtual,
        },
      });

      return res.status(200).json(carroAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar o carro:", error);
      return res.status(500).json({ error: "Erro ao atualizar o carro" });
    }
  }

  // Deletar o carro
  static async deletar_carro(req, res) {
    const { id } = req.params;

    try {
      // Verificar se o carro existe no banco de dados
      const carro = await prisma.carro.findUnique({
        where: { id },
      });

      if (!carro) {
        return res.status(404).json({ error: "carro não encontrado" });
      }

      // Deletar o carro do banco de dados
      await prisma.carro.delete({
        where: { id },
      });

      // Retornar sucesso após deleção
      return res.status(200).json({ message: "carro deletado com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar carro: ", error);
      return res.status(500).json({
        error: "Erro ao deletar carro",
        details: error.message,
      });
    }
  }
}
module.exports = CarroController;
