const db = require("../config/database");
const utils  = require("../api/utils/utils");

async function logIn(postData) {
    let response = {};
    try {
        let cryptPassw = await utils.encryptPassword(postData.password);
        let sql = `CALL api_SP_LOG_IN (?,?)`;
        let result = await db.query(sql, [postData.user, cryptPassw]);
        
        response = JSON.parse(JSON.stringify(result[0][0]));
        
        if(response.status == 200){
            response.model = JSON.parse(JSON.stringify(result[1][0]));
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}


async function createUser(postData) {
    let response = {};

    try {

        let sql = `CALL erde_SP_CREATE_USER (
            ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,? 
        )`;
        let encryptPassword = await utils.encryptPassword(postData.contrasena);        
        let result = await db.query(sql, [
            postData.nombre,
            postData.primerApellido,
            postData.segundoApellido || '',
            /* postData.fechaNacimiento,
            postData.idGenero,
            postData.idEstadoNacimiento,
            postData.idEntidadFederativa,
            postData.idEscuelaProcedencia, */
            postData.correoElectronico,
            encryptPassword
        ]);
        response = JSON.parse(JSON.stringify(result[0][0]));
        if (response.status == 200) {
            response.model = JSON.parse(JSON.stringify(result[1][0]));
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}


async function confirmEmail(postData) {
    let response = {};
    try {
        let sql = `CALL erde_SP_CONFIRM__EMAIL (
            ?
        )`;
        let result = await db.query(sql, [postData.hashCode]);
        response = JSON.parse(JSON.stringify(result[0][0]));
        return response;
    } catch (ex) {
        throw ex;
    }
}

async function getUserByHash(postData) {
    let response = {};
    try {

        let sql = `CALL erde_SP_GET_USER_BY_HASH (
            ?
        )`;

        let result = await db.query(sql, [postData.hashCode]);
        response = JSON.parse(JSON.stringify(result[0][0]));
        
        if (response.status == 200) {    
            response.model = JSON.parse(JSON.stringify(result[1][0]));        
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}

async function resetPasswordRequest(postData) {
    let response = {};
    try {

        let sql = `CALL erde_SP_GET_HASH_USUARIO (?)`;

        let result = await db.query(sql, [postData.email]);
        response = JSON.parse(JSON.stringify(result[0][0]));
        
        if (response.status == 200) {    
            response.model = JSON.parse(JSON.stringify(result[1][0]));        
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}


async function updatePassword(postData) {
    let response = {};
    try {

        let sql = `CALL erde_SP_UPDATE_PASSWORD (?,?,?)`;
        let encryptPassword = await utils.encryptPassword(postData.password);
        let result = await db.query(sql, [postData.userId,postData.hashCode,encryptPassword]);
        
        response = JSON.parse(JSON.stringify(result[0][0]));
        
        return response;
    } catch (ex) {
        throw ex;
    }
}
module.exports = {
    createUser,
    confirmEmail,
    logIn,
    getUserByHash,
    resetPasswordRequest,
    updatePassword
}
