const API_BASE_URL = "http://localhost:3000/api";

export async function loginGestor(email, password) {
  const response = await fetch(`${API_BASE_URL}/login`, { // Corrigido o endpoint para "/login"
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Falha na autenticação");
  }

  return await response.json();
}

export { API_BASE_URL };
