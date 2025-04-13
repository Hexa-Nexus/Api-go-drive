export const MotoristaPostDocs = {
  /**
   * @swagger
   * /api/motorista:
   *   post:
   *     summary: Cria um novo motorista
   *     tags:
   *       - Motorista
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
   *               cpf:
   *                 type: string
   *                 example: "123.456.789-00"
   *               habilitacao:
   *                 type: string
   *                 example: "12345678901"
   *               gestorId:
   *                 type: string
   *                 example: "1"
   *     responses:
   *       201:
   *         description: Motorista criado com sucesso
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
   *                     cpf:
   *                       type: string
   *                       example: "123.456.789-00"
   *                     habilitacao:
   *                       type: string
   *                       example: "12345678901"
   *                     gestorId:
   *                       type: string
   *                       example: "1"
   *       400:
   *         description: Erro de validação ou motorista já existente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "CPF inválido."
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Erro ao criar motorista"
   */
};
