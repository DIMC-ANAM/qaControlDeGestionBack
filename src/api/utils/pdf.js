var wkhtmltopdf = require('wkhtmltopdf');
var QRCode = require('qrcode');
var CryptoJS = require("crypto-js");
const crypto = require('crypto');
const axios = require("axios");
const utils= require("../utils/utils");
async function imprimirPase(data, res = undefined) {
    let html = "";
    const options = {
        "page-size": "Letter",
        "orientation": "Landscape"
    };
    var optsQR = {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.95,
        margin: 1,
        width: 200,
        color: {
            dark: "#000000",
            light: "#FFFFFF"
        }
    }


    let url = 'https://sesi.sep.gob.mx/mvc/qr/vE.jsp/';
    let datos = data.curp + '-' + data.serie;
    let responCifrar = encriptar(datos,'Sesi202114se379!'); //await CifrarAES(datos);
    datos = responCifrar; //responCifrar.cadena
    console.log('***************** AES ******************');
    console.log(datos);
    url = url + datos;

    // const img = await QRCode.toDataURL(data.idLayoutReporteSep + "||" + data.folio + "||" + data.marca
    // 	+ "||" + data.modelo
    // 	+ "||" + data.edificio, optsQR);
    const img = await QRCode.toDataURL(url);
    html += `<!DOCTYPE html>
	<html>
	<head>
	<meta charset="utf-8">
	<link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'>
	<title></title>`;
    html += css(img);
    html += await bodyPase(data);
    html += `</body></html>`;
    console.log(html)
    if (res == undefined) {
        return wkhtmltopdf(html, options);
    }
    else {
        return wkhtmltopdf(html, options).pipe(res);
    }
}


/**
 * Función para generar la clave de encriptación a partir de una clave dada.
 * @param {string} clave - La clave de encriptación.
 * @returns {object} - Objeto SecretKeySpec generado a partir de la clave dada.
 */
function claveKey(clave) {
    // Convertimos la clave de string a un Buffer de utf8.
    let claveEncriptacion = Buffer.from(clave, 'utf8');
    // Creamos un hash SHA-1.
    const sha = crypto.createHash('sha1');
    // Obtenemos el hash de la clave de encriptación.
    claveEncriptacion = sha.update(claveEncriptacion).digest();
    // Nos aseguramos de que la clave tenga un tamaño de 16 bytes.
    claveEncriptacion = claveEncriptacion.slice(0, 16);
    // Creamos una clave secreta a partir del hash de la clave de encriptación.
    const secretKey = crypto.createSecretKey(claveEncriptacion);
  
    return secretKey;
  }
  
  /**
   * Función para encriptar un string utilizando una clave secreta.
   * @param {string} datos - El string a encriptar.
   * @param {string} claveSecreta - La clave secreta a utilizar para la encriptación.
   * @returns {string} - El string encriptado en base64.
   */
  function encriptar(datos, claveSecreta) {
    // Obtenemos la clave secreta a partir de la clave de encriptación.
    const secretKey = claveKey(claveSecreta);
    // Creamos un objeto Cipher para encriptar los datos con la clave secreta.
    const cipher = crypto.createCipheriv('aes-128-ecb', secretKey, null);
    // Convertimos el string a encriptar a un Buffer de utf8.
    let datosEncriptar = Buffer.from(datos, 'utf8');
    // Encriptamos los datos utilizando la clave secreta.
    let bytesEncriptados = cipher.update(datosEncriptar);
    bytesEncriptados = Buffer.concat([bytesEncriptados, cipher.final()]);
    // Convertimos los bytes encriptados a un string en base64.
    const encriptado = bytesEncriptados.toString('base64')
      // Reemplazamos los caracteres '+' por '-' y los caracteres '/' por '_'.
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
      // Eliminamos los caracteres '=' al final del string.
      //.replace(/=+$/, '');
  
    return encriptado;
  }


async function CifrarAES(str) {
    const API_DGTIC = "http://168.255.101.91:8181/dgticApi-1.0/api/cifrar/aes?cadena=";
    let url = (`${API_DGTIC}${str}`)
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(function (response) {
                let res = {
                    estatus: response.data.estatus,
                    mensaje: response.data.mensaje,
                    cadena: response.data.cadena
                }
                return resolve(res);
            })
            .catch(function (error) {
                data = { "status": 100, "message": error }
                return resolve(data);
            });
    });
}
async function bodyPase(data) {
    let html = `
    <body>
    <div class="container">
        <div class="header"></div>
        <div class="data">
            <div class="head">
                <div class="w-45 float-left">
                    <p class="font-9">NOMBRE:</p>
                    <p class="font-10"><strong>${data.nombres}</strong></p>
                </div>
                <div class="w-45 float-left">
                    <p class="font-9">APELLIDOS:</p>
                    <p class="font-10"><strong>${data.primerApellido}</strong></p>
                </div>
            </div>
            <div class="left">
                <div class="qrCode"></div>
                <p class="font-10 mx-auto"><strong>31/12/2024</strong></p>
            </div>
             <div class="left-1">
                <p class="font-9 color-primary">NÚMERO DE SERIE: </p>
                <p class="font-10"><strong>${data.serie}</strong></p>
                <p class="font-9 color-primary">VIGENCIA: </p>
                <p class="font-10"><strong>31/12/2024</strong></p>
            </div>
            <div class="right">
                <p class="font-9 color-primary">ÁREA DE ADSCRIPCIÓN:</p>
                <p class="font-10"><strong>${data.edificio}</strong></p>
                <p class="font-9 color-primary">MARCA DEL EQUIPO:</p>
                <p class="font-10"><strong>${data.marca}</strong></p>
            </div>
        </div>
    </div>
	`
    return html;
}
function css(img) {
    let pathImg = 'https://sastic.sep.gob.mx:9071/imgs/headerPase.png';
    let html = `
	<style type="text/css">
        body {
            margin: 0;
            padding: 0;
        }

        .container {
            width: 12cm;
            margin: 0 auto;
            height: 6cm;
            padding: 0;
            border: solid 1px black;
            overflow: hidden;
        }

        .header {
            width: 100%;
            height: 2.2cm;
            background-image: url(${pathImg});
            background-repeat: no-repeat;
            background-size: contain;
            background-color: #E4C9A3;
        }

        .head {
            background: #E4C9A3;
            width: 100%;
            padding: 0px 5px;
            margin-bottom: 5px;
            display: inline-block;
        }

        .data {
            width: 100%;
            height: 3.8cm;
            margin: 0;
        }

        .data .left {
            width: 23%;
            height: 2.2cm;
            float: left;
            text-align: center;
        }

        .data .left-1 {
            width: 29%;
            float: left;
            margin: auto;
            padding-left: 5px;
            margin-top: 5px;
        }

        .data .right {
            width: 45%;
            height: 100%;
            margin: auto;
            margin-top: 5px;
            padding-left: 5px;
            float: right;
        }

        .mx-auto{
            margin: auto !important;
        }

        .font-10 {
            font-size: 10px;
        }

        .font-9 {
            font-size: 9px;
        }

        .float-left {
            float: left;
        }

        .float-right {
            float: right;
        }

        .color-primary {
            color: #bc955c;
        }

        p,
        h2 {
            font-family: sans-serif;
            margin: 0;
            padding: 0;
            color: #404040;
            letter-spacing: 1px;
        }

        strong {
            color: #404040;
        }

        .w-45 {
            width: 45%;
        }

        .qrCode {
            width: 100%;
            height: 100%;
            background-image: url(${img});
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
        }
    </style>
	</head>
	`;
    return html;
}

async function imprimirOficioSAEC(data, res = undefined, prev = 0) {
    let html = `
    <!DOCTYPE html>
    <html>
        <head>
            <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'>
            <meta name='viewport' content='width=device-width, initial-scale=1'>
            <meta charset='utf-8'>
            <style>
                body {                          
                             
                    width: 95%;                    
                    margin: auto;
                    word-spacing:0px;
                    letter-spacing: 0px;
                    /* font-weight: 400; */
                    font-family: Montserrat,  sans-serif;
                    font-size: 13px;                    
                     
                    background-position: center;
                    background-attachment: fixed;
                }

                .parrafo {

                    text-align: justify;
                }

                .qrCode {

                    margin-left: 10px;
                    background-size: 100%;
                    height: 100px;
                    background-image: url(@qrCode@);
                    background-repeat: no-repeat;
                }
                .partidas-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                    
                .partidas-table th, .partidas-table td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: left;
                }
                    
                .partidas-table th {
                    text-align:center;
                    background-color: #D4D4D4;
                }
            </style>
        </head>`;
    
    const options = {

        "enable-local-file-access": true,
         pageSize: 'letter',
        "header-html":  "http://192.168.101.202/assets/memb/vacio/header.html",
        "footer-html":  "http://192.168.101.202/assets/memb/vacio/footer.html"
    };    

    html += bodyOficioSAEC(data,prev);
    html+= `
    </html>
    `;
    if (res == undefined) {
        return wkhtmltopdf(html, options);
    }
    else {
        return wkhtmltopdf(html, options).pipe(res);
    }
}

function bodyOficioSAEC(data,prev) {
    let html =  `    
        <body >
        <table cellpadding='0' cellspacing='0' width='100%'>
        <tr>
                    <td style='padding: 0px 0 30px 0;'>
                        <table align='center' border='0' cellpadding='0' cellspacing='0' width='800'>
                            <tr>
                                <td style=' padding: 0px 30px 5px 30px;'>
                                    <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                        <tr>
                                            <td>
                                                <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                                    <tr>
                                                        <td width='260' valign='top'>
                                                            <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                                                <tr>
                                                                    <td
                                                                    style='text-align:center;font-size:14px; padding: 10px 0 0 0;  line-height: 15px;'>
                                                                    <table border='0' cellpadding='0' cellspacing='0'
                                                                        width='100%'>
                                                                            
                                                                            <tr>
                                                                                <td> FORMATO DE DETECCIÓN DE NECESIDADES </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td> ARRENDAMIENTO DE EQUIPO DE CÓMPUTO PERSONAL Y PERIFÉRICOS</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>PERIODO:  2025 -  2027</td>
                                                                            </tr>                                                                           
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>

                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                           
                            <tr>
                            <td style=' padding: 0 30px 5px 30px; '>
                             
                                    <table align='center' border=0 cellpadding='1' cellspacing='0' width='100%' class='parrafo'
                                        style='border-collapse: collapse;   color: black'>
                                        <td>
                                            <p> <strong>Unidad Administrativa:  </strong> ${data.personal.unidadAdministrativa} </p>
                                            <p> 
                                             Para el proyecto de <strong>Arrendamiento de Equipo de Cómputo Personal y Periféricos</strong>,
                                             se realizó un proceso de detección de necesidades bajo las características y 
                                             condiciones del contrato marco correspondiente. Esta área hizo un análisis técnico, 
                                             operativo y presupuestal, y tiene el siguiente personal adscrito en el área, debido a sus actividades y operación.
                                            </p>

                                            <table  class='partidas-table' align='center' border=0 cellpadding='1' cellspacing='0' width='100%' class='parrafo'
                                            style='border-collapse: collapse;   color: black; '>
                                            <thead>
                                                <tr >
                                                    <th><strong>Estructura</strong></th>
                                                    <th><strong>Honorarios</strong></th>
                                                    <th><strong>Eventual</strong></th>
                                                    <th><strong>Base y Confianza</strong></th>
                                                </tr>
                                            </thead>
                                                <tbody>
                                                    <td style='text-align:center;'>${data.personal.estructura}</td>
                                                    <td style='text-align:center;'>${data.personal.honorario}</td>
                                                    <td style='text-align:center;'>${data.personal.eventual}</td>
                                                    <td style='text-align:center;'>${data.personal.operativo}</td>
                                                </tbody>
                                            </table>

                                            <p>
                                            Al respecto, se detectó que se requiere lo siguiente:
                                            </p>
                                            `;
                                
                                           
    html+=`
                                      

    <table class='partidas-table'>
    <thead>
        <tr>
            <th><strong>Partida</strong></th>
            <th><strong>Descripción</strong></th>
            <th><strong>Cantidad</strong></th>
            <th><strong>Detalle por inmueble</strong></th>
            <th><strong>Justificación</strong></th>
        </tr>
    </thead>
    <tbody>
    `;      
    for (const iter of data.cantidades) {
        if (iter.cantidad > 0){
            html+= `
            <tr>
            <td style="min-width: 10%;text-align:center;">${iter.idPartida} - ${iter.partidaPerfil}</td>            
            <td style="width: 20%; min-width: 25%;!important; text-align:justify; " >${iter.detalle}</td>
            <td style="min-width: 10%;text-align:center;">${iter.cantidad}</td>
            <td style="max-width: 15%;"> <table width="100%">`;
           
                
           
            for (const j of data.edificioCantidadList) {
                if (iter.idPartida == j.idPartida){
                 html+= ` 
                    <tr style="padding:0; margin:0; border-bottom:1px solid black;">
                        <td style="padding:0; margin:0;text-align:justify;border:none ;width:60%">${j.edificio}: </td>
                        <td style="padding:0; margin:0; border:none;width:40%; text-align:center;">${j.cantidadEdificio}</td>
                    </tr>
                 `;
                }
            }
         
            html +=` </table> </td>

            <td style="text-align:justify;">${iter.justificacion}</td>           
            </tr>`;        
        }                          
    }
    html+= `    </tbody>
            </table> `;

            if(data.personal.observacionesGenerales.length > 0  || data.personal.observacionesGenerales  != "" ){
                console.log(data.personal.observacionesGenerales.length);
            html+= `
                    <p>
                        Por lo anterior, se agrega la siguiente observación:
                    </p>
                    <p style=" padding:4px;" >
                        <strong><i>${data.personal.observacionesGenerales}</i></strong>
                    </p>`;
            }

            html+= `
                    <p>
                    Sin más por el momento, se expide la presente a fin de solicitar se integre esta área en el proyecto de contratación mencionado.
                    </p>
                    </td>

            </table>
        </td>
    </tr>
                    <!-- sección de las firmas  -->
                    `;
                    
                    if(prev == 0){
                        html+=`
                        <tr>                        
                        <td
                            style=' padding: 0 30px 5px 30px; '>
                            <p style=' padding: 0 5px 5px 5px; text-align:right;'>Ciudad de México a ${data.dg.fecha.getUTCDate()} de ${utils.getMonthName(data.dg.fecha.getUTCMonth())} de ${data.dg.fecha.getFullYear()} <p>
                            <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                <tr>
                                <table  class='partidas-table' align='center' border=0 cellpadding='1' cellspacing='0' width='100%' class='parrafo'
                                style='border-collapse: collapse;   color: black;  font-size:13px;'>
                                <thead>
                                    <tr >
                                        <th><strong>Elaboró</strong></th>
                                        <th><strong>Revisó</strong></th>
                                        <th><strong>Autorizó</strong></th>
                                    </tr>
                                </thead>
                                    <tbody style="font-size: 10px;">
                                        <tr >
                                            <td style='vertical-align:bottom;  height:60px;text-align:center; width:33%'> 
                                                <section style="border-top: 1px solid black;  ">
                                                ${data.dg.nombreEnlace}
                                                </section>
                                            </td>
                                            <td style='vertical-align:bottom;  height:60px;text-align:center;width:33%'> 
                                                <section style="border-top: 1px solid black; ">
                                                ${data.dg.nombreReviso}
                                                </section>
                                            </td>
                                            <td style='vertical-align:bottom;  height:60px;text-align:center; width:33%'> 
                                                <section style="border-top: 1px solid black; ">
                                                ${data.dg.nombreDG}
                                                </section>
                                            </td> 
                                        </tr >
                                        <tr >                                       
                                            <td style='text-align:center; width:33% '>ENLACE INFORMÁTICO</td>
                                            <td style='text-align:center; width:33% '>${data.dg.cargoReviso}</td>
                                            <td style='text-align:center; width:33% '>${data.dg.cargoDG}</td> 
                                        </tr >                                       
                                    </tbody>
                                </table>
                                </tr>                                
                            </table>
                        </td>
                    </tr>
                    <!-- End firma section  -->`;
                    }

                html +=
                `</table>
            </td>
        </tr>
    </table>
</body>`
    return html;
}

async function imprimirOficioSAFID(data, res = undefined,prev = 0) {
    let html = `
    <!DOCTYPE html>
    <html>
        <head>
            <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'>
            <meta name='viewport' content='width=device-width, initial-scale=1'>
            <meta charset='utf-8'>
            <style>
                body {                
                    width: 95%;                    
                    margin: auto;
                    word-spacing:0px;
                    letter-spacing: 0px;
                    /* font-weight: 400; */
                    font-family: Montserrat,  sans-serif;
                    font-size: 13px;                    
                    background-repeat: repeat-y;
                    background-position: center;
                    background-attachment: fixed;
                }

                .parrafo {

                    text-align: justify;
                }

                .qrCode {

                    margin-left: 10px;
                    background-size: 100%;
                    height: 100px;
                    background-image: url(@qrCode@);
                    background-repeat: no-repeat;
                }
                .partidas-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                    
                .partidas-table th, .partidas-table td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: left;
                }
                    
                .partidas-table th {
                    text-align:center;
                    background-color: #f2f2f2;
                }
            </style>
        </head>`;
    
    const options = {

        "enable-local-file-access": true,
        pageSize: 'letter',
        "header-html": "http://192.168.101.202/assets/memb/vacio/header.html",
        "footer-html": "http://192.168.101.202/assets/memb/vacio/footer.html"
    };    

    html += bodyOficioSAFID(data,prev);
    html+= `
    </html>
    `;
    if (res == undefined) {
        return wkhtmltopdf(html, options);
    }
    else {
        return wkhtmltopdf(html, options).pipe(res);
    }
}
function bodyOficioSAFID(data,prev) {
    let html =  `
        <body>
            <table cellpadding='0' cellspacing='0' width='100%'>
                <tr>
                    <td style='padding: 0px 0 30px 0;'>
                        <table align='center' border='0' cellpadding='0' cellspacing='0' width='800'>
                            <tr>
                                <td style=' padding: 0px 30px 5px 30px;'>
                                    <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                        <tr>
                                            <td>
                                                <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                                    <tr>
                                                        <td width='260' valign='top'>
                                                            <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                                                <tr>
                                                                    <td
                                                                    style='text-align:center;font-size:14px; padding: 10px 0 0 0;  line-height: 15px;'>
                                                                    <table border='0' cellpadding='0' cellspacing='0'
                                                                        width='100%'>
                                                                            
                                                                            <tr>
                                                                                <td> FORMATO DE DETECCIÓN DE NECESIDADES </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td> SERVICIO ADMINISTRADO DE FOTOCOPIADO, IMPRESIÓN Y DIGITALIZACIÓN DE DOCUMENTOS</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td>PERIODO:  2025 -  2027</td>
                                                                            </tr>                                                                           
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>

                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style=' padding: 0 30px 5px 30px; '>
                                    <table align='center' border=0 cellpadding='1' cellspacing='0' width='100%' class='parrafo'
                                        style='border-collapse: collapse;   color: black'>
                                        <tr>
                                        <td>
                                        <p> <strong>Unidad Administrativa:  </strong> ${data.personal.unidadAdministrativa} </p>
                                            <p> 
                                             Para el proyecto de <strong>Servicio Administrado de Fotocopiado, Impresión y Digitalización de Documentos</strong>,
                                             se realizó un proceso de detección de necesidades bajo las características y 
                                             condiciones del contrato marco correspondiente. Esta área hizo un análisis técnico, 
                                             operativo y presupuestal.
                                            <br>
                                            Al respecto, se detectó que se requiere lo siguiente:
                                            </p>
                                        </tr>    `;

                                           
    html+=`
                                      
    <tr>
    <table class='partidas-table'>
    <thead>
        <tr>
            <th><strong>Perfil</strong></th>
            <th><strong>Cantidad</strong></th>
            <th><strong>Detalle por edificio</strong></th>
            <th><strong>Mínimo estimado mensual de servicio</strong></th>
            <th><strong>Justificación</strong></th>
        </tr>
    </thead>
    <tbody>
    `;      
    for (const iter of data.cantidades) {
        if (iter.cantidad > 0){
            html+= `
            <tr>
            <td style="min-width: 10%;text-align:center;">${iter.partidaPerfil}</td>            
            <td style="min-width: 10%;text-align:center;">${iter.cantidad}</td>
            <!-- <td style="width: 20%; min-width: 25%;!important; text-align:justify; " >${iter.detalle}</td> -->
            <td style="max-width: 15%;"> <table width="100%">`;
           
                
           
            for (const j of data.edificioCantidadList) {
                if (iter.idPartida == j.idPartida){
                 html+= ` 
                 <tr style="padding:0; margin:0; border-bottom:1px solid black;">
                 <td style="padding:0; margin:0;text-align:justify;border:none ;width:60%">${j.edificio}: <strong>${j.cantidadEdificio}</strong> </td>
                 
                 </tr>
                 `;
                }
            }
            
         
            html +=` </table> </td>
            <td style="min-width: 10%;text-align:left; vertical-align: middle;">
            ${iter.copiaImpBNCarta != 0 ? 'Copia/Impresión BN Carta: <strong>'+iter.copiaImpBNCarta+ '</strong><br><br>': '' }
            ${iter.copiaImpBNOficio != 0 ? 'Copia/Impresión BN Oficio: <strong>'+iter.copiaImpBNOficio+ '</strong><br><br>': '' }
            ${iter.copiaImpBNCartaDobleCarta != 0 ? 'Copia/Impresión BN Doble Carta: <strong>'+iter.copiaImpBNCartaDobleCarta+ '</strong><br><br>': '' }
            ${iter.copiaImpColorCarta != 0 ? 'Copia/Impresión Color Carta: <strong>'+iter.copiaImpColorCarta+ '</strong><br><br>': '' }
            ${iter.copiaImpColorOficio != 0 ? 'Copia/Impresión Color Oficio: <strong>'+iter.copiaImpColorOficio+ '</strong><br><br>': '' }
            ${iter.copiaImpColorCartaDobleCarta != 0 ? 'Copia/Impresión Color Doble Carta: <strong>'+iter.copiaImpColorCartaDobleCarta+ '</strong><br><br>': '' }
            ${iter.digitalizacion != 0 ? 'Digitalización: <strong>'+iter.digitalizacion+ '</strong><br><br>': '' }
            </td>

            <td style="text-align:justify;">${iter.justificacion}</td>           
            </tr>`;        
        }                          
    }
    html+= `    </tbody>
            </table> </tr>
            <table align='center' border=0 cellpadding='1' cellspacing='0' width='100%' class='parrafo'
            style='border-collapse: collapse;   color: black'>
            `;

            if(data.personal.observacionesGeneralesImpresion != ""){
            html+= `
            
                    <p>
                        Por lo anterior, se agrega la siguiente observación:
                    </p>
                    <p style=" padding:4px;" >
                        <strong><i>${data.personal.observacionesGeneralesImpresion}</i></strong>
                    </p>`;
            }

            html+= `<td>
                    <p>
                    Sin más por el momento, se expide la presente a fin de solicitar se integre esta área en el proyecto de contratación mencionado.
                    </p>
                    </td>
                </td >
                </table>
            </table>
        </td>
    </tr>
                    <!-- sección de las firmas  -->
                    `;
                    
                    if(prev == 0){
                        html+=`
                        <tr>                        
                        <td
                            style=' padding: 0 30px 5px 30px; '>
                            <p style=' padding: 0 5px 5px 5px; text-align:right;'>Ciudad de México a ${data.dg.fecha.getUTCDate()} de ${utils.getMonthName(data.dg.fecha.getUTCMonth())} de ${data.dg.fecha.getFullYear()} <p>
                            <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                <tr>
                                <table  class='partidas-table' align='center' border=0 cellpadding='1' cellspacing='0' width='100%' class='parrafo'
                                style='border-collapse: collapse;   color: black;  font-size:13px;'>
                                <thead>
                                    <tr >
                                        <th><strong>Elaboró</strong></th>
                                        <th><strong>Revisó</strong></th>
                                        <th><strong>Autorizó</strong></th>
                                    </tr>
                                </thead>
                                    <tbody style="font-size: 10px;">
                                        <tr >
                                            <td style='vertical-align:bottom;  height:60px;text-align:center; width:33%'> 
                                                <section style="border-top: 1px solid black;  ">
                                                ${data.dg.nombreEnlace}
                                                </section>
                                            </td>
                                            <td style='vertical-align:bottom;  height:60px;text-align:center;width:33%'> 
                                                <section style="border-top: 1px solid black; ">
                                                ${data.dg.nombreReviso}
                                                </section>
                                            </td>
                                            <td style='vertical-align:bottom;  height:60px;text-align:center; width:33%'> 
                                                <section style="border-top: 1px solid black; ">
                                                ${data.dg.nombreDG}
                                                </section>
                                            </td> 
                                        </tr >
                                        <tr >                                       
                                            <td style='text-align:center; width:33% '>ENLACE INFORMÁTICO</td>
                                            <td style='text-align:center; width:33% '>${data.dg.cargoReviso}</td>
                                            <td style='text-align:center; width:33% '>${data.dg.cargoDG}</td> 
                                        </tr >                                       
                                    </tbody>
                                </table>
                                </tr>                                
                            </table>
                        </td>
                    </tr>
                    <!-- End firma section  -->`;
                    }

                html +=
                `</table>
            </td>
        </tr>
    </table>
</body>`
    return html;
}
async function imprimirFormatoFPS01(data, res = undefined) {
    let html = `
    <!DOCTYPE html>
    <html>
        <head>
            <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'>
            <meta name='viewport' content='width=device-width, initial-scale=1'>
            <meta charset='utf-8'>
            <style>
                body {                
                    width: 90%;                    
                    margin: auto;
                    word-spacing:0px;
                    letter-spacing: 0px;
                    /* font-weight: 400; */
                    font-family: Montserrat,  sans-serif;
                    font-size: 16px;                    
                    background-repeat: repeat-y;
                    background-position: center;
                    background-attachment: fixed;
                }

                .parrafo {

                    text-align: justify;
                }

                .qrCode {

                    margin-left: 10px;
                    background-size: 100%;
                    height: 100px;
                    background-image: url(@qrCode@);
                    background-repeat: no-repeat;
                }
                .partidas-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                    
                .partidas-table th, .partidas-table td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: left;
                }
                    
                .partidas-table th {
                    text-align:center;
                    background-color: #f2f2f2;
                }
            </style>
        </head>`;
    
    const options = {

        "enable-local-file-access": true,
        pageSize: 'letter',
        "header-html": "http://192.168.101.202/assets/memb/vacio/header.html",
        "footer-html": "http://192.168.101.202/assets/memb/vacio/footer.html"
    };    

    html += bodyFormatoFPS01(data);
    html+= `
    </html>
    `;
    if (res == undefined) {
        return wkhtmltopdf(html, options);
    }
    else {
        return wkhtmltopdf(html, options).pipe(res);
    }
}
function bodyFormatoFPS01(data) {
    var fecha = new Date(data.fechaRegistro);    
    let html =  `
        <body>
            <table cellpadding='0' cellspacing='0' width='100%'>
                <tr>
                    <td style=' padding-top:50px;'>
                        <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                            <tr>        
                                <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                    <tr>
                                        <td
                                        style=' padding: 20px 0 0 0;  line-height: 15px;'>
                                        <table border='0' cellpadding='0' cellspacing='0'
                                            width='100%'>                                                                                                                       
                                                <tr>
                                                    <td style=' font-size:20px'> ACUSE DE REGISTRO DE REPORTE DE SINIESTRO  </td>
                                                    <td> Formato <strong>FPS-01</strong> </td>
                                                </tr>                                                                        
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </tr>
                        </table>
                    </td>
                </tr> <!-- END section "titulo"-->
                <tr>
                    <td style=' padding: 0px 30px 5px 30px;'>
                        <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                            <tr>        
                                <td>
                                    <p style=' text-align: justify;'>
                                        Se ha registrado el reporte de siniestro identificado con el folio ${data.folio || 'N/A'},  en el Sistema de Administración de Servicios de TIC (SASTIC).
                                        La información presentada a la fecha ${fecha.getUTCDate()} de ${utils.getMonthName(fecha.getUTCMonth())} de ${fecha.getFullYear()}, ha sido validada. Por lo tanto, se proporcionan los detalles del equipo siniestrado para los efectos legales que correspondan.

                                    </p>                                

                                        <h4>DETALLES DEL REPORTE DE SINIESTRO</h4>
                                        <p><strong>Nombre de la persona denunciante:</strong>  ${data.nombreCompleto}</p>
                                        <p><strong>Unidad Administrativa:</strong>  ${data.urString}</p>
                                        <table border='0' cellpadding='0px' cellspacing='0px' width='100%'style='text-align:left'>                                         
                                            <tr>                  
                                                <td><p><strong>Lugar del siniestro: </strong>  ${data.inmuebleSEP ? 'Edificio ' +data.lugarSiniestro: data.lugarSiniestro }</p><td>
                                                <td><p><strong>Dentro de SEP: </strong>  ${data.inmuebleSEP ? 'Sí': 'No'}</p><td>
                                            </tr>                                                                                           
                                        </table>                                            
                                    <p><strong>Dirección:</strong>  ${data.domicilioSiniestro}</p>
                                    </td>                                   

                            </tr>

                            <br><br>
                            <tr > 
                                <td>
                                    <h4>DETALLES DE LA PARTIDA SINIESTRADA</h4>
                                    <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                        <tr> 
                                            <td> <p><strong>Producto:</strong> ${data.partidaDataset.Producto} </p> </td>
                                            <td><p><strong>Modelo:</strong> ${data.partidaDataset.Modelo} </p>
                                        </tr>
                                        <tr> 
                                            <td> <p><strong>Serie:</strong> ${data.partidaDataset.Serie} </p> </td>
                                            <td><p><strong>Proveedor:</strong> ${data.partidaDataset.Proveedor} </p> </td>
                                        </tr>                           
                                    </table>
                                </td>
                            </tr>                                                       
                        </table>
                    </td>
            </table>
        </body>`
    return html;
}

module.exports = {
    imprimirPase,
    imprimirOficioSAEC,
    imprimirOficioSAFID,
    imprimirFormatoFPS01

}


