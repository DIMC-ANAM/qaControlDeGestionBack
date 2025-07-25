var fs = require('fs');
let path = require('path');

async function reporteCsv(req, res, data) {
    try {
        var uuid = (new Date()).getTime().toString(36);
        var archivo = path.resolve(`src/documentos/`, `${data.reporte}_${uuid}.csv`);
        var cabecera = '\ufeff' + `${data.reporte}\n${data.cabecera}\n`;
        fs.writeFileSync(archivo, cabecera, "utf8");
        ///se crea el string con el reporte
        let dataReport = ''
        if (data.registros) {
            data.registros.forEach(element => {
                Object.getOwnPropertyNames(element).forEach(function (property, idx, array) {
                    if (element[property] == null) {
                        dataReport += '' + ((idx + 1) < Object.getOwnPropertyNames(element).length ? ',' : '')
                    } else if (element[property][10] == "T" && element[property][23] == "Z" && element[property][4] == "-" && element[property][7] == "-") {
                        date = new Date(element[property]);
                        dataReport += date.toLocaleDateString() + ((idx + 1) < Object.getOwnPropertyNames(element).length ? ',' : '')
                    } else {
                        dataReport += String(element[property]).replace(/,/g, '') + ((idx + 1) < Object.getOwnPropertyNames(element).length ? ',' : '')
                    }
                });
                dataReport += '\n'
            });
        }
        fs.appendFileSync(archivo, dataReport, "utf8", function (err) {
            if (err) throw err; //console.log('Reporte creado correctamente', archivo);
        });
        return res.download(archivo, (err) => {
            if (err) { //console.log(err);
            }
            fs.unlink(archivo, (err) => {
                if (err) { //console.log(err);
                } //console.log('Archivo [' + archivo + '] borrado!');
            });
        });
    } catch (ex) { //console.log("error al crear el archivo de conciliación ", ex);
        throw ex;
    }
}

module.exports = {
    reporteCsv
}