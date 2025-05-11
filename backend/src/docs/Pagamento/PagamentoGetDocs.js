export const PagamenGetDocs = {
  /**
   * @swagger
   * /api/pagamentos:
   *   get:
   *     summary: Lista todos os pagamentos
   *     tags: [Pagamentos]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de pagamentos
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Pagamento'
   *       500:
   *         description: Erro interno do servidor
   */
};
