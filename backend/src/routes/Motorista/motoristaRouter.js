const express = require("express");
const MotoristaCotroller = require("../../controllers/Motorista/MotoristaController");
const router = express.Router();

// Definições de rotas para o motorista
router.post("/motoristas", MotoristaCotroller.criar_motorista);
router.get("/motoristas", MotoristaCotroller.obter_todos_motoristas);
router.get("/motorista", MotoristaCotroller.obter_motorista_por_cpf);
router.delete("/motorista/:id", MotoristaCotroller.deletar_motorista);

module.exports = router;