var nodemailer = require('nodemailer');
const utils = require("./utils");
const db = require("../../config/database");

var transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    pool: true,
    maxConnections:2,
    secure: false,
    auth: {
        user: '',
        pass: ''
    }
});

function sendEmail(mailOptions) {
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("error send email: ", error)
            return false;
        } else {
            console.log("email send")
            return true;
        }
    });
}

function bodyConfirmEmail(data) {
    var body =
        `<html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body {width: 80%; margin: auto;}
                .header{width: 100%;text-align: left;}
                .header img{width: 40%;}
                .section-text{width: 100%;margin: auto;margin-top: 50px;font-size: 12px; text-align: justify;}
                .section-footer{width: 90%;margin: auto;margin-top: 50px;color: #B38E5D;font-size: 11px; text-align: justify;}
                .name-span{text-decoration: underline; font-weight: 600;margin-left: 5px; margin-right: 5px; text-transform: capitalize;}
                .enlace{text-align: left;}
            </style>
        </head>        
        <body>
            <header class="header">
                <img src="https://picsum.photos/id/237/200/300"/>
            </header>
            <section class="section-text">
                <p>
                    TEXT GOES HERE
                </p>
                <div> AND HERE </div>                                
                <div class="enlace"> <b> <a href="https://YOUR LINK TO VERIFY?${data.hashCode}">  CONFIRM /a>  </b> </div>              
                </section>
            <section class="section-footer">
                
            </section>
        </body>
        </html>`
    return body;
}

function bodyResetPassword(data) {
    var body =
        `<html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body {width: 80%; margin: auto;}
                .header{width: 100%;text-align: left;}
                .header img{width: 40%;}
                .section-text{width: 100%;margin: auto;margin-top: 50px;font-size: 12px; text-align: justify;}
                .section-footer{width: 90%;margin: auto;margin-top: 50px;color: #B38E5D;font-size: 11px; text-align: justify;}
                .name-span{text-decoration: underline; font-weight: 600;margin-left: 5px; margin-right: 5px; text-transform: capitalize;}
                .enlace{text-align: left;}
            </style>
        </head>        
        <body>
            <header class="header">
                <img src="https://picsum.photos/id/237/200/300"/>
            </header>
            <section class="section-text">
                <h2>  Password reset request </h2>
                    <p>
                            TEXT GOES HERE
                    </p>
                    <div> TO CONTINUE CLIC HERE: </div>                                       
                    <div class="enlace"> <b> <a href="https://YOUR LINK TO VERIFY?${data.hashCode}">  Reset password </a>  </b> </div> 
                    <div > <br><b>Warning:</b> TEXT GOES HERE </div>
                    <br>
                    <div> If you didn't ask for password request, please contact to email@example.com </b></div>
            </section>
            <section class="section-footer">
                <p>
                    Your organization 
                </p>
            </section>
        </body>
        </html>`
    return body;
}

/**
 * params:{tipoNotificacion,data}
 * ::::::::::::::::::SENDING EMAIL::::::::::::::::::
 */
 async function sendNotification(typeNotification,data) {
    try {
        let from = transporter.auth.user;
        switch(typeNotification){
            case 1: /*email verifying  */
                var body = await bodyConfirmEmail(data);
                var mailOptions = {
                    from: from,
                    to: data.email,
                    subject: "Confirm your Email",
                    html: body
                };
                sendEmail(mailOptions,data);
            break;
            case 2: /* Password request */
                var body = await bodyResetPassword(data);
                var mailOptions = {
                    from: from,
                    to: data.email,
                    subject: "Password reset",
                    html: body
                };
                sendEmail(mailOptions,data);
            break;
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    sendEmail,
    sendNotification  /* you use this function to send each type of message into the  controller */
}