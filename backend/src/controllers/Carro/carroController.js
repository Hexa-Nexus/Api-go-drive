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
}

module.exports = CarroController;
