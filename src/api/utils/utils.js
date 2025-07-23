const winston = require("../../config/winston");
const path = require('path');
const crypto = require('crypto');
const fs=require('fs');

function invalidPostData(postData) {
    return {
        status: -1,
        message: "Please, check your input data parameters. ",
        error: postData
    }
}

function genericError(ex) {
    winston.error(ex);
    return {
        status: -1,
        message: " Error, please call to technical support",
        /* error: ex */
    }
}

async function encryptPassword(passw) {
    try {

        return crypto.createHash('sha256').update(passw).digest('hex');

    } catch (error) {
        throw error;
    }
};

function checkDirectorySync(directory) {
    try {
        fs.mkdir(directory,function(e){ if(!e || (e && e.code === 'EEXIST')){ } 
        else {  
            fs.mkdirSync(directory,{recursive: true});
        }
    });
    } catch(e) {    
    throw e;
    }
}

function unlinkDirectory(directory){
    try{
        fs.rmdirSync(directory, { recursive: true, });
    } catch(e){
        throw e;
    }
}

function unlinkFile(ruta){
    try{
        let location = path.resolve(`./src/`+ ruta)
        try {
            fs.unlinkSync(location);
        } catch (ex) {
            console.log(ex);
        }
    }catch(e){
        console.log("File not found" + location);
    }
    
}

/**
 * +:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 * +::::::::::::::::::::::::::FUNCIONES AUXILIARES:::::::::::::::::::::::
 * +:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 */
async function writeFile(finalFile) {
    return new Promise((resolve, rejec) => {
        fs.writeFile(finalFile.fileName, finalFile.base64, 'base64', function (err) {
            if (err) {
                let response3 = { status: 101, message: "Error processing file" + err };
                return resolve(response3);
            }
            else {
                let response3 = { status: 200, message: "File record success: " + finalFile.fileName };
                return resolve(response3);
            }
        });
    })
}


module.exports = {
    invalidPostData,
    genericError,
    encryptPassword,
    checkDirectorySync,
    writeFile,
    unlinkFile,
    unlinkDirectory,

}