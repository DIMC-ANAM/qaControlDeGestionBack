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
router.post("/consultarUnidadAdministrativa", token.validateToken, controller.consultarUnidadAdministrativa);
router.post("/consultarInstruccion", token.validateToken, controller.consultarInstruccion);
router.post("/consultarDependencia", token.validateToken, controller.consultarDependencia);
router.post("/consultarUsuarioRol", token.validateToken, controller.consultarUsuarioRol);
router.post("/registrarTema", token.validateToken, controller.registrarTema);
router.post("/registrarPrioridad", token.validateToken, controller.registrarPrioridad);
router.post("/insertarDeterminantes", token.validateToken, controller.insertarDeterminantes);
router.post("/consultarDeterminantes", token.validateToken, controller.consultarDeterminantes);
router.post("/actualizarDeterminantes", token.validateToken, controller.actualizarDeterminantes);
router.post("/desactivarDeterminantes", token.validateToken, controller.desactivarDeterminantes);

module.exports = router;