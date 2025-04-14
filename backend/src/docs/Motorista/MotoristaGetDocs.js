export const MotoristaGetDocs = {
  /**
   * @swagger
   * /api/motoristas:
   *   get:
   *     summary: Lista todos os motoristas
   *     tags:
   *       - Motorista
   *     responses:
   *       200:
   *         description: Lista de motoristas retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     example: "1"
   *                   nome:
   *                     type: string
   *                     example: João Silva
   *                   telefone:
   *                     type: string
   *                     example: "(11) 98765-4321"
   *                   cpf:
   *                     type: string
   *                     example: "123.456.789-00"
   *                   habilitacao:
   *                     type: string
   *                     example: "12345678901"
   *                   disponivel:
   *                     type: boolean
   *                     example: true
   *                   gestorId:
   *                     type: string
   *                     example: "1"
   *       500:
   *         description: Erro ao obter motoristas
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   example: "Erro ao obter motoristas"
   */
};
