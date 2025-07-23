const db = require("../config/database");

async function getGender(postData) {
    let response = {};
    try {
        let sql = `CALL api_GET_GENDER(?)`;
        let result = await db.query(sql,[postData.idGender]);
        response = JSON.parse(JSON.stringify(result[0][0]));
        if (response.status == 200) {
            response.model = JSON.parse(JSON.stringify(result[1][0]));
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}


module.exports = {
    getGender
}