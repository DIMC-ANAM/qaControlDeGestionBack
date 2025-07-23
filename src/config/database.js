var mysql = require('mysql');
const { promisify } = require("util");
const winston = require("./winston");
const enviroment = require("./config");


const config = {
    
    
    timezone: 'utc',  //<-here this line was missing
    host: enviroment.HOST_BD,
    user: enviroment.USER_BD,
    password: enviroment.PASSWORD_BD,
    database: enviroment.DATABASE,
    port: enviroment.PORT_BD,

    multipleStatements: true,
    typeCast: function castField(field, useDefaultTypeCasting) {
        if ((field.type === "BIT") && (field.length === 1)) {
            var bytes = field.buffer();
            return (bytes[0] === 1);
        }
        return (useDefaultTypeCasting());
    }
};
const mysqlPool = mysql.createPool(config);

mysqlPool.query = promisify(mysqlPool.query);

mysqlPool.getConnection((err, connection) => {
    if (err) {
        console.log(err);
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            winston.error("Database connection has lost");
        }else
        if (err.code === "ER_CON_COUNT_ERROR    ") {
            winston.error("Max limit connections error");
        }else
        if (err.code === "ECONNREFUSED") {
            winston.error("Connection refused");
        }else
        if(err.code === "ER_ACCESS_DENIED_ERROR"){
            winston.error("Access denied to database: ",err);
        }
    }
    if (connection) {
        connection.release();
        winston.info("Database connection successful");
    }
});
module.exports = mysqlPool;