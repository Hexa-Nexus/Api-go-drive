const express = require("express");
const MotoristaCotroller = require("../../controllers/Motorista/MotoristaController");
const router = express.Router();
const verificarJWT = require("../../middlewares/auth");

// Definições de rotas para o motorista
router.post("/motorista", verificarJWT, MotoristaCotroller.criar_motorista);
router.get("/motoristas", verificarJWT, MotoristaCotroller.obter_todos_motoristas);
router.get("/motorista", verificarJWT, MotoristaCotroller.obter_motorista_por_cpf);
router.get("/motorista/:id", verificarJWT, MotoristaCotroller.obter_motorista_por_id);
router.put("/motorista/:id", verificarJWT, MotoristaCotroller.atualizar_motorista);
router.delete("/motorista/:id", verificarJWT, MotoristaCotroller.deletar_motorista);

module.exports = router;
