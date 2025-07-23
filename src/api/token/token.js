const { Router } = require("express");
const router = Router();
const controller = require("./tokenController");

router.post("/generateToken",controller.generateToken);

module.exports = router;