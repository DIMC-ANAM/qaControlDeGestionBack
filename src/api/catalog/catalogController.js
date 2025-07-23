const catalogDAO = require("../../DAO/catalogDAO");
const utils = require("../utils/utils")

/**
 * Into controller files, you will add the logic and calls to DAO objects 
 * 
 */
async function getGender(req, res) {
    try {
        let data = await catalogDAO.getGender(req.body);
        return res.status(200).json(data);
    } catch (ex) {
        res.status(500).json(utils.genericError(ex));
    }
}

module.exports = {
    getGender
}