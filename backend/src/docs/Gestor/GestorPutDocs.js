export const GestorPutDocs = {
  /**
   * @swagger
   * /api/gestor/{id}:
   *   put:
   *     summary: Atualiza os dados de um gestor
   *     description: Atualiza os dados de um gestor específico pelo ID.
   *     tags:
   *       - Gestor
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do gestor.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Nome do gestor.
   *                 example: João Silva
   *               cpf:
   *                 type: string
   *                 description: CPF do gestor.
   *                 example: "123.456.789-00"
   *               email:
   *                 type: string
   *                 description: E-mail do gestor.
   *                 example: joao.silva@email.com
   *               password:
   *                 type: string
   *                 description: Senha do gestor.
   *                 example: "novaSenha123"
   *     responses:
   *       200:
   *         description: Gestor atualizado com sucesso.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   description: ID do gestor.
   *                   example: "123e4567-e89b-12d3-a456-426614174000"
   *                 name:
   *                   type: string
   *                   description: Nome do gestor.
   *                   example: João Silva
   *                 cpf:
   *                   type: string
   *                   description: CPF do gestor.
   *                   example: "123.456.789-00"
   *                 email:
   *                   type: string
   *                   description: E-mail do gestor.
   *                   example: joao.silva@email.com
   *       400:
   *         description: Erro de validação.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Mensagem de erro.
   *                   example: "CPF inválido."
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
   *                   example: "Erro ao atualizar o gestor!"
   */
};
