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
async function consultarUnidadAdministrativa(req, res) {
    try {
        let data = await catalogDAO.consultarUnidadAdministrativa(req.body);
        return res.status(200).json(data);
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}
async function consultarInstruccion(req, res) {
    try {
        let data = await catalogDAO.consultarInstruccion(req.body);
        return res.status(200).json(data);
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}
async function consultarDependencia(req, res) {
    try {
        let data = await catalogDAO.consultarDependencia(req.body);
        return res.status(200).json(data);
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}
async function consultarUsuarioRol(req, res) {
    try {
        let data = await catalogDAO.consultarUsuarioRol(req.body);
        return res.status(200).json(data);
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}

async function registrarTema(req, res) {
    try {
        let data = await catalogDAO.registrarTema(req.body);
        return res.status(200).json(data);
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}

async function registrarPrioridad(req, res){
    try {
        let data = await catalogDAO.registrarPrioridad(req.body);
        return res.status(200).json(data);
    }catch (ex){
        res.status(500).json(utils.errorGenerico(ex));
    }
}

async function insertarDeterminantes(req, res){
    try {
        let data = await catalogDAO.insertarDeterminantes(req.body);
        return res.status(200).json(data);
    }catch (ex){
        res.status(500).json(utils.errorGenerico(ex));
    }   
}

async function consultarDeterminantes(req, res){
    try{
        let data =  await catalogDAO.consultarDeterminantes(req.body);
        return res.status(200).json(data);
    }catch (ex){
        res.status(500).json(utils.errorGenerico(ex));
    }
}

async function actualizarDeterminantes(req, res){
    try{
        let data = await catalogDAO.actualizarDeterminantes(req.body);
        return res.status(200).json(data);
    }catch(ex){
        res.status(500).json(utils.errorGenerico(ex));
    }
}

async function desactivarDeterminantes(req, res) {
    try{
        let data = await catalogDAO.desactivarDeterminantes(req.body);
        return res.status(200).json(data);
    }catch (ex){
        res.status(500).json(utils.errorGenerico(ex));
    }
}


module.exports = {
    consultarTema,
    consultarPrioridad,
    consultarMedioRecepcion,
    consultarTipoDocumento,
    consultarUnidadAdministrativa,
    consultarInstruccion,
    consultarDependencia,
    consultarUsuarioRol,
    registrarTema,
    registrarPrioridad,
    insertarDeterminantes,
    consultarDeterminantes,
    actualizarDeterminantes,
    desactivarDeterminantes,
}

