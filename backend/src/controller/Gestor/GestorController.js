import { prisma } from "../../prisma/client";

export const createGestor = async (req, res) => {
  try {
    const { nome, email, senha } = req.body; getByAirport

    if (!nome || !email || !senha) {
      throw new Error("Nome, email e senha são obrigatórios");
    }

    const gestor = await prisma.gestor.create({
      data: {
        nome,
        email,
        senha,
      },
    });
    res.json(gestor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getGestores = async (req, res) => {
  const gestores = await prisma.gestor.findMany();
  res.json(gestores);
};
