export const CarroPutDocs = {
  /**
   * @swagger
   * /api/carros/{id}:
   *   put:
   *     summary: Atualiza um carro
   *     tags:
   *       - Carro
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               modelo:
   *                 type: string
   *               marca:
   *                 type: string
   *               ano:
   *                 type: integer
   *               cor:
   *                 type: string
   *               placa:
   *                 type: string
   *               disponivel:
   *                 type: boolean
   *               odometroAtual:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Carro atualizado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Carro'
   *       400:
   *         description: ID do carro não fornecido ou placa já em uso
   *       404:
   *         description: Carro não encontrado
   *       500:
   *         description: Erro ao atualizar o carro
   */
};