const { Router } = require("express");
const router = Router();
const controller = require("./userController");
const token = require("../token/tokenController");

/*
*   Servicio para registro de usuarios.
*   Endpoint http://168.255.101.89:9051/usuario/registrarUsuario
*   Endpoint http://localhost:9051/usuario/registrarUsuario
*   status: 
*   message: 
*   postData: {correo, contrasena , ...}
*/
router.post("/registrarUsuario", token.validateToken, controller.createUser);


/*
*   Servicio para registro de usuarios.
*   Endpoint http://168.255.101.89:9051/usuario/logIn
*   Endpoint http://localhost:9051/usuario/logIn
*   status: 
*   message: 
*   postData: {correo, contrasena , ...}
*/
router.post("/logIn", token.validateToken, controller.logIn);

/*
*   Servicio para registro de usuarios.
*   Endpoint http://168.255.101.89:9051/usuario/verificarCorreo
*   Endpoint http://localhost:9051/usuario/verificarCorreo
*   status: 
*   message: 
*   postData: {correo, contrasena , ...}
*/
router.post("/verificarCorreo"/* , token.validateToken */, controller.confirmEmail);


/*Servicio para el registro de enlaces estatales. 
Request: http://localhost:9051/usuario/consultarUsuarioPorHash
Response:
    status:
    message:
Model:{}
*/
router.post("/consultarUsuarioPorHash", token.validateToken, controller.getUserByHash);

/*Servicio para el registro de enlaces estatales. 
Request: http://localhost:9051/usuario/solicitarRestablecerContrasena
Response:
    status:
    message:
Model:{}
*/
router.post("/solicitarRestablecerContrasena", token.validateToken, controller.resetPasswordRequest);

/*Servicio para el registro de enlaces estatales. 
Request: http://localhost:9051/usuario/actualizarContrasena
Response:
    status:
    message:
Model:{}
*/
router.post("/actualizarContrasena", token.validateToken, controller.updatePassword);


/**
 * ----------------------------------------
 * ----------------EXPORTS-----------------
 */
module.exports = router;