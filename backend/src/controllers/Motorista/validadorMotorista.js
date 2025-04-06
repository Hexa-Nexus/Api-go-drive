function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, ""); // Remove caracteres não numéricos
  
  // Verificar se o CPF possui 11 dígitos ou se é uma sequência repetida
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }

  let soma = 0;
  let resto;

  // Validação do primeiro dígito
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.charAt(i - 1)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  if (resto !== parseInt(cpf.charAt(9))) {
    return false;
  }

  soma = 0;
  // Validação do segundo dígito
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.charAt(i - 1)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  if (resto !== parseInt(cpf.charAt(10))) {
    return false;
  }

  return true;
}

// Função para validar Habilitação (apenas 11 dígitos numéricos)
function validarHabilitacao(habilitacao) {
  return /^\d{11}$/.test(habilitacao);  // Verifica se possui exatamente 11 dígitos
}
function validarTelefone(telefone) {
  // Remove caracteres não numéricos, como espaços, parênteses, hífens e "+"
  telefone = telefone.replace(/[^\d]/g, "");

  // Verifica se o telefone tem 11 dígitos (para números celulares) ou 12 (com código de país +55)
  return telefone.length === 11 || telefone.length === 12;
}

module.exports = {
  validarCPF,
  validarHabilitacao,
  validarTelefone,
};