const db = require("../config/database");
const utils = require("../api/utils/utils");


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
                        fileName: directorioAsunto + `/${postData.documento.name}`,
                        fileNameBd: directoryBd + `/${postData.documento.name}`, /* quitar tipo de postData.documento si consulta */
                        base64: new Buffer.from(postData.documento.fileEncode64, 'base64')
                    };        
                    let responseDP = await utils.writeFile(finalFileDocPrincipal);            
                    if(responseDP.status == 200){
                        let resultFileBD3  = await db.query(sqlDocumentosAsunto, [
                            response.model.idAsunto,
                            postData.documento.tipoDocumento,
                            postData.documento.name,
                            finalFileDocPrincipal.fileNameBd,
                            postData.documento.size,
                            postData.idUsuarioRegistra
                        ]);
                    }
                    
                }
                    for (const element of postData.anexos) {        
                        var finalFile = {
                            fileName: directorioAsunto + `/$Anexos/${element.name}`,
                        fileNameBd: directoryBd + `/$Anexos/${element.name}`, /* quitar tipo de documento si consulta */
                        base64: new Buffer.from(element.fileEncode64, 'base64')
                    };            
                    let responseItem = await utils.writeFile(finalFile);            
                    if(responseItem.status == 200){
                        let resultFileBD3  = await db.query(sqlDocumentosAsunto, [
                            response.model.idAsunto,
                            element.tipoDocumento,
                            element.name,
                            finalFile.fileNameBd,
                            element.size,
                            postData.idUsuarioRegistra
                        ]);
                    }
                } 
                

        }
        return response;
    } catch (ex) {
        throw ex;
    }

}


module.exports = {
    registrarAsunto
}