const express = require("express");
const router = express.Router();
const CarroController = require("../../controllers/Carro/carroController");

// Definições de rotas para carro
router.post("/carros", CarroController.criandoCarro);
router.get("/carros", CarroController.obter_todos_carros);

module.exports = router;
