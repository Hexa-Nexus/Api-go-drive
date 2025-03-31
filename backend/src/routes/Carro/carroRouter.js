const express = require("express");
const CarroController = require("../../controllers/Carro/carroController");
const router = express.Router();

//definições de rotas para carro
router.post("/carros", CarroController.criandoCarro);
module.exports = router;
