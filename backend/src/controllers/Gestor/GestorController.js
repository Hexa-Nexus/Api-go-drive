const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const { validarCPF, validarEmail } = require("./validadorGestor");
const jwt = require("jsonwebtoken");

class GestorController {
  // criando um novo gestor
  static async criandoGestor(req, res) {
    //criptografando a senha:
    const senhaHash = await bcrypt.hash(req.body.password, 10);
    req.body.password = senhaHash;

    const { name, cpf, email, password } = req.body;

    try {
      // Verificando se Cpf é válido
      if (!validarCPF(cpf)) {
        return res.status(400).json({ error: "CPF inválido." });
      }

      // Verificando de o formato do email é válido
      if (!validarEmail(email)) {
        return res.status(400).json({ error: "Email inválido" });
      }

      // validando o CPF do gestor
      const gestorCpf = await prisma.gestor.findFirst({
        where: { cpf: cpf },
      });

      if (gestorCpf) {
        return res.status(400).json({ error: "Gestor com CPF já existente!" });
      }

      //Validando o EMAIL do gestor
      const gestorEmail = await prisma.gestor.findFirst({
        where: { email: email },
      });

      if (gestorEmail) {
        return res.status(400).json({ error: "Email já existente!" });
      }

      const novoGestor = await prisma.gestor.create({
        data: {
          name,
          cpf,
          email,
          password,
        },
      });
      return res.status(201).json(novoGestor);
    } catch (error) {
      console.error("Erro ao criar um novo gestor!", error);
      return res
        .status(500)
        .json({ error: "Erro ao criar o gestor!", details: error.message });
    }
  }

  // Login do gestor
  static async loginGestor(req, res) {
    const { email, password } = req.body;

    try {
      // Verifica se o email existe no banco de dados
      const gestor = await prisma.gestor.findUnique({
        where: { email },
      });

      if (!gestor) {
        return res.status(404).json({ error: "Email não encontrado!" });
      }

      // Verifica se a senha está correta
      const senhaValida = await bcrypt.compare(password, gestor.password);
      if (!senhaValida) {
        return res.status(401).json({ error: "Senha incorreta!" });
      }

      // Gera um token JWT
      const token = jwt.sign(
        { id: gestor.id, email: gestor.email },
        process.env.JWT_SECRET || "secreta",
        { expiresIn: "12h" }
      );

      // Retorne também o id e o nome do gestor
      return res.status(200).json({
        message: "Login realizado com sucesso!",
        token,
        id: gestor.id,
        name: gestor.name, // ou gestor.nome se o campo for nome
      });
    } catch (error) {
      console.error("Erro ao realizar login!", error);
      return res
        .status(500)
        .json({ error: "Erro ao realizar login!", details: error.message });
    }
  }

  //Buscando todos gestores
  static async buscarGestores(req, res) {
    try {
      const gestores = await prisma.gestor.findMany();

      return res.status(200).json(gestores);
    } catch (error) {
      console.error("Erro ao buscar Getores!", error);

      return res.status(500).json({
        error: "Erro ao buscar os gestores! ",
        details: error.message,
      });
    }
  }

  // Buscar gestor
  static async buscarGestorId(req, res) {
    const { id } = req.params;

    try {
      const gestor = await prisma.gestor.findUnique({
        where: { id },
      });

      // verificando se gestor existe!
      if (!gestor) {
        return res.status(404).json({ error: "Gestor não encontrado!" });
      }

      return res.status(200).json(gestor);
    } catch (error) {
      console.error("Erro ao buscar gestor!", error);

      return res
        .status(500)
        .json({ error: "Erro ao buscar Gestor! ", details: error.message });
    }
  }

  // Buscar gestor por CPF
  static async buscarGestorPorCPF(req, res) {
    const { cpf } = req.params;

    try {
      const gestor = await prisma.gestor.findUnique({
        where: { cpf },
      });

      if (!gestor) {
        return res
          .status(404)
          .json({ error: "Gestor com CPF não encontrado!" });
      }

      return res.status(200).json(gestor);
    } catch (error) {
      console.error("Erro ao buscar gestor por CPF!", error);

      return res
        .status(500)
        .json({
          error: "Erro ao buscar gestor por CPF!",
          details: error.message,
        });
    }
  }

  // editar gestor
  static async editarGestor(req, res) {
    const { id } = req.params;
    const { name, cpf, email, password } = req.body;

    try {
      const gestorExistente = await prisma.gestor.findUnique({
        where: { id },
      });

      // Verificando se CPF é válido
      if (!validarCPF(cpf)) {
        return res.status(400).json({ error: "CPF inválido." });
      }

      // Verificando de o formato do email é válido
      if (!validarEmail(email)) {
        return res.status(400).json({ error: "Email inválido" });
      }

      if (!gestorExistente) {
        return res.status(404).json({ error: "Gestor não encontrado" });
      }

      // Verifica se o CPF já existe no banco de dados
      if (cpf && cpf !== gestorExistente.cpf) {
        const cpfEmUso = await prisma.gestor.findFirst({
          where: {
            cpf,
            NOT: { id },
          },
        });

        if (cpfEmUso) {
          return res
            .status(400)
            .json({ error: "CPF já está em uso por outro gestor!" });
        }
      }

      // Verifica se o novo e-mail já está em uso
      if (email && email !== gestorExistente.email) {
        const emailJaUsado = await prisma.gestor.findFirst({
          where: {
            email,
            NOT: { id },
          },
        });

        if (emailJaUsado) {
          return res
            .status(400)
            .json({ error: "E-mail já está em uso por outro gestor!" });
        }
      }

      // Atualizar apenas os campos fornecidos
      const dadosAtualizados = {};

      if (name) dadosAtualizados.name = name;
      if (cpf) dadosAtualizados.cpf = cpf;
      if (email) dadosAtualizados.email = email;

      if (password && password.trim() !== "") {
        const senhaHash = await bcrypt.hash(password, 10);
        dadosAtualizados.password = senhaHash;
      }

      const gestorAtualizado = await prisma.gestor.update({
        where: { id },
        data: dadosAtualizados,
      });

      return res.status(200).json(gestorAtualizado);
    } catch (error) {
      console.error("Erro ao editar Gestor:", error);
      return res
        .status(400)
        .json({ error: "Erro ao editar gestor", details: error.message });
    }
  }

  // Deletar Gestor
  static async deletarGestor(req, res) {
    let { id } = req.params;

    try {
      const gestorExistente = await prisma.gestor.findUnique({
        where: { id },
      });

      if (!gestorExistente) {
        return res.status(404).json({ error: "Gestor não encontrado!" });
      }

      await prisma.gestor.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Gestor deletado com sucesso!" });
    } catch (error) {
      console.error("Erro ao Deletar Gestor ", error);

      return res
        .status(500)
        .json({ error: "Erro ao deletar Gestor", details: error.message });
    }
  }
}

module.exports = GestorController;
