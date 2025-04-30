const express = require("express");
const router = express.Router();
const CarroController = require("../../controllers/Carro/carroController");
const verificarJWT = require('../../middlewares/auth');

// Definições de rotas para carro
router.post("/carros", verificarJWT,CarroController.criandoCarro);
router.get("/carros", verificarJWT, CarroController.obter_todos_carros);
router.put("/carros/:id", verificarJWT,CarroController.atualizar_carro);
router.delete("/carros/:id", verificarJWT, CarroController.deletar_carro);
router.get("/carros/:id", verificarJWT, CarroController.obter_carro_por_id);
router.get("/carros/buscar-modelo/:modelo", verificarJWT, CarroController.buscar_por_modelo);
router.get("/carros/placa/:placa", verificarJWT, CarroController.buscar_por_placa);

module.exports = router;
