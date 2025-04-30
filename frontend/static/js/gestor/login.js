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

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    // Basic validation
    if (!email || !password) {
      showMessage("Por favor, preencha todos os campos.", "danger");
      return;
    }

    try {
      showMessage("Autenticando...", "info");

      // Attempt login using your API function
      const result = await loginGestor(email, password);

      // On successful login
      showMessage("Login realizado com sucesso! Redirecionando...", "success");

      // Store authentication token in localStorage
      localStorage.setItem("token", result.token);
      localStorage.setItem("gestorName", result.name);

      // Redirect to dashboard after short delay
      setTimeout(() => {
        window.location.href = "dashboard.html";
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
  }
});
