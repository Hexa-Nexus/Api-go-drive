const formasPermitidas = ['CARTAO', 'PIX', 'DINHEIRO', 'BOLETO'];

function validarMetodoPagamento(metodo) {
  return formasPermitidas.includes(metodo);
}

const statusPermitidos = ['PENDENTE','CANCELADO', 'PAGO'];

function validarStatusPagamento(status) {
  return statusPermitidos.includes(status);
}

module.exports = {
  validarMetodoPagamento,
  formasPermitidas,
  statusPermitidos,
  validarStatusPagamento
};