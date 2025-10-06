
const userDAO = require("../../DAO/userDAO");
const token = require("../token/tokenController");

const utils = require("../utils/utils");
const email = require("../utils/email");

const config = require("../../config/config");


async function logIn(req, res) {
    try {
        const postData = req.body;
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        if (Object.keys(postData).length !== 0) {
            postData.ip = clientIp;
            console.log(postData);
            
            let data = await userDAO.logIn(postData);
            if (data.status == 200) {
                data.model.tokenWs = token.generateTokenByUser(data.model);
            }
            return res.status(200).json(data);
        } else {
            res.status(400).json(utils.invalidPostData(postData));
        }
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function createUser(req, res) {
    try {
        const postData = req.body;
        if (Object.keys(postData).length !== 0) {

            let data = await userDAO.createUser(postData);                
            /* if (data.status == 200) {
                email.sendNotification(1,data.model);
            }    */      
            return res.status(200).json(data);            
        } else {
            res.status(400).json(utils.invalidPostData(postData));
        }
    } catch (ex) {
        res.status(500).json(utils.errorGenerico(ex));
    }
}
async function getUsuariosAdmin(req, res) {
    try {
        const postData = req.body;
        if (Object.keys(postData).length !== 0) {
            let data = await userDAO.getUsuariosAdmin(postData);                                 
            return res.status(200).json(data);            
        } else {
            res.status(400).json(utils.invalidPostData(postData));
        }
    } catch (ex) {
        res.status(500).json(utils.genericError(ex));
    }
}


/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function confirmEmail(req, res) {
    try {
        const postData = req.body;
        if (Object.keys(postData).length !== 0) {
                 
            let data = await userDAO.confirmEmail(postData);
            
            return res.status(200).json(data);
        } else {
            res.status(400).json(utils.invalidPostData(postData));
        }
    } catch (ex) {
        res.status(500).json(utils.genericError(ex));
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function getUserByHash(req, res) {
    try {
        const postData = req.body;
        if (Object.keys(postData).length !== 0) {    
            let data = await userDAO.getUserByHash(postData);
            
            return res.status(200).json(data);
        } else {
            res.status(400).json(utils.invalidPostData(postData));
        }
    } catch (ex) {
        res.status(500).json(utils.genericError(ex));
    }
}

/**
    recibe correo electronico por cambiar la contraseña si 200 es que encontro el correo y genera el hash 
    data model trae el correo y el hash
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function resetPasswordRequest(req, res) {
    try {
        const postData = req.body;
        if (Object.keys(postData).length !== 0) {
            let data = await userDAO.resetPasswordRequest(postData);
            if (data.status == 200) {
                email.sendNotification(2,data.model);
            }
            return res.status(200).json(data);
        } else {
            res.status(400).json(utils.invalidPostData(postData));
        }
    } catch (ex) {
        res.status(500).json(utils.genericError(ex));
    }
}

/**
 *  recibe el ID usuario producto de la consulta de usuario por hash, el hash y la nueva password
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function updatePassword(req, res) {
    try {
        const postData = req.body;
        if (Object.keys(postData).length !== 0) {   
            let data = await userDAO.updatePassword(postData);                                    
            return res.status(data.status).json(data);
        } else {
            res.status(400).json(utils.invalidPostData(postData));
        }
    } catch (ex) {
        res.status(500).json(utils.genericError(ex));
    }
}
module.exports = {
    createUser,
    confirmEmail,
    logIn,
    getUserByHash,
    resetPasswordRequest,
    updatePassword,
    getUsuariosAdmin
}