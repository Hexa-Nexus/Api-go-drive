export const PagamentoPutDocs = {
  /**
   * @swagger
   * /api/pagamentos/{id}:
   *   get:
   *     summary: Busca um pagamento pelo ID
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
   *     responses:
   *       200:
   *         description: Detalhes do pagamento
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Pagamento'
   *       404:
   *         description: Pagamento não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
};
