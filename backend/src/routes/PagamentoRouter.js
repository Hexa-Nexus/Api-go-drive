const express = require('express');
const router = express.Router();
const pagamentoController = require('../../controllers/Pagamento/pagamentoController');
const verificarJWT = require("../../middlewares/auth");

router.post('/pagamentos', verificarJWT, pagamentoController.criandoPagamento);
router.get('/pagamentos', verificarJWT, pagamentoController.listarPagamentos);
router.get('/pagamentos/:id', verificarJWT, pagamentoController.buscarPagamentoPorId);
router.delete('/pagamentos/:id', verificarJWT, pagamentoController.deletarPagamento); // reverte status
router.put('/pagamentos/:id', verificarJWT, pagamentoController.editarPagamento);


module.exports = router;