const db = require("../config/database");
const utils = require("../api/utils/utils");

/**
 * 
 * @param {*} postData 
 */
async function obtenerCorreoRechazoPeticion(postData) {
    let response = {};
    try {
        let sql = `CALL snise_SP_OBTENER_CORREO_RECHAZO_PETICION (?)`;
        let result = await db.query(sql, [postData.idPeticion]);
        response = JSON.parse(JSON.stringify(result[0][0]));
        if (response.status == 200) {
            response.model = JSON.parse(JSON.stringify(result[1][0]));
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}

async function obtenerCorreoCartaAmableOC(postData) {
    let response = {};
    try {
        let sql = `CALL snise_SP_OBTENER_CORREO_CARTA_AMABLEOC (?,?)`;
        let result = await db.query(sql, [postData.idPeticion, postData.idAsignacion]);
        response = JSON.parse(JSON.stringify(result[0][0]));
        if (response.status == 200) {
            response.model = JSON.parse(JSON.stringify(result[1][0]));
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}


async function obtenerCorreoCartaAmableOSFAE(postData) {
    let response = {};
    try {
        let sql = `CALL snise_SP_OBTENER_CORREO_CARTA_AMABLEOSFAE (?,?)`;
        let result = await db.query(sql, [postData.idPeticion, postData.idTurnado]);
        response = JSON.parse(JSON.stringify(result[0][0]));
        if (response.status == 200) {
            response.model = JSON.parse(JSON.stringify(result[1][0]));
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}

async function obtenerCorreoRechazoAsignacion(postData) {
    let response = {};
    try {
        let sql = `CALL snise_SP_OBTENER_CORREO_RECHAZO_ASIGNACION (?,?)`;
        let result = await db.query(sql, [postData.idPeticion, postData.idTurnado]);
        response = JSON.parse(JSON.stringify(result[0][0]));
        if (response.status == 200) {
            response.model = JSON.parse(JSON.stringify(result[1][0]));
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}
async function bodyPaseSalida(postData) {
    let response = {};
    try {
        let sql = `CALL snise_SP_OBTENER_CORREO_PASE_SALIDA (?)`;
        // let result = await db.query(sql, [postData.idPeticion, postData.idTurnado]);
        let result = await db.query(sql, [postData.idLayoutReporteSep]);
        response = JSON.parse(JSON.stringify(result[0][0]));
        if (response.status == 200) {
            response.model = JSON.parse(JSON.stringify(result[1][0]));
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}
async function bodyResguardoCorreo(postData) {
    let response = {};
    try {
        let sql = `CALL SP_OBTENER_CORREO_RESGUARDO (?)`;
        // let result = await db.query(sql, [postData.idPeticion, postData.idTurnado]);
        let result = await db.query(sql, [postData.idFormato]);
        response = JSON.parse(JSON.stringify(result[0][0]));
        if (response.status == 200) {
            response.model = JSON.parse(JSON.stringify(result[1][0]));
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}
async function obtenerCorreoRespuestaEnlance(postData) {
    let response = {};
    try {
        let sql = `CALL snise_SP_OBTENER_CORREO_RESPUESTA_ENLACE (?,?)`;
        let result = await db.query(sql, [postData.idPeticion, postData.idTurnado]);
        response = JSON.parse(JSON.stringify(result[0][0]));
        if (response.status == 200) {
            response.model = JSON.parse(JSON.stringify(result[1][0]));
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}
async function obtenerCorreoRespuestaSGIS(postData) {
    let response = {};
    try {
        let sql = `CALL snise_SP_OBTENER_CORREO_RESPUESTA_SGIS (?,?)`;
        let result = await db.query(sql, [postData.idPeticion, postData.idTurnado]);
        response = JSON.parse(JSON.stringify(result[0][0]));
        if (response.status == 200) {
            response.model = JSON.parse(JSON.stringify(result[1][0]));
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}
async function obtenerCorreoVoboRechazo(postData) {
    let response = {};
    try {
        let sql = `CALL snise_SP_OBTENER_CORREO_VOBO_RECHAZO (?,?)`;
        let result = await db.query(sql, [postData.idPeticion, postData.idTurnado]);
        response = JSON.parse(JSON.stringify(result[0][0]));
        if (response.status == 200) {
            response.model = JSON.parse(JSON.stringify(result[1][0]));
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}







/**
 * 
 *

async function actualizarEtapaPeticion(postData) {
    let response = {};
    try {
        let sql = `CALL SAS_SP_ACTUALIZAR_ETAPA_PETICION(?,?,?)`;
        let result = await db.query(sql,[postData.idPeticion, postData.idEtapaPeticion,postData.idUsuario]);
        response = JSON.parse(JSON.stringify(result[0][0]));
        return response;
    } catch (ex) {
        throw ex;
    }
}
 */


/**
 * ----------------------------------------
 * ----------------EXPORTS-----------------
 */
module.exports = {
    obtenerCorreoRechazoPeticion,
    obtenerCorreoCartaAmableOC,
    obtenerCorreoCartaAmableOSFAE,
    obtenerCorreoRechazoAsignacion,
    obtenerCorreoRespuestaEnlance,
    obtenerCorreoRespuestaSGIS,
    obtenerCorreoVoboRechazo,
    bodyPaseSalida,
    bodyResguardoCorreo
}