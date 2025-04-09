const express = require("express");
const EventoController = require("../../controllers/Evento/EventoController");
const router = express.Router();
// Definições de rotas para os eventos
router.post("/evento", EventoController.criar_novo_Eventos);
router.put("/evento", EventoController.concluir_evento);
router.get("/eventos", EventoController.obeter_todos_eventos);
router.get("/evento/:id", EventoController.obert_evento_por_id);
router.delete("/evento/:id", EventoController.deletar_evento);

module.exports = router;