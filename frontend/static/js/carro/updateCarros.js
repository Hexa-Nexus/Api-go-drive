document.addEventListener("DOMContentLoaded", () => {
  // Delegação de eventos: ao clicar no botão editar, carregar os dados do carro
  document.getElementById("carros-lista").addEventListener("click", (e) => {
    if (
      e.target.classList.contains("btn-edit") ||
      e.target.parentElement.classList.contains("btn-edit")
    ) {
      const carroId = e.target.dataset.id || e.target.parentElement.dataset.id;
      carregarDadosCarro(carroId);
    }
  });

  // Adicionar botão de fechar ao modal de erro
  document.querySelectorAll('.btn-close-error').forEach(button => {
    button.addEventListener('click', () => {
      const errorModal = bootstrap.Modal.getInstance(document.getElementById('errorModal'));
      if (errorModal) errorModal.hide();
    });
  });
});

async function carregarDadosCarro(id) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:3000/api/carros/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erro ao carregar dados do carro");
    }
    const carro = await response.json();
    abrirModalAtualizacao(carro);
  } catch (error) {
    console.error("Erro:", error);
    showErrorModal("Erro", "Erro ao carregar dados do carro");
  }
}

// Função para exibir o modal de erro personalizado
function showErrorModal(title, message, isWarning = false) {
  const modalTitle = document.getElementById('errorModalTitle');
  const modalBody = document.getElementById('errorModalBody');
  const modalIcon = document.getElementById('errorModalIcon');

  modalTitle.textContent = title;
  modalBody.textContent = message;

  // Define o ícone e cor baseado no tipo de erro
  if (isWarning) {
    modalIcon.className = 'bi bi-exclamation-triangle text-warning display-1';
    document.getElementById('errorModalHeader').classList.remove('bg-danger');
    document.getElementById('errorModalHeader').classList.add('bg-warning');
  } else {
    modalIcon.className = 'bi bi-x-circle text-danger display-1';
    document.getElementById('errorModalHeader').classList.remove('bg-warning');
    document.getElementById('errorModalHeader').classList.add('bg-danger');
  }

  const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
  errorModal.show();
}

function abrirModalAtualizacao(carro) {
  // Preenche os campos do modal com as informações do carro
  document.getElementById("updateCarroId").value = carro.id; // armazenar o ID
  document.getElementById("updateModelo").value = carro.modelo;
  document.getElementById("updateMarca").value = carro.marca;
  document.getElementById("updateAno").value = carro.ano;
  document.getElementById("updateCor").value = carro.cor;
  // Preenche o campo placa, mas não vamos permitir alteração
  document.getElementById("updatePlaca").value = carro.placa;
  document.getElementById("updateOdometro").value = carro.odometroAtual;
  // Define o valor do select de status
  document.getElementById("updateDisponivel").value = carro.disponivel
    ? "true"
    : "false";

  // Abre o modal de atualização
  const updateModal = new bootstrap.Modal(
    document.getElementById("modalUpdateCarro")
  );
  updateModal.show();
}

document
  .getElementById("form-update-carro")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Obtém todos os dados do formulário de atualização
    const id = document.getElementById("updateCarroId").value;
    if (!id) {
      showErrorModal("Erro", "ID do carro não encontrado. Atualize a página e tente novamente.");
      return;
    }
    const modelo = document.getElementById("updateModelo").value;
    const marca = document.getElementById("updateMarca").value;
    const ano = parseInt(document.getElementById("updateAno").value, 10);
    const cor = document.getElementById("updateCor").value;
    // O campo "placa" é mantido inalterado, portanto NÃO será enviado na atualização
    const odometroAtual = parseInt(
      document.getElementById("updateOdometro").value,
      10
    );

    // Validar que o odômetro não seja negativo
    if (odometroAtual < 0) {
      showErrorModal("Erro", "O valor do odômetro não pode ser negativo.");
      return;
    }

    // Converte o valor do select para booleano
    const disponivel =
      document.getElementById("updateDisponivel").value === "true";

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/carros/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          modelo,
          marca,
          ano,
          cor,
          odometroAtual,
          disponivel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Verifica se é o erro específico de carro em evento ativo
        if (data.error && data.error.includes("carro enquanto ele estiver em um evento ativo")) {
          showErrorModal("Restrição de Alteração",
                        "Não é possível alterar a disponibilidade do carro enquanto ele estiver em um evento ativo.",
                        true);
        } else {
          throw new Error(data.error || "Erro ao atualizar o carro");
        }
        return;
      }

      // Modal de sucesso
      document.getElementById("successMessage").textContent = "Carro atualizado com sucesso!";
      const successModal = new bootstrap.Modal(document.getElementById("successModal"));
      successModal.show();

      // Fechar o modal de edição
      const updateModal = bootstrap.Modal.getInstance(
        document.getElementById("modalUpdateCarro")
      );
      updateModal.hide();

      // Recarregar a lista após 1 segundo
      setTimeout(() => {
        loadCarros(); // Recarrega a lista de carros
      }, 1000);
    } catch (error) {
      console.error("Erro ao atualizar carro:", error);
      showErrorModal("Erro na Atualização", error.message);
    }
  });
