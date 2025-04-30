const express = require("express");
const EventoController = require("../../controllers/Evento/EventoController");
const router = express.Router();
const verificarJWT = require("../../middlewares/auth");

// Definições de rotas para os eventos
router.post("/evento", verificarJWT, EventoController.criar_novo_Eventos);
router.put("/evento", verificarJWT, EventoController.concluir_evento);
router.get("/eventos", verificarJWT, EventoController.obeter_todos_eventos);
router.get("/evento/:id", verificarJWT, EventoController.obert_evento_por_id);
router.delete("/evento/:id", verificarJWT, EventoController.deletar_evento);

module.exports = router;
