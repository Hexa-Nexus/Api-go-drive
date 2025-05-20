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
    alert("Erro ao carregar dados do carro");
  }
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
      alert("ID do carro não encontrado. Atualize a página e tente novamente.");
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
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao atualizar o carro");
      }

      alert("Carro atualizado com sucesso!");
      const updateModal = bootstrap.Modal.getInstance(
        document.getElementById("modalUpdateCarro")
      );
      updateModal.hide();
      loadCarros(); // Recarrega a lista de carros (certifique-se de que essa função está implementada)
    } catch (error) {
      console.error("Erro ao atualizar carro:", error);
      alert("Erro ao atualizar carro: " + error.message);
    }
  });
