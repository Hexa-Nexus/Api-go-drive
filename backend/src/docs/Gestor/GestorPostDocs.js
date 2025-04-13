export const GestorPostDocs = {
  /**
   * @swagger
   *  /api/gestor:
   *   post:
   *     summary: Cria um novo gestor
   *     description: Endpoint para criar um novo gestor com validação de CPF, e-mail e senha criptografada.
   *     tags:
   *       - Gestor
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
   *                 example: "976.179.120-30"
   *               email:
   *                 type: string
   *                 description: E-mail do gestor.
   *                 example: joao.silva@email.com
   *               password:
   *                 type: string
   *                 description: Senha do gestor.
   *                 example: "senha123"
   *     responses:
   *       201:
   *         description: Gestor criado com sucesso.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                   description: ID do gestor criado.
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
   *         description: Erro de validação (CPF ou e-mail inválido, ou já existente).
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Mensagem de erro.
   *                   example: "CPF inválido."
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
   *                   example: "Erro ao criar o gestor!"
   */
};
