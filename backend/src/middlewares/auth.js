const jwt = require("jsonwebtoken");

const verificarJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido!" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader; // Suporte para tokens sem o prefixo "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreta");
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Erro ao verificar token:", error.message);
    return res.status(401).json({ error: "Token inválido ou expirado!" });
  }
};

module.exports = verificarJWT;
