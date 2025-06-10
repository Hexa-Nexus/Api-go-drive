const express = require("express");
const EventoController = require("../../controllers/Evento/EventoController");
const router = express.Router();
const verificarJWT = require("../../middlewares/auth");

// Definições de rotas para os eventos
// Primeiro as rotas específicas com parâmetros (mais específicas)
router.get("/eventos/carro/:id", verificarJWT, EventoController.obter_eventos_por_carro);
router.get("/eventos/motorista/:id", verificarJWT, EventoController.obter_eventos_por_motorista);
router.get("/eventos/status-check", verificarJWT, EventoController.verificar_status_eventos);
router.get("/evento/:id", verificarJWT, EventoController.obter_evento_por_id);

// Depois as rotas genéricas
router.get("/eventos", verificarJWT, EventoController.obter_todos_eventos);
router.post("/evento", verificarJWT, EventoController.criar_novo_Eventos);
router.put("/evento", verificarJWT, EventoController.concluir_evento);
router.post("/evento/:id/cancelar", verificarJWT, EventoController.cancelar_evento);
router.delete("/evento/:id", verificarJWT, EventoController.deletar_evento);

module.exports = router;
