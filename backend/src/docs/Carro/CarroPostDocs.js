export const CarroPostDocs = {
  /**
   * @swagger
   * /api/carros:
   *   post:
   *     summary: Cria um novo carro
   *     tags:
   *       - Carro
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               modelo:
   *                 type: string
   *                 example: "Onix"
   *               marca:
   *                 type: string
   *                 example: "Chevrolet"
   *               ano:
   *                 type: integer
   *                 example: 2023
   *               cor:
   *                 type: string
   *                 example: "Preto"
   *               placa:
   *                 type: string
   *                 example: "ABC1234"
   *               odometroAtual:
   *                 type: integer
   *                 example: 0
   *               disponivel:
   *                 type: boolean
   *                 example: true
   *               gestorId:
   *                 type: string
   *                 example: "550e8400-e29b-41d4-a716-446655440000"
   *     responses:
   *       201:
   *         description: Carro criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Carro'
   *       400:
   *         description: Dados inválidos ou gestor não encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Gestor não encontrado!"
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Erro ao criar o Carro!"
   */
};