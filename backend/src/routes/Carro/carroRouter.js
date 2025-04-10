const express = require("express");
const router = express.Router();
const CarroController = require("../../controllers/Carro/carroController");

// Definições de rotas para carro
router.post("/carro", CarroController.criandoCarro);
router.get("/carros", CarroController.obter_todos_carros);
router.put("/carros/:id", CarroController.atualizar_carro);
router.delete("/carros/:id", CarroController.deletar_carro);
router.get("/carros/:id", CarroController.obter_carro_por_id);
router.get("/carros/buscar-modelo/:modelo", CarroController.buscar_por_modelo);
router.get("/carros/placa/:placa", CarroController.buscar_por_placa);

module.exports = router;
