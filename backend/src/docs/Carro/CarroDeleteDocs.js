export const CarroDeleteDocs = {
  /**
   * @swagger
   * /api/carros/{id}:
   *   delete:
   *     summary: Remove um carro
   *     tags:
   *       - Carro
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Carro deletado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "carro deletado com sucesso"
   *       404:
   *         description: Carro não encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "carro não encontrado"
   *       500:
   *         description: Erro ao deletar carro
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                 details:
   *                   type: string
   */
};