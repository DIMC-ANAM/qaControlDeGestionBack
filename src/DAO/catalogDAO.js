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

    //Actualizar tema - penndiente

    //Desactivar tema - pendiente

    //SP Create sobre tabla determinantes 
    async function insertarDeterminantes(postData ){
      let response = {};                          //evaluar posibilidad de volverlas constantes 
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

    } catch(ex){
        throw ex;
    }
  }

  // SP Read sobre la tabla determinantes

  async function consultarDeterminantes(postData){
    let response = {};
    try{
      let sql = 'CALL SP_DETERMINANTES_READ(?)';
      let result = await db.query(sql, [postData.id || 0]);
      
      response = JSON.parse(JSON.stringify(result[0][0]));
      if (response.status == 200){
        response.model = JSON.parse(JSON.stringify(result[1][0]));
      }
      return response;

    } catch(ex){
      throw ex;
    }
  }

  async function actualizarDeterminantes(postData){
    let response = {}
    try{
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
      if(response.status == 200){
        response.model = JSON.parse(JSON.stringify(result[1][0]));
      }
      return response;
    }catch(ex){
      throw ex
    }
  }

  async function desactivarDeterminantes(postData){
    let response = {};
    try{
      let sql = 'CALL SP_DETERMINANTES_DELETE(?)';
      let result = await db.query(sql, [
        postData.id || 0
      ]);

      response = JSON.parse(JSON.stringify(result[0][0]));
      if (response.status == 200){
        response.model = JSON.parse(JSON.stringify(result[1][0]));
      }
      return response;
      
    }catch (ex){
      throw ex
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
  registrarTema, 
  registrarPrioridad,
  insertarDeterminantes,
  consultarDeterminantes,
  actualizarDeterminantes,
  desactivarDeterminantes,
};
