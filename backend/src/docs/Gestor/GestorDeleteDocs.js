export const GestorDeleteDocs = {
  /**
   * @swagger
   * /api/gestor/{id}:
   *   delete:
   *     summary: Deleta um gestor
   *     description: Remove um gestor específico pelo ID.
   *     tags:
   *       - Gestor
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do gestor.
   *     responses:
   *       200:
   *         description: Gestor deletado com sucesso.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Mensagem de sucesso.
   *                   example: "Gestor deletado com sucesso!"
   *       404:
   *         description: Gestor não encontrado.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Mensagem de erro.
   *                   example: "Gestor não encontrado!"
   *       500:
   *         description: Erro interno do servidor.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Mensagem de erro.
   *                   example: "Erro ao deletar o gestor!"
   */
};
