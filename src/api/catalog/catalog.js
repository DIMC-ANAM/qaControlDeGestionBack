const { Router } = require("express");
const router = Router();
const controller = require("./catalogController");
const token = require("../token/tokenController");

/**
 * in this file you will add to router, the call of your endpoint into your controller. 
 */

/*Micro service to query your items 
Response: http://localhost:80/catalog/getGender
    status:
    message:
    Model:{ta de genero}*/
router.get("/consultarTema", token.validateToken, controller.consultarTema);
router.get("/consultarPrioridad", token.validateToken, controller.consultarPrioridad);
router.get("/consultarTipoDocumento", token.validateToken, controller.consultarTipoDocumento);
router.get("/consultarMedioRecepcion", token.validateToken, controller.consultarMedioRecepcion);

module.exports = router;