const asuntoDAO = require("../../DAO/asuntoDAO");
const utils = require("../utils/utils");
const pdf = require("../utils/pdf");
const csv = require("../utils/csv");
const path = require('path');
const fs = require('fs');
const Archiver = require("archiver");

async function registrarAsunto(req, res) {
    try {
        const postData = req.body;
        if (Object.keys(postData).length !== 0) {
            let data = await asuntoDAO.registrarAsunto(postData);
            return res.status(200).json(data);
        } else {
            res.status(400).json(utils.postDataInvalido(postData));
        }
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}

async function turnarAsunto(req, res) {
    try {
        const postData = req.body;
        if (Object.keys(postData).length !== 0) {
            let data = await asuntoDAO.turnarAsunto(postData);
            return res.status(200).json(data);
        } else {
            res.status(400).json(utils.postDataInvalido(postData));
        }
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}

async function consultarAsuntosUR(req, res) {
    try {
        const postData = req.body;
            let data = await asuntoDAO.consultarAsuntosUR(postData);
            return res.status(200).json(data);
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}

async function consultarDetalleAsunto(req, res) {
    try {
        const postData = req.body;
            let data = await asuntoDAO.consultarDetalleAsunto(postData);
            return res.status(200).json(data);
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}

async function consultarExpedienteAsunto(req, res) {
    try {
        const postData = req.body;       
        
            let data = await asuntoDAO.consultarExpedienteAsunto(postData);
            return res.status(200).json(data);
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}

async function consultarTurnados(req, res) {
    try {
        const postData = req.body;
            let data = await asuntoDAO.consultarTurnados(postData);
            return res.status(200).json(data);
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}
async function reemplazarDocumento(req, res) {
    try {
        const postData = req.body;
            let data = await asuntoDAO.reemplazarDocumento(postData);
            return res.status(200).json(data);
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}
async function agregarAnexos(req, res) {
    try {
        const postData = req.body;
            let data = await asuntoDAO.agregarAnexos(postData);
            return res.status(200).json(data);
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}
async function eliminarDocumento(req, res) {
    try {
        const postData = req.body;
            let data = await asuntoDAO.eliminarDocumento(postData);
            return res.status(200).json(data);
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}
async function concluirAsunto(req, res) {
    try {
        const postData = req.body;
            let data = await asuntoDAO.concluirAsunto(postData);
            return res.status(200).json(data);
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}
async function editarAsunto(req, res) {
    try {
        const postData = req.body;
            let data = await asuntoDAO.editarAsunto(postData);
            return res.status(200).json(data);
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}
async function consultarHistorial(req, res) {
    try {
        const postData = req.body;
            let data = await asuntoDAO.consultarHistorial(postData);
            return res.status(200).json(data);
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}
module.exports = {
    registrarAsunto,
    consultarAsuntosUR,
    consultarDetalleAsunto,
    consultarExpedienteAsunto,
    consultarTurnados,
    turnarAsunto,
    reemplazarDocumento,
    agregarAnexos,
    eliminarDocumento,
    concluirAsunto,
    editarAsunto,
    consultarHistorial
}
