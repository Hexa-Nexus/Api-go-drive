import { API_BASE_URL } from "../api.js";

document
  .getElementById("gestorForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const mensagemDiv = document.getElementById("mensagem");

    // Função para exibir mensagens
    const exibirMensagem = (mensagem, cor) => {
      mensagemDiv.textContent = mensagem;
      mensagemDiv.style.color = cor;
      mensagemDiv.classList.remove("d-none"); // Remove a classe que oculta o elemento
    };

    if (!name) {
      exibirMensagem("Por favor, informe o nome.", "red");
      return;
    }

    const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
    if (!cpfRegex.test(cpf)) {
      exibirMensagem("Por favor, informe um CPF válido.", "red");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      exibirMensagem("Por favor, informe um email válido.", "red");
      return;
    }

    // Validação da senha (mínimo 6 caracteres)
    if (password.length < 6) {
      exibirMensagem("A senha deve ter pelo menos 6 caracteres.", "red");
      return;
    }

    exibirMensagem("Enviando...", "blue");

    try {
      const response = await fetch(`${API_BASE_URL}/gestor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, cpf, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        exibirMensagem("Gestor cadastrado com sucesso!", "green");
        document.getElementById("gestorForm").reset();
      } else {
        exibirMensagem(data.error || "Erro ao cadastrar gestor.", "red");
      }
    } catch (err) {
      exibirMensagem("Erro de conexão com o servidor.", "red");
    }
  });
