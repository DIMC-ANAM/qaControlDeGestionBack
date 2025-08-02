const db = require("../config/database");
const utils = require("../api/utils/utils");
const path = require("path");



async function consultarTurnadosUR(postData) {
    let response = {};
    try {

        let sql = `CALL SP_CONSULTAR_TURNADOS_UR (
            ?
        )`;

        let result = await db.query(sql, [postData.idUnidadAdministrativa || 0]);
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
     consultarTurnadosUR
}