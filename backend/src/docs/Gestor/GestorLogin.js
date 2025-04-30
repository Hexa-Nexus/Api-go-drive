/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Realiza o login de um gestor.
 *     description: Autentica um gestor com email e senha e retorna um token JWT.
 *     tags:
 *       - Gestor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: gestor@example.com
 *                 description: O email do gestor.
 *               password:
 *                 type: string
 *                 example: senha123
 *                 description: A senha do gestor.
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login realizado com sucesso!
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Senha incorreta.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Senha incorreta!
 *       404:
 *         description: Email não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email não encontrado!
 *       500:
 *         description: Erro interno no servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao realizar login!
 *                 details:
 *                   type: string
 *                   example: Detalhes do erro.
 */
