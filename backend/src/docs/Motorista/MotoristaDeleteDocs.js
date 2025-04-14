export const MotoristaDeleteDocs = {
  /**
   * @swagger
   * /api/motorista/{id}:
   *   delete:
   *     summary: Deleta um motorista pelo ID
   *     tags:
   *       - Motorista
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do motorista
   *     responses:
   *       200:
   *         description: Motorista deletado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Motorista deletado com sucesso"
   *       404:
   *         description: Motorista não encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Motorista não encontrado"
   *       500:
   *         description: Erro ao deletar motorista
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Erro ao deletar motorista"
   */
};