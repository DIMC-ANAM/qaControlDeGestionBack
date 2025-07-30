const catalogDAO = require("../../DAO/catalogDAO");
const utils = require("../utils/utils")

/**
 * Into controller files, you will add the logic and calls to DAO objects 
 * 
 */
async function consultarTema(req, res) {
    try {
        let data = await catalogDAO.consultarTema(req.body);
        return res.status(200).json(data);
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}
async function consultarPrioridad(req, res) {
    try {
        let data = await catalogDAO.consultarPrioridad(req.body);
        return res.status(200).json(data);
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}
async function consultarTipoDocumento(req, res) {
    try {
        let data = await catalogDAO.consultarTipoDocumento(req.body);
        return res.status(200).json(data);
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}
async function consultarMedioRecepcion(req, res) {
    try {
        let data = await catalogDAO.consultarMedioRecepcion(req.body);
        return res.status(200).json(data);
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}

module.exports = {
    consultarTema,
    consultarPrioridad,
    consultarMedioRecepcion,
    consultarTipoDocumento
}