const db = require("../config/database");
const utils = require("../api/utils/utils");
const path = require("path");

async function registrarAsunto(postData) {
    let response = {};
    let resultFileBD3 = null; // Asegurada declaración anticipada
    try {
        const sql = `CALL SP_REGISTRAR_ASUNTO (
            ?,?,?,?,?,?,
            ?,?,?,?,?,?,
            ?,?,?,?,?,?,
            ?,?,?,?,?,?
        )`;

        const result = await db.query(sql, [
            postData.idTipoDocumento,
            postData.noOficio,
            postData.esVolante,
            postData.numeroVolante,
            postData.esGuia,
            postData.numeroGuia,
            postData.fechaDocumento,
            postData.fechaRecepcion,
            postData.remitenteNombre,
            postData.remitenteCargo,
            postData.remitenteDependencia,
            postData.dirigidoA,
            postData.dirigidoACargo,
            postData.dirigidoADependencia,
            postData.descripcionAsunto,
            postData.idTema,
            postData.fechaCumplimiento,
            postData.idMedio,
            postData.idPrioridad,
            postData.idUsuarioRegistra,
            postData.usuarioRegistra,
            postData.idUnidadAdministrativa,
            postData.unidadAdministrativa,
            postData.observaciones
        ]);

        // Validar respuesta del procedimiento almacenado
        if (result[0]?.[0]?.status == 200) {
            response = { ...result[0][0] };
            response.model = result[1]?.[0] || {};
            response.docP = null;
            response.anexosResponse = [];

            const folio = response.model?.folio;
            const idAsunto = response.model?.idAsunto;

            if (folio) {
                const directorioAsunto = path.resolve(`./src/documentos/Asuntos/Asunto-${folio}`);
                utils.ensureDirectoryExistsSync(directorioAsunto);
                const directoryBd = `documentos/Asuntos/Asunto-${folio}`;

                // Procesar documento principal
                if (postData.documento) {
                    const sqlDocumentosAsunto = `CALL SP_REGISTRAR_DOCUMENTO_ASUNTO(?,?,?,?,?,?)`;
                    const finalFileDocPrincipal = {
                        fileName: `${directorioAsunto}/${postData.documento.fileName}`,
                        fileNameBd: `${directoryBd}/${postData.documento.fileName}`,
                        base64: Buffer.from(postData.documento.fileEncode64, 'base64')
                    };

                    const responseDP = await utils.writeFile(finalFileDocPrincipal);
                    if (responseDP.status === 200) {
                        resultFileBD3 = await db.query(sqlDocumentosAsunto, [
                            idAsunto,
                            postData.documento.tipoDocumento,
                            postData.documento.fileName,
                            finalFileDocPrincipal.fileNameBd,
                            postData.documento.size,
                            postData.idUsuarioRegistra
                        ]);
                        response.docP = resultFileBD3;
                    } else {
                        console.warn("No se pudo escribir el documento principal.");
                    }
                } else {
                    console.warn("Falta documento principal.");
                }

                // Procesar anexos
                if (Array.isArray(postData.anexos) && postData.anexos.length > 0) {
                    const directorioAnexos = path.resolve(`${directorioAsunto}/Anexos`);
                    utils.ensureDirectoryExistsSync(directorioAnexos);
                    const directoryBdAnexos = `${directoryBd}/Anexos`;

                    const anexosResult = await almacenaListaArchivos(
                        postData.anexos,
                        directorioAnexos,
                        directoryBdAnexos,
                        postData.idUsuarioRegistra,
                        idAsunto
                    );

                    response.anexosResponse = anexosResult;
                }
            }
        } else {
            response = { status: 500, message: 'Error en la ejecución del procedimiento almacenado.' };
        }

        return response;
    } catch (ex) {
        console.error("Error en registrarAsunto:", ex); // ← Esto es importante para entender qué falla
        return {
            status: -1,
            message: "Ocurrió un error interno, contactar a soporte técnico.",
            error: {
                level: "error",
                timestamp: new Date().toISOString()
            }
        };
    }
}




async function consultarAsuntosUR(postData) {
    let response = {};
    try {

        let sql = `CALL SP_CONSULTAR_ASUNTOS_REGISTRADOS_UR (
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

async function consultarDetalleAsunto(postData) {
    let response = {};
    try {

        let sql = `CALL SP_CONSULTAR_DETALLE_ASUNTO (
            ?
        )`;

        let result = await db.query(sql, [postData.idAsunto]);
        response = JSON.parse(JSON.stringify(result[0][0]));

        if (response.status == 200) {
            response.model = JSON.parse(JSON.stringify(result[1][0]));
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}

async function consultarExpedienteAsunto(postData) {
    let response = {};
    try {

        let sql = `CALL SP_CONSULTAR_EXPEDIENTE_ASUNTO (
            ?
        )`;

        let result = await db.query(sql, [postData.idAsunto]);
        response = JSON.parse(JSON.stringify(result[0][0]));
        console.log(response);

        if (response.status == 200) {
            response.model = {
                documento: JSON.parse(JSON.stringify(result[1][0])),
                anexos: JSON.parse(JSON.stringify(result[2])),
            }
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}

async function consultarTurnados(postData) {
    let response = {};
    try {

        let sql = `CALL SP_CONSULTAR_TURNADOS (
            ?
        )`;

        let result = await db.query(sql, [postData.idAsunto]);
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
    registrarAsunto,
    consultarAsuntosUR,
    consultarDetalleAsunto,
    consultarExpedienteAsunto,
    consultarTurnados

}
async function almacenaListaArchivos(list, directorioAnexos, directoryBd, idUsuarioRegistra, idAsunto) {
    let resultAnexosBD = {}
    if (list != null || list.length != 0) {


        let sqlDocumentos = `CALL SP_REGISTRAR_DOCUMENTO_ASUNTO(
            ?,?,?,
            ?,?,?
        );`;
        for (const element of list) {
            var finalFile = {
                fileName: directorioAnexos + `/${element.fileName}`,
                fileNameBd: directoryBd + `/${element.fileName}`, /* quitar tipo de documento si consulta */
                base64: new Buffer.from(element.fileEncode64, 'base64')
            };
            let responseItem = await utils.writeFile(finalFile);
            if (responseItem.status == 200) {
                let resultAnexosBD = await db.query(sqlDocumentos, [
                    idAsunto,
                    element.tipoDocumento,
                    element.fileName,
                    finalFile.fileNameBd,
                    element.size,
                    idUsuarioRegistra
                ]);
            }
        }
    }
    return resultAnexosBD;
}