export const GestorGetTodos = {
  /**
   * @swagger
   * /api/gestores:
   *   get:
   *     summary: Retorna todos os gestores
   *     description: Endpoint para buscar todos os gestores cadastrados no sistema.
   *     tags:
   *       - Gestor
   *     responses:
   *       200:
   *         description: Lista de gestores retornada com sucesso.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     description: ID único do gestor.
   *                     example: "123e4567-e89b-12d3-a456-426614174000"
   *                   name:
   *                     type: string
   *                     description: Nome do gestor.
   *                     example: "João Silva"
   *                   cpf:
   *                     type: string
   *                     description: CPF do gestor.
   *                     example: "123.456.789-00"
   *                   email:
   *                     type: string
   *                     description: Email do gestor.
   *                     example: "joao.silva@example.com"
   *       500:
   *         description: Erro interno ao buscar os gestores.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Mensagem de erro.
   *                   example: "Erro ao buscar os gestores!"
   */
};
