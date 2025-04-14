export const EventoGetByIdDocs = {
  /**
   * @swagger
   * /api/evento/{id}:
   *   get:
   *     summary: Busca um evento pelo ID
   *     description: Retorna os dados de um evento específico pelo ID.
   *     tags:
   *       - Evento
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do evento
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Evento encontrado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   description: ID do evento
   *                 tipoEvento:
   *                   type: string
   *                   enum: [SAIDA, ENTRADA]
   *                 status:
   *                   type: string
   *                   enum: [PENDENTE, CONCLUIDO, CANCELADO]
   *                 dataSaida:
   *                   type: string
   *                   format: date-time
   *                 dataEntrada:
   *                   type: string
   *                   format: date-time
   *                 odometroInicial:
   *                   type: integer
   *                 odometroFinal:
   *                   type: integer
   *                 carro:
   *                   type: object
   *                 gestor:
   *                   type: object
   *                 motorista:
   *                   type: object
   *                 pagamentos:
   *                   type: array
   *                   items:
   *                     type: object
   *       404:
   *         description: Evento não encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Evento não encontrado"
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Erro ao obter o evento"
   */
};