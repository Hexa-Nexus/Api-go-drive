const express = require("express");
const GestorController = require("../../controllers/Gestor/GestorController");
const router = express.Router();
const verificarJWT = require("../../middlewares/auth");

router.post("/login",  GestorController.loginGestor);
router.post("/gestor", verificarJWT, GestorController.criandoGestor);
router.get("/gestores", verificarJWT, GestorController.buscarGestores);
router.get("/gestor/:id", verificarJWT, GestorController.buscarGestorId);
router.put("/gestor/:id",  verificarJWT, GestorController.editarGestor);
router.get("/gestor/cpf/:cpf", verificarJWT,  GestorController.buscarGestorPorCPF);
router.delete("/gestor/:id", verificarJWT,  GestorController.deletarGestor);

module.exports = router;
