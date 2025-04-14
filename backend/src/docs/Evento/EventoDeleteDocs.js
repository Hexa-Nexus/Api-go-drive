export const EventoDeleteDocs = {
  /**
   * @swagger
   * /api/evento/{id}:
   *   delete:
   *     summary: Deleta um evento
   *     description: Remove um evento específico pelo ID
   *     tags:
   *       - Evento
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do evento a ser deletado
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Evento deletado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 mensagem:
   *                   type: string
   *                   example: "Evento deletado com sucesso"
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
   *                   example: "Erro ao deletar evento"
   */
};