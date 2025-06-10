const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class RelatorioController {
  // GET /api/relatorios/completo
  static async getRelatorioCompleto(req, res) {
    try {
      // Busca todos os gestores e inclui motoristas, carros, eventos e pagamentos vinculados
      const gestores = await prisma.gestor.findMany({
        include: {
          motoristas: true,
          carros: true,
          pagamentos: {
            include: {
              evento: {
                include: {
                  carro: true,
                  motorista: true,
                  gestor: true
                }
              }
            }
          },
          eventos: {
            include: {
              carro: true,
              motorista: true
            }
          }
        }
      });

      // Monta o relatório agrupado por gestor
      const relatorio = gestores.map(gestor => ({
        gestor: {
          id: gestor.id,
          nome: gestor.name,
          email: gestor.email,
          cpf: gestor.cpf
        },
        motoristas: gestor.motoristas,
        carros: gestor.carros,
        eventos: gestor.eventos,
        pagamentos: gestor.pagamentos
      }));

      return res.status(200).json(relatorio);
    } catch (error) {
      console.error("Erro ao gerar relatório completo:", error);
      return res.status(500).json({ error: "Erro ao gerar relatório completo" });
    }
  }
}

module.exports = RelatorioController;
