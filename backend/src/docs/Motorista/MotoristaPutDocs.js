export const MotoristaPutDocs = {
  /**
   * @swagger
   * /api/motorista/{id}:
   *   put:
   *     summary: Atualiza os dados de um motorista
   *     tags:
   *       - Motorista
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do motorista
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nome:
   *                 type: string
   *                 example: João Silva
   *               telefone:
   *                 type: string
   *                 example: "(11) 98765-4321"
   *               habilitacao:
   *                 type: string
   *                 example: "12345678901"
   *               disponivel:
   *                 type: boolean
   *                 example: true
   *     responses:
   *       200:
   *         description: Motorista atualizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 motorista:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "1"
   *                     nome:
   *                       type: string
   *                       example: João Silva
   *                     telefone:
   *                       type: string
   *                       example: "(11) 98765-4321"
   *                     habilitacao:
   *                       type: string
   *                       example: "12345678901"
   *                     disponivel:
   *                       type: boolean
   *                       example: true
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
   *         description: Erro ao atualizar motorista
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Erro ao atualizar motorista"
   */
};