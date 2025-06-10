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
    // Mostrar spinner de carregamento
    document.getElementById("carros-lista").innerHTML =
      '<tr><td colspan="9" class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Carregando...</span></div></td></tr>';

    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3000/api/carros", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar carros");
    }

    const carros = await response.json();
    renderCarrosList(carros);
  } catch (error) {
    console.error("Erro:", error);
    document.getElementById("carros-lista").innerHTML =
      '<tr><td colspan="9" class="text-center text-danger">Erro ao carregar carros. Tente novamente mais tarde.</td></tr>';
  }
}

function renderCarrosList(carros) {
  const tbody = document.getElementById("carros-lista");
  tbody.innerHTML = "";

  if (carros.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="9" class="text-center">Nenhum carro encontrado</td></tr>';
    return;
  }

  carros.forEach((carro) => {
    const tr = document.createElement("tr");
    tr.classList.add("carro-row");
    tr.style.cursor = "pointer";
    tr.dataset.id = carro.id;
    tr.innerHTML = `
      <td>${carro.id.substring(0, 8)}...</td>
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
        <div class="btn-group btn-group-sm" role="group">
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

  // Adicionar listeners para os botões de editar e excluir
  addButtonListeners();

  // Adicionar listener para redirecionamento ao clicar na linha
  document.querySelectorAll(".carro-row").forEach((row) => {
    row.addEventListener("click", function(event) {
      // Verifica se o clique não foi em um botão de ação
      if (!event.target.closest('.btn-group')) {
        const carroId = this.dataset.id;
        window.location.href = `../carro/HistoricoEventosCarro.html?id=${carroId}`;
      }
    });
  });
}

function addButtonListeners() {
  // Listener para botões de excluir
  document.querySelectorAll(".btn-delete").forEach((button) => {
    button.addEventListener("click", (event) => {
      const carroId = event.currentTarget.getAttribute("data-id");
      // Implementar lógica de exclusão ou modal de confirmação
      if (confirm("Tem certeza que deseja excluir este carro?")) {
        deleteCarro(carroId);
      }
    });
  });
}

// Inicialização do módulo
document.addEventListener("DOMContentLoaded", () => {
  loadCarros();

  // Adicionar event listener para o botão de refresh
  document.getElementById("btn-refresh-carros").addEventListener("click", loadCarros);
});

async function deleteCarro(id) {
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
