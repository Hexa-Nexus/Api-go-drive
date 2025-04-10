// routes/pagamentoRoutes.js

const express = require('express');
const router = express.Router();
const pagamentoController = require('../../controllers/Pagamento/pagamentoController');

router.post('/pagamentos', pagamentoController.criandoPagamento);
router.get('/pagamentos', pagamentoController.listarPagamentos);
router.get('/pagamentos/:id', pagamentoController.buscarPagamentoPorId);
router.delete('/pagamentos/:id', pagamentoController.deletarPagamento); // reverte status
router.put('/pagamentos/:id', pagamentoController.editarPagamento);


module.exports = router;


