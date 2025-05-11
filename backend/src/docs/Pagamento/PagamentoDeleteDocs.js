export const PagamentoDeleteDocs = {
  /**
   * @swagger
   * /api/pagamentos/{id}:
   *   delete:
   *     summary: Deleta um pagamento pelo ID
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
   *         description: Pagamento deletado com sucesso
   *       404:
   *         description: Pagamento não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
};
