const express = require("express");
const router = express.Router();
const CarroController = require("../../controllers/Carro/carroController");

// Definições de rotas para carro
router.post("/carro", CarroController.criandoCarro);
router.get("/carros", CarroController.obter_todos_carros);
router.get("/carro/:id", CarroController.obter_carro_por_id);
router.put("/carro/:id", CarroController.atualizar_carro);
router.delete("/carro/:id", CarroController.deletar_carro);

module.exports = router;
