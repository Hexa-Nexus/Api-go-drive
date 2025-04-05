const express = require("express");
const EventoController = require("../../controllers/Evento/EventoController");
const router = express.Router();
// Definições de rotas para os eventos
router.post("/eventos", EventoController.criar_novo_Eventos);
router.put("/eventos", EventoController.concluir_evento);
router.get("/eventos", EventoController.obeter_todos_eventos);
router.get("/eventos/:id", EventoController.obert_evento_por_id);
router.delete("/eventos/:id", EventoController.deletar_evento);

module.exports = router;