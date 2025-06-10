const express = require("express");
const RelatorioController = require("../../controllers/Relatorio/RelatorioController");
const router = express.Router();
const verificarJWT = require("../../middlewares/auth");

// Rota para relatório completo
router.get("/completo", verificarJWT, RelatorioController.getRelatorioCompleto);

module.exports = router;
