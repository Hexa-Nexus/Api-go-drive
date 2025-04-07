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
};

// validando email
function validarEmail(email) {
  // Expressão regular para validar o formato do e-mail
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);
};

module.exports = {
  validarCPF,
  validarEmail
};