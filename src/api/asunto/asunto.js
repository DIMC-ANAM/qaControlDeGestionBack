const { Router } = require("express");
const router = Router();
const controller = require("./asuntoController");
const token = require("../token/tokenController");

router.post("/registrarAsunto", token.validateToken, controller.registrarAsunto);
router.post("/consultarAsuntosUR", token.validateToken, controller.consultarAsuntosUR);
router.post("/consultarDetalleAsunto", token.validateToken, controller.consultarDetalleAsunto);
router.post("/consultarExpedienteAsunto", token.validateToken, controller.consultarExpedienteAsunto);
router.post("/consultarTurnados", token.validateToken, controller.consultarTurnados);
router.post("/turnarAsunto", token.validateToken, controller.turnarAsunto);
router.post("/reemplazarDocumento", token.validateToken, controller.reemplazarDocumento);
router.post("/agregarAnexos", token.validateToken, controller.agregarAnexos);
router.post("/eliminarDocumento", token.validateToken, controller.eliminarDocumento);

module.exports = router;

