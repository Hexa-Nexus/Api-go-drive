export const RelatorioCompletoDocs = {
  /**
   * @swagger
   * /api/relatorios/completo:
   *   get:
   *     summary: Retorna um relatório completo com todos os dados do sistema
   *     description: Endpoint para gerar um relatório completo com todos os dados possíveis de gestores, motoristas, carros, eventos e pagamentos, incluindo estatísticas detalhadas. Permite filtrar por período de data.
   *     tags:
   *       - Relatório
   *     parameters:
   *       - in: query
   *         name: dataInicio
   *         schema:
   *           type: string
   *           format: date
   *         description: Data de início para filtrar os dados (formato YYYY-MM-DD)
   *         example: "2023-01-01"
   *       - in: query
   *         name: dataFim
   *         schema:
   *           type: string
   *           format: date
   *         description: Data final para filtrar os dados (formato YYYY-MM-DD)
   *         example: "2023-12-31"
   *     responses:
   *       200:
   *         description: Relatório completo gerado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 dataGeracao:
   *                   type: string
   *                   format: date-time
   *                   description: Data e hora de geração do relatório
   *                   example: "2023-06-10T15:30:45.123Z"
   *                 filtros:
   *                   type: object
   *                   properties:
   *                     dataInicio:
   *                       type: string
   *                       format: date-time
   *                       description: Data de início utilizada no filtro
   *                       example: "2023-01-01T00:00:00.000Z"
   *                     dataFim:
   *                       type: string
   *                       format: date-time
   *                       description: Data final utilizada no filtro
   *                       example: "2023-12-31T23:59:59.999Z"
   *                 estatisticas:
   *                   type: object
   *                   properties:
   *                     totalGestores:
   *                       type: integer
   *                       description: Total de gestores
   *                       example: 10
   *                     totalMotoristas:
   *                       type: integer
   *                       description: Total de motoristas
   *                       example: 25
   *                     totalCarros:
   *                       type: integer
   *                       description: Total de carros
   *                       example: 30
   *                     totalEventos:
   *                       type: integer
   *                       description: Total de eventos
   *                       example: 150
   *                     totalPagamentos:
   *                       type: integer
   *                       description: Total de pagamentos
   *                       example: 120
   *                     valorTotalPagamentos:
   *                       type: number
   *                       description: Valor total de todos os pagamentos
   *                       example: 45780.50
   *                     eventosPendentes:
   *                       type: integer
   *                       description: Quantidade de eventos pendentes
   *                       example: 15
   *                     eventosConcluidos:
   *                       type: integer
   *                       description: Quantidade de eventos concluídos
   *                       example: 130
   *                     eventosCancelados:
   *                       type: integer
   *                       description: Quantidade de eventos cancelados
   *                       example: 5
   *                     pagamentosPendentes:
   *                       type: integer
   *                       description: Quantidade de pagamentos pendentes
   *                       example: 10
   *                     pagamentosPagos:
   *                       type: integer
   *                       description: Quantidade de pagamentos pagos
   *                       example: 105
   *                     pagamentosCancelados:
   *                       type: integer
   *                       description: Quantidade de pagamentos cancelados
   *                       example: 5
   *                     carrosDisponiveis:
   *                       type: integer
   *                       description: Quantidade de carros disponíveis
   *                       example: 20
   *                     carrosIndisponiveis:
   *                       type: integer
   *                       description: Quantidade de carros indisponíveis
   *                       example: 10
   *                     motoristasDisponiveis:
   *                       type: integer
   *                       description: Quantidade de motoristas disponíveis
   *                       example: 15
   *                     motoristasIndisponiveis:
   *                       type: integer
   *                       description: Quantidade de motoristas indisponíveis
   *                       example: 10
   *                     distanciaTotalPercorrida:
   *                       type: integer
   *                       description: Distância total percorrida em km
   *                       example: 25000
   *                     distanciaMediaPorEvento:
   *                       type: number
   *                       description: Distância média percorrida por evento em km
   *                       example: 192.3
   *                 gestores:
   *                   type: array
   *                   description: Lista de gestores
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: ID único do gestor
   *                         example: "123e4567-e89b-12d3-a456-426614174000"
   *                       nome:
   *                         type: string
   *                         description: Nome do gestor
   *                         example: "João Silva"
   *                       email:
   *                         type: string
   *                         description: Email do gestor
   *                         example: "joao.silva@example.com"
   *                       cpf:
   *                         type: string
   *                         description: CPF do gestor
   *                         example: "123.456.789-00"
   *                       admin:
   *                         type: boolean
   *                         description: Indica se o gestor é administrador
   *                         example: true
   *                 motoristas:
   *                   type: array
   *                   description: Lista de motoristas
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: ID único do motorista
   *                         example: "223e4567-e89b-12d3-a456-426614174001"
   *                       nome:
   *                         type: string
   *                         description: Nome do motorista
   *                         example: "Maria Oliveira"
   *                       cpf:
   *                         type: string
   *                         description: CPF do motorista
   *                         example: "987.654.321-00"
   *                       habilitacao:
   *                         type: string
   *                         description: Número da habilitação do motorista
   *                         example: "12345678900"
   *                       disponivel:
   *                         type: boolean
   *                         description: Indica se o motorista está disponível
   *                         example: true
   *                       gestor:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                             example: "123e4567-e89b-12d3-a456-426614174000"
   *                           nome:
   *                             type: string
   *                             example: "João Silva"
   *                           email:
   *                             type: string
   *                             example: "joao.silva@example.com"
   *                 carros:
   *                   type: array
   *                   description: Lista de carros
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: ID único do carro
   *                         example: "323e4567-e89b-12d3-a456-426614174002"
   *                       modelo:
   *                         type: string
   *                         description: Modelo do carro
   *                         example: "Onix"
   *                       marca:
   *                         type: string
   *                         description: Marca do carro
   *                         example: "Chevrolet"
   *                       ano:
   *                         type: integer
   *                         description: Ano do carro
   *                         example: 2022
   *                       cor:
   *                         type: string
   *                         description: Cor do carro
   *                         example: "Preto"
   *                       placa:
   *                         type: string
   *                         description: Placa do carro
   *                         example: "ABC1234"
   *                       odometroAtual:
   *                         type: integer
   *                         description: Odômetro atual do carro em km
   *                         example: 15000
   *                       disponivel:
   *                         type: boolean
   *                         description: Indica se o carro está disponível
   *                         example: true
   *                       gestor:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                             example: "123e4567-e89b-12d3-a456-426614174000"
   *                           nome:
   *                             type: string
   *                             example: "João Silva"
   *                           email:
   *                             type: string
   *                             example: "joao.silva@example.com"
   *                 eventos:
   *                   type: array
   *                   description: Lista de eventos
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: ID único do evento
   *                         example: "423e4567-e89b-12d3-a456-426614174003"
   *                       tipoEvento:
   *                         type: string
   *                         description: Tipo do evento
   *                         example: "SAIDA"
   *                       status:
   *                         type: string
   *                         description: Status do evento
   *                         example: "CONCLUIDO"
   *                       dataSaida:
   *                         type: string
   *                         format: date-time
   *                         description: Data de saída
   *                         example: "2023-05-10T10:00:00.000Z"
   *                       dataEntrada:
   *                         type: string
   *                         format: date-time
   *                         description: Data de entrada
   *                         example: "2023-05-12T15:30:00.000Z"
   *                       odometroInicial:
   *                         type: integer
   *                         description: Odômetro inicial em km
   *                         example: 15000
   *                       odometroFinal:
   *                         type: integer
   *                         description: Odômetro final em km
   *                         example: 15350
   *                 pagamentos:
   *                   type: array
   *                   description: Lista de pagamentos
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: ID único do pagamento
   *                         example: "523e4567-e89b-12d3-a456-426614174004"
   *                       valor:
   *                         type: number
   *                         description: Valor do pagamento
   *                         example: 700.00
   *                       data:
   *                         type: string
   *                         format: date-time
   *                         description: Data do pagamento
   *                         example: "2023-05-12T15:35:00.000Z"
   *                       metodoPagamento:
   *                         type: string
   *                         description: Método de pagamento
   *                         example: "CARTAO"
   *                       statusPagamento:
   *                         type: string
   *                         description: Status do pagamento
   *                         example: "PAGO"
   *       500:
   *         description: Erro ao gerar o relatório completo
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Mensagem de erro
   *                   example: "Erro ao gerar relatório completo"
   *                 details:
   *                   type: string
   *                   description: Detalhes do erro
   *                   example: "Erro interno do servidor"
   */
};

export default RelatorioCompletoDocs; 