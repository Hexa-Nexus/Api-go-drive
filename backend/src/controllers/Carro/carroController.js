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

      // Validação da placa do carro
      // Formato padrão brasileiro: ABC1234 ou ABC1D23 (Mercosul)
      const placaRegexAntiga = /^[A-Z]{3}[0-9]{4}$/;
      const placaRegexMercosul = /^[A-Z]{3}[0-9]{1}[A-Z]{1}[0-9]{2}$/;

      if (!placaRegexAntiga.test(placa) && !placaRegexMercosul.test(placa)) {
        return res.status(400).json({
          error: "Formato de placa inválido! Use o formato ABC1234 (padrão antigo) ou ABC1D23 (padrão Mercosul)."
        });
      }

      // Validar que o odômetro não seja negativo
      if (odometroAtual < 0) {
        return res.status(400).json({
          error: "O valor do odômetro não pode ser negativo."
        });
      }

      // Buscando o carro pela placa (use findFirst para campos não únicos)
      const carro = await prisma.carro.findFirst({
        where: { placa: placa }, // Busca o carro pela placa
      });

      if (carro) {
        return res.status(400).json({ error: "Essa placa já está em uso!" });
      }

      const novoCarro = await prisma.carro.create({
        data: {
          modelo,
          marca,
          ano,
          cor,
          placa: placa.toUpperCase(), // Garantir que a placa seja salva em maiúsculas
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
          id: true, // Adicione esta linha
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
      console.error("Erro ao obter o carro:", error);
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
    const { id } = req.params;
    // Note que não extraímos "placa" dos dados enviados, pois ela não pode ser alterada
    const { modelo, marca, ano, cor, odometroAtual, disponivel } = req.body;

    try {
      // Verifica se o carro existe
      const carroExistente = await prisma.carro.findUnique({
        where: { id },
        include: {
          eventos: {
            where: {
              status: 'PENDENTE'
            }
          }
        }
      });

      if (!carroExistente) {
        return res.status(404).json({ error: "Carro não encontrado" });
      }

      // Validar que o odômetro não seja negativo
      if (odometroAtual < 0) {
        return res.status(400).json({
          error: "O valor do odômetro não pode ser negativo."
        });
      }

      // Verifica se já existe outro carro com a mesma placa (excluindo o carro que está sendo atualizado)
      const carroComMesmaPlaca = await prisma.carro.findFirst({
        where: {
          placa: carroExistente.placa,
          NOT: { id },
        },
      });

      if (carroComMesmaPlaca) {
        return res.status(400).json({ error: "Essa placa já está em uso!" });
      }

      // Verifica se tem eventos pendentes e está tentando mudar disponibilidade
      if (carroExistente.eventos.length > 0 && disponivel !== undefined && disponivel !== carroExistente.disponivel) {
        return res.status(400).json({
          error: "Não é possível alterar a disponibilidade do carro enquanto ele estiver em um evento ativo",
          eventoAtivo: carroExistente.eventos[0].id
        });
      }

      // Realiza a atualização (não alterando a placa)
      const carroAtualizado = await prisma.carro.update({
        where: { id },
        data: {
          modelo,
          marca,
          ano,
          cor,
          odometroAtual,
          disponivel,
        },
      });
      return res.status(200).json(carroAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar carro:", error);
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
