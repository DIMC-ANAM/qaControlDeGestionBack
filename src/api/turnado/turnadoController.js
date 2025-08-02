const turnadoDAO = require("../../DAO/turnadoDAO");
const utils = require("../utils/utils");
const pdf = require("../utils/pdf");
const csv = require("../utils/csv");
const path = require('path');
const fs = require('fs');
const Archiver = require("archiver");



async function consultarTurnados(req, res) {
    try {
        const postData = req.body;
            let data = await turnadoDAO.consultarTurnados(postData);
            return res.status(200).json(data);
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}


module.exports = {
    consultarTurnados
}
