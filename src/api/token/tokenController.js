const winston = require("../../config/winston");
var jwt = require('jsonwebtoken')
var jwtClave = 'DGTIC-jwt_21';
var jwtTimeToken = 60 * 60 * 24; // expires in 24 hours


async function generateToken(req, res) {
    let user = "api-cdcsp-ws";
    let pass = "Abcde1";

    try {        
            var tokenData = {
                user: user,
                pass: pass
            }
            var token = jwt.sign(tokenData, jwtClave, {
                expiresIn: jwtTimeToken
            })
            res.status(200).json({ status: 200, token: token, message: "Successfully generated token" });
            
        
    }
    catch (err) {
        res.status(500).json({ status: 500, message: "Internal server error" });
    }
}

function validateToken(request, response,next) {
    return next(); /*enable for testing   */
    winston.info("Token: " + request.headers['authorization-ug']);
    var token = request.headers['authorization-ug']
    var result = { estatus: -1, mensaje: " " }
    if (!token) {
        result.mensaje = "Authentication token required"
        return response.status(401).json(result);
    }
    if (!token.includes("Bearer-UG")) {
        result.mensaje = "Authentication bearer required"
        return response.status(401).json(result);
    }
    token = token.replace('Bearer-UG ', '')
    jwt.verify(token, jwtClave, function (err, user) {
        if (err) {
            result.mensaje = "Invalid token";
            return response.status(401).json(result);
        } else {
            result.mensaje = "Correct token"
            result.estatus = 200;
        }
    });
    return next();
}

function generateTokenByUser(user) {
    try {
        var token = jwt.sign(user, jwtClave, {
            expiresIn: jwtTimeToken
        })
        return token;
    }
    catch (err) {
        throw err;
    }
}

module.exports = {
    generateToken,
    validateToken,
    generateTokenByUser
}