export const CarroGetDocs = {
  /**
   * @swagger
   * /api/carros:
   *   get:
   *     summary: Lista todos os carros
   *     tags:
   *       - Carro
   *     responses:
   *       200:
   *         description: Lista de carros retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                   modelo:
   *                     type: string
   *                   marca:
   *                     type: string
   *                   ano:
   *                     type: integer
   *                   cor:
   *                     type: string
   *                   placa:
   *                     type: string
   *                   odometroAtual:
   *                     type: integer
   *                   disponivel:
   *                     type: boolean
   *                   eventos:
   *                     type: array
   *                     items:
   *                       type: object
   *       500:
   *         description: Erro ao obter os carros
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   * 
   * /api/carros/{id}:
   *   get:
   *     summary: Busca um carro pelo ID
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
   *         description: Carro encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 modelo:
   *                   type: string
   *                 marca:
   *                   type: string
   *                 ano:
   *                   type: integer
   *                 cor:
   *                   type: string
   *                 placa:
   *                   type: string
   *                 disponivel:
   *                   type: boolean
   *                 odometroAtual:
   *                   type: integer
   *       404:
   *         description: Carro não encontrado
   *       500:
   *         description: Erro ao obter o carro
   */
};