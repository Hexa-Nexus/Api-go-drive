import { API_BASE_URL } from "../api.js";

// Função para validar CPF utilizando o algoritmo oficial
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false; // Impede CPFs com todos os dígitos iguais

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;

  return true;
}

// Função para validar telefone: permite 10 ou 11 dígitos
function validarTelefone(telefone) {
  const tel = telefone.replace(/\D/g, "");
  return /^\d{10,11}$/.test(tel);
}

// Função para validar habilitação: neste caso, mantemos a validação para 11 dígitos numéricos
function validarHabilitacao(habilitacao) {
  const hab = habilitacao.replace(/\D/g, "");
  return /^\d{11}$/.test(hab);
}

// Função para adicionar motorista
async function adicionarMotorista(event) {
  event.preventDefault();

  const form = document.getElementById("form-add-motorista");
  const nome = form.querySelector("#nome").value;
  const cpf = form.querySelector("#cpf").value.replace(/\D/g, "");
  const telefone = form.querySelector("#telefone").value.replace(/\D/g, "");
  const habilitacao = form
    .querySelector("#habilitacao")
    .value.replace(/\D/g, "");

  // Validações
  if (!validarCPF(cpf)) {
    showToastMessage(
      "CPF inválido. Digite apenas números (11 dígitos)",
      "danger"
    );
    return;
  }

  if (!validarTelefone(telefone)) {
    showToastMessage(
      "Telefone inválido. Digite apenas números (10 ou 11 dígitos)",
      "danger"
    );
    return;
  }

  if (!validarHabilitacao(habilitacao)) {
    showToastMessage(
      "Habilitação inválida. Digite apenas números (11 dígitos)",
      "danger"
    );
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Usuário não autenticado");
    }

    // Decodificar o token JWT para obter o ID do gestor
    const gestorId = JSON.parse(atob(token.split(".")[1])).id;
    if (!gestorId) {
      throw new Error("ID do gestor não encontrado no token");
    }

    const response = await fetch(`${API_BASE_URL}/motorista`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nome,
        cpf,
        telefone,
        habilitacao,
        gestorId, // Incluindo o ID do gestor no corpo da requisição
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || data.message || "Erro ao adicionar motorista"
      );
    }

    // Mostrar mensagem de sucesso
    showToastMessage("Motorista adicionado com sucesso!", "success");

    // Fechar o modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("modalAddMotorista")
    );
    modal.hide();

    // Limpar o formulário
    form.reset();

    // Recarregar a lista de motoristas
    window.location.reload();
  } catch (error) {
    console.error("Erro:", error);
    showToastMessage(error.message, "danger");
  }
}

function showToastMessage(message, type) {
  const toast = document.getElementById("notificationToast");
  const toastBody = document.getElementById("toastMessage");

  toastBody.textContent = message;
  toast.classList.add(`bg-${type}`);

  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();

  setTimeout(() => {
    toast.classList.remove(`bg-${type}`);
  }, 5000);
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  const formAddMotorista = document.getElementById("form-add-motorista");
  if (formAddMotorista) {
    formAddMotorista.addEventListener("submit", adicionarMotorista);
  }

  // Adicionar máscaras para os campos
  const cpfInput = document.getElementById("cpf");
  const telefoneInput = document.getElementById("telefone");
  const habilitacaoInput = document.getElementById("habilitacao");

  if (cpfInput) {
    cpfInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11);
    });
  }

  if (telefoneInput) {
    telefoneInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11);
    });
  }

  if (habilitacaoInput) {
    habilitacaoInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11);
    });
  }
});
