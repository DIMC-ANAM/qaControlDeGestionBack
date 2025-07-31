const winston = require("../../config/winston");
let pathDestino = "src/funcionarios";
const pathImagenDefault = "src/imgs/eventos/default.jpg";
const path = require('path');
const db = require("../../config/database");
const crypto = require('crypto');
const base64 = require('base64topdf');
const base64Img = require('base64-img');
const fs = require('fs');

function postDataInvalido(postData) {
    return {
        status: -1,
        message: "Por favor, revisa el parámetro de entrada.",
        error: postData
    }
}
function nullError(postData) {
    return {
        status: -1,
        message: "Los valores deben ser diferentes a null",
        error: postData
    }
}

function errorGenerico(ex) {
    winston.error(ex);
    return {
        status: -1,
        message: "Ocurrió un error interno, contactar a soporte técnico.",
        error: ex
    }
}

async function encriptarContrasena(contrasena) {
    try {
        return await crypto.createHmac('sha256', contrasena)
            .update('DivagSystems')
            .digest('hex');;
    } catch (error) {
        throw error;
    }
};

//libreria base64topdf
function base64ToPdf(pdfBase64, curp, filename) {
    let path;
    try {
        path = pathDestino + "/" + curp;
        checkDirectorySync(path);
        var urlPath = path + "/" + filename + ".pdf";
        console.log("Path pdf", urlPath);
        base64.base64Decode(pdfBase64, urlPath);
        return urlPath;
    } catch (error) {
        console.log(error);
    }
}

//libreria base64-img
function base64ToImage(imageBase64, curp, filename) {
    try {
        return base64Img.imgSync(imageBase64, pathDestino + "/" + curp, filename);
    } catch (error) {
        console.log(error);
    }
}

function getMonthName(month) {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return monthNames[month];
}

function checkDirectorySync(directory) {
    try {
        fs.mkdir(directory, function (e) {
            if (!e || (e && e.code === 'EEXIST')) { } else {
                fs.mkdirSync(directory, { recursive: true });
            }
        });
    } catch (e) {
        throw e;
    }
}

async function getCURPRenapo(postData) {
    var url = 'http://renapo.sep.gob.mx/wsrenapo/wsConsultaCURPSEP?wsdl';
    var soap = require('soap');
    let response;

    return new Promise((resolve, reject) => {
        soap.createClientAsync(url).then((client) => {
            client.setEndpoint('http://renapo.sep.gob.mx/wsrenapo/wsConsultaCURPSEP');
            return client.consultaxCURPAsync({ "String_1": postData.curp });
        }).then((result) => {
            if (result.length > 0) {
                if (result[0].result.tipoError == '0001') {
                    response = {
                        status: 100,
                        message: `No se han encontrado los datos para la CURP en RENAPO: ${postData.curp} mensaje: ${result[0].result.mensaje}`,
                    }
                } else {
                    response = {
                        status: 200,
                        message: "CURP encontrada en RENAPO",
                        model: result[0].result
                    }
                }
            }
            return resolve(response)
        }).catch(function (error) {
            return reject(error)
        });
    });
}

function responseMultiQuery(result, insert) {
    let response = {};
    let insertados = 0;

    for (var x in result) {
        if (typeof result[x][0] === 'object') {
            var e = JSON.parse(JSON.stringify(result[x][0]));
            if (e.status == 200) {
                insertados++;
            }
        }
    }

    if (result.length > 0) {
        response = { "estatus": 200, "mensaje": `Se procesaron '${insert.count}' y se insertaron con exito '${(insertados)}' registros `, "insertados": insertados, "declinados": (insert.count - insertados) };
    } else {
        response = { "estatus": 100, "mensaje": `Error se procesaron '${insert.count}' y se insertaron '${(insertados)}' registros` };
    }
    return response;
};

async function crearSqlPartidas(postData, idTicketPartida) {
    var sqlInsert = ``;
    var count = 0;

    postData.map(x => {
        sqlInsert += `CALL SNISE_SP_REGISTRAR_PARTIDA_SAEC('${idTicketPartida}','${x.idPartida}','${x.cantidad}');`;
        count++;
    });
    console.log(sqlInsert);

    return { "sqlInsert": sqlInsert, "count": count };
};

function crearDirectorioOficioPartida(req) {
}

function crearDirectorio(req) {
}
function crearDirectorioPases(req) {
}

async function cargaOficio(req, idPersona) {
    console.log(req.file);

    try {
        if (req.file) {
            let url = path.resolve(`src/archivos/oficios/${idPersona}/${req.file.originalname}`);
            let ext = path.extname(req.file.originalname).toLocaleLowerCase();
            fs.renameSync(req.file.path, url);
            return `archivos/oficios/${idPersona}/${req.file.originalname}`;
        } else {
            return "El usuario nocargo archivo";
        }

    } catch (error) {
        throw error;
    }
}
async function cargaPase(req, idLayoutReporteSep) {
    console.log(idLayoutReporteSep);

    try {
        if (req.file) {
            let url = path.resolve(`src/archivos/pases/${idLayoutReporteSep}.pdf`);
            // let url = path.resolve(`src/archivos/pases/${idLayoutReporteSep}/${req.file.originalname}`);

            let ext = path.extname(req.file.originalname).toLocaleLowerCase();
            fs.renameSync(req.file.path, url);
            return `archivos/pases/${idLayoutReporteSep}.pdf`;
        } else {
            return "El usuario no cargo archivo";
        }

    } catch (error) {
        throw error;
    }
}

async function cargaOficioPartida(req, idPersona) {
    console.log(req.file);

    try {
        if (req.file) {
            let url = path.resolve(`src/archivos/oficios_partida/${idPersona}/${req.file.originalname}`);
            let ext = path.extname(req.file.originalname).toLocaleLowerCase();
            fs.renameSync(req.file.path, url);
            return `archivos/oficios_partida/${idPersona}/${req.file.originalname}`;
        } else {
            return "El usuario no cargo archivo partida";
        }

    } catch (error) {
        throw error;
    }
}

async function sendDatosEquipoSESI(postData) {
    try {
        //var url = 'https://sesiprue.sep.gob.mx/services/obtenerDatosEquipo.wsdl';
        var url = 'https://sesi.sep.gob.mx/services/obtenerDatosEquipo.wsdl';
        var soap = require('soap');
        let response;

        return new Promise((resolve, reject) => {
            soap.createClientAsync(url).then((client) => {
                client.setEndpoint('https://sesi.sep.gob.mx/services/obtenerDatosEquipo');
                return client.getDatosEquipoAsync({
                    "curp": postData.curp,
                    "numSerie": postData.serie,
                    "idPartida": postData.idPartidaSesi,
                    "tipoOperacion": 1,
                    "correo": postData.correoElectronico
                });
            }).then((result) => {
                if (result.length > 0) {
                    if (result[0].statusOper !== '5') {
                        response = {
                            status: 100,
                            message: `Error al registrar el equipo en SESI, mensaje: ${result[0].tipoError}`,
                        }
                    } else {
                        response = {
                            status: 200,
                            message: "Registro correcto",
                            model: result[0]
                        }
                    }
                }
                return resolve(response)
            }).catch(function (error) {
                
                return reject(error)
            });
        });
    } catch (error) {
        console.log(error);
    }


}

/* async function writeFile(finalFile) {
    return new Promise((resolve, rejec) => {
        fs.writeFile(finalFile.fileName, finalFile.base64, 'base64', function (err) {
            if (err) {
                let response3 = { status: 101, message: "Error processing file" + err };
                return resolve(response3);
            }
            else {
                let response3 = { status: 200, message: "Se ha escrito de manera correcta el archivo: " + finalFile.fileName };
                return resolve(response3);
            }
        });
    })
} */

function unlinkFile(ruta){
    try{
        let ubicacion = path.resolve(`./src/`+ ruta)
        //console.log("******Ubicacion: ", ubicacion)
        try {
            fs.unlinkSync(ubicacion);
        } catch (ex) {
            console.log(ex);
        }
    }catch(e){
        console.log("Archivo no encontrado " + ubicacion);
    }
    
}

async function writeFile(finalFile) {
    return new Promise((resolve, reject) => {
        fs.writeFile(finalFile.fileName, finalFile.base64, 'base64', (err) => {
            if (err) {
                console.error(`Error escribiendo archivo ${finalFile.fileName}:`, err);
                return reject(new Error(`Error processing file: ${err.message}`));
            }
            resolve({ status: 200, message: `Se ha escrito correctamente el archivo: ${finalFile.fileName}` });
        });
    });
}

function unlinkFile(ruta){
    try{
        let ubicacion = path.resolve(`./src/`+ ruta)
        //console.log("******Ubicacion: ", ubicacion)
        try {
            fs.unlinkSync(ubicacion);
        } catch (ex) {
            console.log(ex);
        }
    }catch(e){
        console.log("Archivo no encontrado " + ubicacion);
    }
    
}


function ensureDirectoryExistsSync(directory) {
    try {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
            console.log(`Directorio creado: ${directory}`);
        } else {
            // Opcional: console.log(`Directorio ya existe: ${directory}`);
        }
    } catch (err) {
        console.error(`Error creando directorio ${directory}:`, err);
        throw err; // para que el error se propague y puedas detectarlo
    }
}

module.exports = {
    postDataInvalido,
    errorGenerico,
    encriptarContrasena,
    base64ToPdf,
    base64ToImage,
    getMonthName,
    checkDirectorySync,
    getCURPRenapo,
    responseMultiQuery,
    crearSqlPartidas,
    cargaOficio,
    crearDirectorio,
    crearDirectorioOficioPartida,
    crearDirectorioPases,
    cargaOficioPartida,
    cargaPase,
    sendDatosEquipoSESI
    ,writeFile
    ,unlinkFile
    ,nullError
    ,unlinkFile
    ,ensureDirectoryExistsSync
}