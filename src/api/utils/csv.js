
var fs = require('fs');


async function crearCsvLayoutPartidasUR(path_, name_, data_) {
    try {
        var archivo = `${path_}/${name_}.csv`;
        //creación de directorio
        if (!fs.existsSync(path_)) {
            fs.mkdirSync(path_, { recursive: true });
        }

        ///cabecera del archivo
        // var cabecera = '\ufeffidentificador de la UA, Unidad Administrativa,CURP, Nombre, Primer Apellido, Segundo Apellido, Cargo, CorreoElectronico, Telefono, Extension, Inmueble edificio, Direccion, Piso oficina y/o sector,Estado,Asistencia presencial, Partida 3, Partida 5, Partida 7, Partida 13, Partida 14, Partida 17, Partida 18, Partida 20, Partida 21, Partida 22, Partida 23, Partida 24, Partida 26, Partida 27, Partida 28, Partida 29, Partida 30, Partida 31  \n';
        var cabecera = '\ufeffidentificador de la UA, Unidad Administrativa,DGTIC-ID,CURP, Nombre, Primer Apellido, Segundo Apellido, CorreoElectronico, Telefono, Extension, Inmueble edificio, Piso oficina y/o sector, Partida, Cantidad, Estatus Partida, Fecha Registro  \n';
        ///construcción de cabeceras
        if (fs.existsSync(archivo)) {
            fs.unlinkSync(archivo);
        }
        fs.writeFileSync(archivo, cabecera, "utf8");

        ///se crea el string con el layout
        let dataReport = ''
        data_.registros.forEach(element => {
            var cantidad = 0;
            var dataClean = "";
            if (element.item) {
                let dataSplit = element.item.split('|');
                cantidad = dataSplit[13];
                dataSplit[13] = "1";
                dataSplit.forEach(x => {
                    dataClean += x.replace(",", " ") + ",";
                });
                for (i = 1; i <= cantidad; i++) {
                    dataReport += dataClean.substring(0, dataClean.length - 1) + '\n'
                }
            }

            //dataReport += dataClean.substring(0, dataClean.length - 1) + '\n'
        });

        fs.appendFile(archivo, dataReport, "utf8", function (err) {
            if (err) throw err;
            console.log('Archivo partidas UR creado', archivo);
        });

        return true;
    } catch (ex) {
        console.log("error al crear el archivo de partidas ur ", ex);
        throw ex;
    }
}

async function crearLayoutMainbitUsuarios(path_, name_, data_) {
    try {
        var archivo = `${path_}/${name_}.csv`;
        //creación de directorio
        if (!fs.existsSync(path_)) {
            fs.mkdirSync(path_, { recursive: true });
        }

        ///cabecera del archivo
        var cabecera = '\ufeffempresa,inmueble,id_usuario,nombre,u_apellidos,u_middle_name,num_empleado,area_departamento,piso,tel_oficina,extension,email,puesto,perfil,cantidad,estatus_partida\n';

        ///construcción de cabeceras
        if (fs.existsSync(archivo)) {
            fs.unlinkSync(archivo);
        }
        fs.writeFileSync(archivo, cabecera, "utf8");

        ///se crea el string con el layout
        let dataReport = ''
        data_.registros.forEach(element => {
            var cantidad = 0;
            var dataClean = "";
            let dataSplit = element.item.split('|');
            cantidad = dataSplit[14];
            dataSplit[14] = "1";
            dataSplit.forEach(x => {
                dataClean += x.replace(",", " ") + ",";
            });
            for (i = 1; i <= cantidad; i++) {
                dataReport += dataClean.substring(0, dataClean.length - 1) + '\n'
            }

        });

        fs.appendFile(archivo, dataReport, "utf8", function (err) {
            if (err) throw err;
            console.log('Archivo mainbit usuarios creado', archivo);
        });

        return true;
    } catch (ex) {
        console.log("error al crear el archivo de mainbit usuarios ", ex);
        throw ex;
    }
}

async function crearReporteRoboCSV(path_, name_, data_) {
    try {
        var archivo = `${path_}/${name_}.csv`;
        //creación de directorio
        if (!fs.existsSync(path_)) {
            fs.mkdirSync(path_, { recursive: true });
        }

        ///cabecera del archivo        
        var cabecera = '\ufeff' + `${data_.reporte}\n${data_.cabecera}\n`;
        ///construcción de cabeceras
        if (fs.existsSync(archivo)) {
            fs.unlinkSync(archivo);
        }
        fs.writeFileSync(archivo, cabecera, "utf8");

        ///se crea el string con el layout
        let dataReport = ''
       
        data_.registros.forEach(element => {
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
        
        fs.appendFileSync(archivo, dataReport, "utf8", function (err) {
            if (err) throw err; //console.log('Reporte creado correctamente', archivo);
        });

        return true;
    } catch (ex) {
        console.log("error al crear el archivo de reporte robo ", ex);
        throw ex;
    }
}

module.exports = {
    crearCsvLayoutPartidasUR,
    crearLayoutMainbitUsuarios
    ,crearReporteRoboCSV
}