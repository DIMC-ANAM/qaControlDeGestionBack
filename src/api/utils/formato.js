var wkhtmltopdf = require('wkhtmltopdf');
var QRCode = require('qrcode');

async function QRValidate(folioResguardo) {
    var optsQR = {
		errorCorrectionLevel: 'H',
		type: 'image/png',
		quality: 0.95,
		margin: 1,
		width: 200,
		color: {
		  dark:"#000000",
		  light:"#FFFFFF"
		}
	  }

	const img =  await QRCode.toDataURL("https://sastic.sep.gob.mx/#/validarQR/"+folioResguardo); /* ws get http */
    //const img =  await QRCode.toDataURL("http://sastic.sep.gob.mx:8072/#/validarQR/"+folioResguardo);
    return img;
}
async function imprimirFormato(data){
    
    let html = "";
	const options = {
		"page-size": "Letter",
		"orientation": "Portrait",
        "enable-local-file-access": true,    
        "header-html": "https://sastic.sep.gob.mx/assets/memb/sastic/header.html",
        "footer-html": "https://sastic.sep.gob.mx/assets/memb/sastic/footer.html"  
	};
    
    html += `<!DOCTYPE html>
                 <html>
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <meta charset="utf-8">
                        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
                        <style>
                            body {
                                width: 90%;
                                margin: auto;
                                font-family: 'Montserrat';
                                font-weigth: 600;
                            

                                font-size:13px;
                            }
                
                            .parrafo{                        
                                text-align: justify;
                            }
                
                            .qrCode{ 
                                margin-left: 10px;
                                background-size: 100%;   
                                height: 100px;                 
                                background-image:url(@qrCode@);
                                background-repeat: no-repeat;
                            }
                        </style>
                    </head>`;
	html += await bodyOficio();

    html += `</html>`;

    
    
    return wkhtmltopdf(await replaceOficio(data,html), options);

}

async function bodyOficio(){
	let html =  `
	<body>
        <table cellpadding='0' cellspacing='0' width='100%' style="margin-top: 20px; margin-bottom:4000px;">
            <tr>
                <table cellpadding='0' cellspacing='0' width='100%'>
                    <tr>
                        <td style="text-align: center;"><b>ACTA DE RESGUARDO</b></td>
                    </tr>
                </table>
            </tr>
            <tr>
                <table cellpadding='0' cellspacing='0' width='100%' style="margin-top: 10px;">
                    <tr>
                    <td style="text-align: center;"><b>Servicio de Arrendamiento de Equipo de Cómputo Personal y Periféricos en Condiciones Óptimas de Operación </b></td>
                    </tr>
                </table>
            </tr>
            <br>
            <tr>
                <table cellpadding='0' cellspacing='0' width='100%'>
                    <tr>
                        <td style= "width:580px;">
                            <table cellpadding='0' cellspacing='0' width='100%' style="border: #757575  2px solid;">
                                <tr>
                                    <td style="padding: 6px; border-bottom: #757575  2px solid;"><b>Proveedor: </b>@proveedor@</td>
                                  
                                </tr>
                                <tr>
                                    <td style="padding: 6px;">
                                        <b>Partida: </b>@partida@
                                        <b style="margin-left:10px;">No. Serie:</b> @serie@                                    
                                    </td>  
                                </tr>
                                <tr>
                                    <td style="padding: 5px; border-top: #757575  2px solid; max-width:100px;"><b>Equipo: </b>@equipoPartida@</td>
                                </tr>
                                <tr>
                                    <td style="padding: 5px; border-top: #757575  2px solid; max-width:100px;">
                                        <b>Modelo: </b>@modelo@
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td style="padding-left: 10px;">
                            <table cellpadding='0' cellspacing='0' width='100%' style="border: #757575  2px solid;">
                                <tr >
                                    <td style="text-align: center; padding: 7px;" ><b>Fecha de resguardo</b></td>
                                </tr>
                                <tr>
                                    <td>
                                        <table cellpadding='0' cellspacing='0' width='100%' style="border-top: #757575  2px solid;" >
                                            <tr>
                                                <td style="text-align: center; padding: 5px; border-right: #757575  2px solid;"><b>Día</b></td>
                                                <td style="text-align: center; padding: 5px; border-right: #757575  2px solid;"><b>Mes</b></td>
                                                <td style="text-align: center; padding: 5px;"><b>Año</b></td>
                                            </tr>
                                            <tr>
                                                <table cellpadding='0' cellspacing='0' width='100%'>
                                                    <tr>
                                                        <td style="text-align: center; padding: 5px; border-top: #757575  2px solid;border-bottom: #757575  2px solid;">@fechaResguardo@</td>
                                                    </tr>
                                                </table>
                                            </tr>
                                            <tr>
                                               
                                                <td style="text-align: center; padding: 5px;">
                                                    <b>Folio: </b>@folio@ <b style="margin-left:2px;"> Tipo: </b>@tipoResguardo@</td>
                                                </td> 
                                            </tr>
                                        </table>
                                    </td>
                                    
                                </tr>
                            </table>
                        </td>
                    </tr>
                   <br>
                    <!--  -->
                    <tr>
                        <td>
                            <table cellpadding='0' cellspacing='0' width='100%' style="border: #757575  2px solid;">
                                <tr>
                                    <td style="text-align: center; background-color: #e0e0e0; padding: 2px;">
                                        <b>Datos del usuario y ubicación</b>
                                    </td>
                                </tr>
                            </table> 
                        </td>
                    </tr>
                    <tr>
                        <table cellpadding='0' cellspacing='0' width='100%'>
                            <tr>
                                <td style="text-align: left; padding: 5px; border-bottom: #757575  2px solid; border-left: #757575  2px solid; "><b>Nombre: </b>@nombreUsuario@</td>
                                <td style="text-align: center; padding: 5px; border-bottom: #757575  2px solid; border-left: #757575  2px solid; border-right: #757575  2px solid; width: 200px;">
                                   <b>DGTIC-ID: </b>@dgticID@
                                </td>
                            </tr>
                        </table> 
                    </tr>
                    <tr>
                        <table cellpadding='0' cellspacing='0' width='100%'>
                            <tr>
                                <td style="text-align: left; padding: 5px; border-bottom: #757575  2px solid; border-left: #757575  2px solid; border-left: #757575  2px solid; border-right: #757575  2px solid;">
                                    <b>Unidad Administrativa: </b><br> @Ur@
                                </td>
                            </tr>
                        </table> 
                    </tr>
                    <tr>
                        <table cellpadding='0' cellspacing='0' width='100%'>
                            <tr>
                                <td style="text-align: left; padding: 5px; border-bottom: #757575  2px solid; border-left: #757575  2px solid; width: 200px; height:70px;">
                                    <b>Inmueble: </b><br> @inmueble@
                                </td>
                                <td style="text-align: left; padding: 5px; border-bottom: #757575  2px solid; border-left: #757575  2px solid; border-right: #757575  2px solid;height:70px;">
                                <b>Dirección: </b><br> @direccionInmueble@</td>
                            </tr>
                        </table> 
                    </tr>
                    <tr>
                        <table cellpadding='0' cellspacing='0' width='100%'>
                            <tr>
                                <td style="text-align: left; padding: 5px; border-bottom: #757575  2px solid; border-left: #757575  2px solid;"><b>Correo electrónico: </b>
                                @correoUsuario@
                                </td>
                                <td style="text-align: left; padding: 5px; border-bottom: #757575  2px solid; border-left: #757575  2px solid; border-right: #757575  2px solid; width: 150px;">
                                <b>Extensión: </b>@extensionUsuario@
                                </td>
                            </tr>
                        </table> 
                    </tr>
               </table>
            </tr>
            <br>
            <tr>
                <td>
                    <table cellpadding='0' cellspacing='0' width='100%' style='border: #757575  2px solid; border-left: #757575 2px solid;'>
                        <tr>
                            <td style="text-align: center; background-color: #e0e0e0; padding: 2px;"><b>Periféricos</b></td>
                        </tr>
                    </table> 
                </td>
            </tr>
            <tr>
                <td>
                    <table cellpadding='0' cellspacing='0' width='100%'>
                        <tr>
                            <td style="text-align: center; border-bottom: #757575  2px solid; border-left: #757575 2px solid;"><b>Descripción</b></td>
                            <td style="text-align: center; border-bottom: #757575  2px solid; border-right: #757575  2px solid;  border-left: #757575  2px solid;"><b>Número de serie</b></td>
                        </tr>
                        <!-- iterar aqui la lista  -->
                        @extras@
                    </table> 
                </td>
            </tr>

            <tr>
                <table  width='100%'>
                    <tr>
                        <td style = 'width: 210px;text-aling:center;'>
                            <img src='@qrCode@' style='width:80%;'>
                        </td>
                        <td>
                            <table cellpadding='0' cellspacing='0' width='100%'>
                                <tr>
                                    <td style="text-align: center; background-color: #e0e0e0; padding: 2px;  border: #757575  2px solid;"><b>Observaciones</b></td>
                                </tr>
                                <tr>
                                    <td style="height:100px; max-height: 100px; max-width:300px; text-align: center; padding: 10px; border-bottom: #757575  2px solid; border-right: #757575  2px solid; border-left: #757575  2px solid;">                                                          
                                      
                                    </td>
                                </tr>
                            </table> 
                        </td>
                    </tr>

                </table>
            
            </tr>
            <br>
            <tr>
                <table cellpadding='0' cellspacing='0' width='100%'>
                    <tr>    
                    <td style="text-align: center; padding: 2px; width:30%;">
                            <table cellpadding='0' cellspacing='0'>
                                <tr>
                                    <td style="text-align: center; background-color: #e0e0e0; padding: 2px;  border: #757575  2px solid;">
                                        <b>Recibe</b>
                                    </td>        
                                </tr>
                                <tr>
                                    <td style="text-align: center; border-left: #757575  2px solid; border-right: #757575  2px solid; border-bottom: #757575  2px solid;width:30%;">
                                        <br><br>
                                        <hr style="margin-top: 19%; width:80%; height: 1px; background-color: black;">
                                        <b>@nombreUsuario@</b>
                                        <br><br>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td style="text-align: center; padding: 2px; width:30%;">
                            <table cellpadding='0' cellspacing='0'>
                                <tr>
                                    <td style="text-align: center; background-color: #e0e0e0; padding: 2px;  border: #757575  2px solid;width:30%;">
                                        <b>Autoriza</b>
                                    </td>        
                                </tr>
                                <tr>
                                    <td style="text-align: center; border-left: #757575  2px solid; border-right: #757575  2px solid; border-bottom: #757575  2px solid;">
                                        <br><br>
                                        <hr style="margin-top: 19%; width:60%; height: 1px; background-color: black;">
                                        <b>Nombre y firma</b>
                                        <br><br>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td style="text-align: center; padding: 2px; width:30%;">
                            <table cellpadding='0' cellspacing='0'>
                                <tr>
                                    <td style="text-align: center; background-color: #e0e0e0; padding: 2px;  border: #757575  2px solid; width:30%;">
                                        <b>Entrega</b>
                                    </td>        
                                </tr>
                                <tr>
                                    <td style="text-align: center; border-left: #757575  2px solid; border-right: #757575  2px solid; border-bottom: #757575  2px solid;">
                                        <br><br>
                                        <hr style="margin-top: 19%; width:60%; height: 1px; background-color: black;">
                                        <b>Nombre y firma </b>
                                        <br><br>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <br><br>
                Número de contrato : @numeroContrato@
                <br>  
           </tr>
            <td>
                <td>
                    <table style='margin-top: 800px;'>
                        <tr>
                            <td>
                                <b>POLÍTICA DE RESPONSABILIDAD SOBRE EL USO DEL BIEN INFORMÁTICO</b>
                            </td>
                        </tr>
                        <tr>
                            <td style='text-align:justify;'>
                                <br>
                                Al momento de la recepción del equipo de cómputo o periférico, en adelante bien informático, el usuario acepta que se
                                encuentra en óptimas condiciones, asumiendo la responsabilidad y cuidado de dicho bien informático y se compromete a
                                utilizarlo con fines laborales, bajo las siguientes condiciones:
                            </td>
                        </tr>
                        <tr>
                            <td style='text-align:justify;'>
                                <ol>
                                    <li>
                                        Acatar los lineamientos internos en materia de Tecnologías de la Información y Comunicaciones de la <b>Secretaría de
                                        Educación Pública (SEP)</b>.
                                    </li>
                                    <li>
                                        Aceptar que, sobre el bien informático que le es suministrado por la <b>Dirección de Administración de Contratos
                                        (DAC)</b> de la <b>Dirección General de Tecnologías de la Información y Comunicaciones (DGTIC)</b>, propiedad del
                                        <b>Proveedor</b>, tendrá la obligación de resguardarlo y preservarlo en las mejores condiciones para el cumplimiento de
                                        sus actividades por las cuales, la <b>Secretaría de Educación Pública</b>, proporcionó dicho bien informático y aceptar la
                                        responsabilidad durante su estancia en la <b>SEP</b>, así como hacer la entrega de éste bien informático cuando le sea
                                        solicitado por la <b>DAC</b>, o bien, cuando concluya el cargo que desempeña.
                                    </li>
                                    <li>
                                        Para la debida observancia de lo manifestado en el punto anterior, sobre el bien informático que tiene el usuario bajo
                                        resguardo, suministrado por la <b>DGTIC</b>, propiedad del Proveedor, dará aviso inmediato a la <b>DGTIC</b>, a través de la <b>Mesa
                                        de Servicios de la Secretaría de Educación Pública (MS-SEP)</b> de cualquier falla en su funcionamiento, o cuando éste
                                        presente algún desperfecto físico por un hecho fortuito o cualquier otra situación que advierta un funcionamiento
                                        anómalo de este.
                                    </li>
                                    <li>
                                        En caso de daño, extravío o robo del bien informático, el usuario será responsable de levantar el acta de hechos ante el jefe 
                                        inmediato o Enlace de TIC; adicionalmente, en el supuesto de robo, el usuario deberá garantizar que sea levantada el acta ante 
                                        el Ministerio Público y posteriormente solicitará, mediante oficio a la DGTIC, la reposición o baja del bien informático. 
                                        En caso de que aplique, el usuario realizará la reposición del bien informático por uno de características iguales o superiores
                                        al asignado, o en su caso realizará el pago correspondiente; el costo será determinado por el Proveedor mediante dictamen.
                                    </li>
                                    <li>
                                        Para el caso de reparación y/o daño que intencionalmente o por negligencia cause al bien informático, después de
                                        una revisión por parte del <b>Proveedor</b>, se notificará por escrito el diagnóstico y evidencia de la(s) pieza(s) dañada(s),
                                        así como el costo que el usuario debe cubrir por la reparación, refacciones y/o mano de obra. Esta notificación se
                                        realizará con copia al Enlace Informático y al Administrador del Contrato de la <b>DGTIC</b>.
                                    </li>
                                    <li>
                                        Si el resguardo es de un equipo de cómputo, el usuario acepta toda responsabilidad del contenido de la totalidad de
                                        los archivos que se encuentran en el equipo a partir de la fecha del presente formato de resguardo.                        
                                    </li>
                                </ol>
                            </td>
                        </tr>
                        <tr style='text-align:justify;'>
                            <td>
                                Con fundamento en lo previsto en la Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados, la
                                Secretaría de Educación Pública (SEP), a través de la Dirección General de Tecnologías de la Información y Comunicaciones,
                                es responsable del tratamiento al que serán sometidos sus datos personales y protección de los mismos, proporcionados para
                                el Sistema de Administración de Servicios TIC, tal como se encuentra establecido en el aviso de privacidad integral que se
                                puede consultar en el siguiente sitio web: <a href='http://sep.gob.mx/dgticDatos/avisosastic.html'>http://sep.gob.mx/dgticDatos/avisosastic.html</a>.
                            </td>
                        </tr>
                    </table>
                </td>
            </td>
        </table>
</body>
        `
    return html;
}



async function replaceOficio(data, body) {
    extras = 
             `<tr style="padding:0; margin:0; ">
                    <td style="text-align: center; padding: 5px; border-bottom: #757575  2px solid; border-left: #757575  2px solid; height: 15px;">@descripcion@</td>
                    <td style="text-align: center; padding: 5px; border-bottom: #757575  2px solid; border-left: #757575  2px solid; border-right: #757575  2px solid;  width:250px;">@serie@</td>
            </tr>`;

    body = body.replace(/\r\n/g, "")

    /* ----------------------------------------------------------------------------------------------------------- */
    body = body.replace(/@proveedor@/g, data.nombreProveedor || ' ')
    body = body.replace(/@equipoPartida@/g, data.equipo )
    
    if(data.serieDVD != null){
        body = body.replace(/@serie@/g, data.noSerie+'-'+data.serieDVD || '')
    }else{
        body = body.replace(/@serie@/g, data.noSerie || '')
    }
    body = body.replace(/@partida@/g, data.partida )
    body = body.replace(/@perfil@/g, data.perfil )
    body = body.replace(/@fechaRegistro@/g, data.fechaRegistro ? fechaModificacion(data.fechaRegistro): " ")
    body = body.replace(/@modelo@/g, data.modelo )
    /* ----------------------------------------------------------------------------------------------------------- */
    body = body.replace(/@fechaResguardo@/g, data.fechaResguardo ? fechaModificacion(data.fechaResguardo): " " )  
    body = body.replace(/@fechaModificacion@/g, data.fechaModificacion ? fechaModificacion(data.fechaModificacion): " " )    
    body = body.replace(/@folio@/g, data.folio || '')
    body = body.replace(/@tipoResguardo@/g, data.tipo ? tipoResguardo(data.tipo): " ")
    /* ----------------------------------------------------------------------------------------------------------- */    
    body = body.replace(/@nombreUsuario@/g, data.nombreUsuario || '')
    body = body.replace(/@dgticID@/g, data.dgticId || '')
    body = body.replace(/@Ur@/g, data.unidadAdministrativa || '')
    body = body.replace(/@inmueble@/g, data.inmueble || '')

    if(data.nombreProveedor == 'Mainbit, S.A. de C.V.'){
        body = body.replace(/@numeroContrato@/g, 'DGRMyS-DGTIC-ADCA-002-2024'|| '')
    }

    if(data.nombreProveedor == 'DSTI México, S.A. de C.V.'){
        body = body.replace(/@numeroContrato@/g, 'DGRMyS-DGTIC-ADCA-001-2024'|| '')
    }

    if(data.nombreProveedor == 'Synnex de México, S.A. de C.V.'){
        body = body.replace(/@numeroContrato@/g, 'DGRMyS-DGTIC-ADCA-004-2024'|| '')
    }

    if(data.nombreProveedor == 'Tec Pluss, S.A. de C.V.'){
        body = body.replace(/@numeroContrato@/g, 'DGRMyS-DGTIC-ADCA-003-2024'|| '')
    }

    if(data.ubicacion.length >0 ){
        body = body.replace(/@direccionInmueble@/g, data.direccion+', '+data.ubicacion || '')    
    }else{
        body = body.replace(/@direccionInmueble@/g, data.direccion || '')
    }
    body = body.replace(/@ubicacion@/g, data.ubicacion || '')
    body = body.replace(/@correoUsuario@/g, data.correo || '')
    body = body.replace(/@extensionUsuario@/g, data.extension || '')
    /* ----------------------------------------------------------------------------------------------------------- */    
    //body = body.replace(/@observaciones@/g, data.observaciones || '')
    /* ----------------------------------------------------------------------------------------------------------- */    
    tableRows = "";
    for (let index = 0; index < 3; index++) {
        try {
            const element = data.componentes[index];  
            if(element == undefined){
                element.nombre = "";
                element.serie = "";
            }        
            tableRows += extras;
            tableRows = tableRows.replace(/@descripcion@/g, element.nombre)
            tableRows = tableRows.replace(/@serie@/g, element.serie || "")                        
        } catch (error) {
            tableRows += extras;
            tableRows = tableRows.replace(/@descripcion@/g, "")
            tableRows = tableRows.replace(/@serie@/g, "")                                    
        }
    }    
    body = body.replace(/@qrCode@/g,  await QRValidate(data.folio))    
    body = body.replace(/@extras@/g, tableRows)    
    /* ----------------------------------------------------------------------------------------------------------- */    
    return body;
}

function setFormatDDDD_DDmmYYYY(date) {
    let fecha = date.split("-")
    fecha = fecha[2]+"-"+fecha[1]+"-"+fecha[0];
    return fecha;
}

function fechaModificacion(date) {
    let aux = date.split("T");
    let fecha = aux[0].split("-");
    
    fecha = fecha[2]+"-"+fecha[1]+"-"+fecha[0];
    return fecha;
}

function tipoResguardo(data){
    let resguardo; 
    if(data == 1){
        resguardo = "Alta";
    }else{
        resguardo = "Alta";
    }
    return resguardo;
}

module.exports = {
	imprimirFormato,
}