const db = require("../config/database");

async function consultarTema(postData) {
    let response = {};
    try {
        let sql = `CALL SP_CONSULTAR_TEMA()`;
        let result = await db.query(sql);
        response = JSON.parse(JSON.stringify(result[0][0]));
        if (response.status == 200) {
            response.model = JSON.parse(JSON.stringify(result[1]));
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}

async function consultarPrioridad(postData) {
    let response = {};
    try {
        let sql = `CALL SP_CONSULTAR_PRIORIDAD()`;
        let result = await db.query(sql);
        response = JSON.parse(JSON.stringify(result[0][0]));
        if (response.status == 200) {
            response.model = JSON.parse(JSON.stringify(result[1]));
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}
async function consultarTipoDocumento(postData) {
    let response = {};
    try {
        let sql = `CALL SP_CONSULTAR_TIPO_DOCUMENTO()`;
        let result = await db.query(sql);
        response = JSON.parse(JSON.stringify(result[0][0]));
        if (response.status == 200) {
            response.model = JSON.parse(JSON.stringify(result[1]));
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}
async function consultarMedioRecepcion(postData) {
    let response = {};
    try {
        let sql = `CALL SP_CONSULTAR_MEDIO_RECEPCION()`;
        let result = await db.query(sql);
        response = JSON.parse(JSON.stringify(result[0][0]));
        if (response.status == 200) {
            response.model = JSON.parse(JSON.stringify(result[1]));
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}
async function consultarUnidadAdministrativa(postData) {
    let response = {};
    try {
        let sql = `CALL SP_CONSULTAR_UNIDAD_RESPONSABLE(?,?)`;
        let result = await db.query(sql,[postData.esUnidadAdministrativa || 0 , postData.esUnidadDeNegocio || 0]);
        response = JSON.parse(JSON.stringify(result[0][0]));
        if (response.status == 200) {
            response.model = JSON.parse(JSON.stringify(result[1]));
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}
async function consultarInstruccion(postData) {
    let response = {};
    try {
        let sql = `CALL SP_CONSULTAR_INSTRUCCION()`;
        let result = await db.query(sql);
        response = JSON.parse(JSON.stringify(result[0][0]));
        if (response.status == 200) {
            response.model = JSON.parse(JSON.stringify(result[1]));
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}
async function consultarDependencia(postData) {
    let response = {};
    try {
        let sql = `CALL SP_CONSULTAR_DEPENDENCIAS(?,?)`;
        let result = await db.query(sql,[postData.idDependencia || 0, postData.opcion || 0 ]);
        response = JSON.parse(JSON.stringify(result[0][0]));
        if (response.status == 200) {
            response.model = JSON.parse(JSON.stringify(result[1]));
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}


module.exports = {
    consultarTema,
    consultarPrioridad,
    consultarMedioRecepcion,
    consultarTipoDocumento,
    consultarUnidadAdministrativa,
    consultarInstruccion,
    consultarDependencia
}