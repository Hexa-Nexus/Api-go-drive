document.addEventListener("DOMContentLoaded", function () {
  loadCarros();

  // Delegação de eventos para botões (ex.: delete e edit)
  document
    .getElementById("carros-lista")
    .addEventListener("click", function (e) {
      if (e.target.classList.contains("btn-delete")) {
        const carroId = e.target.dataset.id;
        if (confirm("Tem certeza que deseja deletar este carro?")) {
          deletarCarro(carroId);
        }
      }
      // Aqui você pode adicionar outros eventos, como editar carro
    });
});

// Função para formatar o ID no padrão desejado (#12345)
function formatPartialId(id) {
  return "#" + id.slice(-5);
}

async function loadCarros() {
  try {
    const response = await fetch("http://localhost:3000/api/carros", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar carros");
    }

    const carros = await response.json();
    renderizarCarros(carros);
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao carregar carros");
  }
}

function renderizarCarros(carros) {
  const tbody = document.getElementById("carros-lista");
  tbody.innerHTML = "";

  carros.forEach((carro) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${formatPartialId(carro.id)}</td>
      <td>${carro.modelo}</td>
      <td>${carro.marca}</td>
      <td>${carro.placa}</td>
      <td>${carro.ano}</td>
      <td>${carro.cor}</td>
      <td>${carro.odometroAtual}</td>
      <td>
        <span class="badge ${carro.disponivel ? "bg-success" : "bg-danger"}">
          ${carro.disponivel ? "Disponível" : "Indisponível"}
        </span>
      </td>
      <td>
        <div class="btn-group btn-group-sm">
          <button class="btn btn-primary btn-edit" data-id="${carro.id}">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-danger btn-delete" data-id="${carro.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function deletarCarro(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/carros/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar carro");
    }

    alert("Carro deletado com sucesso!");
    loadCarros(); // Recarrega a lista atualizada
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao deletar carro");
  }
}
