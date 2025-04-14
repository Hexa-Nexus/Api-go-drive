export const EventoGetDocs = {
  /**
   * @swagger
   * /api/eventos:
   *   get:
   *     summary: Lista todos os eventos
   *     description: Retorna uma lista de todos os eventos cadastrados no sistema.
   *     tags:
   *       - Evento
   *     responses:
   *       200:
   *         description: Lista de eventos retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     description: ID do evento
   *                   tipoEvento:
   *                     type: string
   *                     enum: [SAIDA, ENTRADA]
   *                   status:
   *                     type: string
   *                     enum: [PENDENTE, CONCLUIDO, CANCELADO]
   *                   dataSaida:
   *                     type: string
   *                     format: date-time
   *                   dataEntrada:
   *                     type: string
   *                     format: date-time
   *                   odometroInicial:
   *                     type: integer
   *                   odometroFinal:
   *                     type: integer
   *                   carroId:
   *                     type: string
   *                   gestorId:
   *                     type: string
   *                   motoristaId:
   *                     type: string
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