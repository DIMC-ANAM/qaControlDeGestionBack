const db = require("../config/database");
const utils = require("../api/utils/utils");
const path = require("path");

async function registrarAsunto(postData) {
    let response = {};
    try {

        let sql = `CALL SP_REGISTRAR_ASUNTO (
           ?,?,?,?,?,?,
           ?,?,?,?,?,?,
           ?,?,?,?,?,?,
           ?,?,?,?,?,?
        )`;
        /* transacción */
        let result = await db.query(sql, [
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
        response = JSON.parse(JSON.stringify(result[0][0]));
        if (response.status == 200) {
            /* guardar la lista de documentos*/
            response.model = JSON.parse(JSON.stringify(result[1][0]));

            if(postData.documento != null){
                
                
                var directorioAsunto = path.resolve(`./src/documentos/Asuntos/Asunto-${response.model.folio}`);
                utils.checkDirectorySync(directorioAsunto);
                var directoryBd = `documentos/Asuntos/Asunto-${response.model.folio}`;   
                let sqlDocumentosAsunto = `CALL SP_REGISTRAR_DOCUMENTO_ASUNTO(
                    ?,?,?,
                    ?,?,?
                    );`;     
                    var finalFileDocPrincipal = {
                        fileName: directorioAsunto + `/${postData.documento.fileName}`,
                        fileNameBd: directoryBd + `/${postData.documento.fileName}`, /* quitar tipo de postData.documento si consulta */
                        base64: new Buffer.from(postData.documento.fileEncode64, 'base64')
                    };        
                    let responseDP = await utils.writeFile(finalFileDocPrincipal);            
                    if(responseDP.status == 200){
                        let resultFileBD3  = await db.query(sqlDocumentosAsunto, [
                            response.model.idAsunto,
                            postData.documento.tipoDocumento,
                            postData.documento.fileName,
                            finalFileDocPrincipal.fileNameBd,
                            postData.documento.size,
                            postData.idUsuarioRegistra
                        ]);
                    }
                    
                }

                /* -------------------------------------------------------------------------------------------------- */
            var directorioAnexos = path.resolve(directorioAsunto + `/Anexos`);
            utils.checkDirectorySync(directorioAnexos);
            var directoryBdAnexos = `documentos/Asuntos/Asunto-${response.model.folio}`;
            /* -------------------------------------------------------------------------------------------------- */
                let promise = await Promise.all([
                await almacenaListaArchivos(postData.anexos,directorioAnexos,directoryBdAnexos, postData.idUsuarioRegistra, response.model.idAsunto),
            ]);

        }
        return response;
    } catch (ex) {
        throw ex;
    }

}


async function consultarAsuntosUR(postData) {
       let response = {};
    try {

        let sql = `CALL SP_CONSULTAR_ASUNTOS_REGISTRADOS_UR (
            ?
        )`;

        let result = await db.query(sql, [postData.idUnidadAdministrativa || 0 ]);
        response = JSON.parse(JSON.stringify(result[0][0]));
        
        if (response.status == 200) {              
            response.model = JSON.parse(JSON.stringify(result[1]));                   
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}

async function consultarDetalleAsuntos(postData) {
       let response = {};
    try {

        let sql = `CALL SP_CONSULTAR_DETALLE_ASUNTO (
            ?
        )`;

        let result = await db.query(sql, [postData.idAsunto ]);
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
    registrarAsunto,
    consultarAsuntosUR,
     consultarDetalleAsuntos

}
async function almacenaListaArchivos(list,directorioAnexos,directoryBd,idUsuarioRegistra,idAsunto){
    
    if(list != null || list.length != 0 ){


        let sqlDocumentosRR = `CALL SP_REGISTRAR_DOCUMENTO_ASUNTO(
            ?,?,?,
            ?,?,?
        );`;     
        for (const element of list) { 
            
            if(element.idDocumento == undefined){        
                var finalFile = {
                    fileName: directorioAnexos + `/${element.fileName}`,
                    fileNameBd: directoryBd + `/${element.fileName}`, /* quitar tipo de documento si consulta */
                    base64: new Buffer.from(element.fileEncode64, 'base64')
                };            
                let responseItem = await utils.writeFile(finalFile);            
                if(responseItem.status == 200){
                    let resultFileBD3  = await db.query(sqlDocumentosRR, [
                        idAsunto,
                        element.tipoDocumentoRobo,
                        element.fileName,
                        finalFile.fileNameBd,
                        element.size,
                        idUsuarioRegistra
                    ]);
                }
            }
        }   
    }
}