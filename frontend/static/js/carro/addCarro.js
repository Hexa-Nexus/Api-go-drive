document.addEventListener("DOMContentLoaded", function () {
  const formAddCarro = document.getElementById("form-add-carro");

  // Função para decodificar o payload do JWT
  function parseJwt(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  }

  formAddCarro.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Obtém o token e extrai o id do gestor
    const token = localStorage.getItem("token");
    const gestorId = token ? parseJwt(token).id : "";

    // Obter os dados do formulário
    const formData = {
      modelo: document.getElementById("modelo").value,
      marca: document.getElementById("marca").value,
      ano: parseInt(document.getElementById("ano").value, 10),
      cor: document.getElementById("cor").value,
      placa: document.getElementById("placa").value,
      odometroAtual: parseInt(
        document.getElementById("odometroAtual").value,
        10
      ),
      disponivel: true, // Define o carro como disponível por padrão
      gestorId, // valor obtido do token
    };

    try {
      const response = await fetch("http://localhost:3000/api/carros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao adicionar carro");
      }

      alert("Carro adicionado com sucesso!");

      // Limpar formulário
      formAddCarro.reset();

      // Fechar modal (supondo que o ID do modal seja "modalAddCarro")
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("modalAddCarro")
      );
      modal.hide();

      // Se existir função para atualizar a lista de carros, chamada-a
      if (typeof loadCarros === "function") {
        loadCarros();
      }
    } catch (error) {
      alert(error.message);
      console.error("Erro:", error);
    }
  });
});
