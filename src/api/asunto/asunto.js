const { Router } = require("express");
const router = Router();
const controller = require("./asuntoController");
const token = require("../token/tokenController");


router.post("/registrarAsunto", token.validateToken, controller.registrarAsunto);
router.post("/consultarAsuntosUR", token.validateToken, controller.consultarAsuntosUR);
router.post("/consultarDetalleAsuntos", token.validateToken, controller.consultarDetalleAsuntos);


module.exports = router;