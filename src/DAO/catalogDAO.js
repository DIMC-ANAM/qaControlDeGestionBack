const db = require("../config/database");

async function consultarTema(postData) {
  let response = {};
  try {
    let sql = `CALL SP_CONSULTAR_TEMA()`;
    let result = await db.query(sql);
    response = JSON.parse(JSON.stringify(result[0][0]));
    if (response.status == 200) {
      response.model = JSON.parse(JSON.stringify(result[1]));
    }
    return response;
  } catch (ex) {
    throw ex;
  }
}

async function consultarPrioridad(postData) {
  let response = {};
  try {
    let sql = `CALL SP_CONSULTAR_PRIORIDAD()`;
    let result = await db.query(sql);
    response = JSON.parse(JSON.stringify(result[0][0]));
    if (response.status == 200) {
      response.model = JSON.parse(JSON.stringify(result[1]));
    }
    return response;
  } catch (ex) {
    throw ex;
  }
}

async function consultarTipoDocumento(postData) {
  let response = {};
  try {
    let sql = `CALL SP_CONSULTAR_TIPO_DOCUMENTO()`;
    let result = await db.query(sql);
    response = JSON.parse(JSON.stringify(result[0][0]));
    if (response.status == 200) {
      response.model = JSON.parse(JSON.stringify(result[1]));
    }
    return response;
  } catch (ex) {
    throw ex;
  }
}

async function consultarMedioRecepcion(postData) {
  let response = {};
  try {
    let sql = `CALL SP_CONSULTAR_MEDIO_RECEPCION()`;
    let result = await db.query(sql);
    response = JSON.parse(JSON.stringify(result[0][0]));
    if (response.status == 200) {
      response.model = JSON.parse(JSON.stringify(result[1]));
    }
    return response;
  } catch (ex) {
    throw ex;
  }
}

async function consultarUnidadAdministrativa(postData) {
  let response = {};
  try {
    let sql = `CALL SP_CONSULTAR_UNIDAD_RESPONSABLE(?,?)`;
    let result = await db.query(sql, [
      postData.esUnidadAdministrativa || 0,
      postData.esUnidadDeNegocio || 0,
    ]);
    response = JSON.parse(JSON.stringify(result[0][0]));
    if (response.status == 200) {
      response.model = JSON.parse(JSON.stringify(result[1]));
    }
    return response;
  } catch (ex) {
    throw ex;
  }
}

async function consultarInstruccion(postData) {
  let response = {};
  try {
    let sql = `CALL SP_CONSULTAR_INSTRUCCION()`;
    let result = await db.query(sql);
    response = JSON.parse(JSON.stringify(result[0][0]));
    if (response.status == 200) {
      response.model = JSON.parse(JSON.stringify(result[1]));
    }
    return response;
  } catch (ex) {
    throw ex;
  }
}

async function consultarDependencia(postData) {
  let response = {};
  try {
    let sql = `CALL SP_CONSULTAR_DEPENDENCIAS(?,?)`;
    let result = await db.query(sql, [
      postData.idDependencia || 0,
      postData.opcion || 0,
    ]);
    response = JSON.parse(JSON.stringify(result[0][0]));
    if (response.status == 200) {
      response.model = JSON.parse(JSON.stringify(result[1]));
    }
    return response;
  } catch (ex) {
    throw ex;
  }
}
async function consultarUsuarioRol(postData) {
    let response = {};
    try {
        let sql = `CALL SP_CONSULTAR_ROL_USUARIO(?)`;
        let result = await db.query(sql,[postData.idUsuarioRol || 0]);
        response = JSON.parse(JSON.stringify(result[0][0]));
        if (response.status == 200) {
            response.model = JSON.parse(JSON.stringify(result[1]));
        }
        return response;
    } catch (ex) {
        throw ex;
    }
}

    // registrar tema 
async function registrarTema(postData) {
  let response = {};
  try {
    let sql = `CALL SP_REGISTRAR_TEMA(?)`;
    let result = await db.query(sql, [postData?.tema || null]);

    response = JSON.parse(JSON.stringify(result[0][0]));
    if (response.status === 200) {
      response.model = JSON.parse(JSON.stringify(result[1][0])); 
    }
    return response;
  } catch (ex) {
    throw ex;
  }
}
    // Registrar proridad
async function registrarPrioridad(postData){
    let response = {};
    try{
        let sql = 'CALL SP_REGISTRAR_PRIORIDAD(?)';
        let result = await db.query(sql, [postData?.prioridad || null]);

        response = JSON.parse(JSON.stringify(result[0][0]));
        
        if(response.status === 200){
            response.model = JSON.parse(JSON.stringify(result[1][0]))
        }
        return response;
    } catch(ex){
        throw ex;
    }
}

// funciones de determinantes
async function insertarDeterminantes(postData) {
  let response = {};
  try {
    let sql = 'CALL SP_DETERMINANTES_INSERT(?,?,?,?,?,?)';
    let result = await db.query(sql, [
      postData.nivel || null,
      postData.unidadDeNegocio || null,
      postData.unidadAdministrativa || null,
      postData.area || null,
      postData.determinante || null,
      postData.dependencia || null,
    ]);
  
    response = JSON.parse(JSON.stringify(result[0][0]));
    if (response.status === 200) {
      response.model = JSON.parse(JSON.stringify(result[1][0]));
    }
    return response;

  } catch(ex) {
    throw ex;
  }
}



async function consultarDeterminantes(postData) {
  let response = {};
  try {
    let sql = 'CALL SP_DETERMINANTES_READ(?)';
    const id = Number(postData?.id) || 0;
    let result = await db.query(sql, [id]);

    response = JSON.parse(JSON.stringify(result[0][0]));
    if (response.status == 200) {
      const dataSet = JSON.parse(JSON.stringify(result[1] || []));
      response.model = (id === 0) ? dataSet : (dataSet[0] || null);
    }
    return response;

  } catch(ex) {
    throw ex;
  }
}


  // async function consultarDeterminantes(postData){
  //   let response = {};
  //   try{
  //     let sql = 'CALL SP_DETERMINANTES_READ(?)';
  //     let result = await db.query(sql, [postData.id || 0]);
      
  //     response = JSON.parse(JSON.stringify(result[0][0]));
  //     if (response.status == 200){
  //       response.model = JSON.parse(JSON.stringify(result[1][1]));
  //     }
  //     return response;

  //   } catch(ex){
  //     throw ex;
  //   }
  // }


 // actualiza determinantes
 
async function actualizarDeterminantes(postData) {
  let response = {};
  try {
    let sql = 'CALL SP_DETERMINANTES_UPDATE(?,?,?,?,?,?,?)';
    let result = await db.query(sql, [
      postData.id || 0,
      postData.nivel || null,
      postData.unidadDeNegocio || null,
      postData.unidadAdministrativa || null,
      postData.area || null,
      postData.determinante || null, 
      postData.dependencia || null,
    ]);

    response = JSON.parse(JSON.stringify(result[0][0]));
    if (response.status == 200) {
      response.model = JSON.parse(JSON.stringify(result[1]?.[0] || {}));
    }
    return response;
  } catch(ex) {
    throw ex;
  }
}


async function desactivarDeterminantes(postData) {
  let response = {};
  try {
    let sql = 'CALL SP_DETERMINANTES_DELETE(?)';
    let result = await db.query(sql, [postData.id || 0]);

    response = JSON.parse(JSON.stringify(result[0][0]));
    if (response.status == 200) {
      response.model = JSON.parse(JSON.stringify(result[1][0]));
    }
    return response;
    
  } catch(ex) {
    throw ex;
  }
}






module.exports = {
  consultarTema,
  consultarPrioridad,
  consultarMedioRecepcion,
  consultarTipoDocumento,
  consultarUnidadAdministrativa,
  consultarInstruccion,
  consultarDependencia,
    consultarUsuarioRol,
  registrarTema, 
  registrarPrioridad,
  insertarDeterminantes,
  consultarDeterminantes,
  actualizarDeterminantes,
  //
  desactivarDeterminantes,
};
