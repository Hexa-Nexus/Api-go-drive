export const PagamentoGetByIdDocs = {
  /**
   * @swagger
   * /pagamentos/{id}:
   *   put:
   *     summary: Atualiza um pagamento pelo ID
   *     tags: [Pagamentos]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do pagamento
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               valor:
   *                 type: number
   *                 description: Valor do pagamento
   *               data:
   *                 type: string
   *                 format: date
   *                 description: Data do pagamento
   *               metodoPagamento:
   *                 type: string
   *                 description: Método de pagamento
   *               statusPagamento:
   *                 type: string
   *                 description: Status do pagamento
   *               gestorId:
   *                 type: string
   *                 description: ID do gestor responsável
   *               eventoId:
   *                 type: string
   *                 description: ID do evento relacionado
   *               relatorioId:
   *                 type: string
   *                 description: ID do relatório relacionado
   *     responses:
   *       200:
   *         description: Pagamento atualizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Pagamento'
   *       400:
   *         description: Dados inválidos
   *       404:
   *         description: Pagamento não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
};
