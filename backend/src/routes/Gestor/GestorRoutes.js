const express = require('express');
const GestorController = require ('../../controllers/Gestor/GestorController')
const router = express.Router();

router.post('/gestor', GestorController.criandoGestor);
router.get('/gestores', GestorController.buscarGestores);
router.get('/gestor/:id', GestorController.buscarGestorId);
router.put('/gestor/:id', GestorController.editarGestor);
router.delete('/gestor/:id', GestorController.deletarGestor);

module.exports = router;
