export const CarroSearchDocs = {
  /**
   * @swagger
   * /api/carros/buscar-modelo/{modelo}:
   *   get:
   *     summary: Busca carros por modelo
   *     tags:
   *       - Carro
   *     parameters:
   *       - in: path
   *         name: modelo
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Carros encontrados
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Carro'
   *       404:
   *         description: Nenhum carro encontrado com esse modelo
   *       500:
   *         description: Erro ao buscar carro por modelo
   * 
   * /api/carros/placa/{placa}:
   *   get:
   *     summary: Busca carro por placa
   *     tags:
   *       - Carro
   *     parameters:
   *       - in: path
   *         name: placa
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Carro encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Carro'
   *       404:
   *         description: Carro não encontrado pela placa
   *       500:
   *         description: Erro ao buscar carro por placa
   */
};