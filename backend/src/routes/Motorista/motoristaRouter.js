const express = require("express");
const MotoristaCotroller = require("../../controllers/Motorista/MotoristaController");
const router = express.Router();

// Definições de rotas para o motorista
router.post("/motoristas", MotoristaCotroller.criar_motorista);
router.get("/motoristas", MotoristaCotroller.obter_todos_motoristas);
router.get("/motorista", MotoristaCotroller.obter_motorista_por_cpf);
router.get("/motorista/:id", MotoristaCotroller.obter_motorista_por_id);
router.put("/motorista/:id", MotoristaCotroller.atualizar_motorista);
router.delete("/motorista/:id", MotoristaCotroller.deletar_motorista);

module.exports = router;
