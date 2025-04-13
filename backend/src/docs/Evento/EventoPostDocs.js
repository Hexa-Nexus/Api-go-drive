export const EventoPostDocs = {
  /**
   * @swagger
   * /api/evento:
   *   post:
   *     summary: Cria um novo evento
   *     description: Cria um novo evento de saída de veículo com status pendente.
   *     tags:
   *       - Evento
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               carroId:
   *                 type: string
   *                 description: ID do carro
   *                 example: "550e8400-e29b-41d4-a716-446655440000"
   *               gestorId:
   *                 type: string
   *                 description: ID do gestor
   *                 example: "550e8400-e29b-41d4-a716-446655440001"
   *               motoristId:
   *                 type: string
   *                 description: ID do motorista
   *                 example: "550e8400-e29b-41d4-a716-446655440002"
   *               relatorioId:
   *                 type: string
   *                 description: ID do relatório (opcional)
   *                 example: "550e8400-e29b-41d4-a716-446655440003"
   *     responses:
   *       201:
   *         description: Evento criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 evento:
   *                   type: object
   *                 mensagem:
   *                   type: string
   *                   example: "Evento criado com status PENDENTE. Aguarde a atualização para finalizar."
   *       400:
   *         description: Dados inválidos ou recursos não encontrados
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Carro não encontrado"
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Erro ao criar evento"
   *                 details:
   *                   type: string
   */
};