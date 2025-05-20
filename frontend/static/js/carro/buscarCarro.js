document.addEventListener("DOMContentLoaded", () => {
  const btnBuscarModelo = document.getElementById("btn-buscar-modelo");
  const btnBuscarPlaca = document.getElementById("btn-buscar-placa");
  const filtroDisponibilidade = document.getElementById(
    "filtro-disponibilidade"
  );
  const btnRefresh = document.getElementById("btn-refresh-carros");

  // Função para filtrar os carros conforme o filtro de disponibilidade
  function filtrarDisponibilidade(carros, filtro) {
    if (filtro === "todos") return carros;
    if (filtro === "disponivel")
      return carros.filter((carro) => carro.disponivel);
    if (filtro === "indisponivel")
      return carros.filter((carro) => !carro.disponivel);
    return carros;
  }

  // Carrega todos os carros e aplica filtro
  async function carregarEFiltrarCarros() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/carros", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Erro ao carregar carros");
      }
      let carros = await response.json();
      carros = filtrarDisponibilidade(carros, filtroDisponibilidade.value);
      renderizarCarros(carros);
    } catch (error) {
      console.error("Erro:", error);
      alert(error.message);
    }
  }

  // Evento de busca por modelo
  btnBuscarModelo.addEventListener("click", async function () {
    const modelo = document.getElementById("busca-modelo").value.trim();
    if (!modelo) {
      alert("Digite o modelo para buscar");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/carros/buscar-modelo/${encodeURIComponent(
          modelo
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar carro por modelo");
      }
      let carros = await response.json();
      carros = filtrarDisponibilidade(carros, filtroDisponibilidade.value);
      renderizarCarros(carros);
    } catch (error) {
      console.error("Erro:", error);
      alert(error.message);
    }
  });

  // Evento de busca por placa
  btnBuscarPlaca.addEventListener("click", async function () {
    const placa = document.getElementById("busca-placa").value.trim();
    if (!placa) {
      alert("Digite a placa para buscar");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/carros/placa/${encodeURIComponent(placa)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar carro por placa");
      }
      let carroEncontrado = await response.json();
      let carros = Array.isArray(carroEncontrado)
        ? carroEncontrado
        : [carroEncontrado];
      carros = filtrarDisponibilidade(carros, filtroDisponibilidade.value);
      renderizarCarros(carros);
    } catch (error) {
      console.error("Erro:", error);
      alert(error.message);
    }
  });

  // Evento do select de disponibilidade: recarrega todos os carros aplicando o filtro selecionado
  filtroDisponibilidade.addEventListener("change", function () {
    carregarEFiltrarCarros();
  });

  // Botão para atualizar a lista completa: limpa os campos de busca, reseta o filtro e recarrega
  btnRefresh.addEventListener("click", function () {
    document.getElementById("busca-modelo").value = "";
    document.getElementById("busca-placa").value = "";
    filtroDisponibilidade.value = "todos";
    carregarEFiltrarCarros();
  });

  // Chama uma vez para carregar a lista completa inicialmente
  carregarEFiltrarCarros();
});
