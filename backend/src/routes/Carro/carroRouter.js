const express = require("express");
const router = express.Router();
const CarroController = require("../../controllers/Carro/carroController");

// Definições de rotas para carro
router.post("/carros", CarroController.criandoCarro);
router.get("/carros", CarroController.obter_todos_carros);
router.put("/carros/:id", CarroController.atualizar_carro);

module.exports = router;
