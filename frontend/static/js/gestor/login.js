// Import the API module if you have one
import { loginGestor } from "../api.js";

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");
  const togglePasswordBtn = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("loginPassword");

  // Toggle password visibility
  togglePasswordBtn.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    // Toggle icon
    const icon = togglePasswordBtn.querySelector("i");
    if (type === "password") {
      icon.classList.replace("bi-eye-slash", "bi-eye");
    } else {
      icon.classList.replace("bi-eye", "bi-eye-slash");
    }
  });

  // Handle form submission
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    // Basic validation
    if (!email || !password) {
      showMessage("Por favor, preencha todos os campos.", "danger");
      return;
    }

    // Optional: email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage("Por favor, insira um e-mail válido.", "danger");
      return;
    }

    try {
      showMessage("Autenticando...", "info");

      // Attempt login using your API function
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer login");
      }

      // On successful login
      showMessage("Login realizado com sucesso! Redirecionando...", "success");

      // Store authentication token and gestor info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userId", data.id);

      // Redirect to dashboard after short delay
      setTimeout(() => {
        window.location.href = "/frontend/pages/dashboard/PainelDashboard.html"; // Ajuste o caminho conforme necessário
      }, 1500);
    } catch (error) {
      console.error("Erro no login:", error);
      showMessage(
        "Credenciais inválidas. Por favor, verifique seu e-mail e senha.",
        "danger"
      );
    }
  });

  // Helper function to show messages
  function showMessage(message, type) {
    loginMessage.textContent = message;
    loginMessage.className = `alert alert-${type} mt-3`;
    loginMessage.classList.remove("d-none");

    if (type === "success" || type === "info") {
      setTimeout(() => {
        loginMessage.classList.add("d-none");
      }, 3000);
    }
  }

  // Check if user is already logged in and redirect if necessary
  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "/frontend/pages/dashboard/PainelDashboard.html";
  }
});
