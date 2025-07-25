var nodemailer = require('nodemailer');
const { getMaxListeners } = require('../../config/winston');
const correoDAO = require("../../DAO/correoDAO");
var transporter = nodemailer.createTransport({
    //service: 'Gmail',
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: 'no_reply@nube.sep.gob.mx',
        pass: 'Roq17058'
    }
});


function sendEmail(mailOptions) {
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("error send email: ", error)
            return false;
        } else {
            console.log("Correo enviado! ! !")
            return true;
        }
    });
}

async function bodyRechazo(res) {
    try {

        let data = await correoDAO.obtenerCorreoRechazoPeticion(res);
        return data;
    } catch (ex) {
        console.log("Error al obtener correo rechazo petición.");
        throw ex;
    }
}
/**
 * 
 * @param {*} data 
 */
async function bodyCartaAmableOC(res) {
    try {

        let data = await correoDAO.obtenerCorreoCartaAmableOC(res);
        return data;
    } catch (ex) {
        console.log("Error al obtener correo carta amable.");
        throw ex;
    }
}


async function bodyCartaAmableOSFAE(res) {
    try {

        let data = await correoDAO.obtenerCorreoCartaAmableOSFAE(res);
        return data;
    } catch (ex) {
        console.log("Error al obtener correo carta amable OSFAE.");
        throw ex;
    }
}
async function bodyRechazoAsignacion(res) {
    try {

        let data = await correoDAO.obtenerCorreoRechazoAsignacion(res);
        return data;
    } catch (ex) {
        console.log("Error al obtener correo rechazo asignación.");
        throw ex;
    }
}
async function bodyPaseSalida(res) {
    try {

        let data = await correoDAO.bodyPaseSalida(res);
        return data;
    } catch (ex) {
        console.log("Error al obtener correo rechazo asignación.");
        throw ex;
    }
}
async function bodyResguardoCorreo(res) {
    try {

        let data = await correoDAO.bodyResguardoCorreo(res);
        return data;
    } catch (ex) {
        console.log("Error al obtener correo rechazo asignación.");
        throw ex;
    }
}

async function bodyRespuestaEnlace(res) {
    try {

        let data = await correoDAO.obtenerCorreoRespuestaEnlance(res);
        return data;
    } catch (ex) {
        console.log("Error al obtener correo respuesta enlace.");
        throw ex;
    }
}
async function bodyRespuestaSGIS(res) {
    try {

        let data = await correoDAO.obtenerCorreoRespuestaSGIS(res);
        return data;
    } catch (ex) {
        console.log("Error al obtener correo respuesta SGIS.");
        throw ex;
    }
}
async function bodyVoBoRechazo(res) {
    try {

        let data = await correoDAO.obtenerCorreoVoboRechazo(res);
        return data;
    } catch (ex) {
        console.log("Error al obtener correo rechazo vobo.");
        throw ex;
    }
}


/**         Recibe elidFormato si es:<br>
 *          1- Rechazada<br> ok
 *          2-Carta Amable<br>
 *          3-Rechazo asignación <br> ok
 *          4-RespuestaEnlace<br> ok
 *          5-Respuesta S-GIS<br> pendiente
 *          6-voBo S-GIS<br> ok
 *  {}
 * @param idFormato
 */
async function configuraCorreo(idFormato, data, pdf = null) {
    var configRemite = {
        from: "no_reply@nube.sep.gob.mx"
    }
    let res;
    switch (idFormato) {
        case 1:
            configRemite.subject = "S-GIS - Notificación: Rechazo de solicitud.";
            res = await bodyRechazo(data);
            configRemite.body = res.model.body;
            configRemite.correoPersona = res.model.correoPersona;
            break;
        case 2:
            configRemite.subject = "S-GIS - Notificación: Solicitud aceptada, inicio de proceso.";
            res = await bodyCartaAmableOC(data);
            configRemite.body = res.model.body;
            configRemite.correoPersona = res.model.correoPersona;
            configRemite.cc = res.model.correoUR;
            break;
        case 3:
            configRemite.subject = "S-GIS - Notificación: Solicitud aceptada, inicio de proceso.";
            res = await bodyCartaAmableOSFAE(data);
            configRemite.body = res.model.body;
            configRemite.correoPersona = res.model.correoPersona;
            configRemite.cc = res.model.correoUR;
            break;
        case 4:
            configRemite.subject = "S-GIS - Notificación: Respuesta del enlace.";
            res = await bodyRespuestaEnlace(data);
            configRemite.body = res.model.body;
            configRemite.correoPersona = res.model.correoPersona;
            break;
        case 5:
            configRemite.subject = "S-GIS - Notificación: VoBo. del operador.";
            res = await bodyRespuestaSGIS(data);
            configRemite.body = res.model.body;
            configRemite.correoPersona = res.model.correoPersona;
            break;
        case 6:
            configRemite.subject = "S-GIS - Notificación: Rechazo de la respuesta en VoBo.";
            res = await bodyVoBoRechazo(data);
            configRemite.body = res.model.body;
            configRemite.correoPersona = res.model.correoPersona;
            break;
        case 7:
            configRemite.subject = "S-GIS - Notificación: Rechazo de la asignación.";
            res = await bodyRechazoAsignacion(data);
            configRemite.body = res.model.body;
            configRemite.correoPersona = res.model.correoPersona;
            break;
        case 8:
            configRemite.subject = "PASE DE SALIDA";
            res = await bodyPaseSalida(data);
            configRemite.body = res.model.body;
            configRemite.correoPersona = res.model.correoPersona;
            var pdfBase64 = await getPdfStream(pdf);
            configRemite.attachments = [
                {
                    filename: "Pase de Salida.pdf",
                    content: pdfBase64,
                    encoding: 'base64'
                }
            ]
            break;
        case 9:
            configRemite.subject = "PASE DE SALIDA EQUIPO PERSONAL";
            res = await bodyPaseSalida(data);
            configRemite.body = res.model.body;
            configRemite.correoPersona = res.model.correoPersona;
            var pdfBase64 = await getPdfStream(pdf);
            configRemite.attachments = [
                {
                    filename: "Pase de Salida.pdf",
                    content: pdfBase64,
                    encoding: 'base64'
                }
            ]
            break;
        case 10:
            configRemite.subject = "RESGUARDO";
            res = await bodyResguardoCorreo(data);

            configRemite.body = res.model.body;            
            configRemite.correoPersona = res.model.correoPersona;
            var pdfBase64 = await getPdfStream(pdf);
            configRemite.attachments = [
                {
                    filename: "Resguardo.pdf",
                    content: pdfBase64,
                    encoding: 'base64'
                }
            ]
            break;
        default:
            configRemite.subject = "S-GIS - Notificación.";
            break;
    }
    return configRemite;
}

async function enviarCorreoActualizacionEtapa(idFormato, data) {
    try {
        let config = await configuraCorreo(idFormato, data);
        var mailOptions = {
            from: config.from,
            to: config.correoPersona,
            cc: config.cc,
            subject: config.subject,
            html: config.body

        };
        sendEmail(mailOptions);
    } catch (error) {
        console.log(error)
    }
}
async function enviarCorreoPaseSalida(idFormato, data,pdf) {
    try {
        let config = await configuraCorreo(idFormato, data,pdf);

        var mailOptions = {
            from: config.from,
             to:data.correoDestino,
            //to:'adrcoria@gmail.com',
            subject: config.subject,
            html: config.body,
            attachments:config.attachments
        };        

        sendEmail(mailOptions);
    } catch (error) {
        console.log(error)
    }
}

async function enviarCorreoPaseSalidaEquipoPersonal(idFormato, data,pdf) {
    try {
        let config = await configuraCorreo(idFormato, data,pdf);

        var mailOptions = {
            from: config.from,
             to:data.email,
            //to:'adrcoria@gmail.com',
            subject: config.subject,
            html: config.body,
            attachments:config.attachments
        };
        console.log(mailOptions);

        sendEmail(mailOptions);
    } catch (error) {
        console.log(error)
    }
}
async function enviarCorreoResguardo(idFormato, data,pdf) {
    try {
        let config = await configuraCorreo(idFormato, data,pdf);

        var mailOptions = {
            from: config.from,
             to:data.correo,
            cc: config.correoPersona,
            //to:'adrcoria@gmail.com',
            subject: config.subject,
            html: config.body,
            attachments:config.attachments
        };
        sendEmail(mailOptions);
    } catch (error) {
        console.log(error)
    }
}

function getPdfStream (stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
    })
}
function bodyNotificacionReporteRoboRegistro(data) {
    var body =
        `<html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
            </style>
        </head>
        <body>
            <header class="header">
                <img src="https://ci3.googleusercontent.com/mail-sig/AIorK4wYRDGGUt60Oz9EvKa0JoUxWLH7i35yoqt2g2-4kFrjtGsMlJVnBOQhMM_F5LSsSh3nEOWZmIE"/>
            </header>
            <section class="section-text">
                <div>
                    Estimado servidor público. 
                    <br> Le informamos que se ha iniciado un registro de reporte de robo
                    con el folio ${data.folio}  en el Sistema de Administración de Servicios de TIC (SASTIC).
                </div>
                <div>
                    <br>Siniestro ocurrido en la Unidad Responsable: ${data.unidadResponsable}
                    <br><strong>Componente: </strong>${data.componente}
                    <br><strong>Tipo de siniestro: </strong>${data.tipoSiniestro}
                   
                </div>
                <div>En caso de requerir mayor información, favor de ponerse en contacto con la Unidad Responsable en la cual ocurrió el siniestro, ya que esa unidad es la encargada de dar atención y seguimiento.</div>
            </section>
            <section class="section-footer">
                <p>Dirección General de Tecnologías de la Información y Comunicaciones</p>
                <p>Secretaría de Educación Pública</p>
            </section>
            <p>Nota: Este correo electrónico se genera automáticamente y no requiere respuesta.</p>
        </body>
    </html>`
    return body;
}

async function enviarNotificacion( data ) {
    try {
        let from = "no_reply@nube.sep.gob.mx";
        var body = await bodyNotificacionReporteRoboRegistro(data);
        var mailOptions = {
            from: from,
            to: data.correos, 
            subject: "Notificaciones SEP -  Registro de reporte de robo",
            html: body,
        }       
        sendEmail(mailOptions, data);

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    sendEmail,
    configuracionRemitente: configuraCorreo,
    /* cuerpos de correo*/
    bodyRechazo,
    bodyCartaAmableOC,
    bodyCartaAmableOSFAE,
    bodyRechazoAsignacion,
    bodyRespuestaEnlace,
    bodyRespuestaSGIS,
    bodyVoBoRechazo,
    enviarCorreoActualizacionEtapa,
    enviarCorreoPaseSalida,
    enviarCorreoPaseSalidaEquipoPersonal,
    enviarCorreoResguardo
    ,enviarNotificacion
}