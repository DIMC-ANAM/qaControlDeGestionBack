const { Router } = require("express");
const router = Router();
const controller = require("../test/testController");

/*Servicio de prueba
Request: http://localhost:8393/test/testService
Response:
    status:
    message:
    Model:{}*/
router.get("/testService",controller.testService);

module.exports = router;