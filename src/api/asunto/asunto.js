const { Router } = require("express");
const router = Router();
const controller = require("./asuntoController");
const token = require("../token/tokenController");



router.post("/consultarAsuntosUR", token.validateToken, controller.consultarAsuntosUR);


module.exports = router;

