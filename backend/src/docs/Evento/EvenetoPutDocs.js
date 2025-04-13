export const EventoPutDocs = {
  /**
   * @swagger
   * /api/evento:
   *   put:
   *     summary: Conclui um evento
   *     description: Atualiza um evento para status concluído, registra pagamento e gera relatório
   *     tags:
   *       - Evento
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - eventoId
   *               - odometroFinal
   *             properties:
   *               eventoId:
   *                 type: string
   *                 description: ID do evento a ser concluído
   *                 example: "550e8400-e29b-41d4-a716-446655440000"
   *               metodoPagamento:
   *                 type: string
   *                 enum: [DINHEIRO, CARTAO, PIX, BOLETO]
   *                 description: Método de pagamento
   *                 example: "CARTAO"
   *               odometroFinal:
   *                 type: integer
   *                 description: Quilometragem final do veículo
   *                 example: 15000
   *     responses:
   *       200:
   *         description: Evento concluído com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 evento:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     tipoEvento:
   *                       type: string
   *                       enum: [ENTRADA]
   *                     status:
   *                       type: string
   *                       enum: [CONCLUIDO]
   *                     dataEntrada:
   *                       type: string
   *                       format: date-time
   *                 relatorio:
   *                   type: object
   *                 pagamento:
   *                   type: object
   *       400:
   *         description: Dados inválidos ou evento não encontrado
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
   *                   example: "Erro ao concluir evento"
   *                 details:
   *                   type: string
   */
};