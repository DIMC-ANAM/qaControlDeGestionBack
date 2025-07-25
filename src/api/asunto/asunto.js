const { Router } = require("express");
const router = Router();
const controller = require("./asuntoController");
const token = require("../token/tokenController");


router.post("/registrarAsunto", token.validateToken, controller.registrarAsunto);

module.exports = router;