export const MotoristaGetByIdDocs = {
  /**
   * @swagger
   * /api/motorista/{id}:
   *   get:
   *     summary: Obtém um motorista pelo ID
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
   *         description: Motorista encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   example: "1"
   *                 nome:
   *                   type: string
   *                   example: João Silva
   *                 telefone:
   *                   type: string
   *                   example: "(11) 98765-4321"
   *                 cpf:
   *                   type: string
   *                   example: "123.456.789-00"
   *                 habilitacao:
   *                   type: string
   *                   example: "12345678901"
   *                 disponivel:
   *                   type: boolean
   *                   example: true
   *                 gestorId:
   *                   type: string
   *                   example: "1"
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
   *         description: Erro ao obter motorista
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Erro ao obter motorista"
   */
};
