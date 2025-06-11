const express = require('express');
const RelatorioController = require('../../controllers/Relatorio/RelatorioController');
const router = express.Router();

/**
 * Rota para gerar relatório completo
 * 
 * Parâmetros de query (opcionais):
 * - dataInicio: Data de início para filtrar os dados (formato: YYYY-MM-DD)
 * - dataFim: Data final para filtrar os dados (formato: YYYY-MM-DD)
 * 
 * Exemplo: /api/relatorio/completo?dataInicio=2023-01-01&dataFim=2023-12-31
 */
router.get('/completo', RelatorioController.gerarRelatorioCompleto);

module.exports = router;
